'use client'

import {
  HeroSection,
  FeaturesSection,
  WorkflowSection,
  PricingSection,
  LandingFooter
} from '@/features/landing'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-primary-500/30 selection:text-primary-200">
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <PricingSection />
      <LandingFooter />
    </main>
  )
}