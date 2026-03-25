import { getServiceById } from '@/lib/actions/services';
import ServiceForm from '@/components/admin/ServiceForm';
import { notFound } from 'next/navigation';

export default async function EditServicePage(props: PageProps<'/admin/services/[id]/edit'>) {
  const { id } = await props.params;
  const service = await getServiceById(id);
  if (!service) notFound();
  return <ServiceForm mode="edit" initialData={service} />;
}
