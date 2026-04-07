'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Mode = 'login' | 'register'
type Step = 'form' | 'sent'

const ERROR_MESSAGES: Record<string, string> = {
  token_missing:  'El enlace de verificación es inválido.',
  token_invalid:  'El enlace expiró o ya fue usado. Solicita uno nuevo.',
  server_error:   'Error del servidor. Intenta nuevamente.',
  callback_error: 'Error al iniciar sesión. Intenta otra vez.',
}

export default function AuthPage() {
  const searchParams = useSearchParams()

  const [mode, setMode]         = useState<Mode>('login')
  const [step, setStep]         = useState<Step>('form')
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [urlError, setUrlError] = useState('')

  useEffect(() => {
    const err = searchParams.get('error')
    if (err && ERROR_MESSAGES[err]) {
      setUrlError(ERROR_MESSAGES[err])
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email.includes('.edu')) {
      setError('Solo se permiten correos institucionales (ej: nombre@utp.edu.pe)')
      setLoading(false)
      return
    }

    try {
      const { error: supabaseError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (supabaseError) {
        setError(supabaseError.message)
      } else {
        setStep('sent')
      }
    } catch {
      setError('Error de conexión. Verifica tu internet.')
    } finally {
      setLoading(false)
    }
  }

  // ── Pantalla: enlace enviado ──────────────────────────────────────────────
  if (step === 'sent') {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: '#f9fafb' }}
      >
        <div style={{ maxWidth: '28rem', width: '100%' }}>
          <div className="card p-8 text-center">
            <div
              className="mx-auto mb-4 flex items-center justify-center"
              style={{
                width: '4rem', height: '4rem',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
              }}
            >
              <span style={{ fontSize: '1.75rem' }}>📧</span>
            </div>

            <h2
              className="text-2xl font-black mb-2"
              style={{ color: '#111827' }}
            >
              Revisa tu correo
            </h2>

            <p className="mb-2" style={{ color: '#6b7280' }}>
              Enviamos un enlace de acceso a:
            </p>

            <p className="font-bold mb-6" style={{ color: '#4f46e5' }}>
              {email}
            </p>

            <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
              Haz clic en el enlace para ingresar automáticamente.
              Expira en 1 hora.
            </p>

            <button
              onClick={() => { setStep('form'); setError('') }}
              className="text-sm"
              style={{ color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ← Usar otro correo
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Formulario principal ──────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#f9fafb' }}
    >
      <div style={{ maxWidth: '28rem', width: '100%' }}>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span style={{ fontSize: '1.75rem' }}>🎓</span>
            <span
              className="text-2xl font-black"
              style={{ color: '#4f46e5' }}
            >
              EduRate
            </span>
          </Link>
          <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
            Evaluaciones docentes universitarias
          </p>
        </div>

        <div className="card p-8">

          {/* Tabs login / registro */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ backgroundColor: '#f3f4f6' }}
          >
            {(['register', 'login'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
                style={
                  mode === m
                    ? {
                        backgroundColor: 'white',
                        color: '#111827',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        border: 'none',
                        cursor: 'pointer',
                      }
                    : {
                        color: '#6b7280',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }
                }
              >
                {m === 'register' ? 'Crear cuenta' : 'Ingresar'}
              </button>
            ))}
          </div>

          {/* Error que viene por URL (?error=...) */}
          {urlError && (
            <div
              className="mb-4 p-3 rounded-xl text-sm"
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
              }}
            >
              ⚠️ {urlError}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#374151' }}
              >
                Correo institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@utp.edu.pe"
                required
                autoFocus
                className="input-field"
              />
              <p className="text-xs mt-1.5" style={{ color: '#9ca3af' }}>
                Solo se aceptan correos institucionales (.edu)
              </p>
            </div>

            {error && (
              <div
                className="p-3 rounded-xl text-sm"
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="btn-primary w-full"
            >
              {loading
                ? 'Enviando...'
                : mode === 'register'
                  ? 'Crear cuenta y verificar correo'
                  : 'Enviar enlace de acceso'}
            </button>
          </form>

          {/* Info de anonimato */}
          <div
            className="mt-6 pt-6 flex items-start gap-3 text-xs"
            style={{
              borderTop: '1px solid #f3f4f6',
              color: '#9ca3af',
            }}
          >
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>🔒</span>
            <p>
              Tu identidad permanece anónima. Solo usamos tu correo para
              verificar que eres estudiante activo. No compartimos tus datos.
            </p>
          </div>
        </div>

        {/* Link volver */}
        <p className="text-center text-sm mt-4">
          <Link
            href="/"
            style={{ color: '#9ca3af', textDecoration: 'none' }}
          >
            ← Volver al inicio
          </Link>
        </p>

      </div>
    </div>
  )
}