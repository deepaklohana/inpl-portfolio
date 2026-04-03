import { getArticles } from '@/lib/actions/articles';
import { prisma } from '@/lib/prisma';
import ArticleListClient from '@/components/admin/ArticleListClient';

export default async function AdminArticlesPage() {
  const [articles, countRows] = await Promise.all([
    getArticles({}),
    prisma.article.groupBy({ by: ['type'], _count: true }),
  ]);

  const counts = {
    all: articles.length,
    news: countRows.find((r) => r.type === 'news')?._count ?? 0,
    blog: countRows.find((r) => r.type === 'blog')?._count ?? 0,
    event: countRows.find((r) => r.type === 'event')?._count ?? 0,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ArticleListClient initialArticles={articles} counts={counts} />
    </div>
  );
}
