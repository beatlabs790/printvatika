import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  
  // Expire the cookie immediately
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return response;
}
