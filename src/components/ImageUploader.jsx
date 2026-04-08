import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const [dragging, setDragging]     = useState(false)
  const [preview,  setPreview]      = useState(null)
  const [fileName, setFileName]     = useState('')
  const [error,    setError]        = useState('')
  const [extracting, setExtracting] = useState(false)
  const inputRef = useRef()

  const processFile = useCallback(async (file) => {
    setError('')
    if (!file.type.startsWith('image/')) { setError(t('image.errorType')); return }
    if (file.size > MAX_MB * 1024 * 1024) { setError(t('image.errorSize')); return }

    const base64 = await toBase64(file)
    setPreview(base64)
    setFileName(file.name)

    setExtracting(true)
    try {
      const res  = await fetch('/api/extract-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `분석 실패 (${res.status})`)
      }
      const data = await res.json()
      onExtracted(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setExtracting(false)
    }
  }, [onExtracted, t])

  const onDrop      = useCallback((e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f) }, [processFile])
  const onPaste     = useCallback((e) => { const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/')); if (item) processFile(item.getAsFile()) }, [processFile])
  const onFileChange = (e) => { if (e.target.files[0]) processFile(e.target.files[0]) }

  const isDisabled = loading || extracting

  return (
    <div onPaste={onPaste}>
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
          textAlign: 'center', cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'all .2s', opacity: isDisabled ? .7 : 1,
        }}
      >
        {extracting ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div className="spinner" />
            <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{t('image.analyzing')}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{t('image.analyzingDesc')}</div>
          </div>
        ) : preview ? (
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <img src={preview} alt="preview" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '.9rem', color: 'var(--success)' }}>{t('image.done')}</div>
              <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{fileName}</div>
              <button type="button"
                onClick={e => { e.stopPropagation(); setPreview(null); setFileName(''); setError('') }}
                style={{ marginTop: 6, fontSize: '.78rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {t('image.remove')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🖼️</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{t('image.dropzone')}</div>
            <div style={{ fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: 12 }}>
              {t('image.formats')}<br />
              {t('image.paste')}
            </div>
            <span style={{ fontSize: '.82rem', color: 'var(--primary)', fontWeight: 600 }}>{t('image.hint')}</span>
          </>
        )}
      </div>

      <input ref={inputRef} type="file" accept={ACCEPT} style={{ display: 'none' }} onChange={onFileChange} />

      {error && <div className="error-box" style={{ marginTop: 10, fontSize: '.85rem' }}>⚠️ {error}</div>}
    </div>
  )
}
