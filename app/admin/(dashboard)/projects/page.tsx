import { getProjects } from '@/lib/actions/projects';
import AdminListClient from '@/components/admin/AdminListClient';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your portfolio projects.</p>
        </div>
        <Link href="/admin/projects/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm text-sm font-medium">
          <Plus className="-ml-1 mr-2 h-5 w-5" /> New Project
        </Link>
      </div>

      <AdminListClient
        items={projects}
        section="projects"
        columns={[
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'client_name', label: 'Client', type: 'text' },
          { key: 'industry', label: 'Industry', type: 'text' },
          { key: 'published_at', label: 'Published', type: 'date' },
        ]}
      />
    </div>
  );
}
