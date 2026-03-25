import { getServices } from '@/lib/actions/services';
import AdminListClient from '@/components/admin/AdminListClient';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="mt-1 text-sm text-gray-500">Manage the services you offer.</p>
        </div>
        <Link href="/admin/services/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm text-sm font-medium">
          <Plus className="-ml-1 mr-2 h-5 w-5" /> New Service
        </Link>
      </div>

      <AdminListClient
        items={services}
        section="services"
        columns={[
          { key: 'icon', label: 'Icon', type: 'icon' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'startingPrice', label: 'Starting Price', type: 'text' },
          { key: 'sort_order', label: 'Order', type: 'text' },
        ]}
      />
    </div>
  );
}
