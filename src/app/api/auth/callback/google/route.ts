import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import oauth2Client from '@/lib/google';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL, process.env.SUPABASE_SERVICE_KEY);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (code) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get the user ID from Supabase session
    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (user) {
      await supabase
        .from('user_tokens')
        .upsert({ user_id: user.id, access_token: tokens.access_token });
      const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/dashboard`);
      return response;
    }
  }
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/error`);
}
