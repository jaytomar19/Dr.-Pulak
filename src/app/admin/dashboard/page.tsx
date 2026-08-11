import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard | Admin',
};

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/admin/login');
  }

  // Fetch Real Operational Metrics from Prisma
  const [
    totalLeads,
    newLeads,
    totalSessions,
    completedSessions,
    bandA,
    bandB,
    bandC,
    bandR,
  ] = await Promise.all([
    prisma.leads.count(),
    prisma.leads.count({ where: { lead_status: 'New' } }),
    prisma.assessment_sessions.count(),
    prisma.assessment_sessions.count({ where: { completed_at: { not: null } } }),
    prisma.assessment_sessions.count({ where: { band_result: 'A' } }),
    prisma.assessment_sessions.count({ where: { band_result: 'B' } }),
    prisma.assessment_sessions.count({ where: { band_result: 'C' } }),
    prisma.assessment_sessions.count({ where: { band_result: 'R' } }),
  ]);

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Operational Dashboard</h1>
        <p className="admin-subtitle">Welcome back, {session.user.name || 'Doctor'}. Overview of patient leads, assessment scoring, and practice metrics.</p>
      </div>

      {/* Overview Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__label">Total Leads</div>
          <div className="stat-card__value">{totalLeads}</div>
          <div className="stat-card__hint">Submitted contact captures</div>
        </div>

        <div className="stat-card stat-card--highlight">
          <div className="stat-card__label">New Leads</div>
          <div className="stat-card__value">{newLeads}</div>
          <div className="stat-card__hint">Awaiting initial contact</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__label">Assessment Sessions</div>
          <div className="stat-card__value">{totalSessions}</div>
          <div className="stat-card__hint">{completedSessions} completed assessments</div>
        </div>

        <div className="stat-card stat-card--warning">
          <div className="stat-card__label">Band R (Urgent Alerts)</div>
          <div className="stat-card__value">{bandR}</div>
          <div className="stat-card__hint">Red flag clinical evaluations</div>
        </div>
      </div>

      {/* Band Distribution Section */}
      <div className="dashboard-section" style={{ marginTop: '2rem' }}>
        <h2>Assessment Risk Band Distribution</h2>
        <div className="band-grid">
          <div className="band-card band-card--a">
            <span className="band-badge band-badge--a">Band A</span>
            <div className="band-count">{bandA}</div>
            <div className="band-label">Mild / Low Risk</div>
          </div>
          <div className="band-card band-card--b">
            <span className="band-badge band-badge--b">Band B</span>
            <div className="band-count">{bandB}</div>
            <div className="band-label">Moderate / Progressive</div>
          </div>
          <div className="band-card band-card--c">
            <span className="band-badge band-badge--c">Band C</span>
            <div className="band-count">{bandC}</div>
            <div className="band-label">Severe / High Limitation</div>
          </div>
          <div className="band-card band-card--r">
            <span className="band-badge band-badge--r">Band R</span>
            <div className="band-count">{bandR}</div>
            <div className="band-label">Urgent Evaluation</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions-grid" style={{ marginTop: '2rem' }}>
        <Link href="/admin/leads" className="action-card">
          <h3>Manage Patient Leads →</h3>
          <p>Filter, review consent audit trails, and update lead operational status.</p>
        </Link>
        <Link href="/admin/leads?status=New" className="action-card">
          <h3>Review New Submissions →</h3>
          <p>Access uncontacted patient leads requiring immediate follow-up.</p>
        </Link>
      </div>
    </div>
  );
}
