# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - New Published Services Are Immediately Accessible
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases - newly created published services accessed without server restart
  - Test that newly created services with "published" status are immediately accessible at `/services/[slug]` without server restart
  - The test assertions should verify: statusCode = 200, page renders correctly, no server restart required
  - Create a new service via admin panel with slug "test-service-new" and status "published"
  - Attempt to access `/services/test-service-new` without restarting the server
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS with 404 error (this is correct - it proves the bug exists)
  - Document counterexamples found: which newly created services return 404, error messages, timing observations
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Existing Service Behavior Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (existing services, draft services, non-existent slugs)
  - Write property-based tests capturing observed behavior patterns:
    - Existing published services render correctly with all content sections
    - Draft services return 404 errors
    - Non-existent slugs return 404 errors
    - SEO metadata generation works correctly
    - JSON-LD structured data generates correctly
  - Property-based testing generates many test cases for stronger guarantees across slug patterns and service configurations
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Fix for service page 404 on newly created services

  - [x] 3.1 Add generateStaticParams function to app/(public)/services/[slug]/page.tsx
    - Import `getServices` from `@/lib/actions/services`
    - Add `generateStaticParams` export after the `revalidate` export and before `generateMetadata`
    - Fetch all published services using `getServices({ status: 'published' })`
    - Map results to return array of objects with `slug` property: `{ slug: string }[]`
    - Wrap database call in try-catch block to handle errors gracefully
    - Return empty array on error to prevent build failures
    - Add console.error for debugging if database call fails
    - Ensure return type matches Next.js expectations: `Promise<{ slug: string }[]>`
    - _Bug_Condition: isBugCondition(input) where serviceExists(input.serviceSlug) AND serviceIsPublished(input.serviceSlug) AND NOT input.serverRestartOccurred AND NOT generateStaticParamsExists()_
    - _Expected_Behavior: For newly created published services, statusCode = 200, pageRendersCorrectly = true, requiresServerRestart = false_
    - _Preservation: Existing published services continue to render correctly, draft services continue to return 404, non-existent slugs continue to return 404, SEO metadata and JSON-LD generation remain unchanged_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 3.4_

  - [x] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - New Published Services Are Immediately Accessible
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - Create a new service with "published" status and verify immediate accessibility without server restart
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2_

  - [x] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Existing Service Behavior Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - Verify existing published services still render correctly
    - Verify draft services still return 404
    - Verify non-existent slugs still return 404
    - Verify SEO metadata generation unchanged
    - Verify JSON-LD structured data unchanged
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [x] 4. Checkpoint - Ensure all tests pass
  - Verify bug condition test passes (newly created services are immediately accessible)
  - Verify preservation tests pass (existing behavior unchanged)
  - Run full test suite to ensure no regressions
  - Test edge cases: very long slugs, special characters, rapid service creation
  - Ensure all tests pass, ask the user if questions arise
