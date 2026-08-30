import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
    try {
        const { email, candidateName, jobTitle, score, reportLink } = await request.json()

        if (!email || !candidateName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check for SMTP credentials
        const hasCredentials = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS

        if (!hasCredentials) {
            // Simulate network delay for realism
            await new Promise(resolve => setTimeout(resolve, 1500))

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
            subject: `Interview Report: ${candidateName} - ${jobTitle}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Interview Report Ready</h1>
          <p>Hello,</p>
          <p>The AI interview report for <strong>${candidateName}</strong> is ready for review.</p>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6B7280;">Job Title</p>
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #111827;">${jobTitle}</p>
            
            <p style="margin: 0; font-size: 14px; color: #6B7280;">Overall Score</p>
            <p style="margin: 0; font-weight: bold; color: #4F46E5; font-size: 24px;">${score}/10</p>
          </div>

          <a href="${reportLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Full Report</a>
          
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
