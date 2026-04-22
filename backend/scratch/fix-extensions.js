const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.bundle.updateMany({ where: { image: 'morning_atlas.jpg' }, data: { image: 'morning_atlas.png' } });
  await prisma.bundle.updateMany({ where: { image: 'royal_saffron.jpg' }, data: { image: 'royal_saffron.png' } });
  await prisma.bundle.updateMany({ where: { image: 'awakening.jpg' }, data: { image: 'awakening.png' } });
  console.log('DB Updated with .png extensions');
}

main().catch(console.error).finally(() => prisma.$disconnect());
