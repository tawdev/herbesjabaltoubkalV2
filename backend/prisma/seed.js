const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.review.deleteMany({});
  await prisma.bundleItem.deleteMany({});
  await prisma.bundle.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.recipe.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.admin.deleteMany({});

  // 1. Create Admin
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: 'hashed_password', // In production, use bcrypt
      email: 'admin@herbesjabaltoubkal.ma',
    },
  });

  // 2. Create Categories
  const categoriesData = [
    { name: 'Spices', name_ar: 'توابل', slug: 'spices' },
    { name: 'Herbs', name_ar: 'أعشاب', slug: 'herbs' },
    { name: 'Mixes', name_ar: 'خلطات', slug: 'mixes' },
    { name: 'Ground', name_ar: 'مطحون', slug: 'ground' },
    { name: 'Whole', name_ar: 'كامل', slug: 'whole' },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created.id;
  }

  // 3. Create Products
  const products = [
    {
      name: "Mixed Herbs",
      name_ar: "أعشاب مشكلة",
      price: 21.00,
      weight: "50g",
      description: "Aromatic blend of traditional mountain herbs.",
      description_ar: "أعشاب عطرية مشكلة من قلب الأطلس...",
      category_id: categories['mixes'],
      image: "mixed-herbs.jpeg",
      stock: 30,
      rating: 4.6
    },
    {
      name: "Zaatar",
      name_ar: "زعتر",
      price: 28.00,
      weight: "150g",
      description: "Traditional Moroccan wild thyme blend.",
      description_ar: "خلطة الزعتر التقليدية البرية...",
      category_id: categories['herbs'],
      image: "zaatar.jpeg",
      stock: 45,
      rating: 4.9
    },
    {
      name: "Chili Powder",
      name_ar: "شطة بودرة",
      price: 26.00,
      weight: "100g",
      description: "Intensely spicy ground chili peppers.",
      description_ar: "شطة حارة مطحونة بعناية...",
      category_id: categories['ground'],
      image: "chili-powder.jpeg",
      stock: 20,
      rating: 4.5,
      promo: true,
      promo_price: 19.99
    },
    {
      name: "Premium Saffron",
      name_ar: "زعفران",
      price: 120.00,
      weight: "5g",
      description: "Authentic high-quality pure saffron.",
      description_ar: "زعفران نقي عالي الجودة من تاليوين...",
      category_id: categories['spices'],
      image: "saffron.jpeg",
      stock: 15,
      rating: 5.0
    },
    {
      name: "Ras el Hanout",
      name_ar: "راس الحانوت",
      price: 45.00,
      weight: "100g",
      description: "The ultimate Moroccan spice blend.",
      description_ar: "خليط التوابل المغربي التقليدي الأصيل...",
      category_id: categories['mixes'],
      image: "ras-el-hanout.jpeg",
      stock: 40,
      rating: 4.9
    }
  ];

  const createdProducts = {};
  for (const product of products) {
    const created = await prisma.product.create({ data: product });
    createdProducts[product.name] = created.id;
  }

  // 4. Create Bundles (Packs)
  console.log('Creating bundles...');
  const bundles = [
    {
      name: "Chef's Essential Bundle",
      name_ar: "باقة الشيف الأساسية",
      price: 85.00,
      description: "The three pillars of Moroccan cuisine in one set.",
      description_ar: "الأركان الثلاثة للمطبخ المغربي في باقة واحدة.",
      image: "bundle-chef.jpeg",
      items: [
        { name: "Ras el Hanout", quantity: 1 },
        { name: "Chili Powder", quantity: 1 },
        { name: "Zaatar", quantity: 1 }
      ]
    },
    {
      name: "High Atlas Ritual Pack",
      name_ar: "باقة طقوس الأطلس الكبير",
      price: 155.00,
      description: "Our most precious aromatics for your daily rituals.",
      description_ar: "أغلى أعشابنا العطرية لطقوسك اليومية.",
      image: "bundle-ritual.jpeg",
      items: [
        { name: "Mixed Herbs", quantity: 1 },
        { name: "Zaatar", quantity: 1 },
        { name: "Premium Saffron", quantity: 1 }
      ]
    }
  ];

  for (const b of bundles) {
    const { items, ...bundleData } = b;
    const createdBundle = await prisma.bundle.create({ data: bundleData });
    
    for (const item of items) {
      await prisma.bundleItem.create({
        data: {
          bundle_id: createdBundle.id,
          product_id: createdProducts[item.name],
          quantity: item.quantity
        }
      });
    }
  }

  // 4. Create Recipes
  const recipes = [
    {
      title: "Chicken Curry",
      title_ar: "كاري الدجاج",
      description: "Flavorful and rich Indian chicken curry.",
      description_ar: "كاري دجاج هندي غني بالنكهات...",
      image: "chicken-curry.jpeg",
      cooking_time: "45 minutes",
      ingredients: "Chicken, Curry powder, Onion, Garlic, Ginger, Tomato, Cream",
      ingredients_ar: "دجاج، مسحوق الكاري، بصل، ثوم، زنجبيل، طماطم، كريمة",
      steps: "1. Sauté onions. 2. Add spices. 3. Cook chicken. 4. Simmer with tomatoes and cream.",
      steps_ar: "1. قلقل البصل. 2. أضف التوابل. 3. اطهُ الدجاج. 4. اترك الخليط ينضج مع الطماطم والكريمة.",
      difficulty: "Medium"
    },
    {
      title: "Herbed Potatoes",
      title_ar: "بطاطا بالأعشاب",
      description: "Roasted potatoes with a blend of aromatic herbs.",
      description_ar: "بطاطا مشوية بالأعشاب...",
      image: "herbed-potatoes.jpeg",
      cooking_time: "40 minutes",
      ingredients: "Potatoes, Mixed Herbs, Olive Oil, Salt, Pepper",
      ingredients_ar: "بطاطس، أعشاب مشكلة، زيت زيتون، ملح، فلفل",
      steps: "1. Cut potatoes. 2. Toss with oil and herbs. 3. Roast in oven until golden.",
      steps_ar: "1. قطع البطاطس. 2. اخلطها مع الزيت والأعشاب. 3. اشوها في الفرن حتى تصبح ذهبية.",
      difficulty: "Easy"
    }
  ];

  for (const recipe of recipes) {
    await prisma.recipe.create({ data: recipe });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
