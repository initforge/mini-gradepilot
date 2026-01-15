# GradePilot

**Academic Decision Workspace for US Students** — Calculate GPA, analyze grades, and make data-driven academic decisions.

🌐 **Live**: https://gradepilot.org

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| State | Zustand (localStorage persisted) |
| Styling | CSS Variables + Custom Design System |
| Icons | Custom branded SVG system |
| Deployment | Docker + Nginx (VPS) |

---

## 🎯 Core Workspaces

| Workspace | Route | Description |
|-----------|-------|-------------|
| **GPA Workspace** | `/gpa` | Semester management, Aim Mode targeting, weighted/unweighted toggle |
| **Course Analyzer** | `/course` | Weight breakdown, "What score do I need?" calculator |
| **Transcript** | `/transcript` | Cumulative GPA tracking, trend visualization |

---

## 🔧 Standalone Calculators

| Calculator | Route |
|------------|-------|
| GPA Calculator | `/gpa-calculators/gpa-calculator` |
| Weighted GPA Calculator | `/gpa-calculators/weighted-gpa-calculator` |
| College GPA Calculator | `/gpa-calculators/college-gpa-calculator` |
| High School GPA Calculator | `/gpa-calculators/high-school-gpa-calculator` |
| Final Grade Calculator | `/grade-calculators/final-grade-calculator` |
| Required Final Grade Calculator | `/grade-calculators/required-final-grade-calculator` |
| Percentage to GPA | `/converters/percentage-to-gpa` |

---

## 🌐 Production Deployment

### Docker (Recommended)
```bash
# Build and start
docker compose up -d --build

# View logs
docker logs gradepilot -f
```

### Nginx Configuration
Located at `/etc/nginx/sites-available/gradepilot` on VPS.
- HTTP/2 enabled
- gzip compression
- SSL via Let's Encrypt
- Static asset caching (7 days)

### SSL Renewal
```bash
certbot renew --dry-run
```

---

## 🔍 SEO Files

| File | Purpose |
|------|---------|
| `src/app/sitemap.ts` | Dynamic sitemap generation |
| `src/app/robots.ts` | Crawler instructions |
| `public/sitemap.xml` | Static sitemap backup |
| `SEO_CHECKLIST.md` | Deployment & traffic checklist |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx           # Homepage
│   ├── gpa/               # GPA Workspace
│   ├── course/            # Course Analyzer
│   ├── transcript/        # Transcript
│   ├── gpa-calculators/   # Standalone GPA tools
│   └── grade-calculators/ # Standalone grade tools
├── components/
│   ├── Icons.tsx          # Branded SVG icons
│   ├── SEOContent.tsx     # FAQ, ExplanationBlock
│   └── WorkspaceNav.tsx   # Cross-workspace navigation
└── lib/
    └── useAcademicStore.ts # Zustand state management

nginx/
└── nginx.conf             # Production nginx config

docker-compose.yml         # Container orchestration
Dockerfile                 # Multi-stage build
```

---

## 🛠 Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

*Last updated: January 16, 2026*
