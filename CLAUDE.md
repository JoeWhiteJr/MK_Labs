# CLAUDE.md — Michael Kairos Labs Platform

## Project Overview

**Michael Kairos Labs (MKL)** is a consulting agency platform serving as both a public-facing business website and an internal team workspace. It is a boutique research & analytics consultancy (Joe + Jared, 50/50 partnership) targeting mission-driven organizations with Oxford-caliber rigor at fair prices.

**Repo:** `JoeWhiteJr/MK_Labs`
**Stack:** React 18 + Vite + Tailwind CSS | Express.js | PostgreSQL | Socket.IO | Docker
**Forked from:** Utah-Valley-Research-Lab (rebranded and restructured)
**Tagline:** "Research. Analytics. Impact."

---

## Project Structure

```
MK_Labs/
├── CLAUDE.md                    # This file — agent instructions
├── docker-compose.yml           # Dev environment
├── docker-compose.prod.yml      # Production config
├── docker-compose.ec2.yml       # EC2 deployment
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js       # MKL brand Tailwind config
│   ├── index.html               # MKL branding, Space Grotesk + Inter fonts
│   └── src/
│       ├── main.jsx
│       ├── App.jsx              # Routing: public site + auth + protected dashboard
│       ├── index.css            # Imports mkl-brand.css, no dark mode
│       ├── styles/
│       │   ├── mkl-brand.css          # CSS custom properties (brand tokens)
│       │   └── mkl-brand-tokens.json  # JSON brand tokens (reference)
│       ├── components/
│       │   ├── Layout.jsx       # Authenticated app shell (midnight nav, teal accents)
│       │   ├── public/
│       │   │   └── PublicLayout.jsx   # Public site wrapper (nav + footer)
│       │   ├── assistant/       # AI Research Assistant sidebar
│       │   ├── calendar/        # Calendar components
│       │   ├── planner/         # Daily/weekly planner
│       │   └── admin/           # Admin-only components
│       ├── pages/
│       │   ├── public/          # 6 public pages (Home, Services, About, etc.)
│       │   ├── Pipeline.jsx     # CRM Kanban board
│       │   ├── LabDashboard.jsx # → renamed "MKL Dashboard"
│       │   ├── MyDashboard.jsx  # Personal workspace
│       │   ├── Projects.jsx     # Client Projects list
│       │   ├── ProjectDetail.jsx # Project detail (6 tabs, no chat)
│       │   ├── Admin.jsx        # Admin dashboard
│       │   ├── Settings.jsx     # User settings
│       │   └── ...              # Login, ForgotPassword, etc.
│       ├── store/               # Zustand stores
│       │   ├── authStore.js
│       │   ├── projectStore.js
│       │   ├── pipelineStore.js # CRM pipeline state
│       │   ├── notificationStore.js
│       │   ├── calendarStore.js
│       │   └── ...
│       └── services/
│           ├── api.js           # Axios client (auto JWT, all API groups)
│           └── socket.js        # Socket.IO client
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── index.js             # Express entry, route registration
│   │   ├── config/
│   │   │   ├── database.js      # PostgreSQL connection pool
│   │   │   └── logger.js        # Pino logging
│   │   ├── routes/              # 25 API route modules
│   │   │   ├── auth.js
│   │   │   ├── projects.js      # + client_name, service_pillar, budget
│   │   │   ├── pipeline.js      # CRM leads CRUD + stage transitions
│   │   │   ├── admin.js
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── socketService.js # Real-time presence + notifications
│   │   │   ├── ragQueryService.js
│   │   │   └── ...
│   │   └── middleware/
│   │       ├── auth.js          # JWT verification
│   │       ├── auditLog.js
│   │       └── sanitize.js
│   └── scripts/
├── database/
│   └── migrations/              # 43 SQL migration files
│       ├── 001_initial_schema.sql
│       ├── ...
│       ├── 042_mkl_rebrand.sql  # client_name, service_pillar, budget on projects
│       └── 043_pipeline_leads.sql # CRM leads table
├── deploy/
└── docs/
```

---

## Business Context

### 7 Services Across 3 Pillars

**Research Methods:**
- MaxDiff & Conjoint Analysis
- UX/Usability Research
- Psychometrics & Scale Development (Oxford partnership)

**Data & Intelligence:**
- AI Integration & Automation
- Statistical Modeling & Forecasting

