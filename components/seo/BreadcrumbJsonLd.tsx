import React from 'react'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbJsonLdProps {
  items?: BreadcrumbItem[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vowels.ai'

  const defaultItems: BreadcrumbItem[] = [
    { name: 'Home', url: `${baseUrl}` },
    { name: 'Features', url: `${baseUrl}/#features` },
    { name: 'How It Works', url: `${baseUrl}/#workflow` },
    { name: 'Recruiter Portal', url: `${baseUrl}/login` },
  ]

  const breadcrumbs = items || defaultItems

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${baseUrl}${crumb.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
    />
  )
}
