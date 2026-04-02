import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const servicesCount = await prisma.service.count();
    const productsCount = await prisma.product.count();
    const servicesAll = await prisma.service.findMany({
      select: { id: true, title: true, status: true, slug: true }
    });
    
    // Masked DB URL to verify which Database Vercel is using without leaking password
    let dbUrl = process.env.DATABASE_URL || 'NOT_SET';
    if (dbUrl !== 'NOT_SET') {
      dbUrl = dbUrl.replace(/:[^:@]*@/, ':***@');
    }

    return NextResponse.json({
      success: true,
      servicesCount,
      productsCount,
      services: servicesAll,
      databaseUrlMasked: dbUrl,
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || String(error),
      code: error?.code
    }, { status: 500 });
  }
}
