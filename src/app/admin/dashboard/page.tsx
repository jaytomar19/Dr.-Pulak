import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Admin',
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ marginTop: '1rem', padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
        <p>This dashboard will show a daily ops overview, stats, alerts, and other important metrics.</p>
        <p style={{ marginTop: '0.5rem', color: '#64748b' }}>(Placeholder for Phase 2 implementation)</p>
      </div>
    </div>
  );
}
