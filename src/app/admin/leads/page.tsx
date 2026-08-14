'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Loader from '@/components/shared/Loader';

interface LeadSession {
  session_id: string;
  band_result: string | null;
  flags: unknown;
  started_at: string;
  completed_at: string | null;
}

interface ConsentRecord {
  consent_type: string;
  granted: boolean;
  timestamp: string;
}

interface Lead {
  lead_id: string;
  name: string;
  phone: string;
  email: string;
  is_pii_masked: boolean;
  source: string | null;
  lead_status: string;
  appointment_status: string | null;
  notes: string | null;
  assigned_staff: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
  session: LeadSession | null;
  consent_records: ConsentRecord[];
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const LEAD_STATUSES = [
  'All',
  'New',
  'Contacted',
  'Interested',
  'Booked',
  'Converted',
  'NotInterested',
  'NoResponse',
  'Invalid',
  'Closed',
];

function AdminLeadsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || 'All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedSearch, setAppliedSearch] = useState<string>('');
  const [isDecryptEnabled, setIsDecryptEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active Lead Detail Modal State
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const [updateNotes, setUpdateNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;

    const params = new URLSearchParams();
    params.set('page', pagination.page.toString());
    params.set('limit', '10');
    if (selectedStatus !== 'All') {
      params.set('status', selectedStatus);
    }
    if (appliedSearch.trim()) {
      params.set('search', appliedSearch.trim());
    }
    if (isDecryptEnabled) {
      params.set('decrypt', 'true');
    }

    fetch(`/api/leads?${params.toString()}`)
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login');
          return null;
        }
        if (!res.ok) throw new Error('Failed to load leads');
        return res.json();
      })
      .then((data) => {
        if (!ignore && data) {
          setLeads(data.leads || []);
          setPagination(data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'An error occurred loading leads');
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [pagination.page, selectedStatus, appliedSearch, isDecryptEnabled, router]);

  const handleStatusFilterChange = (status: string) => {
    setSelectedStatus(status);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    setAppliedSearch(searchQuery);
  };

  const handleToggleDecrypt = () => {
    setIsDecryptEnabled((prev) => !prev);
  };

  const handleOpenLead = (lead: Lead) => {
    setActiveLead(lead);
    setUpdateStatus(lead.lead_status);
    setUpdateNotes(lead.notes || '');
  };

  const handleSaveStatus = async () => {
    if (!activeLead) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/leads/${activeLead.lead_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_status: updateStatus,
          notes: updateNotes,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to update lead');
      }

      const data = await response.json();
      
      // Update local state
      setLeads((prev) =>
        prev.map((l) => (l.lead_id === activeLead.lead_id ? { ...l, lead_status: data.lead.lead_status, notes: data.lead.notes } : l))
      );
      setActiveLead((prev) => (prev ? { ...prev, lead_status: data.lead.lead_status, notes: data.lead.notes } : null));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Status update failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-leads-page">
      <div className="admin-page-header">
        <h1>Patient Lead Management</h1>
        <p className="admin-subtitle">Operational review of submitted assessment leads, consent logs, and lead status pipeline.</p>
      </div>

      {/* Filter & Controls Bar */}
      <div className="controls-bar">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search by name or source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn--primary btn--sm">Search</button>
        </form>

        <div className="privacy-toggle">
          <button
            onClick={handleToggleDecrypt}
            className={`btn btn--sm ${isDecryptEnabled ? 'btn--secondary' : 'btn--ghost'}`}
            title="Toggle PII decryption following least-privilege principles"
          >
            {isDecryptEnabled ? '🔓 PII Decrypted' : '🔒 Masked PII'}
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="status-tabs">
        {LEAD_STATUSES.map((status) => (
          <button
            key={status}
            className={`status-tab ${selectedStatus === status ? 'active' : ''}`}
            onClick={() => handleStatusFilterChange(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Error Banner State */}
      {error && (
        <div className="error-banner">
          ⚠️ {error} <button onClick={() => setPagination((prev) => ({ ...prev }))} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Loading Skeleton State */}
      {isLoading ? (
        <Loader size="md" color="primary" label="Loading patient leads from database..." center />
      ) : leads.length === 0 ? (
        /* Empty State */
        <div className="empty-state">
          <h3>No leads found</h3>
          <p>No patient lead submissions match your selected status or search filter.</p>
        </div>
      ) : (
        /* Leads Table */
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Risk Band</th>
                <th>Status</th>
                <th>Source</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.lead_id}>
                  <td><strong>{lead.name}</strong></td>
                  <td><code>{lead.phone}</code></td>
                  <td><code>{lead.email}</code></td>
                  <td>
                    {lead.session?.band_result ? (
                      <span className={`band-badge band-badge--${lead.session.band_result.toLowerCase()}`}>
                        Band {lead.session.band_result}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${lead.lead_status.toLowerCase()}`}>
                      {lead.lead_status}
                    </span>
                  </td>
                  <td>{lead.source || 'Organic'}</td>
                  <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleOpenLead(lead)}
                      className="btn btn--ghost btn--sm"
                    >
                      View / Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Bar */}
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
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total leads)
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

      {/* Lead Operational Detail Drawer/Modal */}
      {activeLead && (
        <div className="lead-modal-overlay" onClick={() => setActiveLead(null)}>
          <div className="lead-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lead-modal-header">
              <h2>Lead Details — {activeLead.name}</h2>
              <button className="close-btn" onClick={() => setActiveLead(null)}>×</button>
            </div>

            <div className="lead-modal-body">
              <div className="modal-section">
                <h3>Contact & Operational Details</h3>
                <div className="detail-grid">
                  <div><strong>Phone:</strong> {activeLead.phone}</div>
                  <div><strong>Email:</strong> {activeLead.email}</div>
                  <div><strong>Source:</strong> {activeLead.source || 'Direct'}</div>
                  <div><strong>Created:</strong> {new Date(activeLead.created_at).toLocaleString()}</div>
                </div>
              </div>

              {/* Assessment Session Info */}
              {activeLead.session && (
                <div className="modal-section">
                  <h3>Assessment Results</h3>
                  <div className="detail-grid">
                    <div>
                      <strong>Risk Band:</strong>{' '}
                      {activeLead.session.band_result ? `Band ${activeLead.session.band_result}` : 'Incomplete'}
                    </div>
                    <div>
                      <strong>Completed:</strong>{' '}
                      {activeLead.session.completed_at ? new Date(activeLead.session.completed_at).toLocaleString() : 'No'}
                    </div>
                  </div>
                </div>
              )}

              {/* Consent Audit Trail */}
              <div className="modal-section">
                <h3>Consent Audit Log (DPDP Compliant)</h3>
                <div className="consent-list">
                  {activeLead.consent_records.map((c, i) => (
                    <div key={i} className="consent-item">
                      <span>{c.consent_type.toUpperCase()} consent:</span>
                      <strong className={c.granted ? 'text-success' : 'text-danger'}>
                        {c.granted ? 'GRANTED ✓' : 'DENIED ✕'}
                      </strong>
                      <span className="text-muted">({new Date(c.timestamp).toLocaleString()})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Notes Update Form */}
              <div className="modal-section form-section">
                <h3>Update Lead Pipeline Status</h3>
                <div className="form-group">
                  <label>Pipeline Status</label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="form-select"
                  >
                    {LEAD_STATUSES.filter((s) => s !== 'All').map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Staff Operational Notes</label>
                  <textarea
                    rows={3}
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                    placeholder="Add clinical or follow-up notes here..."
                    className="form-textarea"
                  />
                </div>

                <div className="modal-actions">
                  <button
                    onClick={handleSaveStatus}
                    disabled={isSaving}
                    className="btn btn--primary"
                  >
                    {isSaving ? 'Saving...' : 'Save Updates'}
                  </button>
                  <button
                    onClick={() => setActiveLead(null)}
                    className="btn btn--ghost"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense fallback={<div className="loading-state"><div className="spinner"></div><p>Loading patient leads...</p></div>}>
      <AdminLeadsContent />
    </Suspense>
  );
}

