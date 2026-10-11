# jobpilot-cn (Job-Hunting Flow · China)

A **local-first, zero-upload** AI Skill for job hunting in China. Turn any AI coding CLI into your job-search command center: paste a JD → assess the fit → tailor a Chinese resume → generate outreach copy → track applications.

> This project is an independently implemented job-search assistant, open-sourced under the MIT license.
> It is independently developed with no upstream code dependencies.

---

## What it solves

A generic "one resume fits all" approach rarely works — hit rates vary wildly across roles. The core idea of jobpilot-cn is **one tailored resume per role**:

1. **Goal positioning** (Step 0): clarify role / industry / city / experienced-vs-campus / salary basis first, so you don't end up with a "jack-of-all-trades" generic resume.
2. **Fact-checking & quantification** (Step 1): rewrite responsibilities as "action + object + result + number".
3. **JD-specific tailoring** (Step 4): rewrite the resume against the posting, with a match score, gap list, and a go/no-go recommendation.
4. **Outreach & tracking** (Step 5): generate BOSS / Maimai / Liepin / email / WeChat copy and maintain an application tracker.

See [`FLOW.md`](./FLOW.md) for the full flow.

---

## Requirements

- **Node.js ≥ 18.17** (LTS 20 / 22 recommended)
- **Playwright** (needed for PDF generation; downloads Chromium automatically on install)
- **Python 3.10+ with python-docx** (needed to generate editable Word `.docx`)
- OS: Windows / macOS / Linux all supported
- **No API key required**: the core assessment and rewriting are done by your local AI CLI

## Install & init

```bash
git clone <your-repo-url> jobpilot-cn
cd jobpilot-cn
npm install
pip install python-docx   # needed to generate Word (.docx)
cp config/profile.example.yml config/profile.yml   # required: your profile
cp config/portals.example.yml config/portals.yml   # optional: job discovery
# Write your resume base draft as JSON: data/cv-base.json
# (field contract in schema/resume.schema.json; start by copying schema/example-cv.json)
# Optional: also keep a human-readable data/cv-base.md (not the source of truth, backup/reference only)
```

## Common commands (triggered inside your AI CLI)

| Command | Purpose |
|---------|---------|
| `/jobpilot-cn oferta <JD>` | Assess a JD (A–H framework) |
| `/jobpilot-cn pdf` | Generate a Chinese PDF / Word resume from `data/cv-base.json` |
| `/jobpilot-cn contacto-cn <channel/scenario>` | Generate outreach copy drafts |
| `/jobpilot-cn tracker` | View the application tracker |

**Output directory**: PDFs live in `output/` (gitignored, regenerable anytime).

## Your resume data (never committed)

This project **ships no real resume**. Both `data/` and `output/` are ignored by `.gitignore` — **your personal resume, application records, and assessment reports never enter Git history or any public repo**.

How to use it:

1. Copy the anonymized sample as a starting point: `cp schema/example-cv.json data/cv-base.json`
2. Fill in your own real info in `data/cv-base.json` (this file is gitignored and never uploaded)
3. One-shot export (HTML→PDF→DOCX): `npm run export:cv -- data/cv-base.json my-resume templates/cv-zh-minimal.html`
   - The 2nd argument is the output name (determines `output/my-resume.pdf` and `.docx`); the 3rd is an optional template (default `minimal`, or `modern`)
   - DOCX depends on `python-docx`; if missing, it is skipped with a notice
4. Preview only (using the anonymized sample): `npm run demo:minimal` / `npm run demo:modern`

## Directory structure

- `modes/`: all prompt logic — assessment, rewriting, outreach, PDF, etc.
- `templates/`: Chinese resume HTML templates
- `config/`: user profile and job-discovery config
- `scripts/`: resume build and PDF rendering scripts
- `data/`: your resume, assessment reports, application tracker (generated at runtime)

## Resume templates

Two built-in Chinese resume templates, switched via the 3rd argument of `build-cv.mjs` (or the one-shot demo commands):

| Template | File | Style |
|----------|------|-------|
| minimal (default) | `templates/cv-zh-minimal.html` | single column · calm navy heading · grey skill tags |
| modern | `templates/cv-zh-modern.html` | two columns · dark sidebar + cyan accent · tech/startup feel |

Generate both sample PDFs in one shot (based on the anonymized `schema/example-cv.json`):

```bash
npm run demo:minimal   # → output/example-minimal.pdf
npm run demo:modern    # → output/example-modern.pdf
```

Specify a template manually:

```bash
node scripts/build-cv.mjs <resume.json> <output.html> <template.html>
node scripts/render-pdf.mjs <output.html> <output.pdf>
```

## Compliance & disclaimers

- **Platform scraping**: Major Chinese job boards (BOSS Zhipin / Liepin / Zhaopin / 51job / Lagou / Nowcoder / Maimai) broadly anti-scrape, require login, and their ToS forbid automated crawling. **This project does not provide logged-in scraping** — it only suggests discovering roles via public search. Any logged-in scraping is at your own risk and must comply with each platform's ToS and local law.
- **Outreach**: AI only generates copy **drafts**; you send them manually. No auto mass-messaging script is provided (violates platform ToS and risks account bans).
- **Risk signals are not legal advice**: Block G's scam signals are experience-based tips only; for major decisions consult a professional.
- **Resume authenticity**: You are responsible for the truthfulness of your resume content; this tool only rewrites phrasing and never fabricates experience.

## Third-party dependencies

All source code in this project is independently implemented and copyrighted by jobpilot-cn. The only runtime dependency is **Playwright** (Microsoft's open-source library, Apache-2.0 / MIT, used to render Chinese HTML into PDF):

- It is **not distributed with this repo**: `node_modules/` is gitignored, so cloning this project includes no third-party code or license notices.
- It exists **only on your machine**: downloaded to local `node_modules/` during `npm install` as a temporary tool, not part of this project's source.
- Its license-required copyright notices stay inside **its own files** and do not affect this project's MIT copyright.

For a fully offline, zero-dependency run, you can drive rendering with a system-installed Chromium instead (see `scripts/render-pdf.mjs` comments), but the default approach follows the declared Playwright dependency.

## License

MIT License. See [`LICENSE`](./LICENSE). This repository contains no third-party copyrighted source code or documentation.

---

## FAQ / Troubleshooting

**Q: Generated PDF shows Chinese as garbled boxes (tofu)?**
A: This is caused by missing Chinese fonts on your machine — Playwright uses system fonts to render HTML to PDF. Install a Chinese font first (Windows ships "Microsoft YaHei / SimSun"; macOS ships "PingFang / Hiragino"; Linux can install `fonts-noto-cjk` or `wqy-zenhei`), then rerun `npm run export:cv`.

**Q: Phone / email icons not showing on the resume?**
A: This project now uses plain-text labels (Phone: / Email: / WeChat: / Location: / Link:), not emoji fonts, so missing-icon issues shouldn't occur normally. If you still see anomalies, verify the template hasn't been modified.

**Q: No python-docx installed — can I still generate Word?**
A: Not `.docx`, but PDF still generates fine; the script skips DOCX with a notice. Install the dependency and rerun: `pip install python-docx`.

**Q: `npm install` is slow or fails?**
A: Playwright downloads Chromium, which is large. Ensure network access; in China you can configure an npm mirror. If Chromium download fails, see `scripts/render-pdf.mjs` comments to switch to a system-installed Chromium.
