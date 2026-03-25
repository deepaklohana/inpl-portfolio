import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600;

export default async function BlogListPage() {
  const blogs = await prisma.blog.findMany({
    where: { status: 'published' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      cover_image: true,
      published_at: true,
      created_at: true,
    },
    orderBy: [{ published_at: 'desc' }, { created_at: 'desc' }],
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="mt-2 text-sm text-gray-600">Latest updates, insights, and announcements.</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((b) => (
          <article key={b.id} className="border border-gray-100 bg-white rounded-xl overflow-hidden shadow-sm">
            {b.cover_image ? (
              <img src={b.cover_image} alt={b.title} className="h-44 w-full object-cover" />
            ) : (
              <div className="h-44 w-full bg-gray-100" />
            )}
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">{b.title}</h2>
              {b.published_at ? (
                <p className="mt-2 text-xs text-gray-500">
                  {new Date(b.published_at).toLocaleDateString()}
                </p>
              ) : null}
              {b.excerpt ? <p className="mt-3 text-sm text-gray-600 line-clamp-3">{b.excerpt}</p> : null}
              <div className="mt-5">
                <Link
                  href={`/blog/${b.slug}`}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Read more
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="mt-10 rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-600">
          No published posts yet.
        </div>
      )}
    </div>
  );
}
