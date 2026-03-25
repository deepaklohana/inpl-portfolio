import { getServiceCategoryById } from '@/lib/actions/serviceCategories';
import CategoryForm from '@/components/admin/CategoryForm';
import { notFound } from 'next/navigation';

export default async function EditCategoryPage(props: PageProps<'/admin/services/categories/[id]/edit'>) {
  const { id } = await props.params;
  const category = await getServiceCategoryById(id);
  if (!category) notFound();
  return <CategoryForm mode="edit" initialData={category} />;
}
