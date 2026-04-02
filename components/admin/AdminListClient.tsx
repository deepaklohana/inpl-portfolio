'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, FileText, CheckCircle, Clock, Star } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import PublishButton from '@/components/admin/PublishButton';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import ScrollReveal from '@/components/animations/ScrollReveal';
import DynamicIcon from '@/components/ui/DynamicIcon';

// Import all server actions directly — this is safe because they are 'use server' functions
import { deleteProject, toggleProjectStatus } from '@/lib/actions/projects';
import { deleteService, toggleServiceStatus } from '@/lib/actions/services';
import { deleteEvent, toggleEventStatus } from '@/lib/actions/events';
import { deleteTestimonial, toggleTestimonialStatus } from '@/lib/actions/testimonials';
import { deleteNews, toggleNewsStatus } from '@/lib/actions/news';

export type ColumnType = 'text' | 'date' | 'datetime' | 'icon' | 'client_info' | 'rating' | 'event_location' | 'pages';

interface Column {
  key: string;
  label: string;
  type?: ColumnType;
}

interface AdminListClientProps {
  items: any[];
  section: string;
  columns: Column[];
  hasStatus?: boolean;
}

// Map section name to the correct server actions
function getActions(section: string) {
  switch (section) {
    case 'projects':
      return { deleteFn: deleteProject, toggleFn: toggleProjectStatus };
    case 'services':
      return { deleteFn: deleteService, toggleFn: toggleServiceStatus };
    case 'events':
      return { deleteFn: deleteEvent, toggleFn: toggleEventStatus };
    case 'testimonials':
      return { deleteFn: deleteTestimonial, toggleFn: toggleTestimonialStatus };
    case 'news':
      return { deleteFn: deleteNews, toggleFn: toggleNewsStatus };
    default:
      throw new Error(`Unknown section: ${section}`);
  }
}

export default function AdminListClient({ items, section, columns, hasStatus = true }: AdminListClientProps) {
  const [rows, setRows] = useState(items);

  useEffect(() => {
    setRows(items);
  }, [items]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null; label: string }>({ isOpen: false, id: null, label: '' });
  const router = useRouter();
  
  const { deleteFn, toggleFn } = getActions(section);

  const requestDelete = (id: string, label: string) => {
    setConfirmDelete({ isOpen: true, id, label });
  };

  const handleDelete = async () => {
    const { id } = confirmDelete;
    if (!id) return;
    setConfirmDelete({ isOpen: false, id: null, label: '' });
    setDeleting(id);
    try {
      const result = await deleteFn(id);
      if (result.success) {
        setRows(prev => prev.filter(r => r.id !== id));
        toast.success('Successfully deleted.');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete.');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    }
    setDeleting(null);
  };

  const handleToggle = async (id: string, currentStatus: string) => {
    const next = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const result = await toggleFn(id, next as any);
      if (result.success) {
        setRows(prev => prev.map(r => r.id === id ? { ...r, status: next } : r));
        toast.success('Status updated.');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update status.');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    }
  };

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
        <p className="text-gray-500 mb-6">Get started by creating your first entry.</p>
        <Link href={`/admin/${section}/new`} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
          Create New
        </Link>
      </div>
    );
  }

  const renderCell = (row: any, col: Column) => {
    const val = row[col.key];
    
    switch (col.type) {
      case 'date':
        return val ? new Date(val).toLocaleDateString() : '—';
      case 'datetime':
        return val ? new Date(val).toLocaleString() : '—';
      case 'icon': {
        return <DynamicIcon name={val} className="h-5 w-5 text-gray-600" />;
      }
      case 'client_info':
        return (
          <div>
            <p className="font-medium">{row.clientName ?? row.client_name}</p>
            <p className="text-xs text-gray-500">
              {[row.clientTitle ?? row.client_title, row.clientCompany ?? row.client_company].filter(Boolean).join(' @ ')}
            </p>
          </div>
        );
      case 'rating':
        return (
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} size={14} className={n <= val ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
            ))}
          </div>
        );
      case 'event_location':
        return row.is_online ? '🌐 Online' : (row.location || '—');
      case 'pages': {
        const pages: string[] = Array.isArray(val) ? val : [];
        if (pages.length === 0) return '—';

        const getPill = (page: string) => {
          const normalized = String(page).toLowerCase();
          const labelMap: Record<string, string> = {
            services: 'Services',
            products: 'Products',
            home: 'Home',
            about: 'About',
            contact: 'Contact',
            project: 'Project',
          };

          const label = labelMap[normalized] ?? normalized;

          const styleMap: Record<string, string> = {
            services: 'bg-[#E96429]/10 text-[#E96429] border-[#E96429]/20',
            products: 'bg-[#2251B5]/10 text-[#2251B5] border-[#2251B5]/20',
            home: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
            about: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
            contact: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
            project: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
          };

          const className = styleMap[normalized] ?? 'bg-gray-100 text-gray-600 border-gray-200';
          return (
            <span
              key={normalized}
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${className}`}
            >
              {label}
            </span>
          );
        };

        return <div className="flex flex-wrap gap-2">{pages.map(getPill)}</div>;
      }
      default:
        if (col.key === 'title') return <span className="font-medium">{val}</span>;
        if (col.key === 'content') return <span className="text-gray-500 line-clamp-1 max-w-xs">{val}</span>;
        return val ?? '—';
    }
  };

  return (
    <ScrollReveal variant="fadeUp" className="bg-white rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#F3F4F6]">
          <thead className="bg-[#F9FAFB]/80">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.label}</th>
              ))}
              {hasStatus && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#F3F4F6]">
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-[#2251B5]/5 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                    {renderCell(row, col)}
                  </td>
                ))}
                {hasStatus && (
                  <td className="px-6 py-4">
                    {section === 'testimonials' ? (
                      <button
                        onClick={() => handleToggle(row.id, row.status)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border transition-colors
                          ${row.status === 'published' ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                            : row.status === 'draft' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'}`}
                      >
                        {row.status === 'published' ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                        {row.status}
                      </button>
                    ) : (
                      <PublishButton
                        id={row.id}
                        slug={row.slug}
                        currentStatus={row.status}
                        contentType={section as any}
                        publishedAt={row.published_at}
                        onSuccess={(newStatus) => {
                          setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: newStatus } : r));
                        }}
                      />
                    )}
                  </td>
                )}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/${section}/${row.id}/edit`} className="text-blue-600 hover:text-blue-900 p-1" title="Edit">
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => requestDelete(row.id, row.title || row.client_name || row.id)}
                      disabled={deleting === row.id}
                      className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Confirm Deletion"
        description={`Are you sure you want to delete "${confirmDelete.label}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null, label: '' })}
      />
    </ScrollReveal>
  );
}
