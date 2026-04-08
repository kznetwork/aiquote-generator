// GET /api/ranking — Cloudflare Pages에서는 KV 스토리지 없이 빈 랭킹 반환

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestGet() {
  // Cloudflare Pages에서는 파일 기반 저장소 사용 불가
  // KV 바인딩이 없으면 빈 배열 반환
  return Response.json([], { headers: corsHeaders });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
