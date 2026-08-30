import { useState, useEffect } from 'react'
import UploadZone from './components/UploadZone.jsx'
import ResultCard from './components/ResultCard.jsx'
import ReportChat from './components/ReportChat.jsx'
import SymptomChecker from './components/SymptomChecker.jsx'
import HistoryPanel from './components/HistoryPanel.jsx'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
const HISTORY_KEY = 'medlens_history_v1'
const MAX_HISTORY = 30

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 11l8-7 8 7M6 10v9a1 1 0 001 1h3v-6h4v6h3a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ScanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 8V5a1 1 0 011-1h3M20 8V5a1 1 0 00-1-1h-3M4 16v3a1 1 0 001 1h3M20 16v3a1 1 0 01-1 1h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function DocIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h6M9 8h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function SymptomIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.163-3.02-.462L3 21l1.5-4.5C3.55 15.16 3 13.63 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function HistoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ResultPlaceholderIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M9 12l2 2 4-4M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function UploadStepIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V4m0 0L7 9m5-5l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
function ChatBubbleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.163-3.02-.462L3 21l1.5-4.5C3.55 15.16 3 13.63 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}
function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
function UploadArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function BrainIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
function DoctorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

const TABS = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'xray', label: 'Chest X-ray', icon: ScanIcon },
  { id: 'report', label: 'Lab report', icon: DocIcon },
  { id: 'symptom', label: 'Symptom checker', icon: SymptomIcon },
  { id: 'history', label: 'History', icon: HistoryIcon },
]

const MODULES = [
  { id: 'xray', title: 'Chest X-ray', tag: 'AI vision', accent: '#5B5FE9', desc: 'Upload a chest X-ray and get an AI-assisted explanation with a visual heatmap.', icon: ScanIcon },
  { id: 'report', title: 'Lab report', tag: 'AI + OCR', accent: '#0E9488', desc: 'Upload a report or prescription and get it explained in plain language.', icon: DocIcon },
  { id: 'symptom', title: 'Symptom checker', tag: 'Conversational AI', accent: '#B54708', desc: 'Describe how you feel and get a general, non-diagnostic urgency read.', icon: SymptomIcon },
  { id: 'history', title: 'History', tag: 'Local & private', accent: '#475467', desc: 'Look back at your past analyses, kept locally in this browser.', icon: HistoryIcon },
]

const QUICK_START = [
  { icon: UploadStepIcon, title: 'Upload or describe', desc: 'Add a chest X-ray, a lab report, or just describe how you feel.' },
  { icon: SparkleIcon, title: 'AI analyzes it', desc: 'MedLens interprets the input and reasons through what it finds.' },
  { icon: ChatBubbleIcon, title: 'Get a plain answer', desc: 'A clear explanation, an urgency level, and what to ask your doctor.' },
]

const HOW_IT_WORKS = [
  { icon: UploadArrowIcon, title: 'You upload', desc: 'A scan, a report, or a symptom description.' },
  { icon: BrainIcon, title: 'AI interprets', desc: 'Vision or language models process the input.' },
  { icon: ChatBubbleIcon, title: 'Explained simply', desc: 'Findings translated into plain language.' },
  { icon: DoctorIcon, title: 'You decide, with your doctor', desc: 'MedLens supports the conversation, not replaces it.' },
]

const TRUST_POINTS = [
  { icon: ShieldIcon, title: 'Not a diagnosis', desc: 'Every result is AI-generated decision support, clearly labeled as such — never a confirmed diagnosis.' },
  { icon: EyeIcon, title: 'Explainable, not a black box', desc: 'X-ray results include a Grad-CAM heatmap so you can see what the model actually focused on.' },
  { icon: LockIcon, title: 'History stays local', desc: 'Your past analyses are stored only in this browser — never sent to or stored on a server.' },
]

