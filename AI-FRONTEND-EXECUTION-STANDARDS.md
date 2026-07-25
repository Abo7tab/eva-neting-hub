# EVA BEAUTY HUB — FRONTEND EXECUTION STANDARDS
Version 1.0 | Admin Panel Development

═══════════════════════════════════════════════════════════════
§1 — MANDATORY PRE-PHASE CHECKLIST
═══════════════════════════════════════════════════════════════

Before ANY phase, you MUST:

1. Read AI-FRONTEND-EXECUTION-STANDARDS.md (this file)
2. Read EXECUTION-PROGRESS.md — check last completed phase
3. Verify actual files on filesystem match the progress log
4. Output PHASE STATUS REPORT before writing code:

════════════════════════════════
PHASE STATUS REPORT
✅ Completed : [list]
🔄 Now       : [current phase]
⏳ Remaining : [next phases]
════════════════════════════════

═══════════════════════════════════════════════════════════════
§2 — TECH STACK (FIXED, NO CHANGES)
═══════════════════════════════════════════════════════════════

Framework       : Next.js 15 (App Router)
Language        : TypeScript (strict mode)
Styling         : Tailwind CSS 4
UI Components   : shadcn/ui
Animations      : Framer Motion (light usage)
Forms           : React Hook Form + Zod validation
Icons           : Lucide React
Data Fetching   : TanStack Query (React Query v5)
State Mgmt      : Zustand (auth state only)
Charts          : Recharts (dashboard only)
Rich Text       : TipTap (product description)
Image Upload    : react-dropzone
Notifications   : Sonner (toast)
API Client      : Axios

═══════════════════════════════════════════════════════════════
§3 — API BACKEND INFO
═══════════════════════════════════════════════════════════════

Base URL      : https://beauty.alwaysdata.net/api/v1
Auth          : Sanctum Bearer Token
Token Prefix  : eva_

Admin test credentials:
Email: medo@eva.com
Password: medo@1212

Response envelope (all endpoints):
Success:
{
  "success": true,
  "data": {...} or [...],
  "meta": {...} (for paginated),
  "message": "OK"
}

Error:
{
  "success": false,
  "message": "...",
  "errors": {...}
}

Rate limits:
- Public: 120/min
- Admin login: 5/min
- Admin CRUD: 60/min

═══════════════════════════════════════════════════════════════
§4 — FEATURE-BASED FOLDER STRUCTURE
═══════════════════════════════════════════════════════════════

src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (admin)/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── brands/
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── whatsapp-numbers/
│   │   ├── theme/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx
│
├── features/
│   ├── auth/
│   ├── products/
│   ├── brands/
│   ├── categories/
│   ├── orders/
│   ├── whatsapp/
│   ├── theme/
│   └── settings/
│
├── shared/
│   ├── components/
│   │   ├── ui/         # shadcn
│   │   ├── layout/
│   │   ├── loading/
│   │   └── feedback/
│   ├── lib/
│   ├── hooks/
│   ├── stores/
│   └── types/
│
└── middleware.ts

Each feature folder contains:
- api/       (API endpoints)
- hooks/     (TanStack Query hooks)
- components/
- schemas/   (Zod validation)
- types/

═══════════════════════════════════════════════════════════════
§5 — STRICT CODING STANDARDS
═══════════════════════════════════════════════════════════════

5.1 GENERAL
- TypeScript strict mode: ON
- NO 'any' types
- Every function has explicit return type
- Every component has TypeScript props interface
- All files: kebab-case except components (PascalCase.tsx)

5.2 COMPONENT STRUCTURE
- Server Components by default
- "use client" ONLY for: forms, hooks, browser APIs
- Split components > 150 lines

5.3 API CALLS
- ALL via TanStack Query
- NO fetch() in components
- Custom hook per endpoint
- Handle loading/error/success

5.4 FORMS
- React Hook Form + Zod
- Inline validation errors
- Disable submit while submitting

5.5 STYLING
- Tailwind only (no inline styles)
- Use cn() helper
- Mobile-first responsive

5.6 ANIMATIONS (LIGHT)
Allowed:
- Fade in on mount
- Slide from sides
- Skeleton loaders
- Toast notifications

Forbidden:
- Continuous animations
- Bouncing effects
- Complex parallax

═══════════════════════════════════════════════════════════════
§6 — EXECUTION PROTOCOL
═══════════════════════════════════════════════════════════════

Rule 1: ONE PHASE PER RESPONSE
Rule 2: PHASE STATUS REPORT before code
Rule 3: PHASE ORDER (STRICT):

Phase 1  : Next.js setup + Tailwind + TypeScript
Phase 2  : shadcn/ui + base components
Phase 3  : Axios + TanStack Query + Zustand
Phase 4  : API client with interceptors [HARD STOP]
Phase 5  : Login page (beautiful design)
Phase 6  : Auth middleware [HARD STOP]
Phase 7  : Admin layout (Sidebar + Header)
Phase 8  : Dashboard page
Phase 9  : Products feature [HARD STOP]
Phase 10 : Brands feature
Phase 11 : Categories feature
Phase 12 : Orders feature
Phase 13 : WhatsApp numbers
Phase 14 : Theme settings (needs backend update)
Phase 15 : Site settings
Phase 16 : Deployment [HARD STOP]

Rule 4: STOP AFTER EACH PHASE
Rule 5: REAL VERIFICATION (npm run build must pass)
Rule 6: ANTI-HALLUCINATION - verify shadcn/ui APIs first

═══════════════════════════════════════════════════════════════
§7 — HARD STOPS
═══════════════════════════════════════════════════════════════

MUST stop and wait for approval after:
- Phase 4 (API client)
- Phase 6 (Auth middleware)
- Phase 9 (Products)
- Phase 16 (Deployment)

═══════════════════════════════════════════════════════════════
§8 — NON-GOALS
═══════════════════════════════════════════════════════════════

Do NOT implement:
- Public storefront (Men/Women) — separate project later
- Multi-language support
- Dark mode toggle
- Real-time features
