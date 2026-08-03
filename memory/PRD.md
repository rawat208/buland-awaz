# PRD — Buland Awaaz NGO Website (Gurugram)

## Original problem statement
"i want you to connct with claude and make a website for an NGO of gurugram named buland awaj you can found info about them on net"

User choices (gathered):
- AI chatbot (Claude) that answers visitor questions about the NGO
- Full site with events/news updates managed by the NGO team (admin CMS)
- No donations — info site only
- Contact form + Volunteer registration form
- Design directive: Awwwards-level — kinetic hero with masked line reveal, numbered manifesto chapters, one slow editorial marquee, framer-motion scroll reveals, lenis smooth scroll, subtle parallax

## About the NGO (researched)
Buland Awaaz ("strong voice") — Gurugram, Haryana. Child rights (anti child labour, child marriage, abuse; school enrollment drives), women's empowerment (anti-dowry/violence campaigns), community awareness campaigns (incl. Good Morning Gurugram). Active across Haryana, Rajasthan, Punjab.
NOTE: Site copy uses only these publicly documented work areas. Exact address, phone, registration numbers are intentionally placeholder-free — the team should add verified details via CMS/contact section.

## Architecture
- Frontend: React 19 + Tailwind + shadcn/ui, framer-motion, lenis. Pages: `/` (public site), `/admin/login`, `/admin` (CMS).
- Backend: FastAPI + MongoDB (motor). JWT cookie auth (bcrypt, 24h access token, brute-force lockout 5 tries/15 min).
- AI: emergentintegrations LlmChat, anthropic/claude-sonnet-4-6, EMERGENT_LLM_KEY, SSE streaming (`X-Accel-Buffering: no`), chat history persisted in `chat_messages`.
- Collections: users, content, contacts, volunteers, chat_messages, login_attempts.

## User personas
- Visitor/supporter: learns about the NGO, reads news/events, chats with AI, signs up to volunteer, sends a message.
- NGO team member (admin): logs in, publishes/edits/deletes news & events, reviews volunteer + contact submissions.

## Implemented (2026-08-03)
- Kinetic hero: masked line-by-line reveal, outlined/solid brand type, parallax documentary image, scroll cue
- Editorial marquee (yellow, infinite CSS loop)
- Manifesto: 4 numbered chapters on dark section + parallax image band
- Programs bento grid (4 cards, 2 with photos, hover inversions)
- News & Events: public feed from MongoDB (3 seeded items)
- Volunteer + Contact forms → MongoDB, sonner toasts
- Admin CMS: login, stats, content CRUD dialog, submissions tables, logout
- AI chatbot widget "Buland Mitra": streaming SSE chat, suggestions, session history
- Auth: seeded admin, JWT cookies, lockout protection
- data-testids on all interactive elements

## Implemented (2026-08-03, demo-mode conversion)
- DEMO MODE: chatbot widget and admin routes/login removed from the UI (backend endpoints kept intact for easy re-enable)
- New "Join Buland Awaaz" membership section (id="join"): name, phone, email, city, help preference, reason → POST /api/forms/join → `joins` collection (also returned in /api/admin/submissions)
- Brand logo: /frontend/public/logo.svg (red megaphone mark, self-designed — NO verified official logo exists online; swap file to replace). Used in navbar, footer, favicon
- Page title/meta updated for Buland Awaaz
- Nav + footer updated: Join link, "Member baniye" CTA, team-login link removed
- GitHub: user pushes via Emergent "Save to GitHub" (public repo requested)

## Implemented (2026-08-03, round 3)
- CHATBOT RE-ENABLED: Buland Mitra widget back on home page; verified live with real Claude streaming answers (Universal Key limit resolved)
- Awaaz Wall: new public /supporters page listing join members (name, city, help area, join date) via GET /api/members/public; 6 sample members seeded (sample: true flag); nav + footer links added; CTA on wall navigates home and auto-scrolls to #join
- Logo: re-searched, still no verified official Buland Awaaz NGO logo online — designed mark (logo.svg) stays; swap that one file when official logo is provided

