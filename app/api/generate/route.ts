import { NextRequest, NextResponse } from 'next/server';
import { generateWithOpenAI } from '@/lib/openai';
import { getLanguageInstruction } from '@/lib/language';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, genre, tone, background, title, hints, previousChapters, apiKey, model, temperature, maxTokens, language } = body;

    const generateOptions = { apiKey, model, temperature, maxTokens };
    const langInstruction = getLanguageInstruction(language);

    if (type === 'world') {
      const systemPrompt = `You are a creative writing assistant specializing in world-building for novels. 
Create rich, detailed, and immersive world settings. Your output should be well-structured with sections 
for World Overview, History & Lore, Social Structure, and unique elements (Magic/Technology/etc.).${langInstruction}`;

      const userPrompt = `Create a detailed world setting for a ${genre} novel with a ${tone} tone.
${background ? `Additional context: ${background}` : ''}

Please provide:
1. World Overview (geography, atmosphere)
2. History & Lore (key historical events)
3. Social Structure (classes, factions, politics)
4. Unique Elements (magic system, technology, special rules of this world)
5. Current State of the World (what's happening now)`;

      const result = await generateWithOpenAI(systemPrompt, userPrompt, generateOptions);
      return NextResponse.json({ result });
    }

    if (type === 'chapter') {
      const systemPrompt = `You are a creative writing assistant specializing in novel writing. 
Write engaging, vivid, and compelling chapter content that maintains consistency with the established 
story world and characters. Use varied sentence structure, rich descriptions, and meaningful dialogue.${langInstruction}`;

      const context = previousChapters && previousChapters.length > 0
        ? `Previous chapter content:\n${previousChapters.slice(-1)[0]?.content ?? ''}\n\n`
        : '';

      const userPrompt = `${context}Write the next chapter of the novel.
Chapter title: ${title || 'Untitled Chapter'}
${hints ? `Story hints/direction: ${hints}` : ''}

Write a compelling chapter of approximately 600-800 words that advances the story naturally.`;

      const result = await generateWithOpenAI(systemPrompt, userPrompt, generateOptions);
      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
