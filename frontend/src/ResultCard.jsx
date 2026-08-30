import ConfidenceGauge from './ConfidenceGauge.jsx'
import CompareSlider from './CompareSlider.jsx'

const URGENCY_LABEL = {
  monitor: 'Monitor',
  see_doctor_soon: 'See a doctor soon',
  urgent: 'Seek care promptly',
}

export default function ResultCard({ result, originalPreviewUrl, onAnalyzeAnother }) {
  if (!result) return null

  const { source_type, summary, urgency, urgency_reason, confidence, details, disclaimer } = result

  return (
    <div className="result">
      <div className="fade-up" style={{ animationDelay: '0ms' }}>
        <span className={`urgency-badge ${urgency}`}>
          <span className="dot" />
          {URGENCY_LABEL[urgency] || urgency}
        </span>
      </div>

      <p className="result-summary fade-up" style={{ animationDelay: '60ms' }}>{summary}</p>

      {source_type === 'xray' && details?.heatmap_base64 && (
        <div className="fade-up" style={{ animationDelay: '120ms' }}>
          <p className="section-eyebrow-sm">AI visual explanation</p>
          <p className="section-eyebrow-desc">See which areas influenced the model's assessment.</p>
          <div className="xray-result-row">
            {originalPreviewUrl ? (
              <CompareSlider
                beforeSrc={originalPreviewUrl}
                afterSrc={`data:image/png;base64,${details.heatmap_base64}`}
                beforeLabel="Original" afterLabel="Grad-CAM"
              />
            ) : (
              <img className="preview-thumb" src={`data:image/png;base64,${details.heatmap_base64}`}
                alt="Grad-CAM heatmap showing which regions influenced the prediction" />
            )}
            <div>
              <div className="gauge-confidence-label">AI confidence</div>
              <ConfidenceGauge value={confidence} urgency={urgency} label={details.label} />
            </div>
          </div>
        </div>
      )}

      {source_type === 'report' && (
        <div className="fade-up" style={{ animationDelay: '120ms' }}>
          {details?.red_flags?.length > 0 ? (
            <>
              <p className="section-eyebrow-sm">Flagged values</p>
              <p className="section-eyebrow-desc">Values identified as outside the normal range for this report.</p>
              <div className="stat-card-grid">
                {details.red_flags.map((flag, i) => (
                  <div className="stat-card flagged" key={i}>
                    <div className="stat-card-term">{flag.term}</div>
                    <div className="stat-card-value">{flag.value}</div>
                    <div className="stat-card-status">Flagged</div>
                    {flag.normal_range && <div className="stat-card-range">Normal: {flag.normal_range}</div>}
                  </div>
                ))}
              </div>
              {details.red_flags.map((flag, i) => (
                <p key={i} className="stat-card-explanation" style={{ marginBottom: 8 }}>
                  <strong>{flag.term}:</strong> {flag.explanation}
                </p>
              ))}
            </>
          ) : (
            <div className="no-flags-note">No values outside the normal range were identified.</div>
          )}
        </div>
      )}

      <p className="fade-up" style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 14, animationDelay: '180ms' }}>
        {urgency_reason}
      </p>

      {onAnalyzeAnother && (
        <div className="result-actions fade-up" style={{ animationDelay: '200ms' }}>
          <button className="btn-ghost" onClick={onAnalyzeAnother}>
            {source_type === 'xray' ? 'Analyze another X-ray' : 'Analyze another report'}
          </button>
        </div>
      )}

      <p className="disclaimer fade-up" style={{ animationDelay: '220ms' }}>{disclaimer}</p>
    </div>
  )
}
