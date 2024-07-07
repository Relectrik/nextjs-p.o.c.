import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'cookie'

export async function GET (req: NextRequest): Promise<NextResponse> {
  const cookies = parse(req.headers.get('cookie') || '')
  const tokens = cookies.googleTokens ? JSON.parse(cookies.googleTokens) : null

  if (!tokens) {
    return new NextResponse(JSON.stringify({ error: 'Missing authentication tokens' }), { status: 401 })
  } else {
    return new NextResponse(JSON.stringify({ message: 'Auth cookie found' }), { status: 200 })
  }
}
