import { getTestimonialsForAdmin } from '@/lib/actions/testimonials';
import AdminListClient from '@/components/admin/AdminListClient';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const VIEW_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'services', label: 'Services Page' },
  { value: 'project', label: 'Project Linked' },
  { value: 'both', label: 'Services + Project' },
] as const;

export default async function AdminTestimonialsPage({ searchParams }: { searchParams?: { page?: string } }) {
  const testimonials = await getTestimonialsForAdmin();

  const activePage = (searchParams?.page && typeof searchParams.page === 'string' ? searchParams.page : 'all').toLowerCase();
  const filterPage = VIEW_FILTERS.some((p) => p.value === activePage) ? activePage : 'all';

  const hasServicesPage = (t: any) => Array.isArray(t.showOnPages) && t.showOnPages.includes('services');
  const hasProjectLink = (t: any) => Boolean(t.projectId);

  const countForPage = (pageValue: string) => {
    if (pageValue === 'all') return testimonials.length;
    if (pageValue === 'services') return testimonials.filter((t: any) => hasServicesPage(t)).length;
    if (pageValue === 'project') return testimonials.filter((t: any) => hasProjectLink(t)).length;
    if (pageValue === 'both') return testimonials.filter((t: any) => hasServicesPage(t) && hasProjectLink(t)).length;
    return 0;
  };

  const filtered = testimonials.filter((t: any) => {
    if (filterPage === 'all') return true;
    if (filterPage === 'services') return hasServicesPage(t);
    if (filterPage === 'project') return hasProjectLink(t);
    if (filterPage === 'both') return hasServicesPage(t) && hasProjectLink(t);
    return true;
  });

  const statusRank: Record<string, number> = { published: 0, draft: 1, archived: 2 };
  const visibilityKey = (t: any) => {
    const tags = [];
    if (hasServicesPage(t)) tags.push('services');
    if (hasProjectLink(t)) tags.push('project');
    return tags.join(',');
  };

  const sorted = filtered.slice().sort((a: any, b: any) => {
    const pkA = visibilityKey(a);
    const pkB = visibilityKey(b);
    const pageCmp = pkA.localeCompare(pkB);
    if (pageCmp !== 0) return pageCmp;

    const sA = statusRank[a.status] ?? 99;
    const sB = statusRank[b.status] ?? 99;
    if (sA !== sB) return sA - sB;

    // featured: true first
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });

  const rows = sorted.map((t: any) => ({
    ...t,
    visibilityTags: [
      ...(hasServicesPage(t) ? ['services'] : []),
      ...(hasProjectLink(t) ? ['project'] : []),
    ],
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="mt-1 text-sm text-gray-500">Manage client testimonials.</p>
        </div>
        <Link href="/admin/testimonials/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm text-sm font-medium">
          <Plus className="-ml-1 mr-2 h-5 w-5" /> New Testimonial
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {VIEW_FILTERS.map((f) => {
          const isActive = filterPage === f.value;
          const count = countForPage(f.value);
          return (
            <Link
              key={f.value}
              href={f.value === 'all' ? '/admin/testimonials' : `/admin/testimonials?page=${f.value}`}
              className={[
                'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors',
                isActive ? 'bg-[#E96429]/10 border-[#E96429] text-[#E96429]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
              ].join(' ')}
            >
              {f.label} <span className="text-xs font-semibold text-gray-500">({count})</span>
            </Link>
          );
        })}
      </div>

      <AdminListClient
        items={rows}
        section="testimonials"
        columns={[
          { key: 'clientName', label: 'Client', type: 'client_info' },
          { key: 'visibilityTags', label: 'Visibility', type: 'pages' },
          { key: 'projectTitle', label: 'Project', type: 'text' },
          { key: 'rating', label: 'Rating', type: 'rating' },
          { key: 'content', label: 'Preview', type: 'text' },
        ]}
      />
    </div>
  );
}