## Implemented (2026-08-03, round 4)
- DEMO clarification from user: this is a demo/showcase site only, real site comes later — all content stays sample
- Yellow "DEMO" badge added next to brand in navbar (home) and /supporters header; footer note "Demo site — sab content sample hai"

## Implemented (2026-08-03, round 5)
- Hindi Toggle: full EN/हिंदी switch (LangProvider + STR dictionary in /frontend/src/lib/i18n.jsx, persisted in localStorage "ba-lang"). Covers nav, hero, marquee, impact, manifesto, programs, news labels, join/volunteer/contact forms, footer, chatbot UI strings, /supporters. Mukta font loaded for Devanagari (html.hi). Form select VALUES stay English for data consistency; DB news content stays English
- Impact Numbers: ImpactStats section right below hero — 4 count-up counters (1,200+ children, 85+ campaigns, 300+ volunteers, 40+ communities; marked sample)
- Verified: counters animate, toggle switches whole site to Hindi and back, /supporters has its own toggle
- GitHub push remains user-side (Emergent "Save to GitHub" → public repo)

## Implemented (2026-08-03, round 6)
- Language switch made prominent: segmented "EN | हिंदी" pill in navbar (home) and /supporters header, active side highlighted; separate buttons lang-en / lang-hi (replaces single toggle button)

## Implemented (2026-08-03, round 7)
- New professional logo designed (user chose design over upload): hand-crafted SVG — red square badge, paper megaphone with sound-wave arcs ("loud voice" symbolism), crisp at every size. Replaced /frontend/public/logo.svg → instantly live in navbar, footer, /supporters header, and favicon (all reference the same file)

## Implemented (2026-08-03, round 8)
- Mobile hamburger menu: md:hidden menu button in navbar opens animated dropdown with all links (Manifesto, Programs, News, Join, Awaaz Wall, Volunteer CTA); closes on selection; mobile header = brand + lang pill + hamburger
- Hindi news content: content model + DB now carry title_hi/summary_hi (all 4 existing items migrated; SEED_CONTENT updated for fresh DBs); News section shows Hindi title/summary + Hindi type badges when toggle is हिंदी, English fallback otherwise

## Implemented (2026-08-03, round 9)
- Social share card: brand-styled OG image (1200x630, logo + outlined BULAND/red AWAAZ + tagline + Demo chip) built via /public/og.html → captured to /public/og-image.png; Open Graph + Twitter Card meta tags added to index.html (absolute preview URLs) — WhatsApp/Twitter link shares now show the card

## Implemented (2026-08-03, round 10)
- Chatbot defaults to Hinglish: greeting, suggestions, placeholder now Roman-Hindi even in EN site mode; Claude system prompt instructs simple Hinglish by default, mirroring visitor's script (English→English, Devanagari→Devanagari). Verified live: Hinglish question got natural Hinglish streamed reply

## Implemented (2026-08-03, round 11)
- Full responsive audit & fixes: zero horizontal overflow verified at 360/390/768/1280/1920px on home + /supporters
  - Navbar mobile crowding fixed (demo badge hidden <480px, smaller brand); hamburger menu now serves below 1024px (was 768px) so tablet no longer collides with desktop nav
  - GetInvolved entrance animation x:±32 → y:32 (transformed off-screen panels caused 32px page overflow)
  - Impact counter numbers shrink on small screens; footer brand row stacks on mobile; /supporters header compact on mobile (icon-only back link <480px)

## Verification status
- PASS: public content API, login/me/logout, forms POST, admin submissions, content create (UI e2e), volunteer form e2e, screenshots of all sections
- BLOCKED (external): Claude chat returns 429 `CONCURRENCY_REQUEST_LIMIT` from the Emergent key proxy ("Unlock parallel requests by upgrading to Standard or Pro plan"). Code verified correct per playbook; will work once plan/balance allows. User: Profile → Manage plan → Universal Key → Add Balance / upgrade.

## Backlog
- P0: Verify chatbot live once Universal Key plan allows requests
- P1: NGO team fills real contact details, registration info, real photos (replace stock)
- P1: Email notification to team on new volunteer/contact (Resend)
- P2: Event RSVP via chatbot; Hindi language toggle; gallery page; impact numbers section
- P2: Donations (explicitly out of scope per user choice — revisit only if asked)
