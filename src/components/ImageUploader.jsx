import { useState, useRef, useCallback } from 'react'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'
const MAX_MB  = 5

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function ImageUploader({ onExtracted, loading }) {
  const [dragging, setDragging]   = useState(false)
  const [preview,  setPreview]    = useState(null)
  const [fileName, setFileName]   = useState('')
  const [error,    setError]      = useState('')
  const [extracting, setExtracting] = useState(false)
  const inputRef = useRef()

  const processFile = useCallback(async (file) => {
    setError('')
    if (!file.type.startsWith('image/')) { setError('이미지 파일만 업로드할 수 있습니다.'); return }
    if (file.size > MAX_MB * 1024 * 1024)  { setError(`파일 크기는 ${MAX_MB}MB 이하여야 합니다.`); return }

    const base64 = await toBase64(file)
    setPreview(base64)
    setFileName(file.name)

    // 자동으로 서버에 전송해 프로젝트 정보 추출
    setExtracting(true)
    try {
      const res  = await fetch('/api/extract-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '분석 실패')
      onExtracted(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setExtracting(false)
    }
  }, [onExtracted])

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const onPaste = useCallback((e) => {
    const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/'))
    if (item) processFile(item.getAsFile())
  }, [processFile])

  const onFileChange = (e) => { if (e.target.files[0]) processFile(e.target.files[0]) }

  const isDisabled = loading || extracting

  return (
    <div onPaste={onPaste}>
      {/* Drop zone */}
      <div
        onClick={() => !isDisabled && inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? 'var(--primary)' : preview ? 'var(--success)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          background: dragging ? 'var(--primary-light)' : preview ? '#F0FDF4' : 'var(--bg)',
          padding: preview ? '12px' : '40px 20px',
          textAlign: 'center',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'all .2s',
          opacity: isDisabled ? .7 : 1,
        }}
      >
        {extracting ? (
          /* 추출 중 */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div className="spinner" />
            <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
              🔍 Gemma 4 26B가 이미지를 분석하고 있습니다...
            </div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>프로젝트 정보를 자동으로 추출합니다</div>
          </div>
        ) : preview ? (
          /* 미리보기 */
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <img src={preview} alt="preview" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '.9rem', color: 'var(--success)' }}>✅ 분석 완료</div>
              <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{fileName}</div>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setPreview(null); setFileName(''); setError('') }}
                style={{ marginTop: 6, fontSize: '.78rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                × 이미지 제거
              </button>
            </div>
          </div>
        ) : (
          /* 기본 상태 */
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🖼️</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>이미지를 드래그하거나 클릭해서 업로드</div>
            <div style={{ fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: 12 }}>
              JPG · PNG · WebP · GIF / 최대 {MAX_MB}MB<br />
              클립보드에서 <kbd style={{ background: 'var(--border)', padding: '1px 5px', borderRadius: 4, fontSize: '.78rem' }}>Ctrl+V</kbd> 붙여넣기도 가능
            </div>
            <span style={{ fontSize: '.82rem', color: 'var(--primary)', fontWeight: 600 }}>
              📋 프로젝트 문서·화이트보드·기획서 이미지를 올리면 자동으로 정보를 추출합니다
            </span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />

      {error && (
        <div className="error-box" style={{ marginTop: 10, fontSize: '.85rem' }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  )
}
