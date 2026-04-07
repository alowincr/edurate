'use client'

import { useState, useEffect } from 'react'

interface Professor {
  id: string
  full_name: string
  university: string
}

interface FlaggedEvaluation {
  id: string
  clarity: number
  knowledge: number
  methodology: number
  punctuality: number
  treatment: number
  rigor: number
  avg_score: number
  comment: string | null
  flag_reason: string | null
  created_at: string
  professors: Professor
}

const CRITERIA_SHORT: Record<string, string> = {
  clarity: 'Claridad',
  knowledge: 'Dominio',
  methodology: 'Metodología',
  punctuality: 'Puntualidad',
  treatment: 'Trato',
  rigor: 'Exigencia',
}

export default function AdminModerationPanel() {
  const [evaluations, setEvaluations] = useState<FlaggedEvaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchFlagged()
  }, [])

  async function fetchFlagged() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/moderate')
      const data = await res.json()
      setEvaluations(data.evaluations || [])
    } catch {
      showToast('Error cargando evaluaciones', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setProcessing(id)
    try {
      const res = await fetch('/api/admin/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evaluation_id: id, action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setEvaluations(prev => prev.filter(e => e.id !== id))
      showToast(
        action === 'approve' ? '✅ Evaluación aprobada' : '🗑️ Evaluación rechazada',
        'success'
      )
    } catch (err: any) {
      showToast(err.message || 'Error al procesar', 'error')
    } finally {
      setProcessing(null)
    }
  }

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('es-PE', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/3 mb-3" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-4" />
            <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded mb-4" />
            <div className="flex gap-3">
              <div className="h-9 bg-gray-100 dark:bg-gray-800 rounded w-24" />
              <div className="h-9 bg-gray-100 dark:bg-gray-800 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all
            ${toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* Contador */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {evaluations.length > 0 ? (
            <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-bold px-3 py-1 rounded-full">
              {evaluations.length} pendiente{evaluations.length !== 1 ? 's' : ''}
            </span>
          ) : (
            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold px-3 py-1 rounded-full">
              Todo al día ✓
            </span>
          )}
        </div>
        <button
          onClick={fetchFlagged}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>

      {/* Lista vacía */}
      {evaluations.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-5xl mb-4">🎉</p>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">
            No hay evaluaciones pendientes
          </h3>
          <p className="text-sm text-gray-400">
            Todas las evaluaciones han sido revisadas.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {evaluations.map(e => (
            <div key={e.id} className="card p-6 border-l-4 border-yellow-400">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {e.professors?.full_name || 'Profesor desconocido'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {e.professors?.university}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(e.created_at)}</p>
                </div>
                <div className="text-center bg-indigo-50 dark:bg-indigo-900/30 rounded-xl px-4 py-2">
                  <p className="text-xl font-black text-indigo-600">
                    {e.avg_score?.toFixed(1) || '—'}
                  </p>
                  <p className="text-xs text-gray-400">promedio</p>
                </div>
              </div>

              {/* Criterios */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {Object.entries(CRITERIA_SHORT).map(([key, label]) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {(e as any)[key] || '—'}
                    </p>
                  </div>
                ))}
              </div>

              {/* Comentario */}
              {e.comment && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Comentario del estudiante
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    "{e.comment}"
                  </p>
                </div>
              )}

              {/* Razón del flag */}
              {e.flag_reason && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 mb-1">
                    ⚠️ Razón del marcado automático
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    {e.flag_reason}
                  </p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(e.id, 'approve')}
                  disabled={processing === e.id}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-bold
                             py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing === e.id ? '...' : '✅ Aprobar'}
                </button>
                <button
                  onClick={() => handleAction(e.id, 'reject')}
                  disabled={processing === e.id}
                  className="flex-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50
                             text-red-700 dark:text-red-400 text-sm font-bold py-2.5 rounded-xl
                             transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing === e.id ? '...' : '🗑️ Rechazar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}