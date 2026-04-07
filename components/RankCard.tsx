'use client'

import Link from 'next/link'

interface Professor {
  id: string
  full_name: string
  university: string
  department: string | null
  avg_rating: number
  total_evaluations: number
}

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function RankCard({
  professor: p,
  rank,
  type,
}: {
  professor: Professor
  rank: number
  type: 'top' | 'bottom'
}) {
  const ratingColor =
    type === 'top'
      ? p.avg_rating >= 4 ? '#16a34a' : '#ca8a04'
      : p.avg_rating <= 2 ? '#dc2626' : '#ca8a04'

  return (
    <Link href={`/professors/${p.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="card"
        style={{
          padding: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.875rem',
          transition: 'transform 0.15s, box-shadow 0.15s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateX(4px)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.1)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateX(0)'
          e.currentTarget.style.boxShadow = ''
        }}
      >
        {/* Posición */}
        <div style={{
          width: '2.25rem', height: '2.25rem', borderRadius: '50%',
          backgroundColor: type === 'top' ? '#fef9c3' : '#fef2f2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          fontSize: rank <= 3 ? '1.125rem' : '0.875rem',
          fontWeight: 700,
          color: type === 'top' ? '#854d0e' : '#991b1b',
        }}>
          {MEDALS[rank] || `#${rank}`}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {p.full_name}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.125rem' }}>
            {p.university}
            {p.department ? ` — ${p.department}` : ''}
            {' · '}{p.total_evaluations} eval.
          </p>
        </div>

        {/* Rating */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 900, color: ratingColor, lineHeight: 1 }}>
            {p.avg_rating?.toFixed(1)}
          </p>
          <p style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>/ 5.0</p>
        </div>
      </div>
    </Link>
  )
}