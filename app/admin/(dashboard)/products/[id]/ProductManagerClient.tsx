'use client';

import { useState } from 'react';
import { GripVertical, Plus, Edit2, Trash2, X, Save, Layers, Puzzle } from 'lucide-react';
import { toast } from 'sonner';
import IconPicker from '@/components/admin/IconPicker';
import FeatureModal from '@/components/admin/FeatureModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { createModule, updateModule, deleteModule, updateModulesOrder } from '@/lib/actions/productModules';
import { createFeature, updateFeature, deleteFeature } from '@/lib/actions/moduleFeatures';
import { icons } from 'lucide-react';

function getUserFriendlyErrorMessage(err: unknown) {
  const rawMessage =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : typeof (err as { message?: unknown } | null | undefined)?.message === 'string'
          ? String((err as { message?: unknown } | null | undefined)?.message)
          : ''
  const lower = rawMessage.toLowerCase()

  if (
    lower.includes('connection pool') ||
    lower.includes('timed out fetching a new connection') ||
    lower.includes('timed out fetching') ||
    lower.includes('server is busy right now') ||
    lower.includes('server is busy') ||
    lower.includes('please try again in a few seconds')
  ) {
    return 'Server is busy right now. Please try again in a few seconds.'
  }

  // Keep UX simple for unexpected DB errors too.
  return 'Operation failed. Please try again in a few moments.'
}

