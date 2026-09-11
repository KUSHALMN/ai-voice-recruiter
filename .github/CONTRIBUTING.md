# Contributing to AI Voice Recruiter (AIRA)

Thank you for your interest in contributing to **AI Voice Recruiter**! We welcome bug fixes, performance optimizations, security enhancements, and new feature integrations.

---

## 🛠️ Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KUSHALMN/ai-voice-recruiter.git
   cd ai-voice-recruiter
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install Python backend dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase, NextAuth, and AI provider keys.

5. **Start Development Servers**:
   ```bash
   npm run dev
   ```

---

## 🧪 Code Quality & Testing

Before submitting a pull request, ensure all linting and type checks pass cleanly:

1. **TypeScript Type Check**:
   ```bash
   npx tsc --noEmit
   ```
   *Must exit with code 0 and zero errors.*

2. **ESLint Code Check**:
   ```bash
   npm run lint
   ```
   *Must report 0 errors and 0 warnings.*

3. **Production Build**:
   ```bash
   npm run build
   ```
   *Must compile successfully with Turbopack.*

---

## 🔐 Security Standards & Guidelines

Security is paramount for enterprise recruiting:
- **Never commit credentials, API keys, or `.env` files.**
- Sensitive API routes under `/api` must validate user session tokens with `getToken({ req, secret: process.env.NEXTAUTH_SECRET })`.
- All user-supplied HTML strings sent in emails or rendered in views must pass through `escapeHtml()` from `@/lib/security/sanitize`.
- Public endpoints invoking external LLMs or TTS APIs must be wrapped with `checkRateLimit()` from `@/lib/security/rateLimit`.

---

## 🔀 Git Commit & Pull Request Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` New features or enhancements
- `fix:` Bug fixes or vulnerability patches
- `perf:` Performance or latency improvements
- `docs:` Documentation updates
- `style:` Formatting or aesthetic adjustments
- `refactor:` Code restructuring without behavior changes
- `chore:` Dependency or build system updates

### Pull Request Steps:
1. Create a branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m "feat(module): brief description"`
3. Push to your fork: `git push origin feature/your-feature-name`
4. Open a Pull Request on GitHub with a clear description of the problem solved.

Thank you for helping make AI Voice Recruiter faster, safer, and better for everyone!
