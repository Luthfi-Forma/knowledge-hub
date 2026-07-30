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
        // Optional, display-only (M5/T-40) — a hand-picked real-world DMS
        // coordinate stamped on the post's Immersive-mode "plate". Deliberately
        // a pre-formatted string, not lat/lng numbers: nothing computes from
        // it, so there's no reason to carry conversion logic for a decorative
        // stamp. Omitted (not fabricated) for posts with no real place —
        // building-knowledge-hub is about the site itself, not a location.
        coordinates: z.string().optional(),
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
        // Optional, display-only (M6/T-53) — a few labelled facts to stamp
        // on a post's Atlas "plate" (docs/design/atlas/README.md's
        // dashed-border "angka dampak: dari Anda" slots). Schema only for
        // now: no post has this field yet, and it isn't rendered anywhere
        // until the editorial pass in M7 supplies real values — Plate.astro
        // (T-50) deliberately omits an empty-array placeholder rather than
        // guessing at numbers that don't exist yet.
        impact: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
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

// Topic definitions (M6/T-53; content lands in M7 — see ADR-004
// Consequences). `title` is the display slug ("google-earth-engine"),
// `definition` the 1-sentence gloss shown on /topics/[topic]; `aliases` is
// unused today (reserved for the same slug under a different casing/name);
// `related` is a manual override for the auto-computed neighbours (see
// lib/topics.ts's `neighbours()`) — empty by default, meaning "trust the
// co-occurrence computation," not "no neighbours."
const topics = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/topics' }),
  schema: z.object({
    title: z.string(),
    definition: z.string().max(240),
    aliases: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { posts, topics };
