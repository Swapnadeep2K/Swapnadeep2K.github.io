# [YOUR NAME] — personal site

A dependency-free static site: plain HTML, CSS and vanilla JS. No build step,
no framework, no npm install required. Built to deploy directly to GitHub
Pages, either at `username.github.io` or `username.github.io/repo-name/`.

## Structure

```
.
├── index.html          Home — hero, selected work, about/experience/writing previews, contact CTA
├── projects.html        Full project list, case-study style
├── about.html           Long-form about page
├── experience.html      Full professional + education timeline
├── writing.html         Articles / notes list
├── now.html             "What I'm focused on right now" page
├── contact.html         Contact links + optional message form
├── css/styles.css       Design tokens (colors, type, spacing) + all styles
├── js/main.js           Theme toggle, mobile nav, footer year — ~60 lines, no dependencies
├── assets/favicon.svg   Favicon
├── robots.txt
├── sitemap.xml
├── .nojekyll             Tells GitHub Pages not to run Jekyll on this repo
└── .github/workflows/deploy.yml   Optional Actions-based deploy (see below)
```

## Local development

No build tooling needed. Any static file server works, for example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` directly in a browser — all asset paths are
relative, so it works either way.

## Content status

The site is now populated with real content from your resume — name, email,
GitHub/LinkedIn, Adobe role, AEP/AJO/Target/AEM EDS work, MCP/LLM projects,
BITS Pilani + VIT education, certifications and awards. `assets/resume.pdf`
is the resume version those details were pulled from (the one with the MCP/
Adobe Coworker work and 9.68 CGPA); swap it for an updated file whenever you
have one, keeping the filename the same so the download link on
`experience.html` doesn't break.

A couple of judgment calls worth knowing about, since your three resume
versions disagreed slightly:
- **CGPA / graduation month for the M.Tech**: two of three resumes said
  9.68 CGPA and 03/2026; the third said 9.73 and 05/2026. The site uses
  9.68 / 2026 — update `about.html` and `experience.html` if 9.73 is correct.
- **Email**: two of three resumes used `swapnamama90@gmail.com`, one used
  `swapnamama90@mail.com`. The site uses the `gmail.com` address.
- **Phone number**: left off the public site by default, since publishing a
  phone number tends to invite spam calls. Add it to `contact.html`
  yourself if you want it visible.
- **`[SITE_URL]`**: set to `https://swapnadeep2k.github.io` as a best guess
  based on your GitHub username. If you deploy under a project repo instead
  (`swapnadeep2k.github.io/repo-name`), update the canonical/OG tags in
  every page's `<head>`, plus `robots.txt` and `sitemap.xml`.

### Still worth doing

| Item | Where | Notes |
|---|---|---|
| Project screenshots | index.html, projects.html | replace `<span class="placeholder-fill">[ADD SCREENSHOT]</span>` with real `<img>` tags — this is the highest-impact thing left to do |
| Hero availability line | index.html | currently just states your role/location; add an availability line if you want one |
| "Outside of work" line | about.html | one personal detail — the resume doesn't cover this, so it's still a placeholder |
| Writing entries | writing.html | resume has no blog posts to pull from; add real ones or link out to Medium/Substack/etc. |
| Now page: reading / thinking about | now.html | two fields left as placeholders — the other two are filled from your current MCP/LLM work |
| `og-image.png` | referenced in `<head>` of index.html | add a real 1200×630 social preview image to `assets/`, or remove the two `og:image`/`twitter:image` tags |
| Contact form `[FORM_BACKEND_URL]` | contact.html | GitHub Pages has no server, so the form needs a backend like Formspree or Getform to actually send anywhere — or delete the `<form>` block and keep the `mailto:` link |
| High-school entry | resume has it, site doesn't | intentionally left off the timeline as not usually relevant to a professional portfolio — add it to experience.html if you'd rather include it |

### Adding a project image

Replace:
```html
<div class="work-visual"><span class="placeholder-fill">[PROJECT SCREENSHOT]</span></div>
```
with:
```html
<div class="work-visual"><img src="assets/projects/project-one.jpg" alt="[Describe what's shown]" loading="lazy"></div>
```
Keep images close to a 16:10 ratio and compress them (e.g. via Squoosh)
before committing — this is what keeps the Lighthouse performance score high.

## Dark mode

Respects the visitor's OS-level `prefers-color-scheme` by default. The
toggle in the header lets them override it; the choice is remembered via
`localStorage` where available, and degrades gracefully (session-only) if
storage is blocked. All color, motion and focus-state rules live in
`css/styles.css` under `:root` and `[data-theme="dark"]`.

## Accessibility & motion

- Skip-to-content link on every page.
- Visible focus outlines are never suppressed.
- All decorative SVGs (`signal-trace`, `signal-divider`, status dot) are
  `aria-hidden` or purely decorative; icons on interactive elements have
  `aria-label`s.
- `prefers-reduced-motion` disables the hero draw-on animation, the status
  dot pulse, and all transitions site-wide — the site is fully usable and
  legible with zero motion.

## Deploying to GitHub Pages

**Option A — no Actions, simplest:**
1. Push this repo to GitHub.
2. Repo → Settings → Pages → Source: "Deploy from a branch" → `main`, `/ (root)`.
3. Your site is live at `https://<username>.github.io/<repo-name>/`
   (or `https://<username>.github.io/` if the repo is named `<username>.github.io`).

Because every internal link and asset path in this site is relative
(`css/styles.css`, `projects.html`, not `/css/styles.css`), it works
correctly under a subpath like `/repo-name/` with zero configuration.

**Option B — via GitHub Actions:**
The included `.github/workflows/deploy.yml` will deploy automatically on
every push to `main`. To use it, set Settings → Pages → Source to "GitHub
Actions" instead of "Deploy from a branch." Delete the workflow file if you
don't want it — Option A alone is sufficient for a site with no build step.

Either way, once `[SITE_URL]` is known, replace it across all pages
(`<link rel="canonical">`, Open Graph tags, `robots.txt`, `sitemap.xml`) so
search engines and social previews resolve correctly.
