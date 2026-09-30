import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Vowels.ai Recruiter Portal or Admin Dashboard to create and evaluate autonomous voice interviews.',
  alternates: {
    canonical: '/login',
  },
  openGraph: {
    title: 'Sign In | Vowels.ai',
    description: 'Sign in to Vowels.ai Recruiter Portal or Admin Dashboard to create and evaluate autonomous voice interviews.',
    url: '/login',
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
