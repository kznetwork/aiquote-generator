import AdBanner from './AdBanner'

function formatPrice(n) {
  return '₩' + Number(n).toLocaleString('ko-KR')
}

function ScoreDisplay({ score }) {
  let cls = 'score-good', label = '좋음'
  if (score >= 90) { cls = 'score-excellent'; label = '우수' }
  else if (score < 70 && score >= 50) { cls = 'score-fair'; label = '보통' }
  else if (score < 50) { cls = 'score-poor'; label = '미흡' }

  return (
    <div className={`score-display ${cls}`}>
      <div className="score-number">{score}</div>
      <div className="score-label">/ 100 · {label}</div>
      <div className="score-bar" style={{ marginTop: 10 }}>
        <div className="score-bar-fill" style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

function FeedbackSection({ feedback }) {
  return (
    <div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>📝 평가 피드백</h3>

      {feedback.strengths?.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--success)', marginBottom: 6 }}>✅ 강점</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {feedback.strengths.map((s, i) => (
              <span key={i} className="badge badge-green">{s}</span>
            ))}
          </div>
        </div>
      )}

      {feedback.weaknesses?.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--danger)', marginBottom: 6 }}>⚠️ 약점</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {feedback.weaknesses.map((w, i) => (
              <span key={i} className="badge badge-red">{w}</span>
            ))}
          </div>
        </div>
      )}

      {feedback.suggestions?.length > 0 && (
        <div>
          <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>💡 개선 제안</div>
          <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {feedback.suggestions.map((s, i) => (
              <li key={i} style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function QuoteResult({ result, onReset, onViewRanking }) {
  const { quote, feedback, score, rank, category_rank } = result

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Score + Rank Banner */}
      <div className="card card-pad" style={{ background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center' }}>
          <div style={{ textAlign: 'center', minWidth: 120 }}>
            <ScoreDisplay score={score} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>
              {quote.summary}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              <span className="category-chip">📂 {quote.category}</span>
              <span className="badge badge-gray">⏱ {quote.timeline}</span>
              <span className="badge badge-blue" style={{ fontWeight: 700 }}>
                전체 #{rank}위
              </span>
              <span className="badge badge-green">
                카테고리 #{category_rank}위
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>총 견적가</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
              {formatPrice(quote.total_price)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

        {/* Quote Details */}
        <div className="card card-pad">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>📄 견적 상세</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>항목</th>
                  <th style={{ textAlign: 'right' }}>금액</th>
                </tr>
              </thead>
              <tbody>
                {quote.breakdown?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.item}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatPrice(item.price)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ fontWeight: 700, borderTop: '2px solid var(--border)', paddingTop: 14 }}>합계</td>
                  <td style={{ fontWeight: 800, color: 'var(--primary)', textAlign: 'right', borderTop: '2px solid var(--border)', paddingTop: 14 }}>
                    {formatPrice(quote.total_price)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {quote.risks?.length > 0 && (
            <>
              <hr className="divider" />
              <div>
                <div style={{ fontSize: '.85rem', fontWeight: 700, marginBottom: 8 }}>⚡ 리스크 요소</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {quote.risks.map((risk, i) => (
                    <span key={i} className="badge badge-yellow">{risk}</span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Feedback */}
        <div className="card card-pad">
          <FeedbackSection feedback={feedback} />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={onReset}>
          🔄 새 견적 생성
        </button>
        <button className="btn btn-primary" onClick={onViewRanking}>
          🏆 랭킹 보기
        </button>
      </div>

      {/* Ad — 결과 하단 */}
      <AdBanner
        slot="1234567890"
        format="auto"
        style={{ margin: '4px 0' }}
      />
    </div>
  )
}
