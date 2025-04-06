import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    temperature: 0.7,
    stream: true,
    max_tokens: 2000
  });

  // @ts-ignore - Known type issue with OpenAIStream
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
