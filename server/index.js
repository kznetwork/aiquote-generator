import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { extractProjectFromImage, generateQuoteAndFeedback } from './openrouter.js';
import { saveQuote, getRanking, calculateRanks } from './storage.js';

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));   // base64 이미지 허용

// ─── POST /api/extract-image ────────────────────────────────────────────────
// 이미지(base64) → 프로젝트 정보 JSON  [Gemma 4 26B Vision]
app.post('/api/extract-image', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: '이미지 데이터가 없습니다.' });
    if (!image.startsWith('data:image/')) {
      return res.status(400).json({ error: '유효한 이미지 형식이 아닙니다.' });
    }
    const result = await extractProjectFromImage(image);
    res.json(result);
  } catch (err) {
    console.error('[extract-image]', err.message);
    const isRateLimit = err.message?.includes('rate-limit') || err.status === 429;
    res.status(isRateLimit ? 429 : 500).json({
      error: isRateLimit
        ? '이미지 인식 모델이 일시적으로 사용량 초과 상태입니다. 잠시 후 다시 시도해주세요.'
        : err.message || '이미지 분석에 실패했습니다.',
    });
  }
});

// ─── POST /api/generate-quote ────────────────────────────────────────────────
// 프로젝트 정보 → 견적 + 피드백  [Nemotron 120B Text]
app.post('/api/generate-quote', async (req, res) => {
  try {
    const { category, project_description, scope, timeline, requirements, budget } = req.body;
    if (!category || !project_description || !scope || !timeline || !requirements) {
      return res.status(400).json({ error: '필수 입력값이 부족합니다.' });
    }

    const result = await generateQuoteAndFeedback({
      category, project_description, scope, timeline, requirements, budget,
    });

    const record = {
      id: uuidv4(),
      category,
      input: { category, project_description, scope, timeline, requirements, budget },
      quote: result.quote,
      feedback: result.feedback,
      score: result.feedback.score,
      created_at: new Date().toISOString(),
    };

    saveQuote(record);
    const { rank, category_rank } = calculateRanks(record);

    res.json({
      id: record.id,
      quote: result.quote,
      feedback: result.feedback,
      score: result.feedback.score,
      rank,
      category_rank,
    });
  } catch (err) {
    console.error('[generate-quote]', err.message);
    const isRateLimit = err.message?.includes('rate-limit') || err.status === 429;
    res.status(isRateLimit ? 429 : 500).json({
      error: isRateLimit
        ? '텍스트 생성 모델이 일시적으로 사용량 초과 상태입니다. 잠시 후 다시 시도해주세요.'
        : err.message || '견적 생성에 실패했습니다.',
    });
  }
});

// ─── GET /api/ranking ────────────────────────────────────────────────────────
app.get('/api/ranking', (req, res) => {
  try {
    const ranking = getRanking(req.query.category || null);
    res.json(ranking);
  } catch (err) {
    console.error('[ranking]', err.message);
    res.status(500).json({ error: '랭킹 조회에 실패했습니다.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ API 서버 실행 중: http://localhost:${PORT}`);
  console.log(`   🖼  이미지 모델: gpt-4o (Vision)`);
  console.log(`   📝 텍스트 모델: gpt-4o`);
});
