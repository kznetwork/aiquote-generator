// POST /api/extract-image — GPT-4o Vision으로 이미지에서 프로젝트 정보 추출

const CATEGORIES = ['Interior Architecture', 'IT', 'Consulting', 'Translation'];

const PROMPT = `이 이미지에서 프로젝트 견적에 필요한 정보를 추출해주세요.
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

function extractJson(text) {
  const clean = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('응답에서 JSON을 찾을 수 없습니다.');
  return JSON.parse(match[0]);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const { image } = await request.json();

    if (!image) {
      return Response.json({ error: '이미지 데이터가 없습니다.' }, { status: 400, headers: corsHeaders });
    }
    if (!image.startsWith('data:image/')) {
      return Response.json({ error: '유효한 이미지 형식이 아닙니다.' }, { status: 400, headers: corsHeaders });
    }

    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500, headers: corsHeaders });
    }

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: image } },
            { type: 'text', text: PROMPT },
          ],
        }],
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      const isRateLimit = resp.status === 429;
      return Response.json(
        { error: isRateLimit ? '잠시 후 다시 시도해주세요. (요청 한도 초과)' : (err.error?.message || '이미지 분석에 실패했습니다.') },
        { status: resp.status, headers: corsHeaders }
      );
    }

    const body = await resp.json();
    const text = body.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('모델 응답이 없습니다.');

    const result = extractJson(text);
    return Response.json(result, { headers: corsHeaders });

  } catch (err) {
    console.error('[extract-image]', err.message);
    return Response.json({ error: err.message || '이미지 분석에 실패했습니다.' }, { status: 500, headers: corsHeaders });
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
