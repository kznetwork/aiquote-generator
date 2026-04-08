import { useState } from 'react'
import CategorySelector from '../components/CategorySelector'
import QuoteForm from '../components/QuoteForm'
import QuoteResult from '../components/QuoteResult'
import ImageUploader from '../components/ImageUploader'

const STEPS = ['카테고리 선택', '정보 입력', '결과 확인']

const CAT_NAMES = {
  'Interior Architecture': '인테리어',
  'IT': 'IT 개발',
  'Consulting': '컨설팅',
  'Translation': '번역',
}

function StepBar({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
      {STEPS.map((label, i) => {
        const active = i === step, done = i < step
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '.85rem', transition: 'all .2s',
                background: done ? 'var(--success)' : active ? 'var(--primary)' : 'var(--border)',
                color: done || active ? 'white' : 'var(--text-muted)',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '.72rem', fontWeight: 600, whiteSpace: 'nowrap', color: active ? 'var(--primary)' : done ? 'var(--success)' : 'var(--text-muted)' }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ height: 2, flex: 1, margin: '0 8px', marginBottom: 20, background: done ? 'var(--success)' : 'var(--border)', transition: 'all .2s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// 탭 공통 스타일
function Tab({ active, onClick, icon, label, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1, padding: '14px 16px', border: 'none', cursor: 'pointer',
        borderBottom: `3px solid ${active ? 'var(--primary)' : 'transparent'}`,
        background: active ? 'var(--primary-light)' : 'white',
        transition: 'all .15s', textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '1.3rem', marginBottom: 2 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: '.9rem', color: active ? 'var(--primary)' : 'var(--text-muted)' }}>{label}</div>
      <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>
    </button>
  )
}

export default function GeneratePage({ onViewRanking }) {
  const [step,     setStep]     = useState(0)
  const [mode,     setMode]     = useState('manual')   // 'manual' | 'image'
  const [category, setCategory] = useState('')
  const [prefilled, setPrefilled] = useState({})
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [result,   setResult]   = useState(null)

  // ── 이미지 추출 완료 콜백 ────────────────────────────────────────────────
  const handleImageExtracted = (data) => {
    setError('')
    // 카테고리 자동 설정
    if (data.category) setCategory(data.category)
    setPrefilled(data)
    setStep(1)   // 폼 단계로 이동
  }

  // ── 모드 전환 ────────────────────────────────────────────────────────────
  const switchMode = (m) => {
    setMode(m); setCategory(''); setPrefilled({}); setError('')
    setStep(0)
  }

  // ── 견적 생성 ────────────────────────────────────────────────────────────
  const handleSubmit = async (formData) => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '서버 오류')
      setResult(data)
      setStep(2)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep(0); setCategory(''); setPrefilled({})
    setResult(null); setError(''); setMode('manual')
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Hero */}
      {step < 2 && (
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 6 }}>✨ AI 견적 생성기</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>
            <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 4, padding: '1px 6px', fontSize: '.8rem', fontWeight: 600 }}>🖼 Gemma 4 26B</span>
            &nbsp;이미지 인식 &nbsp;+&nbsp;
            <span style={{ background: '#FFF7ED', color: '#C2410C', borderRadius: 4, padding: '1px 6px', fontSize: '.8rem', fontWeight: 600 }}>📝 Nemotron 120B</span>
            &nbsp;견적 생성
          </p>
        </div>
      )}

      {step < 2 && <StepBar step={step} />}

      {/* ── Step 0 ── */}
      {step === 0 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* 탭 */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            <Tab active={mode === 'manual'} onClick={() => switchMode('manual')}
              icon="⌨️" label="직접 입력" sub="카테고리 선택 후 입력" />
            <Tab active={mode === 'image'} onClick={() => switchMode('image')}
              icon="🖼️" label="이미지로 입력" sub="문서·기획서 이미지 업로드" />
          </div>

          <div className="card-pad">
            {mode === 'manual' ? (
              <>
                <CategorySelector selected={category} onSelect={setCategory} />
                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary btn-lg" disabled={!category} onClick={() => setStep(1)}>
                    다음 단계 →
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 6 }}>프로젝트 이미지 업로드</h3>
                  <p style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>
                    기획서·요구사항 문서·화이트보드 사진을 업로드하면<br />
                    <strong>Gemma 4 26B</strong>가 자동으로 프로젝트 정보를 추출합니다.
                  </p>
                </div>
                <ImageUploader onExtracted={handleImageExtracted} loading={loading} />
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Step 1 ── */}
      {step === 1 && (
        <div className="card card-pad">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '.85rem' }} onClick={() => setStep(0)}>
              ← 뒤로
            </button>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 2 }}>프로젝트 정보 입력</h2>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {category && <span className="badge badge-blue">📂 {CAT_NAMES[category] || category}</span>}
                {mode === 'image' && <span className="badge badge-green">🖼 이미지 자동 추출</span>}
              </div>
            </div>
          </div>

          {error && <div className="error-box" style={{ marginBottom: 16 }}>⚠️ {error}</div>}

          <QuoteForm
            category={category}
            onSubmit={handleSubmit}
            loading={loading}
            prefilled={prefilled}
          />
        </div>
      )}

      {/* ── Step 2 ── */}
      {step === 2 && result && (
        <QuoteResult result={result} onReset={handleReset} onViewRanking={onViewRanking} />
      )}
    </div>
  )
}
