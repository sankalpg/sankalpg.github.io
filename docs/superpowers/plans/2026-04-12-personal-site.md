# Personal Site (sankalpg.github.io) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a personal portfolio at sankalpg.github.io using Astro — hybrid scroll homepage leading with industry identity, deep pages for Work, Research (HealthTech + Music AI), and Projects.

**Architecture:** Astro static site with a `BaseLayout.astro` wrapping Nav + Footer. All content stored in JSON files under `src/content/`. Pages iterate over content data. Research page uses a vanilla JS tab switcher (the only interactive element). GitHub Actions deploys on every push to `main`.

**Tech Stack:** Astro 4.x, TypeScript (strict), vanilla CSS, Playwright (E2E smoke tests), GitHub Actions.

---

## File Map

```
astro.config.mjs
tsconfig.json
playwright.config.ts
.github/workflows/deploy.yml
src/
  layouts/
    BaseLayout.astro
  styles/
    global.css
  components/
    Nav.astro
    Footer.astro
    Hero.astro
    WorkCard.astro
    ResearchEntryRow.astro
    ResearchTabs.astro
    ProjectCard.astro
    HomeSectionPreview.astro
  pages/
    index.astro
    work.astro
    research.astro
    projects.astro
  content/
    work.json
    research-health.json
    research-music.json
    projects.json
tests/
  smoke.spec.ts
```

---

## Task 1: Scaffold Astro project and GitHub Actions deploy

**Files:**
- Create: `astro.config.mjs`, `package.json`, `tsconfig.json` (generated)
- Create: `.github/workflows/deploy.yml`
- Modify: `.gitignore`

- [ ] **Step 1: Initialize Astro**

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
```

Expected: files created at project root including `src/pages/index.astro`.

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```

Expected: `Local: http://localhost:4321/` printed. Open in browser — see default Astro page. `Ctrl+C` to stop.

- [ ] **Step 4: Replace `astro.config.mjs`**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sankalpg.github.io',
});
```

- [ ] **Step 5: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

- [ ] **Step 6: Update `.gitignore`**

Add to `.gitignore`:
```
dist/
.astro/
node_modules/
.superpowers/
```

- [ ] **Step 7: Verify build**

```bash
npm run build
```

Expected: `dist/` folder created, no errors.

- [ ] **Step 8: Commit**

```bash
git add astro.config.mjs package.json package-lock.json tsconfig.json .github/ .gitignore src/
git commit -m "feat: scaffold Astro project with GitHub Pages deploy"
```

---

## Task 2: Global CSS theme + BaseLayout

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `src/styles/global.css`**

```css
/* src/styles/global.css */
:root {
  --navy: #1a1a2e;
  --navy-light: #16213e;
  --white: #ffffff;
  --off-white: #f8f9fa;
  --gray-100: #eef2ff;
  --gray-300: #dee2e6;
  --gray-500: #adb5bd;
  --gray-700: #495057;
  --accent-health: #2563eb;
  --accent-music: #7c3aed;
  --font-sans: system-ui, -apple-system, sans-serif;
  --max-width: 860px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-family: var(--font-sans); color: var(--navy); background: var(--white); }

body { min-height: 100vh; }

a { color: inherit; text-decoration: none; }
a:hover { text-decoration: underline; }

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
}

.section {
  padding: 56px 0;
}

.section--alt {
  background: var(--off-white);
}

.section__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 28px;
}

.section__title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--navy);
}

.section__link {
  font-size: 12px;
  color: var(--navy);
  opacity: 0.5;
  border-bottom: 1px solid currentColor;
}

.section__link:hover { opacity: 1; text-decoration: none; }

h1 { font-size: clamp(28px, 5vw, 44px); font-weight: 900; line-height: 1.1; }
h2 { font-size: 24px; font-weight: 800; line-height: 1.2; }
h3 { font-size: 15px; font-weight: 700; }

.label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.tag {
  display: inline-block;
  background: var(--gray-100);
  color: var(--gray-700);
  padding: 3px 8px;
  font-size: 11px;
  border-radius: 2px;
}
```

- [ ] **Step 2: Create `src/layouts/BaseLayout.astro`**

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
}

const {
  title,
  description = 'Sankalp Gulati — Chief Data Scientist building sovereign AI for healthcare in India. PhD in Music Information Retrieval.',
} = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro
git commit -m "feat: add global CSS theme and BaseLayout"
```

---

