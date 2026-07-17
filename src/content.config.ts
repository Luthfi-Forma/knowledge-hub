import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        summary: z.string(),
        date: z.coerce.date(),
        type: z.enum(['project', 'article', 'research', 'photo']),
        tags: z.array(z.string().regex(/^[a-z0-9-]+$/, 'tags must be lowercase kebab-case')),
        project: z.string().optional(),
        repo: z.string().url().optional(),
        demo: z.string().url().optional(),
        cover: image().optional(),
        draft: z.boolean().default(false),
        // Opt-in per-post (ADR-002): renders a React scrollytelling island
        // instead of the MDX body. Each scrollytelling post also needs a
        // matching entry in src/lib/scrollytelling/ (bespoke data + viz —
        // there's no generic auto-chart system, same as the reference this
        // was ported from).
        //
        // NOTE: named "presentation", not "layout" — Astro's MDX integration
        // treats a frontmatter key literally named `layout` as a magic import
        // path to a layout component, so a plain string value there breaks
        // the build trying to resolve it as a module specifier.
        presentation: z.enum(['default', 'scrollytelling']).default('default'),
      })
      // A "photo" entry's cover IS the content, not decoration — enforce it
      // at build time like every other required field, instead of trusting
      // authors to remember.
      .refine((data) => data.type !== 'photo' || data.cover, {
        message: 'type: "photo" requires a cover image',
        path: ['cover'],
      })
      // Scrollytelling is a data-narrative format — scoping it to research
      // keeps the decision legible instead of allowing it on every type.
      .refine((data) => data.presentation !== 'scrollytelling' || data.type === 'research', {
        message: 'presentation: "scrollytelling" is only valid for type: "research"',
        path: ['presentation'],
      }),
});

export const collections = { posts };
