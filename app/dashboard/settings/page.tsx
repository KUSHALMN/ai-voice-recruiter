'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Bell, Shield, Moon, Sun, Monitor, Globe, 
  Sparkles, Check, Save, RotateCcw, BrainCircuit, ShieldAlert,
  Building, Mail, Briefcase, Clock, Sliders, CheckCircle2
} from 'lucide-react'
import ResponsiveLayout from '@/components/ResponsiveLayout'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

const CONTINENTS = [
  'North America', 'Europe', 'Asia', 'South America', 'Africa', 'Australia / Oceania', 'Antarctica'
]

const LANGUAGES = [
  'English (US)', 'English (UK)', 'English (India)', 'Spanish', 'French', 'German', 'Japanese', 'Mandarin'
]

export default function UserSettingsPage() {
  const { data: session } = useSession()

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')

  // Profile Settings
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    title: 'Lead Talent Recruiter',
    company: 'VOWELS Tech Corp',
    timezone: 'UTC+05:30 (IST)'
  })

  // AI Interview Preferences
  const [aiPreferences, setAiPreferences] = useState({
    autoProbing: true,
    strictProctoring: true,
    autoEvaluation: true,
    candidateFeedbackEmail: true,
    defaultContinent: 'North America',
    defaultLanguage: 'English (US)',
    defaultDuration: 20
  })

  // Notification Toggles
  const [notifications, setNotifications] = useState({
    emailOnComplete: true,
    cheatingAlerts: true,
    dailyDigest: false,
    soundEffects: true
  })

  const [isSaving, setIsSaving] = useState(false)

  // Initialize from session and localStorage
  useEffect(() => {
    if (session?.user) {
      setProfile(prev => ({
        ...prev,
        fullName: session.user?.name || prev.fullName,
        email: session.user?.email || prev.email,
      }))
    }

    const savedTheme = (localStorage.getItem('aira_theme') as 'light' | 'dark' | 'system') || 'light'
    setTheme(savedTheme)
    applyTheme(savedTheme)

    const savedPrefs = localStorage.getItem('aira_user_preferences')
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs)
        if (parsed.aiPreferences) setAiPreferences(parsed.aiPreferences)
        if (parsed.notifications) setNotifications(parsed.notifications)
        if (parsed.profile) setProfile(prev => ({ ...prev, ...parsed.profile }))
      } catch (e) {
        console.error('Failed to parse saved preferences:', e)
      }
    }
  }, [session])

  const applyTheme = (selectedTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement
    if (selectedTheme === 'dark') {
      root.classList.add('dark')
    } else if (selectedTheme === 'light') {
      root.classList.remove('dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) root.classList.add('dark')
      else root.classList.remove('dark')
    }
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    localStorage.setItem('aira_theme', newTheme)
    applyTheme(newTheme)
    toast.success(`Theme switched to ${newTheme.toUpperCase()} mode!`, { icon: newTheme === 'dark' ? '🌙' : '☀️' })
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      localStorage.setItem('aira_user_preferences', JSON.stringify({
        aiPreferences,
        notifications,
        profile
      }))
      setIsSaving(false)
      toast.success('Preferences and settings updated successfully!')
    }, 400)
  }

  const handleReset = () => {
    setAiPreferences({
      autoProbing: true,
      strictProctoring: true,
      autoEvaluation: true,
      candidateFeedbackEmail: true,
      defaultContinent: 'North America',
      defaultLanguage: 'English (US)',
      defaultDuration: 20
    })
    setNotifications({
      emailOnComplete: true,
      cheatingAlerts: true,
      dailyDigest: false,
      soundEffects: true
    })
    toast.success('Reset to default preferences')
  }

  return (
    <ResponsiveLayout>
      <div className="max-w-4xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Account & Recruiter Settings
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Customize your hiring preferences, appearance theme, and AI interview automation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* THEME SWITCHER CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Theme & Appearance</h2>
                  <p className="text-xs text-slate-500">Select your preferred visual style and interface theme</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-700 uppercase tracking-wider">
                {theme} Mode
              </span>
            </div>

            {/* Theme Toggle Buttons */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold ring-2 ring-blue-200 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'}`}>
                  <Sun className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  theme === 'dark'
                    ? 'border-blue-600 bg-slate-900 text-white font-bold ring-2 ring-blue-300 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-white text-slate-500'}`}>
                  <Moon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  theme === 'system'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold ring-2 ring-blue-200 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'system' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'}`}>
                  <Monitor className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">System Match</span>
              </button>
            </div>
          </motion.div>

          {/* RECRUITER PROFILE */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recruiter Profile</h2>
                <p className="text-xs text-slate-500">Your profile details displayed across interview invites and reports</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="e.g. Kushal M N"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-slate-50/50 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 tracking-wider">
                  Work Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="recruiter@company.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-slate-50/50 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  placeholder="e.g. Lead Technical Recruiter"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-slate-50/50 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  placeholder="e.g. Vowels AI"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-slate-50/50 transition-all font-medium"
                />
              </div>
            </div>
          </motion.div>

          {/* AI INTERVIEW CONTROLS & AUTOMATION */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">AI Interview Automation</h2>
                <p className="text-xs text-slate-500">Configure how the AI voice agent conducts and analyzes interviews</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Toggle: Dynamic Probing */}
              <div 
                onClick={() => setAiPreferences(prev => ({ ...prev, autoProbing: !prev.autoProbing }))}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 cursor-pointer transition-all select-none"
              >
                <div className="pr-4">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    Dynamic AI Probing
                    {aiPreferences.autoProbing && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automatically trigger follow-up questions if a candidate provides brief or ambiguous answers.
                  </p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${aiPreferences.autoProbing ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${aiPreferences.autoProbing ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Toggle: Anti-Cheating Monitor */}
              <div 
                onClick={() => setAiPreferences(prev => ({ ...prev, strictProctoring: !prev.strictProctoring }))}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 cursor-pointer transition-all select-none"
              >
                <div className="pr-4">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    Anti-Cheating Proctor & Tab Switch Monitor
                    {aiPreferences.strictProctoring && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">ENABLED</span>}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track window focus loss, background tab switches, and flag candidate AI-script reading patterns.
                  </p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${aiPreferences.strictProctoring ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${aiPreferences.strictProctoring ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Toggle: Automatic Evaluation Report */}
              <div 
                onClick={() => setAiPreferences(prev => ({ ...prev, autoEvaluation: !prev.autoEvaluation }))}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 cursor-pointer transition-all select-none"
              >
                <div className="pr-4">
                  <span className="font-bold text-sm text-slate-900">Instant AI Scorecard Generation</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Generate detailed technical, communication, and recommendation scores immediately upon completion.
                  </p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${aiPreferences.autoEvaluation ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${aiPreferences.autoEvaluation ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Toggle: Candidate Email Feedback */}
              <div 
                onClick={() => setAiPreferences(prev => ({ ...prev, candidateFeedbackEmail: !prev.candidateFeedbackEmail }))}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 cursor-pointer transition-all select-none"
              >
                <div className="pr-4">
                  <span className="font-bold text-sm text-slate-900">Automated Candidate Completion Email</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Send candidate an automated confirmation email confirming their voice interview submission.
                  </p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${aiPreferences.candidateFeedbackEmail ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${aiPreferences.candidateFeedbackEmail ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 7 CONTINENTS & REGIONAL DEFAULTS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">7 Continents Hiring & Language Defaults</h2>
                <p className="text-xs text-slate-500">Default region and language configuration when setting up new interviews</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 tracking-wider">
                  Default Target Continent
                </label>
                <select
                  value={aiPreferences.defaultContinent}
                  onChange={(e) => setAiPreferences({ ...aiPreferences, defaultContinent: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-slate-50/50 font-medium"
                >
                  {CONTINENTS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 tracking-wider">
                  Default Voice Accent / Language
                </label>
                <select
                  value={aiPreferences.defaultLanguage}
                  onChange={(e) => setAiPreferences({ ...aiPreferences, defaultLanguage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-slate-50/50 font-medium"
                >
                  {LANGUAGES.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* NOTIFICATION CHANNELS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Notification Alerts</h2>
                <p className="text-xs text-slate-500">Manage when and how you receive candidate activity alerts</p>
              </div>
            </div>

            <div className="space-y-4">
              <div 
                onClick={() => setNotifications(prev => ({ ...prev, emailOnComplete: !prev.emailOnComplete }))}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 cursor-pointer transition-all select-none"
              >
                <div>
                  <span className="font-bold text-sm text-slate-900">Interview Completion Notifications</span>
                  <p className="text-xs text-slate-500 mt-0.5">Receive an email immediately when a candidate finishes their session.</p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${notifications.emailOnComplete ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${notifications.emailOnComplete ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              <div 
                onClick={() => setNotifications(prev => ({ ...prev, cheatingAlerts: !prev.cheatingAlerts }))}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 cursor-pointer transition-all select-none"
              >
                <div>
                  <span className="font-bold text-sm text-slate-900">Integrity Violation Alerts</span>
                  <p className="text-xs text-slate-500 mt-0.5">Notify recruiter if more than 3 tab switches or scripted answers are detected.</p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${notifications.cheatingAlerts ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${notifications.cheatingAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* SAVE BUTTON BOTTOM BAR */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSaving ? 'Saving Changes...' : 'Save All Preferences'}
            </button>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  )
}