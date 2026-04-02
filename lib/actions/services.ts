'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { triggerRevalidation } from '@/lib/actions/revalidate';
import { FULL_PUBLIC_REVALIDATION_PATHS } from '@/lib/revalidationPaths';

// ─── TypeScript interfaces for JSON fields ────────────────────────────────────

export interface StatItem {
  value: string;
  label: string;
}

export interface SubService {
  icon: string;
  name: string;
  description: string;
  shortDescription?: string;
  featuresHeading?: string;
  features: string[];
  technologiesHeading?: string;
  technologies: string[];
}

export interface ProcessStep {
  number: number;
  heading: string;
  description: string;
}

export interface TechCategory {
  name: string;
  items: string[];
}

export interface TechSection {
  heading: string;
  categories: TechCategory[];
}

export interface ToolItem {
  name: string;
  icon: string;
}

export interface ToolCategory {
  name: string;
  tools: ToolItem[];
}

export interface ToolsSection {
  heading?: string;
  description: string;
  categories: ToolCategory[];
}

// ─── Form Data Interface ──────────────────────────────────────────────────────

export interface ServiceFormData {
  title: string;
  slug: string;
  description?: string;
  blackHeading?: string;
  blueHeading?: string;
  icon?: string;
  pillText?: string;
  // JSON strings for complex fields
  stats?: string;          // JSON string → StatItem[]
  subServicesHeading?: string;
  subServicesDescription?: string;
  subServices?: string;    // JSON string → SubService[]
  processStepsHeading?: string;
  processStepsDescription?: string;
  processSteps?: string;   // JSON string → ProcessStep[]
  sectionType?: string;    // "technologies" | "tools"
  techSection?: string;    // JSON string → TechSection
  toolsSection?: string;   // JSON string → ToolsSection
  // Publishing
  sort_order?: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  // SEO
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  keywords?: string;
  no_index?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALLOWED_SECTION_TYPES = ['technologies', 'tools'] as const;

function normaliseSectionType(value?: string): string {
  if (value && (ALLOWED_SECTION_TYPES as readonly string[]).includes(value)) {
    return value;
  }
  return 'technologies';
}

/**
 * Parse a JSON string field. Returns the parsed value on success.
 * Returns null if the string is empty/undefined.
 * Throws an error with the field name if the JSON is malformed.
 */
function parseJsonField(val: string | undefined, fieldName: string): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  if (!val || val.trim() === '') return Prisma.JsonNull;
  try {
    return JSON.parse(val) as Prisma.InputJsonValue;
  } catch {
    throw new Error(`Invalid JSON in ${fieldName}`);
  }
}

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return 'Request failed';
}

function isPrismaUniqueConstraintError(e: unknown): boolean {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError &&
    e.code === 'P2002'
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

interface ValidationResult {
  success: false;
  error: string;
}

function validateServiceFormData(formData: ServiceFormData): ValidationResult | null {
  // Required fields
  if (!formData.title || formData.title.trim() === '') {
    return { success: false, error: 'title is required' };
  }
  if (!formData.slug || formData.slug.trim() === '') {
    return { success: false, error: 'slug is required' };
  }

  // Validate JSON fields are parseable and check array constraints
  if (formData.stats && formData.stats.trim() !== '') {
    let parsed: unknown;
    try {
      parsed = JSON.parse(formData.stats);
    } catch {
      return { success: false, error: 'Invalid JSON in stats' };
    }
    if (Array.isArray(parsed) && parsed.length > 4) {
      return { success: false, error: 'Stats bar supports a maximum of 4 items' };
    }
  }

  if (formData.subServices && formData.subServices.trim() !== '') {
    try {
      JSON.parse(formData.subServices);
    } catch {
      return { success: false, error: 'Invalid JSON in subServices' };
    }
  }

  if (formData.processSteps && formData.processSteps.trim() !== '') {
    let parsed: unknown;
    try {
      parsed = JSON.parse(formData.processSteps);
    } catch {
      return { success: false, error: 'Invalid JSON in processSteps' };
    }
    if (Array.isArray(parsed) && parsed.length > 4) {
      return { success: false, error: 'Process section allows a maximum of 4 steps' };
    }
  }

  if (formData.techSection && formData.techSection.trim() !== '') {
    try {
      JSON.parse(formData.techSection);
    } catch {
      return { success: false, error: 'Invalid JSON in techSection' };
    }
  }

  if (formData.toolsSection && formData.toolsSection.trim() !== '') {
    try {
      JSON.parse(formData.toolsSection);
    } catch {
      return { success: false, error: 'Invalid JSON in toolsSection' };
    }
  }

  return null;
}

// ─── Retry helper (mirrors products.ts) ─────────────────────────────────────

function isConnectionPoolTimeout(err: unknown): boolean {
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message?: unknown }).message
          : undefined;
  const lower = String(msg ?? '').toLowerCase();
  return (
    lower.includes('connection pool') ||
    lower.includes('timed out fetching a new connection') ||
    lower.includes('timed out fetching')
  );
}

