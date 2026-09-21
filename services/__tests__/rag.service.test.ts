import { describe, it, expect } from 'vitest'
import { BM25Index, reciprocalRankFusion } from '@/lib/rag/hybridSearch'
import { expandQuery } from '@/lib/rag/queryExpansion'
import { reRankChunks } from '@/lib/rag/reranker'
import { validateGrounding } from '@/lib/rag/groundingGuard'
import { chunkResumeText } from '@/lib/rag/chunker'

describe('Enterprise RAG Architecture', () => {
  describe('BM25 Sparse Lexical Search', () => {
    it('should index documents and retrieve exact keyword matches with proper scoring', () => {
      const index = new BM25Index()
      index.addDocuments([
        {
          id: 'doc-1',
          content: 'Built scalable backend microservices using Go, Docker, and Kubernetes on AWS.',
        },
        {
          id: 'doc-2',
          content: 'Frontend engineer with React, Next.js, and Tailwind CSS experience.',
        },
        {
          id: 'doc-3',
          content: 'Managed PostgreSQL database migrations, indexing, and pgvector embeddings.',
        },
      ])

      const results = index.search('Kubernetes microservices', 5)
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].id).toBe('doc-1')
      expect(results[0].score).toBeGreaterThan(0)
    })
  })

  describe('Reciprocal Rank Fusion (RRF)', () => {
    it('should fuse dense vector rankings and sparse BM25 rankings', () => {
      const dense = [
        { id: 'doc-a', content: 'Distributed systems', score: 0.95 },
        { id: 'doc-b', content: 'Microservices', score: 0.85 },
      ]
      const sparse = [
        { id: 'doc-b', content: 'Microservices', score: 12.4 },
        { id: 'doc-c', content: 'Monolith to microservices', score: 9.1 },
      ]

      const fused = reciprocalRankFusion(dense, sparse, 60, 3)

      expect(fused.length).toBe(3)
      expect(fused[0].rank).toBe(1)
      // doc-b appeared in both lists, so its fused score should be highest or near top
      expect(fused.find(f => f.id === 'doc-b')?.fusedScore).toBeGreaterThan(0)
    })
  })

  describe('Multi-Query Expansion', () => {
    it('should expand queries into multi-faceted technical search vectors', () => {
      const expanded = expandQuery('distributed backend systems')
      expect(expanded.originalQuery).toBe('distributed backend systems')
      expect(expanded.subQueries.length).toBeGreaterThanOrEqual(2)
      expect(expanded.subQueries.some(q => q.includes('architecture'))).toBe(true)
      expect(expanded.expandedKeywords.length).toBeGreaterThan(0)
    })
  })

  describe('Semantic Re-ranking', () => {
    it('should prioritize chunks with quantitative metrics and relevant section headers', () => {
      const chunks = [
        {
          id: 'chunk-1',
          content: 'Experienced software engineer who likes clean code and teamwork.',
          section: 'Summary',
          initialScore: 0.80,
        },
        {
          id: 'chunk-2',
          content: 'Optimized PostgreSQL queries, cutting p99 latency by 45% and handling 15k rps.',
          section: 'Work Experience',
          initialScore: 0.75,
        },
      ]

      const reRanked = reRankChunks('PostgreSQL latency optimization', chunks, 2)
      expect(reRanked.length).toBe(2)
      // chunk-2 has quantitative metrics, experience section boost, and exact query matches
      expect(reRanked[0].id).toBe('chunk-2')
      expect(reRanked[0].evidenceFactors.metricsBoost).toBeGreaterThan(0)
    })
  })

  describe('Grounding & Faithfulness Guardrail', () => {
    it('should detect when generated text is faithful to resume context', () => {
      const context = [
        'Built enterprise web applications with React, TypeScript, and Next.js.',
        'Managed state with Redux Toolkit and deployed to AWS Amplify.',
      ]

      const faithfulQuestion = 'Can you explain how you structured your React and TypeScript components on AWS?'
      const result = validateGrounding(faithfulQuestion, context)

      expect(result.isFaithful).toBe(true)
      expect(result.groundingScore).toBeGreaterThanOrEqual(0.6)
    })

    it('should flag unsupported technical claims not present in context', () => {
      const context = [
        'Built frontend with HTML and Vanilla CSS.',
      ]

      const ungroundedQuestion = 'How did you use Kubernetes, Rust, and Kafka in production?'
      const result = validateGrounding(ungroundedQuestion, context)

      expect(result.isFaithful).toBe(false)
      expect(result.unsupportedClaims.length).toBeGreaterThan(0)
    })
  })

  describe('Hierarchical Resume Chunking', () => {
    it('should produce chunks with enriched metadata, token estimates, and detected skills', () => {
      const resume = `
Work Experience
Senior Full Stack Engineer at TechCorp
- Architected cloud platforms on AWS using Docker and Kubernetes.
- Built Next.js and TypeScript frontend applications with 99.9% availability.
- Improved database performance by 30% across 500,000 active users.

Skills
React, Next.js, Node.js, TypeScript, Docker, Kubernetes, AWS, PostgreSQL
      `

      const chunks = chunkResumeText(resume)
      expect(chunks.length).toBeGreaterThan(0)
      const first = chunks[0]
      expect(first.metadata.parentSection).toBeDefined()
      expect(first.metadata.tokenEstimate).toBeGreaterThan(0)
      expect(first.metadata.hasMetrics).toBe(true)
      expect(first.metadata.detectedSkills.length).toBeGreaterThan(0)
    })
  })
})
