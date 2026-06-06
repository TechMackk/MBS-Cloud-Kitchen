# MBS Cloud Kitchen

**Mind, Body & Soul** — Authentic Telangana Specials, Delivered Fresh.

Marketing website for MBS Cloud Kitchen, a Hyderabad-based cloud kitchen serving traditional Telangana cuisine. Phase 1 is a static, production-grade frontend built for long-term maintainability.

- **Future domain:** [mbscloudkitchen.in](https://mbscloudkitchen.in)
- **Repository:** [github.com/TechMackk/MBS-Cloud-Kitchen](https://github.com/TechMackk/MBS-Cloud-Kitchen)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + custom brand tokens |
| UI | shadcn/ui (Button, Card) |
| Icons | lucide-react |
| Fonts | Inter (body), Poppins (headings) via `next/font` |
| Images | `next/image` |
| Linting | ESLint + Prettier |
| Git hooks | Husky + lint-staged |
| CI | GitHub Actions |

## Local Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Install & Run

```bash
# Clone the repository
git clone https://github.com/TechMackk/MBS-Cloud-Kitchen.git
cd MBS-Cloud-Kitchen

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Logo

Place your logo PNG at `public/logo.png`. Until then, a styled **MBS** placeholder is shown in the header and hero.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler (no emit) |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check Prettier formatting |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run Prisma migrations (dev) |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed menu + catering data |
| `npm run create-admin` | Bootstrap initial admin user |
| `npm test` | Run Vitest unit tests (watch mode) |
| `npm run test:run` | Run Vitest once (CI) |
| `npm run test:coverage` | Unit tests with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run check:headers` | Print security headers from local server |
| `npm run fixture:generate` | Generate E2E test image fixture |

## Database Setup

1. Create a [Supabase](https://supabase.com) project
2. Copy `DATABASE_URL` (connection pooler, port 6543) and `DIRECT_URL` (direct, port 5432) into `.env.local`
3. Copy `.env.example` and set `NEXTAUTH_SECRET` / `AUTH_SECRET` (generate with `openssl rand -base64 32`)
4. Set admin bootstrap vars: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
5. Run migrations:

```bash
npm run db:migrate
npm run db:seed
npm run create-admin
```

6. Start the app and sign in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Public pages (`/menu`, `/catering`, home featured dishes) read from the database. `lib/data/menu.ts` is seed data only — manage live content via `/admin/menu` and `/admin/catering`.

## Supabase Storage (Image Uploads)

Admin menu and catering forms upload images to Supabase Storage. Complete this setup before using image upload in admin.

1. In Supabase Dashboard → **Storage**, create two buckets:
   - `menu-images` — public read, authenticated write
   - `catering-images` — public read, authenticated write
2. Add RLS policies on both buckets:
   - **SELECT:** allow public read (`anon` role)
   - **INSERT / UPDATE / DELETE:** authenticated only (server uses `SUPABASE_SERVICE_ROLE_KEY`)
3. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

The service role key is server-side only and must never be exposed to the browser.

## WhatsApp Cloud API Setup (Optional, for Production)

Until Meta approval, ordering works via **wa.me** deep links automatically (`ENABLE_WHATSAPP_API="false"`).

1. Create a Meta Business Manager account
2. Add a WhatsApp Business Account
3. Add a **new** phone number (must not be active on personal WhatsApp)
4. Verify business and display name (~2 weeks approval)
5. Copy **Phone Number ID** and **Business Account ID** from Meta Business Manager
6. Generate a System User access token (permanent)
7. Configure webhook in Meta:
   - URL: `https://YOUR_DOMAIN/api/webhooks/whatsapp`
   - Verify token: same as `WHATSAPP_WEBHOOK_VERIFY_TOKEN` in `.env.local`
   - Subscribe to: `messages`, `message_template_status_update`, `messages.status`
8. Create and submit message templates in Meta Business Manager (names in `lib/whatsapp/cloud-api/templates.ts`)
9. Wait for template approval (24–48 hours each)
10. Set `ENABLE_WHATSAPP_API="true"` in production env

Env vars:

```env
ENABLE_WHATSAPP_API="false"
WHATSAPP_API_VERSION="v20.0"
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_BUSINESS_ACCOUNT_ID=""
WHATSAPP_ACCESS_TOKEN=""
WHATSAPP_WEBHOOK_VERIFY_TOKEN="generate-random-string"
WHATSAPP_ORDERS_NUMBER="918179656696"
WHATSAPP_CATERING_NUMBER="919676940777"
```

Run the Phase 6 migration after pulling:

```bash
npm run db:migrate
```

## AI Chatbot Setup (Phase 7)

1. Enable **pgvector** in Supabase: Dashboard → Database → Extensions → `vector`
2. Add to `.env.local`:

```env
OPENAI_API_KEY="sk-..."
AI_CHAT_MODEL="gpt-4o-mini"
AI_EMBEDDING_MODEL="text-embedding-3-small"
AI_MAX_TOKENS_PER_RESPONSE="500"
CHAT_RATE_LIMIT_PER_HOUR="20"
CHAT_MAX_MESSAGES_PER_SESSION="50"
```

3. Run migrations and index setup:

```bash
npm run db:migrate
npm run knowledge:setup-vector
npm run knowledge:index
```

4. Start the app — the floating **MBS Assistant** chat widget appears on all public pages.

Optional: set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for distributed rate limiting in production.

Admin: view indexed chunks at `/admin/knowledge`, chat sessions at `/admin/chat-sessions`.

## Testing (Phase 8B)

### Unit tests (Vitest)

```bash
npm run test:run          # Run all unit tests
npm run test:coverage     # Coverage report in /coverage
```

Tests cover `lib/` modules: slugify, mappers, deeplink, cart store, reference numbers, chunker, rate limiting.

### E2E tests (Playwright)

```bash
npm run fixture:generate  # Once: creates tests/fixtures/test-dish.jpg
npx playwright install    # Once: install browsers
npm run test:e2e          # Starts dev server, runs all E2E specs
```

Set `TEST_ADMIN_EMAIL` and `TEST_ADMIN_PASSWORD` for admin CRUD tests. CI runs Vitest + Playwright on every PR.

### Security header check

With the dev server running:

```bash
npm run check:headers http://localhost:3000
```

Production should score **A+** at [securityheaders.com](https://securityheaders.com).

## CSP Rollout

CSP starts in **report-only** mode (`CSP_REPORT_ONLY=true`). Monitor Sentry for violations, then switch to enforcing:

```env
CSP_REPORT_ONLY="false"
```

JSON-LD scripts receive per-request nonces via middleware `x-nonce` header.

## Accessibility

Automated checks run via `tests/e2e/a11y.spec.ts` (axe WCAG 2A/2AA). Manual checks:

- **Keyboard navigation** — Tab through header, cart, chat, modals; Escape closes drawers/dialogs
- **Skip link** — Press Tab on page load to reveal "Skip to main content"
- **Screen reader** — Test checkout and catering flows with NVDA or VoiceOver
- **Focus visible** — All interactive elements show focus ring (Tailwind `focus-visible:`)

## Production Polish (Phase 8A)

### Observability
- **Sentry** — client, server, and edge configs with PII scrubbing
- **Vercel Analytics + Speed Insights** — wired in root layout
- Dev-only test route: `GET /sentry-test` (404 in production)

### SEO & OG
- Dynamic `/sitemap.xml` and `/robots.txt`
- JSON-LD on home, contact, and menu pages
- Dynamic OG images via `next/og` on home, menu, catering, about
- Default static OG: `public/og-image.png`

### Performance
```bash
npm run analyze          # Bundle analyzer (ANALYZE=true)
npm run icons:generate   # PWA icons from public/logo.png
npm run og:generate      # Regenerate default OG placeholder
npm run lighthouse       # Lighthouse CI (after build + start)
```

### Env vars
```env
NEXT_PUBLIC_SENTRY_DSN=""
SENTRY_AUTH_TOKEN=""
SENTRY_ORG=""
SENTRY_PROJECT=""
NEXT_PUBLIC_SITE_URL="https://mbscloudkitchen.in"
```

## Folder Structure

```
app/
  (public)/
    page.tsx          # Home page
  layout.tsx          # Root layout (Header + Footer)
  globals.css         # Global styles & Tailwind directives
components/
  ui/                 # shadcn/ui primitives (button, card)
  layout/             # Header, Footer
  sections/           # Home page sections
lib/
  data/               # Static menu + catering seed data
  db/                 # Prisma client, mappers, query helpers
  utils.ts            # cn() Tailwind class helper
  constants.ts        # Contact info, nav links
prisma/
  schema.prisma       # Database schema
  seed.ts             # Idempotent seed script
app/admin/            # Protected admin portal
public/
  logo.png            # Brand logo (upload separately)
.github/workflows/
  ci.yml              # CI: lint, typecheck, build
```

## Home Page Sections

1. **Hero** — Tagline, CTAs (WhatsApp order + View Menu)
2. **About Summary** — Our Story / Promise / Process cards
3. **Featured Dishes** — 6 Telangana specials with order links
4. **Quality Promise** — Freshness & hygiene badges
5. **Location Preview** — Google Maps embed + directions CTA
6. **Footer** — Quick links, contact, hours

## Brand Colors

| Token | Hex |
|-------|-----|
| green-deep | `#1F3A3D` |
| green-soft | `#8DBA5F` |
| green-neon | `#A8E063` |
| orange | `#E8843A` |
| orange-neon | `#FFB347` |
| cream | `#F5EFD8` |
| bg | `#FFFFFF` |
| text | `#1A1A1A` |

## Production Deployment

### 1. Pre-deployment

- [ ] All Phase 8B tests pass locally (`npm run test:run`, `npm run test:e2e`)
- [ ] Lighthouse scores meet thresholds (`npm run lighthouse`)
- [ ] Sentry DSN configured
- [ ] Final logo + brand images uploaded (`npm run icons:generate`)
- [ ] Owner reviewed placeholder content (about, FAQs, policies)

### 2. Domain + DNS

- [ ] Purchase `mbscloudkitchen.in` (Cloudflare Registrar recommended)
- [ ] Add domain to Vercel project
- [ ] Point DNS to Vercel (CNAME or A records)
- [ ] Verify SSL active

### 3. Supabase (production)

- [ ] Create production project (separate from dev)
- [ ] `npx prisma migrate deploy`
- [ ] `npm run db:seed` (or import from dev)
- [ ] `npm run create-admin`
- [ ] Enable pgvector extension
- [ ] Create buckets: `menu-images`, `catering-images` with public-read RLS
- [ ] `npm run knowledge:setup-vector`
- [ ] `npm run knowledge:index`

### 4. Environment variables (Vercel)

| Group | Variables |
|-------|-----------|
| Database | `DATABASE_URL`, `DIRECT_URL` |
| Auth | `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `AUTH_SECRET` |
| Storage | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| AI | `OPENAI_API_KEY`, `AI_CHAT_MODEL`, `AI_EMBEDDING_MODEL` |
| WhatsApp | `WHATSAPP_ORDERS_NUMBER`, `WHATSAPP_CATERING_NUMBER`, `ENABLE_WHATSAPP_API` (start `false`) |
| Observability | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` |
| Site | `NEXT_PUBLIC_SITE_URL` |
| Rate limiting | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (recommended) |
| Security | `CSP_REPORT_ONLY` (start `true`, then `false`) |

### 5. WhatsApp Cloud API (post-launch)

- [ ] Meta Business Manager + phone registration
- [ ] Submit templates from `lib/whatsapp/cloud-api/templates.ts`
- [ ] Webhook: `https://mbscloudkitchen.in/api/webhooks/whatsapp`
- [ ] Set `ENABLE_WHATSAPP_API=true` and redeploy

### 6. Smoke test

- [ ] Homepage loads in <2s
- [ ] `/menu` shows dishes with images
- [ ] Cart → checkout → wa.me message correct
- [ ] Admin login + menu edit reflects on `/menu`
- [ ] Chat responds to menu questions
- [ ] Catering form completes
- [ ] Lighthouse + securityheaders.com A+ rating
- [ ] Sentry receives test error from `/sentry-test` (dev only)

### 7. Rollback

- **Vercel:** Promote previous deployment from dashboard (one click)
- **DB:** `npx prisma migrate resolve --rolled-back <migration>` + manual SQL if needed
- Document last-known-good deployment ID in incident notes

## Operations & Monitoring

### Daily (5 min)

- Sentry — any new error spikes?
- Vercel Analytics — traffic baseline normal?
- Supabase — DB size, connection pool usage

### Weekly

- `/admin/orders` — all orders processed?
- `/admin/catering-requests` — follow-ups completed?
- OpenAI usage dashboard — cost trending?
- Supabase Storage — under quota?

### Common issues

| Issue | Likely cause | Fix |
|-------|--------------|-----|
| 500 on `/menu` | DB pool exhausted | Check Supabase pool settings or upgrade plan |
| Images broken | Storage RLS misconfigured | Verify public-read policy on buckets |
| Chat not responding | OpenAI quota / API key | Check OpenAI dashboard, rotate key |
| WhatsApp not sending | Cloud API token expired | Rotate token in Meta Business Manager |
| Admin login locked | Rate limiter triggered | Wait 15 min |
| Slow builds | Bundle bloat | `npm run analyze` |

### Backups

- Supabase daily backups (paid tier for point-in-time restore)
- Recommended: weekly `pg_dump` to private storage
- Document retention policy with owner

## Architecture

```
[Browser] → [Vercel Edge Middleware: CSP + Auth]
         → [Next.js App Router]
              ├── Public pages (menu, catering, cart)
              ├── Admin portal (Auth.js)
              ├── /api/chat (OpenAI + pgvector RAG)
              └── /api/webhooks/whatsapp
         → [Supabase PostgreSQL + Storage]
         → [Sentry + Vercel Analytics]
```

## Contributing

Private repository — internal MBS team only. See `CHANGELOG.md` for release history.

## License

Proprietary — see [LICENSE](LICENSE). © MBS Cloud Kitchen.
