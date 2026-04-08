import { useTranslation } from 'react-i18next'
import AdBanner from './AdBanner'

function formatPrice(n) {
  return '₩' + Number(n).toLocaleString('ko-KR')
}

function ScoreDisplay({ score }) {
  const { t } = useTranslation()
  let cls = 'score-good', label = t('result.good')
  if (score >= 90)                    { cls = 'score-excellent'; label = t('result.excellent') }
  else if (score < 70 && score >= 50) { cls = 'score-fair';      label = t('result.fair') }
  else if (score < 50)                { cls = 'score-poor';      label = t('result.poor') }
  return (
    <div className={`score-display ${cls}`}>
      <div className="score-number">{score}</div>
      <div className="score-label">{t('result.scoreLabel')} · {label}</div>
      <div className="score-bar" style={{ marginTop: 10 }}>
        <div className="score-bar-fill" style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

function FeedbackSection({ feedback }) {
  const { t } = useTranslation()
  return (
    <div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>{t('result.feedback')}</h3>
      {feedback.strengths?.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--success)', marginBottom: 6 }}>{t('result.strengths')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {feedback.strengths.map((s, i) => <span key={i} className="badge badge-green">{s}</span>)}
          </div>
        </div>
      )}
      {feedback.weaknesses?.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--danger)', marginBottom: 6 }}>{t('result.weaknesses')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {feedback.weaknesses.map((w, i) => <span key={i} className="badge badge-red">{w}</span>)}
          </div>
        </div>
      )}
      {feedback.suggestions?.length > 0 && (
        <div>
          <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>{t('result.suggestions')}</div>
          <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {feedback.suggestions.map((s, i) => <li key={i} style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function QuoteResult({ result, onReset, onViewRanking }) {
  const { t } = useTranslation()
  const { quote, feedback, score, rank, category_rank } = result

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card card-pad" style={{ background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center' }}>
          <div style={{ textAlign: 'center', minWidth: 120 }}>
            <ScoreDisplay score={score} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{quote.summary}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              <span className="category-chip">📂 {quote.category}</span>
              <span className="badge badge-gray">⏱ {quote.timeline}</span>
              {rank && <span className="badge badge-blue" style={{ fontWeight: 700 }}>{t('result.rankOverall', { rank })}</span>}
              {category_rank && <span className="badge badge-green">{t('result.rankCategory', { rank: category_rank })}</span>}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>{t('result.totalPrice')}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(quote.total_price)}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div className="card card-pad">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>{t('result.detail')}</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t('result.item')}</th>
                  <th style={{ textAlign: 'right' }}>{t('result.price')}</th>
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
                  <td style={{ fontWeight: 700, borderTop: '2px solid var(--border)', paddingTop: 14 }}>{t('result.total')}</td>
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
                <div style={{ fontSize: '.85rem', fontWeight: 700, marginBottom: 8 }}>{t('result.risks')}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {quote.risks.map((risk, i) => <span key={i} className="badge badge-yellow">{risk}</span>)}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="card card-pad">
          <FeedbackSection feedback={feedback} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={onReset}>{t('result.reset')}</button>
        <button className="btn btn-primary" onClick={onViewRanking}>{t('result.viewRanking')}</button>
      </div>

      <AdBanner slot="1234567890" format="auto" style={{ margin: '4px 0' }} />
    </div>
  )
}
