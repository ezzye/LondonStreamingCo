import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    time: new Date().toISOString(),
    env: {
      hasRegion: !!process.env.NEXT_PUBLIC_AWS_REGION,
      hasUserPool: !!process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      hasClientId: !!process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      hasDomain: !!process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
    }
  });
}
