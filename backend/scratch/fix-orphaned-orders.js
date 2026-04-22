const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'mehdifatimi84@gmail.com';
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error('User not found!');
    return;
  }

  console.log(`Found user: ${user.name} (ID: ${user.id})`);

  const updated = await prisma.order.updateMany({
    where: { 
      user_email: email,
      user_id: null 
    },
    data: {
      user_id: user.id
    }
  });

  console.log(`Successfully linked ${updated.count} orphaned orders to user ID ${user.id}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
