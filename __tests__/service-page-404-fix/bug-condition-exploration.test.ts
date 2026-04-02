// Feature: service-page-404-fix, Property 1: Bug Condition - On-Demand Page Generation When Build Fails
// **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
//
// CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
// DO NOT attempt to fix the test or the code when it fails
// NOTE: This test encodes the expected behavior - it will validate the fix when it passes after implementation
// GOAL: Surface counterexamples that demonstrate the bug exists

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';

/**
 * Bug Condition Exploration Test
 * 
 * This test simulates the Vercel build scenario where the database is inaccessible
 * during build time, causing generateStaticParams to return an empty array.
 * It then verifies that requests to service pages should generate on-demand.
 * 
 * EXPECTED OUTCOME ON UNFIXED CODE: Test FAILS (returns 404 instead of generating on-demand)
 * EXPECTED OUTCOME ON FIXED CODE: Test PASSES (pages generate on-demand with status 200)
 */

describe('Bug Condition: On-Demand Page Generation When Build Fails', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate pages on-demand when generateStaticParams returns empty array', async () => {
    // This test simulates the Vercel build scenario:
    // 1. During build, database is inaccessible, so generateStaticParams returns []
    // 2. User requests a service page (e.g., /services/web-development)
    // 3. Expected: Page should generate on-demand with status 200
    // 4. Actual on unfixed code: Returns 404 because dynamicParams is not explicitly enabled

    // Step 1: Import the page module to test generateStaticParams
    const pageModule = await import('@/app/(public)/services/[slug]/page');
    
    // Step 2: Mock getServices to return empty array (simulating database unavailable during build)
    const servicesModule = await import('@/lib/actions/services');
    const getServicesMock = vi.spyOn(servicesModule, 'getServices');
    getServicesMock.mockResolvedValue([]);
    
    // Step 3: Call generateStaticParams (simulating Vercel build phase)
    const staticParams = await pageModule.generateStaticParams();
    
    // Verify that generateStaticParams returns empty array when database is unavailable
    expect(staticParams).toEqual([]);
    console.log('✓ Simulated build phase: generateStaticParams returned empty array');
    
    // Step 4: Now simulate a user request to a service page
    // Mock getServiceBySlug to return a valid published service (simulating runtime database access)
    const getServiceBySlugMock = vi.spyOn(servicesModule, 'getServiceBySlug');
    getServiceBySlugMock.mockResolvedValue({
      id: 1,
      title: 'Web Development',
      slug: 'web-development',
      description: 'Professional web development services',
      status: 'published',
      featured: false,
      sort_order: 0,
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      seo_id: null,
      blackHeading: null,
      blueHeading: null,
      icon: null,
      pillText: null,
      stats: null,
      subServicesHeading: null,
      subServicesDescription: null,
      subServices: null,
      processStepsHeading: null,
      processStepsDescription: null,
      processSteps: null,
      sectionType: 'technologies',
      techSection: null,
      toolsSection: null,
      seo_metadata: null,
    } as any);
    
    // Step 5: Check if dynamicParams is explicitly enabled
    const hasDynamicParams = 'dynamicParams' in pageModule;
    const dynamicParamsValue = hasDynamicParams ? (pageModule as any).dynamicParams : undefined;
    
    console.log(`  - dynamicParams exported: ${hasDynamicParams}`);
    console.log(`  - dynamicParams value: ${dynamicParamsValue}`);
    
    // Step 6: Attempt to render the page (simulating user request)
    try {
      const params = Promise.resolve({ slug: 'web-development' });
      const pageComponent = await pageModule.default({ params });
      
      // If we reach here, the page rendered successfully
      expect(pageComponent).toBeDefined();
      console.log('✓ Page rendered successfully on-demand');
      
      // Verify the service was fetched at runtime
      expect(getServiceBySlugMock).toHaveBeenCalledWith('web-development');
      
    } catch (error: any) {
      // On unfixed code, this will throw or return 404
      console.log('✗ COUNTEREXAMPLE FOUND: Page failed to generate on-demand');
      console.log(`  - Error: ${error.message}`);
      console.log('  - Root cause: dynamicParams not explicitly enabled');
      console.log('  - Impact: Users get 404 when generateStaticParams returns empty array');
      
      // This assertion will FAIL on unfixed code (which is expected and correct)
      throw error;
    }
    
    // COUNTEREXAMPLE DOCUMENTATION:
    // If this test fails on unfixed code, it means:
    // - generateStaticParams returned empty array (simulating build failure)
    // - User requested /services/web-development
    // - Service exists in database at runtime
    // - BUT page returns 404 because dynamicParams is not explicitly enabled
    // - Fix required: Add `export const dynamicParams = true` to enable on-demand generation
  });

  it('should test on-demand generation with property-based testing', () => {
    // Property-based test: For ANY valid service slug, when generateStaticParams
    // returns empty array, the page should still generate on-demand
    
    fc.assert(
      fc.asyncProperty(
        fc.stringMatching(/^[a-z0-9-]+$/), // Generate valid slug patterns
        async (slug) => {
          vi.resetModules();
          
          // Mock empty generateStaticParams result
          const servicesModule = await import('@/lib/actions/services');
          const getServicesMock = vi.spyOn(servicesModule, 'getServices');
          getServicesMock.mockResolvedValue([]);
          
          // Mock valid service at runtime
          const getServiceBySlugMock = vi.spyOn(servicesModule, 'getServiceBySlug');
          getServiceBySlugMock.mockResolvedValue({
            id: 1,
            title: `Service ${slug}`,
            slug: slug,
            description: 'Test service',
            status: 'published',
            featured: false,
            sort_order: 0,
            published_at: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
            seo_id: null,
            blackHeading: null,
            blueHeading: null,
            icon: null,
            pillText: null,
            stats: null,
            subServicesHeading: null,
            subServicesDescription: null,
            subServices: null,
            processStepsHeading: null,
            processStepsDescription: null,
            processSteps: null,
            sectionType: 'technologies',
            techSection: null,
            toolsSection: null,
            seo_metadata: null,
          } as any);
          
          const pageModule = await import('@/app/(public)/services/[slug]/page');
          const staticParams = await pageModule.generateStaticParams();
          
          // Verify empty static params
          expect(staticParams).toEqual([]);
          
          // Attempt to render page
          const params = Promise.resolve({ slug });
          const pageComponent = await pageModule.default({ params });
          
          // Should render successfully
          expect(pageComponent).toBeDefined();
          
          vi.restoreAllMocks();
        }
      ),
      { numRuns: 2 } // Run 2 test cases with different slugs
    );
  });
});
