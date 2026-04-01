# Design Document: Service Page Redesign

## Overview

This redesign replaces the existing two-table `ServiceCategory` + `Service` structure with a single, self-contained `Service` model where every page section is stored as a typed JSON field. The public page at `/services/[slug]` becomes a fully dynamic, data-driven layout composed of discrete section components. The admin dashboard gains a structured form for editing each section independently.

The key architectural decision is the **conditional section toggle**: each service carries a `sectionType` discriminator (`"technologies" | "tools"`) that determines which of the two mutually exclusive sections renders. This is a simple string field rather than a nullable pair of JSON blobs, making the intent explicit and validation straightforward.

The existing URL structure (`/services/[slug]`, `/admin/services/`) is preserved throughout.

---

## Architecture

```mermaid
graph TD
    DB[(PostgreSQL\nService table)] --> Actions[lib/actions/services.ts\nServer Actions]
    Actions --> AdminForm[Admin ServiceForm\ncomponents/admin/ServiceForm.tsx]
    Actions --> PublicPage[Public Service Page\napp/(public)/services/[slug]/page.tsx]

    PublicPage --> ServiceHeader[ServiceHeader]
    PublicPage --> SubServicesGrid[SubServicesGrid]
    PublicPage --> ProcessSection[ServiceProcessSection]
    PublicPage --> ConditionalSection{sectionType?}
    ConditionalSection -- technologies --> TechMasterySection
    ConditionalSection -- tools --> ToolsWeUseSection

    AdminForm --> SectionEditors[Per-section JSON editors\nStats / SubServices / Process / Tech / Tools]
```

The public page is a React Server Component that fetches the service record once and passes typed props to each section component. Section components are client components only where animation (framer-motion) is needed.

---

## Components and Interfaces

### Public Page Components

| Component | Location | Responsibility |
|---|---|---|
| `ServicePage` | `app/(public)/services/[slug]/page.tsx` | Data fetch, metadata, JSON-LD, layout |
| `ServiceHeader` | `components/service-page/ServiceHeader.tsx` | Pill, title, description |
| `ServiceStatsBar` | `components/service-page/ServiceStatsBar.tsx` | Up to 4 stats, hidden when empty |
| `SubServicesGrid` | `components/service-page/SubServicesGrid.tsx` | Cards grid |
| `SubServiceCard` | `components/service-page/SubServiceCard.tsx` | Single card: icon, name, desc, features, techs |
| `ServiceProcessSection` | `components/service-page/ServiceProcessSection.tsx` | 4-step process |
| `TechMasterySection` | `components/sections/TechMasterySection.tsx` | Refactored to accept props |
| `ToolsWeUseSection` | `components/sections/ToolsWeUseSection.tsx` | Already prop-driven |

### Admin Components

| Component | Location | Responsibility |
|---|---|---|
| `ServiceForm` | `components/admin/ServiceForm.tsx` | Full service editor (refactored) |
| `StatsEditor` | inline in ServiceForm | Add/remove up to 4 stat items |
| `SubServicesEditor` | inline in ServiceForm | Add/remove/reorder sub-service entries |
| `ProcessStepsEditor` | inline in ServiceForm | Exactly 4 step editors |
| `TechSectionEditor` | inline in ServiceForm | Category + tech item list editor |
| `ToolsSectionEditor` | inline in ServiceForm | Tool list editor |
| `SectionTypeToggle` | inline in ServiceForm | Radio: "technologies" \| "tools" |

### Server Actions

`lib/actions/services.ts` — CRUD operations remain structurally the same; `ServiceFormData` interface is updated to match the new model fields.

---

## Data Models

### New Prisma Schema

```prisma
model Service {
  id          Int      @id @default(autoincrement())
  title       String
  slug        String   @unique
  description String?

  // Service header
  icon        String?  // icon name or URL for the service pill

  // Stats bar — max 4 items
  stats       Json?    // StatItem[]

  // Sub-services cards
  subServices Json?    // SubService[]

  // Development process — exactly 4 steps
  processSteps Json?   // ProcessStep[]

  // Conditional section discriminator
  sectionType  String  @default("technologies") // "technologies" | "tools"

  // Section A: Technology We Master
  techSection  Json?   // TechSection

  // Section B: Tools We Use
  toolsSection Json?   // ToolsSection

  // Publishing
  sort_order   Int      @default(0)
  status       String   @default("draft")  // "draft" | "published" | "archived"
  featured     Boolean  @default(false)
  published_at DateTime?

  // SEO
  seo_id       Int?
  seo_metadata SeoMetadata? @relation(fields: [seo_id], references: [id], onDelete: SetNull)

  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt

  @@map("services")
}
```

