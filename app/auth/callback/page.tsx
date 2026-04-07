'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function CallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function syncUser(email: string) {
      try {
        await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
      } catch { /* silencioso */ }
    }

    async function handleCallback() {
      try {
        // Primero verificar si YA hay sesión activa
        // Esto pasa cuando el token fue procesado pero el redirect falló
        const { data: existing } = await supabase.auth.getSession()
        if (existing.session?.user?.email) {
          await syncUser(existing.session.user.email)
          router.replace('/dashboard?verified=true')
          return
        }

        const fullUrl    = window.location.href
        const hashPart   = fullUrl.split('#')[1] || ''
        const searchPart = fullUrl.split('?')[1]?.split('#')[0] || ''

        const hashParams   = new URLSearchParams(hashPart)
        const searchParams = new URLSearchParams(searchPart)

        const accessToken  = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const code         = searchParams.get('code')
        const errorParam   = hashParams.get('error') || searchParams.get('error')

        if (errorParam) {
          setErrorMsg('El enlace expiró o ya fue usado. Solicita uno nuevo.')
          setStatus('error')
          return
        }

        // Flujo PKCE con ?code=
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error || !data.session) {
            // Verificar si igual hay sesión
            const { data: fallback } = await supabase.auth.getSession()
            if (fallback.session?.user?.email) {
              await syncUser(fallback.session.user.email)
              router.replace('/dashboard?verified=true')
              return
            }
            setErrorMsg('Error al verificar. Solicita un nuevo enlace.')
            setStatus('error')
            return
          }
          await syncUser(data.session.user.email!)
          router.replace('/dashboard?verified=true')
          return
        }

        // Flujo implicit con #access_token
        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token:  accessToken,
            refresh_token: refreshToken,
          })

          if (error || !data.session) {
            // Puede que ya haya sesión de un intento anterior
            const { data: fallback } = await supabase.auth.getSession()
            if (fallback.session?.user?.email) {
              await syncUser(fallback.session.user.email)
              router.replace('/dashboard?verified=true')
              return
            }
            setErrorMsg('Sesión expirada. Solicita un nuevo enlace.')
            setStatus('error')
            return
          }

          await syncUser(data.session.user.email!)
          await new Promise(r => setTimeout(r, 300))
          router.replace('/dashboard?verified=true')
          return
        }

        // Sin hash ni code — escuchar evento con timeout
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user?.email) {
              subscription.unsubscribe()
              await syncUser(session.user.email)
              router.replace('/dashboard?verified=true')
            }
          }
        )

        setTimeout(async () => {
          subscription.unsubscribe()
          // Último intento antes de mostrar error
          const { data: last } = await supabase.auth.getSession()
          if (last.session?.user?.email) {
            await syncUser(last.session.user.email)
            router.replace('/dashboard?verified=true')
            return
          }
          setErrorMsg('No se detectó sesión. El enlace puede haber expirado.')
          setStatus('error')
        }, 8000)

      } catch (err) {
        console.error('Callback error:', err)
        // Último intento
        try {
          const { data } = await supabase.auth.getSession()
          if (data.session?.user?.email) {
            await syncUser(data.session.user.email)
            router.replace('/dashboard?verified=true')
            return
          }
        } catch { /* nada */ }
        setErrorMsg('Error inesperado. Intenta de nuevo.')
        setStatus('error')
      }
    }

    handleCallback()
  }, [router])

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div style={{ maxWidth: '28rem', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Error al verificar
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
            {errorMsg}
          </p>
          <a href="/auth" style={{
            display: 'inline-block', backgroundColor: '#4f46e5',
            color: 'white', fontWeight: 'bold',
            padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
            textDecoration: 'none',
          }}>
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '3rem', height: '3rem', margin: '0 auto 1rem',
          border: '4px solid #4f46e5', borderTopColor: 'transparent',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Verificando tu cuenta...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}