import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { enforceRole } from '@/lib/rbac';
import prisma from '@/lib/db';
import { AdminUserUpdateSchema } from '@/lib/validators';
import { AdminRole } from '@prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin']);
    if (roleError) return roleError;

    const { id } = await params;

    const user = await prisma.admin_users.findUnique({
      where: { user_id: id },
      select: {
        user_id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
        last_login_at: true,
        created_at: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin']);
    if (roleError) return roleError;

    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = AdminUserUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid update payload', details: parsed.error.format() }, { status: 400 });
    }

    const existingUser = await prisma.admin_users.findUnique({
      where: { user_id: id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Safety rule: Cannot deactivate own account
    if (parsed.data.is_active === false && session?.user?.id === id) {
      return NextResponse.json({ error: 'Cannot deactivate your own user account' }, { status: 400 });
    }

    const updatedUser = await prisma.admin_users.update({
      where: { user_id: id },
      data: {
        ...(parsed.data.name && { name: parsed.data.name.trim() }),
        ...(parsed.data.role && { role: parsed.data.role as AdminRole }),
        ...(parsed.data.is_active !== undefined && { is_active: parsed.data.is_active }),
      },
      select: {
        user_id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
        updated_at: true,
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin']);
    if (roleError) return roleError;

    const { id } = await params;

    // Safety rule: Cannot delete/deactivate self
    if (session?.user?.id === id) {
      return NextResponse.json({ error: 'Cannot deactivate your own user account' }, { status: 400 });
    }

    await prisma.admin_users.update({
      where: { user_id: id },
      data: { is_active: false },
    });

    return NextResponse.json({ success: true, message: 'User deactivated' }, { status: 200 });
  } catch (error) {
    console.error('Error deactivating admin user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
