# Bugfix Requirements Document

## Introduction

This document addresses a critical deployment issue where dynamic service pages work perfectly on the local development server but return 404 errors when deployed to Vercel. The issue manifests as a "No published services available at the moment" message on Vercel, while the same pages display correctly with full content on localhost:3000.

The root cause is that during Vercel's build process, the `generateStaticParams` function in `app/(public)/services/[slug]/page.tsx` executes but cannot access the database or finds it empty. This results in an empty array being returned, causing Next.js to generate zero static pages. With `revalidate = 86400` (24 hours), the pages won't be regenerated until that period expires, leaving users with persistent 404 errors.

Static service pages (consulting, development, design) work correctly on both environments because they are not dependent on database queries during build time.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN Vercel builds the application and `generateStaticParams` runs THEN the database is either inaccessible or empty, causing the function to return an empty array

1.2 WHEN `generateStaticParams` returns an empty array during build THEN Next.js generates zero static pages for dynamic service routes

1.3 WHEN a user accesses a dynamic service page on Vercel (e.g., `/services/[slug]`) THEN the page returns a 404 error with the message "No published services available at the moment"

1.4 WHEN the same service page is accessed on localhost:3000 THEN the page renders correctly with full content, proving the data exists and the code logic is correct

### Expected Behavior (Correct)

2.1 WHEN Vercel builds the application and the database is empty or inaccessible THEN the system SHALL use Incremental Static Regeneration (ISR) or on-demand revalidation to generate pages at request time

2.2 WHEN a user accesses a dynamic service page on Vercel and the page was not pre-generated THEN the system SHALL fetch the service data at request time and render the page successfully

2.3 WHEN `generateStaticParams` cannot access the database during build THEN the system SHALL gracefully handle the error and allow runtime page generation instead of serving 404 errors

2.4 WHEN environment variables are properly configured on Vercel THEN the database SHALL be accessible during both build time and runtime

### Unchanged Behavior (Regression Prevention)

3.1 WHEN accessing static service pages (consulting, development, design) on Vercel THEN the system SHALL CONTINUE TO render these pages correctly

3.2 WHEN accessing dynamic service pages on localhost:3000 THEN the system SHALL CONTINUE TO render pages correctly with full content

3.3 WHEN a service has "draft" or non-published status THEN the system SHALL CONTINUE TO return a 404 error as intended

3.4 WHEN accessing a non-existent service slug THEN the system SHALL CONTINUE TO return a 404 error with appropriate messaging

3.5 WHEN the revalidation period (86400 seconds) expires THEN the system SHALL CONTINUE TO regenerate pages with fresh data from the database
