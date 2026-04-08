import { useState } from 'react'
import AdBanner from '../components/AdBanner'

const GUIDES = [
  {
    id: 'it',
    icon: '💻',
    title: 'IT 개발 프로젝트 견적 완벽 가이드',
    category: 'IT 개발',
    intro: '소프트웨어 개발 프로젝트는 범위와 기술 스택에 따라 견적이 크게 달라집니다. 국내 IT 개발 시장의 표준 단가와 견적 산정 기준을 상세히 알아보세요.',
    sections: [
      {
        title: '📌 IT 개발 프로젝트 유형별 평균 비용 (2024년 기준)',
        content: `소규모 웹사이트 (랜딩페이지, 브로셔 사이트) — 300만~800만 원
쇼핑몰·커머스 플랫폼 (기본형) — 1,000만~3,000만 원
기업 ERP·그룹웨어 — 3,000만~1억 원 이상
모바일 앱 (iOS + Android, 기본형) — 2,000만~5,000만 원
AI·빅데이터 기반 서비스 — 5,000만 원 이상

위 금액은 국내 중견 SI업체 기준이며, 스타트업 또는 프리랜서 팀을 활용할 경우 30~50% 절감이 가능합니다.`,
      },
      {
        title: '📋 견적 구성 항목',
        content: `① 기획 및 분석 (10~15%)
요구사항 분석, 기능 명세서 작성, 와이어프레임, 데이터베이스 설계

② 디자인 (15~20%)
UI/UX 설계, 화면 디자인, 디자인 시스템 구축

③ 프론트엔드 개발 (20~25%)
React, Vue, Next.js 등 클라이언트 화면 구현, 반응형 웹

④ 백엔드 개발 (25~30%)
API 서버 개발, 데이터베이스 설계 및 구축, 인증/보안 처리

⑤ 테스트 및 QA (10%)
기능 테스트, 성능 테스트, 브라우저·디바이스 호환성 검증

⑥ 배포 및 인프라 (10~15%)
클라우드 서버 구축(AWS/GCP/Naver Cloud), CI/CD 파이프라인`,
      },
      {
        title: '💡 견적 절약 팁',
        content: `MVP(최소 기능 제품) 우선 개발: 핵심 기능만 먼저 개발하고 추후 기능을 확장하면 초기 비용을 40~60% 절감할 수 있습니다.

오픈소스 활용: 결제 연동(포트원), 인증(OAuth), 지도(카카오맵 API) 등 기존 솔루션을 활용하면 개발 기간과 비용을 대폭 줄일 수 있습니다.

명확한 기획서 준비: 요구사항이 명확할수록 추가 비용 발생 가능성이 낮아집니다. 기능 목록, 화면 흐름도를 미리 준비하세요.`,
      },
      {
        title: '⚠️ 주의해야 할 숨은 비용',
        content: `유지보수 비용: 개발 완료 후 월 20~100만 원의 유지보수 계약을 고려해야 합니다.
서버·호스팅 비용: 월 5~50만 원 (트래픽 규모에 따라 다름)
SSL 인증서·도메인: 연 5~20만 원
Third-party API 사용료: 지도, SMS, 결제 등 종량제 과금`,
      },
    ],
  },
  {
    id: 'interior',
    icon: '🏗️',
    title: '인테리어·건축 프로젝트 견적 완벽 가이드',
    category: '인테리어 건축',
    intro: '인테리어 공사는 면적, 자재 등급, 공사 범위에 따라 비용 차이가 매우 큽니다. 합리적인 견적을 받기 위한 기준과 절차를 안내합니다.',
    sections: [
      {
        title: '📌 인테리어 평균 시공 단가 (2024년 수도권 기준)',
        content: `주거용 아파트 인테리어 (올수리): 평당 130만~220만 원
주거용 아파트 인테리어 (부분 공사): 평당 80만~150만 원
카페·음식점 상업 공간: 평당 200만~400만 원
사무실 인테리어: 평당 100만~200만 원
소규모 리모델링 (도배·장판·조명): 평당 30만~70만 원

예시: 30평 아파트 올수리 시 약 3,900만~6,600만 원 예상`,
      },
      {
        title: '📋 견적 구성 항목',
        content: `① 설계비 (5~10%)
공간 기획, 도면 작성, 3D 시뮬레이션, 인허가 도면

② 철거 공사 (5~8%)
기존 마감재 해체, 폐자재 처리, 구조 변경 시 추가 비용 발생

③ 목공 및 가구 (20~30%)
붙박이장, 신발장, 주방 상·하부장, 천장 몰딩, 인테리어 벽체

④ 바닥재 (10~15%)
강마루, 대리석, 타일, 카펫 등 자재에 따라 단가 차이 큼

⑤ 도배·도장 (8~12%)
합지 또는 실크 도배, 방음·단열 기능성 자재 선택 가능

⑥ 조명·전기·설비 (15~20%)
LED 조명 교체, 콘센트 증설, 냉난방기, 위생설비 교체

⑦ 인건비 (20~25%)
기술자 등급 및 공기(공사 기간)에 따라 변동`,
      },
      {
        title: '💡 견적 절약 팁',
        content: `복수 견적 비교: 최소 3곳 이상의 업체로부터 견적을 받아 비교하세요. 같은 공사라도 업체에 따라 30~40% 가격 차이가 납니다.

비수기 공사: 이사 수요가 적은 1~2월, 6~7월에 공사하면 인건비 협상 여지가 큽니다.

자재 직접 구매: 조명, 수전, 타일 등 자재를 직접 구매해 시공만 맡기면 마진 비용을 절감할 수 있습니다.`,
      },
      {
        title: '⚠️ 계약 시 필수 확인 사항',
        content: `공사 범위 명확화: 어디부터 어디까지 포함인지 도면과 함께 서면으로 확인
추가 공사 기준: 추가 공사 발생 시 단가 기준을 사전에 합의
하자 보증 기간: 공사 완료 후 최소 1년 이상 하자 보수 보증 확인
공사 일정 명시: 착공일, 완공일을 계약서에 명시하고 지연 시 패널티 조항 포함`,
      },
    ],
  },
  {
    id: 'consulting',
    icon: '📊',
    title: '경영·전략 컨설팅 견적 완벽 가이드',
    category: '컨설팅',
    intro: '컨설팅 프로젝트는 컨설턴트의 경험과 프로젝트 복잡도에 따라 비용이 크게 달라집니다. 합리적인 컨설팅 비용 책정 기준을 알아보세요.',
    sections: [
      {
        title: '📌 컨설팅 유형별 평균 비용 (2024년 기준)',
        content: `경영 전략 수립 (3개월): 2,000만~8,000만 원
스타트업 창업 컨설팅 (1~2개월): 500만~2,000만 원
IR 투자 유치 컨설팅: 1,000만~3,000만 원 + 성공 수수료
인사·조직 컨설팅 (3개월): 3,000만~1억 원
마케팅·브랜딩 전략: 500만~3,000만 원
ESG·지속가능경영 컨설팅: 2,000만~5,000만 원`,
      },
      {
        title: '📋 컨설팅 비용 산정 기준',
        content: `① 일당(Man-Day) 방식
컨설턴트 1인 1일 기준: 50만~300만 원
프로젝트 매니저(PM): 100만~200만 원/일
시니어 컨설턴트: 80만~150만 원/일
주니어 컨설턴트: 30만~70만 원/일

② 프로젝트 고정 방식
범위와 결과물이 명확할 때 적용
착수금 30~50% + 중간 30% + 완료 시 잔금 구조가 일반적

③ 월정액 방식 (리테이너)
지속적 자문이 필요할 때: 월 100만~500만 원`,
      },
      {
        title: '💡 컨설팅 효과 극대화 방법',
        content: `명확한 목표 설정: "매출 20% 증대"처럼 측정 가능한 목표를 제시하면 컨설턴트가 더 집중된 결과를 도출합니다.

내부 담당자 지정: 컨설팅 프로젝트 진행 시 내부 PM을 지정해 원활한 커뮤니케이션이 이루어지도록 합니다.

결과물 명세 확인: 최종 보고서, 실행계획서, 워크숍 횟수 등 결과물을 계약서에 명시하세요.`,
      },
    ],
  },
  {
    id: 'translation',
    icon: '🌐',
    title: '전문 번역 서비스 견적 완벽 가이드',
    category: '번역',
    intro: '번역 서비스는 언어 조합, 분야 전문성, 납기에 따라 단가가 달라집니다. 정확하고 합리적인 번역 견적을 받는 방법을 알아보세요.',
    sections: [
      {
        title: '📌 번역 단가 기준 (2024년 한국 시장)',
        content: `일반 문서 번역 (한↔영): 글자당 30~60원 / 단어당 80~150원
전문 기술 번역 (IT, 법률, 의료): 글자당 50~120원
게임·소프트웨어 현지화: 단어당 100~200원
동시통역 (학술·비즈니스): 시간당 30만~80만 원
연속통역: 시간당 15만~40만 원

예시: A4 1장(800자) 일반 번역 → 약 24,000~48,000원`,
      },
      {
        title: '📋 번역 프로젝트 구성 항목',
        content: `① 초벌 번역
원문 분석, 번역 메모리(TM) 구축, 초벌 번역 진행

② 교정(Editing)
번역 초안을 제2의 번역가가 검토·수정 — 번역 단가의 30~50% 추가

③ 감수(Proofreading)
최종 교정자가 원문과 대조하며 오류 수정 — 번역 단가의 20~30% 추가

④ 현지화(Localization)
문화적 맥락·UI 문자열·날짜·통화 형식 등 현지 환경에 맞게 조정

⑤ DTP(편집 디자인 적용)
번역 후 원본 레이아웃(PDF, PPT 등)에 텍스트 적용 — 별도 견적`,
      },
      {
        title: '💡 번역 비용 절감 방법',
        content: `번역 메모리(TM) 활용: 반복 문장은 할인 적용 가능. 동일 문서를 반복 발주 시 비용 절감
CAT 툴 사용 업체 선정: SDL Trados, memoQ 등 번역 지원 도구 활용 업체는 일관성이 높고 비용 효율적
충분한 납기 제공: 급행 번역은 일반 단가의 20~50% 할증. 여유 있는 일정 제공 시 절약 가능`,
      },
      {
        title: '⚠️ 번역 품질 확인 방법',
        content: `샘플 번역 요청: 본 발주 전 100~200단어 샘플 번역을 요청해 품질을 확인하세요
번역가 자격 확인: 해당 분야 전문 자격(법률, 의료, 특허 등) 보유 여부 확인
용어집 제공: 회사 고유 용어·브랜드명·제품명 목록을 미리 제공하면 번역 오류를 줄일 수 있습니다`,
      },
    ],
  },
]

