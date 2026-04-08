import { useState } from 'react'

const CATEGORY_PLACEHOLDERS = {
  'Interior Architecture': {
    project_description: '예: 강남구 소재 카페 인테리어 리모델링 프로젝트',
    scope: '예: 전체 80㎡ 인테리어 공사 (바닥, 벽면, 천장, 조명, 가구)',
    requirements: '예: 모던 미니멀 스타일, 친환경 자재 사용, 영업 중단 최소화',
  },
  'IT': {
    project_description: '예: 소상공인을 위한 예약 관리 웹 플랫폼 개발',
    scope: '예: 프론트엔드(React), 백엔드(Node.js), DB, 관리자 대시보드, API',
    requirements: '예: 모바일 반응형, 결제 연동, 알림 기능, 실시간 예약 현황',
  },
  'Consulting': {
    project_description: '예: 스타트업 시리즈 A 투자 유치를 위한 전략 컨설팅',
    scope: '예: 비즈니스 모델 분석, 시장 조사, 투자 자료(IR) 작성, 투자자 미팅 준비',
    requirements: '예: 3개월 내 투자 유치 목표, 주 1회 미팅, 최종 보고서 제출',
  },
  'Translation': {
    project_description: '예: SaaS 제품 UI/UX 및 마케팅 자료 영→한 번역',
    scope: '예: 웹 앱 UI 텍스트 약 5,000단어, 마케팅 랜딩페이지, 이메일 템플릿',
    requirements: '예: IT 전문 용어 일관성, 현지화 수준의 자연스러운 번역, 용어집 제공',
  },
}

export default function QuoteForm({ category, onSubmit, loading }) {
  const [form, setForm] = useState({
    project_description: '',
    scope: '',
    timeline: '',
    requirements: '',
    budget: '',
  })

  const placeholders = CATEGORY_PLACEHOLDERS[category] || {}

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.project_description || !form.scope || !form.timeline || !form.requirements) return
    onSubmit({ category, ...form })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">
          프로젝트 설명 <span className="req">*</span>
        </label>
        <textarea
          className="form-textarea"
          placeholder={placeholders.project_description}
          value={form.project_description}
          onChange={e => set('project_description', e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          범위 (Scope) <span className="req">*</span>
        </label>
        <textarea
          className="form-textarea"
          placeholder={placeholders.scope}
          value={form.scope}
          onChange={e => set('scope', e.target.value)}
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            일정 (Timeline) <span className="req">*</span>
          </label>
          <input
            className="form-input"
            type="text"
            placeholder="예: 3개월, 12주, 2024년 3월까지"
            value={form.timeline}
            onChange={e => set('timeline', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">예산 (Budget, 선택)</label>
          <input
            className="form-input"
            type="text"
            placeholder="예: 5,000만원 이하"
            value={form.budget}
            onChange={e => set('budget', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          요구사항 (Requirements) <span className="req">*</span>
        </label>
        <textarea
          className="form-textarea"
          placeholder={placeholders.requirements}
          value={form.requirements}
          onChange={e => set('requirements', e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner" style={{ width: 18, height: 18, borderWidth: 3 }} />
            AI 견적 생성 중...
          </>
        ) : (
          <>✨ AI 견적 생성하기</>
        )}
      </button>
    </form>
  )
}
