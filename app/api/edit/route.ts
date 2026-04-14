import { NextRequest, NextResponse } from 'next/server';
import { generateWithOpenAI } from '@/lib/openai';
import { getLanguageInstruction } from '@/lib/language';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, content, apiKey, model, temperature, maxTokens, language } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const generateOptions = { apiKey, model, temperature, maxTokens };
    const langInstruction = getLanguageInstruction(language);

    if (type === 'rewrite') {
      const systemPrompt = `You are an expert editor and writing coach. Your task is to rewrite and polish text 
while preserving its core meaning and story beats. Improve clarity, flow, word choice, and prose quality. 
Make the writing more vivid and engaging.${langInstruction}`;

      const userPrompt = `Please rewrite and polish the following text, improving its prose quality, flow, 
and vividness while preserving all the core story elements and meaning:

${content}`;

      const result = await generateWithOpenAI(systemPrompt, userPrompt, generateOptions);
      return NextResponse.json({ result });
    }

    if (type === 'expand') {
      const systemPrompt = `You are a creative writing assistant. Your task is to expand and enrich text 
by adding more detail, description, dialogue, and depth. Maintain the author's voice and story direction 
while making the content longer and more immersive.${langInstruction}`;

      const userPrompt = `Please expand the following text by adding more detail, atmosphere, character 
thoughts/feelings, and descriptive language. Make it approximately 1.5-2x longer while maintaining 
the same story direction:

${content}`;

      const result = await generateWithOpenAI(systemPrompt, userPrompt, generateOptions);
      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: 'Invalid type. Use "rewrite" or "expand"' }, { status: 400 });
  } catch (error) {
    console.error('Edit API error:', error);
    return NextResponse.json(
      { error: 'Failed to edit content' },
      { status: 500 }
    );
  }
}
