const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: "spices", // let's see why this 500s or not!
      }
    });
    console.log("Success:", products.length);
  } catch(e) {
    console.error("Prisma error:", e);
  }
}
test();
