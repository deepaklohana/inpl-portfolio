// Feature: service-page-redesign, Property 3: Process steps count enforcement

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

import { createService, ServiceFormData, ProcessStep } from '@/lib/actions/services';
import { prisma } from '@/lib/prisma';

// Arbitrary for a single ProcessStep
const processStepArb = fc.record({
  number: fc.integer({ min: 1, max: 4 }),
  heading: fc.string({ minLength: 1 }),
  description: fc.string({ minLength: 1 }),
});

const baseFormData: Omit<ServiceFormData, 'processSteps'> = {
  title: 'Test Service',
  slug: 'test-service',
  status: 'draft',
  featured: false,
};

describe('P3: Process steps count enforcement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Validates: Requirements 4.1, 9.1
   *
   * Property: For any processSteps array whose length is not exactly 4,
   * createService must return { success: false } with an error containing
   * "exactly 4 steps".
   */
  it('rejects processSteps arrays whose length is not exactly 4', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(processStepArb).filter((arr) => arr.length !== 4),
        async (steps: ProcessStep[]) => {
          const formData: ServiceFormData = {
            ...baseFormData,
            processSteps: JSON.stringify(steps),
          };

          const result = await createService(formData);

          expect(result.success).toBe(false);
          expect((result as { success: false; error: string }).error).toMatch(/exactly 4 steps/i);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 4.1, 9.1
   *
   * Property: For any processSteps array with exactly 4 items,
   * createService should NOT return the process steps count error.
   */
  it('accepts processSteps arrays with exactly 4 items', async () => {
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
        fc.array(processStepArb, { minLength: 4, maxLength: 4 }),
        async (steps: ProcessStep[]) => {
          const formData: ServiceFormData = {
            ...baseFormData,
            processSteps: JSON.stringify(steps),
          };

          const result = await createService(formData);

          // Must NOT return the process steps count error
          if (!result.success) {
            const error = (result as { success: false; error: string }).error;
            expect(error).not.toMatch(/exactly 4 steps/i);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
