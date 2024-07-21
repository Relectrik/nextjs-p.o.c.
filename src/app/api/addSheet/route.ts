import { NextRequest, NextResponse } from 'next/server'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { parse } from 'cookie'
import oauth2Client from '@/lib/google'

export async function POST (req: NextRequest): Promise<NextResponse> {
  const cookies = parse(req.headers.get('cookie') || '')
  const tokens = cookies.googleTokens ? JSON.parse(cookies.googleTokens) : null
  const sheetId = req.nextUrl.searchParams.get('sheetId') // Extract Sheet ID from query parameters

  if (!tokens) {
    return new NextResponse(JSON.stringify({ error: 'Missing authentication tokens' }), { status: 401 })
  }

  if (!sheetId) {
    return new NextResponse(JSON.stringify({ error: 'Missing Google Sheet ID' }), { status: 400 })
  }

  try {
    // Authenticate and load the spreadsheet
    oauth2Client.setCredentials(tokens)
    const doc = new GoogleSpreadsheet(sheetId, oauth2Client)

    // Add a new sheet
    const newSheet = doc.addSheet({ title: 'New Sheet' })
    
    await ((await newSheet).loadCells('A1:B2'))
    const cellA1 = (await newSheet).getCell(0, 0);
    cellA1.value = "Hello World!";
    await (await newSheet).saveUpdatedCells();

    return new NextResponse(JSON.stringify({ success: 'New sheet added' }), { status: 200 })
  } catch (error) {
    console.error('Error adding new sheet:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to add new sheet' }), { status: 500 })
  }
}
