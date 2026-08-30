export const DEMO_REPORTS_MAP: Record<string, any> = {
  'demo-1': {
    id: 'demo-1', candidate_name: 'Aarav Sharma', candidate_email: 'aarav.sharma@email.com',
    job_title: 'Software Engineer', interview_type: 'Technical', recruiter_email: 'recruiter@company.com',
    created_at: '2026-03-05T10:00:00Z', status: 'completed',
    isDemo: true,
    interview_sessions: [{
      id: 'sess-1a2b3c4d',
      recommendation: 'Strongly Recommend Hire',
      scores: { overall: 8.5, technical: 9, communication: 8, confidence: 8 },
      report: {
        summary: 'Aarav demonstrated exceptional technical depth in system design and algorithms. He solved the given problem optimally and explained his approach clearly. His communication was concise and professional throughout the session.',
        strengths: ['Strong algorithmic thinking', 'Excellent code quality', 'Clear communication', 'System design knowledge'],
        improvements: ['Could elaborate more on trade-offs', 'Minor hesitation on distributed systems concepts'],
        questions: [
          { question: 'Explain the difference between TCP and UDP', answer: 'Aarav clearly explained both protocols with practical examples.', score: 9 },
          { question: 'Design a URL shortener', answer: 'Provided a solid design with caching and database sharding.', score: 8 },
          { question: 'What is a closure in JavaScript?', answer: 'Explained closures accurately with a real-world use case.', score: 9 },
        ]
      }
    }]
  },
  'demo-2': {
    id: 'demo-2', candidate_name: 'Priya Nair', candidate_email: 'priya.nair@email.com',
    job_title: 'Product Manager', interview_type: 'Behavioral', recruiter_email: 'recruiter@company.com',
    created_at: '2026-03-06T11:30:00Z', status: 'completed',
    isDemo: true,
    interview_sessions: [{
      id: 'sess-2b3c4d5e',
      recommendation: 'Recommend Hire',
      scores: { overall: 7.2, technical: 6, communication: 9, confidence: 7 },
      report: {
        summary: 'Priya showed strong product thinking and stakeholder communication skills. She articulated her past experiences effectively using the STAR method. Her ability to prioritize features and handle user feedback was impressive.',
        strengths: ['Outstanding communication', 'Strong product intuition', 'Great stakeholder management', 'Data-driven decision making'],
        improvements: ['Limited technical depth', 'Could improve on agile methodology specifics'],
        questions: [
          { question: 'Tell me about a product you launched from scratch', answer: 'Described a fintech product with clear metrics and impact.', score: 8 },
          { question: 'How do you handle conflicting stakeholder priorities?', answer: 'Gave a structured answer with a real conflict resolution example.', score: 7 },
          { question: 'How do you measure success of a feature?', answer: 'Mentioned DAU, retention, and NPS as key metrics.', score: 7 },
        ]
      }
    }]
  },
  'demo-3': {
    id: 'demo-3', candidate_name: 'Rahul Verma', candidate_email: 'rahul.verma@email.com',
    job_title: 'Full Stack Developer', interview_type: 'Technical', recruiter_email: 'recruiter@company.com',
    created_at: '2026-03-07T09:00:00Z', status: 'completed',
    isDemo: true,
    interview_sessions: [{
      id: 'sess-3c4d5e6f',
      recommendation: 'Review Needed',
      scores: { overall: 6.0, technical: 7, communication: 5, confidence: 6 },
      report: {
        summary: 'Rahul has decent technical knowledge but struggled to articulate his thought process clearly. He completed coding tasks with some guidance. Communication skills need improvement especially when explaining complex topics.',
        strengths: ['Good coding ability', 'Familiar with React and Node.js', 'Willing to learn'],
        improvements: ['Communication needs work', 'Struggles under pressure', 'Limited database knowledge'],
        questions: [
          { question: 'Explain REST vs GraphQL', answer: 'Had a basic understanding but confused some concepts.', score: 6 },
          { question: 'Write a React component with state management', answer: 'Completed with guidance, used hooks correctly.', score: 7 },
          { question: 'Explain database indexing', answer: 'Gave a partial answer, missed key performance implications.', score: 5 },
        ]
      }
    }]
  },
  'demo-4': {
    id: 'demo-4', candidate_name: 'Sneha Patel', candidate_email: 'sneha.patel@email.com',
    job_title: 'Data Scientist', interview_type: 'Technical', recruiter_email: 'recruiter@company.com',
    created_at: '2026-03-08T14:00:00Z', status: 'completed',
    isDemo: true,
    interview_sessions: [{
      id: 'sess-4d5e6f7a',
      recommendation: 'Strongly Recommend Hire',
      scores: { overall: 9.1, technical: 9, communication: 9, confidence: 9 },
      report: {
        summary: 'Sneha is an outstanding data scientist candidate. She demonstrated deep knowledge of ML algorithms, statistical modeling, and data pipelines. Her communication was exceptional — she made complex concepts easy to understand and showed great enthusiasm.',
        strengths: ['Deep ML knowledge', 'Excellent statistics foundation', 'Clear communication of complex topics', 'Strong Python skills', 'Experience with production ML systems'],
        improvements: ['Slightly over-engineers solutions', 'Could improve on A/B testing design'],
        questions: [
          { question: 'Explain the bias-variance tradeoff', answer: 'Flawless explanation with practical examples.', score: 9 },
          { question: 'How would you handle a highly imbalanced dataset?', answer: 'Mentioned SMOTE, class weights, and precision-recall tradeoffs.', score: 9 },
          { question: 'Design an ML pipeline for fraud detection', answer: 'Comprehensive answer covering feature engineering, model selection, and monitoring.', score: 9 },
        ]
      }
    }]
  },
  'demo-5': {
    id: 'demo-5', candidate_name: 'Karan Mehta', candidate_email: 'karan.mehta@email.com',
    job_title: 'UX Designer', interview_type: 'Behavioral', recruiter_email: 'recruiter@company.com',
    created_at: '2026-03-09T10:30:00Z', status: 'completed',
    isDemo: true,
    interview_sessions: [{
      id: 'sess-5e6f7a8b',
      recommendation: 'Recommend Hire',
      scores: { overall: 7.8, technical: 7, communication: 8, confidence: 8 },
      report: {
        summary: 'Karan showcased a strong design portfolio and good understanding of user-centered design principles. He walked through his design process clearly and demonstrated empathy for end users. His collaboration skills stood out.',
        strengths: ['User-centered design approach', 'Strong portfolio', 'Great collaboration skills', 'Proficient in Figma'],
        improvements: ['Limited experience with design systems at scale', 'Could improve quantitative research skills'],
        questions: [
          { question: 'Walk us through your design process', answer: 'Described a clear research-to-prototype-to-test workflow.', score: 8 },
          { question: 'How do you handle design feedback from engineers?', answer: 'Gave a constructive answer about collaboration and trade-offs.', score: 8 },
          { question: 'Tell me about a design failure and what you learned', answer: 'Shared a genuine story with good self-awareness.', score: 7 },
        ]
      }
    }]
  },
  'demo-6': {
    id: 'demo-6', candidate_name: 'Ananya Gupta', candidate_email: 'ananya.gupta@email.com',
    job_title: 'Backend Developer', interview_type: 'Technical', recruiter_email: 'recruiter@company.com',
    created_at: '2026-03-10T13:00:00Z', status: 'completed',
    isDemo: true,
    interview_sessions: [{
      id: 'sess-6f7a8b9c',
      recommendation: 'Review Needed',
      scores: { overall: 5.5, technical: 6, communication: 5, confidence: 5 },
      report: {
        summary: 'Ananya has foundational backend knowledge but struggled with advanced concepts. She showed potential but needs more hands-on experience with system design and performance optimization. Communication was below expectations.',
        strengths: ['Basic API development skills', 'Knowledge of REST principles', 'Eager to learn'],
        improvements: ['Weak on system design', 'Limited database optimization knowledge', 'Communication clarity', 'Concurrency concepts'],
        questions: [
          { question: 'Explain database transactions and ACID properties', answer: 'Knew the acronym but could not explain isolation well.', score: 5 },
          { question: 'How would you optimize a slow SQL query?', answer: 'Mentioned indexing but lacked depth on query planning.', score: 6 },
          { question: 'What is a message queue and when would you use it?', answer: 'Gave a basic answer, could not name specific tools.', score: 5 },
        ]
      }
    }]
  },
  'demo-7': {
    id: 'demo-7', candidate_name: 'Vikram Singh', candidate_email: 'vikram.singh@email.com',
    job_title: 'DevOps Engineer', interview_type: 'Mixed', recruiter_email: 'recruiter@company.com',
    created_at: '2026-03-11T09:00:00Z', status: 'completed',
    isDemo: true,
    interview_sessions: [{
      id: 'sess-7a8b9c0d',
      recommendation: 'Recommend Hire',
      scores: { overall: 8.0, technical: 8, communication: 8, confidence: 8 },
      report: {
        summary: 'Vikram demonstrated solid DevOps expertise covering CI/CD pipelines, containerization, and cloud infrastructure. He was confident and articulate, clearly describing past projects. A reliable candidate for a mid-senior DevOps role.',
        strengths: ['Strong CI/CD pipeline knowledge', 'Kubernetes and Docker expertise', 'Good cloud (AWS/GCP) knowledge', 'Clear incident management approach'],
        improvements: ['Limited experience with GitOps', 'Could improve on cost optimization strategies'],
        questions: [
          { question: 'Describe your CI/CD pipeline setup', answer: 'Detailed an end-to-end pipeline with GitHub Actions and ArgoCD.', score: 8 },
          { question: 'How do you handle a production outage?', answer: 'Gave a structured runbook-style answer with clear priority steps.', score: 8 },
          { question: 'Explain Kubernetes pods, services, and deployments', answer: 'Clear and accurate explanation with practical examples.', score: 8 },
        ]
      }
    }]
  },
}

export const DEMO_REPORTS = Object.values(DEMO_REPORTS_MAP)
