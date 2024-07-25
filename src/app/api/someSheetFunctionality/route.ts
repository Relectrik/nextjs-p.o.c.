import { NextRequest, NextResponse } from 'next/server'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { parse } from 'cookie'
import oauth2Client from '@/lib/google'

export async function POST(req: NextRequest): Promise<NextResponse> {
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
    const newSheet = doc.addSheet({ title: 'example usage' })

    await (await newSheet).loadCells()
    await (await newSheet).setHeaderRow(['close', 'open', 'high', 'low', 'volume', 'date'])
    await (await newSheet).addRow({ close: 1, open: 2, high: 3, low: 4, volume: 5, date: new Date() })
    await (await newSheet).addRow({ close: '=A2*2', open: 7, high: 8, low: 9, volume: 10, date: new Date() })
    const rows = await (await newSheet).getRows()
    const row_len = rows.length
    const last_row = await (await newSheet).getRows({ offset: row_len - 1, limit: 1 })
    last_row[0].set('close', 10)
    await last_row[0].save()

    await (await newSheet).saveUpdatedCells()

    return new NextResponse(JSON.stringify({ success: 'New sheet added' }), { status: 200 })
  } catch (error) {
    console.error('Error adding new sheet:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to add new sheet' }), { status: 500 })
  }
}
