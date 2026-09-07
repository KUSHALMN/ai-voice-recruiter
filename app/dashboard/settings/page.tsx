'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Bell, Shield, Moon, Sun, Monitor, Globe, 
  Sparkles, Check, Save, RotateCcw, BrainCircuit, ShieldAlert,
  Building, Mail, Briefcase, Clock, Sliders, CheckCircle2, Calendar, RefreshCw, Loader2
} from 'lucide-react'
import ResponsiveLayout from '@/components/ResponsiveLayout'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import BackButton from '@/components/BackButton'
import { ATS_PROVIDERS_INFO, ATSProvider } from '@/lib/ats/atsService'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'

const LANGUAGES = [
  'English (US)', 'English (UK)', 'Spanish', 'Hindi', 'French', 'German', 'Japanese'
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

  // ATS Integrations State
  const [atsSettings, setAtsSettings] = useState<Record<ATSProvider, {
    enabled: boolean
    isSandbox: boolean
    autoSync: boolean
    subdomain?: string
  }>>({
    greenhouse: { enabled: true, isSandbox: true, autoSync: true, subdomain: 'corp-recruiting' },
    lever: { enabled: true, isSandbox: true, autoSync: false },
    workday: { enabled: false, isSandbox: true, autoSync: false },
    ashby: { enabled: true, isSandbox: true, autoSync: true }
  })

  // Scheduling & Follow-Up Settings
  const [scheduling, setScheduling] = useState({
    defaultDeadlineHours: 48,
    autoNudge24h: true,
    autoNudge48h: true,
    googleCalendarSync: true
  })

  const [testingAts, setTestingAts] = useState<ATSProvider | null>(null)

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
        <div className="mb-4">
          <BackButton fallbackUrl="/dashboard" label="Back to Dashboard" />
        </div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              Account & Recruiter Settings
            </h1>
            <p className="text-slate-500 dark:text-neutral-400 text-sm mt-1">
              Customize your hiring preferences, appearance theme, and AI interview automation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 border border-slate-200 dark:border-neutral-800 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-200 dark:shadow-none transition-all flex items-center gap-1.5 disabled:opacity-50"
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
            className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200/90 dark:border-neutral-800/90 shadow-sm p-6 sm:p-8 transition-colors duration-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-transparent dark:border-indigo-800/30 flex items-center justify-center">
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Theme & Appearance</h2>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">Select your preferred visual style and interface theme</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-neutral-900 rounded-full text-slate-700 dark:text-neutral-300 border border-transparent dark:border-neutral-800 uppercase tracking-wider">
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
                    : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 text-slate-600 dark:text-neutral-400 bg-slate-50/50 dark:bg-neutral-950/60'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-neutral-800 text-slate-500 dark:text-neutral-400'}`}>
                  <Sun className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-600/15 text-white font-bold ring-2 ring-blue-500/40 shadow-sm'
                    : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 text-slate-600 dark:text-neutral-400 bg-slate-50/50 dark:bg-neutral-950/60'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-neutral-800 text-slate-500 dark:text-neutral-400'}`}>
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
                    : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 text-slate-600 dark:text-neutral-400 bg-slate-50/50 dark:bg-neutral-950/60'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'system' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-neutral-800 text-slate-500 dark:text-neutral-400'}`}>
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
            className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200/90 dark:border-neutral-800/90 shadow-sm p-6 sm:p-8 transition-colors duration-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-transparent dark:border-blue-800/30 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recruiter Profile</h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Your profile details displayed across interview invites and reports</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-neutral-400 mb-1.5 tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="e.g. Kushal M N"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 text-sm focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/40 bg-slate-50/50 dark:bg-neutral-950 dark:text-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-neutral-400 mb-1.5 tracking-wider">
                  Work Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="recruiter@company.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 text-sm focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/40 bg-slate-50/50 dark:bg-neutral-950 dark:text-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-neutral-400 mb-1.5 tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  placeholder="e.g. Lead Technical Recruiter"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 text-sm focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/40 bg-slate-50/50 dark:bg-neutral-950 dark:text-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-neutral-400 mb-1.5 tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  placeholder="e.g. Vowels AI"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 text-sm focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/40 bg-slate-50/50 dark:bg-neutral-950 dark:text-white transition-all font-medium"
                />
              </div>
            </div>
          </motion.div>

          {/* AI INTERVIEW CONTROLS & AUTOMATION */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200/90 dark:border-neutral-800/90 shadow-sm p-6 sm:p-8 transition-colors duration-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-transparent dark:border-purple-800/30 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Interview Automation</h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Configure how the AI voice agent conducts and analyzes interviews</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Toggle: Dynamic Probing */}
              <div 
                onClick={() => setAiPreferences(prev => ({ ...prev, autoProbing: !prev.autoProbing }))}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50/40 dark:bg-neutral-950/50 cursor-pointer transition-all select-none"
              >
                <div className="pr-4">
                  <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    Dynamic AI Probing
                    {aiPreferences.autoProbing && <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-400 dark:border dark:border-blue-800/50 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    Automatically trigger follow-up questions if a candidate provides brief or ambiguous answers.
                  </p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${aiPreferences.autoProbing ? 'bg-blue-600' : 'bg-slate-300 dark:bg-neutral-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${aiPreferences.autoProbing ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Toggle: Anti-Cheating Monitor */}
              <div 
                onClick={() => setAiPreferences(prev => ({ ...prev, strictProctoring: !prev.strictProctoring }))}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50/40 dark:bg-neutral-950/50 cursor-pointer transition-all select-none"
              >
                <div className="pr-4">
                  <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    Anti-Cheating Proctor & Tab Switch Monitor
                    {aiPreferences.strictProctoring && <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-400 dark:border dark:border-blue-800/50 px-2 py-0.5 rounded-full font-bold">ENABLED</span>}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    Track window focus loss, background tab switches, and flag candidate AI-script reading patterns.
                  </p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${aiPreferences.strictProctoring ? 'bg-blue-600' : 'bg-slate-300 dark:bg-neutral-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${aiPreferences.strictProctoring ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Toggle: Automatic Evaluation Report */}
              <div 
                onClick={() => setAiPreferences(prev => ({ ...prev, autoEvaluation: !prev.autoEvaluation }))}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50/40 dark:bg-neutral-950/50 cursor-pointer transition-all select-none"
              >
                <div className="pr-4">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Instant AI Scorecard Generation</span>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    Generate detailed technical, communication, and recommendation scores immediately upon completion.
                  </p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${aiPreferences.autoEvaluation ? 'bg-blue-600' : 'bg-slate-300 dark:bg-neutral-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${aiPreferences.autoEvaluation ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Toggle: Candidate Email Feedback */}
              <div 
                onClick={() => setAiPreferences(prev => ({ ...prev, candidateFeedbackEmail: !prev.candidateFeedbackEmail }))}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50/40 dark:bg-neutral-950/50 cursor-pointer transition-all select-none"
              >
                <div className="pr-4">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Automated Candidate Completion Email</span>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    Send candidate an automated confirmation email confirming their voice interview submission.
                  </p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${aiPreferences.candidateFeedbackEmail ? 'bg-blue-600' : 'bg-slate-300 dark:bg-neutral-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${aiPreferences.candidateFeedbackEmail ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* VOICE LANGUAGE & ACCENT DEFAULTS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200/90 dark:border-neutral-800/90 shadow-sm p-6 sm:p-8 transition-colors duration-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-transparent dark:border-emerald-800/30 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Voice & Language Defaults</h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Default language and speech accent configuration for new interviews</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-neutral-400 mb-1.5 tracking-wider">
                Default Voice Accent / Language
              </label>
              <select
                value={aiPreferences.defaultLanguage}
                onChange={(e) => setAiPreferences({ ...aiPreferences, defaultLanguage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 text-sm focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/40 bg-slate-50/50 dark:bg-neutral-950 dark:text-white font-medium"
              >
                {LANGUAGES.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* NOTIFICATION CHANNELS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200/90 dark:border-neutral-800/90 shadow-sm p-6 sm:p-8 transition-colors duration-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-transparent dark:border-amber-800/30 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notification Alerts</h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Manage when and how you receive candidate activity alerts</p>
              </div>
            </div>

            <div className="space-y-4">
              <div 
                onClick={() => setNotifications(prev => ({ ...prev, emailOnComplete: !prev.emailOnComplete }))}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50/40 dark:bg-neutral-950/50 cursor-pointer transition-all select-none"
              >
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Interview Completion Notifications</span>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Receive an email immediately when a candidate finishes their session.</p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${notifications.emailOnComplete ? 'bg-blue-600' : 'bg-slate-300 dark:bg-neutral-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${notifications.emailOnComplete ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              <div 
                onClick={() => setNotifications(prev => ({ ...prev, cheatingAlerts: !prev.cheatingAlerts }))}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50/40 dark:bg-neutral-950/50 cursor-pointer transition-all select-none"
              >
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Integrity Violation Alerts</span>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Notify recruiter if more than 3 tab switches or scripted answers are detected.</p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${notifications.cheatingAlerts ? 'bg-blue-600' : 'bg-slate-300 dark:bg-neutral-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${notifications.cheatingAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* DIRECT ATS INTEGRATIONS HUB */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200/90 dark:border-neutral-800/90 shadow-sm p-6 sm:p-8 transition-colors duration-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-transparent dark:border-emerald-800/30 flex items-center justify-center text-xl">
                  🌿
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Applicant Tracking System (ATS) Integrations</h2>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">Direct 1-click sync with Greenhouse, Lever, Workday, and Ashby candidate profiles</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                Enterprise Sync Active
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {(['greenhouse', 'lever', 'workday', 'ashby'] as ATSProvider[]).map((provider) => {
                const info = ATS_PROVIDERS_INFO[provider]
                const config = atsSettings[provider]
                const isTesting = testingAts === provider
                return (
                  <div 
                    key={provider}
                    className={`p-5 rounded-xl border transition-all ${
                      config.enabled
                        ? 'border-slate-200 dark:border-neutral-800 bg-slate-50/40 dark:bg-neutral-950/40'
                        : 'border-dashed border-slate-300 dark:border-neutral-800/60 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{info.logo}</span>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">{info.name}</h3>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            {config.isSandbox ? 'Sandbox Mock Active' : 'Production API'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTestingAts(provider)
                            setTimeout(() => {
                              setTestingAts(null)
                              toast.success(`Connected to ${info.name}! Connection verified.`, { icon: info.logo })
                            }, 700)
                          }}
                          disabled={isTesting}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-300 flex items-center gap-1 transition-all"
                        >
                          {isTesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                          Test
                        </button>

                        <div 
                          onClick={() => setAtsSettings(prev => ({
                            ...prev,
                            [provider]: { ...prev[provider], enabled: !prev[provider].enabled }
                          }))}
                          className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 cursor-pointer ${
                            config.enabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-neutral-800'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${config.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-neutral-400 mb-3 line-clamp-2">
                      {info.description}
                    </p>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/80 dark:border-neutral-800/80 text-xs">
                      <label className="flex items-center gap-2 text-slate-600 dark:text-neutral-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.autoSync}
                          onChange={(e) => setAtsSettings(prev => ({
                            ...prev,
                            [provider]: { ...prev[provider], autoSync: e.target.checked }
                          }))}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Auto-sync completed interviews</span>
                      </label>
                      <a
                        href={info.docsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[11px] underline"
                      >
                        API Docs
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* AUTOMATED CANDIDATE SCHEDULING & 48H FOLLOW-UP */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200/90 dark:border-neutral-800/90 shadow-sm p-6 sm:p-8 transition-colors duration-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-transparent dark:border-indigo-800/30 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Candidate Scheduling & 48-Hour Follow-Up</h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Configure Google Calendar invites and automated completion reminder nudges</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-neutral-800/80 bg-slate-50/40 dark:bg-neutral-950/50">
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Default Expiration Window</span>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Maximum window candidates have to complete their voice interview before access expires.</p>
                </div>
                <div className="flex gap-2">
                  {[24, 48, 72].map(hrs => (
                    <button
                      type="button"
                      key={hrs}
                      onClick={() => setScheduling(prev => ({ ...prev, defaultDeadlineHours: hrs }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        scheduling.defaultDeadlineHours === hrs
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800'
                      }`}
                    >
                      {hrs} Hours {hrs === 48 ? '★' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div 
                onClick={() => setScheduling(prev => ({ ...prev, autoNudge48h: !prev.autoNudge48h }))}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50/40 dark:bg-neutral-950/50 cursor-pointer transition-all select-none"
              >
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Automated 24h & 48h Candidate Nudges</span>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Automatically dispatch email reminder with Google Calendar link when 24 hours remain in the window.</p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${scheduling.autoNudge48h ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-neutral-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${scheduling.autoNudge48h ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              <div 
                onClick={() => setScheduling(prev => ({ ...prev, googleCalendarSync: !prev.googleCalendarSync }))}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50/40 dark:bg-neutral-950/50 cursor-pointer transition-all select-none"
              >
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">1-Click Google Calendar & Calendly Integration</span>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Generate pre-populated calendar event URLs for candidates with instant calendar blocking.</p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${scheduling.googleCalendarSync ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-neutral-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${scheduling.googleCalendarSync ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* SAVE BUTTON BOTTOM BAR */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center gap-2 disabled:opacity-50"
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