'use client'

import { useState, useEffect, useCallback } from 'react'
import { getProducts, deleteProduct, updateProduct } from '@/lib/actions/products'
import Link from 'next/link'
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  X,
  Loader2,
  Layers,
  Star,
  Eye,
  Settings,
  Code
} from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import ScrollReveal from '@/components/animations/ScrollReveal'
import { motion, AnimatePresence } from 'framer-motion'

type Product = {
  id: number
  name: string
  slug: string
  tagline: string | null
  status: string
  featured: boolean
  sortOrder: number
  _count: {
    modules: number
  }
  createdAt: Date
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null })
  const [rawData, setRawData] = useState<any | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getProducts()
      setProducts(data as any)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    setActionLoading(id)
    try {
      await updateProduct(id, { featured: !currentFeatured })
      await fetchProducts()
      toast.success(`Product ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`)
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    setActionLoading(id)
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    try {
      await updateProduct(id, { status: newStatus })
      await fetchProducts()
      toast.success(`Product status updated to ${newStatus}`)
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const requestDelete = (id: number) => {
    setConfirmDelete({ isOpen: true, id })
  }

  const handleDeleteProduct = async () => {
    const { id } = confirmDelete
    if (!id) return
    setConfirmDelete({ isOpen: false, id: null })
    setActionLoading(id)
    try {
      await deleteProduct(id)
      await fetchProducts()
      toast.success('Product deleted successfully')
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <Package className="w-7 h-7 text-blue-600" />
            Product Management
          </h1>
          <p className="text-gray-500 mt-2">Manage your product systems, modules, and features.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3">
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Products Table */}
      <ScrollReveal variant="fadeUp" className="bg-white border border-[#F3F4F6] rounded-2xl overflow-hidden shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F9FAFB]/80 text-gray-500 border-b border-[#F3F4F6]">
              <tr>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Product Info</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Slug</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-center">Modules</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-center">Featured</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-center">Status</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-base">{product.name}</span>
                      <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">{product.tagline || 'No tagline'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">/{product.slug}</code>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      <Layers className="w-3.5 h-3.5" />
                      {product._count.modules} Modules
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(product.id, product.featured)}
                      disabled={actionLoading === product.id}
                      className={`p-2 rounded-lg transition-colors ${product.featured ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-300 hover:text-gray-400 hover:bg-gray-100'}`}
                    >
                      <Star className={`w-5 h-5 ${product.featured ? 'fill-current' : ''}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(product.id, product.status)}
                      disabled={actionLoading === product.id}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                        product.status === 'published' 
                          ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 hover:bg-green-100' 
                          : 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20 hover:bg-yellow-100'
                      }`}
                    >
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setRawData(product)}
                        title="View Raw Data (JSON)"
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Code className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/products/${product.id}`}
                        title="Edit Product & Modules"
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        title="View Live"
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => requestDelete(product.id)}
                        disabled={actionLoading === product.id}
                        title="Delete Product"
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                    <p>No products found.</p>
                    <Link 
                      href="/admin/products/new" 
                      className="text-blue-600 hover:underline mt-2 inline-block font-medium"
                    >
                      Create your first product
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ScrollReveal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this product? This action cannot be undone and will delete all related modules and features."
        confirmText="Delete Product"
        cancelText="Cancel"
        onConfirm={handleDeleteProduct}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
      />

      {/* Raw Data Modal */}
      <AnimatePresence>
        {rawData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Product Raw Data: {rawData.name}</h3>
                  <p className="text-sm text-gray-500">All fields from the database for this product.</p>
                </div>
                <button onClick={() => setRawData(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto bg-gray-900 text-gray-100 font-mono text-sm">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(rawData, null, 2)}
                </pre>
              </div>
              <div className="p-6 border-t bg-gray-50 flex justify-end">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(rawData, null, 2))
                    toast.success('JSON copied to clipboard')
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                  Copy JSON
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
