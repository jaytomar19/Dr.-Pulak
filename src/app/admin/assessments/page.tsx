'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/shared/Loader';
import questionsConfig from '@/config/questions.config.json';

interface AssessmentSessionItem {
  session_id: string;
  started_at: string;
  completed_at: string | null;
  campaign_source: string | null;
  band_result: string | null;
  total_score: number | null;
  answers: Record<string, { value: string; points: number; flags?: string[] } | string> | null;
  flags: unknown;
  lead: {
    lead_id: string;
    name: string;
    phone: string;
    email: string;
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
  const [selectedSession, setSelectedSession] = useState<AssessmentSessionItem | null>(null);

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

  // Helper to format option answer details for a given question
  const getAnswerDetail = (session: AssessmentSessionItem, qId: string) => {
    if (!session.answers) return null;
    const rawAnswer = session.answers[qId];
    if (!rawAnswer) return null;

    const val = typeof rawAnswer === 'string' ? rawAnswer : rawAnswer.value;
    const points = typeof rawAnswer === 'object' && typeof rawAnswer.points === 'number' ? rawAnswer.points : null;

    const qDef = questionsConfig.questions.find((q) => q.id === qId);
    if (!qDef) return { label: val, points: points ?? 0 };

    const optDef = qDef.options.find((o) => o.value === val);
    return {
      label: optDef ? optDef.label : val,
      points: points ?? optDef?.points ?? 0,
      flags: optDef?.flags || [],
    };
  };

  return (
    <div className="admin-assessments-page">
      <div className="admin-page-header">
        <h1>Knee Assessment Quiz Audits</h1>
        <p className="admin-subtitle">Comprehensive operational log of patient knee health quizzes, decrypted contact info, score, and individual responses.</p>
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
            {band === 'All' ? 'All Bands' : band === 'R' ? '🚨 Band R (Red Flag)' : `Band ${band}`}
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
                <th>Patient Details</th>
                <th>Phone & Email</th>
                <th>Score</th>
                <th>Risk Band</th>
                <th>Date / Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((sess) => (
                <tr key={sess.session_id}>
                  <td>
                    {sess.lead ? (
                      <div>
                        <strong style={{ fontSize: '0.95rem', display: 'block' }}>{sess.lead.name}</strong>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Source: {sess.campaign_source || 'Organic'}</span>
                      </div>
                    ) : (
                      <span className="text-muted">Anonymous Lead</span>
                    )}
                  </td>
                  <td>
                    {sess.lead ? (
                      <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                        <div>📞 <a href={`tel:${sess.lead.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{sess.lead.phone}</a></div>
                        {sess.lead.email && <div className="text-muted" style={{ fontSize: '0.75rem' }}>✉️ {sess.lead.email}</div>}
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    {sess.total_score !== null && sess.total_score !== undefined ? (
                      <strong style={{ color: 'var(--color-primary, #0284c7)', fontSize: '0.95rem' }}>
                        {sess.total_score} / 90 pts
                      </strong>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    {sess.band_result ? (
                      <span className={`band-badge band-badge--${sess.band_result.toLowerCase()}`} style={{ fontWeight: 600 }}>
                        {sess.band_result === 'R' ? '🚨 Band R (Urgent)' : `Band ${sess.band_result}`}
                      </span>
                    ) : (
                      <span className="text-muted">In Progress</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', lineHeight: '1.3' }}>
                      <div>{new Date(sess.started_at).toLocaleDateString()}</div>
                      <div className="text-muted">{new Date(sess.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn--secondary btn--sm"
                      onClick={() => setSelectedSession(sess)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                    >
                      <span>View Answers</span>
                      <span>↗</span>
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

      {/* Slide-out Quiz Response Audit Drawer */}
      {selectedSession && (
        <div className="drawer-overlay" onClick={() => setSelectedSession(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '650px', backgroundColor: '#ffffff', height: '100%', overflowY: 'auto', padding: '1.5rem', boxShadow: '-4px 0 24px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Quiz Response Audit</h2>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.8rem' }}>Session ID: {selectedSession.session_id}</p>
              </div>
              <button type="button" onClick={() => setSelectedSession(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>×</button>
            </div>

            {/* Patient Header Card */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#0f172a' }}>Patient Contact Details</h3>
              {selectedSession.lead ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div><strong>Name:</strong> {selectedSession.lead.name}</div>
                  <div><strong>Phone:</strong> <a href={`tel:${selectedSession.lead.phone}`} style={{ color: '#0284c7' }}>{selectedSession.lead.phone}</a></div>
                  <div><strong>Email:</strong> {selectedSession.lead.email || '—'}</div>
                  <div><strong>Started:</strong> {new Date(selectedSession.started_at).toLocaleString()}</div>
                </div>
              ) : (
                <p className="text-muted" style={{ margin: 0 }}>Anonymous lead (Contact step not completed)</p>
              )}
            </div>

            {/* Score & Band Card */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', borderRadius: '10px', background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#0369a1', fontWeight: 600 }}>Total Quiz Score</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0284c7', marginTop: '0.25rem' }}>
                  {selectedSession.total_score !== null ? `${selectedSession.total_score} / 90` : 'Incomplete'}
                </div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '10px', background: selectedSession.band_result === 'R' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${selectedSession.band_result === 'R' ? '#fecaca' : '#bbf7d0'}` }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: selectedSession.band_result === 'R' ? '#991b1b' : '#15803d', fontWeight: 600 }}>Risk Band</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: selectedSession.band_result === 'R' ? '#dc2626' : '#16a34a', marginTop: '0.25rem' }}>
                  {selectedSession.band_result ? (selectedSession.band_result === 'R' ? '🚨 Band R (Urgent)' : `Band ${selectedSession.band_result}`) : 'Pending'}
                </div>
              </div>
            </div>

            {/* Detailed 9 Questions Responses */}
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: '#0f172a' }}>Question-by-Question Responses</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {questionsConfig.questions.map((q) => {
                const answerDetail = getAnswerDetail(selectedSession, q.id);
                return (
                  <div key={q.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.875rem 1rem', background: answerDetail ? '#ffffff' : '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.375rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>Question {q.order}</span>
                      {answerDetail && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: answerDetail.points > 5 ? '#fef3c7' : '#f1f5f9', color: answerDetail.points > 5 ? '#92400e' : '#475569' }}>
                          +{answerDetail.points} pts
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>{q.prompt}</div>

                    {answerDetail ? (
                      <div style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem', background: '#f8fafc', borderLeft: '3px solid #0284c7', borderRadius: '0 6px 6px 0', color: '#334155' }}>
                        👉 {answerDetail.label}
                        {answerDetail.flags && answerDetail.flags.length > 0 && (
                          <div style={{ marginTop: '0.25rem', color: '#dc2626', fontWeight: 600, fontSize: '0.75rem' }}>
                            ⚠️ Flag: {answerDetail.flags.join(', ')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>Not answered</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', textAlign: 'right' }}>
              <button type="button" className="btn btn--secondary btn--md" onClick={() => setSelectedSession(null)}>Close Audit</button>
            </div>
          </div>
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
