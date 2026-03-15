const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.product.deleteMany({});
  await prisma.recipe.deleteMany({});

  const products = [
    {
      name: "Mixed Herbs",
      name_ar: "أعشاب مشكلة",
      price: 21.00,
      weight: "50g",
      description: "Aromatic blend of traditional mountain herbs.",
      description_ar: "أعشاب عطرية مشكلة من قلب الأطلس...",
      category: "mixes",
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
      category: "herbs",
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
      category: "ground",
      image: "chili-powder.jpeg",
      stock: 20,
      rating: 4.5,
      promo: true,
      promo_price: 19.99
    },
    {
      name: "Bay Leaves",
      name_ar: "ورق غار",
      price: 14.00,
      weight: "50g",
      description: "Fragrant dried bay leaves for seasoning.",
      description_ar: "ورق غار عطري للمنكهات...",
      category: "whole",
      image: "bay-leaves.jpeg",
      stock: 60,
      rating: 4.7
    },
    {
      name: "Sumac",
      name_ar: "سماق",
      price: 22.00,
      weight: "100g",
      description: "Ruby red, tangy sumac powder.",
      description_ar: "سماق بلون أحمر ياقوتي ونكهة مميزة...",
      category: "ground",
      image: "sumac.jpeg",
      stock: 25,
      rating: 4.8
    },
    {
      name: "White Pepper",
      name_ar: "فلفل أبيض",
      price: 33.00,
      weight: "100g",
      description: "Finely ground white pepper grains.",
      description_ar: "فلفل أبيض مطحون ناعم...",
      category: "ground",
      image: "white-pepper.jpeg",
      stock: 18,
      rating: 4.6
    },
    {
      name: "Cardamom",
      name_ar: "هيل",
      price: 85.00,
      weight: "50g",
      description: "Premium green cardamom pods.",
      description_ar: "حبات هيل خضراء فاخرة...",
      category: "whole",
      image: "cardamom.jpeg",
      stock: 12,
      rating: 4.9,
      promo: true,
      promo_price: 75.00
    },
    {
      name: "Onion Powder",
      name_ar: "بصل بودرة",
      price: 16.00,
      weight: "100g",
      description: "Concentrated dried onion powder.",
      description_ar: "بودرة بصل مجفف ومركز...",
      category: "ground",
      image: "onion-powder.jpeg",
      stock: 40,
      rating: 4.4
    },
    {
      name: "Garlic Powder",
      name_ar: "ثوم بودرة",
      price: 18.00,
      weight: "100g",
      description: "Finely ground aromatic garlic.",
      description_ar: "ثوم مطحون ناعم وعطري...",
      category: "ground",
      image: "bay-leaves.jpeg",
      stock: 35,
      rating: 4.5,
      promo: true,
      promo_price: 14.50
    },
    {
      name: "Premium Saffron",
      name_ar: "زعفران",
      price: 120.00,
      weight: "5g",
      description: "Authentic high-quality pure saffron.",
      description_ar: "زعفران نقي عالي الجودة من تاليوين...",
      category: "spices",
      image: "saffron.jpeg",
      stock: 15,
      rating: 5.0
    },
    {
      name: "Coriander Seeds",
      name_ar: "كزبرة",
      price: 24.00,
      weight: "100g",
      description: "Whole dried coriander seeds.",
      description_ar: "بذور كزبرة طبيعية مجففة...",
      category: "whole",
      image: "coriander.jpeg",
      stock: 50,
      rating: 4.7
    },
    {
      name: "Black Pepper",
      name_ar: "فلفل أسود",
      price: 27.00,
      weight: "100g",
      description: "Whole black pepper berries.",
      description_ar: "حبات فلفل أسود كاملة وعطرية...",
      category: "whole",
      image: "black-pepper.jpeg",
      stock: 55,
      rating: 4.8
    },
    {
      name: "Dried Ginger",
      name_ar: "زنجبيل",
      price: 32.00,
      weight: "100g",
      description: "Naturally dried and sliced ginger.",
      description_ar: "زنجبيل مجفف طازج وعالي الجودة...",
      category: "whole",
      image: "ginger.jpeg",
      stock: 33,
      rating: 4.7
    },
    {
      name: "Cinnamon Sticks",
      name_ar: "قرفة",
      price: 35.00,
      weight: "100g",
      description: "Premium Ceylon cinnamon sticks.",
      description_ar: "عصي قرفة سيلان عطرية...",
      category: "whole",
      image: "cinnamon.jpeg",
      stock: 28,
      rating: 4.8,
      promo: true,
      promo_price: 29.99
    },
    {
      name: "Ras el Hanout",
      name_ar: "راس الحانوت",
      price: 45.00,
      weight: "100g",
      description: "The ultimate Moroccan spice blend.",
      description_ar: "خليط التوابل المغربي التقليدي الأصيل...",
      category: "mixes",
      image: "ras-el-hanout.jpeg",
      stock: 40,
      rating: 4.9
    },
    {
      name: "Organic Turmeric",
      name_ar: "كركم",
      price: 28.00,
      weight: "100g",
      description: "Pure organic ground turmeric.",
      description_ar: "كركم عضوي مطحون من أجود الأنواع...",
      category: "ground",
      image: "turmeric.jpeg",
      stock: 38,
      rating: 4.9
    },
    {
      name: "Smoked Paprika",
      name_ar: "بابريكا",
      price: 30.00,
      weight: "100g",
      description: "Sweet and aromatic ground paprika.",
      description_ar: "بابريكا حلوة مطحونة ومدخنة...",
      category: "ground",
      image: "paprika.jpeg",
      stock: 22,
      rating: 4.7,
      promo: true,
      promo_price: 24.50
    },
    {
      name: "Atlas Cumin",
      name_ar: "كمون",
      price: 25.00,
      weight: "100g",
      description: "Premium fragrant ground cumin.",
      description_ar: "كمون عالي الجودة من منطقة الأطلس...",
      category: "ground",
      image: "cumin.jpeg",
      stock: 50,
      rating: 4.8
    }
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

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
    },
    {
      title: "Spicy Lentil Soup",
      title_ar: "شوربة العدس الحارة",
      description: "Warm and delicious spicy lentil soup.",
      description_ar: "شوربة عدس حارة ولذيذة...",
      image: "spicy-lentil-soup.jpeg",
      cooking_time: "30 minutes",
      ingredients: "Lentils, Chili Powder, Cumin, Onion, Garlic, Lemon",
      ingredients_ar: "عدس، شطة بودرة، كمون، بصل، ثوم، ليمون",
      steps: "1. Cook lentils. 2. Sauté aromatics and spices. 3. Blend and serve with lemon.",
      steps_ar: "1. اطهُ العدس. 2. قلقل المنكهات والتوابل. 3. امزج الخليط وقدمه مع الليمون.",
      difficulty: "Easy"
    },
    {
      title: "Fish with Charmoula",
      title_ar: "سمك بالشرمولة",
      description: "Fish marinated in a traditional Moroccan charmoula.",
      description_ar: "سمك متبل بشرمولة مغربية...",
      image: "fish-charmoula.jpeg",
      cooking_time: "35 minutes",
      ingredients: "Fish, Coriander, Garlic, Paprika, Cumin, Olive Oil, Lemon",
      ingredients_ar: "سمك، كزبرة، ثوم، بابريكا، كمون، زيت زيتون، ليمون",
      steps: "1. Prepare charmoula. 2. Marinate fish. 3. Bake or grill.",
      steps_ar: "1. جهز الشرمولة. 2. تبّل السمك. 3. اخبزه أو اشوه.",
      difficulty: "Medium"
    },
    {
      title: "Golden Milk",
      title_ar: "الحليب الذهبي",
      description: "Healthy turmeric-based drink.",
      description_ar: "مشروب صحي قائم على الكركم...",
      image: "golden-milk.jpeg",
      cooking_time: "10 minutes",
      ingredients: "Milk, Turmeric, Cinnamon, Ginger, Honey, Black Pepper",
      ingredients_ar: "حليب، كركم، قرفة، زنجبيل، عسل، فلفل أسود",
      steps: "1. Heat milk. 2. Whisk in spices. 3. Sweeten with honey.",
      steps_ar: "1. سخن الحليب. 2. اخلط التوابل. 3. حله بالعسل.",
      difficulty: "Easy"
    },
    {
      title: "Moroccan Tagine",
      title_ar: "الطاجين المغربي",
      description: "Traditional slow-cooked Moroccan dish.",
      description_ar: "طبق مغربي تقليدي مطبوخ ببطء...",
      image: "moroccan-tagine.jpeg",
      cooking_time: "2 hours",
      ingredients: "Meat, Ras el Hanout, Saffron, Onions, Prunes, Almonds",
      ingredients_ar: "لحم، راس الحانوت، زعفران، بصل، برقوق، لوز",
      steps: "1. Season meat. 2. Layer with onions in tagine. 3. Cook slowly until tender.",
      steps_ar: "1. تبّل اللحم. 2. ضعه مع البصل في الطاجين. 3. اطهه ببطء حتى ينضج.",
      difficulty: "Hard"
    },
    {
      title: "Spiced Rice",
      title_ar: "أرز بالتوابل",
      description: "Fragrant rice dish flavored with spices.",
      description_ar: "طبق أرز معطر بالتوابل...",
      image: "spiced-rice.jpeg",
      cooking_time: "30 minutes",
      ingredients: "Rice, Cardamom, Cinnamon, Clove, Star Anise",
      ingredients_ar: "أرز، هيل، قرفة، قرنفل، يانسون نجمي",
      steps: "1. Rinse rice. 2. Sauté spices. 3. Add water and rice then cook.",
      steps_ar: "1. اغسل الأرز. 2. قلقل التوابل. 3. أضف الماء والأرز ثم اطهه.",
      difficulty: "Easy"
    }
  ];

  for (const recipe of recipes) {
    await prisma.recipe.create({ data: recipe });
  }

  console.log('Seeding finished with 18 products and 7 recipes.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
