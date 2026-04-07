'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CRITERIA = [
  { key: 'clarity',     label: 'Claridad',     icon: '💡' },
  { key: 'knowledge',   label: 'Dominio',       icon: '🎓' },
  { key: 'methodology', label: 'Metodología',   icon: '📚' },
  { key: 'punctuality', label: 'Puntualidad',   icon: '⏰' },
  { key: 'treatment',   label: 'Trato',         icon: '🤝' },
  { key: 'rigor',       label: 'Exigencia',     icon: '📊' },
] as const

const SCORE_LABELS: Record<number, string> = {
  1: 'Muy malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Excelente',
}

interface Professor {
  id: string
  full_name: string
  university: string
  department: string | null
}

interface Evaluation {
  id: string
  avg_score: number
  created_at: string
  comment: string | null
  clarity: number
  knowledge: number
  methodology: number
  punctuality: number
  treatment: number
  rigor: number
  professors: Professor
}

export default function DashboardClient({
  evals: initialEvals,
}: {
  evals: Evaluation[]
}) {
  const router                          = useRouter()
  const [evals, setEvals]               = useState<Evaluation[]>(initialEvals)
  const [editingId, setEditingId]       = useState<string | null>(null)
  const [deletingId, setDeletingId]     = useState<string | null>(null)
  const [toast, setToast]               = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const withComment = evals.filter(e => e.comment && e.comment.trim().length > 0).length

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res  = await fetch(`/api/evaluations/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEvals(prev => prev.filter(e => e.id !== id))
      showToast('Evaluación eliminada correctamente', 'success')
      router.refresh()
    } catch (err: any) {
      showToast(err.message || 'Error al eliminar', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 100,
          padding: '0.75rem 1.25rem', borderRadius: '0.75rem',
          backgroundColor: toast.type === 'success' ? '#16a34a' : '#dc2626',
          color: 'white', fontWeight: 600, fontSize: '0.875rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Evaluaciones',     value: evals.length, icon: '📝', color: '#4f46e5' },
          { label: 'Con comentario',   value: withComment,  icon: '💬', color: '#16a34a' },
          { label: 'Profesores eval.', value: evals.length, icon: '👨‍🏫', color: '#ca8a04' },
        ].map(stat => (
          <div key={stat.label} className="card p-5 text-center">
            <p style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{stat.icon}</p>
            <p className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="card p-6 mb-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bold" style={{ color: '#111827' }}>
            ¿Tienes un nuevo profesor que evaluar?
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Busca por nombre y comparte tu experiencia de forma anónima.
          </p>
        </div>
        <Link href="/professors" className="btn-primary" style={{ flexShrink: 0 }}>
          Evaluar ahora
        </Link>
      </div>

      {/* Lista */}
      <h2 className="text-lg font-bold mb-4" style={{ color: '#111827' }}>
        Mis evaluaciones
      </h2>

      {evals.length === 0 ? (
        <div className="card p-10 text-center">
          <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</p>
          <p className="font-medium mb-2" style={{ color: '#4b5563' }}>
            Aún no has evaluado a ningún profesor
          </p>
          <Link href="/professors" className="text-sm" style={{ color: '#4f46e5' }}>
            Ir a buscar profesores →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {evals.map(e => (
            <div key={e.id}>
              {editingId === e.id ? (
                <EditEvaluationCard
                  evaluation={e}
                  onCancel={() => setEditingId(null)}
                  onSuccess={(updated) => {
                    setEvals(prev =>
                      prev.map(ev => ev.id === updated.id ? { ...ev, ...updated } : ev)
                    )
                    setEditingId(null)
                    showToast('Evaluación actualizada correctamente', 'success')
                    router.refresh()
                  }}
                  onError={(msg) => showToast(msg, 'error')}
                />
              ) : (
                <EvaluationCard
                  evaluation={e}
                  deleting={deletingId === e.id}
                  onEdit={() => setEditingId(e.id)}
                  onDelete={() => handleDelete(e.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Tarjeta de evaluación ─────────────────────────────────────────────────────

function EvaluationCard({
  evaluation: e,
  deleting,
  onEdit,
  onDelete,
}: {
  evaluation: Evaluation
  deleting: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const [showConfirm, setShowConfirm] = useState(false)

  const ratingColor =
    e.avg_score >= 4 ? '#16a34a' :
    e.avg_score >= 3 ? '#ca8a04' : '#dc2626'

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
          <div style={{
            width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem',
            backgroundColor: '#eef2ff', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontWeight: 900, color: '#4f46e5', fontSize: '1rem' }}>
              {e.professors?.full_name?.split(' ')[0]?.[0] || '?'}
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <Link
              href={`/professors/${e.professors?.id}`}
              style={{
                fontWeight: 700, color: '#111827', textDecoration: 'none',
                fontSize: '0.9375rem', display: 'block',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              {e.professors?.full_name}
            </Link>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.125rem' }}>
              {e.professors?.university}
              {e.professors?.department ? ` — ${e.professors.department}` : ''}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.125rem' }}>
              {new Date(e.created_at).toLocaleDateString('es-PE', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 900, color: ratingColor }}>
            {e.avg_score?.toFixed(1)}
          </p>
          <p style={{ fontSize: '0.7rem', color: '#9ca3af' }}>de 5.0</p>
        </div>
      </div>

      {/* Criterios */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {CRITERIA.map(({ key, label, icon }) => (
          <div key={key} style={{
            backgroundColor: '#f9fafb', borderRadius: '0.5rem',
            padding: '0.375rem 0.5rem', textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{icon} {label}</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginTop: '0.125rem' }}>
              {(e as any)[key]}/5
            </p>
          </div>
        ))}
      </div>

      {/* Comentario */}
      {e.comment ? (
        <div style={{
          backgroundColor: '#f0f9ff', borderLeft: '3px solid #4f46e5',
          borderRadius: '0 0.5rem 0.5rem 0',
          padding: '0.75rem', marginBottom: '1rem',
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4f46e5', marginBottom: '0.25rem' }}>
            💬 Tu comentario
          </p>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
            "{e.comment}"
          </p>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#f9fafb', borderRadius: '0.5rem',
          padding: '0.5rem 0.75rem', marginBottom: '1rem',
        }}>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            Sin comentario — edita para agregar uno
          </p>
        </div>
      )}

      {/* Acciones */}
      {!showConfirm ? (
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="btn-secondary"
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              flex: 1, padding: '0.5rem', fontSize: '0.875rem',
              backgroundColor: '#fef2f2', color: '#dc2626',
              border: '1px solid #fecaca', borderRadius: '0.75rem',
              cursor: 'pointer', fontWeight: 600,
            }}
          >
            🗑️ Eliminar
          </button>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: '0.75rem', padding: '0.875rem',
        }}>
          <p style={{ fontSize: '0.875rem', color: '#b91c1c', marginBottom: '0.75rem', fontWeight: 600 }}>
            ¿Eliminar esta evaluación? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="btn-secondary"
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}
            >
              Cancelar
            </button>
            <button
              onClick={onDelete}
              disabled={deleting}
              style={{
                flex: 1, padding: '0.5rem', fontSize: '0.875rem',
                backgroundColor: deleting ? '#fca5a5' : '#dc2626',
                color: 'white', border: 'none', borderRadius: '0.75rem',
                cursor: deleting ? 'not-allowed' : 'pointer', fontWeight: 600,
              }}
            >
              {deleting ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Formulario de edición ─────────────────────────────────────────────────────

function EditEvaluationCard({
  evaluation: e,
  onCancel,
  onSuccess,
  onError,
}: {
  evaluation: Evaluation
  onCancel: () => void
  onSuccess: (updated: any) => void
  onError: (msg: string) => void
}) {
  const [scores, setScores]   = useState<Record<string, number>>({
    clarity:     e.clarity,
    knowledge:   e.knowledge,
    methodology: e.methodology,
    punctuality: e.punctuality,
    treatment:   e.treatment,
    rigor:       e.rigor,
  })
  const [comment, setComment] = useState(e.comment || '')
  const [loading, setLoading] = useState(false)

  const avgScore    = Object.values(scores).reduce((a, b) => a + b, 0) / 6
  const ratingColor = avgScore >= 4 ? '#16a34a' : avgScore >= 3 ? '#ca8a04' : '#dc2626'

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/evaluations/${e.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...scores, comment: comment.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onSuccess({
        id:        e.id,
        ...scores,
        comment:   data.evaluation.comment,
        avg_score: data.evaluation.avg_score,
      })
    } catch (err: any) {
      onError(err.message || 'Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-5" style={{ border: '2px solid #4f46e5' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-bold" style={{ color: '#111827' }}>{e.professors?.full_name}</p>
          <p className="text-xs" style={{ color: '#6b7280' }}>{e.professors?.university}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 900, color: ratingColor }}>
            {avgScore.toFixed(1)}
          </p>
          <p style={{ fontSize: '0.7rem', color: '#9ca3af' }}>de 5.0</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Criterios */}
        {CRITERIA.map(({ key, label, icon }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                {icon} {label}
              </span>
              {scores[key] && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5' }}>
                  {SCORE_LABELS[scores[key]]}
                </span>
              )}
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setScores(s => ({ ...s, [key]: n }))}
                  style={{
                    flex: 1, height: '2.25rem', borderRadius: '0.5rem',
                    fontSize: '0.875rem', fontWeight: 700,
                    cursor: 'pointer', border: 'none',
                    transition: 'all 0.15s',
                    backgroundColor: scores[key] === n ? '#4f46e5' : '#f3f4f6',
                    color:           scores[key] === n ? 'white'   : '#6b7280',
                    transform:       scores[key] === n ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Comentario */}
        <div>
          <label style={{
            display: 'block', fontSize: '0.875rem',
            fontWeight: 500, color: '#374151', marginBottom: '0.375rem',
          }}>
            💬 Comentario
            <span style={{ fontWeight: 400, color: '#9ca3af', marginLeft: '0.25rem' }}>
              (opcional)
            </span>
          </label>
          <textarea
            value={comment}
            onChange={ev => setComment(ev.target.value)}
            placeholder="Comparte tu experiencia de forma respetuosa y constructiva..."
            rows={3}
            maxLength={500}
            className="input-field"
            style={{ resize: 'none' }}
          />
          <div className="flex justify-between mt-1">
            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Comentarios ofensivos se eliminarán automáticamente
            </p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              {comment.length}/500
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            style={{ flex: 1 }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ flex: 1 }}
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}