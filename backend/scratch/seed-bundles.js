const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Ritual Packs...');

  // Pack 1: Le Coffret du Matin à l'Atlas
  await prisma.bundle.create({
    data: {
      name: "Le Coffret du Matin à l'Atlas",
      name_ar: "صندوق الصباح بالأطلس",
      price: 180,
      description: "Un éveil sensoriel avec les essences purifiantes de l'Atlas. Idéal pour commencer la journée avec force.",
      description_ar: "استيقاظ حسي مع خلاصات الأطلس المنقية. مثالي لبدء اليوم بقوة.",
      image: "morning_atlas.jpg",
      items: {
        create: [
          { product_id: 99, quantity: 1 }, // Atlas Cumin
          { product_id: 97, quantity: 1 }, // Organic Turmeric
          { product_id: 83, quantity: 1 }, // Zaatar
        ]
      }
    }
  });

  // Pack 2: Le Rituel Royal du Safran
  await prisma.bundle.create({
    data: {
      name: "Le Rituel Royal du Safran",
      name_ar: "الطقوس الملكية للزعفران",
      price: 350,
      description: "La quintessence de la cuisine marocaine sublimée par l'or rouge de Taliouine.",
      description_ar: "جوهر المطبخ المغربي معزز بالذهب الأحمر من تاليوين.",
      image: "royal_saffron.jpg",
      items: {
        create: [
          { product_id: 91, quantity: 1 }, // Premium Saffron
          { product_id: 96, quantity: 1 }, // Ras el Hanout
        ]
      }
    }
  });

  // Pack 3: L'Éveil des Sens
  await prisma.bundle.create({
    data: {
      name: "L'Éveil des Sens",
      name_ar: "إيقاظ الحواس",
      price: 520,
      description: "Un parcours rituel complet à travers les herbes et épices les plus précieuses du Toubkal.",
      description_ar: "مسار طقسي كامل عبر الأعشاب والتوابل الأكثر قيمة في توبقال.",
      image: "awakening.jpg",
      items: {
        create: [
          { product_id: 99, quantity: 1 },
          { product_id: 97, quantity: 1 },
          { product_id: 91, quantity: 1 },
          { product_id: 83, quantity: 1 },
          { product_id: 96, quantity: 1 },
        ]
      }
    }
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
