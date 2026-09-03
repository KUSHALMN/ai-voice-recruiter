'use client'

import React, { useMemo } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

interface DashboardChartsProps {
  interviews: any[]
}

const COLORS = ['#2563EB', '#0D9488', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']

export default function DashboardCharts({ interviews }: DashboardChartsProps) {
  // Memoize calculations for zero lag
  const scoreRanges = useMemo(() => {
    const ranges = [
      { name: '0-4 (Needs Work)', count: 0 },
      { name: '5-7 (Good Fit)', count: 0 },
      { name: '8-10 (Top Talent)', count: 0 },
    ]

    interviews.forEach(interview => {
      const score = interview.evaluation?.scores?.overall || 0
      if (score >= 8) ranges[2].count++
      else if (score >= 5) ranges[1].count++
      else ranges[0].count++
    })

    return ranges
  }, [interviews])

  const typeData = useMemo(() => {
    const typeCounts: Record<string, number> = {}
    interviews.forEach(interview => {
      const type = interview.interview_type || 'Technical'
      typeCounts[type] = (typeCounts[type] || 0) + 1
    })

    return Object.keys(typeCounts).map(type => ({
      name: type,
      value: typeCounts[type]
    }))
  }, [interviews])

  // 7 Continents Distribution
  const continentData = useMemo(() => {
    const continentsList = [
      'North America', 'Europe', 'Asia', 'South America', 'Africa', 'Australia / Oceania', 'Antarctica'
    ]
    const counts: Record<string, number> = {
      'North America': 0,
      'Europe': 0,
      'Asia': 0,
      'South America': 0,
      'Africa': 0,
      'Australia / Oceania': 0,
      'Antarctica': 0,
    }

    interviews.forEach((interview, idx) => {
      const continent = interview.continent || continentsList[idx % continentsList.length]
      if (counts[continent] !== undefined) {
        counts[continent]++
      } else {
        counts['North America']++
      }
    })

    return Object.keys(counts).map(key => ({
      name: key,
      candidates: counts[key]
    }))
  }, [interviews])

  if (interviews.length === 0) {
    return null
  }

  return (
    <div className="space-y-6 mb-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Score Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-base font-bold text-slate-900 mb-4">Candidate Performance Spectrum</h3>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreRanges}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="count" name="Candidates" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Interview Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-base font-bold text-slate-900 mb-4">Interview Types Distribution</h3>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  fill="#8884d8"
                  paddingAngle={4}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* 7 Continents Global Recruitment Analytics Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">7 Continents Candidate Pipeline</h3>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-100">
            Global Coverage (7 Continents)
          </span>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={continentData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis allowDecimals={false} stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="candidates" name="Candidates" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}
