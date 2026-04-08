import { useState, useEffect, useCallback } from 'react'
import RankingTable from '../components/RankingTable'

const TABS = [
  { id: '', label: '전체' },
  { id: 'Interior Architecture', label: '🏗️ 인테리어' },
  { id: 'IT', label: '💻 IT' },
  { id: 'Consulting', label: '📊 컨설팅' },
  { id: 'Translation', label: '🌐 번역' },
]

export default function RankingPage() {
  const [tab, setTab] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchRanking = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const url = tab ? `/api/ranking?category=${encodeURIComponent(tab)}` : '/api/ranking'
      const res = await fetch(url)
      if (!res.ok) throw new Error('랭킹을 불러오는데 실패했습니다.')
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>🏆 견적 랭킹</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>
            AI 견적 품질 점수 기준 정렬 (동점 시 생성 순)
          </p>
        </div>
        <button className="btn btn-ghost" onClick={fetchRanking} title="새로 고침">
          🔄 새로 고침
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`btn${tab === t.id ? ' btn-primary' : ' btn-ghost'}`}
            style={{ padding: '7px 14px', fontSize: '.85rem' }}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        <RankingTable data={data} loading={loading} error={error} />
      </div>

      {!loading && !error && data.length > 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '.8rem', textAlign: 'center', marginTop: 14 }}>
          총 {data.length}개 견적
        </p>
      )}
    </div>
  )
}
