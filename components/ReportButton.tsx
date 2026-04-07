'use client'

import { useState } from 'react'

const REASONS = [
  'Lenguaje ofensivo o insultos',
  'Información falsa o difamatoria',
  'Contenido irrelevante',
  'Acoso o intimidación',
  'Otro motivo',
]

export default function ReportButton({ evaluationId }: { evaluationId: string }) {
  const [open,    setOpen]    = useState(false)
  const [reason,  setReason]  = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reason) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evaluation_id: evaluationId, reason, details }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDone(true)
      setTimeout(() => { setOpen(false); setDone(false) }, 2500)
    } catch (err: any) {
      setError(err.message || 'Error al reportar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '0.75rem', color: '#94a3b8', padding: '0.25rem 0.5rem',
          borderRadius: '0.375rem', transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
        onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
      >
        🚩 Reportar
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className="card" style={{ width: '100%', maxWidth: '26rem', padding: '1.75rem' }}>
            {done ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</p>
                <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Reporte enviado</p>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Gracias por ayudarnos a mantener la comunidad.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Reportar evaluación</h3>
                  <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1.125rem' }}>✕</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                      Motivo del reporte
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {REASONS.map(r => (
                        <label key={r} style={{
                          display: 'flex', alignItems: 'center', gap: '0.625rem',
                          padding: '0.625rem', borderRadius: '0.625rem', cursor: 'pointer',
                          backgroundColor: reason === r ? '#eef2ff' : 'transparent',
                          border: `1px solid ${reason === r ? '#c7d2fe' : '#f1f5f9'}`,
                          transition: 'all 0.15s',
                        }}>
                          <input type="radio" name="reason" value={r}
                                 checked={reason === r} onChange={() => setReason(r)}
                                 style={{ accentColor: '#4f46e5' }} />
                          <span style={{ fontSize: '0.875rem', color: '#374151' }}>{r}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
                      Detalles adicionales
                      <span style={{ fontWeight: 400, color: '#9ca3af', marginLeft: '0.25rem' }}>(opcional)</span>
                    </label>
                    <textarea
                      value={details}
                      onChange={e => setDetails(e.target.value)}
                      placeholder="Explica por qué estás reportando esta evaluación..."
                      rows={3} maxLength={300}
                      className="input-field"
                      style={{ resize: 'none' }}
                    />
                  </div>

                  {error && (
                    <div style={{ padding: '0.625rem', borderRadius: '0.625rem', backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '0.875rem' }}>
                      {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.625rem' }}>
                    <button type="button" onClick={() => setOpen(false)} className="btn-secondary" style={{ flex: 1 }}>
                      Cancelar
                    </button>
                    <button type="submit" disabled={!reason || loading}
                            style={{
                              flex: 1, padding: '0.75rem', borderRadius: '0.875rem',
                              backgroundColor: !reason || loading ? '#fca5a5' : '#dc2626',
                              color: 'white', border: 'none', cursor: !reason ? 'not-allowed' : 'pointer',
                              fontWeight: 700, fontSize: '0.875rem',
                            }}>
                      {loading ? 'Enviando...' : '🚩 Enviar reporte'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}