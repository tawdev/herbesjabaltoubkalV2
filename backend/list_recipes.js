const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const recipes = await prisma.recipe.findMany({
    select: { id: true, title: true }
  });
  console.log('Available Recipe IDs:', recipes);
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
