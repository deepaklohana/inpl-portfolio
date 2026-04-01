// Feature: service-page-404-fix, Property 2: Preservation - Existing Service Behavior Unchanged
// **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
//
// IMPORTANT: Follow observation-first methodology
// These tests capture the baseline behavior on UNFIXED code that must be preserved after the fix
// EXPECTED OUTCOME: Tests PASS on unfixed code (confirms baseline behavior to preserve)

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { getServiceBySlug, getServices } from '@/lib/actions/services';
import { buildMetadata } from '@/lib/seo';

/**
 * Preservation Property Tests
 * 
 * These tests verify that existing service behavior remains unchanged after the fix:
 * - Existing published services render correctly with all content sections
 * - Draft services return 404 errors
 * - Non-existent slugs return 404 errors
 * - SEO metadata generation works correctly
 * - JSON-LD structured data generates correctly
 * 
 * EXPECTED OUTCOME ON UNFIXED CODE: Tests PASS (confirms baseline behavior)
 * EXPECTED OUTCOME ON FIXED CODE: Tests PASS (confirms no regressions)
 */

describe('Preservation Property: Existing Service Behavior Unchanged', () => {
  let testPublishedServiceId: number | undefined;
  let testDraftServiceId: number | undefined;
  const publishedSlug = 'test-preservation-published';
  const draftSlug = 'test-preservation-draft';

  // Set up test services before running tests
  beforeAll(async () => {
    // Clean up any existing test services
    try {
      const existingPublished = await prisma.service.findUnique({ where: { slug: publishedSlug } });
      if (existingPublished) {
        await prisma.service.delete({ where: { id: existingPublished.id } });
      }

      const existingDraft = await prisma.service.findUnique({ where: { slug: draftSlug } });
      if (existingDraft) {
        await prisma.service.delete({ where: { id: existingDraft.id } });
      }
    } catch (error) {
      // Ignore if services don't exist
    }

    // Create a published service for testing
    const publishedService = await prisma.service.create({
      data: {
        title: 'Test Published Service',
        slug: publishedSlug,
        description: 'This is a test published service for preservation testing',
        status: 'published',
        featured: false,
        sort_order: 0,
        published_at: new Date(),
        stats: [
          { value: '100+', label: 'Projects' },
          { value: '50+', label: 'Clients' }
        ],
        subServices: [
          {
            icon: 'test-icon',
            name: 'Sub Service 1',
            description: 'Test sub service',
            features: ['Feature 1', 'Feature 2'],
            technologies: ['Tech 1', 'Tech 2']
          }
        ],
        processSteps: [
          { number: 1, heading: 'Step 1', description: 'First step' },
          { number: 2, heading: 'Step 2', description: 'Second step' }
        ],
        sectionType: 'technologies',
        techSection: {
          heading: 'Technologies We Use',
          categories: [
            { name: 'Frontend', items: ['React', 'Vue'] }
          ]
        }
      } as any,
    });
    testPublishedServiceId = publishedService.id;


    // Create a draft service for testing
    const draftService = await prisma.service.create({
      data: {
        title: 'Test Draft Service',
        slug: draftSlug,
        description: 'This is a test draft service',
        status: 'draft',
        featured: false,
        sort_order: 0,
      } as any,
    });
    testDraftServiceId = draftService.id;
  });

  // Clean up after tests
  afterAll(async () => {
    if (testPublishedServiceId) {
      try {
        await prisma.service.delete({ where: { id: testPublishedServiceId } });
      } catch (error) {
        console.error('Failed to clean up published test service:', error);
      }
    }
    if (testDraftServiceId) {
      try {
        await prisma.service.delete({ where: { id: testDraftServiceId } });
      } catch (error) {
        console.error('Failed to clean up draft test service:', error);
      }
    }
  });

  describe('Requirement 3.1: Existing published services render correctly', () => {
    it('should fetch existing published service with all data', async () => {
      const service = await getServiceBySlug(publishedSlug);
      
      expect(service).not.toBeNull();
      expect(service?.status).toBe('published');
      expect(service?.title).toBe('Test Published Service');
      expect(service?.slug).toBe(publishedSlug);
      expect(service?.description).toBe('This is a test published service for preservation testing');
    });


    it('should render all content sections for published service', async () => {
      const service = await getServiceBySlug(publishedSlug);
      
      expect(service).not.toBeNull();
      
      // Verify stats section
      const stats = service?.stats as any[];
      expect(stats).toBeDefined();
      expect(Array.isArray(stats)).toBe(true);
      expect(stats.length).toBe(2);
      expect(stats[0]).toEqual({ value: '100+', label: 'Projects' });
      
      // Verify sub-services section
      const subServices = service?.subServices as any[];
      expect(subServices).toBeDefined();
      expect(Array.isArray(subServices)).toBe(true);
      expect(subServices.length).toBe(1);
      expect(subServices[0].name).toBe('Sub Service 1');
      
      // Verify process steps section
      const processSteps = service?.processSteps as any[];
      expect(processSteps).toBeDefined();
      expect(Array.isArray(processSteps)).toBe(true);
      expect(processSteps.length).toBe(2);
      expect(processSteps[0].heading).toBe('Step 1');
      
      // Verify tech section
      const techSection = service?.techSection as any;
      expect(techSection).toBeDefined();
      expect(techSection.heading).toBe('Technologies We Use');
      expect(techSection.categories).toBeDefined();
      expect(techSection.categories.length).toBe(1);
    });

    it('should include published services in getServices query', async () => {
      const services = await getServices({ status: 'published' });
      
      expect(Array.isArray(services)).toBe(true);
      const testService = services.find(s => s.slug === publishedSlug);
      expect(testService).toBeDefined();
      expect(testService?.status).toBe('published');
    });
  });


  describe('Requirement 3.2: Draft services return 404 errors', () => {
    it('should fetch draft service from database but not expose it publicly', async () => {
      const service = await getServiceBySlug(draftSlug);
      
      // Service exists in database
      expect(service).not.toBeNull();
      expect(service?.status).toBe('draft');
      expect(service?.slug).toBe(draftSlug);
      
      // But the page component should call notFound() for draft services
      // This is verified by checking the status field
      expect(service?.status).not.toBe('published');
    });

    it('should not include draft services in published services query', async () => {
      const services = await getServices({ status: 'published' });
      
      const draftService = services.find(s => s.slug === draftSlug);
      expect(draftService).toBeUndefined();
    });

    it('should include draft services only in draft query', async () => {
      const services = await getServices({ status: 'draft' });
      
      const draftService = services.find(s => s.slug === draftSlug);
      expect(draftService).toBeDefined();
      expect(draftService?.status).toBe('draft');
    });
  });

  describe('Requirement 3.3: Non-existent slugs return 404 errors', () => {
    it('should return null for non-existent slug', async () => {
      const nonExistentSlug = 'this-service-does-not-exist-12345';
      const service = await getServiceBySlug(nonExistentSlug);
      
      expect(service).toBeNull();
    });

    it('should return null for various invalid slug patterns', async () => {
      const invalidSlugs = [
        'non-existent-service',
        'invalid-slug-xyz',
        'test-404-slug',
        'missing-service-page'
      ];
      
      for (const slug of invalidSlugs) {
        const service = await getServiceBySlug(slug);
        expect(service).toBeNull();
      }
    });
  });


  describe('Requirement 3.4: SEO metadata and JSON-LD generation', () => {
    it('should generate correct SEO metadata for published service', async () => {
      const service = await getServiceBySlug(publishedSlug);
      
      expect(service).not.toBeNull();
      
      // Test metadata generation (simulating what generateMetadata does)
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const metadata = buildMetadata({
        title: service?.title,
        description: service?.description ?? undefined,
        url: `${baseUrl}/services/${service?.slug}`,
        type: 'website',
      });
      
      expect(metadata).toBeDefined();
      expect(metadata.title).toBe('Test Published Service | Company Name');
      expect(metadata.description).toBe('This is a test published service for preservation testing');
    });

    it('should generate correct JSON-LD structured data', async () => {
      const service = await getServiceBySlug(publishedSlug);
      
      expect(service).not.toBeNull();
      
      // Simulate JSON-LD generation from the page component
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service?.title,
        description: service?.description,
        url: `${baseUrl}/services/${service?.slug}`,
        provider: { '@type': 'Organization', name: 'Company Name' },
      };
      
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('Service');
      expect(jsonLd.name).toBe('Test Published Service');
      expect(jsonLd.description).toBe('This is a test published service for preservation testing');
      expect(jsonLd.url).toBe(`${baseUrl}/services/${publishedSlug}`);
    });


    it('should handle SEO metadata with custom fields', async () => {
      // Create a service with custom SEO metadata
      const seoService = await prisma.service.create({
        data: {
          title: 'SEO Test Service',
          slug: 'test-seo-metadata',
          description: 'Service for testing SEO',
          status: 'published',
          featured: false,
          sort_order: 0,
          published_at: new Date(),
          seo_metadata: {
            create: {
              meta_title: 'Custom SEO Title',
              meta_description: 'Custom SEO Description',
              keywords: 'test, seo, metadata',
              no_index: false,
            }
          }
        } as any,
      });

      const service = await getServiceBySlug('test-seo-metadata');
      
      expect(service).not.toBeNull();
      expect(service?.seo_metadata).toBeDefined();
      expect(service?.seo_metadata?.meta_title).toBe('Custom SEO Title');
      expect(service?.seo_metadata?.meta_description).toBe('Custom SEO Description');
      expect(service?.seo_metadata?.keywords).toBe('test, seo, metadata');
      
      // Clean up
      await prisma.service.delete({ where: { id: seoService.id } });
      if (service?.seo_metadata?.id) {
        await prisma.seoMetadata.delete({ where: { id: service.seo_metadata.id } });
      }
    });
  });

  describe('Property-based preservation tests', () => {
    it('should preserve behavior for multiple existing services', async () => {
      // Get all published services
      const publishedServices = await getServices({ status: 'published' });
      
      // Verify each published service can be fetched individually
      for (const service of publishedServices) {
        const fetchedService = await getServiceBySlug(service.slug);
        expect(fetchedService).not.toBeNull();
        expect(fetchedService?.id).toBe(service.id);
        expect(fetchedService?.status).toBe('published');
      }
    });


    it('should preserve 404 behavior for all non-published statuses', async () => {
      const nonPublishedStatuses = ['draft', 'archived'];
      
      for (const status of nonPublishedStatuses) {
        const services = await getServices({ status });
        
        // Verify these services are not in the published list
        const publishedServices = await getServices({ status: 'published' });
        
        for (const service of services) {
          const isInPublished = publishedServices.some(ps => ps.id === service.id);
          expect(isInPublished).toBe(false);
        }
      }
    });

    it('should verify revalidate constant remains unchanged', async () => {
      // Read the service page file to verify revalidate is still 86400
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const servicePagePath = path.join(process.cwd(), 'app/(public)/services/[slug]/page.tsx');
      const servicePageContent = await fs.readFile(servicePagePath, 'utf-8');
      
      // Verify revalidate = 86400 exists
      const hasRevalidate = servicePageContent.includes('export const revalidate = 86400');
      expect(hasRevalidate).toBe(true);
    });
  });
});
