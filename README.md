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

---

## 🌐 Production Deployment

### Docker (Recommended)
```bash
# Build and start
docker compose up -d --build

# View logs
docker logs gradepilot -f
```

### VPS Update
```bash
cd ~/gradepilot
git pull
docker compose up -d --build
```

### SSL Renewal
```bash
certbot renew --dry-run
```

---

##  Project Structure

```
src/
├── app/
│   ├── page.tsx           # Homepage
│   ├── gpa/               # GPA Workspace
│   ├── course/            # Course Analyzer
│   ├── transcript/        # Transcript
│   ├── gpa-calculators/   # 4 standalone GPA calculators
│   ├── grade-calculators/ # 2 standalone grade calculators
│   ├── about/
│   ├── contact/
│   ├── privacy/
│   ├── terms/
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Crawler rules
├── components/
│   ├── Icons.tsx          # Branded SVG icons
│   └── RelatedTools.tsx   # Cross-linking component
└── lib/
    └── useAcademicStore.ts

public/
└── sitemap.xml            # Static sitemap backup

nginx/
└── nginx.conf             # Production config

TRAFFIC_PLAN.md            # Traffic acquisition strategy
SEO_CHECKLIST.md           # SEO & deployment status
```

---

## 📊 Page Count

| Type | Count |
|------|-------|
| Workspaces | 3 |
| GPA Calculators | 4 |
| Grade Calculators | 2 |
| Info Pages | 4 |
| **Total** | **13 pages** |

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
