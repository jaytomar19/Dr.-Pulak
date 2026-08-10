import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Auth check - Admin only
    // TODO: fetch single lead detail including related assessment, bookings, delivery log, consent records
    return NextResponse.json({ lead: {} }, { status: 200 });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    // TODO: Auth check - Admin only
    // const body = await req.json();
    // TODO: Validate with LeadStatusUpdateSchema
    // TODO: update lead (status, notes, assignment)
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // TODO: Auth check - Admin only
    // TODO: soft-delete/archive lead
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
