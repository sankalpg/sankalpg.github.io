# Personal Site Design — sankalpg.github.io

**Date:** 2026-04-12
**Status:** Approved

---

## Overview

Transfer Sankalp Gulati's personal website from Weebly (`sankalp-gulati-102877.weebly.com`) to GitHub Pages (`sankalpg.github.io`). The new site presents a balanced portfolio that leads with industry identity (healthcare AI) and follows with a deep research background (Music Information Retrieval).

---

## Stack & Hosting

- **Framework:** Astro (static output, zero JS by default, Markdown/JSON content)
- **Hosting:** GitHub Pages at `sankalpg.github.io`
- **Deployment:** GitHub Actions — push to `main` triggers build and deploy
- **Theme:** Clean & Minimal — dark navy (`#1a1a2e`) + white, bold typography, lots of whitespace

---

## Site Structure — Hybrid

Homepage scrolls through highlights of each section. Each section also has its own deep page. Nav links anchor to homepage sections or route to deep pages.

### Navigation
```
SANKALP GULATI    Work · Research · Projects · Contact
```

### Pages

| Route | Description |
|---|---|
| `/` | Homepage — hybrid scroll |
| `/work` | Full work experience timeline |
| `/research` | HealthTech + Music AI tabs |
| `/projects` | All projects card grid |

Contact is footer-only (no dedicated page).

---

## Page Designs

### Homepage (`/`)

Sections in order:

1. **Hero** — Name, title ("Chief Data Scientist · EkaCare"), 2-line bio, social links (LinkedIn, Google Scholar, GitHub). Optional photo.
2. **Work highlights** — Top 2–3 roles with "View all →" link to `/work`
3. **Research highlights** — Two cards: HealthTech and Music AI, with "View all →" link to `/research`
4. **Projects highlights** — 3 project cards with "View all →" link to `/projects`
5. **Footer** — Social links (LinkedIn, GitHub, Google Scholar, SoundCloud) + email

### Work (`/work`)

Chronological timeline of all roles:
- Chief Data Scientist · EkaCare (2021–present)
- Co-founder · MusicMuni Labs
- Sensibol Audio Technologies
- DAPLab · IIT Bombay
- ITTIAM Systems

Each entry: company logo placeholder, role, dates, 2–3 line description.

### Research (`/research`)

Two tabs: **HealthTech** and **Music AI**

**HealthTech tab:**
- EkaCare spotlight posts, clearly attributed as "EkaCare work"
- Posts: Parrotlet-A 2 Pro, KARMA/OpenMedEvalKit, Parrotlet-E & IndicMTEB, Semantic WER, Parrotlet-V Lite, Parrotlet-A EN, Healthcare AI Evaluation datasets, Small LLMs vs Industry Giants, Lab Report Extraction, Ontologies in Healthcare, Annual Health Report 2022
- Any published papers from EkaCare/Synaptic (to be added when provided)
- Link to Google Scholar for full list

**Music AI tab:**
- Full publication list grouped by year (2010–2016)
- Theses at top: PhD dissertation (2016, tdx.cat link works), Master's thesis (2012)
- Papers: ~20 peer-reviewed publications (ISMIR, ICASSP, ICMC-SMC, JNMR, ACM MM, etc.)
- **Broken link note:** All `mtg.upf.edu` direct PDF links return 403 (server blocks bots — may work in browser, needs manual verification). Fallback: link to Google Scholar profile.
- **Dead link:** SMC 2011 (`smcnetwork.org/smc_papers-2011072`) — 404, no valid URL. Mark as "PDF unavailable".
- `hdl.handle.net` links are valid (302 redirect to repository).
- Google Scholar profile: `https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en`

### Projects (`/projects`)

Card grid of all projects:
- Music hacks
- Academic projects (e.g., Ragawise, Dunya)
- Industry projects
- Open source (YIN.js — GitHub link works)
- Older Weebly blog posts folded in as project entries (not labeled as blog)
- Synaptic work — **to be added later** (user to provide)

---

## File Structure

```
src/
  pages/
    index.astro          # homepage (hybrid scroll)
    work.astro           # full work experience
    research.astro       # HealthTech + Music AI tabs
    projects.astro       # all projects grid
  components/
    Nav.astro
    Hero.astro
    WorkCard.astro
    ResearchCard.astro
    ProjectCard.astro
    Footer.astro
  content/
    work.json            # work experience data
    research-health.json # EkaCare spotlight posts + papers
    research-music.json  # MIR publications
    projects.json        # all projects
  styles/
    global.css           # navy + white theme, typography
public/
  favicon.svg
docs/
  superpowers/specs/     # design docs
.github/
  workflows/
    deploy.yml           # GitHub Actions build + deploy
```

---

## Content Sources

| Content | Source |
|---|---|
| Work experience | Weebly homepage + user input |
| EkaCare spotlight posts | `developer.eka.care/eka-medai/spotlight` (14 posts scraped) |
| Music AI publications | Weebly publications page (all links catalogued, broken ones flagged) |
| HealthTech papers | To be provided by user (Synaptic + any EkaCare papers) |
| Projects | Weebly projects page + GitHub |
| Social links | LinkedIn, GitHub, Google Scholar, SoundCloud, SlideShare |

---

## Open Items

- [ ] Synaptic research work — user to provide later
- [ ] Photo — optional, user to provide
- [ ] Confirm which `mtg.upf.edu` PDFs are accessible in browser (manual check needed)
- [ ] Email address for contact footer — user to provide
- [ ] Any additional HealthTech papers beyond EkaCare spotlights
