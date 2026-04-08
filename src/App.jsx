import { useState } from 'react'
import GeneratePage from './pages/GeneratePage'
import RankingPage from './pages/RankingPage'
import GuidePage from './pages/GuidePage'
import AboutPage from './pages/AboutPage'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  const [page, setPage] = useState('generate')
  const [menuOpen, setMenuOpen] = useState(false)

  const nav = (p) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0) }

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => nav('generate')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span>📋</span>
            AI 견적 생성기
          </button>

          {/* 데스크톱 메뉴 */}
          <div className="nav-links nav-desktop">
            <button className={`nav-link${page === 'generate' ? ' active' : ''}`} onClick={() => nav('generate')}>견적 생성</button>
            <button className={`nav-link${page === 'guide'    ? ' active' : ''}`} onClick={() => nav('guide')}>견적 가이드</button>
            <button className={`nav-link${page === 'ranking'  ? ' active' : ''}`} onClick={() => nav('ranking')}>랭킹</button>
            <button className={`nav-link${page === 'about'    ? ' active' : ''}`} onClick={() => nav('about')}>회사 소개</button>
          </div>

          {/* 모바일 햄버거 */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="메뉴"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* 모바일 드롭다운 */}
        {menuOpen && (
          <div className="nav-mobile-menu">
            {[['generate','견적 생성'],['guide','견적 가이드'],['ranking','랭킹'],['about','회사 소개']].map(([id, label]) => (
              <button key={id} className={`nav-link${page === id ? ' active' : ''}`} onClick={() => nav(id)} style={{ width: '100%', textAlign: 'left', borderRadius: 0, padding: '14px 24px' }}>
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
