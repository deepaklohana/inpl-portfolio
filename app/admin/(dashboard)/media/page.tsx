'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Search,
  Upload,
  Trash2,
  Copy,
  Check,
  Loader2,
  ImagePlus,
  X,
} from 'lucide-react';
import { getMediaList, uploadToStorage, deleteFromStorage } from '@/lib/storage';
import type { Media } from '@/lib/storage';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import ScrollReveal from '@/components/animations/ScrollReveal';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDraggingPage, setIsDraggingPage] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Media | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMediaList();
      setMedia(data);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Page-level drag-and-drop
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current++;
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDraggingPage(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDraggingPage(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDraggingPage(false);
      const file = e.dataTransfer?.files[0];
      if (file) {
        handleUpload(file);
      }
    };

    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(10);
      const interval = setInterval(() => {
        setUploadProgress((p) => (p >= 90 ? 90 : p + 10));
      }, 150);

      await uploadToStorage(file, 'general');
      clearInterval(interval);
      setUploadProgress(100);

      await fetchMedia();
      toast.success('Upload successful.');
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      console.error('Failed to copy URL');
    }
  };

  const requestDelete = (item: Media) => {
    setConfirmDelete(item);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const item = confirmDelete;
    setConfirmDelete(null);
    try {
      setDeletingId(item.id);
      await deleteFromStorage(item.filename, item.id);
      setMedia((prev) => prev.filter((m) => m.id !== item.id));
      toast.success('Successfully deleted.');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = media.filter((m) =>
    m.original_name.toLowerCase().includes(search.toLowerCase()) ||
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollReveal variant="fadeUp" className="space-y-6 relative">
      {/* Upload progress overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 min-w-[320px]">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <p className="text-gray-800 font-semibold text-lg">Uploading...</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{uploadProgress}%</p>
          </div>
        </div>
      )}

      {/* Page-level drag overlay */}
      {isDraggingPage && !isUploading && (
        <div className="fixed inset-0 z-50 bg-[#2251B5]/10 backdrop-blur-[2px] flex items-center justify-center pointer-events-none transition-all duration-300">
          <div className="bg-white rounded-2xl p-12 shadow-[0px_0px_50px_rgba(34,81,181,0.2)] border-2 border-dashed border-[#2251B5] flex flex-col items-center gap-4 transform scale-105 transition-transform duration-300">
            <Upload className="h-16 w-16 text-[#2251B5] animate-bounce" />
            <p className="text-xl font-semibold text-gray-800">Drop file to upload</p>
            <p className="text-sm text-gray-500">Release to start uploading</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your uploaded files. {media.length > 0 && `${media.length} file${media.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Upload className="-ml-1 mr-2 h-5 w-5" /> Upload File
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*,application/pdf"
          className="hidden"
        />
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by filename..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-[#F3F4F6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2251B5] focus:border-transparent bg-white shadow-[0px_4px_10px_rgba(0,0,0,0.03)] transition-all duration-200"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      ) : filtered.length === 0 && media.length === 0 ? (
        /* Empty state */
        <div
          className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#E5E7EB] rounded-2xl cursor-pointer hover:border-[#2251B5] hover:bg-[#2251B5]/5 transition-all duration-300"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="bg-blue-50 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
            <ImagePlus className="h-10 w-10 text-blue-600" />
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-1">No media yet</p>
          <p className="text-sm text-gray-500 mb-4">
            Upload your first file or drag and drop anywhere on this page
          </p>
          <span className="text-sm font-medium text-blue-600">Click to upload</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">No files match &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        /* Media grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-[#F3F4F6] rounded-2xl overflow-hidden shadow-[0px_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0px_10px_25px_-5px_rgba(34,81,181,0.15)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image preview */}
              <div className="relative aspect-square bg-gray-100">
                {item.mime_type.startsWith('image/') ? (
                  <Image
                    src={item.url}
                    alt={item.original_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImagePlus className="h-12 w-12 text-gray-300" />
                  </div>
                )}

                {/* Delete overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-start justify-end p-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => requestDelete(item)}
                    disabled={deletingId === item.id}
                    className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg shadow-md transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 space-y-2">
                <p className="text-sm font-medium text-gray-800 truncate" title={item.original_name}>
                  {item.original_name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {formatFileSize(item.size_bytes)}
                  </span>
                  <button
                    onClick={() => handleCopy(item.url, item.id)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-green-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete "${confirmDelete?.original_name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </ScrollReveal>
  );
}
