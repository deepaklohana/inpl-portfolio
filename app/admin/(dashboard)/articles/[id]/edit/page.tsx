import { getArticleById } from '@/lib/actions/articles';
import ArticleForm from '@/components/admin/ArticleForm';
import { notFound } from 'next/navigation';
import type { ArticleType } from '@/lib/actions/articles';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) notFound();

  return (
    <ArticleForm
      mode="edit"
      type={article.type as ArticleType}
      initialData={article}
    />
  );
}
