import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Expanding blog content...');
  const newBlogs = [
    {
      title: 'The Art of Moroccan Tea Ceremony',
      title_ar: 'فن طقوس الشاي المغربي',
      excerpt: 'More than just a drink, it\'s a symbol of hospitality and ancient traditions.',
      excerpt_ar: 'أكثر من مجرد مشروب، إنه رمز للضيافة والتقاليد العريقة.',
      content: 'In the High Atlas, tea is the heartbeat of every home. While mint is the star, we also blend in "Sheba" (Wormwood) for winter warmth or "Louiza" (Lemon Verbena) for calm. The secret lies in the quality of the dried herbs and the height from which the tea is poured...',
      content_ar: 'في الأطلس الكبير، يعتبر الشاي نبض كل بيت. بينما يعتبر النعناع هو النجم، فإننا نمزج أيضًا "الشيبة" للدفء الشتوي أو "اللويزة" للهدوء. السر يكمن في جودة الأعشاب المجففة والارتفاع الذي يسكب منه الشاي...',
      image: 'natural_herbs.jpg',
    },
    {
      title: 'Ras El Hanout: The Soul of Moroccan Spices',
      title_ar: 'رأس الحانوت: روح التوابل المغربية',
      excerpt: 'Understand the complex blend of over 30 ingredients that defines our cuisine.',
      excerpt_ar: 'تعرف على المزيج المعقد لأكثر من 30 مكونًا يميز مطبخنا.',
      content: 'Literally meaning "Head of the Shop," Ras El Hanout represents the spice merchant\'s finest selection. Our blend includes cardamom, nutmeg, mace, allspice, galangal, ginger, and even dried rosebuds. It is the essential secret for the perfect Mrouzia...',
      content_ar: 'تعني حرفياً "رأس الحانوت"، وهي تمثل أفضل اختيار لتاجر التوابل. يشمل مزيجنا الهيل، جوزة الطيب، البسباس، الزنجبيل، وحتى براعم الورد المجففة. إنه السر الضروري للمروزية المثالية...',
      image: 'slider/slide2.jpg',
    },
    {
      title: 'Harvesting Hope: Our Atlas Cooperatives',
      title_ar: 'حصاد الأمل: تعاونيات الأطلس لدينا',
      excerpt: 'Meet the women and families behind your favorite aromatic treasures.',
      excerpt_ar: 'تعرف على النساء والعائلات التي تقف وراء كنوزك العطرية المفضلة.',
      content: 'Sustainability is at our core. By working directly with local High Atlas cooperatives, we ensure that every gram of lavender and thyme supports rural empowerment. We follow the rhythm of nature, harvesting only what is needed to ensure longevity...',
      content_ar: 'الاستدامة هي جوهر عملنا. من خلال العمل المباشر مع تعاونيات الأطلس الكبير المحلية، نضمن أن كل غرام من الخزامى والزعتر يدعم التمكين الريفي. نحن نتبع إيقاع الطبيعة، ونحصد فقط ما هو مطلوب لضمان الاستمرارية...',
      image: 'slider/slide1.jpg',
    }
  ];

  for (const blog of newBlogs) {
    await prisma.blog.create({ data: blog });
    console.log(`Added blog: ${blog.title}`);
  }

  console.log('Expanding recipes...');
  const newRecipes = [
    {
      title: 'Traditional Atlas Chicken Tagine',
      title_ar: 'طاجين الدجاج الأطلسي التقليدي',
      description: 'A slow-cooked masterpiece featuring our premium saffron and ginger.',
      description_ar: 'تحفة مطبوخة ببطء تتميز بالزعفران والزنجبيل الممتاز.',
      image: 'recipes/tagine.jpg',
      ingredients: '1 Large Chicken, 2 Onions, Small bunch of coriander, Herbes Jabal Toubkal Saffron (0.5g), 1 tsp Ginger, 1 tsp Turmeric, Preserved Lemon, Olives.',
      ingredients_ar: 'دجاجة كبيرة، بصلتان، باقة صغيرة من القزبر، زعفران أعشاب جبل توبقال (0.5 غ)، ملعقة صغيرة زنجبيل، ملعقة صغيرة كركم، حمض مصير، زيتون.',
      steps: 'Marinate chicken in spices. Sauté onions. Layer chicken in tagine. Add saffron water. Simmer for 1.5 hours. Garnish with olives.',
      steps_ar: 'يُنقع الدجاج في التوابل. يُقلى البصل. يوضع الدجاج في الطاجين. يضاف ماء الزعفران. يُطهى على نار هادئة لمدة ساعة ونصف. يُزين بالزيتون.',
      cooking_time: '1h 45m',
      difficulty: 'Medium',
    },
    {
      title: 'Spiced Atlas Harira Soup',
      title_ar: 'شوربة الحريرة الأطلسية المتبلة',
      description: 'The rich, aromatic soul of Moroccan Ramadan, available year-round.',
      description_ar: 'الشوربة العطرية الغنية لرمضان المغربي، متوفرة طوال العام.',
      image: 'recipes/soup.jpg',
      ingredients: 'Chickpeas, Lentils, Celery, Fresh Herbs, Tomato paste, Flour for thickening, Cinnamon, Ginger, Pepper.',
      ingredients_ar: 'حمص، عدس، كرفس، أعشاب طازجة، معجون طماطم، دقيق للتكثيف، قرفة، زنجبيل، إبزار.',
      steps: 'Soak chickpeas overnight. Sauté herbs and onions. Boil pulses until tender. Add spices and tomato. Thicken with flour mixture. Finish with cilantro.',
      steps_ar: 'يُنقع الحمص طوال الليل. تُقلى الأعشاب والبصل. تُغلى البقوليات حتى تنضج. تضاف التوابل والطماطم. تُكثف بخليط الدقيق. يُنهى بالقزبر.',
      cooking_time: '2h 00m',
      difficulty: 'Easy',
    }
  ];

  for (const recipe of newRecipes) {
    await prisma.recipe.create({ data: recipe });
    console.log(`Added recipe: ${recipe.title}`);
  }

  console.log('Expansion complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