async function retryPrismaOperation<T>(operation: () => Promise<T>): Promise<T> {
  const maxAttempts = 3;
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastErr = err;
      if (!isConnectionPoolTimeout(err) || attempt === maxAttempts) break;
      await new Promise((r) => setTimeout(r, attempt * 500));
    }
  }
  throw lastErr;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getServices(options?: { status?: string; limit?: number; offset?: number }) {
  try {
    return await retryPrismaOperation(() =>
      prisma.service.findMany({
        where: options?.status ? { status: options.status } : undefined,
        take: options?.limit,
        skip: options?.offset,
        orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
        include: { seo_metadata: true },
      })
    );
  } catch (error: any) {
    console.error('Error fetching services:', error);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`getServices Prisma Error: ${error?.message || String(error)}`);
    }
    return [];
  }
}

export async function getServiceById(id: string | number) {
  try {
    return await retryPrismaOperation(() =>
      prisma.service.findUnique({
        where: { id: typeof id === 'number' ? id : parseInt(id, 10) },
        include: { seo_metadata: true },
      })
    );
  } catch (error) {
    console.error('Error fetching service by id:', error);
    return null;
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    return await retryPrismaOperation(() =>
      prisma.service.findUnique({
        where: { slug },
        include: { seo_metadata: true },
      })
    );
  } catch (error) {
    console.error('Error fetching service by slug:', error);
    return null;
  }
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createService(formData: ServiceFormData) {
  // Validate before touching the DB
  const validationError = validateServiceFormData(formData);
  if (validationError) return validationError;

  try {
    let seo_id: number | null = null;
    const hasSeoData = formData.meta_title || formData.meta_description || formData.og_image || formData.keywords || formData.no_index;
    if (hasSeoData) {
      const seoData = await prisma.seoMetadata.create({
        data: {
          meta_title: formData.meta_title || null,
          meta_description: formData.meta_description || null,
          og_image: formData.og_image || null,
          keywords: formData.keywords || null,
          no_index: formData.no_index || false,
        },
      });
      seo_id = seoData.id;
    }

    const serviceData = await prisma.service.create({
      data: {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description || null,
        blackHeading: formData.blackHeading || null,
        blueHeading: formData.blueHeading || null,
        icon: formData.icon || null,
        pillText: formData.pillText || null,
        stats: parseJsonField(formData.stats, 'stats'),
        subServicesHeading: formData.subServicesHeading || null,
        subServicesDescription: formData.subServicesDescription || null,
        subServices: parseJsonField(formData.subServices, 'subServices'),
        processStepsHeading: formData.processStepsHeading || null,
        processStepsDescription: formData.processStepsDescription || null,
        processSteps: parseJsonField(formData.processSteps, 'processSteps'),
        sectionType: normaliseSectionType(formData.sectionType),
        techSection: parseJsonField(formData.techSection, 'techSection'),
        toolsSection: parseJsonField(formData.toolsSection, 'toolsSection'),
        sort_order: formData.sort_order ?? 0,
        status: formData.status,
        featured: formData.featured,
        seo_id,
        published_at: formData.status === 'published' ? new Date() : null,
      } as any,
    });

    revalidatePath('/services');
    revalidatePath('/admin/services');
    revalidatePath(`/services/${formData.slug}`);

    if (formData.status === 'published') {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/services', `/services/${formData.slug}`]);
    }

    return { success: true, id: serviceData.id };
  } catch (e: unknown) {
    if (isPrismaUniqueConstraintError(e)) {
      return { success: false, error: 'Slug already in use' };
    }
    console.error('createService failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to create service' };
  }
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateService(id: string | number, formData: ServiceFormData) {
  // Validate before touching the DB
  const validationError = validateServiceFormData(formData);
  if (validationError) return validationError;

  try {
    const existing = await prisma.service.findUnique({
      where: { id: typeof id === 'number' ? id : parseInt(id, 10) },
      select: { seo_id: true },
    });

    if (!existing) return { success: false, error: 'Service not found' };

    let seo_id = existing.seo_id;
    const hasSeo = formData.meta_title || formData.meta_description || formData.og_image || formData.keywords || formData.no_index;

    if (hasSeo) {
      if (seo_id) {
        await prisma.seoMetadata.update({
          where: { id: seo_id },
          data: {
            meta_title: formData.meta_title || null,
            meta_description: formData.meta_description || null,
            og_image: formData.og_image || null,
            keywords: formData.keywords || null,
            no_index: formData.no_index || false,
          },
        });
      } else {
        const newSeo = await prisma.seoMetadata.create({
          data: {
            meta_title: formData.meta_title || null,
            meta_description: formData.meta_description || null,
            og_image: formData.og_image || null,
            keywords: formData.keywords || null,
            no_index: formData.no_index || false,
          },
        });
        seo_id = newSeo.id;
      }
    }

    await prisma.service.update({
      where: { id: Number(id) },
      data: {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description || null,
        blackHeading: formData.blackHeading || null,
        blueHeading: formData.blueHeading || null,
        icon: formData.icon || null,
        pillText: formData.pillText || null,
        stats: parseJsonField(formData.stats, 'stats'),
        subServicesHeading: formData.subServicesHeading || null,
        subServicesDescription: formData.subServicesDescription || null,
        subServices: parseJsonField(formData.subServices, 'subServices'),
        processStepsHeading: formData.processStepsHeading || null,
        processStepsDescription: formData.processStepsDescription || null,
        processSteps: parseJsonField(formData.processSteps, 'processSteps'),
        sectionType: normaliseSectionType(formData.sectionType),
        techSection: parseJsonField(formData.techSection, 'techSection'),
        toolsSection: parseJsonField(formData.toolsSection, 'toolsSection'),
        sort_order: formData.sort_order ?? 0,
        status: formData.status,
        featured: formData.featured,
        seo_id,
        published_at:
          formData.status === 'published'
            ? new Date()
            : formData.status === 'draft'
            ? null
            : undefined,
      } as any,
    });

    revalidatePath('/services');
    revalidatePath(`/services/${formData.slug}`);
    revalidatePath('/admin/services');

    if (formData.status === 'published') {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/services', `/services/${formData.slug}`]);
    }

    return { success: true };
  } catch (e: unknown) {
    if (isPrismaUniqueConstraintError(e)) {
      return { success: false, error: 'Slug already in use' };
    }
    console.error('updateService failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update service' };
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteService(id: string | number) {
  try {
    const data = await prisma.service.findUnique({
      where: { id: typeof id === 'number' ? id : parseInt(id, 10) },
      select: { seo_id: true },
    });

    await prisma.service.delete({ where: { id: Number(id) } });

    if (data?.seo_id) {
      await prisma.seoMetadata.delete({ where: { id: data.seo_id } });
    }

    revalidatePath('/services');
    revalidatePath('/admin/services');
    return { success: true };
  } catch (e: unknown) {
    console.error('deleteService failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to delete service' };
  }
}

// ─── Toggle Status ────────────────────────────────────────────────────────────

export async function toggleServiceStatus(
  id: string | number,
  status: 'published' | 'draft' | 'archived',
  slug?: string,
) {
  try {
    let resolvedSlug = slug;
    if (!resolvedSlug) {
      const data = await prisma.service.findUnique({ where: { id: Number(id) }, select: { slug: true } });
      resolvedSlug = data?.slug || undefined;
    }

    await prisma.service.update({
      where: { id: Number(id) },
      data: { status, published_at: status === 'published' ? new Date() : null },
    });

    revalidatePath('/services');
    revalidatePath('/admin/services');
    if (resolvedSlug) revalidatePath(`/services/${resolvedSlug}`);

    if (status === 'published' && resolvedSlug) {
      await triggerRevalidation([...FULL_PUBLIC_REVALIDATION_PATHS, '/services', `/services/${resolvedSlug}`]);
    }

    return { success: true };
  } catch (e: unknown) {
    console.error('toggleServiceStatus failed:', e);
    return { success: false, error: getErrorMessage(e) || 'Failed to update service status' };
  }
}
