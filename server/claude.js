/**
 * OpenRouter API를 사용한 견적 생성 서비스
 *
 * OpenRouter는 OpenAI 호환 API 형식을 사용합니다.
 * 사용 가능한 모델: https://openrouter.ai/models
 *
 * 환경변수 (.env):
 *   OPENROUTER_API_KEY  — OpenRouter API 키 (필수)
 *   OPENROUTER_MODEL    — 사용할 모델 (선택, 기본값 아래 참고)
 */
import OpenAI from 'openai';

// OPENROUTER_API_KEY가 없으면 서버 시작 시 즉시 경고
if (!process.env.OPENROUTER_API_KEY) {
  console.error('❌ OPENROUTER_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.');
}

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173',  // 배포 시 실제 도메인으로 변경
    'X-Title': 'AI Quote Generator',
  },
});

// 기본 모델: anthropic/claude-sonnet-4-5 (성능/비용 균형)
// 변경하려면 .env에 OPENROUTER_MODEL=원하는모델명 추가
const MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4-5';

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

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt   },
    ],
  });

  const text = response.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('AI로부터 응답이 없습니다.');

  // JSON 추출 (마크다운 코드 블록 처리)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI 응답에서 JSON을 찾을 수 없습니다.');

  return JSON.parse(jsonMatch[0]);
}
