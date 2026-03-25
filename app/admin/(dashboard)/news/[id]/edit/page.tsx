import { getNewsById } from '@/lib/actions/news';
import NewsForm from '@/components/admin/NewsForm';
import { notFound } from 'next/navigation';

export default async function EditNewsPage(props: PageProps<'/admin/news/[id]/edit'>) {
  const { id } = await props.params;
  const article = await getNewsById(id);
  if (!article) notFound();
  return <NewsForm mode="edit" initialData={article} />;
}
