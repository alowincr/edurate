'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  professorId: string
  professorName: string
}

const CRITERIA = [
  { key: 'clarity',     label: 'Claridad al explicar',         icon: '💡', description: '¿Explica con claridad los conceptos?' },
  { key: 'knowledge',   label: 'Dominio del tema',              icon: '🎓', description: '¿Demuestra conocimiento profundo?' },
  { key: 'methodology', label: 'Metodología de enseñanza',     icon: '📚', description: '¿Sus métodos son efectivos?' },
  { key: 'punctuality', label: 'Puntualidad y responsabilidad', icon: '⏰', description: '¿Es puntual y responsable?' },
  { key: 'treatment',   label: 'Trato al estudiante',           icon: '🤝', description: '¿Trata bien a los estudiantes?' },
  { key: 'rigor',       label: 'Nivel de exigencia',            icon: '📊', description: '¿El nivel de exigencia es adecuado?' },
] as const

const SCORE_LABELS: Record<number, string> = {
  1: 'Muy malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Excelente',
}

type Scores = Partial<Record<string, number>>

type Status = 'idle' | 'loading' | 'success' | 'error' | 'already_evaluated' | 'not_logged'

export default function EvaluationForm({ professorId, professorName }: Props) {
  const router = useRouter()
  const [scores, setScores] = useState<Scores>({})
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setIsLoggedIn(!!d.user))
      .catch(() => setIsLoggedIn(false))
  }, [])

  const completedCount = Object.keys(scores).length
  const isComplete = completedCount === CRITERIA.length
  const avgScore = isComplete
    ? Object.values(scores).reduce((a, b) => (a as number) + (b as number), 0) as number / CRITERIA.length
    : 0

  const avgColor =
    avgScore >= 4 ? 'text-green-600' :
    avgScore >= 3 ? 'text-yellow-600' :
    avgScore > 0  ? 'text-red-500'   : 'text-indigo-600'

  async function handleSubmit() {
    if (!isComplete) return
    if (!isLoggedIn) {
      setStatus('not_logged')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professor_id: professorId,
          ...scores,
          comment: comment.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setStatus('already_evaluated')
        } else if (res.status === 401) {
          setStatus('not_logged')
        } else {
          setStatus('error')
          setMessage(data.error || 'Error al enviar evaluación')
        }
        return
      }

      setStatus('success')
      setMessage(data.message)
      router.refresh()
    } catch {
      setStatus('error')
      setMessage('Error de conexión. Intenta de nuevo.')
    }
  }

  // Estados especiales
  if (status === 'success') {
    return (
      <div className="card p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          ¡Evaluación enviada!
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          {message}
        </p>
      </div>
    )
  }

  if (status === 'already_evaluated') {
    return (
      <div className="card p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Ya evaluaste a este profesor
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          Solo se permite una evaluación por docente para garantizar la imparcialidad.
        </p>
      </div>
    )
  }

  if (status === 'not_logged' || isLoggedIn === false) {
    return (
      <div className="card p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🔒</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Inicia sesión para evaluar
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-xs">
          Necesitas verificar tu correo institucional para enviar evaluaciones.
        </p>
        <a href="/auth" className="btn-primary text-sm py-2.5 px-6">
          Ingresar con correo institucional
        </a>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Evaluar docente
        </h2>
        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
          {completedCount}/{CRITERIA.length} criterios
        </span>
      </div>

      {/* Criterios */}
      <div className="space-y-4 mb-5">
        {CRITERIA.map(({ key, label, icon, description }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {icon} {label}
              </span>
              {scores[key] && (
                <span className="text-xs font-bold text-indigo-600">
                  {SCORE_LABELS[scores[key]!]}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-2">{description}</p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setScores(s => ({ ...s, [key]: n }))}
                  className={`flex-1 h-9 rounded-lg text-sm font-bold transition-all duration-150
                    ${scores[key] === n
                      ? 'bg-indigo-600 text-white shadow-sm scale-105'
                      : scores[key] && scores[key]! > n
                        ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600'
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Promedio preview */}
      {isComplete && (
        <div className="mb-5 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Tu calificación final</p>
            <p className="text-xs text-gray-400">{professorName}</p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-black ${avgColor}`}>
              {avgScore.toFixed(1)}
            </p>
            <p className="text-xs text-gray-400">de 5.0</p>
          </div>
        </div>
      )}

      {/* Comentario */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Comentario constructivo
          <span className="text-gray-400 font-normal ml-1">(opcional)</span>
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Comparte tu experiencia de forma respetuosa y constructiva. ¿Qué destacarías? ¿Qué podría mejorar?"
          rows={3}
          maxLength={500}
          className="input-field resize-none"
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-400">
            Sé constructivo y respetuoso. Comentarios ofensivos serán moderados.
          </p>
          <p className="text-xs text-gray-400 shrink-0 ml-2">
            {comment.length}/500
          </p>
        </div>
      </div>

      {/* Error */}
      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
          {message}
        </div>
      )}

      {/* Aviso de anonimato */}
      <div className="mb-4 flex items-start gap-2 text-xs text-gray-400">
        <span className="shrink-0 mt-0.5">🔒</span>
        <p>Tu identidad permanece completamente anónima. El profesor no sabrá quién evaluó.</p>
      </div>

      {/* Botón submit */}
      <button
        onClick={handleSubmit}
        disabled={!isComplete || status === 'loading'}
        className="btn-primary w-full"
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Enviando...
          </span>
        ) : !isComplete ? (
          `Completa los ${CRITERIA.length - completedCount} criterios restantes`
        ) : (
          'Enviar evaluación anónima'
        )}
      </button>
    </div>
  )
}