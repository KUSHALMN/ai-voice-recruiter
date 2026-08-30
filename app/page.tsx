'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()



  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">VOWELS</div>
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => startTransition(() => router.push('/login'))}
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isPending ? 'Loading...' : 'Sign In'}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden min-h-[600px]">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              New AI Technology
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Vowels</span> unveils its new AI Recruiter Assistant — where intelligent hiring meets automation
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              From sourcing to interviews, <span className="font-semibold text-gray-800">Vowels streamlines every stage</span>—reducing hiring time from weeks to days with cutting-edge AI technology.
            </p>



            {/* Trust Signals */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-600">
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Check className="w-5 h-5 text-green-500" />
                <span className="font-medium">Free 30-day trial</span>
              </div>
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Check className="w-5 h-5 text-green-500" />
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Check className="w-5 h-5 text-green-500" />
                <span className="font-medium">Setup in 5 minutes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="px-6 py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              ⚡ Powered by Advanced AI
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-8">
              Everything you need to hire better
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Streamline your entire hiring process with AI-powered tools that save time and improve candidate quality through intelligent automation.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl   border border-gray-100"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 mx-auto">
                <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">AI-Powered Sourcing</h3>
              <p className="text-gray-600 text-center leading-relaxed">Find the best candidates faster with intelligent matching algorithms and automated outreach campaigns.</p>
              <div className="mt-6 flex justify-center">
                <span className="text-blue-600 font-semibold text-sm">Learn More →</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl   border border-gray-100 relative"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Most Popular</span>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 mx-auto">
                <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Smart Interviews</h3>
              <p className="text-gray-600 text-center leading-relaxed">Conduct structured interviews with AI assistance and real-time candidate evaluation and scoring.</p>
              <div className="mt-6 flex justify-center">
                <span className="text-blue-600 font-semibold text-sm">Learn More →</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl   border border-gray-100"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 mx-auto">
                <div className="w-8 h-8 bg-blue-600 rounded-lg transform rotate-45"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Analytics & Insights</h3>
              <p className="text-gray-600 text-center leading-relaxed">Make data-driven hiring decisions with comprehensive analytics, reporting and performance insights.</p>
              <div className="mt-6 flex justify-center">
                <span className="text-blue-600 font-semibold text-sm">Learn More →</span>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Trusted by leading companies</h3>
              <p className="text-gray-600">Join thousands of companies that have transformed their hiring process</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Companies</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
                <div className="text-gray-600">Interviews</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-gray-600">Accuracy</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">70%</div>
                <div className="text-gray-600">Time Saved</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full blur-lg"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to transform your hiring?
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Join thousands of companies using VOWELS to hire better, faster, and smarter with AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => startTransition(() => router.push('/login'))}
                disabled={isPending}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isPending ? 'Loading...' : 'Start Your Free Trial'}
                {!isPending && <ArrowRight className="w-5 h-5" />}
              </button>
              <button className="text-white hover:text-gray-200 font-semibold text-lg transition-colors border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold mb-4">VOWELS</div>
              <p className="text-gray-400 mb-6 max-w-md">
                The complete AI-powered platform for hiring. Transform your recruitment process with intelligent automation.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="w-5 h-5 bg-gray-400 rounded"></div>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="w-5 h-5 bg-gray-400 rounded-lg transform rotate-45"></div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400">
              © 2025 VOWELS. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}