import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CATEGORY_CONTEXT = {
  'Interior Architecture': '인테리어 건축 (Interior & Architecture). Prices should be in Korean Won (₩). Include items like design, materials, construction, labor, supervision.',
  'IT': '소프트웨어/시스템 개발 (IT Development). Prices should be in Korean Won (₩). Include items like frontend, backend, database, testing, deployment.',
  'Consulting': '경영/전략 컨설팅 (Management Consulting). Prices should be in Korean Won (₩). Include items like analysis, strategy, workshops, reporting, follow-up.',
  'Translation': '번역 서비스 (Translation Services). Prices should be in Korean Won (₩). Include items like translation, proofreading, localization, review.',
};

export async function generateQuoteAndFeedback(input) {
  const { category, project_description, scope, timeline, requirements, budget } = input;

  const systemPrompt = `You are an expert project estimator specializing in ${CATEGORY_CONTEXT[category]}.
Generate a detailed professional project quote AND evaluate its quality.
Always respond with ONLY a valid JSON object, no markdown, no explanation.`;

  const userPrompt = `Generate a project quote and quality evaluation for this project:

Category: ${category}
Project Description: ${project_description}
Scope: ${scope}
Timeline: ${timeline}
Requirements: ${requirements}
${budget ? `Budget Hint: ${budget}` : ''}

Respond with ONLY this JSON structure (no other text):
{
  "quote": {
    "category": "${category}",
    "summary": "concise 1-2 sentence project summary",
    "total_price": <integer in KRW>,
    "breakdown": [
      {"item": "item name", "price": <integer in KRW>}
    ],
    "timeline": "specific timeline string (e.g. '8 weeks')",
    "risks": ["risk 1", "risk 2", "risk 3"]
  },
  "feedback": {
    "score": <integer 0-100>,
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1"],
    "suggestions": ["suggestion 1", "suggestion 2"]
  }
}

Score calculation (be strict and realistic):
- Price competitiveness (25%): Is pricing competitive and well-justified for the Korean market?
- Scope clarity (25%): How clearly is the project scope defined?
- Timeline realism (20%): Is the proposed timeline achievable?
- Risk coverage (15%): Are potential risks identified and addressed?
- Category fit (15%): Does the quote match ${category} industry standards?

Make the breakdown items sum to total_price. Be specific and professional.`;

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const textBlock = response.content.find(b => b.type === 'text');
  if (!textBlock) throw new Error('No text response from Claude');

  // Extract JSON (handle potential markdown wrapping)
  const text = textBlock.text.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in Claude response');

  return JSON.parse(jsonMatch[0]);
}