## Task 3: Nav and Footer components

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/Nav.astro`**

```astro
---
// src/components/Nav.astro
const links = [
  { label: 'Work', href: '/work' },
  { label: 'Research', href: '/research' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '#contact' },
];
const current = Astro.url.pathname;
---
<nav class="nav">
  <div class="container nav__inner">
    <a href="/" class="nav__logo">SANKALP GULATI</a>
    <ul class="nav__links">
      {links.map(l => (
        <li>
          <a href={l.href} class:list={['nav__link', { 'nav__link--active': current === l.href }]}>
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
</nav>

<style>
  .nav {
    background: var(--navy);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .nav__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 52px;
  }
  .nav__logo {
    color: var(--white);
    font-weight: 800;
    font-size: 13px;
    letter-spacing: 1.5px;
  }
  .nav__links {
    display: flex;
    list-style: none;
    gap: 24px;
  }
  .nav__link {
    color: var(--white);
    font-size: 12px;
    opacity: 0.7;
    transition: opacity 0.15s;
  }
  .nav__link:hover,
  .nav__link--active {
    opacity: 1;
    text-decoration: none;
  }
</style>
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
---
// src/components/Footer.astro
const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sankalpgulati/' },
  { label: 'GitHub', href: 'https://github.com/sankalpg' },
  { label: 'Scholar', href: 'https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en' },
  { label: 'SoundCloud', href: 'https://soundcloud.com/sankalpg' },
];
---
<footer class="footer" id="contact">
  <div class="container footer__inner">
    <span class="footer__copy">sankalpg.github.io</span>
    <ul class="footer__socials">
      {socials.map(s => (
        <li><a href={s.href} target="_blank" rel="noopener">{s.label}</a></li>
      ))}
    </ul>
  </div>
</footer>

<style>
  .footer {
    background: var(--navy);
    color: var(--white);
    padding: 20px 0;
  }
  .footer__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer__copy {
    font-size: 11px;
    opacity: 0.4;
  }
  .footer__socials {
    display: flex;
    list-style: none;
    gap: 20px;
  }
  .footer__socials a {
    color: var(--white);
    font-size: 11px;
    opacity: 0.6;
  }
  .footer__socials a:hover { opacity: 1; text-decoration: none; }
</style>
```

- [ ] **Step 3: Update `src/pages/index.astro` to use BaseLayout and verify nav + footer render**

Replace the contents of `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Sankalp Gulati">
  <p style="padding: 40px 24px;">Content coming soon.</p>
</BaseLayout>
```

- [ ] **Step 4: Start dev server and verify**

```bash
npm run dev
```

Open http://localhost:4321. Expected: dark navy nav bar with "SANKALP GULATI" and links, dark navy footer with social links.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.astro src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add Nav and Footer components"
```

---

## Task 4: Content JSON files

All real content. These are the single source of truth — pages and components read from these files.

**Files:**
- Create: `src/content/work.json`
- Create: `src/content/research-health.json`
- Create: `src/content/research-music.json`
- Create: `src/content/projects.json`

- [ ] **Step 1: Create `src/content/work.json`**

```json
[
  {
    "id": "ekacare",
    "company": "EkaCare",
    "role": "Chief Data Scientist",
    "period": "2021 – present",
    "description": "Building purpose-driven sovereign LLMs for healthcare in India. Leading AI research across medical ASR, vision models, clinical NLP, and evaluation frameworks.",
    "url": "https://eka.care"
  },
  {
    "id": "musicmuni",
    "company": "MusicMuni Labs",
    "role": "Co-founder",
    "period": "2016 – 2020",
    "description": "Co-founded a music technology startup focused on AI-driven music learning and discovery tools for Indian classical music.",
    "url": ""
  },
  {
    "id": "sensibol",
    "company": "Sensibol Audio Technologies",
    "role": "Research Scientist",
    "period": "2016 – 2021",
    "description": "Audio AI research and product development. Worked on pitch analysis, singing assessment, and audio processing pipelines.",
    "url": "https://sensibol.com"
  },
  {
    "id": "daplab",
    "company": "DAPLab, IIT Bombay",
    "role": "Research Intern",
    "period": "2010 – 2011",
    "description": "Research internship in digital audio processing and music information retrieval.",
    "url": ""
  },
  {
    "id": "ittiam",
    "company": "ITTIAM Systems",
    "role": "Engineer",
    "period": "2008 – 2010",
    "description": "Audio and video codec development.",
    "url": "https://www.ittiam.com"
  }
]
```

- [ ] **Step 2: Create `src/content/research-health.json`**

```json
[
  {
    "id": "parrotlet-a2",
    "type": "spotlight",
    "title": "Parrotlet-A 2 Pro: The Most Performant Speech Recognition Model for Indian Healthcare",
    "description": "Releasing the gold standard for medical speech recognition in Indian healthcare.",
    "url": "https://info.eka.care/services/releasing-parrotlet-a-v2-the-gold-standard-for-medical-speech-recognition-in-indian-healthcare",
    "attribution": "EkaCare"
  },
  {
    "id": "karma",
    "type": "spotlight",
    "title": "Introducing KARMA – OpenMedEvalKit",
    "description": "An open-source framework for evaluating medical AI systems.",
    "url": "https://info.eka.care/services/introducing-karma-openmedevalkit-an-open-source-framework-for-medical-ai-evaluation",
    "attribution": "EkaCare"
  },
  {
    "id": "parrotlet-e",
    "type": "spotlight",
    "title": "Parrotlet-E & Eka IndicMTEB",
    "description": "Bridging India's multilingual healthcare gap with multilingual embeddings and benchmarks.",
    "url": "https://info.eka.care/services/introducing-parrotlet-e-and-eka-indicmteb-bridging-indias-multilingual-healthcare-gap",
    "attribution": "EkaCare"
  },
  {
    "id": "semantic-wer",
    "type": "spotlight",
    "title": "Beyond Traditional WER: Semantic WER for ASR",
    "description": "New evaluation metrics for speech recognition in healthcare contexts.",
    "url": "https://info.eka.care/services/beyond-traditional-wer-the-critical-need-for-semantic-wer-in-asr-for-indian-healthcare",
    "attribution": "EkaCare"
  },
  {
    "id": "parrotlet-v",
    "type": "spotlight",
    "title": "Parrotlet-V Lite (4B) – Vision LLM for Medical Records",
    "description": "Purpose-built vision LLM for parsing and extracting data from medical documents.",
    "url": "https://info.eka.care/services/parrotlet-v-lite-4b-releasing-our-purpose-built-vision-llm-for-parsing-medical-records",
    "attribution": "EkaCare"
  },
  {
    "id": "parrotlet-a-en",
    "type": "spotlight",
    "title": "Parrotlet-A EN (5B) – English Medical ASR LLM",
    "description": "Purpose-built LLM for English ASR in Indian healthcare settings.",
    "url": "https://info.eka.care/services/parrotlet-a-en-5b-releasing-our-purpose-built-llm-for-english-asr-in-indian-healthcare",
    "attribution": "EkaCare"
  },
  {
    "id": "eval-datasets",
    "type": "spotlight",
    "title": "Advancing Healthcare AI Evaluation in India",
    "description": "EkaCare releases four evaluation datasets for medical AI systems.",
    "url": "https://info.eka.care/services/advancing-healthcare-ai-evaluation-in-india-ekacare-releases-four-evaluation-datasets",
    "attribution": "EkaCare"
  },
  {
    "id": "small-llms",
    "type": "spotlight",
    "title": "Lab-Ready and Prescription-Perfect: Eka's Small LLMs vs. Industry Giants",
    "description": "Comparative analysis of specialized small models versus general-purpose AI for healthcare tasks.",
    "url": "https://info.eka.care/services/lab-ready-and-prescription-perfect-ekas-small-llms-vs-industry-giants",
    "attribution": "EkaCare"
  },
  {
    "id": "lab-reports",
    "type": "spotlight",
    "title": "Extracting Structured Information from Lab Reports",
    "description": "Challenges and learnings from extracting structured data from medical lab reports.",
    "url": "https://info.eka.care/services/eka-smart-report",
    "attribution": "EkaCare"
  },
  {
    "id": "ontologies",
    "type": "spotlight",
    "title": "Leveraging Semantic Technologies in Healthcare",
    "description": "Ontology applications in medical contexts for knowledge representation.",
    "url": "https://info.eka.care/services/leveraging-ontologies-in-health-care",
    "attribution": "EkaCare"
  },
  {
    "id": "annual-report-2022",
    "type": "spotlight",
    "title": "Annual Health Report – India 2022",
    "description": "EkaCare's annual data-driven health report for India.",
    "url": "https://c.eka.care/insights_2022.pdf",
    "attribution": "EkaCare"
  }
]
```

- [ ] **Step 3: Create `src/content/research-music.json`**

```json
{
  "theses": [
    {
      "id": "phd-2016",
      "title": "Computational Approaches for Melodic Description in Indian Art Music Corpora",
      "year": 2016,
      "venue": "PhD Dissertation, Music Technology Group, Universitat Pompeu Fabra",
      "url": "https://www.tdx.cat/handle/10803/398984",
      "urlStatus": "ok"
    },
    {
      "id": "msc-2012",
      "title": "A Tonic Identification Approach for Indian Art Music",
      "year": 2012,
      "venue": "Master's Dissertation, Music Technology Group, Universitat Pompeu Fabra",
      "url": "https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en",
      "urlStatus": "possibly_blocked"
    }
  ],
  "papers": [
    {
      "id": "ismir2016-raga",
      "title": "Time-delayed Melody Surfaces for Raga Recognition",
      "year": 2016,
      "venue": "ISMIR",
      "url": "https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en",
      "urlStatus": "possibly_blocked"
    },
    {
      "id": "ismir2016-hindustani",
      "title": "Data-driven Exploration of Melodic Structures in Hindustani Music",
      "year": 2016,
      "venue": "ISMIR",
      "url": "https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en",
      "urlStatus": "possibly_blocked"
    },
    {
      "id": "icassp2016-phrase",
      "title": "Phrase-based Rāga Recognition Using Vector Space Modelling",
      "year": 2016,
      "venue": "ICASSP",
      "url": "https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en",
      "urlStatus": "possibly_blocked"
    },
    {
      "id": "icassp2016-motif",
      "title": "Discovering Rāga Motifs by Characterizing Communities in Networks of Melodic Patterns",
      "year": 2016,
      "venue": "ICASSP",
      "url": "https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en",
      "urlStatus": "possibly_blocked"
    },
    {
      "id": "icassp2015-eval",
      "title": "An Evaluation of Methodologies for Melodic Similarity in Audio Recordings of Indian Art Music",
      "year": 2015,
      "venue": "ICASSP",
      "url": "https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en",
      "urlStatus": "possibly_blocked"
    },
    {
      "id": "ismir2015-melodic",
      "title": "Improving Melodic Similarity in Indian Art Music Using Culture-specific Melodic Characteristics",
      "year": 2015,
      "venue": "ISMIR",
      "url": "https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en",
      "urlStatus": "possibly_blocked"
    },
    {
      "id": "sitis2014-mining",
      "title": "Mining Melodic Patterns in Large Audio Collections of Indian Art Music",
      "year": 2014,
      "venue": "SITIS",
      "url": "https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en",
      "urlStatus": "possibly_blocked"
    },
    {
      "id": "smc2014-nyas",
      "title": "Landmark Detection in Hindustani Music Melodies",
      "year": 2014,
      "venue": "ICMC-SMC",
      "url": "https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en",
      "urlStatus": "possibly_blocked"
    },
    {
      "id": "smc2014-corpora",
      "title": "Corpora for Music Information Research in Indian Art Music",
      "year": 2014,
      "venue": "ICMC-SMC",
      "url": "https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en",
      "urlStatus": "possibly_blocked"
    },
    {
      "id": "jnmr2014-tonic",
      "title": "Automatic Tonic Identification in Indian Art Music: Approaches and Evaluation",
      "year": 2014,
      "venue": "Journal of New Music Research",
      "url": "https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en",
      "urlStatus": "possibly_blocked"
    },
    {
      "id": "ismir2013-essentia",
      "title": "Essentia: An Audio Analysis Library for Music Information Retrieval",
      "year": 2013,
      "venue": "ISMIR",
      "url": "http://hdl.handle.net/10230/32252",
      "urlStatus": "ok"
    },
    {
      "id": "acmmm2013-essentia",
      "title": "Essentia: An Open-source Library for Sound and Music Analysis",
      "year": 2013,
      "venue": "ACM Multimedia",
      "url": "https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en",
      "urlStatus": "possibly_blocked"
    },
    {
      "id": "ismir2013-makam",
      "title": "Score Informed Tonic Identification for Makam Music of Turkey",
      "year": 2013,
      "venue": "ISMIR",
      "url": "http://hdl.handle.net/10230/27728",
      "urlStatus": "ok"
    },
    {
      "id": "jnmr2012-raga",
      "title": "Rāga Recognition based on Pitch Distribution Methods",
      "year": 2012,
      "venue": "Journal of New Music Research",
      "url": "http://hdl.handle.net/10230/32476",
      "urlStatus": "ok"
    },
    {
      "id": "compmusic2012-tonic",
      "title": "A Two-stage Approach for Tonic Identification in Indian Art Music",
      "year": 2012,
      "venue": "CompMusic Workshop",
      "url": "http://hdl.handle.net/10230/20370",
      "urlStatus": "ok"
    },
    {
      "id": "lncs2012-meter",
      "title": "Meter Detection from Audio for Indian Music",
      "year": 2012,
      "venue": "LNCS",
      "url": "http://dx.doi.org/10.1007/978-3-642-31980-8_3",
      "urlStatus": "ok"
    },
    {
      "id": "ismir2012-multipitch",
      "title": "A Multipitch Approach to Tonic Identification in Indian Classical Music",
      "year": 2012,
      "venue": "ISMIR",
      "url": "http://hdl.handle.net/10230/20493",
      "urlStatus": "ok"
    },
    {
      "id": "compmusic2012-browsing",
      "title": "A Musically Aware System for Browsing and Interacting with Audio Music Collections",
      "year": 2012,
      "venue": "CompMusic Workshop",
      "url": "http://hdl.handle.net/10230/20493",
      "urlStatus": "ok"
    },
    {
      "id": "iitm2010-rhythm",
      "title": "Rhythm Pattern Representations for Tempo Detection in Music",
      "year": 2010,
      "venue": "IITM",
      "url": "https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en",
      "urlStatus": "possibly_blocked"
    },
    {
      "id": "smc2011-survey",
      "title": "A Survey of Rāga Recognition Techniques and Improvements to the State-of-the-Art",
      "year": 2011,
      "venue": "SMC",
      "url": "",
      "urlStatus": "dead"
    },
    {
      "id": "ncc2011-genre",
      "title": "Automatic Genre Classification of North Indian Devotional Music",
      "year": 2011,
      "venue": "NCC",
      "url": "https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en",
      "urlStatus": "possibly_blocked"
    }
  ]
}
```

- [ ] **Step 4: Create `src/content/projects.json`**

```json
[
  {
    "id": "ragawise",
    "title": "Ragawise",
    "description": "Interactive raga recognition demo built on CompMusic research. Identifies ragas from audio in real time.",
    "url": "https://dunya.compmusic.upf.edu/ragawise/",
    "tags": ["music-ai", "demo", "research"]
  },
  {
    "id": "yin-js",
    "title": "YIN.js",
    "description": "JavaScript implementation of the YIN pitch detection algorithm for real-time pitch tracking in the browser.",
    "url": "https://github.com/sankalpg/YIN.js",
    "tags": ["open-source", "javascript", "music"]
  },
  {
    "id": "musicmuni",
    "title": "MusicMuni Labs",
    "description": "Co-founded a music technology startup building AI-powered learning and discovery tools for Indian classical music.",
    "url": "",
    "tags": ["startup", "music-ai", "india"]
  },
  {
    "id": "dunya",
    "title": "Dunya",
    "description": "Web platform for exploring CompMusic's Indian art music corpora — melodic analysis, raga recognition, and music browsing.",
    "url": "https://dunya.compmusic.upf.edu/",
    "tags": ["research", "music-ai", "platform"]
  },
  {
    "id": "jingju-tutorial",
    "title": "Jingju Melodic Description Tutorial",
    "description": "Code and tutorial for melodic description of Jingju (Peking Opera) music, presented at ISMIR.",
    "url": "http://compmusic.upf.edu/jingju-tutorial",
    "tags": ["research", "music-ai", "tutorial"]
  }
]
```

- [ ] **Step 5: Commit**

```bash
git add src/content/
git commit -m "feat: add all content data files"
```

---

## Task 5: WorkCard component and Work page

**Files:**
- Create: `src/components/WorkCard.astro`
- Create: `src/pages/work.astro`

- [ ] **Step 1: Create `src/components/WorkCard.astro`**

```astro
---
// src/components/WorkCard.astro
interface Props {
  company: string;
  role: string;
  period: string;
  description: string;
  url?: string;
}
const { company, role, period, description, url } = Astro.props;
---
<div class="work-card">
  <div class="work-card__meta">
    <span class="work-card__period">{period}</span>
  </div>
  <div class="work-card__body">
    <div class="work-card__header">
      {url
        ? <a href={url} target="_blank" rel="noopener" class="work-card__company">{company}</a>
        : <span class="work-card__company">{company}</span>
      }
      <span class="work-card__role">{role}</span>
    </div>
    <p class="work-card__desc">{description}</p>
  </div>
</div>

<style>
  .work-card {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 16px;
    padding: 20px 0;
    border-bottom: 1px solid var(--gray-300);
  }
  .work-card:last-child { border-bottom: none; }
  .work-card__period {
    font-size: 11px;
    color: var(--gray-500);
    padding-top: 3px;
  }
  .work-card__company {
    font-weight: 800;
    font-size: 15px;
    color: var(--navy);
  }
  .work-card__role {
    font-size: 13px;
    color: var(--gray-700);
    margin-left: 8px;
  }
  .work-card__desc {
    font-size: 13px;
    color: var(--gray-700);
    line-height: 1.6;
    margin-top: 6px;
  }
</style>
```

- [ ] **Step 2: Create `src/pages/work.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import WorkCard from '../components/WorkCard.astro';
import work from '../content/work.json';
---
<BaseLayout title="Work — Sankalp Gulati" description="Work experience of Sankalp Gulati.">
  <div class="container section">
    <div class="section__header">
      <h1 class="section__title">Work</h1>
    </div>
    <div>
      {work.map(entry => (
        <WorkCard
          company={entry.company}
          role={entry.role}
          period={entry.period}
          description={entry.description}
          url={entry.url || undefined}
        />
      ))}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Open http://localhost:4321/work. Expected: list of 5 work entries with company, role, period, and description for each.

- [ ] **Step 4: Commit**

```bash
git add src/components/WorkCard.astro src/pages/work.astro
git commit -m "feat: add WorkCard component and Work page"
```

---

## Task 6: Research components and Research page

**Files:**
- Create: `src/components/ResearchEntryRow.astro`
- Create: `src/components/ResearchTabs.astro`
- Create: `src/pages/research.astro`

- [ ] **Step 1: Create `src/components/ResearchEntryRow.astro`**

```astro
---
// src/components/ResearchEntryRow.astro
interface Props {
  title: string;
  year?: number;
  venue?: string;
  url: string;
  urlStatus: 'ok' | 'possibly_blocked' | 'dead';
  attribution?: string;
  description?: string;
  type: 'spotlight' | 'paper' | 'thesis';
}
const { title, year, venue, url, urlStatus, attribution, description, type } = Astro.props;
const showLink = urlStatus !== 'dead' && url;
---
<div class="entry">
  <div class="entry__main">
    {showLink
      ? <a href={url} target="_blank" rel="noopener" class="entry__title">{title}</a>
      : <span class="entry__title entry__title--dead">{title}</span>
    }
    {(venue || year) && (
      <span class="entry__meta">
        {venue && <span>{venue}</span>}
        {year && <span>{year}</span>}
      </span>
    )}
    {description && <p class="entry__desc">{description}</p>}
    {attribution && <span class="tag">{attribution}</span>}
    {urlStatus === 'dead' && <span class="entry__unavailable">PDF unavailable</span>}
  </div>
</div>

<style>
  .entry {
    padding: 14px 0;
    border-bottom: 1px solid var(--gray-300);
  }
  .entry:last-child { border-bottom: none; }
  .entry__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--navy);
    line-height: 1.4;
    display: block;
    margin-bottom: 4px;
  }
  .entry__title--dead { opacity: 0.5; }
  .entry__title:not(.entry__title--dead):hover { text-decoration: underline; }
  .entry__meta {
    display: flex;
    gap: 12px;
    font-size: 11px;
    color: var(--gray-500);
    margin-bottom: 4px;
  }
  .entry__desc {
    font-size: 12px;
    color: var(--gray-700);
    line-height: 1.5;
    margin-top: 4px;
  }
  .entry__unavailable {
    font-size: 10px;
    color: var(--gray-500);
    font-style: italic;
  }
