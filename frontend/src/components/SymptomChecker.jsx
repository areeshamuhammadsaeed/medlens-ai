import { useState, useRef, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const URGENCY_LABEL = {
  monitor: 'Monitor',
  see_doctor_soon: 'See a doctor soon',
  urgent: 'Seek care promptly',
}

const STARTERS = [
  "I've had a headache for two days",
  "I have a sore throat and mild fever",
  "My stomach has hurt since this morning",
]

export default function SymptomChecker({ onEntryLogged }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const send = async (overrideText) => {
    const message = (overrideText ?? input).trim()
    if (!message || loading) return

    const nextHistory = [...messages, { role: 'user', content: message }]
    setMessages(nextHistory)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/symptom/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: messages, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Something went wrong.')
      setMessages([...nextHistory, { role: 'assistant', content: data.answer, urgency: data.urgency_hint }])

      if (data.urgency_hint && onEntryLogged) {
        onEntryLogged({
          type: 'symptom',
          summary: message.slice(0, 80),
          urgency: data.urgency_hint,
          timestamp: Date.now(),
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <p className="card-title">Symptom checker</p>
      <p className="card-subtitle">Describe how you're feeling — a conversation, not a diagnosis.</p>

      {messages.length === 0 ? (
        <div className="chat-empty-state">
          <span>What's going on? Try describing your main symptom to start.</span>
          <div className="chat-suggestion-row">
            {STARTERS.map((s) => (
              <button key={s} className="chat-suggestion-chip" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-thread" ref={scrollRef} style={{ maxHeight: 420 }}>
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`}>
              {m.role === 'assistant' && m.urgency && (
                <div className={`urgency-badge small ${m.urgency}`}>
                  <span className="dot" />{URGENCY_LABEL[m.urgency] || m.urgency}
                </div>
              )}
              <div style={{ marginTop: m.urgency ? 6 : 0 }}>{m.content}</div>
            </div>
          ))}
          {loading && <div className="chat-bubble assistant chat-typing"><span /><span /><span /></div>}
        </div>
      )}

      {error && <div className="error-box" style={{ marginTop: 10 }}>{error}</div>}

      <div className="chat-input-row" style={{ marginTop: 14 }}>
        <input
          type="text" value={input} placeholder="Describe what you're experiencing…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          disabled={loading}
        />
        <button className="chat-send-btn" onClick={() => send()} disabled={!input.trim() || loading} aria-label="Send message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 12l16-8-6 8 6 8-16-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <p className="disclaimer">
        This is an AI-generated conversation, not a medical diagnosis. If you're experiencing
        a medical emergency, contact local emergency services immediately.
      </p>
    </div>
  )
}
