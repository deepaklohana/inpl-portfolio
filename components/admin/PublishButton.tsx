'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleBlogStatus } from '@/lib/actions/blogs';
import { toggleProjectStatus } from '@/lib/actions/projects';
import { toggleEventStatus } from '@/lib/actions/events';
import { toggleNewsStatus } from '@/lib/actions/news';
import { toggleServiceStatus } from '@/lib/actions/services';
import { toast } from 'sonner';

type Status = 'draft' | 'published' | 'archived';

type ContentType = 'blogs' | 'projects' | 'events' | 'news' | 'services';

type Props = {
  id: string;
  slug: string;
  currentStatus: Status;
  contentType: ContentType;
  publishedAt?: string | null;
};

type ToggleAction = (
  id: string,
  status: Status,
  slug?: string
) => Promise<{ success: boolean; error?: string } | { success: true } | { success: false; error: string }>;

function getToggleAction(contentType: ContentType) {
  switch (contentType) {
    case 'blogs':
      return toggleBlogStatus;
    case 'projects':
      return toggleProjectStatus;
    case 'events':
      return toggleEventStatus;
    case 'news':
      return toggleNewsStatus;
    case 'services':
      return toggleServiceStatus;
  }
}

function getNextStatus(current: Status): Status {
  if (current === 'draft') return 'published';
  if (current === 'published') return 'draft';
  return 'draft';
}

export default function PublishButton({ id, slug, currentStatus, contentType, publishedAt }: Props) {
  const router = useRouter();
  
  const [isPending, startTransition] = useTransition();

  const nextStatus = getNextStatus(currentStatus);
  const toggle = getToggleAction(contentType) as ToggleAction;

  const label =
    currentStatus === 'draft' ? 'Publish' : currentStatus === 'published' ? 'Unpublish' : 'Restore';

  const colorClass =
    currentStatus === 'draft'
      ? 'bg-green-600 hover:bg-green-700'
      : currentStatus === 'published'
      ? 'bg-yellow-500 hover:bg-yellow-600'
      : 'bg-gray-500 hover:bg-gray-600';

  const onClick = () => {
    startTransition(async () => {
      try {
        const result = await toggle(id, nextStatus, slug);
        if (!result?.success) {
          toast.error(result?.error || 'Failed to update status.');
          return;
        }
        toast.success(`Status updated to ${nextStatus}.`);
        router.refresh();
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to update status.';
        toast.error(message);
      }
    });
  };

  return (
    <div className="flex items-center gap-3 justify-end">
      {currentStatus === 'published' && (
        <span className="text-xs text-gray-500">
          {publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Published'}
        </span>
      )}

      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        className={`px-3 py-1.5 rounded-md text-white text-xs font-medium shadow-sm disabled:opacity-50 ${colorClass}`}
      >
        {isPending ? 'Working…' : label}
      </button>
    </div>
  );
}

