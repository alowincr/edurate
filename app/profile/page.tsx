import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import Navbar from '@/components/Navbar'
import ProfileClient from '@/components/ProfileClient'

export default async function ProfilePage() {
  const user = await getSessionUser()
  if (!user) redirect('/auth')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navbar />
      <main style={{ maxWidth: '40rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 900, color: '#0f172a' }}>Mi Perfil</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Actualiza tu información personal
          </p>
        </div>
        <ProfileClient user={user} />
      </main>
    </div>
  )
}