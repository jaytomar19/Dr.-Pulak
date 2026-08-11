import { Session } from 'next-auth';
import { NextResponse } from 'next/server';

export type AllowedRole = 'doctor' | 'admin' | 'staff';

export function isRoleAllowed(session: Session | null, allowedRoles: AllowedRole[]): boolean {
  if (!session?.user?.role) return false;
  return allowedRoles.includes(session.user.role as AllowedRole);
}

export function enforceRole(session: Session | null, allowedRoles: AllowedRole[]): NextResponse | null {
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isRoleAllowed(session, allowedRoles)) {
    return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 });
  }

  return null;
}
