# Implementation Plan: Service Page Redesign

## Overview

Migrate from the existing `ServiceCategory` + `Service` two-table structure to a single self-contained `Service` model with JSON fields for all page sections. Rebuild the public service page as a data-driven layout and rewrite the admin form to manage each section independently.

## Tasks

- [x] 1. Database schema migration
  - Remove `ServiceCategory` model from `prisma/schema.prisma`
  - Replace existing `Service` model with the new schema (add `icon`, `stats`, `subServices`, `processSteps`, `sectionType`, `techSection`, `toolsSection`; remove `categoryId`, `features`, `startingPrice`, `ctaTitle`, `ctaSubtitle`, `price_range`)
  - Run `prisma migrate dev` to generate and apply the migration
  - Write a migration seed/script that maps existing rows: copy `title`, `slug`, `icon`, `seo_id`, `status`, `sort_order`, `featured`, `published_at`; set `sectionType = "technologies"` as default
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 10.1, 10.2, 10.3_

- [x] 2. Server actions and validation layer
  - [x] 2.1 Update `lib/actions/services.ts` — rewrite `ServiceFormData` interface to match new model fields; update `createService` and `updateService` to validate: title/slug required, stats ≤ 4 items, processSteps exactly 4, JSON fields parseable; normalise `sectionType` to `"technologies"` if value is outside allowed set
    - _Requirements: 7.7, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x] 2.2 Write property test for required field validation (P10)
    - **Property 10: Required field validation rejects incomplete submissions**
    - **Validates: Requirements 7.7, 9.3, 9.5**
    - Use `fc.record({ title: fc.option(fc.string()), slug: fc.option(fc.string()) })` — assert `createService` returns `{ success: false }` when either field is absent

  - [x] 2.3 Write property test for stats max-4 enforcement (P2)
    - **Property 2: Stats bar maximum enforcement**
    - **Validates: Requirements 1.6, 2.3, 7.4, 9.2**
    - Use `fc.array(statItemArb, { minLength: 5, maxLength: 20 })` for rejection; `fc.array(statItemArb, { maxLength: 4 })` for acceptance

  - [x] 2.4 Write property test for process steps count enforcement (P3)
    - **Property 3: Process steps count enforcement**
    - **Validates: Requirements 4.1, 9.1**
    - Use `fc.array(processStepArb)` filtered by length ≠ 4 for rejection; exactly 4 for acceptance

  - [x] 2.5 Write property test for invalid JSON field rejection (P12)
    - **Property 12: Invalid JSON field rejection**
    - **Validates: Requirements 9.4**
    - Use `fc.string()` filtered to exclude valid JSON strings; assert server action returns `{ success: false }`

  - [x] 2.6 Write property test for JSON field round-trip (P1)
    - **Property 1: JSON field round-trip**
    - **Validates: Requirements 1.3**
    - Use `fc.array(fc.record({...}))` for each JSON type (`SubService[]`, `ProcessStep[]`, `TechSection`, `ToolsSection`); serialize → deserialize → deep equal

  - [x] 2.7 Write property test for slug lookup round-trip (P11)
    - **Property 11: Slug lookup round-trip**
    - **Validates: Requirements 8.3**
    - For any stored service, `getServiceBySlug(service.slug)` returns the same record

- [x] 3. Delete deprecated files and admin category routes
  - Delete `lib/actions/serviceCategories.ts`
  - Remove the entire `app/admin/(dashboard)/services/categories/` folder
  - Update `app/admin/(dashboard)/services/page.tsx` to remove all category references (imports, columns, filter UI)
  - _Requirements: 1.1, 7.6_

