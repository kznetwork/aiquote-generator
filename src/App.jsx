import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import GeneratePage from './pages/GeneratePage'
import RankingPage from './pages/RankingPage'
import GuidePage from './pages/GuidePage'
import AboutPage from './pages/AboutPage'
import Footer from './components/Footer'
import './App.css'

function LangSwitch() {
  const { i18n } = useTranslation()
  const current = i18n.language?.startsWith('en') ? 'en' : 'ko'
  const toggle = () => i18n.changeLanguage(current === 'ko' ? 'en' : 'ko')
  return (
    <button
      onClick={toggle}
      title={current === 'ko' ? 'Switch to English' : '한국어로 변경'}
      style={{
        background: 'none', border: '1.5px solid var(--border)',
        borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
        fontSize: '.8rem', fontWeight: 700, color: 'var(--text-muted)',
        display: 'flex', alignItems: 'center', gap: 4,
      }}
    >
      {current === 'ko' ? '🇺🇸 EN' : '🇰🇷 KO'}
    </button>
  )
}

export default function App() {
  const [page, setPage] = useState('generate')
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useTranslation()

  const nav = (p) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0) }

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => nav('generate')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span>📋</span>
            {t('nav.logo')}
          </button>

          <div className="nav-links nav-desktop" style={{ alignItems: 'center', gap: 4 }}>
            <button className={`nav-link${page === 'generate' ? ' active' : ''}`} onClick={() => nav('generate')}>{t('nav.generate')}</button>
            <button className={`nav-link${page === 'guide'    ? ' active' : ''}`} onClick={() => nav('guide')}>{t('nav.guide')}</button>
            <button className={`nav-link${page === 'ranking'  ? ' active' : ''}`} onClick={() => nav('ranking')}>{t('nav.ranking')}</button>
            <button className={`nav-link${page === 'about'    ? ' active' : ''}`} onClick={() => nav('about')}>{t('nav.about')}</button>
            <LangSwitch />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="nav-mobile-controls">
            <LangSwitch />
            <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="메뉴">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="nav-mobile-menu">
            {[['generate', t('nav.generate')], ['guide', t('nav.guide')], ['ranking', t('nav.ranking')], ['about', t('nav.about')]].map(([id, label]) => (
              <button key={id} className={`nav-link${page === id ? ' active' : ''}`} onClick={() => nav(id)}
                style={{ width: '100%', textAlign: 'left', borderRadius: 0, padding: '14px 24px' }}>
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="main">
        {page === 'generate' && <GeneratePage onViewRanking={() => nav('ranking')} />}
        {page === 'guide'    && <GuidePage />}
        {page === 'ranking'  && <RankingPage />}
        {page === 'about'    && <AboutPage />}
      </main>

      <Footer onNav={nav} />
    </div>
  )
}
