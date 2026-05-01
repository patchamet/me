import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    period: z.string(),
    /** Higher = newer in the timeline. Use 9999 for ongoing. */
    endYear: z.number().default(9999),
    stack: z.array(z.string()).default([]),
    links: z
      .object({
        repo: z.string().url().optional(),
        live: z.string().url().optional(),
        caseStudy: z.string().url().optional(),
      })
      .optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
