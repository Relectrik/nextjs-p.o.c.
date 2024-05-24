import { NextApiRequest, NextApiResponse } from 'next';
import { google, sheets_v4 } from 'googleapis';

const sheets = google.sheets('v4');

// Function to authenticate the Google Sheets API using a service account
async function authenticateSheets(): Promise<google.auth.GoogleAuth> {
  const auth = new google.auth.GoogleAuth({
    keyFile: './key.json', // Path to your service account key file
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return auth;
}

// Function to read data from a spreadsheet
async function readSheet({ spreadsheetId, range }: { spreadsheetId: string; range: string }) {
  const auth = await authenticateSheets();

  const response = await sheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range,
  });

  if (!response.data.values) {
    throw new Error('No data found.');
  }

  return response.data.values;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('Fetching data from Google Sheets');
    const data = await readSheet({
      spreadsheetId: '1fWOF289lDMqhVUs5TgD7QSxlIMJQR0VD5bo0f3VhFzI',
      range: 'Sheet1!A1:C10', // Adjust the range according to your needs
    });
    console.log('Data fetched:', data);
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data from Google Sheets' });
  }
}
