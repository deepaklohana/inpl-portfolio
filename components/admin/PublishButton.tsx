'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleBlogStatus } from '@/lib/actions/blogs';
import { toggleProjectStatus } from '@/lib/actions/projects';
import { toggleEventStatus } from '@/lib/actions/events';
import { toggleNewsStatus } from '@/lib/actions/news';
import { toggleServiceStatus } from '@/lib/actions/services';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Loader2 } from 'lucide-react';

type Status = 'draft' | 'published' | 'archived';
type ContentType = 'blogs' | 'projects' | 'events' | 'news' | 'services';

type Props = {
  id: string;
  slug: string;
  currentStatus: Status;
  contentType: ContentType;
  publishedAt?: string | null;
  onSuccess?: (newStatus: Status) => void;
};

type ToggleAction = (
  id: string,
  status: Status,
  slug?: string
) => Promise<{ success: boolean; error?: string } | { success: true } | { success: false; error: string }>;

function getToggleAction(contentType: ContentType) {
  switch (contentType) {
    case 'blogs': return toggleBlogStatus;
    case 'projects': return toggleProjectStatus;
    case 'events': return toggleEventStatus;
    case 'news': return toggleNewsStatus;
    case 'services': return toggleServiceStatus;
  }
}

function getNextStatus(current: Status): Status {
  if (current === 'draft') return 'published';
  if (current === 'published') return 'draft';
  return 'draft';
}

export default function PublishButton({ id, slug, currentStatus, contentType, publishedAt, onSuccess }: Props) {
  const router = useRouter();
  
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const nextStatus = getNextStatus(currentStatus);
  const toggle = getToggleAction(contentType) as ToggleAction;
  const isPublished = currentStatus === 'published';

  const handleConfirmToggle = () => {
    setShowConfirm(false);
    startTransition(async () => {
      try {
        const result = await toggle(id, nextStatus, slug);
        if (!result?.success) {
          toast.error(result?.error || 'Failed to update status.');
          return;
        }
        toast.success(`Status updated to ${nextStatus}.`);
        if (onSuccess) onSuccess(nextStatus);
        router.refresh();
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to update status.';
        toast.error(message);
      }
    });
  };

  return (
    <div className="flex items-center justify-between gap-3 min-w-[160px]">
      <div className="flex flex-col gap-1">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {currentStatus}
        </span>
        {isPublished && publishedAt && (
          <span className="text-[10px] text-gray-400">
            {new Date(publishedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={isPending}
          title={isPublished ? 'Unpublish' : 'Publish'}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#2251B5] focus:ring-offset-1 ${isPublished ? 'bg-[#2251B5]' : 'bg-gray-300'} disabled:opacity-50`}
        >
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-300 ${isPublished ? 'translate-x-[20px]' : 'translate-x-[2px]'}`} />
        </button>
        {isPending && (
          <div className="absolute -top-1 -right-6">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title={isPublished ? "Unpublish Service" : "Publish Service"}
        description={`Are you sure you want to ${isPublished ? "unpublish" : "publish"} this item? ${isPublished ? "It will be hidden from the public website." : "It will become visible on the public website."}`}
        confirmText={isPublished ? "Yes, Unpublish" : "Yes, Publish"}
        cancelText="Cancel"
        onConfirm={handleConfirmToggle}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

