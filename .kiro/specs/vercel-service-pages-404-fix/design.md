# Vercel Service Pages 404 Fix - Bugfix Design

## Overview

This bugfix addresses a critical deployment issue where dynamic service pages (`/services/[slug]`) return 404 errors on Vercel despite working correctly on localhost. The root cause is that `generateStaticParams` executes during Vercel's build phase when the database is either inaccessible or empty, resulting in zero static pages being generated. With a 24-hour revalidation period, users experience persistent 404 errors until the cache expires.

The fix strategy involves implementing a fallback mechanism using Next.js's `dynamicParams` configuration and adjusting the ISR strategy to handle build-time database unavailability gracefully. This ensures pages can be generated on-demand at request time when they weren't pre-generated during the build.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when `generateStaticParams` runs during Vercel's build phase and the database is inaccessible or empty, returning an empty array
- **Property (P)**: The desired behavior - dynamic service pages should be generated on-demand at request time when not pre-generated, successfully rendering with database content
- **Preservation**: Existing functionality that must remain unchanged - static pages work correctly, localhost behavior unchanged, proper 404s for draft/non-existent services, revalidation continues working
- **generateStaticParams**: Next.js App Router function in `app/(public)/services/[slug]/page.tsx` that pre-generates static pages at build time by returning an array of route parameters
- **dynamicParams**: Next.js configuration option that controls whether dynamic routes not returned by `generateStaticParams` can be generated on-demand (default: true in App Router)
- **ISR (Incremental Static Regeneration)**: Next.js feature that allows static pages to be regenerated after deployment using the `revalidate` export
- **Build Phase**: The period during Vercel deployment when Next.js compiles the application and pre-generates static pages, before the application is live
- **Runtime Phase**: The period after deployment when the application is live and handling user requests

## Bug Details

### Bug Condition

The bug manifests when Vercel builds the application and `generateStaticParams` attempts to query the database to retrieve published services. During the build phase, the database connection is either not established, environment variables are not properly configured, or the database is genuinely empty. This causes `getServices({ status: 'published' })` to return an empty array, which `generateStaticParams` then returns to Next.js.

With an empty array from `generateStaticParams` and a 24-hour `revalidate` period, Next.js generates zero static pages for the `[slug]` route. When users request these pages on Vercel, they receive 404 errors because the pages don't exist in the static cache and aren't being generated on-demand.

**Formal Specification:**
```
FUNCTION isBugCondition(buildContext)
  INPUT: buildContext of type BuildEnvironment
  OUTPUT: boolean
  
  RETURN buildContext.phase == 'build'
         AND (buildContext.databaseAccessible == false 
              OR buildContext.databaseEmpty == true
              OR buildContext.envVarsIncomplete == true)
         AND generateStaticParams() returns []
         AND revalidate == 86400
         AND dynamicParams == true (default)
         AND userRequestsServicePage('/services/[slug]')
END FUNCTION
```

### Examples

- **Example 1**: User navigates to `/services/web-development` on Vercel → receives 404 error with "No published services available at the moment" message, despite the service existing in the database
- **Example 2**: Same URL `/services/web-development` on localhost:3000 → renders correctly with full content, proving the data exists and page logic works
- **Example 3**: Static pages like `/services/consulting`, `/services/development`, `/services/design` → work correctly on both Vercel and localhost because they don't depend on `generateStaticParams`
- **Edge Case**: After 24 hours (86400 seconds), the revalidation period expires → pages may start working if database is now accessible, but this is an unacceptable user experience

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Static service pages (`/services/consulting`, `/services/development`, `/services/design`) must continue to render correctly on Vercel
- Dynamic service pages on localhost:3000 must continue to render correctly with full content
- Services with "draft" or "archived" status must continue to return 404 errors as intended (via `notFound()` call)
- Non-existent service slugs must continue to return 404 errors with appropriate messaging
- The 24-hour revalidation period must continue to regenerate pages with fresh database data after expiration
- Mouse clicks, navigation, and all other user interactions must remain unchanged

