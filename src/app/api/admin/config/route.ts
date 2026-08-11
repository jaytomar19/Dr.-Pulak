import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { enforceRole } from '@/lib/rbac';
import { PRACTICE_CONFIG } from '@/config/practice';
import { INSTAGRAM_REELS_CONFIG, YOUTUBE_VIDEOS_CONFIG } from '@/config/media';

export async function GET() {
  try {
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin']);
    if (roleError) return roleError;

    return NextResponse.json({
      config: {
        practice: PRACTICE_CONFIG,
        reels: INSTAGRAM_REELS_CONFIG,
        youtube: YOUTUBE_VIDEOS_CONFIG,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
