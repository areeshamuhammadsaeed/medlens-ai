import { useState } from 'react'

export default function CompareSlider({ beforeSrc, afterSrc, beforeLabel, afterLabel }) {
  const [clip, setClip] = useState(50)

  return (
    <div>
      <div className="compare-slider" style={{ '--clip': `${100 - clip}%` }}>
        <img src={beforeSrc} alt={beforeLabel} className="img-before" />
        <img src={afterSrc} alt={afterLabel} className="img-after" />
        <div className="compare-handle" style={{ left: `${clip}%` }} />
        <input
          type="range"
          min="0"
          max="100"
          value={clip}
          onChange={(e) => setClip(Number(e.target.value))}
          className="compare-range"
          aria-label="Compare original image and heatmap"
        />
      </div>
      <div className="compare-caption-row">
        <span>{beforeLabel}</span>
        <span>{afterLabel}</span>
      </div>
    </div>
  )
}