> The `ServiceCategory` model is removed. The categories admin section (`/admin/services/categories/`) is deprecated.

### JSON Field Type Definitions (TypeScript)

```typescript
// stats field
interface StatItem {
  value: string;  // e.g. "200+"
  label: string;  // e.g. "Projects Delivered"
}

// subServices field
interface SubService {
  icon: string;           // icon name (lucide) or image URL
  name: string;
  description: string;
  features: string[];     // displayed with tick icons
  technologies: string[]; // tag list
}

// processSteps field — always exactly 4 elements
interface ProcessStep {
  number: number;         // 1 | 2 | 3 | 4
  heading: string;
  description: string;
}

// techSection field (used when sectionType === "technologies")
interface TechSection {
  heading: string;        // e.g. "Technology We Master"
  categories: TechCategory[];
}

interface TechCategory {
  name: string;           // e.g. "Frontend Development"
  items: string[];        // e.g. ["React", "Next.js", "TypeScript"]
}

// toolsSection field (used when sectionType === "tools")
interface ToolsSection {
  description: string;
  categories: ToolCategory[];
}

interface ToolCategory {
  name: string;           // e.g. "Design"
  tools: ToolItem[];
}

interface ToolItem {
  name: string;
  icon: string;           // image URL or lucide icon name
}
```

### Conditional Section Toggle Logic

```
sectionType === "technologies"  →  render <TechMasterySection data={service.techSection} />
sectionType === "tools"         →  render <ToolsWeUseSection data={service.toolsSection} />
```

Both JSON fields are always stored; only one is rendered. This avoids data loss when an admin switches the toggle back and forth.

### Migration Strategy

A Prisma migration script will:
1. Create the new `services` table with the new schema.
2. Map existing `Service` rows: copy `title`, `slug`, `icon`, `stats`, `processSteps`, `toolsUsed` (→ `toolsSection`), `seo_id`, `status`, `sort_order`, `featured`, `published_at`.
3. Set `sectionType = "tools"` for services that had `toolsUsed` data, otherwise `"technologies"`.
4. Drop the `ServiceCategory` table and the `categoryId` foreign key.

Existing slugs are preserved, so all public URLs remain valid.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: JSON field round-trip

*For any* valid `SubService[]`, `ProcessStep[]`, `TechSection`, or `ToolsSection` value, serializing it to JSON and deserializing it back should produce a structurally equivalent value.

**Validates: Requirements 1.3**

---

### Property 2: Stats bar maximum enforcement

*For any* stats array with more than 4 items, the validation layer should reject the input and return an error; for any stats array with 4 or fewer items, it should be accepted.

**Validates: Requirements 1.6, 2.3, 7.4, 9.2**

---

### Property 3: Process steps count enforcement

*For any* processSteps array that does not contain exactly 4 elements, the validation layer should reject the input and return an error; an array of exactly 4 steps should be accepted.

**Validates: Requirements 4.1, 9.1**

---

### Property 4: Service header renders identity fields

*For any* service record, the rendered `ServiceHeader` output should contain the service's title, description, and icon value.

**Validates: Requirements 2.1, 2.2**

---

### Property 5: Sub-service card renders all content fields

*For any* `SubService` object, the rendered `SubServiceCard` output should contain the sub-service's name, description, every feature string, and every technology string.

**Validates: Requirements 3.2, 3.3, 3.4**

---

### Property 6: Process step renders number, heading, and description

*For any* `ProcessStep` object, the rendered step output should contain the step number, heading, and description.

**Validates: Requirements 4.2, 4.3**

---

### Property 7: Conditional section mutual exclusivity

*For any* service record, if `sectionType === "technologies"` then the rendered page should include the tech mastery section and exclude the tools section; if `sectionType === "tools"` then the rendered page should include the tools section and exclude the tech mastery section.

**Validates: Requirements 5.1, 5.6, 6.1, 6.6**

---

### Property 8: Tech section renders heading and grouped categories

*For any* `TechSection` value, the rendered output should contain the section heading and each category name with its associated technology items.

**Validates: Requirements 5.2, 5.3**

---

### Property 9: Tools section renders description and grouped tools

