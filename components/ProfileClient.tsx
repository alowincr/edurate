'use client'

import { useState } from 'react'

interface User {
  id: string
  email: string
  full_name: string | null
  university: string | null
}

const UNIVERSITIES = [
  'UTP', 'UNMSM', 'UNI', 'PUCP', 'UPC',
  'USIL', 'UPCH', 'UNFV', 'UNIFE', 'Otra',
]

export default function ProfileClient({ user }: { user: User }) {
  const [fullName,   setFullName]   = useState(user.full_name || '')
  const [university, setUniversity] = useState(user.university || '')
  const [loading,    setLoading]    = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [error,      setError]      = useState('')

  const initials = (user.full_name || user.email)
    .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name:  fullName.trim() || null,
          university: university.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Avatar */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          width: '4rem', height: '4rem', borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white' }}>{initials}</span>
        </div>
        <div>
          <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
            {user.full_name || 'Sin nombre'}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{user.email}</p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            backgroundColor: '#dcfce7', color: '#16a34a',
            fontSize: '0.75rem', fontWeight: 600,
            padding: '0.25rem 0.625rem', borderRadius: '9999px', marginTop: '0.375rem',
          }}>
            ✓ Correo verificado
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
          Información personal
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
              Nombre completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Tu nombre completo"
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
              Universidad
            </label>
            <select
              value={university}
              onChange={e => setUniversity(e.target.value)}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              <option value="">Selecciona tu universidad</option>
              {UNIVERSITIES.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
              Correo institucional
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="input-field"
              style={{ backgroundColor: '#f8fafc', color: '#94a3b8', cursor: 'not-allowed' }}
            />
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.375rem' }}>
              El correo no se puede cambiar
            </p>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', fontSize: '0.875rem', color: '#b91c1c' }}>
              {error}
            </div>
          )}

          {saved && (
            <div style={{ padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '0.875rem', color: '#16a34a', fontWeight: 600 }}>
              ✓ Perfil actualizado correctamente
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}