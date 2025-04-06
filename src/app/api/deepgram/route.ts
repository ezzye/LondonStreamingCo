import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
      key: process.env.DEEPGRAM_API_KEY ?? "",
    });
}

export async function POST(req: Request) {
  return new Response(JSON.stringify({ 
    apiKey: process.env.DEEPGRAM_API_KEY 
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