*For any* `ToolsSection` value, the rendered output should contain the section description, each category name, and each tool's name within that category.

**Validates: Requirements 6.2, 6.3, 6.4**

---

### Property 10: Required field validation rejects incomplete submissions

*For any* service form submission that is missing a required field (title or slug), the server action should return `{ success: false }` and not persist any data.

**Validates: Requirements 7.7, 9.3, 9.5**

---

### Property 11: Slug lookup round-trip

*For any* published service, fetching by its slug should return the same service record that was stored.

**Validates: Requirements 8.3**

---

### Property 12: Invalid JSON field rejection

*For any* string that is not valid JSON submitted to a JSON field (stats, subServices, processSteps, techSection, toolsSection), the validation layer should return an error and not persist the data.

**Validates: Requirements 9.4**

---

## Error Handling

| Scenario | Handling |
|---|---|
| Invalid slug on public page | `notFound()` → Next.js 404 page |
| Draft/archived service accessed publicly | `notFound()` |
| Stats array > 4 items | Server action returns `{ success: false, error: "Stats bar supports a maximum of 4 items" }` |
| processSteps count ≠ 4 | Server action returns `{ success: false, error: "Process section requires exactly 4 steps" }` |
| Malformed JSON in any JSON field | Server action returns `{ success: false, error: "Invalid JSON in <field>" }` |
| Missing required fields (title, slug) | Server action returns `{ success: false, error: "<field> is required" }` |
| Duplicate slug on create | Prisma unique constraint → server action catches and returns `{ success: false, error: "Slug already in use" }` |
| sectionType value outside allowed set | Server action normalises to `"technologies"` as default |
| Empty stats array | `ServiceStatsBar` returns `null` (hidden) |
| Missing techSection when sectionType is "technologies" | Section renders empty state gracefully |

---

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are required. Unit tests cover specific examples and integration points; property tests verify universal correctness across randomised inputs.

### Unit Tests

Focus areas:
- `ServicePage` renders correct section for each `sectionType` value (integration example)
- `ServiceStatsBar` returns `null` when stats is empty or null (edge case)
- `generateMetadata` returns correct title/description from SEO record (example)
- 404 is returned for an unknown slug (edge case)
- Server action `createService` returns `{ success: true, id }` for a valid payload (example)
- Default values are applied to optional fields on creation (example — Requirement 9.6)

### Property-Based Tests

Library: **fast-check** (TypeScript, works with Vitest/Jest).

Each property test runs a minimum of **100 iterations**.

Tag format: `// Feature: service-page-redesign, Property {N}: {property_text}`

| Property | Test description | fast-check arbitraries |
|---|---|---|
| P1: JSON round-trip | `fc.jsonValue()` → serialize → deserialize → deep equal | `fc.array(fc.record({...}))` for each JSON type |
| P2: Stats max 4 | Arrays of length > 4 rejected; ≤ 4 accepted | `fc.array(statItemArb, { minLength: 5, maxLength: 20 })` |
| P3: Process steps count | Arrays ≠ 4 rejected; exactly 4 accepted | `fc.array(processStepArb)` filtered by length |
| P4: Header identity | Rendered header contains title, description, icon | `fc.record({ title: fc.string(), description: fc.string(), icon: fc.string() })` |
| P5: Sub-service card content | Rendered card contains all features and technologies | `fc.record({ name, description, features: fc.array(fc.string()), technologies: fc.array(fc.string()) })` |
| P6: Process step content | Rendered step contains number, heading, description | `fc.record({ number: fc.integer({min:1,max:4}), heading: fc.string(), description: fc.string() })` |
| P7: Conditional section exclusivity | sectionType determines which section renders | `fc.constantFrom("technologies", "tools")` |
| P8: Tech section content | Rendered output contains heading and all category/item names | `fc.record({ heading: fc.string(), categories: fc.array(techCategoryArb) })` |
| P9: Tools section content | Rendered output contains description and all tool names | `fc.record({ description: fc.string(), categories: fc.array(toolCategoryArb) })` |
| P10: Required field validation | Missing title or slug → `{ success: false }` | `fc.record({ title: fc.option(fc.string()), slug: fc.option(fc.string()) })` |
| P11: Slug round-trip | `getServiceBySlug(service.slug)` returns same record | `fc.string({ minLength: 1 })` for slug |
| P12: Invalid JSON rejection | Non-JSON strings in JSON fields → `{ success: false }` | `fc.string()` filtered to exclude valid JSON |
