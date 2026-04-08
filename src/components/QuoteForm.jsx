import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function QuoteForm({ category, onSubmit, loading, prefilled = {} }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    project_description: '', scope: '', timeline: '', requirements: '', budget: '',
  })
  const [fromImage, setFromImage] = useState(false)

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

  const ph = t(`form.placeholders.${category}`, { returnObjects: true }) ||
             t('form.placeholders.IT', { returnObjects: true })
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
          <span><strong>{t('form.autoExtracted')}</strong></span>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">{t('form.description')} <span className="req">*</span></label>
        <textarea className="form-textarea" placeholder={ph.description}
          value={form.project_description} onChange={e => set('project_description', e.target.value)} required />
      </div>

      <div className="form-group">
        <label className="form-label">{t('form.scope')} <span className="req">*</span></label>
        <textarea className="form-textarea" placeholder={ph.scope}
          value={form.scope} onChange={e => set('scope', e.target.value)} required />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">{t('form.timeline')} <span className="req">*</span></label>
          <input className="form-input" placeholder={t('form.timelinePlaceholder')}
            value={form.timeline} onChange={e => set('timeline', e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">{t('form.budget')}</label>
          <input className="form-input" placeholder={t('form.budgetPlaceholder')}
            value={form.budget} onChange={e => set('budget', e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t('form.requirements')} <span className="req">*</span></label>
        <textarea className="form-textarea" placeholder={ph.requirements}
          value={form.requirements} onChange={e => set('requirements', e.target.value)} required />
      </div>

      <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
        {loading
          ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 3 }} /> {t('form.submitting')}</>
          : t('form.submit')
        }
      </button>
    </form>
  )
}
