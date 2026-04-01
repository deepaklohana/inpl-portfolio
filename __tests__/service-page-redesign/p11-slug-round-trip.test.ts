// Feature: service-page-redesign, Property 11: Slug lookup round-trip

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

import { getServiceBySlug } from '@/lib/actions/services';
import { prisma } from '@/lib/prisma';

describe('P11: Slug lookup round-trip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Validates: Requirements 8.3
   *
   * Property: For any stored service, getServiceBySlug(service.slug) returns
   * the same record that was stored (same slug and id).
   */
  it('returns the stored service when queried by its slug', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        async (slug) => {
          const fakeService = {
            id: 1,
            title: 'Test Service',
            slug,
            description: null,
            icon: null,
            stats: null,
            subServices: null,
            processSteps: null,
            sectionType: 'technologies',
            techSection: null,
            toolsSection: null,
            sort_order: 0,
            status: 'published',
            featured: false,
            seo_id: null,
            published_at: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
            seo_metadata: null,
          };

          vi.mocked(prisma.service.findUnique).mockResolvedValue(fakeService as never);

          const result = await getServiceBySlug(slug);

          expect(result).not.toBeNull();
          expect(result!.slug).toBe(slug);
          expect(result!.id).toBe(fakeService.id);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 8.3, 8.4
   *
   * Negative case: when prisma.service.findUnique returns null,
   * getServiceBySlug should return null.
   */
  it('returns null when no service exists for the given slug', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        async (slug) => {
          vi.mocked(prisma.service.findUnique).mockResolvedValue(null);

          const result = await getServiceBySlug(slug);

          expect(result).toBeNull();
        },
      ),
      { numRuns: 100 },
    );
  });
});
