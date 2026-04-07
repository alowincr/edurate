import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/session'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Navbar from '@/components/Navbar'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>
}) {
  const user = await getSessionUser()
  const params = await searchParams

  if (!user && params.verified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '3rem', height: '3rem', margin: '0 auto 1rem',
            border: '4px solid #4f46e5', borderTopColor: 'transparent',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
            Cargando tu panel...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <script dangerouslySetInnerHTML={{ __html: `setTimeout(() => window.location.reload(), 1500)` }} />
        </div>
      </div>
    )
  }

  if (!user) redirect('/auth')

  // ← Aquí están todos los campos necesarios incluyendo comment y criterios
  const { data: myEvals } = await supabaseAdmin
    .from('evaluations')
    .select(`
      id,
      avg_score,
      created_at,
      comment,
      clarity,
      knowledge,
      methodology,
      punctuality,
      treatment,
      rigor,
      professors (id, full_name, university, department)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const evals = myEvals || []

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">

        {params.verified && (
          <div className="mb-6 p-4 rounded-xl flex items-center gap-3"
               style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: '1.5rem' }}>🎉</span>
            <div>
              <p className="font-bold" style={{ color: '#166534' }}>
                ¡Correo verificado exitosamente!
              </p>
              <p className="text-sm" style={{ color: '#16a34a' }}>
                Ya puedes evaluar a tus profesores.
              </p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-black" style={{ color: '#111827' }}>Mi Panel</h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>{user.email}</p>
        </div>

        {/* DashboardClient maneja todo lo interactivo */}
        <DashboardClient evals={evals as any} />

      </main>
    </div>
  )
}