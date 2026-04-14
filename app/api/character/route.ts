import { NextRequest, NextResponse } from 'next/server';
import { generateWithOpenAI } from '@/lib/openai';
import { getLanguageInstruction } from '@/lib/language';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, traits, apiKey, model, temperature, maxTokens, language } = body;

    const generateOptions = { apiKey, model, temperature, maxTokens };
    const langInstruction = getLanguageInstruction(language);

    const systemPrompt = `You are a creative writing assistant specializing in character development for novels. 
Create compelling, multi-dimensional characters with believable personalities, motivations, and appearances. 
Return your response as a JSON object with fields: personality, motivation, appearance.${langInstruction}`;

    const userPrompt = `Create a detailed character profile for a character named "${name || 'Unknown'}".
${traits ? `Character traits/context: ${traits}` : 'Create an interesting original character.'}

Return a JSON object with:
- personality: A detailed description of their personality (2-3 sentences)
- motivation: Their core motivation and goals (2-3 sentences)  
- appearance: Physical description including distinguishing features (2-3 sentences)`;

    const rawResult = await generateWithOpenAI(systemPrompt, userPrompt, generateOptions);

    // Try to parse as JSON, fallback to structured text
    let result;
    try {
      const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = {
          personality: rawResult,
          motivation: '',
          appearance: '',
        };
      }
    } catch {
      result = {
        personality: rawResult,
        motivation: '',
        appearance: '',
      };
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Character API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate character' },
      { status: 500 }
    );
  }
}
