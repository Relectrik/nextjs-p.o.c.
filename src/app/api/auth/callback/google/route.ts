// app/api/auth/callback/google/route.ts
import { NextRequest, NextResponse } from 'next/server';
import oauth2Client from '@/lib/google';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  
  if (code) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Store tokens in your database or session
    // For simplicity, we'll pass them as a query param (not secure)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/poc_2?access_token=${tokens.access_token}`);
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/error`);
}