function timeAgo(timestamp) {
  const mins = Math.floor((Date.now() - timestamp) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [result, setResult] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [resetCounter, setResetCounter] = useState(0)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch { /* ignore corrupted local storage */ }
  }, [])

  const addHistoryEntry = (entry) => {
    setHistory((prev) => {
      const next = [{ id: `${entry.timestamp}-${Math.random().toString(36).slice(2, 7)}`, ...entry }, ...prev].slice(0, MAX_HISTORY)
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)) } catch { /* storage full */ }
      return next
    })
  }

  const clearHistory = () => {
    setHistory([])
    try { localStorage.removeItem(HISTORY_KEY) } catch { /* ignore */ }
  }

  const endpoint = tab === 'xray' ? '/api/xray/analyze' : '/api/report/analyze'
  const accept = tab === 'xray' ? 'image/*' : 'image/*,application/pdf'
  const hint = tab === 'xray' ? 'Chest X-ray — JPG or PNG' : 'Lab report or prescription — PDF, JPG, or PNG'

  const goToTab = (next) => {
    setTab(next)
    setResult(null)
    setError(null)
    setPreviewUrl(null)
    setMobileNavOpen(false)
  }

  const analyzeAnother = () => {
    setResult(null)
    setError(null)
    setPreviewUrl(null)
    setResetCounter((c) => c + 1)
  }

  const handleSubmit = async (file, preview) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setPreviewUrl(preview || null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Something went wrong.')
      setResult(data)

      addHistoryEntry({
        type: data.source_type,
        summary: data.source_type === 'xray'
          ? `${data.details?.label || ''} — ${data.summary}`.slice(0, 90)
          : (data.summary || '').slice(0, 90),
        urgency: data.urgency,
        confidence: typeof data.confidence === 'number' ? data.confidence : null,
        timestamp: Date.now(),
      })
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const isModuleTab = tab === 'xray' || tab === 'report'
  const currentLabel = TABS.find((t) => t.id === tab)?.label
  const lastAnalysis = history[0]

  const NavList = ({ onNavigate }) => (
    <nav className="sidebar-nav">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button key={id} className={`nav-item ${tab === id ? 'active' : ''}`} onClick={() => onNavigate(id)} title={label}>
          <span className="nav-icon"><Icon /></span>
          <span className="nav-label">{label}</span>
          {id === 'history' && history.length > 0 && <span className="count-pill">{history.length}</span>}
        </button>
      ))}
    </nav>
  )

  return (
    <>
      <div className="mobile-topbar">
        <button className="hamburger-btn" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation">
          <MenuIcon />
        </button>
        <div className="brand">
          <div className="brand-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="brand-text"><div className="name">MedLens AI</div></div>
        </div>
        <span style={{ width: 38 }} />
      </div>

      <div className={`drawer-backdrop ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(false)} />
      <div className={`drawer ${mobileNavOpen ? 'open' : ''}`}>
        <button className="drawer-close" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><CloseIcon /></button>
        <div className="sidebar-nav-label">Modules</div>
        <NavList onNavigate={goToTab} />
      </div>

      <div className={`app-shell ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="brand">
              <div className="brand-mark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="brand-text">
                <div className="name">MedLens AI</div>
                <div className="tagline">AI health companion</div>
              </div>
            </div>
            <button className="sidebar-toggle" onClick={() => setSidebarCollapsed((v) => !v)} aria-label="Toggle sidebar">
              <ChevronIcon />
            </button>
          </div>

          <div>
            <div className="sidebar-nav-label">Modules</div>
            <NavList onNavigate={goToTab} />
          </div>

          <div className="sidebar-footer">
            AI-assisted insights. Designed to support, not replace, professional medical care.
          </div>
        </aside>

        <div>
          <div className="top-bar">
            <span className="top-bar-crumb">MedLens AI / <strong>{currentLabel}</strong></span>
            {lastAnalysis && <span>Last analysis: {timeAgo(lastAnalysis.timestamp)}</span>}
          </div>

          <main className="main-content">
            <div className="page-container">

              {tab === 'home' && (
                <>
                  <div className="home-hero-grid">
                    <div className="page-header home-hero fade-up" style={{ margin: 0 }}>
                      <span className="page-eyebrow"><span className="pulse-dot" />AI health companion</span>
                      <h1>Understand your health information with AI-powered clarity.</h1>
                      <p className="subtitle">
                        MedLens helps you make sense of medical images, reports, and symptoms in plain
                        language — with clear reasoning and an honest urgency read, not a diagnosis.
                      </p>
                      <div className="home-cta-row">
                        <button className="btn-secondary" onClick={() => goToTab('xray')} style={{ maxWidth: 220 }}>Start an analysis</button>
                      </div>
                    </div>
                    <div className="hero-visual">
                      <div className="hero-visual-img-wrap">
                        <div className="hero-visual-glow" />
                        <img
                          src="/hero-illustration.png"
                          alt="Illustration of a medical scan being analyzed by AI and explained in plain language"
                          className="hero-visual-img"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="quick-start">
                    <p className="section-title">Quick start</p>
                    <div className="quick-start-steps">
                      {QUICK_START.map((s, i) => (
                        <div className="quick-start-step" key={s.title}>
                          <div className="quick-start-number">{i + 1}</div>
                          <div>
                            <div className="quick-start-step-title">{s.title}</div>
                            <div className="quick-start-step-desc">{s.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="section-title">Choose a module</p>
                  <div className="module-card-grid">
                    {MODULES.map(({ id, title, tag, accent, desc, icon: Icon }) => (
                      <button key={id} className={`module-card ${id === 'xray' ? 'featured' : ''}`} style={{ '--accent-bar': accent }} onClick={() => goToTab(id)}>
                        <div className="module-card-icon" style={{ background: `${accent}1A`, color: accent }}><Icon /></div>
                        <div className="module-card-tag">{tag}</div>
                        <div className="module-card-title">{title}</div>
                        <div className="module-card-desc">{desc}</div>
                        <div className="module-card-link">Open →</div>
                      </button>
                    ))}
                  </div>

                  {history.length > 0 && (
                    <div>
                      <div className="section-title-row">
                        <p className="section-title">Recent activity</p>
                        <button className="view-all-link" onClick={() => goToTab('history')}>View all →</button>
                      </div>
                      <HistoryPanel entries={history.slice(0, 3)} compact />
                    </div>
                  )}

                  <div className="how-it-works">
                    <p className="section-title">How MedLens works</p>
                    <div className="how-it-works-row">
                      {HOW_IT_WORKS.map((s) => (
                        <div className="how-it-works-item" key={s.title}>
                          <div className="how-it-works-icon"><s.icon /></div>
                          <div className="how-it-works-title">{s.title}</div>
                          <div className="how-it-works-desc">{s.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="trust-section">
                    <p className="trust-section-title">Built with safety in mind</p>
                    <div className="trust-grid">
                      {TRUST_POINTS.map((t) => (
                        <div className="trust-item" key={t.title}>
                          <div className="trust-icon"><t.icon /></div>
                          <div>
                            <div className="trust-item-title">{t.title}</div>
                            <div className="trust-item-desc">{t.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="home-disclaimer">
                    MedLens AI provides AI-generated, informational output only. It does not replace
                    professional medical evaluation. If you are experiencing a medical emergency,
                    contact local emergency services immediately.
                  </p>
                </>
              )}

              {tab !== 'home' && (
                <div className="page-header fade-up">
                  <span className="page-eyebrow"><span className="pulse-dot" />{currentLabel} module</span>
                  <h1>
                    {tab === 'xray' && 'Chest X-ray analysis'}
                    {tab === 'report' && 'Lab report analysis'}
                    {tab === 'symptom' && 'Symptom checker'}
                    {tab === 'history' && 'Your history'}
                  </h1>
                  <p className="subtitle">
                    {tab === 'xray' && 'Upload a chest X-ray for an AI-assisted explanation and visual reasoning.'}
                    {tab === 'report' && 'Upload a lab report or prescription to get it explained in plain language.'}
                    {tab === 'symptom' && "Describe how you're feeling for a general, non-diagnostic read."}
                    {tab === 'history' && 'Your past analyses, kept locally in this browser.'}
                  </p>
                </div>
              )}

              {isModuleTab && (
                <div className="content-grid">
                  <div className="upload-column">
                    <div className="card">
                      <p className="card-title">{tab === 'xray' ? 'Upload X-ray' : 'Upload report'}</p>
                      <p className="card-subtitle">{hint}</p>
                      <UploadZone key={`${tab}-${resetCounter}`} accept={accept} hint={hint} onSubmit={handleSubmit} loading={loading} />
                      {error && (
                        <div className="error-box">
                          <div className="error-box-title">Something went wrong.</div>
                          <div className="error-box-detail">{error}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="card">
                      <p className="card-title">Result</p>
                      <p className="card-subtitle">Plain-language, explainable, one verdict.</p>
                      {loading ? (
                        <div className="result-loading">
                          <div className="spinner" />
                          <div className="result-loading-title">
                            {tab === 'xray' ? 'Analyzing your X-ray…' : 'Analyzing your report…'}
                          </div>
                          <div className="result-loading-desc">
                            MedLens AI is processing the {tab === 'xray' ? 'image' : 'document'} — this usually takes a few seconds.
                          </div>
                        </div>
                      ) : result ? (
                        <ResultCard result={result} originalPreviewUrl={previewUrl} onAnalyzeAnother={analyzeAnother} />
                      ) : (
                        <div className="result-placeholder">
                          <div className="result-placeholder-icon"><ResultPlaceholderIcon /></div>
                          Upload a file to see a plain-language explanation, an urgency verdict, and
                          the model's reasoning — all in one place.
                        </div>
                      )}
                    </div>

                    {result?.source_type === 'report' && result?.details?.full_text && (
                      <div className="card" style={{ marginTop: 16 }}>
                        <ReportChat reportText={result.details.full_text} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tab === 'symptom' && <SymptomChecker onEntryLogged={addHistoryEntry} />}

              {tab === 'history' && <HistoryPanel entries={history} onClear={clearHistory} />}

            </div>
          </main>
        </div>
      </div>
    </>
  )
}
