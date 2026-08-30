'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { motion } from 'framer-motion'

interface DashboardChartsProps {
    interviews: any[]
}

export default function DashboardCharts({ interviews }: DashboardChartsProps) {
    // 1. Calculate Score Distribution
    const scoreRanges = [
        { name: '0-4', count: 0 },
        { name: '5-7', count: 0 },
        { name: '8-10', count: 0 },
    ]

    interviews.forEach(interview => {
        const score = interview.evaluation?.scores?.overall || 0
        if (score >= 8) scoreRanges[2].count++
        else if (score >= 5) scoreRanges[1].count++
        else scoreRanges[0].count++
    })

    // 2. Calculate Interview Types
    const typeCounts: { [key: string]: number } = {}
    interviews.forEach(interview => {
        const type = interview.interview_type || 'Unknown'
        typeCounts[type] = (typeCounts[type] || 0) + 1
    })

    const typeData = Object.keys(typeCounts).map(type => ({
        name: type,
        value: typeCounts[type]
    }))

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

    if (interviews.length === 0) {
        return null
    }

    return (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Score Distribution Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidate Performance</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scoreRanges}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: '#f3f4f6' }}
                            />
                            <Bar dataKey="count" name="Candidates" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Interview Type Distribution */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Types</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={typeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {typeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    )
}
