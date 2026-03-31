import { getFAQs } from '@/lib/actions/faqs';
import FAQManagerClient from '@/components/admin/FAQManagerClient';

export default async function AdminFAQsPage() {
  const faqs = await getFAQs();

  const rows = faqs.map((f: any) => ({
    id: String(f.id),
    question: f.question,
    answer: f.answer,
    sortOrder: f.sortOrder,
    status: f.status,
  }));

  return <FAQManagerClient initialFAQs={rows} />;
}
