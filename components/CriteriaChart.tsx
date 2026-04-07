'use client'

interface CriteriaData {
  clarity: number
  knowledge: number
  methodology: number
  punctuality: number
  treatment: number
  rigor: number
}

interface Props {
  data: CriteriaData
}

const CRITERIA = [
  { key: 'clarity',     label: 'Claridad',    icon: '💡' },
  { key: 'knowledge',   label: 'Dominio',     icon: '🎓' },
  { key: 'methodology', label: 'Metodología', icon: '📚' },
  { key: 'punctuality', label: 'Puntualidad', icon: '⏰' },
  { key: 'treatment',   label: 'Trato',       icon: '🤝' },
  { key: 'rigor',       label: 'Exigencia',   icon: '📊' },
] as const

function getBarColor(value: number): string {
  if (value >= 4.5) return 'bg-green-500'
  if (value >= 4)   return 'bg-green-400'
  if (value >= 3)   return 'bg-yellow-400'
  if (value >= 2)   return 'bg-orange-400'
  return 'bg-red-400'
}

function getTextColor(value: number): string {
  if (value >= 4.5) return 'text-green-600 dark:text-green-400'
  if (value >= 4)   return 'text-green-600 dark:text-green-400'
  if (value >= 3)   return 'text-yellow-600 dark:text-yellow-400'
  if (value >= 2)   return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

export default function CriteriaChart({ data }: Props) {
  const overall = Object.values(data).reduce((a, b) => a + b, 0) / Object.values(data).length

  return (
    <div>
      {/* Resumen general */}
      <div className="flex items-center gap-4 mb-5 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className={`text-4xl font-black ${getTextColor(overall)}`}>
          {overall.toFixed(1)}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Promedio general</p>
          <div className="flex mt-1">
            {[1, 2, 3, 4, 5].map(s => (
              <svg
                key={s}
                className={`w-4 h-4 ${s <= Math.round(overall) ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* Barras por criterio */}
      <div className="space-y-3">
        {CRITERIA.map(({ key, label, icon }) => {
          const value = data[key] || 0
          const pct = (value / 5) * 100

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {icon} {label}
                </span>
                <span className={`text-xs font-black ${getTextColor(value)}`}>
                  {value.toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${getBarColor(value)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
        {[
          { color: 'bg-green-500', label: 'Excelente (4.5–5)' },
          { color: 'bg-yellow-400', label: 'Regular (3–4)' },
          { color: 'bg-red-400', label: 'Bajo (1–2)' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}