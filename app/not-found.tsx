'use client'

import Link from 'next/link'

/**
 * not-found.tsx — Required by Next.js App Router.
 * Renders when a route is not matched or notFound() is called.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 text-sm mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-center text-sm"
          >
            Return to Home
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 inline-block bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2.5 rounded-xl font-medium transition-colors text-center text-sm"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
