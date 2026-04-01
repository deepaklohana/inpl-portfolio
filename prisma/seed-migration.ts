/**
 * Migration seed script: maps existing Service rows to the new schema.
 *
 * Preserved fields: title, slug, icon, seo_id, status, sort_order, featured, published_at
 * Default: sectionType = "technologies"
 *
 * Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-migration.ts
 * Or via: npx prisma db seed (if configured in package.json)
 */

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting service data migration...");

  const services = await prisma.service.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      icon: true,
      seo_id: true,
      status: true,
      sort_order: true,
      featured: true,
      published_at: true,
    },
  });

  console.log(`Found ${services.length} service(s) to migrate.`);

  for (const service of services) {
    await prisma.service.update({
      where: { id: service.id },
      data: {
        title: service.title,
        slug: service.slug,
        icon: service.icon ?? null,
        seo_id: service.seo_id ?? null,
        status: service.status,
        sort_order: service.sort_order,
        featured: service.featured,
        published_at: service.published_at ?? null,
        // New fields — set safe defaults
        sectionType: "technologies",
        stats: Prisma.JsonNull,
        subServices: Prisma.JsonNull,
        processSteps: Prisma.JsonNull,
        techSection: Prisma.JsonNull,
        toolsSection: Prisma.JsonNull,
      },
    });

    console.log(`  Migrated service: "${service.title}" (slug: ${service.slug})`);
  }

  console.log("Migration complete.");
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
