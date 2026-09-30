import type { Metadata } from 'next'
import { Inter, Newsreader, Plus_Jakarta_Sans, Outfit } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { CookieConsent } from '@/components/compliance'
import { JsonLd } from '@/components/seo/JsonLd'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter', 
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'] 
})
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
})
const newsreader = Newsreader({ 
  subsets: ['latin'], 
  variable: '--font-claude-serif', 
  display: 'swap',
  style: ['normal', 'italic'],
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'serif'] 
})
const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-claude-sans', 
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'] 
})

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vowels.ai'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Vowels.ai | Autonomous AI Voice Recruiter & Screening Platform',
    template: '%s | Vowels.ai'
  },
  description: 'AIRA — Autonomous AI voice recruiter conducting adaptive, real-time voice interviews, dynamic coding challenges, and tamper-proof candidate evaluation.',
  keywords: [
    'AI recruiter',
    'voice interview AI',
    'autonomous hiring engine',
    'technical interview screening',
    'AIRA',
    'live coding interview AI',
    'candidate assessment rubric',
    'automated voice interviewer'
  ],
  authors: [{ name: 'Vowels.ai Engineering Team', url: baseUrl }],
  creator: 'Vowels.ai',
  publisher: 'Vowels Technologies Inc.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Vowels.ai',
    title: 'Vowels.ai | Autonomous AI Voice Recruiter',
    description: 'Autonomous voice interviews and live coding screens with real-time AI evaluation and instant scorecards.',
    images: [
      {
        url: '/aira-avatar.png',
        width: 800,
        height: 800,
        alt: 'AIRA — Autonomous AI Voice Recruiter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vowels.ai | Autonomous AI Voice Recruiter',
    description: 'Transform hiring with real-time autonomous voice interviews, live coding validation, and verified scorecards.',
    images: ['/aira-avatar.png'],
    creator: '@vowelsai',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-vowels-ai',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${newsreader.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <head>
        <JsonLd />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('aira_theme') || 'light';
                  if (t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <Providers>
            {children}
            <CookieConsent />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}

