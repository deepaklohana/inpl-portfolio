'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Search, X, Star, Settings, Package, Home, Users, Mail } from 'lucide-react';
import Image from 'next/image';
import { getPublishedTestimonialsForPicker } from '@/lib/actions/testimonials';

type PickerTestimonial = {
  id: string;
  client_name: string;
  client_title: string | null;
  client_company: string | null;
  client_image: string | null;
  rating: number;
  content: string;
  showOnPages: string[];
  products: { id: number; name: string }[];
};

const PAGE_BADGE_STYLES: Record<
  string,
  { label: string; pillClass: string }
> = {
  services: {
    label: 'Services',
    pillClass: 'bg-[#E96429]/10 text-[#E96429] border-[#E96429]/20',
  },
  products: {
    label: 'Products',
    pillClass: 'bg-[#2251B5]/10 text-[#2251B5] border-[#2251B5]/20',
  },
  home: { label: 'Home', pillClass: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
  about: { label: 'About', pillClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  contact: { label: 'Contact', pillClass: 'bg-sky-500/10 text-sky-600 border-sky-500/20' },
};

const PAGE_ICON: Record<string, any> = {
  services: Settings,
  products: Package,
  home: Home,
  about: Users,
  contact: Mail,
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
  if (!pages?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {pages.map((p) => {
        const normalized = String(p).toLowerCase();
        const meta = PAGE_BADGE_STYLES[normalized] ?? {
          label: normalized,
          pillClass: 'bg-gray-100 text-gray-600 border-gray-200',
        };
        return (
          <span
            key={normalized}
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${meta.pillClass}`}
          >
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}

export default function TestimonialPicker({
  productId,
  selectedIds,
  onAdd,
}: {
  productId: string;
  selectedIds: string[];
  onAdd: (testimonialId: string) => Promise<void> | void;
  // kept for compatibility with your requested props signature
  onRemove?: (testimonialId: string) => Promise<void> | void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [testimonials, setTestimonials] = useState<PickerTestimonial[]>([]);
  const [pending, setPending] = useState<string[]>([]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedCount = selectedIds.length + pending.length;
  const canAddMore = selectedIds.length + pending.length < 4;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return testimonials;
    return testimonials.filter((t) => {
      return (
        String(t.client_name ?? '').toLowerCase().includes(q) ||
        String(t.client_company ?? '').toLowerCase().includes(q)
      );
    });
  }, [testimonials, search]);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        setLoading(true);
        const rows = await getPublishedTestimonialsForPicker();
        setTestimonials(rows as any);
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen]);

  const togglePending = (id: string) => {
    if (selectedSet.has(id)) return;
    if (!pending.includes(id) && !canAddMore) return;
    setPending((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleConfirm = async () => {
    if (pending.length === 0) {
      setIsOpen(false);
      return;
    }

    // Add sequentially to preserve deterministic sortOrder assignment.
    for (const id of pending) {
      await onAdd(id);
    }
    setPending([]);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm text-sm font-medium"
      >
        Add Testimonial
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden my-auto border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#F9FAFB]/70">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-gray-900">Select up to 4 testimonials</h2>
                <p className="text-sm text-gray-500">
                  Max 4 per product. Currently selected: {selectedIds.length}/4
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setPending([]);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                <div className="relative flex-1 md:max-w-lg">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or company..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600 font-medium">
                    Selected in picker: {pending.length}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-sm text-gray-600">Loading testimonials...</div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">No testimonials found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((t) => {
                    const alreadySelected = selectedSet.has(t.id);
                    const willBeSelected = pending.includes(t.id);
                    const disabled = alreadySelected || (!willBeSelected && !canAddMore);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => togglePending(t.id)}
                        disabled={disabled}
                        className={[
                          'text-left bg-white border rounded-2xl p-4 shadow-sm hover:shadow transition-all',
                          'transition-colors duration-200',
                          alreadySelected
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-80'
                            : willBeSelected
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300',
                        ].join(' ')}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={t.client_image || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                              alt={t.client_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-bold text-gray-900 truncate">{t.client_name}</p>
                              {alreadySelected ? (
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-50 border border-green-200">
                                  <Check className="h-4 w-4 text-green-700" />
                                </span>
                              ) : willBeSelected ? (
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 border border-blue-200">
                                  <Check className="h-4 w-4 text-blue-700" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 border border-gray-200">
                                  <span className="h-2 w-2 rounded-full bg-gray-300" />
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                              {t.client_title || '—'}
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-3">
                              <RatingStars rating={t.rating} />
                              <div className="text-xs font-semibold text-gray-600">{t.rating.toFixed(1)}</div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <PageBadges pages={t.showOnPages} />
                        </div>

                        {t.products?.length ? (
                          <div className="mt-3 text-xs text-gray-500 line-clamp-2">
                            Linked to: {t.products.map((p) => p.name).join(', ')}
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setPending([]);
                }}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirm()}
                disabled={pending.length === 0}
                className={[
                  'px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition',
                  pending.length === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700',
                ].join(' ')}
              >
                Confirm Add ({pending.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

