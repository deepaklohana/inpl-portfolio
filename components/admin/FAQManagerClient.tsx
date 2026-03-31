'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, GripVertical, CheckCircle, Clock, X, Save } from 'lucide-react';
import { createFAQ, updateFAQ, deleteFAQ, toggleFAQStatus } from '@/lib/actions/faqs';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  status: 'published' | 'draft';
}

interface FAQManagerClientProps {
  initialFAQs: FAQItem[];
}

interface FAQFormState {
  question: string;
  answer: string;
  sortOrder: number;
  status: 'published' | 'draft';
}

const emptyForm: FAQFormState = {
  question: '',
  answer: '',
  sortOrder: 0,
  status: 'published',
};

export default function FAQManagerClient({ initialFAQs }: FAQManagerClientProps) {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FAQFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null; label: string }>({
    isOpen: false,
    id: null,
    label: '',
  });

  const openNewForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sortOrder: faqs.length });
    setShowForm(true);
    setExpandedId(null);
  };

  const openEditForm = (faq: FAQItem) => {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      sortOrder: faq.sortOrder,
      status: faq.status,
    });
    setShowForm(true);
    setExpandedId(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.question.trim()) { toast.error('Question is required'); return; }
    if (!form.answer.trim()) { toast.error('Answer is required'); return; }

    setSaving(true);
    try {
      if (editingId) {
        const result = await updateFAQ(editingId, form);
        if (result.success) {
          setFaqs(prev => prev.map(f => f.id === editingId ? { ...f, ...form } : f));
          toast.success('FAQ updated successfully!');
          closeForm();
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to update FAQ');
        }
      } else {
        const result = await createFAQ(form);
        if (result.success && result.id) {
          setFaqs(prev => [...prev, { id: String(result.id), ...form }]);
          toast.success('FAQ created successfully!');
          closeForm();
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to create FAQ');
        }
      }
    } catch {
      toast.error('An unexpected error occurred.');
    }
    setSaving(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const next = currentStatus === 'published' ? 'draft' : 'published';
    const result = await toggleFAQStatus(id, next as 'published' | 'draft');
    if (result.success) {
      setFaqs(prev => prev.map(f => f.id === id ? { ...f, status: next as 'published' | 'draft' } : f));
      toast.success('Status updated.');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to update status.');
    }
  };

  const requestDelete = (id: string, question: string) => {
    setConfirmDelete({ isOpen: true, id, label: question });
  };

  const handleDelete = async () => {
    const { id } = confirmDelete;
    if (!id) return;
    setConfirmDelete({ isOpen: false, id: null, label: '' });
    const result = await deleteFAQ(id);
    if (result.success) {
      setFaqs(prev => prev.filter(f => f.id !== id));
      toast.success('FAQ deleted.');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="mt-1 text-sm text-gray-500">Manage Frequently Asked Questions shown on the Contact Us page.</p>
        </div>
        <button
          onClick={openNewForm}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2251B5] text-white rounded-lg hover:bg-[#1a3f9a] shadow-sm text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add FAQ
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F9FAFB]">
            <h2 className="text-base font-semibold text-gray-900">
              {editingId ? 'Edit FAQ' : 'New FAQ'}
            </h2>
            <button onClick={closeForm} className="p-1 rounded-md hover:bg-gray-200 text-gray-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.question}
                onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                placeholder="e.g. What are your business hours?"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2251B5]/30 focus:border-[#2251B5] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Answer <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.answer}
                onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                rows={4}
                placeholder="Provide a clear and helpful answer..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2251B5]/30 focus:border-[#2251B5] transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                  min={0}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2251B5]/30 focus:border-[#2251B5] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as 'published' | 'draft' }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2251B5]/30 focus:border-[#2251B5] transition-colors bg-white"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closeForm}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#2251B5] text-white rounded-lg text-sm font-medium hover:bg-[#1a3f9a] disabled:opacity-60 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : editingId ? 'Update FAQ' : 'Create FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Table */}
      {faqs.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
          <div className="mx-auto w-14 h-14 bg-[#2251B5]/10 rounded-2xl flex items-center justify-center mb-4">
            <Plus className="w-7 h-7 text-[#2251B5]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs yet</h3>
          <p className="text-gray-500 mb-6 text-sm">Add your first FAQ to display on the Contact Us page.</p>
          <button
            onClick={openNewForm}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2251B5] text-white rounded-lg text-sm font-medium hover:bg-[#1a3f9a] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add First FAQ
          </button>
        </div>
      ) : faqs.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#F3F4F6]">
              <thead className="bg-[#F9FAFB]/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-8">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Answer Preview</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#F3F4F6]">
                {faqs.map((faq, idx) => (
                  <tr key={faq.id} className="hover:bg-[#2251B5]/2 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-sm text-gray-900 line-clamp-2">{faq.question}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 line-clamp-2 max-w-sm">{faq.answer}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{faq.sortOrder}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(faq.id, faq.status)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          faq.status === 'published'
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                        }`}
                      >
                        {faq.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {faq.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditForm(faq)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => requestDelete(faq.id, faq.question)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Delete FAQ"
        description={`Are you sure you want to delete this FAQ? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null, label: '' })}
      />
    </div>
  );
}
