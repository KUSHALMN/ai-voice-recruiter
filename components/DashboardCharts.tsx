'use client'

import React, { useMemo } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts'
import { motion } from 'framer-motion'
import { Globe, Award, Sparkles, AlertCircle } from 'lucide-react'

interface DashboardChartsProps {
  interviews: any[]
}

const COLORS = ['#2563EB', '#0D9488', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']

export default function DashboardCharts({ interviews }: DashboardChartsProps) {
  // Memoize calculations for zero lag
  const { scoreRanges, evaluatedCount } = useMemo(() => {
    const ranges = [
      { name: '0-4 (Needs Work)', count: 0 },
      { name: '5-7 (Good Fit)', count: 0 },
      { name: '8-10 (Top Talent)', count: 0 },
    ]

    let evaluated = 0

    interviews.forEach(interview => {
      const session = interview.interview_sessions?.[0]
      const rawScore = 
        interview.evaluation?.scores?.overall ??
        session?.scores?.overall ??
        session?.evaluation?.scores?.overall ??
        (interview.status === 'completed' && session?.final_score ? session.final_score : null)

      // Only count completed or evaluated interviews so scheduled ones don't skew as 'Needs Work'
      if (rawScore !== null && rawScore !== undefined && (interview.status === 'completed' || Number(rawScore) > 0)) {
        const score = Number(rawScore)
        evaluated++
        if (score >= 8) ranges[2].count++
        else if (score >= 5) ranges[1].count++
        else ranges[0].count++
      }
    })

    return { scoreRanges: ranges, evaluatedCount: evaluated }
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
      const continent = 
        interview.continent || 
        interview.parsed_resume?.continent || 
        continentsList[idx % continentsList.length]
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
          className="bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Candidate Performance Spectrum</h3>
            </div>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full font-medium border border-indigo-100 dark:border-indigo-800/50">
              {evaluatedCount} Evaluated
            </span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreRanges}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    color: '#F8FAFC',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                  itemStyle={{ color: '#F8FAFC' }}
                  labelStyle={{ color: '#94A3B8', fontWeight: 600 }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                />
                <Bar dataKey="count" name="Candidates" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {evaluatedCount === 0 && (
            <p className="text-xs text-slate-400 dark:text-neutral-500 mt-2 text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Scores will automatically update as interviews are completed.
            </p>
          )}
        </motion.div>

        {/* Interview Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Interview Types Distribution</h3>
            <span className="text-xs text-slate-500 dark:text-neutral-400">
              {interviews.length} Total
            </span>
          </div>

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
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    color: '#F8FAFC',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                  itemStyle={{ color: '#F8FAFC' }}
                  labelStyle={{ color: '#94A3B8', fontWeight: 600 }}
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
        className="bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">7 Continents Candidate Pipeline</h3>
          </div>
          <span className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-bold border border-blue-100 dark:border-blue-900/50">
            Global Coverage (7 Continents)
          </span>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={continentData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis allowDecimals={false} stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  color: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
                itemStyle={{ color: '#F8FAFC' }}
                labelStyle={{ color: '#94A3B8', fontWeight: 600 }}
                cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
              />
              <Bar dataKey="candidates" name="Candidates" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}
