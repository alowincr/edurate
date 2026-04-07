import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import Navbar from '@/components/Navbar'
import AdminModerationPanel from '@/components/AdminModerationPanel'

export default async function AdminPage() {
  const user = await getSessionUser()

  if (!user) redirect('/auth')
  if (!user.is_admin) redirect('/dashboard')

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-bold px-3 py-1 rounded-full mb-3">
            🛡️ Panel de Administrador
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Moderación de comentarios
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Revisa y gestiona las evaluaciones marcadas como posiblemente inapropiadas.
          </p>
        </div>
        <AdminModerationPanel />
      </main>
    </div>
  )
}