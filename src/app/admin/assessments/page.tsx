'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/shared/Loader';

interface AssessmentSessionItem {
  session_id: string;
  started_at: string;
  completed_at: string | null;
  campaign_source: string | null;
  band_result: string | null;
  flags: unknown;
  lead: {
    lead_id: string;
    name: string;
    lead_status: string;
    created_at: string;
  } | null;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function AdminAssessmentsContent() {
  const router = useRouter();
  const [sessions, setSessions] = useState<AssessmentSessionItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [selectedBand, setSelectedBand] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const params = new URLSearchParams();
    params.set('page', pagination.page.toString());
    params.set('limit', '10');
    if (selectedBand !== 'All') {
      params.set('band', selectedBand);
    }

    fetch(`/api/admin/assessments?${params.toString()}`)
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login');
          return null;
        }
        if (!res.ok) throw new Error('Failed to load assessment sessions');
        return res.json();
      })
      .then((data) => {
        if (!ignore && data) {
          setSessions(data.sessions || []);
          setPagination(data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [pagination.page, selectedBand, router]);

  return (
    <div className="admin-assessments-page">
      <div className="admin-page-header">
        <h1>Assessment Sessions Audit</h1>
        <p className="admin-subtitle">Operational log of initialized patient knee health assessment sessions and risk band scores.</p>
      </div>

      {/* Band Filter Bar */}
      <div className="status-tabs">
        {['All', 'A', 'B', 'C', 'R'].map((band) => (
          <button
            key={band}
            className={`status-tab ${selectedBand === band ? 'active' : ''}`}
            onClick={() => {
              setSelectedBand(band);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            {band === 'All' ? 'All Bands' : `Band ${band}`}
          </button>
        ))}
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <Loader size="md" color="primary" label="Loading assessment sessions..." center />
      ) : sessions.length === 0 ? (
        <div className="empty-state">
          <h3>No sessions found</h3>
          <p>No assessment sessions match your selected filter.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Started</th>
                <th>Completed</th>
                <th>Risk Band</th>
                <th>Lead Link</th>
                <th>Campaign Source</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((sess) => (
                <tr key={sess.session_id}>
                  <td><code>{sess.session_id.substring(0, 8)}...</code></td>
                  <td>{new Date(sess.started_at).toLocaleString()}</td>
                  <td>
                    {sess.completed_at ? (
                      <span className="text-success">{new Date(sess.completed_at).toLocaleTimeString()}</span>
                    ) : (
                      <span className="text-muted">In Progress</span>
                    )}
                  </td>
                  <td>
                    {sess.band_result ? (
                      <span className={`band-badge band-badge--${sess.band_result.toLowerCase()}`}>
                        Band {sess.band_result}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    {sess.lead ? (
                      <strong>{sess.lead.name}</strong>
                    ) : (
                      <span className="text-muted">No Lead</span>
                    )}
                  </td>
                  <td>{sess.campaign_source || 'Organic'}</td>
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
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total sessions)
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
    </div>
  );
}

export default function AdminAssessmentsPage() {
  return (
    <Suspense fallback={<div className="loading-state"><div className="spinner"></div><p>Loading sessions...</p></div>}>
      <AdminAssessmentsContent />
    </Suspense>
  );
}
