import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const pdf = require('pdf-parse/lib/pdf-parse.js')
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const data = await pdf(buffer)

        const cleanText = data.text
            .replace(/\n+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()

        return NextResponse.json({ text: cleanText })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            { error: `Failed to parse resume: ${message}` },
            { status: 500 }
        )
    }
}
