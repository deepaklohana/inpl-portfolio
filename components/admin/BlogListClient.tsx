'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, FileText } from 'lucide-react';
import { deleteBlog } from '@/lib/actions/blogs';
import PublishButton from '@/components/admin/PublishButton';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function BlogListClient({ initialBlogs }: { initialBlogs: any[] }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null; label: string }>({ isOpen: false, id: null, label: '' });
  const router = useRouter();
  

  const requestDelete = (id: string, title: string) => {
    setConfirmDelete({ isOpen: true, id, label: title });
  };

  const handleDelete = async () => {
    const { id } = confirmDelete;
    if (!id) return;
    setConfirmDelete({ isOpen: false, id: null, label: '' });
    setIsDeleting(id);
    try {
      const result = await deleteBlog(id);
      if (result.success) {
        setBlogs(prev => prev.filter(b => b.id !== id));
        toast.success('Blog successfully deleted.');
        router.refresh();
      } else {
        toast.error(`Error deleting blog: ${result.error}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete blog.');
    } finally {
      setIsDeleting(null);
    }
  };

  if (blogs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
        <p className="text-gray-500 mb-6">Get started by creating your first blog post.</p>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Create New Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title & Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published At
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{blog.title}</div>
                      <div className="text-sm text-gray-500">{blog.category || 'Uncategorized'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border
                      ${
                        blog.status === 'published'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : blog.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                  >
                    {blog.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <PublishButton
                      id={blog.id}
                      slug={blog.slug}
                      currentStatus={blog.status}
                      contentType="blogs"
                      publishedAt={blog.published_at}
                    />
                    <Link
                      href={`/admin/blogs/${blog.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => requestDelete(blog.id, blog.title)}
                      disabled={isDeleting === blog.id}
                      className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Confirm Deletion"
        description={`Are you sure you want to delete "${confirmDelete.label}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null, label: '' })}
      />
    </div>
  );
}
