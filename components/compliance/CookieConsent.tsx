'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Cookie, X, Check, Settings } from 'lucide-react'

const STORAGE_KEY = 'ai_recruiter_cookie_consent_v1'

export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  decidedAt: string
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    marketing: false,
    decidedAt: '',
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        // Delay slightly for smooth page load UX
        const timer = setTimeout(() => setIsVisible(true), 1200)
        return () => clearTimeout(timer)
      }
    } catch {
      // In case localStorage is blocked by private mode
    }
  }, [])

  const handleSavePreferences = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {
      // Ignore
    }
    setIsVisible(false)
  }

  const handleAcceptAll = () => {
    handleSavePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      decidedAt: new Date().toISOString(),
    })
  }

  const handleNecessaryOnly = () => {
    handleSavePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      decidedAt: new Date().toISOString(),
    })
  }

  if (!isVisible) return null

  return (
    <aside
      aria-label="Cookie Consent Banner"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-[#E5E5EA] shadow-[0_16px_48px_rgba(0,0,0,0.12)] text-[#1D1D1F]">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1D1D1F] tracking-tight">Privacy &amp; Cookie Choices</h3>
              <span className="text-[10px] text-[#86868B]">GDPR &amp; CCPA Compliant</span>
            </div>
          </div>
          <button
            onClick={handleNecessaryOnly}
            aria-label="Close and accept necessary only"
            className="p-1 rounded-lg text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#515154] leading-relaxed mb-4">
          We use strictly necessary cookies to ensure secure interview sessions and optional privacy-preserving analytics to improve AI voice response latency. Review our{' '}
          <Link href="/privacy" className="text-indigo-600 hover:underline font-semibold">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/terms" className="text-indigo-600 hover:underline font-semibold">
            Terms of Service
          </Link>.
        </p>

        {showSettings && (
          <div className="mb-4 p-3 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#1D1D1F]">Strictly Necessary</span>
                <p className="text-[10px] text-[#86868B]">Required for authentication &amp; interview integrity</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#E5E5EA] text-[#86868B]">Always Active</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#1D1D1F]">Voice Latency Analytics</span>
                <p className="text-[10px] text-[#86868B]">Anonymous metrics on conversational delay</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="rounded border-[#D2D2D7] text-indigo-600 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2">
          {showSettings ? (
            <button
              onClick={() => handleSavePreferences({ ...preferences, decidedAt: new Date().toISOString() })}
              className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold shadow-xs transition-all text-center"
            >
              Save Choices
            </button>
          ) : (
            <>
              <button
                onClick={handleAcceptAll}
                className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold shadow-xs transition-all text-center"
              >
                Accept All
              </button>
              <button
                onClick={handleNecessaryOnly}
                className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1D1D1F] text-xs font-semibold border border-[#E5E5EA] transition-all text-center"
              >
                Necessary Only
              </button>
            </>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Manage cookie settings"
            className="p-2 rounded-xl text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] border border-transparent hover:border-[#E5E5EA] transition-all"
            title="Configure cookie preferences"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
