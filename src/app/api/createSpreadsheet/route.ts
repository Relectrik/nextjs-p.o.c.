import { NextRequest, NextResponse } from 'next/server'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { parse } from 'cookie'
import oauth2Client from '@/lib/google'

export async function POST (req: NextRequest): Promise<NextResponse> {
  const cookies = parse(req.headers.get('cookie') || '')
  const tokens = cookies.googleTokens ? JSON.parse(cookies.googleTokens) : null

  if (!tokens) {
    return new NextResponse(JSON.stringify({ error: 'Missing authentication tokens' }), { status: 401 })
  }

  try {
    // Authenticate and load the spreadsheet
    oauth2Client.setCredentials(tokens)

    // Add a new sheet
    GoogleSpreadsheet.createNewSpreadsheetDocument(oauth2Client, {title: 'Newly created sheet'})
    return new NextResponse(JSON.stringify({ success: 'New spreadsheet added to drive' }), { status: 200 })
  } catch (error) {
    console.error('Error adding new sheet:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to add new sheet' }), { status: 500 })
  }
}
