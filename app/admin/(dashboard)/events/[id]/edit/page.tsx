import { getEventById } from '@/lib/actions/events';
import EventForm from '@/components/admin/EventForm';
import { notFound } from 'next/navigation';

export default async function EditEventPage(props: PageProps<'/admin/events/[id]/edit'>) {
  const { id } = await props.params;
  const event = await getEventById(id);
  if (!event) notFound();
  return <EventForm mode="edit" initialData={event} />;
}
