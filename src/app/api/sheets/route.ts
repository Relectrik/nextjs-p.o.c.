// app/api/sheets.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import oauth2Client from '@/lib/google';
import { parse } from 'cookie';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const cookies = parse(req.headers.get('cookie') || '');
  const tokens = cookies.googleTokens ? JSON.parse(cookies.googleTokens) : null;

  if (!tokens) {
    return new NextResponse(JSON.stringify({ error: 'Missing authentication tokens' }), { status: 401 });
  }

  try {
    oauth2Client.setCredentials(tokens);
    const sheets = google.sheets('v4');
    const response = await sheets.spreadsheets.values.get({
      auth: oauth2Client,
      spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID as string,
      range: 'MESO 1!D1:D10',
    });

    return new NextResponse(JSON.stringify(response.data.values), { status: 200 });
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return new NextResponse(JSON.stringify(error), { status: 400 });
  }
}
