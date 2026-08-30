'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Mail, Lock, Eye, EyeOff, BarChart3, Users, Brain, Mic, Loader2 } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { OptimizedButton } from '@/components/OptimizedButton'

export default function LoginPage() {
  const { status } = useSession()
  const router = useRouter()
  const [activePortal, setActivePortal] = useState<'admin' | 'user'>('user')
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '', name: '' })

  const handleGoogleSignIn = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const callbackUrl = activePortal === 'admin' ? '/admin' : '/dashboard'
      await signIn('google', { callbackUrl })
    } catch (error) {
      console.error('Google sign-in error:', error)
      toast.error('Failed to sign in with Google')
      setIsLoading(false)
    }
  }

  const handleEmailAuth = async () => {
    if (isLoading) return

    if (!credentials.email || !credentials.password) {
      toast.error('Please fill in all fields')
      return
    }

    if (isSignUp && !credentials.name) {
      toast.error('Please enter your name')
      return
    }

    setIsLoading(true)

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: { name: credentials.name }
          }
        })

        if (error) {
          console.error('Signup error:', error)
          toast.error(error.message)
          setIsLoading(false)
          return
        }

        const { error: dbError } = await supabase.from('users').insert({
          email: credentials.email,
          name: credentials.name,
          role: credentials.email.includes('admin') ? 'admin' : 'recruiter'
        })

        if (dbError) {
          console.error('Database insert error:', dbError)
          // Continue anyway as auth was successful
        }

        toast.success('Account created! Please check your email to verify.')
        setIsSignUp(false)
        setIsLoading(false)
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        })

        if (error) {
          console.error('Login error:', error)
          toast.error(error.message)
          setIsLoading(false)
          return
        }

        if (data.session) {

          toast.success('Login successful!')

          // Explicit redirect based on role/portal
          const isAdmin = credentials.email.includes('admin') || activePortal === 'admin'
          router.replace(isAdmin ? '/admin' : '/dashboard')
        } else {
          setIsLoading(false)
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : (isSignUp ? 'Signup failed' : 'Login failed')
      console.error('Auth error:', message)
      toast.error(message)
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const portalContent = {
    admin: {
      title: 'Admin Portal',
      subtitle: 'Complete system control and analytics',
      features: [
        { icon: <BarChart3 className="w-6 h-6" />, text: 'Advanced Analytics Dashboard' },
        { icon: <Users className="w-6 h-6" />, text: 'Manage All Interviews' },
        { icon: <Brain className="w-6 h-6" />, text: 'AI Performance Insights' }
      ],
      gradient: 'from-blue-100 to-blue-200',
      accent: 'admin-accent'
    },
    user: {
      title: 'Recruiter Portal',
      subtitle: 'Create and manage AI interviews',
      features: [
        { icon: <Mic className="w-6 h-6" />, text: 'Voice-Based AI Interviews' },
        { icon: <Users className="w-6 h-6" />, text: 'Candidate Management' },
        { icon: <BarChart3 className="w-6 h-6" />, text: 'Interview Reports' }
      ],
      gradient: 'from-green-100 to-green-200',
      accent: 'user-accent'
    }
  }

  const currentPortal = portalContent[activePortal]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="grid lg:grid-cols-[60%_40%] min-h-screen">
        {/* Left Side - Info Panel */}
        <div className={`bg-gradient-to-br ${currentPortal.gradient} p-12 flex flex-col justify-center relative overflow-hidden`}>
          <motion.div
            key={activePortal}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <div className="mb-8">
              <Sparkles className={`w-16 h-16 text-${currentPortal.accent} mb-6`} />
              <h1 className="text-4xl font-bold text-primary mb-4">{currentPortal.title}</h1>
              <p className="text-xl text-secondary mb-8">{currentPortal.subtitle}</p>
            </div>

            <div className="space-y-6">
              {currentPortal.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="flex items-center gap-4"
                >
                  <div className={`p-3 bg-white rounded-lg shadow-sm text-${currentPortal.accent}`}>
                    {feature.icon}
                  </div>
                  <span className="text-lg font-medium text-primary">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-bold text-primary mb-1">AIRA</h3>
              <p className="text-xs text-secondary mb-3 uppercase tracking-widest">Artificial Intelligent Recruitment Assistant</p>
              <p className="text-secondary leading-relaxed">
                Transform your hiring process with intelligent voice interviews powered by AIRA —
                your autonomous AI hiring manager that assesses candidates and generates detailed reports automatically.
              </p>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-xl" />
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/30 rounded-full blur-lg" />
        </div>

        {/* Right Side - Login Panel */}
        <div className="bg-white p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Portal Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                onClick={() => !isLoading && setActivePortal('user')}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activePortal === 'user'
                  ? 'bg-white text-success shadow-sm'
                  : 'text-secondary hover:text-primary'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Recruiter
              </button>
              <button
                onClick={() => !isLoading && setActivePortal('admin')}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activePortal === 'admin'
                  ? 'bg-white text-accent shadow-sm'
                  : 'text-secondary hover:text-primary'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Admin
              </button>
            </div>

            <motion.div
              key={activePortal}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                <p className="text-secondary">{isSignUp ? 'Sign up for' : 'Sign in to'} your {currentPortal.title.toLowerCase()}</p>
              </div>

              {/* Google Login */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-3 mb-6 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                <span className="text-gray-700 font-medium">
                  {isLoading ? 'Signing in...' : 'Sign in with Google'}
                </span>
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-secondary">or continue with email</span>
                </div>
              </div>

              {/* Email Auth */}
              <form onSubmit={(e) => { e.preventDefault(); handleEmailAuth(); }} className="space-y-4">
                {isSignUp && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={credentials.name}
                      onChange={(e) => setCredentials(prev => ({ ...prev, name: e.target.value }))}
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-primary placeholder-secondary focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-primary placeholder-secondary focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    disabled={isLoading}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-primary placeholder-secondary focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <OptimizedButton
                  type="submit"
                  isLoading={isLoading}
                  className="w-full"
                >
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </OptimizedButton>

                <div className="text-center">
                  <button
                    onClick={() => !isLoading && setIsSignUp(!isSignUp)}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-secondary text-sm">
              © 2025 AIRA — Autonomous Hiring System
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
