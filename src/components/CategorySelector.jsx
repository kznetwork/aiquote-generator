const CATEGORIES = [
  {
    id: 'Interior Architecture',
    label: '인테리어 건축',
    icon: '🏗️',
    desc: '인테리어 설계 및 건축 프로젝트',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    id: 'IT',
    label: 'IT 개발',
    icon: '💻',
    desc: '소프트웨어 / 시스템 개발',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    id: 'Consulting',
    label: '컨설팅',
    icon: '📊',
    desc: '경영 / 전략 컨설팅',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    id: 'Translation',
    label: '번역',
    icon: '🌐',
    desc: '번역 / 로컬라이제이션',
    color: '#059669',
    bg: '#ECFDF5',
  },
]

export default function CategorySelector({ selected, onSelect }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>
        카테고리 선택
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginBottom: 20 }}>
        견적을 생성할 프로젝트 유형을 선택하세요
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            style={{
              padding: '20px',
              borderRadius: 'var(--radius)',
              border: `2px solid ${selected === cat.id ? cat.color : 'var(--border)'}`,
              background: selected === cat.id ? cat.bg : 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all .15s',
              boxShadow: selected === cat.id ? `0 0 0 3px ${cat.color}22` : 'var(--shadow)',
              transform: selected === cat.id ? 'translateY(-2px)' : 'none',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{cat.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '.95rem', color: selected === cat.id ? cat.color : 'var(--text)', marginBottom: 4 }}>
              {cat.label}
            </div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{cat.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
