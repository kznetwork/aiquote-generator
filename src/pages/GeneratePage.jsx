import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CategorySelector from '../components/CategorySelector'
import QuoteForm from '../components/QuoteForm'
import QuoteResult from '../components/QuoteResult'
import ImageUploader from '../components/ImageUploader'

const CAT_KEYS = {
  'Interior Architecture': 'Interior Architecture',
  'IT': 'IT',
  'Consulting': 'Consulting',
  'Translation': 'Translation',
}

function StepBar({ step }) {
  const { t } = useTranslation()
  const STEPS = t('generate.steps', { returnObjects: true })
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
      {STEPS.map((label, i) => {
        const active = i === step, done = i < step
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
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

function Tab({ active, onClick, icon, label, sub }) {
  return (
    <button type="button" onClick={onClick} style={{
      flex: 1, padding: '14px 16px', border: 'none', cursor: 'pointer',
      borderBottom: `3px solid ${active ? 'var(--primary)' : 'transparent'}`,
      background: active ? 'var(--primary-light)' : 'white',
      transition: 'all .15s', textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.3rem', marginBottom: 2 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: '.9rem', color: active ? 'var(--primary)' : 'var(--text-muted)' }}>{label}</div>
      <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>
    </button>
  )
}

export default function GeneratePage({ onViewRanking }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'ko'

  const [step,      setStep]     = useState(0)
  const [mode,      setMode]     = useState('manual')
  const [category,  setCategory] = useState('')
  const [prefilled, setPrefilled] = useState({})
  const [loading,   setLoading]  = useState(false)
  const [error,     setError]    = useState('')
  const [result,    setResult]   = useState(null)

  const handleImageExtracted = (data) => {
    setError('')
    if (data.category) setCategory(data.category)
    setPrefilled(data)
    setStep(1)
  }

  const switchMode = (m) => { setMode(m); setCategory(''); setPrefilled({}); setError(''); setStep(0) }

  const handleSubmit = async (formData) => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `서버 오류 (${res.status})`)
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

  const handleReset = () => { setStep(0); setCategory(''); setPrefilled({}); setResult(null); setError(''); setMode('manual') }

  return (
    <div>
      {step < 2 && (
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 6 }}>{t('generate.title')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>
            <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 4, padding: '1px 6px', fontSize: '.8rem', fontWeight: 600 }}>🖼 GPT-4o Vision</span>
            &nbsp;{t('generate.subtitle')}&nbsp;{t('generate.subtitleAnd')}&nbsp;
            <span style={{ background: '#FFF7ED', color: '#C2410C', borderRadius: 4, padding: '1px 6px', fontSize: '.8rem', fontWeight: 600 }}>📝 GPT-4o</span>
            &nbsp;{t('generate.subtitleGen')}
          </p>
        </div>
      )}

      {step < 2 && <StepBar step={step} />}

      {step === 0 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            <Tab active={mode === 'manual'} onClick={() => switchMode('manual')} icon="⌨️" label={t('generate.tabManual')} sub={t('generate.tabManualSub')} />
            <Tab active={mode === 'image'}  onClick={() => switchMode('image')}  icon="🖼️" label={t('generate.tabImage')}  sub={t('generate.tabImageSub')} />
          </div>
          <div className="card-pad">
            {mode === 'manual' ? (
              <>
                <CategorySelector selected={category} onSelect={setCategory} />
                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary btn-lg" disabled={!category} onClick={() => setStep(1)}>
                    {t('generate.next')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 6 }}>{t('generate.imageUploadTitle')}</h3>
                  <p style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>
                    {t('generate.imageUploadDesc')}<br />
                    <strong>GPT-4o Vision</strong> {t('generate.imageUploadDesc2')}
                  </p>
                </div>
                <ImageUploader onExtracted={handleImageExtracted} loading={loading} />
              </>
            )}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="card card-pad">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '.85rem' }} onClick={() => setStep(0)}>
              {t('generate.back')}
            </button>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 2 }}>{t('generate.formTitle')}</h2>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {category && <span className="badge badge-blue">📂 {t(`category.${CAT_KEYS[category]}.label`, { defaultValue: category })}</span>}
                {mode === 'image' && <span className="badge badge-green">{t('generate.imageAutoTag')}</span>}
              </div>
            </div>
          </div>
          {error && <div className="error-box" style={{ marginBottom: 16 }}>{t('generate.error')} {error}</div>}
          <QuoteForm category={category} onSubmit={handleSubmit} loading={loading} prefilled={prefilled} />
        </div>
      )}

      {step === 2 && result && (
        <QuoteResult result={result} onReset={handleReset} onViewRanking={onViewRanking} />
      )}
    </div>
  )
}
