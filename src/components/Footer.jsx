import { useState } from 'react'
import PrivacyModal from './PrivacyModal'
import TermsModal from './TermsModal'

export default function Footer({ onNav }) {
  const [modal, setModal] = useState(null) // 'privacy' | 'terms' | 'ai' | null

  return (
    <>
      <footer style={{
        background: '#1E293B',
        color: '#94A3B8',
        marginTop: 'auto',
        padding: '36px 24px 28px',
        fontSize: '.82rem',
        lineHeight: 1.8,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'space-between', marginBottom: 28 }}>
            {/* 회사 정보 */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '.95rem', color: '#F1F5F9', marginBottom: 10 }}>
                주식회사 케이지네트워크
              </div>
              <div>경기도 부천시 은성로32 비1층(소사본동)</div>
              <div>대표전화: 032-351-9117</div>
              <div>이메일: kz4network@gmail.com</div>
            </div>

            {/* AI 서비스 안내 */}
            <div style={{ maxWidth: 380 }}>
              <div style={{ fontWeight: 700, fontSize: '.88rem', color: '#CBD5E1', marginBottom: 8 }}>AI 서비스 안내</div>
              <div style={{ fontSize: '.78rem', color: '#64748B' }}>
                본 서비스는 「인공지능 기본법」에 따라 AI가 생성한 견적임을 고지합니다.
                AI 생성 결과는 참고용이며, 최종 계약 금액과 다를 수 있습니다.
                중요한 의사결정 시 전문가와 반드시 상담하시기 바랍니다.
              </div>
            </div>

            {/* 서비스 링크 */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '.88rem', color: '#CBD5E1', marginBottom: 10 }}>서비스</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {onNav && <>
                  <button onClick={() => onNav('generate')} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '.82rem', textAlign: 'left', padding: 0 }}>AI 견적 생성</button>
                  <button onClick={() => onNav('guide')}    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '.82rem', textAlign: 'left', padding: 0 }}>견적 가이드</button>
                  <button onClick={() => onNav('ranking')}  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '.82rem', textAlign: 'left', padding: 0 }}>견적 랭킹</button>
                  <button onClick={() => onNav('about')}    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '.82rem', textAlign: 'left', padding: 0 }}>회사 소개</button>
                </>}
              </div>
            </div>

            {/* Our Sites */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '.88rem', color: '#CBD5E1', marginBottom: 10 }}>Our Sites</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <a href="http://kznetwork.co.kr/" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '.82rem', textDecoration: 'none' }}>kznetwork.co.kr</a>
                <a href="https://koai.ai/" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '.82rem', textDecoration: 'none' }}>koai.ai</a>
                <a href="https://brandgrowth.store/" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '.82rem', textDecoration: 'none' }}>brandgrowth.store</a>
              </div>
            </div>

            {/* 정책 링크 */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '.88rem', color: '#CBD5E1', marginBottom: 10 }}>정책 및 약관</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button onClick={() => setModal('privacy')} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '.82rem', textAlign: 'left', padding: 0 }}>개인정보 처리방침</button>
                <button onClick={() => setModal('terms')}   style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '.82rem', textAlign: 'left', padding: 0 }}>서비스 이용약관</button>
                <button onClick={() => setModal('ai')}      style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '.82rem', textAlign: 'left', padding: 0 }}>AI 서비스 고지</button>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #334155', paddingTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
            <span>© 2023 주식회사 케이지네트워크. All rights reserved.</span>
            <span style={{ fontSize: '.75rem', color: '#475569' }}>
              Powered by GPT-4o · AI 생성 결과는 참고용입니다
            </span>
          </div>
        </div>
      </footer>

      {modal && (
        <PrivacyModal
          open={modal === 'privacy'}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'terms' && (
        <TermsModal onClose={() => setModal(null)} />
      )}
      {modal === 'ai' && (
        <AINoticeModal onClose={() => setModal(null)} />
      )}
    </>
  )
}

function AINoticeModal({ onClose }) {
  return (
    <Modal title="AI 서비스 고지" onClose={onClose}>
      <p>본 서비스는 「인공지능 기본법」(법률 제20692호) 및 관련 고시에 따라 다음 사항을 고지합니다.</p>

      <h4>1. AI 생성 콘텐츠 표시</h4>
      <p>이 서비스에서 제공하는 모든 견적·피드백·분석 결과는 OpenAI GPT-4o 모델이 자동으로 생성한 인공지능(AI) 생성 콘텐츠입니다.</p>

      <h4>2. 정확성 한계</h4>
      <p>AI가 생성한 견적은 시장 상황, 지역, 전문가의 판단에 따라 실제와 차이가 발생할 수 있습니다. 본 결과를 최종 계약의 근거로 단독 사용하는 것은 권장하지 않습니다.</p>

      <h4>3. 이용자의 책임</h4>
      <p>AI 생성 결과를 이용한 의사결정에 대한 최종 책임은 이용자에게 있으며, 중요한 계약 체결 전에는 반드시 전문가와 상담하시기 바랍니다.</p>

      <h4>4. 이의제기 및 문의</h4>
      <p>AI 생성 결과에 이의가 있거나 오류가 의심되는 경우 kz4network@gmail.com으로 문의하시기 바랍니다.</p>
    </Modal>
  )
}

export function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)',
        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 12, width: '100%', maxWidth: 640,
          maxHeight: '80vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,.3)',
        }}
      >
        {/* 헤더 */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: '#64748B', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        {/* 본문 */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', fontSize: '.85rem', lineHeight: 1.9, color: '#374151' }}>
          <style>{`
            .modal-body h4 { font-size:.88rem; font-weight:700; margin:18px 0 6px; color:#1E293B; }
            .modal-body p { margin-bottom:10px; }
            .modal-body ul { padding-left:18px; margin-bottom:10px; }
            .modal-body li { margin-bottom:4px; }
          `}</style>
          <div className="modal-body">{children}</div>
        </div>
        <div style={{ padding: '14px 24px', borderTop: '1px solid #E2E8F0', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 20px', background: '#2563EB', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '.88rem' }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}
