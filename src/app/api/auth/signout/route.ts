import { NextResponse } from 'next/server';

export async function POST() {
  const response = new NextResponse(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  // Supprimer le cookie de session
  response.cookies.set('session', '', {
    path: '/',
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  return response;
}
