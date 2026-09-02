import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { enforceRole } from '@/lib/rbac';
import prisma from '@/lib/db';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin', 'staff']);
    if (roleError) return roleError;

    const { id } = await params;
    const { searchParams } = req.nextUrl;
    const type = searchParams.get('type'); // 'schedule' | 'availability' | 'block'

    if (!id) {
      return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
    }

    if (type === 'schedule') {
      await prisma.doctor_schedules.delete({ where: { schedule_id: id } });
      return NextResponse.json({ success: true, message: 'Schedule deleted' }, { status: 200 });
    }

    if (type === 'availability') {
      await prisma.doctor_availability.delete({ where: { availability_id: id } });
      return NextResponse.json({ success: true, message: 'Date availability deleted' }, { status: 200 });
    }

    if (type === 'block') {
      await prisma.blocked_slots.delete({ where: { block_id: id } });
      return NextResponse.json({ success: true, message: 'Blocked slot deleted' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid type parameter. Expected "schedule", "availability", or "block"' }, { status: 400 });

  } catch (error) {
    console.error('[API] Admin DELETE availability error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