- [x] 4. Checkpoint — ensure schema, actions, and admin list compile cleanly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Public page section components
  - [x] 5.1 Create `components/service-page/ServiceHeader.tsx`
    - Render service pill (icon + title), full title, description
    - _Requirements: 2.1, 2.2_

  - [x] 5.2 Write property test for ServiceHeader identity fields (P4)
    - **Property 4: Service header renders identity fields**
    - **Validates: Requirements 2.1, 2.2**
    - Use `fc.record({ title: fc.string(), description: fc.string(), icon: fc.string() })`; assert rendered output contains all three values

  - [x] 5.3 Create `components/service-page/ServiceStatsBar.tsx`
    - Render up to 4 `StatItem` entries; return `null` when stats is empty or null
    - _Requirements: 2.3, 2.4_

  - [x] 5.4 Create `components/service-page/SubServiceCard.tsx`
    - Render icon, name, description, features list (tick icons), technologies tag list
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 5.5 Write property test for SubServiceCard content fields (P5)
    - **Property 5: Sub-service card renders all content fields**
    - **Validates: Requirements 3.2, 3.3, 3.4**
    - Use `fc.record({ name: fc.string(), description: fc.string(), features: fc.array(fc.string()), technologies: fc.array(fc.string()) })`; assert all strings appear in rendered output

  - [x] 5.6 Create `components/service-page/SubServicesGrid.tsx`
    - Render a responsive grid of `SubServiceCard` components from a `SubService[]` prop
    - _Requirements: 3.1, 3.5, 3.6_

  - [x] 5.7 Create `components/service-page/ServiceProcessSection.tsx`
    - Render exactly 4 `ProcessStep` entries showing number, heading, description
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 5.8 Write property test for process step rendering (P6)
    - **Property 6: Process step renders number, heading, and description**
    - **Validates: Requirements 4.2, 4.3**
    - Use `fc.record({ number: fc.integer({ min: 1, max: 4 }), heading: fc.string(), description: fc.string() })`; assert all three values appear in rendered output

- [x] 6. Refactor existing conditional section components
  - [x] 6.1 Refactor `components/sections/TechMasterySection.tsx` to accept a `TechSection` prop instead of hardcoded data; render heading and grouped category/item lists
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 6.2 Write property test for TechMasterySection content (P8)
    - **Property 8: Tech section renders heading and grouped categories**
    - **Validates: Requirements 5.2, 5.3**
    - Use `fc.record({ heading: fc.string(), categories: fc.array(techCategoryArb) })`; assert heading and all category/item names appear in rendered output

  - [x] 6.3 Refactor `components/sections/ToolsWeUseSection.tsx` to accept a `ToolsSection` prop; render description, grouped categories, and tool name/icon entries
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 6.4 Write property test for ToolsWeUseSection content (P9)
    - **Property 9: Tools section renders description and grouped tools**
    - **Validates: Requirements 6.2, 6.3, 6.4**
    - Use `fc.record({ description: fc.string(), categories: fc.array(toolCategoryArb) })`; assert description and all tool names appear in rendered output

- [x] 7. Rewrite public service page
  - Rewrite `app/(public)/services/[slug]/page.tsx` as a React Server Component: fetch service by slug (call `notFound()` for missing or non-published records), pass typed props to `ServiceHeader`, `ServiceStatsBar`, `SubServicesGrid`, `ServiceProcessSection`, and the conditional section (`TechMasterySection` or `ToolsWeUseSection`) based on `sectionType`
  - Add `generateMetadata` export using `seo_metadata` fields
  - _Requirements: 5.6, 6.6, 7.5, 8.1, 8.2, 8.3, 8.4, 8.6_

  - [x] 7.1 Write property test for conditional section mutual exclusivity (P7)
    - **Property 7: Conditional section mutual exclusivity**
    - **Validates: Requirements 5.1, 5.6, 6.1, 6.6**
    - Use `fc.constantFrom("technologies", "tools")`; assert that for `"technologies"` the tech section is present and tools section is absent, and vice versa

- [x] 8. Rewrite admin ServiceForm
  - Rewrite `components/admin/ServiceForm.tsx` with inline section editors: `StatsEditor` (add/remove up to 4 items), `SubServicesEditor` (add/remove/reorder), `ProcessStepsEditor` (exactly 4 steps), `SectionTypeToggle` (radio: `"technologies"` | `"tools"`), `TechSectionEditor`, `ToolsSectionEditor`
  - Wire form submission to updated server actions; display field-level validation errors
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.7_

- [x] 9. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use **fast-check** with **Vitest**; each test runs a minimum of 100 iterations
- Tag each property test with `// Feature: service-page-redesign, Property {N}: {property_text}`
- Both `techSection` and `toolsSection` JSON fields are always stored; only one renders based on `sectionType` (avoids data loss on toggle switch)
