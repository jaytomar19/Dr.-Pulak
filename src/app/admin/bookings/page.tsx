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
  medical_documents?: Array<{
    document_id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    notes?: string | null;
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
    opd: 'In-Person OPD Visit (₹1,299)',
    consult_48h: '48-Hour Video Response (₹500)',
    online_live: 'Online Live Video Consult (₹999)',
    second_opinion: 'Surgical Second Opinion (₹799)',
    international: 'International Consult (₹2,199)',
    imaging_review: '48-Hour Video Response (₹500)',
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
          <option value="opd">In-Person OPD Visit (₹1,299)</option>
          <option value="consult_48h">48-Hour Video Response (₹500)</option>
          <option value="online_live">Online Live Video Consult (₹999)</option>
          <option value="second_opinion">Surgical Second Opinion (₹799)</option>
          <option value="international">International Consult (₹2,199)</option>
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
                <tr
                  key={b.booking_id}
                  onClick={() => handleOpenDrawer(b)}
                  style={{ cursor: 'pointer' }}
                >
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
                    {b.medical_documents && b.medical_documents.length > 0 && (
                      <div style={{ marginTop: '6px' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (b.medical_documents && b.medical_documents.length === 1) {
                              window.open(`/api/admin/documents/${b.medical_documents[0].document_id}`, '_blank');
                            } else {
                              handleOpenDrawer(b);
                            }
                          }}
                          className="badge badge--teal"
                          style={{
                            fontSize: '0.775rem',
                            padding: '3px 8px',
                            cursor: 'pointer',
                            border: '1px solid rgba(13, 148, 136, 0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 600,
                          }}
                          title="Click to view medical document"
                        >
                          <span>📎 {b.medical_documents.length} Medical Doc{b.medical_documents.length > 1 ? 's' : ''}</span>
                          <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>↗</span>
                        </button>
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
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button className="btn btn--outline btn--sm" onClick={() => handleOpenDrawer(b)}>
                        View
                      </button>
                      {b.medical_documents && b.medical_documents.length > 0 && (
                        <a
                          href={`/api/admin/documents/${b.medical_documents[0].document_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn--primary btn--sm"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                        >
                          📄 Open Doc ↗
                        </a>
                      )}
                    </div>
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

              {/* Medical Documents Section */}
              {activeBooking.medical_documents && activeBooking.medical_documents.length > 0 && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
                  <label style={{ display: 'block', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
                    📁 Uploaded Medical Documents ({activeBooking.medical_documents.length})
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {activeBooking.medical_documents.map((doc) => (
                      <div key={doc.document_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'var(--color-bg-base)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-navy)' }}>
                            📄 {doc.file_name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            {(doc.file_size / 1024).toFixed(0)} KB &bull; {new Date(doc.created_at).toLocaleDateString()}
                          </div>
                          {doc.notes && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                              &ldquo;{doc.notes}&rdquo;
                            </div>
                          )}
                        </div>
                        <a
                          href={`/api/admin/documents/${doc.document_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn--outline btn--sm"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', textDecoration: 'none' }}
                        >
                          View Report ↗
                        </a>
                      </div>
                    ))}
                  </div>
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
