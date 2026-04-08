import { useTranslation } from 'react-i18next'

function formatPrice(n) {
  return '₩' + Number(n).toLocaleString('ko-KR')
}

function ScoreBadge({ score }) {
  const { t } = useTranslation()
  let cls = 'badge-blue', label = t('result.good')
  if (score >= 90)                    { cls = 'badge-green';  label = t('result.excellent') }
  else if (score < 70 && score >= 50) { cls = 'badge-yellow'; label = t('result.fair') }
  else if (score < 50)                { cls = 'badge-red';    label = t('result.poor') }
  return <span className={`badge ${cls}`}>{score} · {label}</span>
}

function RankChip({ rank }) {
  const cls = rank <= 3 ? `rank-chip rank-${rank}` : 'rank-chip'
  const icons = { 1: '🥇', 2: '🥈', 3: '🥉' }
  return <div className={cls} title={`#${rank}`}>{icons[rank] || rank}</div>
}

const CAT_ICONS = {
  'Interior Architecture': '🏗️',
  'IT': '💻',
  'Consulting': '📊',
  'Translation': '🌐',
}

export default function RankingTable({ data, loading, error }) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language?.startsWith('en') ? 'en-US' : 'ko-KR'

  if (loading) return <div className="loading-box"><div className="spinner" /><span>{t('ranking.loading')}</span></div>
  if (error)   return <div className="error-box">⚠️ {error}</div>
  if (!data || data.length === 0) {
    return (
      <div className="loading-box" style={{ color: 'var(--text-muted)' }}>
        <span style={{ fontSize: '2.5rem' }}>📭</span>
        <span style={{ whiteSpace: 'pre-line', textAlign: 'center' }}>{t('ranking.empty')}</span>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th style={{ width: 50 }}>{t('ranking.colRank')}</th>
            <th>{t('ranking.colCategory')}</th>
            <th>{t('ranking.colSummary')}</th>
            <th>{t('ranking.colPrice')}</th>
            <th>{t('ranking.colTimeline')}</th>
            <th>{t('ranking.colScore')}</th>
            <th>{t('ranking.colDate')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td><RankChip rank={row.rank} /></td>
              <td>
                <span className="category-chip">
                  {CAT_ICONS[row.category] || '📋'} {t(`category.${row.category}.label`, { defaultValue: row.category })}
                </span>
              </td>
              <td style={{ maxWidth: 260 }}>
                <div style={{ fontWeight: 600, fontSize: '.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.quote?.summary || '-'}
                </div>
              </td>
              <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                {row.quote?.total_price ? formatPrice(row.quote.total_price) : '-'}
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: '.875rem' }}>{row.quote?.timeline || '-'}</td>
              <td><ScoreBadge score={row.score} /></td>
              <td style={{ color: 'var(--text-muted)', fontSize: '.8rem', whiteSpace: 'nowrap' }}>
                {new Date(row.created_at).toLocaleDateString(locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
