'use client';

import { useState, useMemo, useTransition, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Edit, Trash2, CheckCircle, Clock, Plus, Search,
  ChevronDown, FileText, Newspaper, Calendar, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { deleteArticle, toggleArticleStatus } from '@/lib/actions/articles';
import type { ArticleType } from '@/lib/actions/articles';

type Article = {
  id: string;
  type: string;
  title: string;
  slug: string;
  category: string | null;
  authorName: string | null;
  status: string;
  publishedAt: Date | null;
  views: number;
  featured: boolean;
};

type Counts = { all: number; news: number; blog: number; event: number };

interface Props {
  initialArticles: Article[];
  counts: Counts;
}

const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  news: { label: 'News', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  blog: { label: 'Blog', cls: 'bg-purple-100 text-purple-700 border-purple-200' },
  event: { label: 'Event', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

const STATUS_BADGE: Record<string, string> = {
  published: 'bg-green-100 text-green-800 border-green-200',
  draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  archived: 'bg-gray-100 text-gray-700 border-gray-200',
};

const NEW_TYPE_OPTIONS: { label: string; type: ArticleType; icon: React.ReactNode }[] = [
  { label: 'News Article', type: 'news', icon: <Newspaper size={14} /> },
  { label: 'Blog Post', type: 'blog', icon: <FileText size={14} /> },
  { label: 'Event', type: 'event', icon: <Calendar size={14} /> },
];

export default function ArticleListClient({ initialArticles, counts }: Props) {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [activeTab, setActiveTab] = useState<'all' | ArticleType>('all');
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string; label: string }>({
    isOpen: false, id: '', label: '',
  });
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    let rows = articles;
    if (activeTab !== 'all') rows = rows.filter((a) => a.type === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((a) => a.title.toLowerCase().includes(q));
    }
    return rows;
  }, [articles, activeTab, search]);

  const handleDelete = async () => {
    const { id } = confirmDelete;
    setConfirmDelete((s) => ({ ...s, isOpen: false }));
    setDeleting(id);
    try {
      const res = await deleteArticle(id);
      if (res.success) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        toast.success('Article deleted.');
        router.refresh();
      } else {
        toast.error(res.error || 'Failed to delete.');
      }
    } catch {
      toast.error('Unexpected error.');
    }
    setDeleting(null);
  };

  const handleToggle = (id: string, currentStatus: string) => {
    const next = currentStatus === 'published' ? 'draft' : 'published';
    startTransition(async () => {
      try {
        const res = await toggleArticleStatus(id, next as 'draft' | 'published' | 'archived');
        if (res.success) {
          setArticles((prev) => prev.map((a) => a.id === id ? { ...a, status: next } : a));
          toast.success(`Status updated to ${next}.`);
          router.refresh();
        } else {
          toast.error(res.error || 'Failed to update status.');
        }
      } catch {
        toast.error('Unexpected error.');
      }
    });
  };

  const TABS = [
    { key: 'all' as const, label: 'All', count: counts.all },
    { key: 'news' as const, label: 'News', count: counts.news },
    { key: 'blog' as const, label: 'Blog', count: counts.blog },
    { key: 'event' as const, label: 'Events', count: counts.event },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap gap-4 justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all news, blogs, and events from one place.</p>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2251B5] text-white rounded-lg text-sm font-medium shadow-sm hover:bg-[#1a3f99] transition-colors"
          >
            <Plus size={16} />
            New Article
            <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
              {NEW_TYPE_OPTIONS.map((opt) => (
                <Link
                  key={opt.type}
                  href={`/admin/articles/new?type=${opt.type}`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-400">{opt.icon}</span>
                  {opt.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-[#2251B5] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                activeTab === tab.key ? 'bg-[#2251B5]/10 text-[#2251B5]' : 'bg-gray-200 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2251B5]/30 focus:border-[#2251B5] w-64"
          />
        </div>
      </div>

      {/* Table / Empty state */}
      {filtered.length === 0 ? (
        <ScrollReveal variant="fadeUp">
          <div className="bg-white rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] p-16 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No articles found</h3>
            <p className="text-gray-500 text-sm mb-6">
              {search ? 'Try a different search term.' : 'Create your first article using the button above.'}
            </p>
          </div>
        </ScrollReveal>
      ) : (
        <>
          {/* Desktop table */}
          <ScrollReveal variant="fadeUp" className="hidden md:block bg-white rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#F3F4F6]">
                <thead className="bg-[#F9FAFB]">
                  <tr>
                    {['Type', 'Title', 'Category', 'Author', 'Status', 'Published', 'Views', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#F3F4F6]">
                  {filtered.map((article) => {
                    const badge = TYPE_BADGE[article.type] ?? { label: article.type, cls: 'bg-gray-100 text-gray-600 border-gray-200' };
                    const statusCls = STATUS_BADGE[article.status] ?? STATUS_BADGE.draft;
                    const isPublished = article.status === 'published';
                    return (
                      <tr key={article.id} className="hover:bg-[#2251B5]/5 transition-colors">
                        {/* Type */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </td>
                        {/* Title */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-gray-900 line-clamp-1 max-w-[200px]">{article.title}</span>
                            {article.featured && (
                              <span className="text-amber-500 text-[10px] font-bold bg-amber-50 border border-amber-200 rounded px-1">★ Featured</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">{article.slug}</span>
                        </td>
                        {/* Category */}
                        <td className="px-5 py-4 text-sm text-gray-600">{article.category ?? '—'}</td>
                        {/* Author */}
                        <td className="px-5 py-4 text-sm text-gray-600">{article.authorName ?? '—'}</td>
                        {/* Status */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${statusCls}`}>
                              {isPublished ? <CheckCircle size={10} /> : <Clock size={10} />}
                              {article.status}
                            </span>
                          </div>
                        </td>
                        {/* Published Date */}
                        <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '—'}
                        </td>
                        {/* Views */}
                        <td className="px-5 py-4 text-sm text-gray-600">{article.views.toLocaleString()}</td>
                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3 justify-end">
                            {/* Toggle */}
                            <button
                              title={isPublished ? 'Unpublish' : 'Publish'}
                              onClick={() => handleToggle(article.id, article.status)}
                              disabled={isPending}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${isPublished ? 'bg-[#2251B5]' : 'bg-gray-300'}`}
                            >
                              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${isPublished ? 'translate-x-[20px]' : 'translate-x-[2px]'}`} />
                            </button>
                            <Link href={`/admin/articles/${article.id}/edit`} className="text-[#2251B5] hover:text-blue-800 p-1" title="Edit">
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => setConfirmDelete({ isOpen: true, id: article.id, label: article.title })}
                              disabled={deleting === article.id}
                              className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
                              title="Delete"
                            >
                              {deleting === article.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          {/* Mobile card view */}
          <div className="md:hidden space-y-3">
            {filtered.map((article) => {
              const badge = TYPE_BADGE[article.type] ?? { label: article.type, cls: 'bg-gray-100 text-gray-600 border-gray-200' };
              const statusCls = STATUS_BADGE[article.status] ?? STATUS_BADGE.draft;
              const isPublished = article.status === 'published';
              return (
                <div key={article.id} className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.cls}`}>
                        {badge.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${statusCls}`}>
                        {isPublished ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {article.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{article.views} views</span>
                  </div>
                  <p className="font-semibold text-gray-900 line-clamp-2">{article.title}</p>
                  {(article.category || article.authorName) && (
                    <p className="text-xs text-gray-500">
                      {[article.category, article.authorName].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gray-400">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Not published'}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggle(article.id, article.status)}
                        disabled={isPending}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 disabled:opacity-50 ${isPublished ? 'bg-[#2251B5]' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${isPublished ? 'translate-x-[20px]' : 'translate-x-[2px]'}`} />
                      </button>
                      <Link href={`/admin/articles/${article.id}/edit`} className="text-[#2251B5] p-1"><Edit size={16} /></Link>
                      <button
                        onClick={() => setConfirmDelete({ isOpen: true, id: article.id, label: article.title })}
                        disabled={deleting === article.id}
                        className="text-red-500 p-1 disabled:opacity-50"
                      >
                        {deleting === article.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Delete Article"
        description={`Are you sure you want to delete "${confirmDelete.label}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: '', label: '' })}
      />
    </div>
  );
}
