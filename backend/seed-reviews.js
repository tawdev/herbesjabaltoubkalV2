const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  
  console.log(`Found ${products.length} products. Adding reviews...`);

  const reviewTemplates = [
    { name: "Laila B.", comment: "Une qualité exceptionnelle, on sent vraiment la pureté de l'Atlas.", rating: 5 },
    { name: "Youssef T.", comment: "Parfait pour mes infusions du soir. Je recommande vivement.", rating: 5 },
    { name: "Sarah M.", comment: "Le parfum est incroyable dès l'ouverture du sachet.", rating: 4 },
    { name: "Karim A.", comment: "Excellent produit, livraison rapide et soignée.", rating: 5 },
    { name: "Nadia K.", comment: "Une découverte merveilleuse pour ma cuisine.", rating: 5 }
  ];

  for (const product of products) {
    const existingReviews = await prisma.review.findMany({
      where: { product_id: product.id }
    });

    if (existingReviews.length === 0) {
      const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
      await prisma.review.create({
        data: {
          product_id: product.id,
          user_name: template.name,
          comment: template.comment,
          rating: template.rating
        }
      });
      console.log(`Added review for product: ${product.name}`);
    } else {
      console.log(`Product ${product.name} already has reviews. Skipping.`);
    }
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
