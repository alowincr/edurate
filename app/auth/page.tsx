import { Suspense } from 'react'
import AuthPage from './AuthPage'

export default function AuthPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div style={{
          width: '2.5rem', height: '2.5rem',
          border: '4px solid #4f46e5',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <AuthPage />
    </Suspense>
  )
}