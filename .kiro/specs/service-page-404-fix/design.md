# Service Page 404 Fix - Bugfix Design

## Overview

This bugfix addresses a critical issue where newly created service pages return 404 errors until the Next.js server is restarted. The root cause is the missing `generateStaticParams` function in the dynamic route `app/(public)/services/[slug]/page.tsx`. Without this function, Next.js cannot discover which dynamic routes exist, preventing Incremental Static Regeneration (ISR) from working correctly for new services.

The fix involves adding a `generateStaticParams` function that fetches all published service slugs from the database, enabling Next.js to generate and revalidate static pages automatically. This ensures newly created services are immediately accessible without requiring a server restart.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when a new service is created with "published" status and accessed via `/services/[slug]` before server restart
- **Property (P)**: The desired behavior - newly created published services should be immediately accessible without server restart
- **Preservation**: Existing service page rendering, 404 behavior for drafts/non-existent slugs, and SEO metadata generation must remain unchanged
- **generateStaticParams**: Next.js function that provides a list of dynamic route parameters to pre-render at build time and revalidate during ISR
- **ISR (Incremental Static Regeneration)**: Next.js feature that allows static pages to be updated after build time based on the revalidate period
- **getServices**: Function in `lib/actions/services.ts` that fetches services from the database with optional filtering by status
- **revalidate**: Export constant (currently 86400 seconds / 24 hours) that tells Next.js how often to regenerate static pages

## Bug Details

### Bug Condition

The bug manifests when a user creates a new service from the admin panel with "published" status and attempts to access it via the dynamic route `/services/[slug]`. The page returns a 404 error because Next.js has no knowledge of the new slug without the `generateStaticParams` function. The service only becomes accessible after restarting the development server, which forces Next.js to re-discover available routes.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { serviceSlug: string, serverRestartOccurred: boolean }
  OUTPUT: boolean
  
  RETURN serviceExists(input.serviceSlug)
         AND serviceIsPublished(input.serviceSlug)
         AND NOT input.serverRestartOccurred
         AND NOT generateStaticParamsExists()
