function formatPrice(n) {
  return '₩' + Number(n).toLocaleString('ko-KR')
}

function ScoreBadge({ score }) {
  let cls = 'badge-blue', label = '좋음'
  if (score >= 90) { cls = 'badge-green'; label = '우수' }
  else if (score < 70 && score >= 50) { cls = 'badge-yellow'; label = '보통' }
  else if (score < 50) { cls = 'badge-red'; label = '미흡' }
  return <span className={`badge ${cls}`}>{score}점 · {label}</span>
}

function RankChip({ rank }) {
  const cls = rank <= 3 ? `rank-chip rank-${rank}` : 'rank-chip'
  const icons = { 1: '🥇', 2: '🥈', 3: '🥉' }
  return (
    <div className={cls} title={`#${rank}위`}>
      {icons[rank] || rank}
    </div>
  )
}

const CAT_ICONS = {
  'Interior Architecture': '🏗️',
  'IT': '💻',
  'Consulting': '📊',
  'Translation': '🌐',
}

export default function RankingTable({ data, loading, error }) {
  if (loading) {
    return (
      <div className="loading-box">
        <div className="spinner" />
        <span>랭킹 불러오는 중...</span>
      </div>
    )
  }
  if (error) {
    return <div className="error-box">⚠️ {error}</div>
  }
  if (!data || data.length === 0) {
    return (
      <div className="loading-box" style={{ color: 'var(--text-muted)' }}>
        <span style={{ fontSize: '2.5rem' }}>📭</span>
        <span>아직 저장된 견적이 없습니다.<br />견적을 생성하면 랭킹에 표시됩니다.</span>
      </div>
    )
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th style={{ width: 50 }}>순위</th>
            <th>카테고리</th>
            <th>요약</th>
            <th>총 견적가</th>
            <th>일정</th>
            <th>점수</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td><RankChip rank={row.rank} /></td>
              <td>
                <span className="category-chip">
                  {CAT_ICONS[row.category] || '📋'} {row.category === 'Interior Architecture' ? '인테리어' : row.category === 'Translation' ? '번역' : row.category === 'Consulting' ? '컨설팅' : row.category}
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
              <td style={{ color: 'var(--text-muted)', fontSize: '.875rem' }}>
                {row.quote?.timeline || '-'}
              </td>
              <td><ScoreBadge score={row.score} /></td>
              <td style={{ color: 'var(--text-muted)', fontSize: '.8rem', whiteSpace: 'nowrap' }}>
                {new Date(row.created_at).toLocaleDateString('ko-KR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
