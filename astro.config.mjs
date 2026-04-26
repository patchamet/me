// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://patchamet.github.io',
  base: '/me',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
