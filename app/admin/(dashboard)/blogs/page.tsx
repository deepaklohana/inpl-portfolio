import { getBlogs } from '@/lib/actions/blogs';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import BlogListClient from '@/components/admin/BlogListClient';

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your blog posts here.</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Blog
        </Link>
      </div>

      <BlogListClient initialBlogs={blogs || []} />
    </div>
  );
}
