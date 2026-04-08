import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import RankingTable from '../components/RankingTable'
import AdBanner from '../components/AdBanner'

export default function RankingPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const TABS = [
    { id: '', label: t('ranking.all') },
    { id: 'Interior Architecture', label: '🏗️ ' + t('category.Interior Architecture.label') },
    { id: 'IT', label: '💻 ' + t('category.IT.label') },
    { id: 'Consulting', label: '📊 ' + t('category.Consulting.label') },
    { id: 'Translation', label: '🌐 ' + t('category.Translation.label') },
  ]

  const fetchRanking = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const url = tab ? `/api/ranking?category=${encodeURIComponent(tab)}` : '/api/ranking'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to load ranking.')
      setData(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => { fetchRanking() }, [fetchRanking])

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>{t('ranking.title')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>{t('ranking.subtitle')}</p>
        </div>
        <button className="btn btn-ghost" onClick={fetchRanking} title={t('ranking.refresh')}>{t('ranking.refresh')}</button>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {TABS.map(tb => (
          <button key={tb.id}
            className={`btn${tab === tb.id ? ' btn-primary' : ' btn-ghost'}`}
            style={{ padding: '7px 14px', fontSize: '.85rem' }}
            onClick={() => setTab(tb.id)}>
            {tb.label}
          </button>
        ))}
      </div>

      <div className="card">
        <RankingTable data={data} loading={loading} error={error} />
      </div>

      {!loading && !error && data.length > 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '.8rem', textAlign: 'center', marginTop: 14 }}>
          {t('ranking.total', { count: data.length })}
        </p>
      )}

      <AdBanner slot="0987654321" format="auto" style={{ marginTop: 20 }} />
    </div>
  )
}
