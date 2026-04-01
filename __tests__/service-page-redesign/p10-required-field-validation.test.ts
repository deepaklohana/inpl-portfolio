// Feature: service-page-redesign, Property 10: Required field validation rejects incomplete submissions

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';

// Mock next/cache before importing the module under test
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock the revalidate action
vi.mock('@/lib/actions/revalidate', () => ({
  triggerRevalidation: vi.fn().mockResolvedValue(undefined),
}));

// Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    seoMetadata: {
      create: vi.fn(),
      update: vi.fn(),
    },
    service: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { createService, ServiceFormData } from '@/lib/actions/services';
import { prisma } from '@/lib/prisma';

const baseMandatoryFields: Omit<ServiceFormData, 'title' | 'slug'> = {
  status: 'draft',
  featured: false,
};

describe('P10: Required field validation rejects incomplete submissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Validates: Requirements 7.7, 9.3, 9.5
   *
   * Property: For any input where title is falsy OR slug is falsy,
   * createService must return { success: false }.
   */
  it('returns { success: false } when title is absent or empty', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate optional slugs (non-empty) and missing/null titles
        fc.record({
          title: fc.option(fc.string({ minLength: 1 })),
          slug: fc.string({ minLength: 1 }),
        }),
        async ({ title, slug }) => {
          // Only test cases where title is falsy
          fc.pre(title === null || title === undefined || title.trim() === '');

          const formData: ServiceFormData = {
            ...baseMandatoryFields,
            title: (title ?? '') as string,
            slug,
          };

          const result = await createService(formData);
          expect(result.success).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('returns { success: false } when slug is absent or empty', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.string({ minLength: 1 }),
          slug: fc.option(fc.string({ minLength: 1 })),
        }),
        async ({ title, slug }) => {
          // Only test cases where slug is falsy
          fc.pre(slug === null || slug === undefined || slug.trim() === '');

          const formData: ServiceFormData = {
            ...baseMandatoryFields,
            title,
            slug: (slug ?? '') as string,
          };

          const result = await createService(formData);
          expect(result.success).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('returns { success: false } when both title and slug are absent', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.option(fc.string({ minLength: 1 })),
          slug: fc.option(fc.string({ minLength: 1 })),
        }),
        async ({ title, slug }) => {
          // Only test cases where BOTH are falsy
          fc.pre(
            (title === null || title === undefined || title.trim() === '') &&
              (slug === null || slug === undefined || slug.trim() === ''),
          );

          const formData: ServiceFormData = {
            ...baseMandatoryFields,
            title: (title ?? '') as string,
            slug: (slug ?? '') as string,
          };

          const result = await createService(formData);
          expect(result.success).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('does not return required-field error when both title and slug are present (positive case)', async () => {
    // Mock prisma.service.create to return a fake service
    vi.mocked(prisma.service.create).mockResolvedValue({
      id: 1,
      title: 'Test',
      slug: 'test',
      description: null,
      icon: null,
      stats: null,
      subServices: null,
      processSteps: null,
      sectionType: 'technologies',
      techSection: null,
      toolsSection: null,
      sort_order: 0,
      status: 'draft',
      featured: false,
      seo_id: null,
      published_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    } as never);

    // Use strings that are non-empty after trimming (no whitespace-only strings)
    const nonEmptyString = fc
      .string({ minLength: 1 })
      .filter((s) => s.trim().length > 0);

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: nonEmptyString,
          slug: nonEmptyString,
        }),
        async ({ title, slug }) => {
          const formData: ServiceFormData = {
            ...baseMandatoryFields,
            title,
            slug,
          };

          const result = await createService(formData);
          // When both fields are present (non-empty after trim), validation passes — no required-field error
          if (!result.success) {
            // The only acceptable failure is a non-required-field error (e.g. slug collision)
            expect((result as { success: false; error: string }).error).not.toMatch(/required/i);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
