# me

Personal CV / portfolio site. Built with [Astro](https://astro.build) + TypeScript, deployed to GitHub Pages.

Live: https://patchamet.github.io/me/

## Develop

```sh
pnpm install
pnpm dev        # http://localhost:4321/me
pnpm build      # outputs ./dist
pnpm preview    # serve the built site
```

## Structure

```
src/
  content.config.ts          content collection schema (projects)
  content/projects/*.md      one markdown file per project (case study)
  layouts/Layout.astro       base HTML layout, meta tags
  components/                shared site chrome
  pages/
    index.astro              landing (about, skills, featured, contact)
    projects/index.astro     projects listing
    projects/[...slug].astro project detail page
  styles/global.css          design tokens + base styles
public/                      static assets (favicon, og images)
```

## Adding a project

1. Create `src/content/projects/<slug>.md`.
2. Fill in frontmatter — see `content.config.ts` for the schema.
3. Set `draft: false` to publish; `featured: true` to surface on the home page.
4. Body uses **Problem → Approach → Result → What I'd do differently** as the default rhythm.

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml` which builds the site and publishes to GitHub Pages.

One-time setup on GitHub: **Settings → Pages → Source: GitHub Actions**.

## TODO before launch

- [ ] Replace `Your Name` / contact info in `src/pages/index.astro` and `src/components/`
- [ ] Fill in real `about`, `skills` content
- [ ] Add real case studies under `src/content/projects/`
- [ ] Add `public/og.png` for social previews
- [ ] Add favicon variants if desired