**Operations & Impact:**
- Process Mapping & Optimization
- Impact Measurement & Evaluation

### Brand System

- **Primary:** Midnight Navy `#0F172A`
- **Accent:** Deep Teal `#0D9488` (CTAs, links, highlights)
- **Secondary:** Amber Gold `#D97706` (Oxford/premium content ONLY)
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (data)
- **No dark mode** — light-only design
- **No glass/frosted effects** — clean, professional

---

## Authentication System

### Architecture
- **JWT-based** — Stateless, token stored in localStorage
- **bcrypt** — Password hashing
- **Three roles:** `admin`, `member`, `client`
- **Public site is fully open** — No login needed for public pages
- **Protected routes** require authentication via `<ProtectedRoute>` wrapper
- **Admin routes** additionally check `user.role === 'admin'`

### Auth Middleware Pattern
```javascript
// Public route — no middleware
router.get('/api/public/projects', getPublicProjects);

// Authenticated route — requires JWT
router.get('/api/projects', auth, listProjects);

// Admin route — requires JWT + admin role
router.post('/api/admin/users', auth, adminOnly, createUser);
```

### Token Handling (Frontend)
- `api.js` uses Axios interceptor to attach `Authorization: Bearer <token>`
- `authStore.js` (Zustand) holds token + user state
- `<ProtectedRoute>` wraps `/dashboard/*` — redirects to `/login` if not authenticated
- `<AdminRoute>` wraps `/dashboard/admin` — redirects if not admin

---

## Agent Roles & Workflow

This project uses a **3-agent model**.

### Agent 1: Developer Agent
- **Role:** Writes code, implements features, fixes bugs
- **Workflow:**
  1. Read this CLAUDE.md fully before starting any work
  2. `git pull origin main`
  3. Create branch: `git checkout -b feature/<n>` or `fix/<n>`
  4. Implement in small, logical commits
  5. Run all tests before pushing
  6. `git push -u origin <branch-name>`
  7. Create a Pull Request targeting `main`
  8. Wait for Reviewer Agent feedback

### Agent 2: Reviewer Agent
- **Role:** Reviews PRs, runs tests, identifies bugs
- **Workflow:**
  1. Pull PR branch locally
  2. Read PR description + all changed files
  3. Run full test suite
  4. Check for: bugs, security issues, missing error handling, missing tests
  5. Leave specific, actionable feedback
  6. Approve or request changes

### Agent 3: Coordinator (Human — Joe & Jared)
- **Role:** Prioritizes work, makes architecture decisions, merges PRs
- **Workflow:**
  1. Assigns tasks to Developer Agent
  2. Reviews feedback
  3. Merges to `main`

---

## Git Standards

### Branch Naming
- `feature/<short-description>` — New features
- `fix/<short-description>` — Bug fixes
- `hotfix/<short-description>` — Urgent production fixes
- `chore/<short-description>` — Config, deps, docs

### Commit Messages
```
feat: add pipeline kanban drag-and-drop
fix: resolve lead stage transition not persisting
docs: update API documentation for pipeline endpoints
test: add integration tests for pipeline route
chore: update Tailwind config for MKL brand
refactor: extract lead card into separate component
```

### Pull Request Requirements
Every PR must include:
1. **Description:** What changed and why
2. **Testing:** What tests were added or run
3. **Checklist:**
   - [ ] Tests pass (`npm test` in both frontend and backend)
   - [ ] No lint errors (`npm run lint`)
   - [ ] No hardcoded secrets or API keys
   - [ ] Brand consistency (teal accent, no dark mode, Space Grotesk headings)

### Merge Rules
- Never push directly to `main`
- PRs require Reviewer Agent approval
- Squash merge preferred
- Delete branch after merge

---

## Coding Standards

### General
- JavaScript/JSX (no TypeScript for MVP)
- ESLint for linting
- `async/await` over callbacks
- Comments for "why", not "what"

### Frontend
- Functional components only
- Zustand for global state
- Tailwind CSS for all styling — use MKL brand tokens
- PascalCase component files
- One component per file
- API calls through `services/api.js` only (includes auth interceptor)
- **No dark mode** — never add `dark:` class variants
- **Brand colors:** Use `teal` for accents/CTAs, `midnight` for nav/headers, `gold` for Oxford-only content
- **Fonts:** `font-display` for headings, `font-body` for text, `font-mono` for data values

