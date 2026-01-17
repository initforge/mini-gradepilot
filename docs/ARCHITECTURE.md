# GradePilot Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     gradepilot.org                          │
├─────────────────────────────────────────────────────────────┤
│                    Nginx (Reverse Proxy)                    │
│              SSL + HTTP/2 + gzip + Security Headers         │
├─────────────────────────────────────────────────────────────┤
│                  Next.js 15 (App Router)                    │
│                   Docker Container                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Workspaces  │  │ Calculators │  │   Info Pages        │  │
│  │ /gpa        │  │ /gpa-calc/* │  │ /about /privacy     │  │
│  │ /course     │  │ /grade-*/*  │  │ /terms /contact     │  │
│  │ /transcript │  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                  Zustand (localStorage)                     │
│                 Client-side State Only                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 15 App Router | SSR/SSG for SEO, Metadata API |
| State | Zustand + localStorage | No backend needed, instant UX |
| Styling | CSS Variables | Full control, no framework lock-in |
| Deployment | Docker + Nginx | Portable, VPS-friendly |

---

## Page Architecture

### Core Workspaces (Stateful)
| Route | Purpose | State |
|-------|---------|-------|
| `/gpa` | Semester GPA management | localStorage |
| `/course` | Course grade breakdown | localStorage |
| `/transcript` | Cumulative tracking | localStorage |

### SEO Calculator Pages (Stateless)
| Route | Target Keyword |
|-------|---------------|
| `/gpa-calculators/gpa-calculator` | "gpa calculator" |
| `/gpa-calculators/weighted-gpa-calculator` | "weighted gpa calculator" |
| `/gpa-calculators/college-gpa-calculator` | "college gpa calculator" |
| `/gpa-calculators/high-school-gpa-calculator` | "high school gpa calculator" |
| `/grade-calculators/final-grade-calculator` | "final grade calculator" |
| `/grade-calculators/required-final-grade-calculator` | "what grade do i need" |

---

## SEO Infrastructure

| Component | File | Purpose |
|-----------|------|---------|
| Dynamic Sitemap | `src/app/sitemap.ts` | Auto-generates sitemap |
| Robots | `src/app/robots.ts` | Crawler rules |
| Static Sitemap | `public/sitemap.xml` | Backup for indexing |
| Internal Links | `RelatedTools.tsx` | Cross-linking for SEO |

---

## Deployment

```bash
# VPS: DigitalOcean (157.230.214.166)
# Domain: gradepilot.org
# SSL: Let's Encrypt via Certbot

cd ~/mini-gradepilot
git pull
docker compose up -d --build
```

---

*Last updated: January 17, 2026*
