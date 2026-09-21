export interface TextChunk {
  index: number
  content: string
  section: string
  metadata: {
    characterCount: number
    wordCount: number
    tokenEstimate: number
    hasMetrics: boolean
    hasSkills: boolean
    parentSection: string
    detectedSkills: string[]
  }
}

interface ChunkOptions {
  maxChunkSize?: number
  overlap?: number
}

const SECTION_HEADERS = [
  'experience',
  'work experience',
  'employment history',
  'professional experience',
  'skills',
  'technical skills',
  'core competencies',
  'projects',
  'key projects',
  'personal projects',
  'education',
  'certifications',
  'summary',
  'professional summary',
  'about me',
]

const KNOWN_SKILL_PATTERNS = [
  'react', 'next.js', 'vue', 'angular', 'node', 'node.js', 'typescript', 'javascript',
  'python', 'fastapi', 'django', 'flask', 'go', 'golang', 'rust', 'c++', 'c#', 'java',
  'spring', 'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'ci/cd',
  'postgresql', 'postgres', 'sql', 'mysql', 'mongodb', 'redis', 'graphql', 'rest',
  'microservices', 'tailwind', 'kafka', 'rabbitmq', 'elasticsearch'
]

function detectSkills(text: string): string[] {
  const lower = text.toLowerCase()
  const found: string[] = []
  for (const skill of KNOWN_SKILL_PATTERNS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escaped}\\b`, 'i')
    if (regex.test(lower)) {
      found.push(skill)
    }
  }
  return found
}

function createChunk(index: number, content: string, section: string): TextChunk {
  const wordCount = content.split(/\s+/).filter(Boolean).length
  const characterCount = content.length
  const tokenEstimate = Math.ceil(characterCount / 4)
  const hasMetrics = /\d+[%$kKmMbB]?|\b\d{1,4}\b/.test(content)
  const detectedSkills = detectSkills(content)
  const hasSkills = detectedSkills.length > 0

  return {
    index,
    content,
    section,
    metadata: {
      characterCount,
      wordCount,
      tokenEstimate,
      hasMetrics,
      hasSkills,
      parentSection: section,
      detectedSkills,
    },
  }
}

/**
 * Parses resume text into semantic chunks respecting section boundaries,
 * paragraphs, and sentences.
 */
export function chunkResumeText(text: string, options: ChunkOptions = {}): TextChunk[] {
  const maxChunkSize = options.maxChunkSize || 600
  const overlap = options.overlap || 100

  if (!text || !text.trim()) {
    return []
  }

  const cleanText = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
  const lines = cleanText.split('\n')

  const sections: { name: string; content: string[] }[] = []
  let currentSection = 'Overview'
  let currentLines: string[] = []

  // Step 1: Detect sections
  for (const line of lines) {
    const trimmed = line.trim()
    const lower = trimmed.toLowerCase().replace(/[:#*-]/g, '').trim()

    const isHeader = SECTION_HEADERS.some(h => lower === h || lower.startsWith(`${h} `))
    if (isHeader && trimmed.length < 40) {
      if (currentLines.length > 0) {
        sections.push({ name: currentSection, content: currentLines })
        currentLines = []
      }
      currentSection = trimmed
    } else {
      currentLines.push(line)
    }
  }

  if (currentLines.length > 0) {
    sections.push({ name: currentSection, content: currentLines })
  }

  // Step 2: Slice sections into overlapping chunks
  const chunks: TextChunk[] = []
  let chunkIndex = 0

  for (const section of sections) {
    const sectionText = section.content.join('\n').trim()
    if (!sectionText) continue

    // If section fits in one chunk
    if (sectionText.length <= maxChunkSize) {
      chunks.push(createChunk(chunkIndex++, sectionText, section.name))
      continue
    }

    // Split by paragraphs or sentence boundaries
    const paragraphs = sectionText.split(/\n\s*\n/)
    let accumulator = ''

    for (const p of paragraphs) {
      const pTrimmed = p.trim()
      if (!pTrimmed) continue

      if ((accumulator + '\n\n' + pTrimmed).length <= maxChunkSize) {
        accumulator = accumulator ? `${accumulator}\n\n${pTrimmed}` : pTrimmed
      } else {
        if (accumulator) {
          chunks.push(createChunk(chunkIndex++, accumulator, section.name))
          // Keep trailing overlap
          const overlapText = accumulator.slice(-overlap)
          accumulator = `${overlapText}\n\n${pTrimmed}`
        } else {
          // Paragraph itself exceeds maxChunkSize: split by sentences
          const sentences = pTrimmed.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [pTrimmed]
          let sAccumulator = ''

          for (const s of sentences) {
            if ((sAccumulator + s).length <= maxChunkSize) {
              sAccumulator += s
            } else {
              if (sAccumulator) {
                chunks.push(createChunk(chunkIndex++, sAccumulator.trim(), section.name))
                sAccumulator = sAccumulator.slice(-overlap) + s
              } else {
                chunks.push(createChunk(chunkIndex++, s.trim(), section.name))
                sAccumulator = ''
              }
            }
          }
          if (sAccumulator.trim()) {
            accumulator = sAccumulator.trim()
          }
        }
      }
    }

    if (accumulator.trim()) {
      chunks.push(createChunk(chunkIndex++, accumulator.trim(), section.name))
    }
  }

  return chunks
}
