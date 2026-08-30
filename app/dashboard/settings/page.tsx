'use client'

import { motion } from 'framer-motion'
import { Bell, Key, Shield, User } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
              <p className="text-secondary">Manage your account and application preferences</p>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-6 h-6 text-accent" />
                  <h2 className="text-xl font-semibold text-primary">Profile Settings</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Full Name</label>
                    <input type="text" className="input" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Email</label>
                    <input type="email" className="input" placeholder="your@email.com" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-6 h-6 text-accent" />
                  <h2 className="text-xl font-semibold text-primary">Notifications</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-primary">Email Notifications</p>
                      <p className="text-sm text-secondary">Receive email updates about interviews</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-primary">Interview Reminders</p>
                      <p className="text-sm text-secondary">Get reminded about upcoming interviews</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                  <h2 className="text-xl font-semibold text-primary">Security</h2>
                </div>
                <div className="space-y-4">
                  <button className="btn-secondary">Change Password</button>
                  <button className="btn-secondary">Two-Factor Authentication</button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-6 h-6 text-accent" />
                  <h2 className="text-xl font-semibold text-primary">API Settings</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">API Key</label>
                    <div className="flex gap-2">
                      <input type="password" className="input flex-1" value="••••••••••••••••" readOnly />
                      <button className="btn-secondary">Regenerate</button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex justify-end">
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}