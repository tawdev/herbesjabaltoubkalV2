const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bundles = await prisma.bundle.findMany({ select: { id: true, name: true } });
  console.log('Bundles:', JSON.stringify(bundles, null, 2));
  await prisma.$disconnect();
}

main();
