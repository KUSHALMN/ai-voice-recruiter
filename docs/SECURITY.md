# Security Policy & Architecture

## Security Overview

AI Voice Recruiter is engineered with an enterprise-grade, defense-in-depth security architecture designed to protect sensitive recruitment data, candidate audio/video feeds, intellectual property, and AI evaluation pipelines against modern adversarial threats.

---

## 1. Vulnerability Reporting (Vulnerability Disclosure Program)

We welcome security researchers and ethical hackers to identify and responsibly disclose vulnerabilities.

- **Security Contact:** `security@aivoicerecruiter.com` (or submit via PGP-encrypted email)
- **Response SLA:**
  - **Initial Triage:** Within 24 hours
  - **Severity Assessment & Fix:** Within 72 hours for High/Critical issues
- **Scope:**
  - Next.js web application boundaries (`/api/*`, `/interview/*`, `/dashboard/*`)
  - Voice WebRTC/WebSocket streaming endpoints
  - Fast-API evaluation services
- **Out of Scope:**
  - Denial of Service (DoS/DDoS) attacks against production infrastructure
  - Social engineering or phishing targeting company employees or candidates

---

## 2. Multi-Layer Defense-in-Depth Architecture

```
[ Incoming Request ]
        │
        ▼
[ Layer 1: Edge Middleware & Attack Scanner Shield ]
   ├── IP-based Burst Rate Limiting (Token Bucket)
   ├── Known Vulnerability Scanner Blocking (.env, wp-admin, .git, etc.)
   ├── Dangerous User-Agent & Headless Bot Filtering
   └── Path Traversal & Encoded Byte Attack Prevention
        │
        ▼
[ Layer 2: HTTP Transport & Content Security Policy (CSP) ]
   ├── Strict Nonce-Ready Content-Security-Policy
   ├── Strict-Transport-Security (HSTS 2-Year Preload)
   ├── X-Frame-Options: DENY (Zero Clickjacking)
   ├── Cross-Origin-Opener-Policy: same-origin
   └── Referrer-Policy: strict-origin-when-cross-origin
        │
        ▼
[ Layer 3: Application Security & Input Sanitization ]
   ├── Deep Recursive Input Sanitization (lib/security/sanitize.ts)
   ├── SQL Injection & XSS Escape Guards
   ├── Cryptographic Double-Submit Cookie CSRF Validation (lib/security/csrf.ts)
   └── Route-level Role-Based Access Control (RBAC)
        │
        ▼
[ Layer 4: Candidate Interview Anti-Tamper & Anti-Scraping ]
   ├── DevTools Open & Inspection Detection
   ├── Right-Click, Copy/Paste & Context Menu Locking
   ├── Window Blur & Tab-Switch Probing
   └── Automated Solvers / AI Teleprompter Mitigations
        │
        ▼
[ Layer 5: Data Privacy & Compliance ]
   ├── GDPR Article 17 Right-to-be-Forgotten Endpoint (`/api/compliance/delete-data`)
   ├── CCPA Opt-Out & Cookie Consent Preference Management
   └── Short-Lived Ephemeral Candidate Session Tokens
```

---

## 3. Threat Model & Mitigations

| Threat Vector | Potential Impact | Implemented Mitigation |
|:---|:---|:---|
| **Automated Vulnerability Scanners** | Server enumeration, reconnaissance | Edge middleware blocks requests matching `.env`, `.git`, `phpinfo`, `/wp-login`, and `dirbuster` signatures with HTTP 403. |
| **Cross-Site Scripting (XSS)** | Session hijack, keylogging | Strict Content-Security-Policy forbidding inline unsafe scripts; recursive HTML-entity escaping on all user-supplied strings. |
| **Cross-Site Request Forgery (CSRF)** | Unauthorized state mutations | Cryptographically generated HMAC-SHA256 double-submit cookie tokens on sensitive POST/PUT/DELETE routes. |
| **SQL Injection & ORM Tampering** | Unauthorized data access | Parameterized queries via Supabase client; string guards rejecting raw SQL patterns (`UNION SELECT`, `--`, `1=1`). |
| **Interview Content Theft / Scraping** | Leaking proprietary interview question banks | Anti-tamper client guard disables context menu, selection, DevTools shortcuts (F12, Ctrl+Shift+I), and logs tab focus switches. |
| **Prompt Injection into AI Evaluation** | Inflating candidate interview scores | Structured JSON schemas with strict validation; candidate transcript text is demarcated as untrusted data inputs in LLM prompts. |

---

## 4. Candidate Data Privacy & Compliance

- **GDPR Article 17 (Right to Erasure):** Candidates can trigger permanent erasure of voice recordings, transcripts, and evaluation vectors via `POST /api/compliance/delete-data`.
- **Zero Audio Retention Mode:** Audio buffers are processed in-memory for real-time transcription and immediately discarded if client retention is disabled.
- **Biometric Voice Data Protection:** Voice embeddings are stored in isolated encrypted partitions with access restricted to authorized hiring managers.

---

## 5. Security Updates & Incident Management

All dependencies are monitored continuously via automated vulnerability audits (`npm audit`). Critical patches are deployed automatically to production within 24 hours of vendor publication.
