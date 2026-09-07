import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { generateGoogleCalendarUrl } from '@/lib/calendar'

export async function POST(request: NextRequest) {
  try {
    const { candidateEmail, candidateName, jobTitle, interviewLink, deadlineHours = 48, hoursRemaining = 24 } = await request.json()

    if (!candidateEmail || !candidateName) {
      return NextResponse.json(
        { error: 'Candidate email and name are required' },
        { status: 400 }
      )
    }

    const calendarUrl = generateGoogleCalendarUrl({
      jobTitle: jobTitle || 'Software Engineer',
      candidateName,
      interviewUrl: interviewLink || 'http://localhost:3000',
      durationMinutes: 20,
      deadlineHours
    })

    const hasCredentials = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS

    if (!hasCredentials) {
      // Simulate realistic email delivery delay
      await new Promise(resolve => setTimeout(resolve, 800))

      return NextResponse.json({
        success: true,
        message: `48-Hour reminder nudge dispatched to ${candidateEmail} (Simulation Mode)`,
        simulated: true,
        calendarUrl,
        sentAt: new Date().toISOString()
      })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_FROM || '"AI Recruiter Talent Team" <noreply@airecruiter.com>',
      to: candidateEmail,
      subject: `Reminder: Complete your AI Voice Screening for ${jobTitle} (${hoursRemaining}h remaining)`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="margin-bottom: 20px;">
            <span style="background: #eef2ff; color: #4f46e5; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Action Required</span>
          </div>
          
          <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Hi ${candidateName},</h2>
          
          <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            This is a friendly reminder that your AI Voice Interview for the <strong>${jobTitle}</strong> position is waiting for you.
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 10px; margin: 24px 0;">
            <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: 600;">Time Remaining</p>
            <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #dc2626;">⏳ Approximately ${hoursRemaining} hours left in your ${deadlineHours}-hour window</p>
            <p style="margin: 0; font-size: 13px; color: #64748b;">The assessment takes approximately 15-20 minutes. You will converse with our AI recruiter using your microphone.</p>
          </div>

          <div style="margin: 28px 0; display: flex; gap: 12px;">
            <a href="${interviewLink}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Start Voice Interview Now →</a>
            &nbsp;&nbsp;
            <a href="${calendarUrl}" style="display: inline-block; background-color: #f1f5f9; color: #334155; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid #cbd5e1;">📅 Add to Google Calendar</a>
          </div>

          <p style="font-size: 13px; color: #94a3b8; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
            If you have already completed this session, please disregard this email.<br/>
            Powered by <strong>AI Voice Recruiter</strong>
          </p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: `Reminder nudge email successfully delivered to ${candidateEmail}`,
      simulated: false,
      calendarUrl,
      sentAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Candidate nudge error:', error)
    return NextResponse.json(
      { error: 'Failed to dispatch candidate reminder nudge' },
      { status: 500 }
    )
  }
}
