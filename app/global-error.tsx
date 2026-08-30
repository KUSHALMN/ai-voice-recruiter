'use client'

import { useEffect } from 'react'

/**
 * global-error.tsx — Required by Next.js App Router.
 * Catches errors in the ROOT layout (including <html>/<body>).
 * Must render its own <html> and <body> tags since it replaces the root layout.
 * Uses inline styles since CSS/Tailwind imports aren't available at this level.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error caught:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          padding: '1.5rem',
        }}>
          <div style={{
            maxWidth: '28rem',
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            border: '1px solid #fee2e2',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              fontSize: '1.75rem',
            }}>
              ⚠️
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '0.5rem',
            }}>
              Something went wrong!
            </h2>
            <p style={{
              color: '#6b7280',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              wordBreak: 'break-word',
            }}>
              {error.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => reset()}
              style={{
                backgroundColor: '#dc2626',
                color: '#fff',
                padding: '0.625rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                fontSize: '0.875rem',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
