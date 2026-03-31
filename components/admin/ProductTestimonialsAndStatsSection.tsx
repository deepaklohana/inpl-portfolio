'use client';

import { useMemo, useState } from 'react';
import { X, Star, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import TestimonialPicker from './TestimonialPicker';
import { updateProduct } from '@/lib/actions/products';
import {
  addTestimonialToProduct,
  getProductTestimonials,
  removeTestimonialFromProduct,
  updateProductTestimonialsOrder,
} from '@/lib/actions/productTestimonials';

type SelectedTestimonial = {
  id: string; // testimonial id
  sortOrder: number;
  client_image: string | null;
  client_name: string;
  client_title: string | null;
  client_company: string | null;
  rating: number;
  content: string;
  showOnPages: string[];
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            size={12}
            className={filled ? 'text-[#E96429] fill-[#E96429]' : 'text-gray-300'}
          />
        );
      })}
    </div>
  );
}

function PageBadges({ pages }: { pages: string[] }) {
  const styleMap: Record<string, string> = {
    services: 'bg-[#E96429]/10 text-[#E96429] border-[#E96429]/20',
    products: 'bg-[#2251B5]/10 text-[#2251B5] border-[#2251B5]/20',
    home: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    about: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    contact: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {(pages ?? []).map((p) => {
        const normalized = String(p).toLowerCase();
        const labelMap: Record<string, string> = {
          services: 'Services',
          products: 'Products',
          home: 'Home',
          about: 'About',
          contact: 'Contact',
        };
        const label = labelMap[normalized] ?? normalized;
        const pillClass = styleMap[normalized] ?? 'bg-gray-100 text-gray-600 border-gray-200';
        return (
          <span
            key={normalized}
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${pillClass}`}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}

function normalizeStats(stats: any): { value: string; label: string }[] {
  if (!Array.isArray(stats)) return [];
  return stats
    .map((s: any) => ({
      value: typeof s?.value === 'string' ? s.value : '',
      label: typeof s?.label === 'string' ? s.label : '',
    }))
    .filter((s: any) => s.value !== '' || s.label !== '');
}

export default function ProductTestimonialsAndStatsSection({
  productId,
  initialSelectedTestimonials,
  initialTestimonialStats,
}: {
  productId: number;
  initialSelectedTestimonials: SelectedTestimonial[];
  initialTestimonialStats?: any;
}) {
  const [selected, setSelected] = useState<SelectedTestimonial[]>(
    [...initialSelectedTestimonials].sort((a, b) => a.sortOrder - b.sortOrder)
  );

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const selectedIds = useMemo(() => selected.map((t) => t.id), [selected]);

  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const initialNormalizedStats = normalizeStats(initialTestimonialStats).slice(0, 4);
  const [stats, setStats] = useState<{ value: string; label: string }[]>(initialNormalizedStats);
  const [isSavingStats, setIsSavingStats] = useState(false);
  const canAddStat = stats.length < 4;
  const statsPreview = stats.slice(0, 4);

  const handleSaveStats = async () => {
    try {
      setIsSavingStats(true);
      const nextStats = stats
        .slice(0, 4)
        .map((s) => ({ value: s.value, label: s.label }))
        .filter((s) => s.value.trim().length > 0 || s.label.trim().length > 0);

      await updateProduct(productId, { testimonialStats: nextStats });
      toast.success('Testimonial stats saved successfully');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save testimonial stats');
    } finally {
      setIsSavingStats(false);
    }
  };

  const refreshSelected = async () => {
    const rows = await getProductTestimonials(String(productId));
    const mapped: SelectedTestimonial[] = rows
      .slice()
      .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((r: any) => ({
        id: String(r.testimonial.id),
        sortOrder: r.sortOrder ?? 0,
        client_image: r.testimonial.client_image,
        client_name: r.testimonial.client_name,
        client_title: r.testimonial.client_title,
        client_company: r.testimonial.client_company,
        rating: r.testimonial.rating ?? 5,
        content: r.testimonial.content,
        showOnPages: Array.isArray(r.testimonial.showOnPages) ? r.testimonial.showOnPages : [],
      }));
    setSelected(mapped);
  };

  const handleRemove = async (testimonialId: string) => {
    try {
      await removeTestimonialFromProduct(String(productId), testimonialId);
      await refreshSelected();
      toast.success('Testimonial removed');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to remove testimonial');
    }
  };

  const handleAdd = async (testimonialId: string) => {
    try {
      await addTestimonialToProduct(String(productId), testimonialId);
      await refreshSelected();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to add testimonial');
      throw e; // so picker confirm can stop
    }
  };

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, overIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === overIdx) return;
    setSelected((prev) => {
      const next = [...prev];
      const [item] = next.splice(draggedIdx, 1);
      next.splice(overIdx, 0, item);
      return next.map((t, i) => ({ ...t, sortOrder: i }));
    });
    setDraggedIdx(overIdx);
  };

  const handleDragEnd = async () => {
    if (draggedIdx === null) return;
    setDraggedIdx(null);

    setIsSavingOrder(true);
    try {
      const items = selected.map((t, idx) => ({
        testimonialId: t.id,
        sortOrder: idx,
      }));
      await updateProductTestimonialsOrder(String(productId), items);
      toast.success('Testimonial order updated');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save order');
      await refreshSelected();
    } finally {
      setIsSavingOrder(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Testimonials & Stats</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage product testimonials and their associated stats.</p>
      </div>

      {/* STATS */}
      <div className="bg-white border border-[#F3F4F6] rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Testimonial Stats</h2>
            <p className="text-sm text-gray-500 mt-0.5">Displayed at the bottom of the public Testimonials section.</p>
          </div>
          <button
            type="button"
            onClick={() => void handleSaveStats()}
            disabled={isSavingStats}
            className={[
              'px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700 transition-colors',
              isSavingStats ? 'opacity-70 cursor-not-allowed' : '',
            ].join(' ')}
          >
            {isSavingStats ? 'Saving...' : <span className="inline-flex items-center gap-2"><Save size={16} /> Save</span>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Current stats</h3>
              <button
                type="button"
                onClick={() => {
                  if (!canAddStat) return;
                  setStats((prev) => [...prev, { value: '', label: '' }]);
                }}
                disabled={!canAddStat}
                className={[
                  'px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
                  canAddStat
                    ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed',
                ].join(' ')}
              >
                <span className="inline-flex items-center gap-2">
                  <Plus size={16} /> Add Stat
                </span>
              </button>
            </div>

            <div className="space-y-4 mb-4">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-3 relative group transition"
                >
                  <button
                    type="button"
                    onClick={() => setStats((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors bg-white p-1 rounded-full shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100"
                    title="Delete stat"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                        Value (e.g. 500+)
                      </label>
                      <input
                        value={s.value}
                        onChange={(e) => {
                          const next = [...stats];
                          next[i] = { ...next[i], value: e.target.value };
                          setStats(next);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="500+"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                        Label
                      </label>
                      <input
                        value={s.label}
                        onChange={(e) => {
                          const next = [...stats];
                          next[i] = { ...next[i], label: e.target.value };
                          setStats(next);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Happy Clients"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {stats.length === 0 && (
              <div className="border-2 border-dashed border-gray-200 rounded-xl bg-white p-8 text-center">
                <p className="text-gray-700 font-semibold">No testimonial stats configured</p>
                <p className="text-sm text-gray-500 mt-1">
                  Click “Add Stat” to create up to 4 logic rows.
                </p>
              </div>
            )}

            {stats.length > 0 && stats.length < 4 && (
              <div className="border-t border-gray-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setStats((prev) => [...prev, { value: '', label: '' }])}
                  className="flex items-center justify-center w-full py-3 gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-medium border border-dashed border-indigo-200 rounded-lg transition-colors"
                  disabled={!canAddStat}
                >
                  <Plus size={16} /> Add Stat
                </button>
              </div>
            )}
          </div>

          {/* Dummy Live Preview (optional visual cue) */}
          <div>
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white p-6 shadow-sm flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="flex items-center justify-between w-full mb-8 border-b border-gray-100 pb-3">
                <p className="text-gray-900 font-bold">Public View Preview</p>
                <p className="text-gray-400 text-xs font-semibold">{stats.length}/4 limit</p>
              </div>
              <div className="grid grid-cols-2 gap-y-8 gap-x-8 w-full">
                {statsPreview.length > 0 ? statsPreview.map((stat, idx) => (
                  <div key={`${stat.value}-${idx}`} className="text-center flex flex-col items-center gap-2">
                    <div className="font-['Inter'] font-bold text-3xl leading-none bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(180deg, #E96429 0%, #2251B5 100%)"}}>
                      {stat.value || '—'}
                    </div>
                    <div className="font-['Inter'] font-medium text-sm text-[#4A5565]">
                      {stat.label || ' '}
                    </div>
                  </div>
                )) : (
                  <div className="col-span-2 text-center text-sm text-gray-400">
                    Will use default stats on public page.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="bg-white border border-[#F3F4F6] rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Product Testimonials</h2>
            <p className="text-sm text-gray-500 mt-0.5">Select up to 4 testimonials</p>
          </div>
          <TestimonialPicker
            productId={String(productId)}
            selectedIds={selectedIds}
            onAdd={handleAdd}
          />
        </div>

        {selected.length === 0 ? (
          <div className="h-52 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
            <p className="text-gray-700 font-semibold">No testimonials selected yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Use “Add Testimonial” to choose up to 4.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {selected.map((t, idx) => (
              <div
                key={t.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={() => void handleDragEnd()}
                className={[
                  'group flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm',
                  'hover:border-blue-200 transition-colors',
                  isSavingOrder ? 'opacity-70' : '',
                ].join(' ')}
              >
                <div className="pt-1 cursor-grab text-gray-400 opacity-0 group-hover:opacity-100 select-none">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 border border-gray-100 font-semibold">
                    #{idx + 1}
                  </span>
                </div>

                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.client_image || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                    alt={t.client_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 truncate">
                          {t.client_name}
                        </h3>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {t.client_title || '—'}
                        {t.client_company ? ` · ${t.client_company}` : ''}
                      </div>
                      <div className="mt-2">
                        <RatingStars rating={t.rating} />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleRemove(t.id)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {t.content ? String(t.content) : '—'}
                    </p>
                  </div>

                  <div className="mt-3">
                    <PageBadges pages={t.showOnPages} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