function GuideCard({ guide, onSelect }) {
  return (
    <div
      className="card card-pad"
      onClick={() => onSelect(guide.id)}
      style={{ cursor: 'pointer', transition: 'all .15s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = ''}
    >
      <div style={{ fontSize: '2rem', marginBottom: 10 }}>{guide.icon}</div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>{guide.title}</h3>
      <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{guide.intro.slice(0, 80)}...</p>
      <div style={{ marginTop: 14 }}>
        <span style={{ fontSize: '.82rem', color: 'var(--primary)', fontWeight: 600 }}>자세히 보기 →</span>
      </div>
    </div>
  )
}

function GuideDetail({ guide, onBack }) {
  return (
    <div>
      <button className="btn btn-ghost" style={{ marginBottom: 20, fontSize: '.85rem', padding: '7px 14px' }} onClick={onBack}>
        ← 목록으로
      </button>

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: '2.5rem' }}>{guide.icon}</span>
          <div>
            <span className="badge badge-blue" style={{ marginBottom: 6, display: 'inline-flex' }}>{guide.category}</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.35 }}>{guide.title}</h1>
          </div>
        </div>
        <p style={{ fontSize: '.95rem', color: 'var(--text-muted)', lineHeight: 1.8, borderLeft: '3px solid var(--primary)', paddingLeft: 14 }}>
          {guide.intro}
        </p>
      </div>

      {guide.sections.map((sec, i) => (
        <div key={i} className="card card-pad" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14, color: 'var(--text)' }}>{sec.title}</h2>
          <div style={{ fontSize: '.9rem', lineHeight: 2, color: '#374151', whiteSpace: 'pre-line' }}>
            {sec.content}
          </div>
        </div>
      ))}

      {/* Ad — 가이드 본문 하단 */}
      <AdBanner slot="1122334455" format="auto" style={{ margin: '20px 0' }} />

      <div className="card card-pad" style={{ background: 'var(--primary-light)', border: '1px solid #BFDBFE' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--primary)' }}>✨ AI로 정확한 견적 받기</h3>
        <p style={{ fontSize: '.9rem', color: '#1E40AF', lineHeight: 1.7 }}>
          위 가이드를 참고해서 프로젝트 정보를 입력하면 GPT-4o AI가 한국 시장 기준 맞춤 견적을 즉시 생성합니다.
          이미지·기획서 업로드도 가능합니다.
        </p>
      </div>
    </div>
  )
}

