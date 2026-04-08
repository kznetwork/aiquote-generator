import { useState } from 'react'
import CategorySelector from '../components/CategorySelector'
import QuoteForm from '../components/QuoteForm'
import QuoteResult from '../components/QuoteResult'

const STEPS = ['카테고리 선택', '정보 입력', '결과 확인']

function StepBar({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
      {STEPS.map((label, i) => {
        const active = i === step
        const done = i < step
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '.85rem',
                background: done ? 'var(--success)' : active ? 'var(--primary)' : 'var(--border)',
                color: done || active ? 'white' : 'var(--text-muted)',
                transition: 'all .2s',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: '.72rem', fontWeight: 600, whiteSpace: 'nowrap',
                color: active ? 'var(--primary)' : done ? 'var(--success)' : 'var(--text-muted)',
              }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                height: 2, flex: 1, margin: '0 8px', marginBottom: 20,
                background: done ? 'var(--success)' : 'var(--border)',
                transition: 'all .2s',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function GeneratePage({ onViewRanking }) {
  const [step, setStep] = useState(0)       // 0: category, 1: form, 2: result
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleCategorySelect = (cat) => {
    setCategory(cat)
  }

  const handleCategoryNext = () => {
    if (!category) return
    setStep(1)
  }

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '서버 오류가 발생했습니다.')
      }
      const data = await res.json()
      setResult(data)
      setStep(2)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep(0)
    setCategory('')
    setResult(null)
    setError('')
  }

  return (
    <div>
      {/* Header */}
      {step < 2 && (
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>
            ✨ AI 견적 생성기
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '.95rem' }}>
            프로젝트 정보를 입력하면 AI가 견적과 품질 평가를 즉시 제공합니다
          </p>
        </div>
      )}

      {/* Step bar */}
      {step < 2 && <StepBar step={step} />}

      {/* Step 0: Category */}
      {step === 0 && (
        <div className="card card-pad">
          <CategorySelector selected={category} onSelect={handleCategorySelect} />
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary btn-lg"
              disabled={!category}
              onClick={handleCategoryNext}
            >
              다음 단계 →
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Form */}
      {step === 1 && (
        <div className="card card-pad">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <button
              className="btn btn-ghost"
              style={{ padding: '6px 12px', fontSize: '.85rem' }}
              onClick={() => setStep(0)}
            >
              ← 뒤로
            </button>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>프로젝트 정보 입력</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>
                카테고리: <strong>{category}</strong>
              </p>
            </div>
          </div>
          {error && (
            <div className="error-box" style={{ marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}
          <QuoteForm category={category} onSubmit={handleSubmit} loading={loading} />
        </div>
      )}

      {/* Step 2: Result */}
      {step === 2 && result && (
        <QuoteResult result={result} onReset={handleReset} onViewRanking={onViewRanking} />
      )}
    </div>
  )
}
