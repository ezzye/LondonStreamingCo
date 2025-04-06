import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 2000,
    messages,
    stream: true,
    system: "You are a helpful AI assistant."
  });

  // @ts-ignore - Known type issue with AnthropicStream
  const stream = AnthropicStream(response);
  return new StreamingTextResponse(stream);
}