**Scope:**
All inputs that do NOT involve accessing a dynamic service page on Vercel during the initial 24-hour period after a build with an empty `generateStaticParams` result should be completely unaffected by this fix. This includes:
- Static page requests on any environment
- Localhost development server requests
- Requests for draft or non-existent services (should still 404)
- Requests after the revalidation period expires
- Admin panel functionality for managing services

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Database Connection During Build**: The Vercel build environment may not have access to the production database, or the `DATABASE_URL` environment variable may not be available during the build phase
   - Vercel separates build-time and runtime environment variables
   - Database connections during build may be blocked for security or performance reasons
   - The Prisma client may not be properly initialized during the build phase

2. **Empty Database During Build**: The database may be genuinely empty when the build runs, especially if:
   - The build runs before data is seeded
   - The build uses a different database instance than runtime
   - Database migrations haven't completed when `generateStaticParams` executes

3. **Error Handling in generateStaticParams**: The current implementation catches errors and returns an empty array, which silently fails
   - The `try/catch` block in `generateStaticParams` logs the error but returns `[]`
   - Next.js interprets the empty array as "no pages to generate" rather than "generation failed"
   - This prevents fallback to on-demand generation

4. **Missing dynamicParams Configuration**: While `dynamicParams` defaults to `true` in App Router, it may not be explicitly configured
   - The absence of explicit configuration could lead to unexpected behavior
   - The interaction between `generateStaticParams` returning `[]` and `dynamicParams` may not trigger on-demand generation as expected

5. **Revalidation Strategy Mismatch**: The 24-hour `revalidate` period is appropriate for content that changes infrequently, but it creates a long window where 404 errors persist
   - The combination of failed static generation + long revalidation = extended downtime
   - No fallback mechanism exists to generate pages on-demand when static generation fails

## Correctness Properties

Property 1: Bug Condition - On-Demand Page Generation

_For any_ request to a dynamic service page (`/services/[slug]`) on Vercel where the page was not pre-generated during build (because `generateStaticParams` returned an empty array), the fixed implementation SHALL generate the page on-demand at request time by querying the database, successfully rendering the page with full content if the service exists and is published.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Existing Functionality

_For any_ request that does NOT involve a dynamic service page on Vercel during the initial post-build period (static pages, localhost requests, draft services, non-existent services, post-revalidation requests), the fixed implementation SHALL produce exactly the same behavior as the original implementation, preserving all existing functionality including proper 404 responses, revalidation behavior, and static page rendering.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct (database inaccessible during build or `generateStaticParams` failing silently):

**File**: `app/(public)/services/[slug]/page.tsx`

**Function**: `generateStaticParams` and page configuration

**Specific Changes**:

1. **Explicitly Enable Dynamic Parameters**: Add `export const dynamicParams = true` to ensure Next.js generates pages on-demand for slugs not returned by `generateStaticParams`
   - This makes the fallback behavior explicit and documented
   - Ensures on-demand generation is enabled even if `generateStaticParams` returns an empty array

2. **Improve Error Handling in generateStaticParams**: Enhance the error logging to provide more diagnostic information
   - Log whether the database connection succeeded
   - Log the number of services found
   - Distinguish between "no services" vs "database error"
   - This helps diagnose the root cause in production logs

3. **Add Fallback Static Params**: Return a minimal set of known service slugs as a fallback
   - If database query fails, return an array with common/known service slugs
   - This ensures at least some pages are pre-generated even if the database is unavailable
   - Example: `[{ slug: 'consulting' }, { slug: 'development' }, { slug: 'design' }]`

4. **Consider Adjusting Revalidation Strategy**: Optionally reduce the `revalidate` period or use on-demand revalidation
   - Current 24-hour period is very long for a bug scenario
   - Consider reducing to 3600 (1 hour) or using `revalidate: 60` with on-demand revalidation
   - This reduces the window where 404 errors persist if static generation fails

5. **Add Build-Time Database Check**: Optionally add a check to detect if the database is accessible during build
   - Log a warning if `getServices` returns an empty array
   - This provides visibility into whether the issue is "no data" vs "no connection"

**Alternative Approach** (if database is intentionally unavailable during build):

**File**: `app/(public)/services/[slug]/page.tsx`

**Changes**:
1. **Remove generateStaticParams entirely**: Rely solely on on-demand generation with ISR
   - Set `export const dynamicParams = true` explicitly
   - Keep `export const revalidate = 86400` for caching
   - All pages generate on first request, then cache for 24 hours

