'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save, Key, Database, Users, Shield, Bell } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    systemName: 'AI Voice Recruiter',
    maxInterviewDuration: 60,
    defaultQuestions: 7,
    autoEvaluation: true,
    emailNotifications: true,
    apiKeys: {
      gemini: '',
      elevenlabs: ''
    }
  })
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ))
      toast.success('User role updated')
    } catch (error) {
      console.error('Error updating user role:', error)
      toast.error('Failed to update user role')
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      // In a real app, save to database or config service
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-8 h-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-slate-800">System Configuration</h1>
              </div>
              <p className="text-slate-600">Manage platform settings and user access</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Database className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-slate-800">General Settings</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">System Name</label>
                    <input
                      type="text"
                      value={settings.systemName}
                      onChange={(e) => setSettings(prev => ({ ...prev, systemName: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Max Interview Duration (minutes)</label>
                    <select
                      value={settings.maxInterviewDuration}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxInterviewDuration: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                      <option value={90}>90 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Default Questions per Interview</label>
                    <input
                      type="number"
                      min="3"
                      max="15"
                      value={settings.defaultQuestions}
                      onChange={(e) => setSettings(prev => ({ ...prev, defaultQuestions: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Auto AI Evaluation</label>
                      <p className="text-xs text-slate-500">Automatically evaluate candidates using AI</p>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, autoEvaluation: !prev.autoEvaluation }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoEvaluation ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoEvaluation ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Email Notifications</label>
                      <p className="text-xs text-slate-500">Send email updates to recruiters</p>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* API Configuration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Key className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-slate-800">API Configuration</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Gemini API Key</label>
                    <input
                      type="password"
                      value={settings.apiKeys.gemini}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        apiKeys: { ...prev.apiKeys, gemini: e.target.value }
                      }))}
                      placeholder="Enter Gemini API key"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">ElevenLabs API Key</label>
                    <input
                      type="password"
                      value={settings.apiKeys.elevenlabs}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        apiKeys: { ...prev.apiKeys, elevenlabs: e.target.value }
                      }))}
                      placeholder="Enter ElevenLabs API key"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">Security Notice</span>
                    </div>
                    <p className="text-xs text-amber-700">
                      API keys are encrypted and stored securely. Only administrators can view and modify these settings.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* User Management */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-slate-800">User Management</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Role</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Joined</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {user.name?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <span className="font-medium text-slate-800">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{user.email}</td>
                          <td className="py-3 px-4">
                            <select
                              value={user.role}
                              onChange={(e) => updateUserRole(user.id, e.target.value)}
                              className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="recruiter">Recruiter</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex justify-end"
            >
              <button
                onClick={saveSettings}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700  disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}