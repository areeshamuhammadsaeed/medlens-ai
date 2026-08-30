import ConfidenceGauge from './ConfidenceGauge.jsx'
import CompareSlider from './CompareSlider.jsx'

const URGENCY_LABEL = {
  monitor: 'Monitor',
  see_doctor_soon: 'See a doctor soon',
  urgent: 'Seek care promptly',
}

export default function ResultCard({ result, originalPreviewUrl }) {
  if (!result) {
    return (
      <div className="result-placeholder">
        Upload a chest X-ray or lab report to see a plain-language explanation,
        an urgency verdict, and the model's reasoning — all in one place.
      </div>
    )
  }

  const { source_type, summary, urgency, urgency_reason, confidence, details, disclaimer } = result

  return (
    <div className="result">
      <div className="fade-up" style={{ animationDelay: '0ms' }}>
        <span className={`urgency-badge ${urgency}`}>
          <span className="dot" />
          {URGENCY_LABEL[urgency] || urgency}
        </span>
      </div>

      <p className="result-summary fade-up" style={{ animationDelay: '60ms' }}>
        {summary}
      </p>

      {source_type === 'xray' && details?.heatmap_base64 && (
        <div className="fade-up" style={{ animationDelay: '120ms' }}>
          <div className="xray-result-row">
            {originalPreviewUrl ? (
              <CompareSlider
                beforeSrc={originalPreviewUrl}
                afterSrc={`data:image/png;base64,${details.heatmap_base64}`}
                beforeLabel="Original"
                afterLabel="Grad-CAM"
              />
            ) : (
              <img
                className="preview-thumb"
                src={`data:image/png;base64,${details.heatmap_base64}`}
                alt="Grad-CAM heatmap showing which regions influenced the prediction"
              />
            )}
            <ConfidenceGauge value={confidence} urgency={urgency} label={details.label} />
          </div>
        </div>
      )}

      {source_type === 'report' && (
        <div className="fade-up" style={{ animationDelay: '120ms' }}>
          {details?.red_flags?.length > 0 ? (
            details.red_flags.map((flag, i) => (
              <div className="red-flag" key={i}>
                <div className="term">{flag.term}</div>
                <div className="value">
                  {flag.value}
                  {flag.normal_range ? ` · normal range: ${flag.normal_range}` : ''}
                </div>
                <div className="explanation">{flag.explanation}</div>
              </div>
            ))
          ) : (
            <div className="no-flags-note">No values outside the normal range were identified.</div>
          )}
        </div>
      )}

      <p
        className="fade-up"
        style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 14, animationDelay: '180ms' }}
      >
        {urgency_reason}
      </p>

      <p className="disclaimer fade-up" style={{ animationDelay: '220ms' }}>
        {disclaimer}
      </p>
    </div>
  )
}
