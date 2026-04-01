// Feature: service-page-redesign, Property 12: Invalid JSON field rejection

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

function isValidJson(s: string): boolean {
  try {
    JSON.parse(s);
    return true;
  } catch {
    return false;
  }
}

const invalidJsonArb = fc.string({ minLength: 1 }).filter((s) => !isValidJson(s));

const baseFormData: Omit<ServiceFormData, 'stats' | 'subServices' | 'processSteps' | 'techSection' | 'toolsSection'> = {
  title: 'Valid Title',
  slug: 'valid-slug',
  status: 'draft',
  featured: false,
};

describe('P12: Invalid JSON field rejection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Validates: Requirements 9.4
   *
   * Property: For any string that is not valid JSON submitted to the `stats` field,
   * createService must return { success: false }.
   */
  it('returns { success: false } when stats contains invalid JSON', async () => {
    await fc.assert(
      fc.asyncProperty(invalidJsonArb, async (invalidJson) => {
        const formData: ServiceFormData = {
          ...baseFormData,
          stats: invalidJson,
        };
        const result = await createService(formData);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 9.4
   *
   * Property: For any string that is not valid JSON submitted to the `subServices` field,
   * createService must return { success: false }.
   */
  it('returns { success: false } when subServices contains invalid JSON', async () => {
    await fc.assert(
      fc.asyncProperty(invalidJsonArb, async (invalidJson) => {
        const formData: ServiceFormData = {
          ...baseFormData,
          subServices: invalidJson,
        };
        const result = await createService(formData);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 9.4
   *
   * Property: For any string that is not valid JSON submitted to the `processSteps` field,
   * createService must return { success: false }.
   */
  it('returns { success: false } when processSteps contains invalid JSON', async () => {
    await fc.assert(
      fc.asyncProperty(invalidJsonArb, async (invalidJson) => {
        const formData: ServiceFormData = {
          ...baseFormData,
          processSteps: invalidJson,
        };
        const result = await createService(formData);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 9.4
   *
   * Property: For any string that is not valid JSON submitted to the `techSection` field,
   * createService must return { success: false }.
   */
  it('returns { success: false } when techSection contains invalid JSON', async () => {
    await fc.assert(
      fc.asyncProperty(invalidJsonArb, async (invalidJson) => {
        const formData: ServiceFormData = {
          ...baseFormData,
          techSection: invalidJson,
        };
        const result = await createService(formData);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 9.4
   *
   * Property: For any string that is not valid JSON submitted to the `toolsSection` field,
   * createService must return { success: false }.
   */
  it('returns { success: false } when toolsSection contains invalid JSON', async () => {
    await fc.assert(
      fc.asyncProperty(invalidJsonArb, async (invalidJson) => {
        const formData: ServiceFormData = {
          ...baseFormData,
          toolsSection: invalidJson,
        };
        const result = await createService(formData);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 9.4
   *
   * Property: A non-JSON string in any JSON field causes rejection.
   * Tests all five JSON fields simultaneously with the same invalid string.
   */
  it('returns { success: false } when any JSON field contains a non-JSON string', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'not json at all',
          '{unclosed',
          '[1,2,',
          'undefined',
          'NaN',
          'function(){}',
          '<xml>',
          '...',
        ),
        async (invalidJson) => {
          for (const field of ['stats', 'subServices', 'processSteps', 'techSection', 'toolsSection'] as const) {
            const formData: ServiceFormData = {
              ...baseFormData,
              [field]: invalidJson,
            };
            const result = await createService(formData);
            expect(result.success).toBe(false);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
