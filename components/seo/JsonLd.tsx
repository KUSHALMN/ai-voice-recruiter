import React from 'react'

export function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vowels.ai'

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Vowels.ai',
        description: 'Autonomous AI Voice Recruiter and Real-Time Interview Evaluation Platform',
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Vowels Technologies Inc.',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/aira-avatar.png`,
          width: 800,
          height: 800,
        },
        founder: {
          '@type': 'Person',
          name: 'Kushal M N',
          jobTitle: 'Founder & Lead Architect',
          url: 'https://github.com/KUSHALMN',
          sameAs: [
            'https://github.com/KUSHALMN',
          ],
        },
        sameAs: [
          'https://github.com/KUSHALMN/ai-voice-recruiter',
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${baseUrl}/#software`,
        name: 'AIRA — AI Voice Recruiter',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, Cloud, All Browsers',
        description:
          'Sub-20ms latency conversational voice AI interviewer with Monaco code execution, anti-cheat detection, and rubric-based scorecards.',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'USD',
        },
        author: {
          '@id': `${baseUrl}/#organization`,
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
