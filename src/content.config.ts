import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.coerce.date(),
      type: z.enum(['project', 'article', 'research', 'journal']),
      tags: z.array(z.string().regex(/^[a-z0-9-]+$/, 'tags must be lowercase kebab-case')),
      project: z.string().optional(),
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
      cover: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
