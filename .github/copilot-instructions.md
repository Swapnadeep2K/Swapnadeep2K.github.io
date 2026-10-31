# Copilot instructions

## Project shape

This is a dependency-free, multi-page portfolio built with plain HTML, CSS, and vanilla JavaScript. GitHub Pages serves the repository root directly; there is no compilation or bundling step.

Each top-level HTML file is a complete page. The pages share `css/styles.css` for the design system and responsive layout, and `js/main.js` for optional site-wide behaviors. The script applies the visitor's theme preference and wires up controls using `data-*` attributes; page-specific behavior such as the project image preview activates only where its markup exists.

Most content is authored directly in its HTML page. `projects.html` contains the case studies, while `index.html` features selected projects that link to their matching project anchors. Keep the repeated desktop/mobile navigation and shared page shell consistent when editing pages.

## Commands and checks

- Start a local server from the repository root: `python -m http.server 8000`, then open `http://localhost:8000`.
- There is no package manager, build step, automated test suite, or lint command. No single-test command is available; check affected pages in a browser, including both themes and mobile navigation when shared styles or scripts change.
- Regenerate sitemap dates from the repository root with `pwsh -File .github/scripts/generate-sitemap.ps1`. The script needs Git history for each listed page and updates `sitemap.xml`.

## Repository conventions

- Keep internal page and asset URLs relative so the site works both at a user-site root and under a project path. Each page's canonical URL and page metadata should still match its deployed URL.
- Project articles and links use descriptive, kebab-case IDs independent of display order.
- When adding or removing a page, update `sitemap.xml` and the explicit page list in `.github/scripts/generate-sitemap.ps1`; update the shared navigation if the page belongs there.
- Theme colors and other shared visual values belong in CSS custom properties in `css/styles.css`; dark mode overrides the same tokens under `[data-theme="dark"]`. Preserve reduced-motion and visible-focus behavior.
- Keep JavaScript behaviors attached to their existing `data-*` hooks and guarded for pages where the corresponding elements are absent. Theme preference is stored under the `site-theme` local-storage key.
- Use semantic HTML and accessible names/alternatives for meaningful controls and images. Project imagery below the initial viewport uses `loading="lazy"` and descriptive `alt` text.
- Sitemap automation is in `.github/workflows/update-sitemap.yml`: it runs on pushes to `master` (except sitemap-only changes) or manual dispatch. It regenerates and commits sitemap dates; GitHub Pages deployment is configured separately in repository settings.