</style>
```

- [ ] **Step 2: Create `src/components/ResearchTabs.astro`**

```astro
---
// src/components/ResearchTabs.astro
---
<div class="tabs">
  <div class="tabs__nav" role="tablist">
    <button class="tabs__btn tabs__btn--active" role="tab" aria-selected="true" data-tab="health">
      Health Tech
    </button>
    <button class="tabs__btn" role="tab" aria-selected="false" data-tab="music">
      Music AI
    </button>
  </div>
  <div class="tabs__panels">
    <div class="tabs__panel tabs__panel--active" id="panel-health" role="tabpanel">
      <slot name="health" />
    </div>
    <div class="tabs__panel" id="panel-music" role="tabpanel" hidden>
      <slot name="music" />
    </div>
  </div>
</div>

<script>
  const btns = document.querySelectorAll<HTMLButtonElement>('.tabs__btn');
  const panels = document.querySelectorAll<HTMLElement>('.tabs__panel');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab!;
      btns.forEach(b => {
        b.classList.toggle('tabs__btn--active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      panels.forEach(p => {
        const isTarget = p.id === `panel-${target}`;
        p.classList.toggle('tabs__panel--active', isTarget);
        p.hidden = !isTarget;
      });
    });
  });
</script>

<style>
  .tabs__nav {
    display: flex;
    gap: 0;
    border-bottom: 2px solid var(--gray-300);
    margin-bottom: 24px;
  }
  .tabs__btn {
    background: none;
    border: none;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    color: var(--gray-500);
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: color 0.15s, border-color 0.15s;
  }
  .tabs__btn--active {
    color: var(--navy);
    border-bottom-color: var(--navy);
  }
  .tabs__btn:hover { color: var(--navy); }
