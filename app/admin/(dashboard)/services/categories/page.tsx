import { getServiceCategories } from '@/lib/actions/serviceCategories';
import AdminCategoriesClient from '@/components/admin/AdminCategoriesClient';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function ServiceCategoriesPage() {
  const categories = await getServiceCategories();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage categories that group your services.
          </p>
        </div>
        <Link
          href="/admin/services/categories/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm text-sm font-medium gap-1"
        >
          <Plus className="w-4 h-4" /> New Category
        </Link>
      </div>

      <AdminCategoriesClient categories={categories} />
    </div>
  );
}
