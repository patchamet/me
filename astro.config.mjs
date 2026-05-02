// @ts-check
import { defineConfig } from 'astro/config';

// During `astro dev` we serve at root for easier local previewing
// (Claude Preview MCP tool navigates to `/`, not the configured base).
// In `astro build` we keep the GitHub Pages base path `/me`.
const isDev = process.env.npm_lifecycle_event === 'dev';

// https://astro.build/config
export default defineConfig({
  site: 'https://patchamet.github.io',
  base: isDev ? '/' : '/me',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