export default function ProductManagerClient({ product }: { product: any }) {
  const [modules, setModules] = useState<any[]>(product.modules || []);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(modules[0]?.id ?? null);
  const [draggedModuleIdx, setDraggedModuleIdx] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<null | { type: 'module' | 'feature'; id: number; name: string }>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Feature Modal State
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [featureForm, setFeatureForm] = useState({ name: '', shortDescription: '', icon: '', sortOrder: 0, status: 'published' });

  // Inline Module Form State
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [moduleForm, setModuleForm] = useState({ name: '', slug: '', shortCode: '', description: '', status: 'published' });

  const activeModule = modules.find(m => m.id === activeModuleId);

  // Auto-generate slug from name
  const handleModuleNameChange = (name: string) => {
    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setModuleForm(p => ({ ...p, name, slug: p.slug === '' || p.slug === moduleForm.slug ? autoSlug : p.slug }));
  };

  // --- MODULE ACTIONS ---
  const handleSaveModule = async () => {
    if (!moduleForm.name.trim()) return toast.error('Module name is required');
    try {
      if (editingModuleId) {
        const res = await updateModule(editingModuleId, moduleForm);
        setModules(prev => prev.map(m => m.id === editingModuleId ? { ...m, ...res.module } : m));
        toast.success('Module updated');
        setEditingModuleId(null);
      } else {
        const res = await createModule(product.id, { ...moduleForm, sortOrder: modules.length });
        setModules(prev => [...prev, res.module]);
        setActiveModuleId(res.module.id);
        toast.success('Module created');
        setIsAddingModule(false);
      }
      setModuleForm({ name: '', slug: '', shortCode: '', description: '', status: 'published' });
    } catch (e: any) {
      toast.error(getUserFriendlyErrorMessage(e));
    }
  };

  const handleDeleteModule = (id: number, name: string) => {
    setDeleteTarget({ type: 'module', id, name });
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'module') {
        const id = deleteTarget.id;
        await deleteModule(id);
        setModules(prev => prev.filter(m => m.id !== id));
        if (activeModuleId === id) setActiveModuleId(modules.find(m => m.id !== id)?.id || null);
        toast.success('Module deleted');
      }

      if (deleteTarget.type === 'feature') {
        const id = deleteTarget.id;
        await deleteFeature(id);
        setModules(prev => prev.map(m => m.id === activeModuleId
          ? { ...m, features: m.features.filter((f: any) => f.id !== id) }
          : m));
        toast.success('Feature deleted');
      }
    } catch (e: any) {
      toast.error(getUserFriendlyErrorMessage(e));
    } finally {
      setIsDeleteConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  // --- DRAG AND DROP ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedModuleIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { if (e.target instanceof HTMLElement) e.target.classList.add('opacity-50'); }, 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedModuleIdx === null || draggedModuleIdx === index) return;
    const newModules = [...modules];
    const dragged = newModules[draggedModuleIdx];
    newModules.splice(draggedModuleIdx, 1);
    newModules.splice(index, 0, dragged);
    setDraggedModuleIdx(index);
    setModules(newModules);
  };

  const handleDragEnd = async (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) e.target.classList.remove('opacity-50');
    setDraggedModuleIdx(null);
    const updates = modules.map((m, idx) => ({ id: m.id, sortOrder: idx }));
    try { await updateModulesOrder(updates); } catch { toast.error('Failed to save order'); }
  };

  // --- FEATURE ACTIONS ---
  const handleOpenFeatureModal = (feature?: any) => {
    if (feature) {
      setEditingFeature(feature);
      setFeatureForm({ name: feature.name, shortDescription: feature.shortDescription || '', icon: feature.icon || '', sortOrder: feature.sortOrder, status: feature.status });
    } else {
      setEditingFeature(null);
      setFeatureForm({ name: '', shortDescription: '', icon: '', sortOrder: activeModule?.features?.length || 0, status: 'published' });
    }
    setIsFeatureModalOpen(true);
  };

  const handleSaveFeature = async () => {
    if (!activeModuleId) return;
    if (!featureForm.name.trim()) return toast.error('Feature name required');
    try {
      if (editingFeature) {
        const res = await updateFeature(editingFeature.id, featureForm);
        setModules(prev => prev.map(m => m.id === activeModuleId
          ? { ...m, features: m.features.map((f: any) => f.id === editingFeature.id ? { ...f, ...res.feature } : f) }
          : m));
        toast.success('Feature updated');
      } else {
        const res = await createFeature(activeModuleId, featureForm);
        setModules(prev => prev.map(m => m.id === activeModuleId
          ? { ...m, features: [...(m.features || []), res.feature] }
          : m));
        toast.success('Feature added');
      }
      setIsFeatureModalOpen(false);
    } catch (e: any) {
      toast.error(getUserFriendlyErrorMessage(e));
    }
  };

  const handleDeleteFeature = (id: number, name: string) => {
    setDeleteTarget({ type: 'feature', id, name });
    setIsDeleteConfirmOpen(true);
  };

  const renderIcon = (iconName: string, config: { size?: number; className?: string } = {}) => {
    const Icon = iconName && iconName in icons ? icons[iconName as keyof typeof icons] : Puzzle;
    return <Icon size={config.size || 20} className={config.className || 'text-gray-500'} />;
  };

  return (
    <div className="relative flex h-full rounded-2xl border border-[#F3F4F6] overflow-hidden bg-white shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)]">
      
      {/* LEFT COLUMN: MODULES */}
      <div className="w-[35%] min-w-[300px] max-w-[380px] border-r border-gray-200 flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Layers className="text-blue-500 w-5 h-5" />
            Modules
          </h2>
          <button
            onClick={() => { setIsAddingModule(true); setEditingModuleId(null); setModuleForm({ name: '', slug: '', shortCode: '', description: '', status: 'published' }); }}
            className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors shadow-sm border border-blue-100"
            title="Add Module"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {/* Inline Add/Edit Module Form */}
          {(isAddingModule || editingModuleId) && (
            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-[0_4px_14px_rgba(59,130,246,0.1)] mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">{editingModuleId ? 'Edit Module' : 'New Module'}</h3>
                <button onClick={() => { setIsAddingModule(false); setEditingModuleId(null); }} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                  <input
                    type="text" placeholder="e.g. Human Resource"
                    value={moduleForm.name}
                    onChange={e => handleModuleNameChange(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Short Code</label>
                    <input
                      type="text" placeholder="e.g. HRM"
                      value={moduleForm.shortCode}
                      onChange={e => setModuleForm(p => ({ ...p, shortCode: e.target.value }))}
                      className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Slug (anchor)</label>
                    <input
                      type="text" placeholder="e.g. hrm"
                      value={moduleForm.slug}
                      onChange={e => setModuleForm(p => ({ ...p, slug: e.target.value }))}
                      className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea
                    placeholder="Brief module overview..." rows={2}
                    value={moduleForm.description}
                    onChange={e => setModuleForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <button
                  onClick={handleSaveModule}
                  className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Save size={16} /> Save Module
                </button>
              </div>
            </div>
          )}

          {/* Module List */}
          {modules.map((mod, idx) => (
            <div
              key={mod.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`group flex items-center p-3 rounded-xl border transition-all cursor-pointer ${
                activeModuleId === mod.id
                  ? 'bg-white border-blue-200 shadow-[0px_4px_12px_rgba(59,130,246,0.08)]'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }`}
              onClick={() => setActiveModuleId(mod.id)}
            >
              <div className="cursor-grab p-1 text-gray-400 -ml-1 mr-2 opacity-50 group-hover:opacity-100">
                <GripVertical size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`font-semibold truncate text-sm ${activeModuleId === mod.id ? 'text-blue-900' : 'text-gray-800'}`}>{mod.name}</h4>
                  {mod.shortCode && (
                    <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded">{mod.shortCode}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{mod.features?.length || 0} features{mod.slug ? ` · #${mod.slug}` : ''}</p>
              </div>
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingModuleId(mod.id); setModuleForm({ name: mod.name, slug: mod.slug || '', shortCode: mod.shortCode || '', description: mod.description || '', status: mod.status }); }}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                ><Edit2 size={14} /></button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteModule(mod.id, mod.name); }}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                ><Trash2 size={14} /></button>
              </div>
            </div>
          ))}

          {modules.length === 0 && !isAddingModule && (
            <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-white">
              <p className="text-gray-500 text-sm mb-4">No modules yet. Create one to get started.</p>
              <button onClick={() => setIsAddingModule(true)} className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition border border-blue-100">
                Add First Module
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: FEATURES */}
      <div className="flex-1 flex flex-col bg-white">
        {activeModule ? (
          <>
            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 z-10 bg-white shadow-sm">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">{activeModule.name}</h2>
                  {activeModule.shortCode && (
                    <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-md">{activeModule.shortCode}</span>
                  )}
                  {activeModule.slug && (
                    <span className="text-xs text-gray-400 font-mono">#{activeModule.slug}</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-1 max-w-xl">{activeModule.description || 'No description.'}</p>
              </div>
              <button
                onClick={() => handleOpenFeatureModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm text-sm font-medium"
              >
                <Plus size={16} /> Add Feature
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Features / Sub-Modules</h3>
              {activeModule.features?.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {activeModule.features.map((feat: any) => (
                    <div key={feat.id} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all group flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-100">
                          {renderIcon(feat.icon, { size: 20, className: 'inherit' })}
                        </div>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm border border-gray-100 rounded-lg">
                          <button onClick={() => handleOpenFeatureModal(feat)} className="p-2 text-gray-400 hover:text-blue-600 transition border-r border-gray-100"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteFeature(feat.id, feat.name)} className="p-2 text-gray-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 text-[15px] mb-1">{feat.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{feat.shortDescription || 'No description.'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-white max-w-2xl mx-auto mt-8">
                  <div className="bg-gray-50 p-4 rounded-full mb-4 text-gray-400"><Puzzle size={32} /></div>
                  <p className="text-gray-900 font-semibold text-lg">No Features Yet</p>
                  <p className="text-gray-500 text-sm mb-6 mt-1 max-w-sm text-center">Add features/sub-modules to this module.</p>
                  <button onClick={() => handleOpenFeatureModal()} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium text-sm flex items-center gap-2">
                    <Plus size={18} /> Add First Feature
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
            <Layers size={64} className="mb-6 text-gray-300 stroke-[1.5]" />
            <p className="text-xl font-medium text-gray-600">No Module Selected</p>
            <p className="text-sm mt-2 text-gray-500 text-center max-w-md">Select a module from the left to view and manage its features.</p>
          </div>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="Delete confirmation"
        description={
          deleteTarget?.type === 'module'
            ? `Are you sure you want to delete module "${deleteTarget.name}"?`
            : `Delete feature "${deleteTarget?.name ?? ''}"?`
        }
        confirmText="Delete"
        cancelText="Cancel"
        position="absolute"
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={() => {
          void handleConfirmDelete();
        }}
      />

      {/* FEATURE MODAL */}
      <FeatureModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        onSave={handleSaveFeature}
        editingFeature={editingFeature}
        featureForm={featureForm}
        setFeatureForm={setFeatureForm}
        position="absolute"
      />
    </div>
  );
}
