import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Vercel Cron hits this endpoint daily to prevent Supabase from pausing
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (production only)
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[keep-alive] DB ping failed:', error);
    return NextResponse.json({ ok: false, error: 'DB ping failed' }, { status: 500 });
  }
}
