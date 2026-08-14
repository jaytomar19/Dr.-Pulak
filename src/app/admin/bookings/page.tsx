'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/shared/Loader';

interface BookingItem {
  booking_id: string;
  lead_id: string;
  product: string;
  slot_datetime: string;
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_provider_ref: string | null;
  status: 'confirmed' | 'completed' | 'no_show' | 'cancelled' | 'rescheduled';
  created_at: string;
  lead: {
    lead_id: string;
    name: string;
    phone?: string;
    email?: string;
    lead_status: string;
    created_at: string;
  };
  payments?: Array<{
    payment_id: string;
    razorpay_order_id: string;
    razorpay_payment_id: string | null;
    amount_paise: number;
    currency: string;
    status: string;
    created_at: string;
  }>;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function AdminBookingsContent() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Drawer
  const [activeBooking, setActiveBooking] = useState<BookingItem | null>(null);
  const [editStatus, setEditStatus] = useState<string>('confirmed');
  const [editPaymentStatus, setEditPaymentStatus] = useState<string>('pending');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams();
    params.set('page', pagination.page.toString());
    params.set('limit', '10');
    if (selectedStatus !== 'All') params.set('status', selectedStatus);
    if (selectedProduct !== 'All') params.set('product', selectedProduct);

    fetch(`/api/bookings?${params.toString()}`)
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login');
          return null;
        }
        if (!res.ok) throw new Error('Failed to load bookings');
        return res.json();
      })
      .then((data) => {
        if (!ignore && data) {
          setBookings(data.bookings || []);
          setPagination(data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Error');
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [pagination.page, selectedStatus, selectedProduct, router]);

  const fetchBookings = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    params.set('page', pagination.page.toString());
    params.set('limit', '10');
    if (selectedStatus !== 'All') params.set('status', selectedStatus);
    if (selectedProduct !== 'All') params.set('product', selectedProduct);

    fetch(`/api/bookings?${params.toString()}`)
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login');
          return null;
        }
        if (!res.ok) throw new Error('Failed to load bookings');
        return res.json();
      })
      .then((data) => {
        if (data) {
          setBookings(data.bookings || []);
          setPagination(data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
          setError(null);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error'))
      .finally(() => setIsLoading(false));
  };

  const handleOpenDrawer = (b: BookingItem) => {
    setActiveBooking(b);
    setEditStatus(b.status);
    setEditPaymentStatus(b.payment_status);
  };

  const handleSaveBooking = async () => {
    if (!activeBooking) return;
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/bookings/${activeBooking.booking_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          payment_status: editPaymentStatus,
        }),
      });

      if (!res.ok) throw new Error('Failed to update booking status');
      setActiveBooking(null);
      fetchBookings();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setIsUpdating(false);
    }
  };

  const productLabels: Record<string, string> = {
    opd: 'OPD Visit',
    online_live: 'Online Video Consult',
    imaging_review: 'MRI / X-Ray Review',
    second_opinion: 'Second Opinion',
  };

  return (
    <div className="admin-bookings-page">
      <div className="admin-page-header">
        <h1>Consultation Bookings Management</h1>
        <p className="admin-subtitle">Track, reschedule, and verify appointment bookings and payment status.</p>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div className="status-tabs">
          {['All', 'confirmed', 'completed', 'rescheduled', 'cancelled', 'no_show'].map((s) => (
            <button
              key={s}
              className={`status-tab ${selectedStatus === s ? 'active' : ''}`}
              onClick={() => {
                setSelectedStatus(s);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              {s === 'All' ? 'All Statuses' : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <select
          value={selectedProduct}
          onChange={(e) => {
            setSelectedProduct(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          className="status-select"
          style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}
        >
          <option value="All">All Consultation Types</option>
          <option value="opd">OPD Consultation</option>
          <option value="online_live">Online Live Consult</option>
          <option value="imaging_review">Imaging Review</option>
          <option value="second_opinion">Second Opinion</option>
        </select>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {isLoading ? (
        <Loader size="md" color="primary" label="Loading bookings..." center />
      ) : bookings.length === 0 ? (
        <div className="empty-state"><h3>No bookings found</h3><p>No bookings match your current filter.</p></div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Consultation Product</th>
                <th>Appointment Time</th>
                <th>Payment Status</th>
                <th>Booking Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.booking_id}>
                  <td>
                    <strong>{b.lead?.name || 'Patient'}</strong>
                    {b.lead?.phone && (
                      <div style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>
                        📞 {b.lead.phone}
                      </div>
                    )}
                    {b.lead?.email && (
                      <div style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>
                        ✉️ {b.lead.email}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="badge badge--neutral">{productLabels[b.product] || b.product}</span>
                  </td>
                  <td>
                    <strong>{new Date(b.slot_datetime).toLocaleDateString()}</strong> at{' '}
                    <span className="text-muted">{new Date(b.slot_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${b.payment_status === 'paid' ? 'status-badge--converted' : b.payment_status === 'refunded' ? 'status-badge--closed' : 'status-badge--contacted'}`}>
                      {b.payment_status}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${b.status === 'confirmed' ? 'status-badge--interested' : b.status === 'completed' ? 'status-badge--converted' : 'status-badge--closed'}`} style={{ textTransform: 'capitalize' }}>
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{new Date(b.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn--outline btn--sm" onClick={() => handleOpenDrawer(b)}>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="pagination-bar">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
            className="btn btn--ghost btn--sm"
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            className="btn btn--ghost btn--sm"
          >
            Next →
          </button>
        </div>
      )}

      {/* Edit Booking Drawer */}
      {activeBooking && (
        <div className="modal-overlay" onClick={() => setActiveBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', width: '100%', background: 'var(--color-surface)', padding: '2rem', borderRadius: '12px' }}>
            <h2>Update Consultation Booking</h2>
            <p className="admin-subtitle" style={{ margin: '0.25rem 0 1rem 0' }}>
              Patient: <strong>{activeBooking.lead?.name}</strong>
              {activeBooking.lead?.phone && <span> &bull; 📞 {activeBooking.lead.phone}</span>}
              {activeBooking.lead?.email && <span> &bull; ✉️ {activeBooking.lead.email}</span>}
            </p>

            <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Appointment Time</label>
                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                  {new Date(activeBooking.slot_datetime).toLocaleString()}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Booking Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="status-select"
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed (Consultation Finished)</option>
                  <option value="rescheduled">Rescheduled</option>
                  <option value="no_show">No Show</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Payment Status</label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                  className="status-select"
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {activeBooking.payment_provider_ref && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Razorpay Order ID</label>
                  <code>{activeBooking.payment_provider_ref}</code>
                </div>
              )}

              {activeBooking.payments && activeBooking.payments.length > 0 && activeBooking.payments[0].razorpay_payment_id && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Razorpay Payment ID</label>
                  <code>{activeBooking.payments[0].razorpay_payment_id}</code>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn--ghost" onClick={() => setActiveBooking(null)}>
                Cancel
              </button>
              <button className="btn btn--primary" onClick={handleSaveBooking} disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<div className="loading-state"><div className="spinner"></div><p>Loading bookings...</p></div>}>
      <AdminBookingsContent />
    </Suspense>
  );
}
