import { useEffect, useRef } from 'react'

/**
 * Google AdSense 광고 컴포넌트
 * slot: AdSense 광고 단위 ID
 * format: 'auto' | 'rectangle' | 'horizontal'
 */
export default function AdBanner({ slot, format = 'auto', style = {} }) {
  const adRef = useRef(false)

  useEffect(() => {
    if (adRef.current) return
    adRef.current = true
    try {
      // eslint-disable-next-line no-undef
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      // AdSense 스크립트 미로드 시 무시
    }
  }, [])

  return (
    <div style={{ textAlign: 'center', overflow: 'hidden', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5739548677956542"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
