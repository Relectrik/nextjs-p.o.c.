import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import oauth2Client from '@/lib/google' // Ensure this is correctly set up
import { parse } from 'cookie'

export async function GET (req: NextRequest): Promise<NextResponse> {
  const cookies = parse(req.headers.get('cookie') || '')
  const tokens = cookies.googleTokens ? JSON.parse(cookies.googleTokens) : null

  if (!tokens) {
    return new NextResponse(JSON.stringify({ error: 'Missing authentication tokens' }), { status: 401 })
  }

  try {
    oauth2Client.setCredentials(tokens)
    const drive = google.drive('v3')
    const response = await drive.files.list({
      auth: oauth2Client,
      q: "mimeType='application/vnd.google-apps.spreadsheet'",
      pageSize: 100, // Adjust pageSize as needed
      fields: 'nextPageToken, files(id, name)', // Specify the fields you need
    })

    return new NextResponse(JSON.stringify(response.data.files), { status: 200 })
  } catch (error) {
    console.error('Error fetching Google Drive files:', error)
    return new NextResponse(JSON.stringify(error), { status: 400 })
  }
}
