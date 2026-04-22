const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      user_id: true,
      user_name: true,
      total_price: true,
    }
  });
  console.log('--- Orders in DB ---');
  console.table(orders);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
    }
  });
  console.log('--- Users in DB ---');
  console.table(users);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
