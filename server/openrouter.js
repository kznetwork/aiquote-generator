/**
 * OpenRouter 이중 모델 서비스
 *
 * 이미지 인식: google/gemma-4-26b-a4b-it:free  (Vision — 1순위)
 *             nvidia/nemotron-nano-12b-v2-vl:free (Vision — rate-limit 폴백)
 * 텍스트 생성: nvidia/nemotron-3-super-120b-a12b:free
 */
import OpenAI from 'openai';

// ─── 모델 설정 ────────────────────────────────────────────────────────────────
const VISION_MODELS = [
  'google/gemma-4-26b-a4b-it:free',          // 1순위
  'nvidia/nemotron-nano-12b-v2-vl:free',      // 폴백
];
const TEXT_MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';

// ─── 클라이언트 ───────────────────────────────────────────────────────────────
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'AI Quote Generator',
  },
});

// ─── 카테고리 컨텍스트 ────────────────────────────────────────────────────────
const CATEGORY_CONTEXT = {
  'Interior Architecture': '인테리어 건축 (Interior & Architecture). 원화(₩) 기준. 항목: 설계, 자재, 시공, 인건비, 감리.',
  'IT':                    '소프트웨어/시스템 개발 (IT Development). 원화(₩) 기준. 항목: 프론트엔드, 백엔드, DB, 테스트, 배포.',
  'Consulting':            '경영/전략 컨설팅 (Management Consulting). 원화(₩) 기준. 항목: 분석, 전략, 워크숍, 보고서.',
  'Translation':           '번역 서비스 (Translation Services). 원화(₩) 기준. 항목: 번역, 교정, 현지화, 검수.',
};

const CATEGORIES = Object.keys(CATEGORY_CONTEXT);

// ─── 헬퍼: JSON 추출 ─────────────────────────────────────────────────────────
function extractJson(text) {
  const clean = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('응답에서 JSON을 찾을 수 없습니다:\n' + text.slice(0, 300));
  return JSON.parse(match[0]);
}

// ─── 헬퍼: rate-limit 재시도 ─────────────────────────────────────────────────
function isRateLimit(err) {
  return err?.status === 429 || err?.message?.includes('rate-limit');
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── 1. 이미지 → 프로젝트 정보 추출 (Gemma 4 26B → Nemotron VL 폴백) ─────────
export async function extractProjectFromImage(base64DataUrl) {
  const prompt = `이 이미지에서 프로젝트 견적에 필요한 정보를 추출해주세요.
가능한 카테고리: ${CATEGORIES.join(', ')}

반드시 아래 JSON만 반환하세요 (다른 텍스트 없이):
{
  "category": "<카테고리 중 하나>",
  "project_description": "<프로젝트 설명>",
  "scope": "<작업 범위>",
  "timeline": "<일정, 없으면 '미정'>",
  "requirements": "<요구사항>",
  "confidence": <0-100>
}`;

  for (let i = 0; i < VISION_MODELS.length; i++) {
    const model = VISION_MODELS[i];
    try {
      const response = await client.chat.completions.create({
        model,
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: base64DataUrl } },
            { type: 'text', text: prompt },
          ],
        }],
      });
      const text = response.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error('빈 응답');
      console.log(`[vision] 모델: ${model}`);
      return extractJson(text);
    } catch (err) {
      if (isRateLimit(err) && i < VISION_MODELS.length - 1) {
        console.warn(`[vision] ${model} rate-limited → 3초 후 폴백 모델 시도`);
        await sleep(3000);
        continue;
      }
      throw err;
    }
  }
}

// ─── 2. 프로젝트 정보 → 견적 + 피드백 (Nemotron 120B) ───────────────────────
export async function generateQuoteAndFeedback(input) {
  const { category, project_description, scope, timeline, requirements, budget } = input;
  const ctx = CATEGORY_CONTEXT[category] || category;

  const systemPrompt = `You are a professional project estimator specializing in ${ctx}.
Generate a detailed project quote and quality evaluation.
Respond with ONLY a valid JSON object. No markdown, no explanation.`;

  const userPrompt = `Create a project quote for:
Category: ${category}
Description: ${project_description}
Scope: ${scope}
Timeline: ${timeline}
Requirements: ${requirements}
${budget ? `Budget reference: ${budget}` : ''}

Respond with ONLY this JSON (all numbers are integers, prices in KRW ₩, text in Korean):
{
  "quote": {
    "category": "${category}",
    "summary": "한국어로 1-2문장 요약",
    "total_price": 0,
    "breakdown": [
      {"item": "항목명", "price": 0}
    ],
    "timeline": "구체적인 기간",
    "risks": ["리스크1", "리스크2", "리스크3"]
  },
  "feedback": {
    "score": 0,
    "strengths": ["강점1", "강점2"],
    "weaknesses": ["약점1"],
    "suggestions": ["개선제안1", "개선제안2"]
  }
}

IMPORTANT:
- breakdown prices must sum exactly to total_price
- score must be an integer between 0 and 100 (NOT 0-10): price(25%) + scope(25%) + timeline(20%) + risk(15%) + fit(15%)
- Use realistic Korean market pricing`;

  const response = await client.chat.completions.create({
    model: TEXT_MODEL,
    max_tokens: 4096,
    temperature: 0.3,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt   },
    ],
  });

  const text = response.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('견적 생성 모델 응답이 없습니다.');

  console.log(`[text] 모델: ${TEXT_MODEL} | in:${response.usage?.prompt_tokens} out:${response.usage?.completion_tokens} (reasoning:${response.usage?.completion_tokens_details?.reasoning_tokens ?? '?'})`);

  const result = extractJson(text);

  // 점수 스케일 정규화 (모델이 0-10으로 반환하는 경우 → 0-100으로 변환)
  if (result.feedback?.score != null && result.feedback.score <= 10) {
    result.feedback.score = Math.round(result.feedback.score * 10);
  }
  result.feedback.score = Math.max(0, Math.min(100, result.feedback.score));

  return result;
}
