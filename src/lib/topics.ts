// Topic relations — computed from posts' tags[], never a hand-authored
// list (M6/T-53). Two pure functions, both taking an already-loaded posts
// array (callers fetch it once via getPublishedPosts() and pass it in,
// rather than each function re-querying the collection).
import type { CollectionEntry } from 'astro:content';
import { POST_TYPES, type PostType } from './posts';

export interface TopicCount {
  total: number;
  byType: Record<PostType, number>;
}

function emptyByType(): Record<PostType, number> {
  return Object.fromEntries(POST_TYPES.map((type) => [type, 0])) as Record<PostType, number>;
}

/**
 * Every topic's post count, split by type — feeds the rail/chip counts
 * (LegendRail.astro) and a topic page's "6 plates · 4 research · 2
 * project" notation (T-56).
 */
export function topicCounts(posts: CollectionEntry<'posts'>[]): Map<string, TopicCount> {
  const counts = new Map<string, TopicCount>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const entry = counts.get(tag) ?? { total: 0, byType: emptyByType() };
      entry.total += 1;
      entry.byType[post.data.type] += 1;
      counts.set(tag, entry);
    }
  }
  return counts;
}

/**
 * Topics that co-occur with `topic` on the same post's tags[], ranked by
 * how often — the handoff's "topik bertetangga" (docs/design/atlas/
 * README.md). Ties break alphabetically for a stable, deterministic order
 * across builds.
 */
export function neighbours(
  topic: string,
  posts: CollectionEntry<'posts'>[],
  limit = 6,
): { tag: string; count: number }[] {
  const coOccurrence = new Map<string, number>();
  for (const post of posts) {
    if (!post.data.tags.includes(topic)) continue;
    for (const tag of post.data.tags) {
      if (tag === topic) continue;
      coOccurrence.set(tag, (coOccurrence.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(coOccurrence, ([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, limit);
}
