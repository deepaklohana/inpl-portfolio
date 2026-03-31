'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit2, Layers, Settings, Trash2, ImageIcon } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { deleteProduct } from '@/lib/actions/products';
import { toast } from 'sonner';

interface ProductCardProps {
  product: { id: string; name: string; tagline: string | null; status: string; _count: { modules: number }; };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteProduct(product.id);
      toast.success('Product deleted successfully');
      setShowConfirm(false);
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)] border border-[#F3F4F6] overflow-hidden flex flex-col transition-all hover:shadow-[0px_10px_25px_-4px_rgba(0,0,0,0.08)]">
        {/* Status Badge Area */}
        <div className="bg-gray-50 border-b border-gray-100 p-4 shrink-0 flex items-center justify-between">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm border inline-flex ${product.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
              {product.status === 'published' ? 'Published' : 'Draft'}
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white text-gray-700 shadow-sm border border-gray-200 flex items-center gap-1">
              <Layers size={12} className="text-blue-500" />
              {product._count.modules} Modules
            </span>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 truncate" title={product.name}>{product.name}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-10" title={product.tagline || ''}>
            {product.tagline || 'No tagline provided'}
          </p>
          
          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 mt-auto">
            <Link 
              href={`/admin/products/${product.id}`}
              className="col-span-2 flex items-center justify-center gap-2 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors border border-blue-100"
            >
              <Settings size={16} />
              Manage Modules
            </Link>
            
            <Link 
              href={`/admin/products/${product.id}/edit`}
              className="flex items-center justify-center gap-2 w-full py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200 shadow-sm"
            >
              <Edit2 size={16} />
              Edit
            </Link>
            
            <button 
              onClick={() => setShowConfirm(true)}
              className="flex items-center justify-center gap-2 w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors border border-red-100"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${product.name}"? This action cannot be undone and will permanently delete all related modules and features.`}
        confirmText={isDeleting ? "Deleting..." : "Delete Product"}
      />
    </>
  );
}
