const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const s = await prisma.service.findFirst({ where: { slug: 'development-services' }});
  if (s) {
    console.log(JSON.stringify(s.subServices, null, 2));
  } else {
    console.log("Service not found");
  }
}

main().finally(() => prisma.$disconnect()).catch(console.error);
