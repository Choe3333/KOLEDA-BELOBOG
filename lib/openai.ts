import OpenAI from 'openai';

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
};

export async function generateWithOpenAI(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const client = getOpenAIClient();

  if (!client) {
    return getDemoContent(userPrompt);
  }

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1500,
      temperature: 0.8,
    });

    return response.choices[0]?.message?.content ?? 'No content generated.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return getDemoContent(userPrompt);
  }
}

function getDemoContent(prompt: string): string {
  if (prompt.toLowerCase().includes('world') || prompt.toLowerCase().includes('setting')) {
    return `[Demo Mode - Add OPENAI_API_KEY to enable AI generation]

**World Overview**
A richly detailed world filled with ancient mysteries and vibrant cultures. The landscape varies from towering mountain ranges to vast, shimmering seas, with hidden pockets of civilization nestled in between.

**History & Lore**
Centuries ago, a great cataclysm reshaped the land and scattered its peoples. Since then, various factions have risen and fallen, each leaving their mark on the world's complex tapestry of history.

**Social Structure**
Society is divided into distinct classes, from the ruling elite who control ancient knowledge to the common folk who carry the old traditions. Tensions simmer beneath the surface as change looms on the horizon.

**Magic / Technology**
Unique forces govern this world — whether mystical energies, advanced technology, or a blend of both. Only a select few understand how to wield these powers.`;
  }

  if (prompt.toLowerCase().includes('character')) {
    return `[Demo Mode - Add OPENAI_API_KEY to enable AI generation]

**Personality:** A complex individual with layers of determination and vulnerability. Quick-witted and resourceful, they often rely on intellect over brute force, though they're not afraid to take risks when necessary.

**Motivation:** Driven by a deep-seated desire to uncover the truth about their past and protect those they care about. They believe justice is worth fighting for, even at great personal cost.

**Appearance:** Striking features that hint at a mixed heritage. Their eyes hold a quiet intensity that makes people both trust and fear them. They dress practically, favoring function over fashion.`;
  }

  if (prompt.toLowerCase().includes('chapter')) {
    return `[Demo Mode - Add OPENAI_API_KEY to enable AI generation]

The morning arrived with a thin mist that clung to the cobblestones like a whispered secret. Our protagonist moved through the winding streets with purpose, their mind racing through the events of the previous days.

"We don't have much time," said the figure in the doorway, voice barely above a murmur.

The protagonist stopped, hand resting on the cool iron of the gate. After a long moment, they nodded. "Then let's not waste it."

The journey that followed would take them further from safety than they'd ever ventured — and closer to the truth that had eluded them for so long. Each step forward meant leaving another piece of their old life behind.

As the city walls faded into the distance, they couldn't help but wonder: was the truth worth the price they'd inevitably have to pay?`;
  }

  return `[Demo Mode - Add OPENAI_API_KEY to enable AI generation]

This is a placeholder response. Please add your OpenAI API key to the .env.local file to enable real AI generation.`;
}