</style>
```

- [ ] **Step 3: Create `src/pages/research.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ResearchTabs from '../components/ResearchTabs.astro';
import ResearchEntryRow from '../components/ResearchEntryRow.astro';
import healthData from '../content/research-health.json';
import musicData from '../content/research-music.json';

const scholarUrl = 'https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en';

// Group music papers by year descending
const byYear: Record<number, typeof musicData.papers> = {};
for (const p of musicData.papers) {
  if (!byYear[p.year]) byYear[p.year] = [];
  byYear[p.year].push(p);
}
const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);
---
<BaseLayout title="Research — Sankalp Gulati">
  <div class="container section">
    <div class="section__header">
      <h1 class="section__title">Research</h1>
      <a href={scholarUrl} target="_blank" rel="noopener" class="section__link">Google Scholar →</a>
    </div>

    <ResearchTabs>
      <div slot="health">
        <p class="tab-note">Work conducted at EkaCare. Building sovereign AI for Indian healthcare.</p>
        {healthData.map(entry => (
          <ResearchEntryRow
            title={entry.title}
            url={entry.url}
            urlStatus={entry.urlStatus as 'ok' | 'possibly_blocked' | 'dead'}
            description={entry.description}
            attribution={entry.attribution}
            type={entry.type as 'spotlight' | 'paper' | 'thesis'}
          />
        ))}
      </div>

      <div slot="music">
        <h3 class="subsection-title">Theses</h3>
        {musicData.theses.map(t => (
          <ResearchEntryRow
            title={t.title}
            year={t.year}
            venue={t.venue}
            url={t.url}
            urlStatus={t.urlStatus as 'ok' | 'possibly_blocked' | 'dead'}
            type="thesis"
          />
        ))}

        {years.map(year => (
          <div class="year-group">
            <h3 class="year-label">{year}</h3>
            {byYear[year].map(p => (
              <ResearchEntryRow
                title={p.title}
                year={p.year}
                venue={p.venue}
                url={p.url}
                urlStatus={p.urlStatus as 'ok' | 'possibly_blocked' | 'dead'}
                type="paper"
              />
            ))}
          </div>
        ))}
      </div>
    </ResearchTabs>
  </div>
