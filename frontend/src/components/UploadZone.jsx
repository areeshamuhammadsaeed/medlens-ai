import { useState, useRef, useEffect } from 'react'

export default function UploadZone({ accept, hint, onSubmit, loading }) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    if (files && files[0]) {
      const f = files[0]
      setFile(f)
      if (f.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(f))
      } else {
        setPreviewUrl(null)
      }
    }
  }

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [previewUrl])

  return (
    <div>
      <div
        className={`dropzone ${dragOver ? 'dragover' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
      >
        {previewUrl ? (
          <div className="preview-wrap">
            <img src={previewUrl} alt="Selected file preview" className="preview-thumb" />
            {loading && (
              <>
                <div className="analyzing-sweep" />
                <span className="analyzing-label">Analyzing…</span>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="dz-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V4m0 0L7 9m5-5l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="dz-title">{file ? file.name : 'Drop a file here or click to browse'}</p>
            <p>{hint}</p>
          </>
        )}
        <input ref={inputRef} type="file" accept={accept} hidden onChange={(e) => handleFiles(e.target.files)} />
      </div>

      <button
        className="btn-primary"
        disabled={!file || loading}
        onClick={() => onSubmit(file, previewUrl)}
      >
        {loading ? 'Analyzing…' : 'Analyze'}
      </button>
    </div>
  )
}
