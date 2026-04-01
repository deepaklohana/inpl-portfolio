-- Migration: service_page_redesign
-- Removes ServiceCategory model and replaces Service model with new schema.
-- Applied via `prisma db push` (DB was already in sync before this file was created).

-- Drop foreign key from services to service_categories
ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_categoryId_fkey";

-- Drop old columns from services
ALTER TABLE "services"
  DROP COLUMN IF EXISTS "categoryId",
  DROP COLUMN IF EXISTS "excerpt",
  DROP COLUMN IF EXISTS "cover_image",
  DROP COLUMN IF EXISTS "features",
  DROP COLUMN IF EXISTS "price_range",
  DROP COLUMN IF EXISTS "startingPrice",
  DROP COLUMN IF EXISTS "toolsUsed",
  DROP COLUMN IF EXISTS "ctaTitle",
  DROP COLUMN IF EXISTS "ctaSubtitle";

-- Add new columns to services
ALTER TABLE "services"
  ADD COLUMN IF NOT EXISTS "subServices" JSONB,
  ADD COLUMN IF NOT EXISTS "sectionType" TEXT NOT NULL DEFAULT 'technologies',
  ADD COLUMN IF NOT EXISTS "techSection" JSONB,
  ADD COLUMN IF NOT EXISTS "toolsSection" JSONB;

-- Drop service_categories table
DROP TABLE IF EXISTS "service_categories";
