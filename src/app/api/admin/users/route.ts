import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { enforceRole } from '@/lib/rbac';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { AdminUserCreateSchema } from '@/lib/validators';
import { AdminRole } from '@prisma/client';

export async function GET() {
  try {
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin']);
    if (roleError) return roleError;

    const users = await prisma.admin_users.findMany({
      select: {
        user_id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
        last_login_at: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin']);
    if (roleError) return roleError;

    const body = await req.json().catch(() => null);
    const parsed = AdminUserCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid user details', details: parsed.error.format() }, { status: 400 });
    }

    const { email, password, name, role } = parsed.data;

    // Check if user already exists
    const existing = await prisma.admin_users.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { user_id: true },
    });

    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await prisma.admin_users.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        password_hash: passwordHash,
        role: role as AdminRole,
        is_active: true,
      },
      select: {
        user_id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
        created_at: true,
      },
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
