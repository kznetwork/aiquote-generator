import { useTranslation } from 'react-i18next'

const CATEGORIES = [
  { id: 'Interior Architecture', icon: '🏗️', color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'IT',                    icon: '💻', color: '#2563EB', bg: '#EFF6FF' },
  { id: 'Consulting',            icon: '📊', color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'Translation',           icon: '🌐', color: '#059669', bg: '#ECFDF5' },
]

export default function CategorySelector({ selected, onSelect }) {
  const { t } = useTranslation()
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{t('category.title')}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginBottom: 20 }}>{t('category.subtitle')}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            style={{
              padding: '20px', borderRadius: 'var(--radius)',
              border: `2px solid ${selected === cat.id ? cat.color : 'var(--border)'}`,
              background: selected === cat.id ? cat.bg : 'white',
              cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
              boxShadow: selected === cat.id ? `0 0 0 3px ${cat.color}22` : 'var(--shadow)',
              transform: selected === cat.id ? 'translateY(-2px)' : 'none',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{cat.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '.95rem', color: selected === cat.id ? cat.color : 'var(--text)', marginBottom: 4 }}>
              {t(`category.${cat.id}.label`)}
            </div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>
              {t(`category.${cat.id}.desc`)}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
