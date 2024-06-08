import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import oauth2Client from '../../../lib/google';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export async function GET(req: NextRequest) {
  try {
    const { user } = await supabase.auth.api.getUser(req.cookies['sb:token']);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_tokens')
      .select('access_token')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
    }

    oauth2Client.setCredentials({ access_token: data.access_token });

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'MESO 1!A1:E10', // Adjust the range as needed
    });

    const rows = response.data.values;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Error accessing Google Sheets' }, { status: 500 });
  }
}
