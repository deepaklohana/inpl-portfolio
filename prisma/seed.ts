import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const password = await bcrypt.hash('Admin@123', 12)

  await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@company.com',
      password,
      role: 'superadmin',
    },
  })

  console.log('Superadmin created: admin@company.com / Admin@123')

  // Seed Service Categories - (Commented out because serviceCategory model does not exist)
  /*
  const categories = [
    {
      name: 'Development',
      slug: 'development',
      icon: 'Code2',
      shortDescription: 'Full-stack web and mobile development solutions.',
      description: 'We build robust, scalable web and mobile applications tailored to your business needs.',
      sortOrder: 1,
      status: 'published',
    },
    {
      name: 'Design',
      slug: 'design',
      icon: 'Palette',
      shortDescription: 'UI/UX and brand design that captivates.',
      description: 'From brand identity to user interfaces, we craft designs that engage and convert.',
      sortOrder: 2,
      status: 'published',
    },
    {
      name: 'Marketing',
      slug: 'marketing',
      icon: 'Megaphone',
      shortDescription: 'Data-driven digital marketing strategies.',
      description: 'Grow your audience and revenue with targeted, analytics-driven marketing campaigns.',
      sortOrder: 3,
      status: 'published',
    },
    {
      name: 'Infrastructure',
      slug: 'infrastructure',
      icon: 'Server',
      shortDescription: 'Cloud & DevOps infrastructure management.',
      description: 'Scalable, secure cloud infrastructure and DevOps pipelines for modern applications.',
      sortOrder: 4,
      status: 'published',
    },
    {
      name: 'Consulting',
      slug: 'consulting',
      icon: 'Lightbulb',
      shortDescription: 'Strategic technology and business consulting.',
      description: 'Expert guidance to align technology investments with your business strategy.',
      sortOrder: 5,
      status: 'published',
    },
  ]

  for (const cat of categories) {
    await (prisma as any).serviceCategory?.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        icon: cat.icon,
        shortDescription: cat.shortDescription,
        description: cat.description,
        sortOrder: cat.sortOrder,
        status: cat.status,
      },
      create: cat,
    })
  }

  console.log('Service categories seeded:', categories.map((c) => c.name).join(', '))
  */
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
