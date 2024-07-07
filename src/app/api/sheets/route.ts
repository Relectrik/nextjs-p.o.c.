import { NextRequest, NextResponse } from 'next/server';
import { google, sheets_v4 } from 'googleapis';
import oauth2Client from '@/lib/google';
import { parse } from 'cookie';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const cookies = parse(req.headers.get('cookie') || '');
  const tokens = cookies.googleTokens ? JSON.parse(cookies.googleTokens) : null;
  const sheetId = req.nextUrl.searchParams.get('sheetId'); // Extract Sheet ID from query parameters

  if (!tokens) {
    return new NextResponse(JSON.stringify({ error: 'Missing authentication tokens' }), { status: 401 });
  }

  if (!sheetId) {
    return new NextResponse(JSON.stringify({ error: 'Missing Google Sheet ID' }), { status: 400 });
  }

  try {
    oauth2Client.setCredentials(tokens);
    const sheets = google.sheets('v4');

    // Get the sheet names
    const sheetInfoResponse = await sheets.spreadsheets.get({
      auth: oauth2Client,
      spreadsheetId: sheetId,
    });

    const sheetNames = sheetInfoResponse.data.sheets?.map(sheet => sheet.properties?.title).filter(Boolean) as string[];

    let allData: { sheetName: string; values: sheets_v4.Schema$ValueRange['values'] }[] = [];

    // Get data from each sheet
    for (const sheetName of sheetNames) {
      const response = await sheets.spreadsheets.values.get({
        auth: oauth2Client,
        spreadsheetId: sheetId,
        range: sheetName, // Use the sheet name to get all rows and columns from the sheet
      });
      allData.push({
        sheetName,
        values: response.data.values,
      });
    }

    return new NextResponse(JSON.stringify(allData), { status: 200 });
  } catch (error: any) {
    console.error('Error fetching Google Sheets data:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
