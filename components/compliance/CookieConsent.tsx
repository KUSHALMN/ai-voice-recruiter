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
      <div className="p-5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-black/80 text-slate-200">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">Privacy &amp; Cookie Choices</h3>
              <span className="text-[10px] text-slate-400">GDPR &amp; CCPA Compliant</span>
            </div>
          </div>
          <button
            onClick={handleNecessaryOnly}
            aria-label="Close and accept necessary only"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          We use strictly necessary cookies to ensure secure interview sessions and optional privacy-preserving analytics to improve AI voice response latency. Review our{' '}
          <Link href="/privacy" className="text-primary-400 hover:underline font-medium">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/terms" className="text-primary-400 hover:underline font-medium">
            Terms of Service
          </Link>.
        </p>

        {showSettings && (
          <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200">Strictly Necessary</span>
                <p className="text-[10px] text-slate-400">Required for authentication &amp; interview integrity</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">Always Active</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200">Voice Latency Analytics</span>
                <p className="text-[10px] text-slate-400">Anonymous metrics on conversational delay</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="rounded border-slate-700 bg-slate-800 text-primary-500 focus:ring-primary-500/20"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2">
          {showSettings ? (
            <button
              onClick={() => handleSavePreferences({ ...preferences, decidedAt: new Date().toISOString() })}
              className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-lg shadow-primary-500/25 transition-all text-center"
            >
              Save Choices
            </button>
          ) : (
            <>
              <button
                onClick={handleAcceptAll}
                className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-lg shadow-primary-500/25 transition-all text-center"
              >
                Accept All
              </button>
              <button
                onClick={handleNecessaryOnly}
                className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-all text-center"
              >
                Necessary Only
              </button>
            </>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Manage cookie settings"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
            title="Configure cookie preferences"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
