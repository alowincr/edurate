'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Professor {
  id: string
  full_name: string
  university: string
  department: string
  photo_url: string | null
  avg_rating: number
  total_evaluations: number
  courses: { id: string; name: string; code: string }[]
}

const UNIVERSITIES = [
  'Todas',
  'UTP',
  'UNMSM',
  'UNI',
  'PUCP',
  'UPC',
  'USIL',
  'UPCH',
  'UNFV',
  'UNIFE',
]

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} style={{
          width: '1rem', height: '1rem',
          color: s <= Math.round(rating) ? '#f59e0b' : '#e2e8f0',
        }} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginLeft: '0.25rem' }}>
        {rating > 0 ? rating.toFixed(1) : '—'}
      </span>
    </div>
  )
}

function ProfessorCard({ professor }: { professor: Professor }) {
  const initials = professor.full_name
    .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

  const ratingColor =
    professor.avg_rating >= 4 ? '#16a34a' :
    professor.avg_rating >= 3 ? '#ca8a04' :
    professor.avg_rating > 0  ? '#dc2626' : '#9ca3af'

  return (
    <Link href={`/professors/${professor.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{
        padding: '1.25rem', height: '100%', cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,70,229,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = ''
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '0.875rem' }}>
          <div style={{
            width: '3rem', height: '3rem', borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 900, color: 'white' }}>{initials}</span>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 style={{
              fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {professor.full_name}
            </h3>
            <span style={{
              display: 'inline-block', fontSize: '0.6875rem', fontWeight: 600,
              backgroundColor: '#eef2ff', color: '#4f46e5',
              padding: '0.125rem 0.5rem', borderRadius: '9999px', marginTop: '0.25rem',
            }}>
              {professor.university}
            </span>
            {professor.department && (
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.125rem',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {professor.department}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: '1.375rem', fontWeight: 900, color: ratingColor, lineHeight: 1 }}>
              {professor.avg_rating > 0 ? professor.avg_rating.toFixed(1) : '—'}
            </p>
            <p style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>/ 5.0</p>
          </div>
        </div>

        <StarDisplay rating={professor.avg_rating} />

        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
          {professor.total_evaluations > 0
            ? `${professor.total_evaluations} evaluación${professor.total_evaluations !== 1 ? 'es' : ''}`
            : 'Sin evaluaciones aún'}
        </p>

        {professor.courses?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {professor.courses.slice(0, 3).map((c) => (
              <span key={c.id} style={{
                fontSize: '0.6875rem', backgroundColor: '#f8fafc',
                color: '#64748b', padding: '0.25rem 0.5rem',
                borderRadius: '0.375rem', border: '1px solid #f1f5f9',
              }}>
                {c.code || c.name}
              </span>
            ))}
            {professor.courses.length > 3 && (
              <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                +{professor.courses.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export default function ProfessorsPage() {
  const [professors, setProfessors]   = useState<Professor[]>([])
  const [search, setSearch]           = useState('')
  const [university, setUniversity]   = useState('Todas')
  const [loading, setLoading]         = useState(true)
  const [total, setTotal]             = useState(0)
  const [page, setPage]               = useState(1)
  const [totalPages, setTotalPages]   = useState(1)
  const [showModal, setShowModal]     = useState(false)

  const fetchProfessors = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        page: String(page),
        university: university === 'Todas' ? '' : university,
      })
      const res  = await fetch(`/api/professors?${params}`)
      const data = await res.json()
      setProfessors(data.professors || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch {
      console.error('Error cargando profesores')
    } finally {
      setLoading(false)
    }
  }, [search, page, university])

  useEffect(() => {
    const t = setTimeout(fetchProfessors, 300)
    return () => clearTimeout(t)
  }, [fetchProfessors])

  useEffect(() => { setPage(1) }, [search, university])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navbar />

      <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 900, color: '#0f172a' }}>
              Profesores
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
              {total > 0 ? `${total} docentes registrados` : 'Explora y evalúa a tus docentes'}
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary"
                  style={{ flexShrink: 0, padding: '0.625rem 1.25rem', fontSize: '0.9rem' }}>
            Registrar profesor
          </button>
        </div>

        {/* Búsqueda + filtro universidad */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <svg style={{ width: '1.125rem', height: '1.125rem', color: '#94a3b8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre del profesor..."
              className="input-field"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>

          {/* Filtro universidad */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {UNIVERSITIES.map(u => (
              <button
                key={u}
                onClick={() => setUniversity(u)}
                style={{
                  padding: '0.5rem 0.875rem', borderRadius: '9999px',
                  fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s', border: 'none',
                  backgroundColor: university === u ? '#4f46e5' : 'white',
                  color: university === u ? 'white' : '#64748b',
                  boxShadow: university === u
                    ? '0 2px 8px rgba(79,70,229,0.35)'
                    : '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card" style={{ padding: '1.25rem', opacity: 0.6 }}>
                <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '0.875rem' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#f1f5f9' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: '1rem', backgroundColor: '#f1f5f9', borderRadius: '0.5rem', width: '75%', marginBottom: '0.5rem' }} />
                    <div style={{ height: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '0.5rem', width: '50%' }} />
                  </div>
                </div>
                <div style={{ height: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '0.5rem', width: '40%' }} />
              </div>
            ))}
          </div>
        ) : professors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>
              No se encontraron profesores
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1.5rem' }}>
              {search || university !== 'Todas'
                ? 'Prueba con otros filtros o regístralo tú'
                : 'Sé el primero en registrar un profesor'}
            </p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Registrar profesor
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {professors.map(p => <ProfessorCard key={p.id} professor={p} />)}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1} className="btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              ← Anterior
            </button>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Página {page} de {totalPages}
            </span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages} className="btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Siguiente →
            </button>
          </div>
        )}
      </main>

      {showModal && (
        <RegisterProfessorModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchProfessors() }}
        />
      )}
    </div>
  )
}

function RegisterProfessorModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [fullName,    setFullName]    = useState('')
  const [university,  setUniversity]  = useState('')
  const [department,  setDepartment]  = useState('')
  const [courseInput, setCourseInput] = useState('')
  const [courses,     setCourses]     = useState<string[]>([])
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')

  function addCourse() {
    const t = courseInput.trim()
    if (!t || courses.includes(t)) return
    setCourses(p => [...p, t])
    setCourseInput('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!fullName.trim() || !university.trim()) {
      setError('Nombre y universidad son obligatorios.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/professors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name:  fullName.trim(),
          university: university.trim(),
          department: department.trim() || null,
          courses:    courses.map(name => ({ name })),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al registrar'); return }
      if (data.warning) console.warn(data.warning)
      onSuccess()
    } catch {
      setError('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="card" style={{ width: '100%', maxWidth: '32rem', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>Registrar profesor</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
              Nombre completo <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                   placeholder="Dr. Juan Pérez García" required className="input-field" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
              Universidad <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input type="text" value={university} onChange={e => setUniversity(e.target.value)}
                   placeholder="UTP, UNMSM, PUCP..." required className="input-field" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
              Departamento / Facultad
              <span style={{ fontWeight: 400, color: '#9ca3af', marginLeft: '0.25rem' }}>(opcional)</span>
            </label>
            <input type="text" value={department} onChange={e => setDepartment(e.target.value)}
                   placeholder="Ingeniería de Sistemas..." className="input-field" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
              Cursos que dicta
              <span style={{ fontWeight: 400, color: '#9ca3af', marginLeft: '0.25rem' }}>(opcional)</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" value={courseInput}
                     onChange={e => setCourseInput(e.target.value)}
                     onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCourse() } }}
                     placeholder="Ej: Algoritmos, Base de Datos..." className="input-field" style={{ flex: 1 }} />
              <button type="button" onClick={addCourse} className="btn-secondary"
                      style={{ padding: '0.75rem 1rem', flexShrink: 0, fontSize: '1.25rem' }}>+</button>
            </div>
            {courses.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.625rem' }}>
                {courses.map(c => (
                  <span key={c} style={{
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                    fontSize: '0.8125rem', backgroundColor: '#eef2ff', color: '#4f46e5',
                    padding: '0.25rem 0.75rem', borderRadius: '9999px',
                  }}>
                    {c}
                    <button type="button" onClick={() => setCourses(p => p.filter(x => x !== c))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', fontWeight: 700, padding: 0 }}>×</button>
                  </span>
                ))}
              </div>
            )}
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.375rem' }}>
              Presiona Enter o + para agregar cada curso
            </p>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', fontSize: '0.875rem', color: '#b91c1c' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}>
              {loading ? 'Registrando...' : 'Registrar profesor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}