export default function GuidePage() {
  const [selected, setSelected] = useState(null)
  const guide = GUIDES.find(g => g.id === selected)

  if (guide) return <GuideDetail guide={guide} onBack={() => setSelected(null)} />

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>📚 프로젝트 견적 가이드</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '.92rem', lineHeight: 1.7 }}>
          인테리어, IT 개발, 컨설팅, 번역 프로젝트의 견적 산정 기준과 절약 방법을 전문가 가이드로 알아보세요.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
        {GUIDES.map(g => (
          <GuideCard key={g.id} guide={g} onSelect={setSelected} />
        ))}
      </div>

      {/* Ad — 가이드 목록 하단 */}
      <AdBanner slot="5566778899" format="auto" style={{ margin: '8px 0 24px' }} />

      <div className="card card-pad" style={{ background: 'linear-gradient(135deg, #F0FDF4, #EFF6FF)' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 10 }}>🤔 견적 가이드를 읽어도 모르겠다면?</h2>
        <p style={{ fontSize: '.9rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
          프로젝트 정보를 입력하거나 기획서 이미지를 업로드하면 GPT-4o AI가 한국 시장 기준으로
          항목별 상세 견적과 품질 피드백을 즉시 제공합니다. 무료로 이용하세요.
        </p>
      </div>

      {/* FAQ */}
      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>❓ 자주 묻는 질문</h2>
        {[
          { q: 'AI 견적은 얼마나 정확한가요?', a: 'GPT-4o 기반으로 한국 시장 평균 단가를 학습한 결과를 제공합니다. 실제 견적과 ±20~30% 오차가 있을 수 있으므로 최종 계약 전 반드시 전문 업체 견적을 받으시기 바랍니다.' },
          { q: '이미지로 견적을 받을 수 있나요?', a: '네, 기획서·요구사항 문서·화이트보드 사진을 업로드하면 GPT-4o Vision이 자동으로 프로젝트 정보를 추출하고 견적을 생성합니다.' },
          { q: '견적 생성은 무료인가요?', a: '현재 무료로 제공됩니다. AI 견적 생성, 품질 점수 분석, 랭킹 조회 모두 무료입니다.' },
          { q: '어떤 카테고리를 지원하나요?', a: '인테리어·건축, IT 개발, 경영 컨설팅, 번역 서비스 4가지 카테고리를 지원합니다. 향후 더 많은 카테고리를 추가할 예정입니다.' },
        ].map((faq, i) => (
          <div key={i} className="card card-pad" style={{ marginBottom: 10 }}>
            <h3 style={{ fontWeight: 700, fontSize: '.92rem', marginBottom: 8, color: 'var(--primary)' }}>Q. {faq.q}</h3>
            <p style={{ fontSize: '.88rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>A. {faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
