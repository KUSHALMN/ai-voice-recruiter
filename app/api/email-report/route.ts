import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getToken } from 'next-auth/jwt'
import { emailReportSchema } from '@/lib/validations'
import { escapeHtml, sanitizeUrl } from '@/lib/security/sanitize'
import { checkRateLimit } from '@/lib/security/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        // 1. Rate Limiting Protection (Max 10 emails per minute per requester)
        const rateCheck = checkRateLimit(request, 'email-report', { limit: 10, windowSeconds: 60 })
        if (!rateCheck.allowed) {
            return NextResponse.json(
                { error: `Too many email requests. Please wait ${rateCheck.resetSeconds} seconds before trying again.` },
                { status: 429 }
            )
        }

        // 2. Authenticate Request
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        })

        if (!token || !token.email) {
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in to send interview reports.' },
                { status: 401 }
            )
        }

        // 3. Validate Request Body with Zod
        const body = await request.json()
        const parsed = emailReportSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid report email payload', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        const { email, candidateName, jobTitle, score, reportLink } = parsed.data

        // 4. Sanitize inputs to prevent HTML injection / XSS attacks in email clients
        const safeCandidateName = escapeHtml(candidateName)
        const safeJobTitle = escapeHtml(jobTitle || 'Role Assessment')
        const safeScore = escapeHtml(score.toString())
        const safeReportLink = sanitizeUrl(reportLink, 'http://localhost:3000')

        // Check for SMTP credentials
        const hasCredentials = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS

        if (!hasCredentials) {
            // Simulate network delay for realism
            await new Promise(resolve => setTimeout(resolve, 1000))

            return NextResponse.json({
                success: true,
                message: 'Email sent successfully (Simulation Mode)',
                simulated: true
            })
        }

        // Real Email Sending Logic
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
            from: process.env.SMTP_FROM || '"AI Recruiter" <noreply@airecruiter.com>',
            to: email,
            subject: `Interview Report: ${safeCandidateName} - ${safeJobTitle}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
          <h1 style="color: #4F46E5;">Interview Report Ready</h1>
          <p>Hello,</p>
          <p>The AI interview report for <strong>${safeCandidateName}</strong> is ready for review.</p>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6B7280;">Job Title</p>
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #111827;">${safeJobTitle}</p>
            
            <p style="margin: 0; font-size: 14px; color: #6B7280;">Overall Score</p>
            <p style="margin: 0; font-weight: bold; color: #4F46E5; font-size: 24px;">${safeScore}/10</p>
          </div>

          <a href="${safeReportLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Full Report</a>
          
          <p style="margin-top: 30px; font-size: 12px; color: #9CA3AF;">Powered by AI Recruiter</p>
        </div>
      `,
        }

        await transporter.sendMail(mailOptions)

        return NextResponse.json({ success: true, message: 'Email sent successfully' })

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error('Email API Error:', message)
        return NextResponse.json(
            { error: 'Failed to send email', details: message },
            { status: 500 }
        )
    }
}
