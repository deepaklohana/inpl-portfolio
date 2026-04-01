// Edge case tests for service-page-404-fix
// Testing: very long slugs, special characters, rapid service creation

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { getServiceBySlug } from '@/lib/actions/services';

describe('Edge Cases: Service Page 404 Fix', () => {
  const createdServiceIds: number[] = [];

  afterAll(async () => {
    // Clean up all created services
    for (const id of createdServiceIds) {
      try {
        await prisma.service.delete({ where: { id } });
      } catch (error) {
        console.error(`Failed to clean up service ${id}:`, error);
      }
    }
  });

  it('should handle very long slugs', async () => {
    const longSlug = 'this-is-a-very-long-slug-that-tests-the-system-ability-to-handle-extremely-long-service-slugs-without-breaking-the-route-generation-or-causing-any-issues-with-the-database-or-next-js-static-params';
    
    const service = await prisma.service.create({
      data: {
        title: 'Very Long Slug Test',
        slug: longSlug,
        description: 'Testing very long slugs',
        status: 'published',
        featured: false,
        sort_order: 0,
        published_at: new Date(),
      },
    });
    
    createdServiceIds.push(service.id);
    
    // Verify service can be fetched
    const fetchedService = await getServiceBySlug(longSlug);
    expect(fetchedService).not.toBeNull();
    expect(fetchedService?.slug).toBe(longSlug);
    expect(fetchedService?.status).toBe('published');
  });

  it('should handle slugs with special characters (hyphens, numbers)', async () => {
    const specialSlug = 'web-dev-2024-v2-final';
    
    const service = await prisma.service.create({
      data: {
        title: 'Special Characters Test',
        slug: specialSlug,
        description: 'Testing special characters in slugs',
        status: 'published',
        featured: false,
        sort_order: 0,
        published_at: new Date(),
      },
    });
    
    createdServiceIds.push(service.id);
    
    const fetchedService = await getServiceBySlug(specialSlug);
    expect(fetchedService).not.toBeNull();
    expect(fetchedService?.slug).toBe(specialSlug);
  });

  it('should handle rapid service creation', async () => {
    // Create multiple services rapidly
    const slugs = [
      'rapid-test-1',
      'rapid-test-2',
      'rapid-test-3',
    ];
    
    // Create services sequentially to avoid timeout
    for (let i = 0; i < slugs.length; i++) {
      const service = await prisma.service.create({
        data: {
          title: `Rapid Test ${i + 1}`,
          slug: slugs[i],
          description: 'Testing rapid creation',
          status: 'published',
          featured: false,
          sort_order: i,
          published_at: new Date(),
        },
      });
      createdServiceIds.push(service.id);
    }
    
    // Verify all services can be fetched
    for (const slug of slugs) {
      const fetchedService = await getServiceBySlug(slug);
      expect(fetchedService).not.toBeNull();
      expect(fetchedService?.status).toBe('published');
    }
  }, 10000);

  it('should handle slug with maximum typical length', async () => {
    // Typical URL slug max length is around 100-200 characters
    const maxSlug = 'a'.repeat(100) + '-service';
    
    const service = await prisma.service.create({
      data: {
        title: 'Max Length Slug Test',
        slug: maxSlug,
        description: 'Testing maximum typical slug length',
        status: 'published',
        featured: false,
        sort_order: 0,
        published_at: new Date(),
      },
    });
    
    createdServiceIds.push(service.id);
    
    const fetchedService = await getServiceBySlug(maxSlug);
    expect(fetchedService).not.toBeNull();
    expect(fetchedService?.slug).toBe(maxSlug);
  });

  it('should handle slug with only numbers', async () => {
    const numericSlug = '12345-service';
    
    const service = await prisma.service.create({
      data: {
        title: 'Numeric Slug Test',
        slug: numericSlug,
        description: 'Testing numeric slugs',
        status: 'published',
        featured: false,
        sort_order: 0,
        published_at: new Date(),
      },
    });
    
    createdServiceIds.push(service.id);
    
    const fetchedService = await getServiceBySlug(numericSlug);
    expect(fetchedService).not.toBeNull();
    expect(fetchedService?.slug).toBe(numericSlug);
  });
});
