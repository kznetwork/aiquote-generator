// POST /api/generate-quote — GPT-4o로 견적 + 피드백 생성

const CATEGORY_CONTEXT = {
  'Interior Architecture': '인테리어 건축 (Interior & Architecture). 원화(₩) 기준. 항목: 설계, 자재, 시공, 인건비, 감리.',
  'IT':                    '소프트웨어/시스템 개발 (IT Development). 원화(₩) 기준. 항목: 프론트엔드, 백엔드, DB, 테스트, 배포.',
  'Consulting':            '경영/전략 컨설팅 (Management Consulting). 원화(₩) 기준. 항목: 분석, 전략, 워크숍, 보고서.',
  'Translation':           '번역 서비스 (Translation Services). 원화(₩) 기준. 항목: 번역, 교정, 현지화, 검수.',
};

function extractJson(text) {
  const clean = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('응답에서 JSON을 찾을 수 없습니다.');
  return JSON.parse(match[0]);
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { category, project_description, scope, timeline, requirements, budget, lang } = await request.json();
    const isEn = lang === 'en';

    if (!category || !project_description || !scope || !timeline || !requirements) {
      return Response.json({ error: '필수 입력값이 부족합니다.' }, { status: 400, headers: corsHeaders });
    }

    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500, headers: corsHeaders });
    }

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

Respond with ONLY this JSON (all numbers are integers, prices in KRW ₩, text in ${isEn ? 'English' : 'Korean'}):
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
- score must be an integer between 0 and 100: price(25%) + scope(25%) + timeline(20%) + risk(15%) + fit(15%)
- Use realistic Korean market pricing`;

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 2048,
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt   },
        ],
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      const isRateLimit = resp.status === 429;
      return Response.json(
        { error: isRateLimit ? '잠시 후 다시 시도해주세요. (요청 한도 초과)' : (err.error?.message || '견적 생성에 실패했습니다.') },
        { status: resp.status, headers: corsHeaders }
      );
    }

    const body = await resp.json();
    const text = body.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('모델 응답이 없습니다.');

    const result = extractJson(text);

    // 점수 스케일 정규화 (0-10 → 0-100)
    if (result.feedback?.score != null && result.feedback.score <= 10) {
      result.feedback.score = Math.round(result.feedback.score * 10);
    }
    result.feedback.score = Math.max(0, Math.min(100, result.feedback.score));

    return Response.json({
      quote: result.quote,
      feedback: result.feedback,
      score: result.feedback.score,
    }, { headers: corsHeaders });

  } catch (err) {
    console.error('[generate-quote]', err.message);
    return Response.json({ error: err.message || '견적 생성에 실패했습니다.' }, { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