### Backend
- Express Router — one file per resource
- All handlers wrapped in try/catch
- Parameterized database queries only (never string concatenation)
- Consistent JSON responses: `{ data }` or `{ error: { message } }`
- Environment variables through `.env` / `process.env`
- Input validation via `express-validator`
- Auth middleware applied per-route, not globally

### Database
- All changes via numbered migration files in `database/migrations/`
- Never modify existing migrations — create new ones
- UUIDs for primary keys
- All tables have `created_at` and `updated_at`
- Passwords NEVER stored in plain text — bcrypt only

---

## Testing Standards

### What to Test
- **Auth:** Login success, login failure, expired token, admin middleware rejection
- Backend routes: happy path + error path per endpoint
- Backend services: unit tests with mocked deps
- Frontend: rendering tests for complex components

### Running Tests
```bash
cd backend && npm test        # Jest
cd frontend && npm run test   # Vitest
cd frontend && npm run lint   # ESLint
cd backend && npm run lint    # ESLint
```

### Before Every PR
1. All existing tests pass
2. New features include basic tests
3. Bug fixes include regression test

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mkl_platform

# Auth
JWT_SECRET=             # Generate: openssl rand -hex 32
JWT_EXPIRY=7d

# LLM
ANTHROPIC_API_KEY=
GEMINI_API_KEY=

# Email
SMTP_HOST=
SMTP_USER=
SMTP_PASS=

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Uploads
UPLOAD_DIR=./uploads
```

---

## Development Setup

```bash
# 1. Clone
git clone git@github.com:JoeWhiteJr/MK_Labs.git
cd MK_Labs

# 2. Install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# 3. Environment
cp .env.example .env  # Fill in values

# 4. Start (Docker)
docker compose up

# OR Start (local)
cd backend && npm run dev   # Port 3001
cd frontend && npm run dev  # Port 5173

# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
# Health:   http://localhost:3001/api/health
```

---

## Key Architecture Decisions

1. **Forked from UVRL** — 90% of functionality reused (projects, tasks, files, calendar, meetings, AI assistant). Removed: Chat, Book Club, VVC, Applications, Dark Mode, Donate.
2. **MKL brand system** — Custom CSS properties + Tailwind config. Midnight Navy nav, Deep Teal accents, Amber Gold for Oxford content only.
3. **Public site + internal workspace** — Same app, different layouts. `PublicLayout` for public pages, `Layout` for authenticated dashboard.
4. **CRM Pipeline** — Built-in lightweight lead tracking (Kanban: Discovery → Proposal → Negotiation → Won → Lost). Leads convert to projects when won.
5. **No dark mode** — Single light theme for brand consistency. All `dark:` variants removed.
6. **Socket.IO for real-time** — Notifications, presence tracking, typing indicators (retained from UVRL, minus chat-specific handlers).
7. **Client role** — `client` user role added for future client portal (Phase 2 — stub only for now).

---

## Removed Features (from UVRL)

These features were deleted during the fork. Do not re-add them:
- **Chat** (pages, components, store, route, socket handlers)
- **Book Club** (page, store, route)
- **VVC** (page, store, route)
- **Application Flow** (page, store, route)
- **Dark Mode** (theme store, toggle, all `dark:` classes)
- **Donate Page**
- **Floating Recorder**

---

## Protected Components

These require written approval from both Joe & Jared before modification:
- Database migration files (once applied)
- Authentication middleware (`auth.js`, `socketAuth.js`)
- Brand token files (`mkl-brand.css`, `mkl-brand-tokens.json`, `tailwind.config.js`)

---

## Important Notes

- **MVP mindset** — Working features over polish. Clean code matters, pixel-perfect does not.
- **No premature optimization** — Get it working first.
- **Ask before architecting** — New libraries or services need Coordinator approval.
- **Brand consistency** — Every new component must use MKL brand tokens. No hardcoded colors.
- **No dark mode** — Never add `dark:` class variants. Light theme only.
- **Gold is reserved** — `gold` / `amber` colors are ONLY for Oxford partner content. Never for general UI.
- **Passwords are sacred** — bcrypt only, never log or expose passwords.
- **JWT_SECRET must be strong** — Generate with `openssl rand -hex 32`, never commit to repo.
