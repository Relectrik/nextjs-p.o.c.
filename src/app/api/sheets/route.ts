// app/api/sheets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import oauth2Client from '@/lib/google';

export async function GET(req: NextRequest) {
  const accessToken = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!accessToken) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
  }
  

  oauth2Client.setCredentials({ access_token: accessToken });

  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
  try{
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet24!A1:A2', // Adjust the range as needed
    });
  }
  catch (error) {
    return NextResponse.json(error);
  }

  // const rows = response.data.values;
  // return NextResponse.json(rows);
  return NextResponse.json("hi");
}
