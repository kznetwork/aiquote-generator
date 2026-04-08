import { useState } from 'react'
import GeneratePage from './pages/GeneratePage'
import RankingPage from './pages/RankingPage'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  const [page, setPage] = useState('generate')

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-logo">
            <span>📋</span>
            AI Quote Generator
          </div>
          <div className="nav-links">
            <button
              className={`nav-link${page === 'generate' ? ' active' : ''}`}
              onClick={() => setPage('generate')}
            >
              견적 생성
            </button>
            <button
              className={`nav-link${page === 'ranking' ? ' active' : ''}`}
              onClick={() => setPage('ranking')}
            >
              랭킹
            </button>
          </div>
        </div>
      </nav>
      <main className="main">
        {page === 'generate' ? (
          <GeneratePage onViewRanking={() => setPage('ranking')} />
        ) : (
          <RankingPage />
        )}
      </main>
      <Footer />
    </div>
  )
}
