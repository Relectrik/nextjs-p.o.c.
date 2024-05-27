import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const sheets = google.sheets('v4');

interface SheetsValueResponse {
  data: {
    values: string[][];
  };
}

export async function GET(req: NextRequest) {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const client = await auth.getClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = 'MESO 1!A1:D10';

  try {
    const response = await sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      return NextResponse.json(rows);
    } else {
      return NextResponse.json({ message: 'No data found' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
