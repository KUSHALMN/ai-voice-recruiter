import React from 'react'

export function FaqJsonLd() {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the autonomous AI voice recruiter conduct candidate interviews?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AIRA utilizes a low-latency conversational speech pipeline to listen, understand technical responses, and ask adaptive follow-up questions dynamically calibrated to the candidate’s skill ceiling.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does AIRA support live coding and technical evaluations?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. AIRA includes an integrated Monaco code editor environment supporting TypeScript, Python, and JavaScript with automated unit tests and runtime complexity evaluation.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does anti-cheat proctoring detect scripted or teleprompter answers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The platform monitors speech entropy, tab switches, focus losses, and AI-script cadence patterns to safeguard interview integrity with tamper-proof audit trails.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can recruiters upload resumes to automatically generate interview questions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Ingesting any PDF or DOCX resume automatically parses verified career history and generates targeted competency questions in under 10 seconds.',
        },
      },
      {
        '@type': 'Question',
        name: 'How quickly are interview scorecards generated after completion?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Comprehensive hiring scorecards with category ratings, audio timestamps, code review reports, and definitive hiring recommendations are available immediately upon interview wrap-up.',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  )
}