</BaseLayout>

<style>
  .tab-note {
    font-size: 13px;
    color: var(--gray-700);
    margin-bottom: 20px;
    font-style: italic;
  }
  .subsection-title {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--gray-500);
    margin: 24px 0 8px;
  }
  .year-group { margin-top: 8px; }
  .year-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--gray-500);
    margin: 20px 0 4px;
  }
</style>
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Open http://localhost:4321/research. Expected: two tabs — "Health Tech" and "Music AI". Clicking each tab switches the content. Health Tech shows 11 EkaCare spotlight posts. Music AI shows theses + papers grouped by year.

- [ ] **Step 5: Commit**

```bash
git add src/components/ResearchEntryRow.astro src/components/ResearchTabs.astro src/pages/research.astro
git commit -m "feat: add Research page with HealthTech and Music AI tabs"
```

---

## Task 7: ProjectCard component and Projects page

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/pages/projects.astro`

- [ ] **Step 1: Create `src/components/ProjectCard.astro`**

```astro
---
// src/components/ProjectCard.astro
interface Props {
  title: string;
  description: string;
  url?: string;
  tags: string[];
}
const { title, description, url, tags } = Astro.props;
---
<div class="project-card">
  <div class="project-card__header">
    {url
      ? <a href={url} target="_blank" rel="noopener" class="project-card__title">{title}</a>
      : <span class="project-card__title">{title}</span>
    }
  </div>
  <p class="project-card__desc">{description}</p>
  <div class="project-card__tags">
    {tags.map(t => <span class="tag">{t}</span>)}
  </div>
