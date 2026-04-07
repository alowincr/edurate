import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Navbar from '@/components/Navbar'
import EvaluationForm from '@/components/EvaluationForm'
import ReportButton from '@/components/ReportButton'


interface Props {
  params: Promise<{ id: string }>
}

const CRITERIA_LABELS: Record<string, string> = {
  clarity:     'Claridad al explicar',
  knowledge:   'Dominio del tema',
  methodology: 'Metodología',
  punctuality: 'Puntualidad',
  treatment:   'Trato al estudiante',
  rigor:       'Nivel de exigencia',
}

function avg(nums: number[]) {
  if (!nums.length) return 0
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-PE', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export default async function ProfessorProfilePage({ params }: Props) {
  const { id } = await params

  const { data: professor } = await supabaseAdmin
    .from('professors')
    .select('*, courses(id, name, code)')
    .eq('id', id)
    .single()

  if (!professor) notFound()

  const { data: evaluations } = await supabaseAdmin
    .from('evaluations')
    .select('id, clarity, knowledge, methodology, punctuality, treatment, rigor, avg_score, comment, created_at')
    .eq('professor_id', id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  const evals = evaluations || []

  const criteriaAvg = evals.length > 0 ? {
    clarity:     avg(evals.map(e => e.clarity)),
    knowledge:   avg(evals.map(e => e.knowledge)),
    methodology: avg(evals.map(e => e.methodology)),
    punctuality: avg(evals.map(e => e.punctuality)),
    treatment:   avg(evals.map(e => e.treatment)),
    rigor:       avg(evals.map(e => e.rigor)),
  } : null

  const initials = professor.full_name
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="card p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {professor.photo_url ? (
              <img
                src={professor.photo_url}
                alt={professor.full_name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <span className="text-2xl font-black text-indigo-600">{initials}</span>
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                {professor.full_name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">{professor.university}</p>
              {professor.department && (
                <p className="text-sm text-gray-400">{professor.department}</p>
              )}
              {professor.courses?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {professor.courses.map((c: { id: string; name: string; code: string }) => (
                    <span key={c.id} className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full font-medium">
                      {c.name} {c.code ? `(${c.code})` : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-5 min-w-[100px]">
              <p className="text-4xl font-black text-indigo-600">
                {professor.avg_rating > 0 ? professor.avg_rating.toFixed(1) : '—'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {evals.length} evaluación{evals.length !== 1 ? 'es' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Criterios */}
          {criteriaAvg ? (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
                Promedio por criterio
              </h2>
              <div className="space-y-4">
                {Object.entries(criteriaAvg).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {CRITERIA_LABELS[key]}
                      </span>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        {val}/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          val >= 4 ? 'bg-green-500' :
                          val >= 3 ? 'bg-yellow-500' : 'bg-red-400'
                        }`}
                        style={{ width: `${(val / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card p-6 flex items-center justify-center text-center">
              <div>
                <p className="text-4xl mb-3">📊</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Aún no hay evaluaciones para mostrar estadísticas
                </p>
              </div>
            </div>
          )}

          <EvaluationForm professorId={professor.id} professorName={professor.full_name} />
        </div>

        {/* Comentarios */}
        {evals.filter(e => e.comment).map(e => (
          <div key={e.id} style={{ borderLeft: '3px solid #e0e7ff', paddingLeft: '1rem', paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5' }}>
                ⭐ {e.avg_score?.toFixed(1) || '—'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formatDate(e.created_at)}</span>
                <ReportButton evaluationId={e.id} />
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
              {e.comment}
            </p>
          </div>
        ))}

        {evals.filter(e => e.comment).length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
              Comentarios de estudiantes
            </h2>
            <div className="space-y-4">
              {evals
                .filter(e => e.comment)
                .map(e => (
                  <div key={e.id} className="border-l-4 border-indigo-200 dark:border-indigo-800 pl-4 py-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-indigo-600">
                        ⭐ {e.avg_score?.toFixed(1) || '—'}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(e.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {e.comment}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}