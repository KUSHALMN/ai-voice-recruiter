import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vowels.ai'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/privacy', '/terms', '/security', '/login'],
        disallow: ['/api/', '/dashboard/', '/admin/', '/interview/'],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/privacy',
          '/terms',
          '/security',
          '/login',
          '/_next/static/',
          '/_next/image/',
          '/favicon.svg',
          '/aira-avatar.png',
          '/aira-avatar.webp',
        ],
        disallow: ['/api/', '/dashboard/', '/admin/', '/interview/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
