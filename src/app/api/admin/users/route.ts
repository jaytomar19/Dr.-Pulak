import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // TODO: Auth check - doctor role only
    // const body = await req.json();
    // TODO: Validate with AdminUserCreateSchema
    // TODO: Hash password with bcryptjs
    // TODO: Create admin user
    return NextResponse.json({ user_id: 'dummy-user-id' }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // TODO: Auth check - doctor role only
    return NextResponse.json({ users: [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
