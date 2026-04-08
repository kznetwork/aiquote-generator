import AdBanner from '../components/AdBanner'

export default function AboutPage() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>🏢 회사 소개</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '.92rem' }}>주식회사 케이지네트워크는 AI 기술로 비즈니스 의사결정을 돕습니다.</p>
      </div>

      {/* 회사 소개 */}
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 14 }}>📌 회사 개요</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: '회사명', value: '주식회사 케이지네트워크' },
            { label: '대표이사', value: '대표이사' },
            { label: '소재지', value: '경기도 부천시 은성로32 비1층(소사본동)' },
            { label: '대표전화', value: '032-351-9117' },
            { label: '이메일', value: 'help@kznetwork.co.kr' },
            { label: '서비스', value: 'AI 견적 생성, IT 솔루션' },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
              <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 서비스 소개 */}
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 14 }}>🤖 AI 견적 생성 서비스란?</h2>
        <p style={{ fontSize: '.92rem', lineHeight: 1.9, color: '#374151', marginBottom: 14 }}>
          케이지네트워크의 AI 견적 생성 서비스는 OpenAI GPT-4o 모델을 활용하여 인테리어, IT 개발, 경영 컨설팅, 번역 프로젝트의 견적을 자동으로 생성합니다.
        </p>
        <p style={{ fontSize: '.92rem', lineHeight: 1.9, color: '#374151', marginBottom: 14 }}>
          기존에는 견적을 받기 위해 여러 업체에 연락하고 며칠을 기다려야 했습니다. 본 서비스는 프로젝트 정보를 입력하거나 기획서 이미지를 업로드하면 수 초 내에 한국 시장 기준의 상세 견적과 품질 피드백을 제공합니다.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginTop: 16 }}>
          {[
            { icon: '⚡', title: '즉시 생성', desc: '수 초 내 견적 완성' },
            { icon: '🎯', title: '한국 시장 기준', desc: '국내 실제 단가 반영' },
            { icon: '📊', title: '품질 점수', desc: '프로젝트 완성도 평가' },
            { icon: '🖼️', title: '이미지 인식', desc: '문서 업로드로 자동 추출' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: 'var(--primary-light)', borderRadius: 8, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: '.88rem', color: 'var(--primary)', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ad */}
      <AdBanner slot="9988776655" format="auto" style={{ margin: '16px 0' }} />

      {/* 서비스 카테고리 */}
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 14 }}>📂 지원 서비스 카테고리</h2>
        {[
          { icon: '🏗️', title: '인테리어·건축', desc: '주거·상업 공간 인테리어 리모델링, 신축 공사, 설계·감리 등의 견적을 산정합니다. 자재비, 인건비, 감리비를 항목별로 분리하여 투명하게 제공합니다.' },
          { icon: '💻', title: 'IT 개발', desc: '웹사이트, 모바일 앱, ERP, AI 서비스 등 소프트웨어 개발 견적을 제공합니다. 프론트엔드, 백엔드, 데이터베이스, 배포 인프라 비용을 포함합니다.' },
          { icon: '📊', title: '경영 컨설팅', desc: '사업 전략 수립, IR 자료 작성, 시장 조사, 조직 개편 등 경영 컨설팅 프로젝트의 Man-Day 기준 견적을 산정합니다.' },
          { icon: '🌐', title: '번역 서비스', desc: '영어, 일본어, 중국어 등 다양한 언어 조합의 전문 번역 견적을 제공합니다. 분량, 전문 분야, 납기에 따른 정확한 단가를 산출합니다.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ display: 'flex', gap: 14, paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{icon}</span>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: 6 }}>{title}</h3>
              <p style={{ fontSize: '.88rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI 기본법 고지 */}
      <div className="card card-pad" style={{ background: '#F8FAFC', border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: 10 }}>📜 인공지능 기본법 준수</h2>
        <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
          본 서비스는 「인공지능 기본법」(법률 제20692호)에 따라 AI 생성 콘텐츠임을 명시하고 있습니다.
          모든 견적 결과는 AI가 자동 생성한 것으로 참고용이며, 최종 계약의 법적 효력을 갖지 않습니다.
          AI 생성 결과에 대한 이의제기 및 문의는 help@kznetwork.co.kr로 연락해 주세요.
        </p>
      </div>
    </div>
  )
}
