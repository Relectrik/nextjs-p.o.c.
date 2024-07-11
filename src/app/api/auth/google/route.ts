// app/api/auth/google/route.ts
import { NextResponse } from 'next/server'
import oauth2Client from '@/lib/google' // Ensure this is correctly set up

export async function GET () {
  try {
    const scopes = [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
      // Add any other scopes you need
    ]

    const url = oauth2Client.generateAuthUrl({
      access_type: 'online',
      scope: scopes,
    })

    return NextResponse.redirect(url)
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error)
    return new NextResponse(JSON.stringify(error), { status: 400 })
  }
}
