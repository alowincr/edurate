'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function LandingPage() {
  const features = [
    {
      icon: '⭐',
      title: 'Criterios objetivos',
      description: 'Evalúa por claridad, dominio, metodología, puntualidad, trato y exigencia. No solo opiniones.',
      color: '#fef3c7',
    },
    {
      icon: '🔒',
      title: '100% Anónimo',
      description: 'Solo correos institucionales. Tu identidad nunca se revela al profesor evaluado.',
      color: '#ede9fe',
    },
    {
      icon: '🛡️',
      title: 'Anti-tóxico',
      description: 'Moderación automática. Cero insultos ni lenguaje ofensivo. Solo crítica constructiva.',
      color: '#dcfce7',
    },
    {
      icon: '📊',
      title: 'Datos reales',
      description: 'Promedios por criterio, historial completo y perfil detallado por cada docente.',
      color: '#dbeafe',
    },
  ]

  const criteria = [
    { label: 'Claridad al explicar', score: 4.2, icon: '💡' },
    { label: 'Dominio del tema',     score: 4.8, icon: '🎓' },
    { label: 'Metodología',          score: 3.9, icon: '📚' },
    { label: 'Puntualidad',          score: 4.1, icon: '⏰' },
    { label: 'Trato al estudiante',  score: 4.5, icon: '🤝' },
    { label: 'Nivel de exigencia',   score: 3.7, icon: '📊' },
  ]

  const steps = [
    { n: '1', title: 'Regístrate',       desc: 'Usa tu correo institucional para verificar que eres estudiante.' },
    { n: '2', title: 'Busca o registra', desc: 'Encuentra a tu profesor o agrégalo si aún no está en la plataforma.' },
    { n: '3', title: 'Evalúa',           desc: 'Califica por criterios y deja un comentario constructivo.' },
    { n: '4', title: 'Comparte',         desc: 'Ayuda a otros estudiantes a elegir mejor sus cursos.' },
  ]

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh' }}>

      {/* Navbar compartido — detecta sesión automáticamente */}
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{
        maxWidth: '72rem', margin: '0 auto', padding: '5rem 1.5rem 4rem',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: '#eef2ff', color: '#4f46e5',
          fontSize: '0.8125rem', fontWeight: 600,
          padding: '0.375rem 1rem', borderRadius: '9999px',
          marginBottom: '1.75rem',
          border: '1px solid #c7d2fe',
        }}>
          <span>Evaluaciones universitarias confiables y anónimas</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
          fontWeight: 900, lineHeight: 1.1,
          color: '#0f172a', marginBottom: '1.5rem',
          letterSpacing: '-0.02em',
        }}>
          Evalúa a tus profesores
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            de forma inteligente
          </span>
        </h1>

        <p style={{
          fontSize: '1.125rem', color: '#64748b', maxWidth: '38rem',
          margin: '0 auto 2.5rem', lineHeight: 1.7,
        }}>
          Plataforma estructurada y basada en datos donde los estudiantes
          evalúan a sus docentes con criterios objetivos.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <Link href="/professors" className="btn-primary"
                style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
            Explorar profesores
          </Link>
          <Link href="/auth" className="btn-secondary"
                style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
            Crear cuenta gratis
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          {[
            { value: '6',    label: 'Criterios de evaluación', icon: '📋' },
            { value: '100%', label: 'Anónimo y privado',       icon: '🔒' },
            { value: '0',    label: 'Tolerancia al odio',      icon: '🚫' },
          ].map(s => (
            <div key={s.label} style={{
              backgroundColor: 'white', borderRadius: '1rem',
              padding: '1rem 1.75rem', textAlign: 'center',
              border: '1px solid #f1f5f9',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              minWidth: '9rem',
            }}>
              <p style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{s.icon}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4f46e5', lineHeight: 1 }}>
                {s.value}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Preview card ─────────────────────────────────────────────── */}
      <section style={{
        backgroundColor: 'white',
        borderTop: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9',
        padding: '5rem 1.5rem',
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.75rem' }}>
              Evaluaciones con criterios reales
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              No solo "bueno o malo" — cada aspecto importa por separado.
            </p>
          </div>

          <div style={{
            maxWidth: '32rem', margin: '0 auto',
            backgroundColor: 'white', borderRadius: '1.5rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 20px 60px rgba(79,70,229,0.1)',
            overflow: 'hidden',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              padding: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <div style={{
                width: '3rem', height: '3rem', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.125rem', fontWeight: 900, color: 'white',
              }}>
                JP
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>Dr. Juan Pérez</p>
                <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)' }}>
                  Ingeniería de Sistemas — UNMSM
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>4.2</p>
                <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.7)' }}>de 5.0</p>
              </div>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {criteria.map((c) => (
                <div key={c.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 500 }}>
                      {c.icon} {c.label}
                    </span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#4f46e5' }}>
                      {c.score}
                    </span>
                  </div>
                  <div style={{ backgroundColor: '#f1f5f9', borderRadius: '9999px', height: '0.5rem', overflow: 'hidden' }}>
                    <div style={{
                      background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                      height: '100%', borderRadius: '9999px',
                      width: `${(c.score / 5) * 100}%`,
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              padding: '1rem 1.5rem',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <div style={{
                width: '1.5rem', height: '1.5rem', borderRadius: '50%',
                backgroundColor: '#dcfce7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem',
              }}>✓</div>
              <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                Basado en <strong style={{ color: '#0f172a' }}>24 evaluaciones</strong> verificadas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.75rem' }}>
            ¿Por qué EduRate?
          </h2>
          <p style={{ color: '#64748b' }}>
            Diseñado para ser justo, confiable y útil para todos los estudiantes.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              backgroundColor: 'white', borderRadius: '1.25rem',
              padding: '1.75rem', border: '1px solid #f1f5f9',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                width: '2.75rem', height: '2.75rem', borderRadius: '0.875rem',
                backgroundColor: f.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.375rem', marginBottom: '1rem',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cómo funciona ────────────────────────────────────────────── */}
      <section style={{
        backgroundColor: 'white',
        borderTop: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9',
        padding: '5rem 1.5rem',
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.75rem' }}>
              Cómo funciona
            </h2>
            <p style={{ color: '#64748b' }}>En 4 simples pasos puedes empezar a evaluar.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}>
            {steps.map((s) => (
              <div key={s.n} style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{
                  width: '3rem', height: '3rem', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: 'white', fontWeight: 900, fontSize: '1.125rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
                }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{
          maxWidth: '42rem', margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '2rem', padding: '3.5rem 2rem',
          boxShadow: '0 20px 60px rgba(79,70,229,0.35)',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.9)',
            fontSize: '0.8125rem', fontWeight: 600,
            padding: '0.375rem 1rem', borderRadius: '9999px',
            marginBottom: '1.5rem',
          }}>
            Únete ahora — es gratis
          </div>

          <h2 style={{
            fontSize: '2rem', fontWeight: 900, color: 'white',
            marginBottom: '1rem', lineHeight: 1.2,
          }}>
            ¿Listo para evaluar a tus profesores?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Solo necesitas tu correo institucional.
            Es gratis, anónimo y toma menos de 2 minutos.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            <Link href="/professors" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              backgroundColor: 'white', color: '#4f46e5',
              fontWeight: 700, padding: '0.875rem 2rem',
              borderRadius: '0.875rem', textDecoration: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            }}>
              Explorar profesores
            </Link>
            <Link href="/auth" style={{
              display: 'inline-flex', alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: 'white', fontWeight: 600,
              padding: '0.875rem 2rem', borderRadius: '0.875rem',
              textDecoration: 'none', fontSize: '1rem',
              border: '1.5px solid rgba(255,255,255,0.3)',
            }}>
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
            <footer style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              padding: '3rem 1.5rem 2rem',
            }}>
              <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

                {/* Top row */}
                <div style={{
                  display: 'flex', flexWrap: 'wrap',
                  justifyContent: 'space-between', alignItems: 'flex-start',
                  gap: '2rem', marginBottom: '2.5rem',
                }}>

                  {/* Brand */}
                  <div style={{ maxWidth: '20rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>🎓</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white' }}>EduRate</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                      Plataforma de evaluación docente universitaria. Anónima, confiable y basada en datos reales.
                    </p>
                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {[
                        { icon: '🔒', label: 'Anónimo' },
                        { icon: '✅', label: 'Verificado' },
                        { icon: '🛡️', label: 'Anti-tóxico' },
                      ].map(b => (
                        <span key={b.label} style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                          backgroundColor: 'rgba(255,255,255,0.07)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600,
                          padding: '0.3rem 0.75rem', borderRadius: '9999px',
                        }}>
                          {b.icon} {b.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div>
                    <p style={{
                      fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0',
                      textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem',
                    }}>
                      Plataforma
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {[
                        { href: '/professors', label: 'Profesores' },
                        { href: '/ranking',    label: 'Ranking'  },
                        { href: '/auth',       label: 'Ingresar'    },
                      ].map(l => (
                        <Link key={l.href} href={l.href} style={{
                          fontSize: '0.875rem', color: '#94a3b8',
                          textDecoration: 'none', transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'white'}
                        onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Divider + bottom */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                  <div style={{
                    display: 'flex', flexWrap: 'wrap',
                    justifyContent: 'space-between', alignItems: 'center',
                    gap: '0.75rem',
                  }}>
                    <p style={{ fontSize: '0.8125rem', color: '#475569' }}>
                      © 2026 EduRate — Todos los derechos reservados
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: '#475569' }}>
                      Hecho para estudiantes universitarios del Perú
                    </p>
                  </div>
                </div>  {/* Divider */}
              </div>  {/* ← ESTE FALTABA (maxWidth container) */}
            </footer>
        </div>
                  )
                }