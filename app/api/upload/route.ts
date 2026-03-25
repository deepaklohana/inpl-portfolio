import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const safeName = file.name.replace(/\s/g, '_');
    const filename = `${timestamp}_${safeName}`;
    const relativePath = `${folder}/${filename}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    const absolutePath = path.join(uploadDir, filename);
    await writeFile(absolutePath, buffer);

    const url = `/uploads/${relativePath}`;

    // Save record to DB
    const media = await prisma.media.create({
      data: {
        filename: relativePath,
        original_name: file.name,
        url,
        mime_type: file.type,
        size_bytes: file.size,
        folder,
      },
    });

    return NextResponse.json({ url, path: relativePath, id: media.id });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
