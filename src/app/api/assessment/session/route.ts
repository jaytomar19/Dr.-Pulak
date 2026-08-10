import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // TODO: Rate limiting check
    
    // const body = await req.json();
    // TODO: Validate body with CreateSessionSchema from @/lib/validators
    
    // TODO: prisma create session
    
    return NextResponse.json({ session_id: 'dummy-session-id' }, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
