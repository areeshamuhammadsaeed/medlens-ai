const TYPE_LABEL = { xray: 'Chest X-ray', report: 'Lab report', symptom: 'Symptom check' }

const URGENCY_LABEL = {
  monitor: 'Normal',
  see_doctor_soon: 'Attention',
  urgent: 'Urgent',
}

function timeAgo(timestamp) {
  const diffMs = Date.now() - timestamp
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function TypeIcon({ type }) {
  if (type === 'xray') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M4 8V5a1 1 0 011-1h3M20 8V5a1 1 0 00-1-1h-3M4 16v3a1 1 0 001 1h3M20 16v3a1 1 0 01-1 1h-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (type === 'report') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.163-3.02-.462L3 21l1.5-4.5C3.55 15.16 3 13.63 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EntryRowCard({ e }) {
  return (
    <div className="history-item">
      <div className="history-icon"><TypeIcon type={e.type} /></div>
      <div className="history-item-main">
        <div className="history-item-title">{TYPE_LABEL[e.type] || e.type}</div>
        <div className="history-item-summary">{e.summary}</div>
        <div className="history-item-time">{timeAgo(e.timestamp)}</div>
      </div>
      {e.urgency && (
        <span className={`urgency-badge small ${e.urgency}`}>
          <span className="dot" />
        </span>
      )}
    </div>
  )
}

// `compact`: used when embedded inside another section (e.g. Home's "Recent
// activity") — suppresses the internal title/subtitle, the table view, and the
// clear-history action, which only makes sense on the full History page since
// it wipes everything, not just the visible slice.
export default function HistoryPanel({ entries, onClear, compact = false }) {
  if (!entries || entries.length === 0) {
    if (compact) return null
    return (
      <div className="card">
        <p className="card-title">History</p>
        <p className="card-subtitle">Your past analyses, kept locally in this browser.</p>
        <div className="history-empty">
          <span>No analyses yet. Start an analysis from a module to see it appear here.</span>
        </div>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="card">
        <div className="history-list">
          {entries.map((e) => <EntryRowCard e={e} key={e.id} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <p className="card-title">History</p>
      <p className="card-subtitle">Your past analyses, kept locally in this browser — not sent anywhere.</p>

      {/* Desktop: real table */}
      <div className="history-table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Result</th>
              <th>Confidence</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td>
                  <div className="history-table-type">
                    <span className="history-table-icon"><TypeIcon type={e.type} /></span>
                    {TYPE_LABEL[e.type] || e.type}
                  </div>
                </td>
                <td>
                  {e.urgency ? (
                    <span className={`urgency-badge small ${e.urgency}`}>
                      <span className="dot" />{URGENCY_LABEL[e.urgency] || e.urgency}
                    </span>
                  ) : '–'}
                </td>
                <td className="history-table-confidence">
                  {typeof e.confidence === 'number' ? `${Math.round(e.confidence * 100)}%` : '–'}
                </td>
                <td className="history-table-time">{timeAgo(e.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards (table hidden below 760px via CSS) */}
      <div className="history-list desktop-hidden">
        {entries.map((e) => <EntryRowCard e={e} key={e.id} />)}
      </div>

      <button className="history-clear-btn" onClick={onClear}>Clear history</button>
    </div>
  )
}
