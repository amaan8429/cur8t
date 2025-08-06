import { NextResponse } from 'next/server';
import { db } from '@/db';
import { GitHubSettingsTable, UsersTable } from '@/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId)
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });

    const { searchParams } = new URL(request.url);

    console.log('searchParams', searchParams);
    const code = searchParams.get('code');

    if (!code)
      return NextResponse.json({ error: 'Missing code' }, { status: 400 });

    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );

    console.log('tokenResponse', tokenResponse);

    if (!tokenResponse.ok)
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 500 }
      );

    const { access_token } = await tokenResponse.json();
    if (!access_token)
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 500 }
      );
    await db.insert(GitHubSettingsTable).values({
      githubAccessToken: access_token,
      userId,
    });
    await db
      .update(UsersTable)
      .set({ githubConnected: true })
      .where(eq(UsersTable.id, userId));

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?secondary=Integrations`
    );
  } catch (error) {
    console.error('Error connecting to GitHub:', error);
    return NextResponse.json(
      { error: 'Failed to connect to GitHub' },
      { status: 500 }
    );
  }
}
