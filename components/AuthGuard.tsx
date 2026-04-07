'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function AuthGuard({ children, requireAdmin = false }: Props) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (!data.user) {
          router.replace('/auth')
          return
        }
        if (requireAdmin && !data.user.is_admin) {
          router.replace('/dashboard')
          return
        }
        setAuthorized(true)
      })
      .catch(() => router.replace('/auth'))
      .finally(() => setChecking(false))
  }, [router, requireAdmin])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (!authorized) return null

  return <>{children}</>
}