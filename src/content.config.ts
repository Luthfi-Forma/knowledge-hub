import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
 * Story structure (M10/T-75, ADR-005). Holds the parts of a scrollytelling
 * post that are NOT prose: the hero, the underlying source, and the ordered
 * list of scenes with their citations.
 *
 * What is deliberately NOT here: each scene's kicker, title, and body. Those
 * are written in the MDX body as `<Scene id kicker title>` around the prose
 * they label, because a scene's heading belongs next to its paragraph, not in
 * a parallel list that can drift from it.
 *
 * That split is forced, not merely preferred. Props passed to `<Content />`
 * do not reach the MDX body scope — measured during T-75, not assumed:
 * `Astro.props` throws `ReferenceError: Astro is not defined` inside MDX, and
 * a bare variable renders as undefined. So a component used inside MDX can
 * never read this frontmatter, and a component wrapping `<Content />` can
 * never interleave anything into it. Anything rendered INSIDE a scene must be
 * authored in the MDX; anything aggregated ACROSS scenes must be here.
 *
 * Citations sit on this side because the Sources panel lists all of them at
 * once, which is only possible from an aggregate. They are no longer repeated
 * inline per scene — the previous shell rendered every citation twice, once
 * in a per-section <details> and again in the panel, from the same data.
 */
const storyCitation = z.object({
  /** Short name of the cited thing — "Table 1", "Rahman & Hernanda (2025)". */
  label: z.string(),
  /** Where in it — "Land Use Change Analysis, p. 5". */
  where: z.string(),
  /** Optional verbatim line from the source. */
  quote: z.string().optional(),
});

const storyScene = z.object({
  /*
   * Must match a `<Scene id="...">` in the MDX body. The two cannot be
   * cross-checked at build time (see the note above: nothing can read the
   * rendered MDX), so a typo here means that scene's citations go missing
   * from the panel rather than failing the build. Keep the ids short.
   */
  id: z.string().regex(/^[a-z0-9-]+$/, 'scene id must be lowercase kebab-case'),
  citations: z.array(storyCitation).default([]),
  /** Provenance of this scene's visual, shown under the stage. */
  vizCitation: z.object({ fig: z.string(), source: z.string() }).optional(),
});

const story = z.object({
  eyebrow: z.string(),
  /** The story's own display title — distinct from the post's `title`, which is the page/SEO title. */
  title: z.string(),
  /*
   * An exact substring of `title` to set in the research colour. Replaces the
   * old JSX `<em className="text-research not-italic">` that could only exist
   * because the title used to be a ReactNode. Story.astro fails the build if
   * this is not found in `title`, so a reworded title can't silently lose its
   * accent.
   */
  emphasise: z.string().optional(),
  dek: z.string(),
  /** Mono notation line under the dek — "Cikarang · Bekasi · 2016 – 2023". */
  meta: z.string(),
  /** The one underlying document or dataset the whole story reads. */
  source: z.object({
    /** "Paper", "Source", "Dataset" — the kicker above the citation. */
    label: z.string(),
    author: z.string(),
    /** Title of the work, rendered italic. */
    work: z.string(),
    /** Venue, date, and any onward data provenance. */
    note: z.string(),
  }),
  scenes: z.array(storyScene).min(1),
});

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
        // Optional during M10: the four existing scrollytelling posts still
        // carry their structure inside src/lib/scrollytelling/*.tsx and only
        // move over in T-79. Once all four have migrated, this becomes
        // required alongside `presentation: "scrollytelling"`.
        story: story.optional(),
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
      })
      // One-directional on purpose (M10/T-75): a `story` block is meaningless
      // without the scrollytelling presentation, so that combination is an
      // error. The reverse — scrollytelling without `story` — is still legal
      // because the four live posts are mid-migration; T-79 tightens this to
      // require both together once none are left on the old shell.
      .refine((data) => !data.story || data.presentation === 'scrollytelling', {
        message: 'a `story` block requires presentation: "scrollytelling"',
        path: ['story'],
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
