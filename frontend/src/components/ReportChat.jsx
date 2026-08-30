import { useState, useRef, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const SUGGESTIONS = [
  "What does this mean for me?",
  "Which value is most concerning?",
  "What questions should I ask my doctor?",
]

export default function ReportChat({ reportText }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const send = async (overrideText) => {
    const question = (overrideText ?? input).trim()
    if (!question || loading) return

    const nextHistory = [...messages, { role: 'user', content: question }]
    setMessages(nextHistory)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/report/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_text: reportText, history: messages, question }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Something went wrong.')
      setMessages([...nextHistory, { role: 'assistant', content: data.answer }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-up" style={{ animationDelay: '260ms' }}>
      <p className="card-title" style={{ marginBottom: 2 }}>Ask about this report</p>
      <p className="card-subtitle">Answers stay grounded in this report only — not medical advice.</p>

      {messages.length === 0 ? (
        <div className="chat-empty-state">
          <span>Ask a follow-up question about your report.</span>
          <div className="chat-suggestion-row">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chat-suggestion-chip" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-thread" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`}>{m.content}</div>
          ))}
          {loading && (
            <div className="chat-bubble assistant chat-typing"><span /><span /><span /></div>
          )}
        </div>
      )}

      {error && <div className="error-box" style={{ marginTop: 10 }}>{error}</div>}

      <div className="chat-input-row" style={{ marginTop: 12 }}>
        <input
          type="text" value={input} placeholder="e.g. What does the blood pressure value mean?"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          disabled={loading}
        />
        <button className="chat-send-btn" onClick={() => send()} disabled={!input.trim() || loading} aria-label="Send question">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 12l16-8-6 8 6 8-16-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
