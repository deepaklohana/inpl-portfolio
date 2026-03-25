'use client';

import { useState, useCallback, useRef } from 'react';
import { UploadCloud, X, Loader2, ImageIcon } from 'lucide-react';
import { uploadToStorage } from '@/lib/storage';
import Image from 'next/image';
import MediaPicker from '@/components/admin/MediaPicker';
import { toast } from 'sonner';

interface ImageUploaderProps {
  value?: string;
  onUpload: (url: string) => void;
  folder?: string;
  showLibrary?: boolean;
}

export default function ImageUploader({
  value,
  onUpload,
  folder = 'blog_images',
  showLibrary = true,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalId = useRef<NodeJS.Timeout>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      setIsUploading(true);
      setProgress(10);

      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 100);

      const { url } = await uploadToStorage(file, folder);

      clearInterval(progressInterval);
      setProgress(100);

      onUpload(url);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        uploadFile(droppedFile);
      }
    },
    [folder, onUpload]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      uploadFile(selectedFile);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (value) {
    return (
      <div className="relative w-full max-w-md h-64 border rounded-lg overflow-hidden group">
        <Image src={value} alt="Uploaded image" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onUpload('')}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full absolute top-2 right-2"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-100"
          >
            Change Image
          </button>
          {showLibrary && (
            <MediaPicker
              onSelect={(url) => onUpload(url)}
              trigger={
                <span className="bg-white text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-100 inline-block">
                  Choose from Library
                </span>
              }
            />
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 w-full text-center cursor-pointer transition-colors relative
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
          ${isUploading ? 'opacity-75 pointer-events-none' : ''}
        `}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center h-40">
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Uploading... {progress}%</p>
              <div className="w-64 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </>
          ) : (
            <>
              <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-700 font-medium text-lg">Click or drag image to upload</p>
              <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 5MB</p>
            </>
          )}
        </div>
      </div>

      {showLibrary && !isUploading && (
        <MediaPicker
          onSelect={(url) => onUpload(url)}
          trigger={
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full justify-center"
            >
              <ImageIcon className="h-4 w-4" />
              Choose from Library
            </button>
          }
        />
      )}
    </div>
  );
}
