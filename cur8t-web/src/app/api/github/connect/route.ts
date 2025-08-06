import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/github/callback`;

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&redirect_uri=${redirectUri}`;
  return NextResponse.redirect(githubAuthUrl);
}
