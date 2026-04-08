import { useState, useEffect } from 'react'

const PLACEHOLDERS = {
  'Interior Architecture': {
    project_description: '예: 강남구 소재 카페 인테리어 리모델링 프로젝트',
    scope: '예: 전체 80㎡ 공사 (바닥, 벽면, 천장, 조명, 가구)',
    requirements: '예: 모던 미니멀 스타일, 친환경 자재, 영업 중단 최소화',
  },
  'IT': {
    project_description: '예: 소상공인을 위한 예약 관리 웹 플랫폼 개발',
    scope: '예: 프론트엔드(React), 백엔드(Node.js), DB, 관리자 대시보드',
    requirements: '예: 모바일 반응형, 결제 연동, 알림 기능',
  },
  'Consulting': {
    project_description: '예: 스타트업 시리즈 A 투자 유치 전략 컨설팅',
    scope: '예: 비즈니스 모델 분석, 시장 조사, IR 자료 작성',
    requirements: '예: 3개월 내 투자 유치 목표, 주 1회 미팅',
  },
  'Translation': {
    project_description: '예: SaaS 제품 UI/UX 및 마케팅 자료 영→한 번역',
    scope: '예: 웹 앱 UI 텍스트 약 5,000단어, 랜딩페이지, 이메일 템플릿',
    requirements: '예: IT 전문 용어 일관성, 현지화 수준 번역, 용어집 제공',
  },
}

// prefilled: 이미지 추출 결과로 채워진 초기값
export default function QuoteForm({ category, onSubmit, loading, prefilled = {} }) {
  const [form, setForm] = useState({
    project_description: '',
    scope: '',
    timeline: '',
    requirements: '',
    budget: '',
  })
  const [fromImage, setFromImage] = useState(false)

  // 이미지 추출 결과가 오면 폼 채우기
  useEffect(() => {
    if (prefilled && Object.keys(prefilled).length > 0) {
      setForm(prev => ({
        project_description: prefilled.project_description || prev.project_description,
        scope:               prefilled.scope               || prev.scope,
        timeline:            prefilled.timeline             || prev.timeline,
        requirements:        prefilled.requirements         || prev.requirements,
        budget:              prefilled.budget               || prev.budget || '',
      }))
      setFromImage(true)
    }
  }, [prefilled])

  const ph = PLACEHOLDERS[category] || PLACEHOLDERS['IT']
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.project_description || !form.scope || !form.timeline || !form.requirements) return
    onSubmit({ category, ...form })
  }

  return (
    <form onSubmit={handleSubmit}>
      {fromImage && (
        <div style={{
          background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)',
          border: '1px solid #BBF7D0', borderRadius: 'var(--radius-sm)',
          padding: '10px 14px', marginBottom: 20, fontSize: '.85rem',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>✨</span>
          <span><strong>이미지에서 자동 추출</strong>된 정보입니다. 내용을 확인하고 필요하면 수정해주세요.</span>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">프로젝트 설명 <span className="req">*</span></label>
        <textarea
          className="form-textarea"
          placeholder={ph.project_description}
          value={form.project_description}
          onChange={e => set('project_description', e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">범위 (Scope) <span className="req">*</span></label>
        <textarea
          className="form-textarea"
          placeholder={ph.scope}
          value={form.scope}
          onChange={e => set('scope', e.target.value)}
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">일정 (Timeline) <span className="req">*</span></label>
          <input
            className="form-input"
            placeholder="예: 3개월, 12주"
            value={form.timeline}
            onChange={e => set('timeline', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">예산 (선택)</label>
          <input
            className="form-input"
            placeholder="예: 5,000만원 이하"
            value={form.budget}
            onChange={e => set('budget', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">요구사항 (Requirements) <span className="req">*</span></label>
        <textarea
          className="form-textarea"
          placeholder={ph.requirements}
          value={form.requirements}
          onChange={e => set('requirements', e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
        {loading ? (
          <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 3 }} /> Nemotron 120B 견적 생성 중...</>
        ) : (
          <>✨ AI 견적 생성하기</>
        )}
      </button>
    </form>
  )
}
