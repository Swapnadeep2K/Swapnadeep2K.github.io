# Swapnadeep Sarkar — Personal Portfolio

A dependency-free personal portfolio built with plain HTML, CSS, and vanilla JavaScript.

The site presents my work at the intersection of customer data, personalization, and applied AI—turning complex enterprise use cases into scalable solutions. It covers customer-data platforms, journey orchestration, analytics, experimentation, recommendations, decisioning, and practical AI solutions built with MCP integrations and reusable skills.

**Live site:** [swapnadeep2k.github.io](https://swapnadeep2k.github.io/)

## Technology

- Semantic HTML5
- Custom CSS with responsive layouts and design tokens
- Vanilla JavaScript
- GitHub Pages
- No framework, package manager, or build step

## Site structure

```text
.
├── index.html                    Home, featured work, profile summary, and contact CTA
├── projects.html                 Selected work presented as case studies
├── about.html                    Professional background, expertise, and education
├── experience.html               Experience, education, certifications, and awards
├── writing.html                  Articles and technical notes
├── now.html                      Current areas of focus
├── contact.html                  Contact details and professional profiles
├── css/
│   └── styles.css                Design system, responsive styles, and themes
├── js/
│   └── main.js                   Theme toggle, mobile navigation, and footer year
├── assets/
│   ├── favicon.svg               Site icon
│   ├── og-image.png              Social-sharing image
│   └── resume.pdf                Downloadable résumé
├── robots.txt
├── sitemap.xml
├── .nojekyll
└── .github/
    └── workflows/
        └── deploy.yml            Optional GitHub Pages deployment workflow
```

## Key features

- Responsive layouts for desktop, tablet, and mobile
- Light and dark themes with saved visitor preference
- Mobile navigation with accessible expanded-state handling
- Semantic page structure and skip-to-content links
- Reduced-motion support
- Canonical URLs, metadata, structured data, robots file, and sitemap
- Case-study-oriented presentation for enterprise work that cannot be published as open source
- Direct GitHub Pages deployment without compilation

## Local development

No installation or build process is required. Run any static file server from the repository root:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

The pages can also be opened directly in a browser because internal links and asset paths are relative.

## Content areas

The portfolio is organized around four connected themes:

1. **Data-driven personalization** — creating relevant customer experiences using unified profiles, audiences, decisioning, and recommendations.
2. **Scalable solution design** — translating complex business and customer-experience requirements into reusable enterprise solutions.
3. **Journey orchestration and measurement** — connecting customer data, cross-channel journeys, experimentation, analytics, and optimization.
4. **Applied AI** — using MCP integrations, reusable AI skills, and agentic workflows to simplify MarTech operations and support strategic decision-making.

## Updating content

Most site content is maintained directly in the corresponding HTML page:

| Content | File |
|---|---|
| Homepage introduction and selected work | `index.html` |
| Project case studies | `projects.html` |
| Professional profile | `about.html` |
| Experience and education | `experience.html` |
| Articles and notes | `writing.html` |
| Current focus | `now.html` |
| Contact information | `contact.html` |

To update the downloadable résumé, replace `assets/resume.pdf` while keeping the filename unchanged.

### Adding a project image

Use an informative alternative-text description and lazy loading for images below the initial viewport:

```html
<div class="work-visual">
  <img
    src="assets/projects/project-name.jpg"
    alt="Description of the interface, workflow, or result shown"
    loading="lazy"
  >
</div>
```

Use a consistent aspect ratio and compress images before committing them.

## Themes and accessibility

The site follows the visitor's operating-system theme by default. The header control allows the visitor to override that preference, which is saved in `localStorage` when available.

Accessibility considerations include:

- Skip-to-content links
- Semantic landmarks and heading structure
- Keyboard-accessible navigation and controls
- Visible focus indicators
- Text alternatives for meaningful images
- Decorative graphics hidden from assistive technology
- Support for `prefers-reduced-motion`

## Deployment

### Deploy from a branch

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**.
4. Choose `main` and `/ (root)`.

### Deploy with GitHub Actions

The optional `.github/workflows/deploy.yml` workflow can deploy the site after every push to `main`. In **Settings → Pages**, select **GitHub Actions** as the source.

Because internal links and assets use relative paths, the site can run from either a user site such as `username.github.io` or a project path such as `username.github.io/repository-name`.

## Before publishing changes

- Remove placeholder copy and inactive links.
- Confirm project images and their alternative text.
- Verify that `assets/og-image.png` and the favicon resolve correctly.
- Confirm canonical URLs in every page.
- Update `sitemap.xml` when adding or removing pages.
- Test both themes and the mobile menu.
- Check the résumé download and all external links.

## Author

**Swapnadeep Sarkar**  
Technical Consultant at Adobe · Personalization, Customer Data, and Applied AI

- [LinkedIn](https://www.linkedin.com/in/swapnadeep-sarkar/)
- [GitHub](https://github.com/Swapnadeep2K)