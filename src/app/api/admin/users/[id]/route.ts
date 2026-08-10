import { NextResponse } from 'next/server';

export async function PATCH() {
  try {
    // TODO: Auth check - doctor role only
    // TODO: Update admin user (role, is_active)
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // TODO: Auth check - doctor role only
    // TODO: Deactivate admin user. Cannot delete sole doctor.
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
