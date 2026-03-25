import { getEvents } from '@/lib/actions/events';
import AdminListClient from '@/components/admin/AdminListClient';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your events.</p>
        </div>
        <Link href="/admin/events/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm text-sm font-medium">
          <Plus className="-ml-1 mr-2 h-5 w-5" /> New Event
        </Link>
      </div>

      <AdminListClient
        items={events}
        section="events"
        columns={[
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'event_date', label: 'Event Date', type: 'datetime' },
          { key: 'location', label: 'Location', type: 'event_location' },
        ]}
      />
    </div>
  );
}
