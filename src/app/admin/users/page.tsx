'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loader from '@/components/shared/Loader';

interface AdminUserItem {
  user_id: string;
  email: string;
  name: string;
  role: 'doctor' | 'admin' | 'staff';
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

function AdminUsersContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'doctor' | 'admin' | 'staff'>('staff');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetch('/api/admin/users')
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login');
          return null;
        }
        if (res.status === 403) {
          setError('Forbidden: Only Doctor and Admin roles can manage users.');
          setIsLoading(false);
          return null;
        }
        if (!res.ok) throw new Error('Failed to load users');
        return res.json();
      })
      .then((data) => {
        if (!ignore && data) {
          setUsers(data.users || []);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Error loading users');
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [router]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/users');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (res.status === 403) {
        setError('Forbidden: Only Doctor and Admin roles can manage users.');
        setIsLoading(false);
        return;
      }
      if (!res.ok) throw new Error('Failed to load users');
      const data = await res.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (user: AdminUserItem) => {
    try {
      const res = await fetch(`/api/admin/users/${user.user_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !user.is_active }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update user status');
      }

      setSuccessMsg(`User ${user.name} ${!user.is_active ? 'activated' : 'deactivated'} successfully.`);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setSuccessMsg(`User ${data.user.name} created successfully.`);
      setShowCreateModal(false);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewRole('staff');
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-users-page">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Staff & User Access Management</h1>
          <p className="admin-subtitle">Manage clinic staff, administrative access, and role assignments.</p>
        </div>
        {session?.user?.role !== 'staff' && (
          <button className="btn btn--primary" onClick={() => setShowCreateModal(true)}>
            + Add Staff / Admin
          </button>
        )}
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}
      {successMsg && <div className="success-banner" style={{ background: '#064e3b', color: '#6ee7b7', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>✓ {successMsg}</div>}

      {isLoading ? (
        <Loader size="md" color="primary" label="Loading users..." center />
      ) : users.length === 0 ? (
        <div className="empty-state"><h3>No users found</h3></div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'doctor' ? 'badge--primary' : u.role === 'admin' ? 'badge--accent' : 'badge--neutral'}`} style={{ textTransform: 'capitalize' }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${u.is_active ? 'status-badge--converted' : 'status-badge--closed'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never'}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    {session?.user?.id !== u.user_id ? (
                      <button
                        className={`btn btn--sm ${u.is_active ? 'btn--outline' : 'btn--primary'}`}
                        onClick={() => handleToggleStatus(u)}
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    ) : (
                      <span className="text-muted">(You)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%', background: 'var(--color-surface)', padding: '2rem', borderRadius: '12px' }}>
            <h2>Add New Staff / Admin Account</h2>
            <form onSubmit={handleCreateUser} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="search-input"
                  style={{ width: '100%' }}
                  placeholder="e.g. Dr. Priya Sharma / Receptionist"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="search-input"
                  style={{ width: '100%' }}
                  placeholder="staff@drpulakvatsya.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Temporary Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="search-input"
                  style={{ width: '100%' }}
                  placeholder="••••••••••••"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'doctor' | 'admin' | 'staff')}
                  className="status-select"
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <option value="staff">Staff (Leads & Bookings operations)</option>
                  <option value="admin">Admin (Full operations & user creation)</option>
                  <option value="doctor">Doctor (Full practice authority)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn--ghost" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="loading-state"><div className="spinner"></div><p>Loading users...</p></div>}>
      <AdminUsersContent />
    </Suspense>
  );
}
