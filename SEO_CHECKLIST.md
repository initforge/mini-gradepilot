# GradePilot - SEO & Deployment Checklist

## Target
- **Domain**: gradepilot.org
- **Hosting**: DigitalOcean VPS (NYC/SFO region) + Cloudflare

---

## ✅ PHASE 1: TECHNICAL SEO

| Item | Status |
|------|--------|
| sitemap.xml / sitemap.ts | ✅ Done |
| robots.txt / robots.ts | ✅ Done |
| Canonical URLs | ✅ Done |
| Meta tags + Open Graph | ✅ Done |
| SSL via Cloudflare | ⬜ Deploy |
| Core Web Vitals (LCP < 2.5s) | ⬜ Deploy |

---

## ✅ PHASE 2: CONTENT DEPTH

All core workspaces now include 1000+ word educational content:

| Page | Sections |
|------|----------|
| `/gpa` | What is GPA, How it works, Raising Your GPA, 5 Strategies, FAQs |
| `/course` | Why Track Grades, Final Grade Calculation, Weight Categories, FAQs |
| `/transcript` | Why Transcripts Matter, GPA Requirements, Understanding Trends, FAQs |

---

## ✅ PHASE 3: UI POLISH

| Item | Status |
|------|--------|
| Custom branded icons | ✅ 100% coverage |
| Navigation layout optimization | ✅ Done |
| Mobile responsiveness | ✅ Verified |

---

## 🔄 PHASE 4: DEPLOYMENT

### Quick Deploy Commands
```bash
# Build
npm run build

# Start with PM2
pm2 start npm --name "gradepilot" -- start
pm2 save
```

### Cloudflare Configuration
- **DNS**: A record → VPS IP (Proxied ☁️)
- **SSL**: Full (strict)
- **Performance**: Auto Minify ON

---

## 📈 PHASE 5: POST-DEPLOY

- [ ] Verify https://gradepilot.org loads
- [ ] Check /sitemap.xml is accessible
- [ ] Submit sitemap to Google Search Console
- [ ] Request indexing for /gpa, /course, /transcript
- [ ] Monitor Core Web Vitals

---

*Last updated: January 15, 2026*
