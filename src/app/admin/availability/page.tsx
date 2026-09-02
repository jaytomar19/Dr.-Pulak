'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/shared/Loader';

interface ScheduleRule {
  schedule_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration: number;
  is_active: boolean;
}

interface DateAvailabilityRule {
  availability_id: string;
  date: string;
  start_time: string;
  end_time: string;
  slot_duration: number;
  is_available: boolean;
}

interface BlockedSlotItem {
  block_id: string;
  title: string | null;
  start_time: string;
  end_time: string;
}

interface DayBookingItem {
  booking_id: string;
  product: string;
  slot_datetime: string;
  status: string;
  payment_status: string;
  lead?: {
    name: string;
    phone: string;
    email: string;
  };
}

interface SlotInfo {
  time: string;
  datetimeISO: string;
  status: 'available' | 'booked' | 'blocked';
  reason?: string;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function AdminAvailabilityContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'blocks' | 'overrides'>('daily');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Data states
  const [schedules, setSchedules] = useState<ScheduleRule[]>([]);
  const [dateAvailabilities, setDateAvailabilities] = useState<DateAvailabilityRule[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlotItem[]>([]);
  const [dayBookings, setDayBookings] = useState<DayBookingItem[]>([]);
  const [dailySlots, setDailySlots] = useState<SlotInfo[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  // 1. Weekly Schedule form
  const [schedDay, setSchedDay] = useState(1); // Monday
  const [schedStart, setSchedStart] = useState('10:00');
  const [schedEnd, setSchedEnd] = useState('13:00');
  const [schedDuration, setSchedDuration] = useState(30);

  // 2. Date Override form
  const [overrideDate, setOverrideDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [overrideStart, setOverrideStart] = useState('10:00');
  const [overrideEnd, setOverrideEnd] = useState('14:00');
  const [overrideDuration, setOverrideDuration] = useState(30);

  // 3. Block form
  const [blockTitle, setBlockTitle] = useState('');
  const [blockStartDate, setBlockStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [blockStartTime, setBlockStartTime] = useState('10:00');
  const [blockEndDate, setBlockEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [blockEndTime, setBlockEndTime] = useState('14:00');

  // Load all admin data and daily slots
  const loadData = useCallback(async (date: string) => {
    try {
      setErrorMsg(null);

      const adminRes = await fetch(`/api/admin/availability?date=${date}`);
      if (adminRes.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!adminRes.ok) throw new Error('Failed to load admin availability');

      const adminData = await adminRes.json();
      setSchedules(adminData.schedules || []);
      setDateAvailabilities(adminData.dateAvailabilities || []);
      setBlockedSlots(adminData.blockedSlots || []);
      setDayBookings(adminData.dayBookings || []);

      const slotsRes = await fetch(`/api/availability?date=${date}`);
      if (slotsRes.ok) {
        const slotsData = await slotsRes.json();
        setDailySlots(slotsData.slots || []);
      }

    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Error loading availability data');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let isSubscribed = true;
    
    const runFetch = async () => {
      try {
        setErrorMsg(null);
        const adminRes = await fetch(`/api/admin/availability?date=${selectedDate}`);
        if (adminRes.status === 401) {
          router.push('/admin/login');
          return;
        }
        if (!adminRes.ok) throw new Error('Failed to load admin availability');

        const adminData = await adminRes.json();
        if (isSubscribed) {
          setSchedules(adminData.schedules || []);
          setDateAvailabilities(adminData.dateAvailabilities || []);
          setBlockedSlots(adminData.blockedSlots || []);
          setDayBookings(adminData.dayBookings || []);
        }

        const slotsRes = await fetch(`/api/availability?date=${selectedDate}`);
        if (slotsRes.ok && isSubscribed) {
          const slotsData = await slotsRes.json();
          setDailySlots(slotsData.slots || []);
        }
      } catch (err: unknown) {
        if (isSubscribed) {
          setErrorMsg((err as Error).message || 'Error loading availability data');
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    runFetch();

    return () => {
      isSubscribed = false;
    };
  }, [selectedDate, router]);


  // Handlers for creating entries
  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'schedule',
          day_of_week: Number(schedDay),
          start_time: schedStart,
          end_time: schedEnd,
          slot_duration: Number(schedDuration),
          is_active: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add weekly working hours');
      }

      setSuccessMsg('Weekly working hours added successfully');
      loadData(selectedDate);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDateOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'availability',
          date: overrideDate,
          start_time: overrideStart,
          end_time: overrideEnd,
          slot_duration: Number(overrideDuration),
          is_available: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add date availability');
      }

      setSuccessMsg('Specific date availability added successfully');
      loadData(selectedDate);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const startISO = new Date(`${blockStartDate}T${blockStartTime}:00+05:30`).toISOString();
      const endISO = new Date(`${blockEndDate}T${blockEndTime}:00+05:30`).toISOString();

      if (new Date(endISO) <= new Date(startISO)) {
        throw new Error('End time must be strictly after start time');
      }

      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'block',
          title: blockTitle.trim() || 'Doctor Unavailable / Blocked',
          start_time: startISO,
          end_time: endISO,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to block time period');
      }

      setSuccessMsg('Time period blocked successfully');
      setBlockTitle('');
      loadData(selectedDate);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string, type: 'schedule' | 'availability' | 'block') => {
    if (!confirm('Are you sure you want to remove this availability/block rule?')) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/availability/${id}?type=${type}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete item');
      setSuccessMsg('Item deleted successfully');
      loadData(selectedDate);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Delete failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-availability-page" style={{ paddingBottom: '3rem' }}>
      <div className="admin-page-header">
        <h1>Doctor Availability & Slot Management</h1>
        <p className="admin-subtitle">
          Configure Dr. Pulak Vatsya&apos;s working hours, block time for surgeries or holidays, and view real-time patient booking slots.
        </p>
      </div>

      {errorMsg && (
        <div style={{ padding: '0.875rem 1.25rem', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 600 }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ padding: '0.875rem 1.25rem', background: '#DCFCE7', border: '1px solid #86EFAC', color: '#166534', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 600 }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="filters-bar" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
        <button
          className={`status-tab ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
          style={{ fontSize: '0.95rem', fontWeight: 600 }}
        >
          📅 Daily Slot Inspector
        </button>
        <button
          className={`status-tab ${activeTab === 'weekly' ? 'active' : ''}`}
          onClick={() => setActiveTab('weekly')}
          style={{ fontSize: '0.95rem', fontWeight: 600 }}
        >
          ⏰ Weekly Working Hours ({schedules.length})
        </button>
        <button
          className={`status-tab ${activeTab === 'blocks' ? 'active' : ''}`}
          onClick={() => setActiveTab('blocks')}
          style={{ fontSize: '0.95rem', fontWeight: 600 }}
        >
          🚫 Blocked Time & Holidays ({blockedSlots.length})
        </button>
        <button
          className={`status-tab ${activeTab === 'overrides' ? 'active' : ''}`}
          onClick={() => setActiveTab('overrides')}
          style={{ fontSize: '0.95rem', fontWeight: 600 }}
        >
          🎯 Date-Specific Slots ({dateAvailabilities.length})
        </button>
      </div>

      {isLoading ? (
        <Loader size="md" color="primary" label="Loading availability data..." center />
      ) : (
        <div>
          {/* TAB 1: DAILY SLOT INSPECTOR */}
          {activeTab === 'daily' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'var(--color-bg-surface)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
                    Select Date to Inspect Schedule
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '1rem', background: 'var(--color-bg-base)', color: 'var(--color-navy)' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22C55E' }}></span>
                    Available ({dailySlots.filter((s) => s.status === 'available').length})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: '#991B1B' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></span>
                    Booked ({dailySlots.filter((s) => s.status === 'booked').length})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: '#92400E' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></span>
                    Blocked ({dailySlots.filter((s) => s.status === 'blocked').length})
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                  Generated Consultation Slots for {selectedDate} ({DAY_NAMES[new Date(`${selectedDate}T00:00:00`).getDay()]})
                </h3>
              </div>

              {dailySlots.length === 0 ? (
                <div className="empty-state" style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: '16px', border: '1px dashed var(--color-border)' }}>
                  <h3>No Available Slots for this Date</h3>
                  <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                    No working hours or date overrides are configured for this day. Switch to &ldquo;Weekly Working Hours&rdquo; or &ldquo;Date-Specific Slots&rdquo; tab to open appointment slots for Dr. Pulak.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                  {dailySlots.map((slot) => (
                    <div
                      key={slot.time}
                      style={{
                        padding: '1rem',
                        borderRadius: '14px',
                        border: slot.status === 'available'
                          ? '1px solid #86EFAC'
                          : slot.status === 'booked'
                          ? '1px solid #FCA5A5'
                          : '1px solid #FDE68A',
                        background: slot.status === 'available'
                          ? '#F0FDF4'
                          : slot.status === 'booked'
                          ? '#FEF2F2'
                          : '#FFFBEB',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',

                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                          {slot.time} IST
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '20px',
                            textTransform: 'uppercase',
                            background: slot.status === 'available' ? '#DCFCE7' : slot.status === 'booked' ? '#FEE2E2' : '#FEF3C7',
                            color: slot.status === 'available' ? '#166534' : slot.status === 'booked' ? '#991B1B' : '#92400E',
                          }}
                        >
                          {slot.status}
                        </span>
                      </div>

                      {slot.reason && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                          ℹ️ {slot.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Bookings for the day */}
              {dayBookings.length > 0 && (
                <div style={{ marginTop: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>
                    Confirmed Bookings on {selectedDate} ({dayBookings.length})
                  </h3>
                  <div className="table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Slot Time</th>
                          <th>Patient</th>
                          <th>Contact</th>
                          <th>Consultation Product</th>
                          <th>Booking Status</th>
                          <th>Payment Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayBookings.map((b) => (
                          <tr key={b.booking_id}>
                            <td><strong>{new Date(b.slot_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></td>
                            <td><strong>{b.lead?.name || 'Patient'}</strong></td>
                            <td>{b.lead?.phone || 'N/A'}</td>
                            <td><span className="badge badge--neutral">{b.product}</span></td>
                            <td><span className="status-badge status-badge--interested">{b.status}</span></td>
                            <td><span className="status-badge status-badge--converted">{b.payment_status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WEEKLY WORKING HOURS */}
          {activeTab === 'weekly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>
                  Configured Weekly Working Hours
                </h3>
                {schedules.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2.5rem', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: '16px', border: '1px dashed var(--color-border)' }}>
                    <h4>No Weekly Schedules Configured</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      Add recurring working hours on the right form (e.g., Monday 10:00–13:00, 30 min slots).
                    </p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Day of Week</th>
                          <th>Start Time</th>
                          <th>End Time</th>
                          <th>Slot Duration</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedules.map((s) => (
                          <tr key={s.schedule_id}>
                            <td><strong>{DAY_NAMES[s.day_of_week]}</strong></td>
                            <td>{s.start_time}</td>
                            <td>{s.end_time}</td>
                            <td>{s.slot_duration} minutes</td>
                            <td>
                              <button
                                onClick={() => handleDeleteItem(s.schedule_id, 'schedule')}
                                className="btn btn--outline btn--sm"
                                style={{ color: '#EF4444', borderColor: '#FCA5A5' }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Add Weekly Schedule Form */}
              <div style={{ background: 'var(--color-bg-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', height: 'fit-content' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>+ Add Weekly Working Hours</h3>
                <form onSubmit={handleAddSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Day of Week</label>
                    <select
                      value={schedDay}
                      onChange={(e) => setSchedDay(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--color-border)' }}
                    >
                      {DAY_NAMES.map((name, idx) => (
                        <option key={name} value={idx}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Start Time</label>
                      <input
                        type="time"
                        value={schedStart}
                        onChange={(e) => setSchedStart(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--color-border)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>End Time</label>
                      <input
                        type="time"
                        value={schedEnd}
                        onChange={(e) => setSchedEnd(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--color-border)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Slot Interval (Minutes)</label>
                    <select
                      value={schedDuration}
                      onChange={(e) => setSchedDuration(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--color-border)' }}
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes</option>
                      <option value={60}>60 Minutes</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn--pill-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  >
                    Save Weekly Schedule
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: BLOCKED TIME & HOLIDAYS */}
          {activeTab === 'blocks' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>
                  Blocked Dates & Unavailable Time Periods
                </h3>
                {blockedSlots.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2.5rem', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: '16px', border: '1px dashed var(--color-border)' }}>
                    <h4>No Time Periods Blocked</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      Add blocked slots for surgeries, personal leave, or clinic holidays using the form on the right.
                    </p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Title / Reason</th>
                          <th>Start Date & Time</th>
                          <th>End Date & Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blockedSlots.map((b) => (
                          <tr key={b.block_id}>
                            <td><strong>{b.title || 'Blocked by Doctor'}</strong></td>
                            <td>{new Date(b.start_time).toLocaleString()}</td>
                            <td>{new Date(b.end_time).toLocaleString()}</td>
                            <td>
                              <button
                                onClick={() => handleDeleteItem(b.block_id, 'block')}
                                className="btn btn--outline btn--sm"
                                style={{ color: '#EF4444', borderColor: '#FCA5A5' }}
                              >
                                Delete Block
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Add Block Form */}
              <div style={{ background: 'var(--color-bg-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', height: 'fit-content' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>+ Block Date / Time Period</h3>
                <form onSubmit={handleAddBlock} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Reason / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Surgery / Personal Holiday"
                      value={blockTitle}
                      onChange={(e) => setBlockTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--color-border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Block Start Date & Time</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input
                        type="date"
                        value={blockStartDate}
                        onChange={(e) => setBlockStartDate(e.target.value)}
                        required
                        style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                      />
                      <input
                        type="time"
                        value={blockStartTime}
                        onChange={(e) => setBlockStartTime(e.target.value)}
                        required
                        style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Block End Date & Time</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input
                        type="date"
                        value={blockEndDate}
                        onChange={(e) => setBlockEndDate(e.target.value)}
                        required
                        style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                      />
                      <input
                        type="time"
                        value={blockEndTime}
                        onChange={(e) => setBlockEndTime(e.target.value)}
                        required
                        style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn--pill-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  >
                    Save Blocked Period
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: DATE-SPECIFIC OVERRIDES */}
          {activeTab === 'overrides' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>
                  Custom Date Availability Overrides
                </h3>
                {dateAvailabilities.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2.5rem', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: '16px', border: '1px dashed var(--color-border)' }}>
                    <h4>No Date Overrides Configured</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      Add specific date availability rules to open custom slots for particular dates outside weekly schedule.
                    </p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Target Date</th>
                          <th>Start Time</th>
                          <th>End Time</th>
                          <th>Slot Duration</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dateAvailabilities.map((d) => (
                          <tr key={d.availability_id}>
                            <td><strong>{new Date(d.date).toLocaleDateString()}</strong></td>
                            <td>{d.start_time}</td>
                            <td>{d.end_time}</td>
                            <td>{d.slot_duration} minutes</td>
                            <td>
                              <button
                                onClick={() => handleDeleteItem(d.availability_id, 'availability')}
                                className="btn btn--outline btn--sm"
                                style={{ color: '#EF4444', borderColor: '#FCA5A5' }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Add Date Override Form */}
              <div style={{ background: 'var(--color-bg-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', height: 'fit-content' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>+ Add Custom Date Availability</h3>
                <form onSubmit={handleAddDateOverride} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Select Date</label>
                    <input
                      type="date"
                      value={overrideDate}
                      onChange={(e) => setOverrideDate(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--color-border)' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Start Time</label>
                      <input
                        type="time"
                        value={overrideStart}
                        onChange={(e) => setOverrideStart(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--color-border)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>End Time</label>
                      <input
                        type="time"
                        value={overrideEnd}
                        onChange={(e) => setOverrideEnd(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--color-border)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Slot Interval (Minutes)</label>
                    <select
                      value={overrideDuration}
                      onChange={(e) => setOverrideDuration(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--color-border)' }}
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes</option>
                      <option value={60}>60 Minutes</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn--pill-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  >
                    Save Custom Date Slot
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminAvailabilityPage() {
  return (
    <Suspense fallback={<div className="loading-state"><div className="spinner"></div><p>Loading availability panel...</p></div>}>
      <AdminAvailabilityContent />
    </Suspense>
  );
}
