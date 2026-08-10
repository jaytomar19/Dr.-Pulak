import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // TODO: Verify webhook signature from headers (Cal.com/Calendly)
    // TODO: Update booking + lead status
    // TODO: Exit nurture sequences
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing booking webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
