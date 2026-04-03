import ArticleForm from '@/components/admin/ArticleForm';
import type { ArticleType } from '@/lib/actions/articles';

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function NewArticlePage({ searchParams }: Props) {
  const params = await searchParams;
  const type = (['news', 'blog', 'event'].includes(params.type ?? '')
    ? params.type
    : 'news') as ArticleType;

  return <ArticleForm mode="create" type={type} />;
}