END FUNCTION
```

### Examples

- **Example 1**: Admin creates service with slug "web-development" and status "published" → User navigates to `/services/web-development` → Receives 404 error (Expected: Service page renders)
- **Example 2**: Admin creates service with slug "mobile-apps" and status "published" → Server is restarted → User navigates to `/services/mobile-apps` → Service page renders correctly (Expected: Should work without restart)
- **Example 3**: Admin creates service with slug "consulting" and status "draft" → User navigates to `/services/consulting` → Receives 404 error (Expected: 404 is correct for draft services)
- **Edge Case**: Service exists with slug "api-development" but was created before the fix → User navigates to `/services/api-development` → Service page renders correctly (Expected: Existing services continue to work)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Existing published service pages must continue to render correctly with all content sections (header, stats, sub-services, process steps, tech/tools sections)
- Services with "draft" or non-published status must continue to return 404 errors
- Non-existent service slugs must continue to return 404 errors
- SEO metadata generation and JSON-LD structured data must remain unchanged
- The revalidation period (86400 seconds) must remain unchanged
- The `generateMetadata` function behavior must remain unchanged

**Scope:**
All inputs that do NOT involve newly created published services (i.e., existing services, draft services, non-existent slugs) should be completely unaffected by this fix. This includes:
- Accessing existing published service pages
- Accessing draft or unpublished service pages (should still 404)
- Accessing non-existent service slugs (should still 404)
- SEO metadata generation for any service
- JSON-LD structured data generation

## Hypothesized Root Cause

Based on the bug description and Next.js documentation, the root cause is:

1. **Missing generateStaticParams Function**: The dynamic route `app/(public)/services/[slug]/page.tsx` does not export a `generateStaticParams` function, which is required for Next.js to know which dynamic route parameters exist at build time and during ISR revalidation.

2. **ISR Cannot Discover New Routes**: Without `generateStaticParams`, Next.js cannot discover newly created service slugs during the revalidation period. The `revalidate = 86400` export only tells Next.js how often to regenerate pages, but it doesn't tell Next.js which pages exist.

3. **Server Restart Forces Route Discovery**: When the server restarts, Next.js re-scans the file system and database connections, which allows it to discover the new routes. This is why the bug disappears after restart.

4. **Next.js App Router Behavior**: In the Next.js App Router, dynamic routes require `generateStaticParams` to enable static generation and ISR. Without it, the route falls back to dynamic rendering, but new routes created after build time are not automatically discovered.

## Correctness Properties

Property 1: Bug Condition - New Published Services Are Immediately Accessible

_For any_ newly created service where the service has "published" status and a valid slug, the service page at `/services/[slug]` SHALL be immediately accessible without requiring a server restart, rendering all service content correctly within the revalidation period (86400 seconds).

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Existing Service Behavior Unchanged

_For any_ service access that is NOT a newly created published service (existing services, draft services, non-existent slugs), the system SHALL produce exactly the same behavior as before the fix, preserving correct rendering for existing published services, 404 responses for drafts and non-existent slugs, and all SEO metadata generation.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

**File**: `app/(public)/services/[slug]/page.tsx`

**Function**: Add new `generateStaticParams` export

**Specific Changes**:

1. **Add generateStaticParams Function**: Export an async function that fetches all published service slugs from the database
   - Import `getServices` from `@/lib/actions/services`
   - Call `getServices({ status: 'published' })` to fetch only published services
   - Map the results to return an array of objects with `slug` property
   - Handle errors gracefully by returning an empty array

2. **Position in File**: Add the function after the `revalidate` export and before the `generateMetadata` function to maintain logical grouping of Next.js exports

3. **Type Safety**: Ensure the return type matches Next.js expectations: `Promise<{ slug: string }[]>`

4. **Error Handling**: Wrap the database call in try-catch to prevent build failures if the database is unavailable

5. **No Changes to Existing Logic**: The `generateMetadata` and default export functions remain completely unchanged, preserving all existing behavior

**Implementation Pseudocode**:
```typescript
export async function generateStaticParams() {
  try {
    const services = await getServices({ status: 'published' });
    return services.map((service) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for services:', error);
    return [];
  }
}
```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code by attempting to access newly created services, then verify the fix works correctly by confirming immediate accessibility and preserves existing behavior for all other service access patterns.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm that newly created published services return 404 errors without server restart.

**Test Plan**: Create a new service via the admin panel with "published" status, then attempt to access it via the frontend route without restarting the server. Run these tests on the UNFIXED code to observe 404 failures and confirm the root cause.

**Test Cases**:
1. **New Service 404 Test**: Create service with slug "test-service-1" and status "published" → Access `/services/test-service-1` → Expect 404 (will fail on unfixed code)
2. **Server Restart Recovery Test**: Create service with slug "test-service-2" → Restart server → Access `/services/test-service-2` → Expect success (confirms data exists)
3. **Draft Service 404 Test**: Create service with slug "test-draft" and status "draft" → Access `/services/test-draft` → Expect 404 (should work correctly even on unfixed code)
4. **Non-Existent Slug Test**: Access `/services/non-existent-slug` → Expect 404 (should work correctly even on unfixed code)

**Expected Counterexamples**:
- Newly created published services return 404 errors without server restart
- The same services become accessible after server restart
- Possible causes: missing `generateStaticParams`, ISR cannot discover new routes, Next.js has no knowledge of new slugs

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds (newly created published services), the fixed function produces the expected behavior (immediate accessibility).

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := accessServicePage(input.serviceSlug)
  ASSERT result.statusCode = 200
  ASSERT result.pageRendersCorrectly = true
  ASSERT result.requiresServerRestart = false
END FOR
```

**Test Plan**: After implementing the fix, create new services with "published" status and verify they are immediately accessible without server restart. Wait for the revalidation period to confirm ISR picks up new services automatically.

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold (existing services, draft services, non-existent slugs), the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT accessServicePage_original(input) = accessServicePage_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain (existing slugs, draft slugs, invalid slugs)
- It catches edge cases that manual unit tests might miss (special characters in slugs, very long slugs, etc.)
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for existing services, draft services, and non-existent slugs, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Existing Service Preservation**: Observe that existing published services render correctly on unfixed code → Write test to verify this continues after fix
2. **Draft Service 404 Preservation**: Observe that draft services return 404 on unfixed code → Write test to verify this continues after fix
3. **Non-Existent Slug 404 Preservation**: Observe that non-existent slugs return 404 on unfixed code → Write test to verify this continues after fix
4. **SEO Metadata Preservation**: Observe that SEO metadata generates correctly on unfixed code → Write test to verify this continues after fix
5. **JSON-LD Preservation**: Observe that JSON-LD structured data generates correctly on unfixed code → Write test to verify this continues after fix

### Unit Tests

- Test that `generateStaticParams` returns an array of objects with `slug` property
- Test that `generateStaticParams` only returns published services (not drafts)
- Test that `generateStaticParams` handles database errors gracefully (returns empty array)
- Test that newly created services are accessible immediately after creation
- Test that draft services continue to return 404
- Test that non-existent slugs continue to return 404

### Property-Based Tests

- Generate random service data with various statuses and verify only published services are included in `generateStaticParams`
- Generate random slug patterns (valid and invalid) and verify preservation of 404 behavior for non-existent slugs
- Generate random service configurations and verify SEO metadata generation remains unchanged
- Test that all existing published services continue to render correctly across many scenarios

### Integration Tests

- Test full flow: Create service in admin → Verify immediate accessibility on frontend → Verify all content sections render
- Test revalidation: Create service → Wait for revalidation period → Verify service is still accessible
- Test status transitions: Create draft service → Verify 404 → Publish service → Verify immediate accessibility
- Test that SEO metadata and JSON-LD structured data generate correctly for newly created services
