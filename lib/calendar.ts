/**
 * Builds a 1-click Google Calendar add-event URL prefilled with candidate assessment details.
 */
export function generateGoogleCalendarUrl({
  jobTitle,
  candidateName,
  interviewUrl,
  durationMinutes = 30,
  deadlineHours = 48,
}: {
  jobTitle: string
  candidateName: string
  interviewUrl: string
  durationMinutes?: number
  deadlineHours?: number
}): string {
  const title = encodeURIComponent(`AI Voice Interview: ${jobTitle} (${candidateName})`)
  
  // Suggested time slot: tomorrow at 10:00 AM local time
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 1)
  startDate.setHours(10, 0, 0, 0)
  
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000)

  const formatIsoForGoogle = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '')
  }

  const datesParam = `${formatIsoForGoogle(startDate)}/${formatIsoForGoogle(endDate)}`

  const description = encodeURIComponent(`
Hi ${candidateName},

You have been invited to complete your AI Voice Screening for the ${jobTitle} role.

• Interview Access Link: ${interviewUrl}
• Suggested Duration: ${durationMinutes} minutes
• Expiration Window: Please complete within ${deadlineHours} hours of invitation.

Requirements:
- Working microphone and quiet environment
- Supported browsers: Chrome, Edge, Safari, Firefox
- Real-time AI voice conversation with automated scorecard generation

Best regards,
Talent Acquisition Team
  `.trim())

  const location = encodeURIComponent(interviewUrl)

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${description}&location=${location}`
}

/**
 * Calculates remaining hours and urgency status for an interview.
 */
export function getInterviewScheduleStatus(createdAtIso?: string, deadlineHours = 48): {
  hoursRemaining: number
  isExpired: boolean
  isUrgent: boolean // Under 12 hours remaining
  statusLabel: string
  statusColor: string
} {
  if (!createdAtIso) {
    return {
      hoursRemaining: deadlineHours,
      isExpired: false,
      isUrgent: false,
      statusLabel: `${deadlineHours}h window open`,
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    }
  }

  const createdTime = new Date(createdAtIso).getTime()
  const deadlineTime = createdTime + deadlineHours * 60 * 60 * 1000
  const now = Date.now()
  const diffMs = deadlineTime - now
  const hoursRemaining = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)))

  if (diffMs <= 0) {
    return {
      hoursRemaining: 0,
      isExpired: true,
      isUrgent: true,
      statusLabel: 'Deadline Expired',
      statusColor: 'text-red-700 bg-red-50 border-red-200'
    }
  }

  if (hoursRemaining <= 12) {
    return {
      hoursRemaining,
      isExpired: false,
      isUrgent: true,
      statusLabel: `Expires in ${hoursRemaining}h (Urgent)`,
      statusColor: 'text-amber-700 bg-amber-50 border-amber-200'
    }
  }

  return {
    hoursRemaining,
    isExpired: false,
    isUrgent: false,
    statusLabel: `${hoursRemaining}h remaining`,
    statusColor: 'text-indigo-700 bg-indigo-50 border-indigo-200'
  }
}
