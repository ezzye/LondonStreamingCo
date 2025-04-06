import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastMessage = messages[messages.length - 1].content;

  const prompt = `You are a professional songwriter. Create song lyrics based on the following request. Make sure to:
  1. Analyze any referenced songs for their style, structure, and themes
  2. Create original lyrics that capture the requested theme while being inspired by the referenced song's style
  3. Format the output with clear verse/chorus structure
  4. Include suggested chord progressions (optional)

  Request: ${lastMessage}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    stream: true,
    max_tokens: 2000
  });

  // @ts-ignore - Known type issue with OpenAIStream
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
} 