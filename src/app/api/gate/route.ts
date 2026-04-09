import { NextResponse } from 'next/server';

const LAUNCH_PASSWORD = process.env.LAUNCH_PASSWORD || 'tableit2026';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === LAUNCH_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('launch_access', 'granted', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
}
