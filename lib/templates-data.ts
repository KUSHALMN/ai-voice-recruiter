export interface InterviewTemplate {
  id: string
  title: string
  role: string
  category: 'Engineering' | 'AI & ML' | 'DevOps' | 'Product & Strategy' | 'Security'
  description: string
  questions: number
  duration: number
  interviewType: 'Technical' | 'Behavioral' | 'Mixed' | 'Leadership'
  candidateType: 'Fresher' | 'Mid-level' | 'Senior' | 'Lead'
  icon: string
  skills: string[]
  sampleQuestions: string[]
  isCustom?: boolean
  created_at?: string
}

export const DEFAULT_INTERVIEW_TEMPLATES: InterviewTemplate[] = [
  {
    id: 'tmpl-fe-react',
    title: 'Frontend React & Next.js Architect',
    role: 'Senior Frontend Engineer',
    category: 'Engineering',
    description: 'Comprehensive evaluation of modern frontend engineering, component lifecycle, Next.js App Router, state management, Core Web Vitals, and TypeScript architectures.',
    questions: 6,
    duration: 25,
    interviewType: 'Technical',
    candidateType: 'Senior',
    icon: '⚛️',
    skills: ['React 19', 'Next.js App Router', 'TypeScript', 'TailwindCSS', 'Web Vitals', 'State Management'],
    sampleQuestions: [
      'Explain how React 19 Server Components differ from Client Components in terms of bundle impact and data hydration.',
      'How do you diagnose and eliminate layout shifts (CLS) and optimize Largest Contentful Paint (LCP) in a high-traffic Next.js application?',
      'Describe a real-world scenario where you had to implement complex global state without causing excessive component re-renders.',
      'How do you structure TypeScript generics for reusable polymorphic UI component libraries?',
      'Walk me through your strategy for client-side error boundaries and resilient network retry logic.',
      'How do you manage client-side accessibility (WCAG 2.1 AA) in interactive multi-step dynamic forms?'
    ]
  },
  {
    id: 'tmpl-fullstack-dev',
    title: 'Full-Stack Software Engineer',
    role: 'Full-Stack Developer',
    category: 'Engineering',
    description: 'Assesses end-to-end full-stack capabilities spanning modern API design, asynchronous processing, relational databases, security headers, and reactive UI architectures.',
    questions: 7,
    duration: 30,
    interviewType: 'Technical',
    candidateType: 'Mid-level',
    icon: '💻',
    skills: ['Node.js / Express', 'React', 'PostgreSQL', 'REST & GraphQL', 'Redis Caching', 'JWT Auth'],
    sampleQuestions: [
      'How do you design a robust idempotency mechanism for payment or order creation endpoints?',
      'Explain the trade-offs between relational indexing with B-Trees vs inverted indexes in high-write applications.',
      'How do you prevent race conditions when two users simultaneously attempt to update the same database row?',
      'Describe how you secure JWT authentication against XSS, CSRF, and token theft in modern browsers.',
      'When would you choose GraphQL subscriptions or WebSockets over traditional Server-Sent Events (SSE)?',
      'How do you structure caching layers using Redis to avoid the cache stampede problem?',
      'Explain how you profile and resolve a memory leak in a production Node.js service.'
    ]
  },
  {
    id: 'tmpl-ai-ml-genai',
    title: 'AI & Generative LLM Systems Engineer',
    role: 'GenAI / Machine Learning Engineer',
    category: 'AI & ML',
    description: 'Evaluates expertise in LLM system design, Retrieval-Augmented Generation (RAG), vector databases, embedding spaces, prompt engineering, and low-latency inference pipelines.',
    questions: 6,
    duration: 30,
    interviewType: 'Technical',
    candidateType: 'Senior',
    icon: '🤖',
    skills: ['Python', 'PyTorch', 'LangChain / LlamaIndex', 'Vector Databases', 'RAG Pipelines', 'FastAPI'],
    sampleQuestions: [
      'Explain the trade-offs between chunking strategies (fixed-size vs semantic vs recursive) in a production RAG pipeline.',
      'How do you prevent hallucination and enforce structured JSON schemas when orchestrating LLM tool calls?',
      'Compare cosine similarity, dot product, and Euclidean distance in high-dimensional embedding spaces (e.g. text-embedding-3).',
      'What strategies do you employ to reduce time-to-first-token (TTFT) when serving streaming LLM responses?',
      'How do you evaluate and benchmark LLM outputs at scale using automated synthetic evaluation frameworks (e.g. Ragas / G-Eval)?',
      'Describe how you would design a multi-agent orchestration architecture with specialized domain tools and shared memory.'
    ]
  },
  {
    id: 'tmpl-backend-arch',
    title: 'Distributed Backend & Cloud Systems Architect',
    role: 'Lead Backend Engineer',
    category: 'Engineering',
    description: 'Deep dive into distributed systems fundamentals, event-driven streaming with Kafka, database sharding, CAP theorem trade-offs, and zero-downtime deployments.',
    questions: 7,
    duration: 35,
    interviewType: 'Technical',
    candidateType: 'Lead',
    icon: '⚙️',
    skills: ['Go / Python', 'PostgreSQL / CockroachDB', 'Apache Kafka', 'Microservices', 'System Design'],
    sampleQuestions: [
      'Design a globally distributed rate limiter that handles 100,000 requests per second across three continents.',
      'How does Kafka guarantee message ordering across partitions, and what happens during a consumer rebalance?',
      'Explain how you would implement distributed transactions using the Saga pattern versus Two-Phase Commit (2PC).',
      'How do you design database schema migrations on a table with 500 million rows without taking down writes?',
      'Compare optimistic vs pessimistic concurrency control in high-throughput financial ledgers.',
      'How do you prevent cascading failures and thundering herd problems in microservice dependency graphs?',
      'Describe how you approach tracing and observability across asynchronous message queues using OpenTelemetry.'
    ]
  },
  {
    id: 'tmpl-devops-sre',
    title: 'Cloud DevOps & Site Reliability Engineer',
    role: 'DevOps / SRE Specialist',
    category: 'DevOps',
    description: 'Validates production infrastructure reliability, Kubernetes cluster orchestrations, Terraform Infrastructure as Code, CI/CD automation, and incident post-mortems.',
    questions: 6,
    duration: 25,
    interviewType: 'Mixed',
    candidateType: 'Mid-level',
    icon: '☁️',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS / GCP', 'CI/CD Pipelines', 'Prometheus & Grafana'],
    sampleQuestions: [
      'How do you configure Kubernetes Horizontal Pod Autoscaling (HPA) based on custom Prometheus metrics rather than standard CPU/memory?',
      'Describe a real production outage you handled: how did you triage the issue, communicate with stakeholders, and prevent recurrence?',
      'What are the security and operational best practices for managing secrets in automated GitOps pipelines (e.g. ArgoCD)?',
      'How do you design a blue-green or canary release deployment strategy that automatically rolls back upon elevated 5xx error rates?',
      'Explain how you implement zero-trust network policies and mutual TLS (mTLS) between service meshes in Kubernetes.',
      'How do you audit and optimize AWS or GCP infrastructure costs without degrading SLA/SLO performance?'
    ]
  },
  {
    id: 'tmpl-product-manager',
    title: 'Technical Product Strategy & Execution',
    role: 'Technical Product Manager',
    category: 'Product & Strategy',
    description: 'Explores product roadmap prioritization, North Star metrics, cross-functional engineering alignment, customer empathy, data-informed iterations, and handling launch setbacks.',
    questions: 6,
    duration: 30,
    interviewType: 'Behavioral',
    candidateType: 'Senior',
    icon: '🎯',
    skills: ['Product Roadmapping', 'User Research', 'Data Analytics', 'Agile / Scrum', 'Stakeholder Alignment'],
    sampleQuestions: [
      'Walk me through how you prioritized your product backlog when faced with competing demands from enterprise sales vs engineering tech debt.',
      'How do you define the North Star metric and leading vs lagging indicators for a self-serve SaaS product?',
      'Describe a product or feature launch that failed to meet expectations: what was your diagnosis and what did you learn?',
      'How do you communicate technical constraints and architectural trade-offs to non-technical executives and commercial partners?',
      'Walk through how you conduct user discovery interviews to uncover unarticulated customer pain points.',
      'How do you balance rapid experimentation and feature velocity with enterprise-grade reliability and compliance?'
    ]
  },
  {
    id: 'tmpl-cybersecurity',
    title: 'Cybersecurity & Cloud Security Analyst',
    role: 'Information Security Engineer',
    category: 'Security',
    description: 'Assesses threat modeling, vulnerability management, cloud IAM least privilege, zero-trust architectures, incident response, and OWASP Top 10 mitigation.',
    questions: 6,
    duration: 30,
    interviewType: 'Technical',
    candidateType: 'Senior',
    icon: '🛡️',
    skills: ['OWASP Top 10', 'Cloud Security (IAM)', 'Penetration Testing', 'SIEM / SOC', 'Zero Trust'],
    sampleQuestions: [
      'How do you detect and mitigate Server-Side Request Forgery (SSRF) in cloud applications interacting with internal metadata services?',
      'Describe how you enforce the Principle of Least Privilege in complex multi-account AWS Organizations using SCPs and IAM permission boundaries.',
      'What is your step-by-step incident response procedure when a production credential or API key is accidentally committed to a public repository?',
      'Explain how you design a Zero Trust access architecture for remote engineering staff accessing internal databases and staging clusters.',
      'How do you integrate automated static and dynamic security scanning (SAST/DAST) into CI/CD pipelines without blocking developer velocity?',
      'How do you evaluate supply-chain vulnerabilities in open-source dependencies (e.g. npm/pip packages) and manage CVE patching?'
    ]
  },
  {
    id: 'tmpl-data-engineer',
    title: 'Enterprise Data Platform & Pipeline Architect',
    role: 'Senior Data Engineer',
    category: 'AI & ML',
    description: 'Evaluates large-scale ETL/ELT pipelines, modern cloud data warehousing (Snowflake / BigQuery), Apache Spark transformations, data lakehouses, and data quality frameworks.',
    questions: 6,
    duration: 30,
    interviewType: 'Technical',
    candidateType: 'Senior',
    icon: '📊',
    skills: ['SQL & PySpark', 'Snowflake / BigQuery', 'Apache Airflow', 'dbt', 'Data Lakehouse', 'Kafka'],
    sampleQuestions: [
      'Compare the trade-offs of ELT using dbt against traditional ETL frameworks for terabyte-scale analytical workloads.',
      'How do you handle late-arriving and out-of-order records in streaming event data architectures?',
      'Explain how partitioning, clustering, and micro-partitions impact query performance and scan costs in Snowflake or BigQuery.',
      'How do you implement data quality assertions and anomaly detection to prevent corrupted data from flowing into production dashboards?',
      'Describe your strategy for slowly changing dimensions (SCD Type 1 vs Type 2 vs Type 4) in analytical dimensional models.',
      'How do you optimize an Apache Spark job suffering from severe data skew and out-of-memory (OOM) shuffle errors?'
    ]
  }
]
