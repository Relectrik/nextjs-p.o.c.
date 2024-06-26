// app/api/auth/google/callback.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import oauth2Client from '@/lib/google'; // Ensure this is correctly set up
import { serialize } from 'cookie'; // Import cookie serialization

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new NextResponse(JSON.stringify({ error: 'Missing code parameter' }), { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens in a cookie
    const tokenCookie = serialize('googleTokens', JSON.stringify(tokens), {
      httpOnly: true,
      path: '/',
    });

    // Send a message back to the opener window and close the OAuth window
    const script = `
      <script>
        window.opener.postMessage({ status: 'authenticated' }, window.opener.location.origin);
        window.close();
      </script>
    `;

    return new NextResponse(script, {
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': tokenCookie,
      },
    });
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return new NextResponse(JSON.stringify(error), { status: 400 });
  }
}