2. **Adjust Revalidation**: Use a shorter revalidation period (e.g., 3600 seconds = 1 hour)
   - Balances freshness with performance
   - Reduces cache staleness window

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code by simulating Vercel's build environment, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis by simulating the Vercel build environment where the database is inaccessible.

**Test Plan**: Write tests that mock the database connection to return empty results during `generateStaticParams` execution, simulating Vercel's build phase. Then simulate user requests to dynamic service pages and observe 404 errors. Run these tests on the UNFIXED code to confirm the bug manifests as described.

**Test Cases**:
1. **Empty generateStaticParams Test**: Mock `getServices` to return `[]` during build, verify `generateStaticParams` returns empty array (will demonstrate the bug on unfixed code)
2. **Database Unavailable Test**: Mock `getServices` to throw an error during build, verify `generateStaticParams` catches error and returns `[]` (will demonstrate silent failure on unfixed code)
3. **Page Request After Empty Build Test**: After simulating empty `generateStaticParams`, request `/services/web-development` and verify it returns 404 (will fail on unfixed code without `dynamicParams`)
4. **Localhost Behavior Test**: Verify the same page request works correctly on localhost with database access (will pass, confirming the issue is environment-specific)

**Expected Counterexamples**:
- `generateStaticParams` returns `[]` when database is unavailable during build
- User requests to `/services/[slug]` return 404 errors on Vercel
- Same requests work correctly on localhost
- Possible causes: database connection failure, missing environment variables, empty database, or silent error handling

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds (database unavailable during build, user requests dynamic page), the fixed function produces the expected behavior (page generates on-demand).

**Pseudocode:**
```
FOR ALL buildContext WHERE isBugCondition(buildContext) DO
  // Simulate build with empty generateStaticParams
  staticParams := generateStaticParams_fixed() // returns [] or fallback slugs
  
  // Simulate user request to dynamic page
  response := requestServicePage('/services/web-development')
  
  // Assert page generates on-demand and renders correctly
  ASSERT response.status == 200
  ASSERT response.body contains service content
  ASSERT response.body does NOT contain "404" or "not found"
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold (static pages, localhost, draft services, non-existent services), the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL request WHERE NOT isBugCondition(request.context) DO
  originalResponse := handleRequest_original(request)
  fixedResponse := handleRequest_fixed(request)
  ASSERT originalResponse == fixedResponse
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain (different slugs, contexts, service states)
- It catches edge cases that manual unit tests might miss (unusual slugs, timing issues, cache states)
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for static pages, localhost requests, and 404 scenarios, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Static Page Preservation**: Verify `/services/consulting`, `/services/development`, `/services/design` continue to work on both Vercel and localhost
2. **Localhost Behavior Preservation**: Verify all dynamic service pages continue to work correctly on localhost:3000
3. **Draft Service 404 Preservation**: Verify services with `status: 'draft'` continue to return 404 via `notFound()`
4. **Non-Existent Service 404 Preservation**: Verify requests to `/services/non-existent-slug` continue to return 404
5. **Revalidation Preservation**: Verify pages continue to revalidate after 24 hours and fetch fresh data
6. **Metadata Generation Preservation**: Verify `generateMetadata` continues to work correctly for all service pages

### Unit Tests

- Test `generateStaticParams` with mocked database returning empty array
- Test `generateStaticParams` with mocked database throwing error
- Test `generateStaticParams` with mocked database returning valid services
- Test page rendering with `dynamicParams` enabled when slug not in static params
- Test `notFound()` is called for draft services
- Test `notFound()` is called for non-existent slugs
- Test metadata generation for published services

### Property-Based Tests

- Generate random service slugs and verify pages render correctly when services exist in database
- Generate random service states (published, draft, archived) and verify correct 404 behavior for non-published
- Generate random build scenarios (empty DB, partial DB, full DB) and verify pages always render or 404 appropriately
- Test that all static pages continue to work across many request scenarios
- Test that localhost behavior is preserved across many service configurations

### Integration Tests

- Test full deployment flow: build with empty database → user requests page → page generates on-demand
- Test full deployment flow: build with populated database → user requests page → page serves from static cache
- Test revalidation flow: page cached → 24 hours pass → page regenerates with fresh data
- Test switching between environments (localhost → Vercel) and verify consistent behavior
- Test admin panel: create service → publish → verify page accessible on Vercel without rebuild
