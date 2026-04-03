import { redirect } from 'next/navigation';

// Legacy /blog/[slug] routes – redirect permanently to the unified /articles/[slug] path.
export default async function LegacyBlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/articles/${slug}`);
}

export async function generateStaticParams() {
  // No static params needed; the legacy slugs are redirected at runtime.
  return [];
}
