export interface StandardRubric {
  jobTitle: string
  category: string
  questionConcept: string
  idealAnswer: string
  criteria: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export const STANDARD_RUBRICS: StandardRubric[] = [
  {
    jobTitle: 'Frontend Engineer / Full Stack Engineer',
    category: 'Frontend & React Architecture',
    questionConcept: 'React state re-rendering optimization and memoization tradeoffs',
    idealAnswer: 'Explains virtual DOM reconciliation, pure components, React.memo, useMemo, and useCallback. Identifies that shallow prop comparisons have overhead and should not be used preemptively without profiling. Mentions keeping state localized and utilizing immutable updates.',
    criteria: [
      'Mentions React reconciliation and how props changes trigger child re-renders',
      'Accurately explains useMemo vs useCallback with realistic dependencies array behavior',
      'Articulates that premature memoization carries memory and comparison cost overhead',
      'Suggests moving state closer to leaf components or using compound components to avoid drilling',
    ],
    difficulty: 'medium',
  },
  {
    jobTitle: 'Backend Engineer / Systems Architect',
    category: 'Backend & API Design',
    questionConcept: 'API rate-limiting, concurrency controls, and idempotency keys',
    idealAnswer: 'Describes token bucket or sliding-window rate limiting using Redis. Explains how Idempotency-Key headers prevent duplicate charges or operations during network timeouts by caching response hashes in an atomic transaction store.',
    criteria: [
      'Distinguishes token bucket / leaky bucket vs fixed window counters',
      'Explains Redis atomic operations (MULTI/EXEC or Lua scripts) for distributed concurrency',
      'Explains Idempotency-Key header design: checking key presence before executing mutative logic',
      'Correctly returns 429 Too Many Requests with Retry-After header for rate-limited requests',
    ],
    difficulty: 'hard',
  },
  {
    jobTitle: 'Full Stack Engineer / Database Engineer',
    category: 'Database Optimization',
    questionConcept: 'PostgreSQL indexing, EXPLAIN ANALYZE, and N+1 query resolution',
    idealAnswer: 'Walks through using EXPLAIN (ANALYZE, BUFFERS) to detect Sequential Scans vs Index Scans. Explains composite index column order (equality first, range second). Identifies N+1 query patterns in ORMs and resolves them with eager joins (JOIN FETCH) or batching dataloaders.',
    criteria: [
      'Identifies Sequential Scan bottlenecks and recommends B-tree or partial indexes',
      'Explains composite index column ordering rules (cardinality and query filters)',
      'Accurately diagnoses the N+1 problem and provides concrete batch/join solutions',
      'Mentions connection pooling (e.g. PgBouncer) and transaction lock mitigation',
    ],
    difficulty: 'medium',
  },
  {
    jobTitle: 'DevOps / Cloud Engineer',
    category: 'Cloud & Infrastructure',
    questionConcept: 'Zero-downtime blue/green deployment and rollback strategies in Kubernetes',
    idealAnswer: 'Explains blue/green vs rolling update strategies with Kubernetes Deployments and Services. Defines readiness probes and liveness probes to prevent routing traffic to unready pods. Explains automated rollbacks on non-zero exit codes or degraded health check telemetry.',
    criteria: [
      'Distinguishes readiness probes from liveness probes accurately',
      'Explains traffic shifting mechanisms via ingress controller, service selector, or service mesh',
      'Details automated health verification before terminating legacy replica pods',
      'Covers database schema backward compatibility during progressive rollouts',
    ],
    difficulty: 'hard',
  },
  {
    jobTitle: 'Software Engineer',
    category: 'Data Structures & Algorithms',
    questionConcept: 'Time and space complexity tradeoffs and graph/tree search',
    idealAnswer: 'Thoroughly derives Big-O time and auxiliary space complexity. Compares BFS (queue, shortest path in unweighted graphs) vs DFS (recursion/stack, memory proportional to tree depth). Considers edge cases: cycles, disconnected components, and empty inputs.',
    criteria: [
      'Accurately states worst-case time and space complexity with clear variable definitions (V + E)',
      'Uses appropriate auxiliary data structures (visited Set, Queue for BFS, Stack for DFS)',
      'Proactively identifies edge cases (cycles, null pointers, single node trees)',
      'Suggests optimizations or early-exit conditions when target is reached',
    ],
    difficulty: 'medium',
  },
  {
    jobTitle: 'All Engineering Roles',
    category: 'STAR Behavioral & Engineering Leadership',
    questionConcept: 'Resolving severe technical disagreements and post-mortem accountability',
    idealAnswer: 'Follows structured STAR method (Situation, Task, Action, Result). Demonstrates focus on data-driven benchmarking and objective proof-of-concepts rather than personal ego. Upholds Amazon-style "disagree and commit" and blameless post-mortem culture focused on systems improvement.',
    criteria: [
      'Follows clear STAR structure (Situation, Task, Action, Result)',
      'Separates technical arguments from personal conflict; leverages empirical data/benchmarks',
      'Demonstrates commitment to team velocity and blameless post-mortem principles',
      'Shares measurable outcomes or takeaways that prevented future regressions',
    ],
    difficulty: 'medium',
  },
]
