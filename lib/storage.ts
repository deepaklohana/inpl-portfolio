'use server';

import { unlink } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface Media {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  folder: string;
  created_at: Date | string;
}

// ─────────────────────────────────────────────────────────────
// Upload
// Called from server actions / server components.
// For client components (e.g. RichTextEditor), use the
// /api/upload route directly.
// ─────────────────────────────────────────────────────────────

export async function uploadToStorage(
  file: File,
  folder: string = 'general'
): Promise<{ url: string; path: string }> {
  const { writeFile, mkdir } = await import('fs/promises');

  const timestamp = Date.now();
  const safeName = file.name.replace(/\s/g, '_');
  const filename = `${timestamp}_${safeName}`;
  const relativePath = `${folder}/${filename}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);

  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(path.join(uploadDir, filename), buffer);

  const url = `/uploads/${relativePath}`;

  try {
    await prisma.media.create({
      data: {
        filename: relativePath,
        original_name: file.name,
        url,
        mime_type: file.type,
        size_bytes: file.size,
        folder,
      },
    });
  } catch (err: any) {
    // Clean up the file if DB insert fails
    await unlink(path.join(uploadDir, filename)).catch(() => {});
    throw new Error(`Failed to save media record: ${err.message || 'Unknown error'}`);
  }

  return { url, path: relativePath };
}

// ─────────────────────────────────────────────────────────────
// Delete
// ─────────────────────────────────────────────────────────────

export async function deleteFromStorage(
  filePath: string,
  mediaId: string
): Promise<void> {
  const absolutePath = path.join(process.cwd(), 'public', 'uploads', filePath);

  try {
    await unlink(absolutePath);
  } catch (err: any) {
    // File may already be gone — log but don't hard-fail
    console.warn(`Could not delete file at ${absolutePath}:`, err.message);
  }

  await prisma.media.delete({ where: { id: mediaId } });
}

// ─────────────────────────────────────────────────────────────
// List
// ─────────────────────────────────────────────────────────────

export async function getMediaList(folder?: string): Promise<Media[]> {
  return prisma.media.findMany({
    where: folder ? { folder } : undefined,
    orderBy: { created_at: 'desc' },
  });
}
