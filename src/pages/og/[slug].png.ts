import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../../lib/posts';
import { renderOgImage } from '../../lib/og-image';

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as Awaited<ReturnType<typeof getStaticPaths>>[number]['props'];
  const { title, type, date } = post.data;
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const png = await renderOgImage({
    eyebrow: 'Afreza Hernanda',
    title,
    meta: `${typeLabel} · ${formattedDate}`,
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
