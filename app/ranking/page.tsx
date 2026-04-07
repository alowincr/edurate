import { supabaseAdmin } from '@/lib/supabase-admin'
import Navbar from '@/components/Navbar'
import RankCard from '@/components/RankCard'

export default async function RankingPage() {
  const { data: top } = await supabaseAdmin
    .from('professors')
    .select('id, full_name, university, department, avg_rating, total_evaluations')
    .gt('total_evaluations', 0)
    .order('avg_rating', { ascending: false })
    .limit(10)

  const { data: bottom } = await supabaseAdmin
    .from('professors')
    .select('id, full_name, university, department, avg_rating, total_evaluations')
    .gt('total_evaluations', 0)
    .order('avg_rating', { ascending: true })
    .limit(10)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navbar />
      <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 900, color: '#0f172a' }}>
            Ranking de profesores
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Basado en evaluaciones verificadas de estudiantes
          </p>
        </div>

        {(!top || top.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</p>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>
              Aún no hay datos para el ranking
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              El ranking aparecerá cuando haya profesores con evaluaciones.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}>
            {/* Top mejores */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>⭐</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Top 10 mejor valorados
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(top || []).map((p, i) => (
                  <RankCard key={p.id} professor={p} rank={i + 1} type="top" />
                ))}
              </div>
            </div>

            {/* Menor puntuación */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📉</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Menor puntuación
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(bottom || []).map((p, i) => (
                  <RankCard key={p.id} professor={p} rank={i + 1} type="bottom" />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}