</div>

<style>
  .project-card {
    background: var(--off-white);
    border: 1px solid var(--gray-300);
    border-radius: 4px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .project-card__title {
    font-size: 15px;
    font-weight: 800;
    color: var(--navy);
  }
  .project-card__title:hover { text-decoration: underline; }
  .project-card__desc {
    font-size: 13px;
    color: var(--gray-700);
    line-height: 1.6;
    flex: 1;
  }
  .project-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
</style>
```

- [ ] **Step 2: Create `src/pages/projects.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import projects from '../content/projects.json';
---
<BaseLayout title="Projects — Sankalp Gulati">
  <div class="container section">
    <div class="section__header">
      <h1 class="section__title">Projects</h1>
    </div>
    <div class="projects-grid">
      {projects.map(p => (
        <ProjectCard
          title={p.title}
          description={p.description}
          url={p.url || undefined}
          tags={p.tags}
        />
      ))}
    </div>
  </div>
</BaseLayout>

<style>
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
</style>
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:4321/projects. Expected: card grid with 5 project cards, each with title, description, and tags.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.astro src/pages/projects.astro
git commit -m "feat: add ProjectCard component and Projects page"
```

---

## Task 8: Hero component and Homepage

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/HomeSectionPreview.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
---
// src/components/Hero.astro
---
<section class="hero">
  <div class="container hero__inner">
    <div class="hero__content">
      <p class="hero__eyebrow">Chief Data Scientist · EkaCare</p>
      <h1 class="hero__headline">Building Sovereign AI<br />for Healthcare in India</h1>
      <p class="hero__bio">
        PhD in Music Information Retrieval (Universitat Pompeu Fabra). B.Tech, IIT Kanpur.
        20+ publications in top venues. Currently building purpose-driven LLMs at EkaCare —
        medical ASR, vision models, multilingual NLP, and evaluation frameworks.
      </p>
      <div class="hero__links">
        <a href="https://www.linkedin.com/in/sankalpgulati/" target="_blank" rel="noopener" class="hero__link">LinkedIn</a>
        <a href="https://scholar.google.com/citations?user=rJSKxAMAAAAJ&hl=en" target="_blank" rel="noopener" class="hero__link">Google Scholar</a>
        <a href="https://github.com/sankalpg" target="_blank" rel="noopener" class="hero__link">GitHub</a>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    background: var(--navy);
    color: var(--white);
    padding: 64px 0 56px;
  }
  .hero__eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    opacity: 0.5;
    margin-bottom: 14px;
  }
  .hero__headline {
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 18px;
  }
  .hero__bio {
    font-size: 14px;
    line-height: 1.7;
    opacity: 0.7;
    max-width: 560px;
    margin-bottom: 24px;
  }
  .hero__links {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  .hero__link {
    color: var(--white);
    font-size: 12px;
    background: rgba(255,255,255,0.12);
    padding: 6px 14px;
    border-radius: 2px;
    transition: background 0.15s;
  }
  .hero__link:hover { background: rgba(255,255,255,0.22); text-decoration: none; }
</style>
```

- [ ] **Step 2: Create `src/components/HomeSectionPreview.astro`**

```astro
---
// src/components/HomeSectionPreview.astro
interface Props {
  title: string;
  href: string;
  alt?: boolean;
}
const { title, href, alt = false } = Astro.props;
---
<section class:list={['home-section', { 'section--alt': alt }]}>
  <div class="container">
    <div class="section__header">
      <span class="section__title">{title}</span>
      <a href={href} class="section__link">View all →</a>
    </div>
    <slot />
  </div>
</section>

<style>
  .home-section { padding: 48px 0; }
</style>
```

- [ ] **Step 3: Replace `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import HomeSectionPreview from '../components/HomeSectionPreview.astro';
import WorkCard from '../components/WorkCard.astro';
import ResearchEntryRow from '../components/ResearchEntryRow.astro';
import ProjectCard from '../components/ProjectCard.astro';

import work from '../content/work.json';
import healthData from '../content/research-health.json';
import musicData from '../content/research-music.json';
import projects from '../content/projects.json';

const topWork = work.slice(0, 2);
const topHealth = healthData.slice(0, 3);
const topMusic = musicData.papers.slice(0, 2);
const topProjects = projects.slice(0, 3);
---
<BaseLayout title="Sankalp Gulati — AI Researcher & Data Scientist">
  <Hero />

  <HomeSectionPreview title="Work" href="/work">
    {topWork.map(entry => (
      <WorkCard
        company={entry.company}
        role={entry.role}
        period={entry.period}
        description={entry.description}
        url={entry.url || undefined}
      />
    ))}
  </HomeSectionPreview>

  <HomeSectionPreview title="Research" href="/research" alt>
    <div class="research-preview">
      <div class="research-preview__col">
        <p class="label" style="color: var(--accent-health); margin-bottom: 12px;">Health Tech</p>
        {topHealth.map(e => (
          <ResearchEntryRow
            title={e.title}
            url={e.url}
            urlStatus={e.urlStatus as 'ok' | 'possibly_blocked' | 'dead'}
            attribution={e.attribution}
            type={e.type as 'spotlight' | 'paper' | 'thesis'}
          />
        ))}
      </div>
      <div class="research-preview__col">
        <p class="label" style="color: var(--accent-music); margin-bottom: 12px;">Music AI</p>
        {topMusic.map(p => (
          <ResearchEntryRow
            title={p.title}
            year={p.year}
            venue={p.venue}
            url={p.url}
            urlStatus={p.urlStatus as 'ok' | 'possibly_blocked' | 'dead'}
            type="paper"
          />
        ))}
      </div>
    </div>
  </HomeSectionPreview>

  <HomeSectionPreview title="Projects" href="/projects">
    <div class="projects-preview">
      {topProjects.map(p => (
        <ProjectCard
          title={p.title}
          description={p.description}
          url={p.url || undefined}
          tags={p.tags}
        />
      ))}
    </div>
  </HomeSectionPreview>
</BaseLayout>

<style>
  .research-preview {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
  .projects-preview {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 640px) {
    .research-preview { grid-template-columns: 1fr; }
    .projects-preview { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 4: Verify full homepage in browser**

```bash
npm run dev
```

Open http://localhost:4321. Expected: Dark navy nav → Hero with headline "Building Sovereign AI for Healthcare in India" → Work preview (EkaCare + Sensibol) → Research preview (HealthTech | Music) → Projects cards → Dark navy footer.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro src/components/HomeSectionPreview.astro src/pages/index.astro
git commit -m "feat: add Hero component and complete homepage"
```

---

## Task 9: E2E smoke tests with Playwright

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/smoke.spec.ts`

- [ ] **Step 1: Install Playwright**

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
  },
});
```

- [ ] **Step 3: Write `tests/smoke.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('homepage loads with hero headline', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Building Sovereign AI/i })).toBeVisible();
});

test('homepage nav has correct links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Work' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Research' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
});

test('work page renders all 5 entries', async ({ page }) => {
  await page.goto('/work');
  await expect(page.getByText('EkaCare')).toBeVisible();
  await expect(page.getByText('MusicMuni Labs')).toBeVisible();
  await expect(page.getByText('Sensibol Audio Technologies')).toBeVisible();
  await expect(page.getByText('DAPLab')).toBeVisible();
  await expect(page.getByText('ITTIAM Systems')).toBeVisible();
});

test('research page tab switching works', async ({ page }) => {
  await page.goto('/research');
  // Health Tech tab is active by default
  await expect(page.getByText('Parrotlet-A 2 Pro')).toBeVisible();
  // Switch to Music AI tab
  await page.getByRole('tab', { name: 'Music AI' }).click();
  await expect(page.getByText('Parrotlet-A 2 Pro')).not.toBeVisible();
  await expect(page.getByText('Computational Approaches for Melodic Description')).toBeVisible();
});

test('projects page renders project cards', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByText('Ragawise')).toBeVisible();
  await expect(page.getByText('YIN.js')).toBeVisible();
});

test('nav logo links to homepage', async ({ page }) => {
  await page.goto('/work');
  await page.getByRole('link', { name: 'SANKALP GULATI' }).click();
  await expect(page).toHaveURL('/');
});
```

- [ ] **Step 4: Run tests**

```bash
npx playwright test
```

Expected: 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/ package.json package-lock.json
git commit -m "test: add Playwright smoke tests for all pages"
```

---

## Task 10: Final cleanup and README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Final build verification**

```bash
npm run build
```

Expected: `dist/` created with `index.html`, `work/index.html`, `research/index.html`, `projects/index.html`. No build errors.

- [ ] **Step 2: Update README.md**

Replace `README.md` contents with:

```markdown
# sankalpg.github.io

Personal website of Sankalp Gulati — Chief Data Scientist, AI researcher.

Built with [Astro](https://astro.build). Deployed to GitHub Pages via GitHub Actions.

## Development

```bash
npm install
npm run dev       # dev server at localhost:4321
npm run build     # production build to dist/
npx playwright test  # smoke tests
```

## Content

All content lives in `src/content/`:
- `work.json` — work experience
- `research-health.json` — EkaCare / HealthTech work
- `research-music.json` — Music AI publications
- `projects.json` — projects
```

- [ ] **Step 3: Enable GitHub Pages**

In GitHub repo settings → Pages → Source: **GitHub Actions**. The `deploy.yml` workflow will handle the rest on next push.

- [ ] **Step 4: Final commit and push**

```bash
git add README.md
git commit -m "docs: update README with dev instructions"
git push origin main
```

Expected: GitHub Actions triggers, builds, and deploys to `https://sankalpg.github.io` within ~2 minutes.
