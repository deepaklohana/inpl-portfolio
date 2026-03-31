'use client';

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import Image from 'next/image';
import {
  X,
  Search,
  Upload,
  Loader2,
  ImagePlus,
  Check,
} from 'lucide-react';
import { getMediaList, uploadToStorage } from '@/lib/storage';
import type { Media } from '@/lib/storage';
import { toast } from 'sonner';

interface MediaPickerProps {
  onSelect: (url: string) => void;
  trigger: ReactNode;
}

export default function MediaPicker({ onSelect, trigger }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'library' | 'upload'>('library');
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

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
    if (isOpen) {
      fetchMedia();
      setSearch('');
      setTab('library');
    }
  }, [isOpen, fetchMedia]);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(10);
      const interval = setInterval(() => {
        setUploadProgress((p) => (p >= 90 ? 90 : p + 10));
      }, 150);

      const { url } = await uploadToStorage(file, 'general');
      clearInterval(interval);
      setUploadProgress(100);

      await fetchMedia();
      // Auto-select on upload
      onSelect(url);
      setIsOpen(false);
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

  const handleSelect = (url: string) => {
    onSelect(url);
    setIsOpen(false);
  };

  const filtered = media.filter(
    (m) =>
      m.original_name.toLowerCase().includes(search.toLowerCase()) ||
      m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Trigger */}
      <span onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger}
      </span>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Media Library</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6">
              <button
                type="button"
                onClick={() => setTab('library')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === 'library'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Library
              </button>
              <button
                type="button"
                onClick={() => setTab('upload')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === 'upload'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Upload
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {tab === 'library' ? (
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search files..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Grid */}
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="text-center py-12">
                      <ImagePlus className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        {media.length === 0
                          ? 'No media uploaded yet. Switch to Upload tab.'
                          : 'No results found.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {filtered.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelect(item.url)}
                          className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors focus:outline-none focus:border-blue-500"
                        >
                          {item.mime_type.startsWith('image/') ? (
                            <Image
                              src={item.url}
                              alt={item.original_name}
                              fill
                              className="object-cover"
                              sizes="160px"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ImagePlus className="h-8 w-8 text-gray-300" />
                            </div>
                          )}
                          {/* Hover overlay with name */}
                           <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs text-white truncate">
                              {item.original_name}
                            </p>
                          </div>
                          {/* Selection indicator */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg">
                              <Check className="h-4 w-4" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Upload tab */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleUpload(file);
                  }}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                      <p className="text-gray-800 font-medium">Uploading...</p>
                      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-500">{uploadProgress}%</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-blue-50 p-4 rounded-full">
                        <Upload className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-gray-800 font-medium">
                        Drag & drop a file here
                      </p>
                      <p className="text-sm text-gray-500">or</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Browse Files
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,video/*,application/pdf"
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
