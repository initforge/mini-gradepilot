# GradePilot

**Academic Decision Workspace for US Students** — Calculate GPA, analyze grades, and make data-driven academic decisions.

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
| Deployment | DigitalOcean VPS + Cloudflare |

---

## 🎯 Core Workspaces

| Workspace | Route | Description |
|-----------|-------|-------------|
| **GPA Workspace** | `/gpa` | Semester management, Aim Mode targeting |
| **Course Analyzer** | `/course` | Final grade calculator, "What score do I need?" |
| **Transcript** | `/transcript` | Cumulative GPA tracking across semesters |

---

## 🔧 Standalone Calculators

- `/gpa-calculators/gpa-calculator`
- `/gpa-calculators/weighted-gpa-calculator`
- `/gpa-calculators/college-gpa-calculator`
- `/gpa-calculators/high-school-gpa-calculator`
- `/grade-calculators/final-grade-calculator`
- `/grade-calculators/required-final-grade-calculator`
- `/converters/percentage-to-gpa`
- `/attendance/attendance-percentage-calculator`

---

## 🌐 Deployment

### Build & Start
```bash
npm run build
npm run start
```

### PM2 (Production)
```bash
pm2 start npm --name "gradepilot" -- start
pm2 save
pm2 startup
```

### Cloudflare Configuration
- **DNS**: A record → VPS IP (Proxied ☁️)
- **SSL**: Full (strict)
- **Cache**: Standard

---

## 🔍 SEO Files

| File | Purpose |
|------|---------|
| `src/app/sitemap.ts` | Dynamic sitemap generation |
| `src/app/robots.ts` | Crawler instructions |
| `SEO_CHECKLIST.md` | Deployment checklist |

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
│   ├── SEOContent.tsx     # FAQ, ExplanationBlock, ExampleBlock
│   └── WorkspaceNav.tsx   # Cross-workspace navigation
└── lib/
    └── useAcademicStore.ts # Zustand state management
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

*Last updated: January 15, 2026*
