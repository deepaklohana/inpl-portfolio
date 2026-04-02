# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - On-Demand Page Generation When Build Fails
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to the concrete failing case - database inaccessible during build, user requests dynamic service page
  - Test that when `generateStaticParams` returns empty array (simulating database unavailable during Vercel build), requests to `/services/[slug]` for published services generate pages on-demand at request time
  - Mock `getServices` to return `[]` during build phase simulation
  - Simulate user request to `/services/web-development` (or any valid published service slug)
  - Assert page generates on-demand with status 200 and renders service content
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (returns 404 instead of generating on-demand - this proves the bug exists)
  - Document counterexamples found (e.g., "Request to /services/web-development returns 404 when generateStaticParams returns empty array")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Existing Functionality Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs:
    - Static pages (`/services/consulting`, `/services/development`, `/services/design`) render correctly
    - Localhost dynamic pages render correctly with database access
    - Draft services return 404 via `notFound()`
    - Non-existent service slugs return 404
    - Revalidation continues working after 24 hours
  - Write property-based tests capturing observed behavior patterns:
    - For all static service pages, response status is 200 and content renders
    - For all localhost requests to dynamic pages with valid slugs, response status is 200
    - For all services with status != 'published', `notFound()` is called
    - For all non-existent slugs, response returns 404
    - For all pages after revalidation period, fresh data is fetched
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Fix for Vercel service pages 404 error

  - [x] 3.1 Explicitly enable dynamic parameters
    - Add `export const dynamicParams = true` to `app/(public)/services/[slug]/page.tsx`
    - This ensures Next.js generates pages on-demand for slugs not returned by `generateStaticParams`
    - Makes fallback behavior explicit and documented
    - _Bug_Condition: isBugCondition(buildContext) where buildContext.phase == 'build' AND generateStaticParams() returns [] AND userRequestsServicePage('/services/[slug]')_
    - _Expected_Behavior: Page generates on-demand at request time with status 200 and renders service content_
    - _Preservation: Static pages, localhost behavior, draft/non-existent 404s, revalidation unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.2 Improve error handling in generateStaticParams
    - Enhance error logging in `generateStaticParams` function
    - Log whether database connection succeeded
    - Log the number of services found
    - Distinguish between "no services" vs "database error"
    - This provides diagnostic information in production logs
    - _Bug_Condition: Database inaccessible or empty during build phase_
    - _Expected_Behavior: Clear logging of database state and service count_
    - _Preservation: Existing error handling behavior unchanged_
    - _Requirements: 2.1, 2.2_

  - [ ]* 3.3 Add fallback static params (optional)
    - If database query fails or returns empty, return minimal set of known service slugs
    - Example: `[{ slug: 'consulting' }, { slug: 'development' }, { slug: 'design' }]`
    - Ensures at least some pages are pre-generated even if database unavailable
    - _Bug_Condition: Database unavailable during build_
    - _Expected_Behavior: Fallback slugs ensure minimal static page generation_
    - _Preservation: Does not affect runtime behavior or existing pages_
    - _Requirements: 2.1, 2.3_

  - [ ]* 3.4 Consider adjusting revalidation strategy (optional)
    - Evaluate reducing `revalidate` from 86400 (24 hours) to 3600 (1 hour)
    - Shorter period reduces window where 404 errors persist if static generation fails
    - Balance freshness with performance
    - Document decision in code comments
    - _Bug_Condition: Long revalidation period extends 404 error window_
    - _Expected_Behavior: Shorter revalidation reduces impact of build failures_
    - _Preservation: Revalidation mechanism unchanged, only timing adjusted_
    - _Requirements: 2.4_

  - [x] 3.5 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - On-Demand Page Generation Works
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed - pages generate on-demand)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** - No Regressions
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix:
      - Static pages still work
      - Localhost behavior unchanged
      - Draft services still return 404
      - Non-existent slugs still return 404
      - Revalidation still works

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise
  - Verify the fix works on Vercel deployment (may require manual testing)
  - Confirm dynamic service pages generate on-demand when not pre-generated
  - Confirm no regressions in existing functionality
