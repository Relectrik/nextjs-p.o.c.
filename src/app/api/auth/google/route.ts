// app/api/auth/google/route.ts
import { NextResponse } from 'next/server';
import oauth2Client from '../../../../lib/google'; // Ensure this is correctly set up

export async function GET() {
  const scopes = [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    // Add any other scopes you need
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'online',
    scope: scopes,
  });

  return NextResponse.redirect(url);
}
