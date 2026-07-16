import { getCollection, type CollectionEntry } from 'astro:content';

export const POST_TYPES = ['project', 'article', 'research', 'journal'] as const;
export type PostType = (typeof POST_TYPES)[number];

export async function getPublishedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getFeaturedProjects(limit = 4): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.data.type === 'project').slice(0, limit);
}

export async function getLatestPosts(limit = 5): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getPublishedPosts();
  return posts.slice(0, limit);
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts, ([tag, count]) => ({ tag, count })).sort((a, b) => a.tag.localeCompare(b.tag));
}

export async function getPostsByTag(tag: string): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.data.tags.includes(tag));
}

export async function getRelatedPosts(
  post: CollectionEntry<'posts'>,
  limit = 3,
): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getPublishedPosts();
  const tags = new Set(post.data.tags);

  return posts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => {
      let score = 0;
      if (post.data.project && candidate.data.project === post.data.project) {
        score += 2;
      }
      score += candidate.data.tags.filter((tag) => tags.has(tag)).length;
      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.candidate.data.date.valueOf() - a.candidate.data.date.valueOf();
    })
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export async function getProjectSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts();
  const slugs = new Set<string>();
  for (const post of posts) {
    if (post.data.project) {
      slugs.add(post.data.project);
    }
  }
  return [...slugs];
}

export async function getPostsByProject(project: string): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getPublishedPosts();
  return posts
    .filter((post) => post.data.project === project)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getProjectSummary(project: string): Promise<{ repo?: string; demo?: string }> {
  const posts = await getPostsByProject(project);
  const repo = posts.find((post) => post.data.repo)?.data.repo;
  const demo = posts.find((post) => post.data.demo)?.data.demo;
  return { repo, demo };
}
