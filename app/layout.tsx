import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EduRate — Evaluaciones Docentes',
  description: 'Plataforma confiable y anónima para evaluar profesores universitarios',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        {children}
      </body>
    </html>
  )
}