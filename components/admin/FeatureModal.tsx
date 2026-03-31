'use client';

import { X } from 'lucide-react';
import IconPicker from './IconPicker';

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingFeature: any;
  featureForm: {
    name: string;
    shortDescription: string;
    icon: string;
    sortOrder: number;
    status: string;
  };
  setFeatureForm: React.Dispatch<React.SetStateAction<{
    name: string;
    shortDescription: string;
    icon: string;
    sortOrder: number;
    status: string;
  }>>;
  position?: 'fixed' | 'absolute';
}

export default function FeatureModal({
  isOpen,
  onClose,
  onSave,
  editingFeature,
  featureForm,
  setFeatureForm,
  position = 'fixed',
}: FeatureModalProps) {
  if (!isOpen) return null;

  const overlayPositionClass = position === 'absolute' ? 'absolute inset-0 z-50' : 'fixed inset-0 z-50';
  const modalPositionClass = position === 'absolute' ? 'relative' : 'absolute bottom-12';

  return (
    <div className={`${overlayPositionClass} bg-gray-900/10 backdrop-blur-sm flex items-center justify-center p-4 sm:p-0`}>
      <div className={`bg-white rounded-2xl shadow-xl w-full max-w-[520px] overflow-hidden flex flex-col ${modalPositionClass} border border-gray-100 max-h-[90vh]`}>
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#F9FAFB]/80">
          <h2 className="text-lg font-bold text-gray-900">
            {editingFeature ? 'Edit Feature' : 'Add Feature'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-md"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-white">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Feature Name *</label>
            <input
              type="text"
              value={featureForm.name}
              onChange={e => setFeatureForm(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="e.g. Automated Payroll"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Icon</label>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <IconPicker 
                value={featureForm.icon} 
                onChange={val => setFeatureForm(p => ({ ...p, icon: val }))} 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description</label>
            <textarea
              value={featureForm.shortDescription}
              onChange={e => setFeatureForm(p => ({ ...p, shortDescription: e.target.value }))}
              rows={3}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm"
              placeholder="One or two lines explaining this feature..."
            />
          </div>
        </div>
        
        <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
          >
            {editingFeature ? 'Save Changes' : 'Add Feature'}
          </button>
        </div>
      </div>
    </div>
  );
}
