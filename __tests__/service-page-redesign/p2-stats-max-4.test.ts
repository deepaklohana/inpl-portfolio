// Feature: service-page-redesign, Property 2: Stats bar maximum enforcement

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

import { createService, ServiceFormData, StatItem } from '@/lib/actions/services';
import { prisma } from '@/lib/prisma';

// Arbitrary for a single StatItem
const statItemArb = fc.record({
  value: fc.string({ minLength: 1 }),
  label: fc.string({ minLength: 1 }),
});

const baseFormData: Omit<ServiceFormData, 'stats'> = {
  title: 'Test Service',
  slug: 'test-service',
  status: 'draft',
  featured: false,
};

describe('P2: Stats bar maximum enforcement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Validates: Requirements 1.6, 2.3, 7.4, 9.2
   *
   * Property: For any stats array with more than 4 items,
   * createService must return { success: false } with an error
   * containing "maximum of 4".
   */
  it('rejects stats arrays with more than 4 items', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(statItemArb, { minLength: 5, maxLength: 20 }),
        async (stats: StatItem[]) => {
          const formData: ServiceFormData = {
            ...baseFormData,
            stats: JSON.stringify(stats),
          };

          const result = await createService(formData);

          expect(result.success).toBe(false);
          expect((result as { success: false; error: string }).error).toMatch(/maximum of 4/i);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 1.6, 2.3, 7.4, 9.2
   *
   * Property: For any stats array with 4 or fewer items,
   * createService should NOT return the stats max error.
   */
  it('accepts stats arrays with 4 or fewer items', async () => {
    // Mock prisma.service.create to return a fake service
    vi.mocked(prisma.service.create).mockResolvedValue({
      id: 1,
      title: 'Test Service',
      slug: 'test-service',
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

    await fc.assert(
      fc.asyncProperty(
        fc.array(statItemArb, { maxLength: 4 }),
        async (stats: StatItem[]) => {
          const formData: ServiceFormData = {
            ...baseFormData,
            stats: JSON.stringify(stats),
          };

          const result = await createService(formData);

          // Must NOT return the stats max error
          if (!result.success) {
            const error = (result as { success: false; error: string }).error;
            expect(error).not.toMatch(/maximum of 4/i);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
