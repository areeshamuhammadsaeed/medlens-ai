import { useEffect, useState } from 'react'

const URGENCY_COLOR = {
  monitor: '#2E9370',
  see_doctor_soon: '#C9822C',
  urgent: '#E2604A',
}

export default function ConfidenceGauge({ value, urgency, label }) {
  const [animated, setAnimated] = useState(0)
  const size = 100
  const stroke = 9
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const color = URGENCY_COLOR[urgency] || '#8873E0'

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 80)
    return () => clearTimeout(t)
  }, [value])

  const offset = circumference * (1 - animated)

  return (
    <div className="gauge-block">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ECE7F7" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Quicksand, sans-serif"
          fontWeight="700"
          fontSize="21"
          fill="#2D2A3D"
        >
          {Math.round(value * 100)}%
        </text>
      </svg>
      <div className="gauge-label">{label}</div>
    </div>
  )
}
