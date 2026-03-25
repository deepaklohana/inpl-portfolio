import { getNews } from '@/lib/actions/news';
import AdminListClient from '@/components/admin/AdminListClient';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function AdminNewsPage() {
  const news = await getNews();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News</h1>
          <p className="mt-1 text-sm text-gray-500">Manage news articles.</p>
        </div>
        <Link href="/admin/news/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm text-sm font-medium">
          <Plus className="-ml-1 mr-2 h-5 w-5" /> New Article
        </Link>
      </div>

      <AdminListClient
        items={news}
        section="news"
        columns={[
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'category', label: 'Category', type: 'text' },
          { key: 'author_name', label: 'Author', type: 'text' },
          { key: 'published_at', label: 'Published', type: 'date' },
        ]}
      />
    </div>
  );
}
