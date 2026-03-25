'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Globe, FileText, Archive } from 'lucide-react';
import { deleteServiceCategory, toggleCategoryStatus } from '@/lib/actions/serviceCategories';
import { toast } from 'sonner';

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  shortDescription: string | null;
  sortOrder: number;
  status: string;
  _count: { services: number };
};

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-gray-100 text-gray-600',
};

export default function AdminCategoriesClient({ categories: initial }: { categories: Category[] }) {
  const [categories, setCategories] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Services in it will be uncategorised.`)) return;
    setBusyId(id);
    const result = await deleteServiceCategory(id);
    if (result.success) {
      setCategories(c => c.filter(cat => cat.id !== id));
      toast.success('Category deleted');
    } else {
      toast.error((result as any).error || 'Failed to delete');
    }
    setBusyId(null);
  };

  const handleToggle = async (id: string, current: string) => {
    const next = current === 'published' ? 'draft' : 'published';
    setBusyId(id);
    const result = await toggleCategoryStatus(id, next as any);
    if (result.success) {
      setCategories(c => c.map(cat => cat.id === id ? { ...cat, status: next } : cat));
      toast.success(`Category ${next}`);
      router.refresh();
    } else {
      toast.error((result as any).error || 'Failed');
    }
    setBusyId(null);
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-12 text-center">
        <p className="text-gray-500 text-sm mb-4">No categories yet.</p>
        <Link href="/admin/services/categories/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
          Create your first category
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="pl-6 pr-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Services</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {categories.map(cat => (
            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
              <td className="pl-6 pr-3 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{cat.icon?.length === 1 || cat.icon?.length === 2 ? cat.icon : '📁'}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-400">/{cat.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-4">
                <span className="text-sm text-gray-600">{cat._count.services} service{cat._count.services !== 1 ? 's' : ''}</span>
              </td>
              <td className="px-3 py-4">
                <span className="text-sm text-gray-600">{cat.sortOrder}</span>
              </td>
              <td className="px-3 py-4">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[cat.status] || 'bg-gray-100 text-gray-600'}`}>
                  {cat.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  {/* Toggle status */}
                  <button
                    onClick={() => handleToggle(cat.id, cat.status)}
                    disabled={busyId === cat.id}
                    title={cat.status === 'published' ? 'Unpublish' : 'Publish'}
                    className="p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40"
                  >
                    {cat.status === 'published' ? <FileText size={16} /> : <Globe size={16} />}
                  </button>
                  {/* Edit */}
                  <Link href={`/admin/services/categories/${cat.id}/edit`}
                    className="p-2 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <Edit2 size={16} />
                  </Link>
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={busyId === cat.id}
                    className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
