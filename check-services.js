const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkServices() {
  try {
    const services = await prisma.service.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
    });
    console.log(JSON.stringify(services, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkServices();
