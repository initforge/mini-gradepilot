# GradePilot

**Free GPA Calculator & Grade Planning Tools for US Students** — Calculate GPA, analyze grades, and hit your academic targets.

*Built for US high school & college students dealing with GPA pressure.*

🌐 **Live**: [gradepilot.org](https://gradepilot.org)

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| State | Zustand (localStorage) |
| Styling | CSS Variables |
| Deployment | Docker + Nginx |

---

## 🎯 Features

### Workspaces
| Route | Description |
|-------|-------------|
| `/gpa` | Semester GPA management, Aim Mode targeting |
| `/course` | Course weight breakdown, "What score do I need?" |
| `/transcript` | Cumulative GPA tracking, trend visualization |

### Calculators
| Route | Target Keyword |
|-------|---------------|
| `/gpa-calculators/gpa-calculator` | GPA calculator |
| `/gpa-calculators/weighted-gpa-calculator` | Weighted GPA calculator |
| `/gpa-calculators/college-gpa-calculator` | College GPA calculator |
| `/gpa-calculators/high-school-gpa-calculator` | High school GPA calculator |
| `/grade-calculators/final-grade-calculator` | Final grade calculator |
| `/grade-calculators/required-final-grade-calculator` | What grade do I need? |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── gpa/               # GPA Workspace
│   ├── course/            # Course Analyzer
│   ├── transcript/        # Transcript
│   ├── gpa-calculators/   # 4 GPA calculators
│   ├── grade-calculators/ # 2 grade calculators
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Crawler rules
├── components/
│   ├── Icons.tsx          # SVG icons
│   └── RelatedTools.tsx   # Internal linking
└── lib/
    └── useAcademicStore.ts

docs/
├── ARCHITECTURE.md        # System design
└── SEO_TECHNICAL.md       # Technical SEO status
```

---

## 🛠 Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |

---

## 🌐 Deployment

```bash
docker compose up -d --build
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full deployment guide.

---

*13 pages • Next.js 15 • TypeScript • Zero backend*
