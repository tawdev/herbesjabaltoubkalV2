const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedManuscripts() {
  console.log('📜 Seeding the Library of Wisdom with ancient manuscripts...');

  const manuscripts = [
    {
      title: "L'Or Pourpre de Taliouine : Le Sceau du Safran",
      title_ar: "الذهب الأرجواني في تالوين: ختم الزعفران",
      content: `Au cœur du Haut Atlas, là où la terre rencontre le ciel, fleurit chaque automne un trésor plus précieux que l'or. Le Safran de Jabal Toubkal n'est pas une simple épice, c'est une transmission ancestrale.

Chaque filament est cueilli à l'aube, avant que les premiers rayons du soleil ne viennent flétrir la délicate fleur de Crocus Sativus. Ce rituel, transmis de mère en fille, exige une patience infinie et une pureté d'intention absolue.

Bienfaits :
- Équilibre émotionnel et sérénité.
- Digestion harmonieuse.
- Activation de l'éclat intérieur.

Ce manuscrit authentifie la récolte de cette saison comme étant l'une des plus pures de la décennie.`,
      content_ar: `في قلب الأطلس الكبير، حيث تلتقي الأرض بالسماء، يزهر كل خريف كنز أغلى من الذهب. زعفران جبل توبقال ليس مجرد توابل، بل هو انتقال أسلافي.

يتم قطف كل خيط عند الفجر، قبل أن تذبل خيوط شمس الصباح زهرة الزعفران الرقيقة. يتطلب هذا الطقس، المنقول من الأم إلى ابنتها، صبراً لا نهائياً ونقاءً مطلقاً في النية.

الفوائد:
- التوازن العاطفي والصفاء.
- هضم متناغم.
- تنشيط الإشراق الداخلي.

تؤكد هذه المخطوطة أن حصاد هذا الموسم هو الأرقى منذ عقد من الزمن.`,
      image: "saffron_fields.jpg",
      excerpt: "Découvrez le rituel sacré de la récolte du safran dans les vallées de Taliouine, un héritage de patience et de pureté."
    },
    {
      title: "Le Thym Sauvage : Souffle des Cimes de l'Altas",
      title_ar: "الزعتر البري: أنفاس قمم الأطلس",
      content: `Le Thym qui croît sur les pentes escarpées du Toubkal forge son caractère dans la neige et le soleil brûlant. C'est une herbe souveraine, imprégnée de la force minérale de la montagne.

Récolté à la main par les gardiens du savoir local, ce thym sauvage possède une concentration d'huiles essentielles inégalée, capable de purifier le souffle et de fortifier l'esprit.

Usage rituel :
Infusion à 85°C durant 7 minutes. Respire d'abord les vapeurs pour ouvrir les voies de la conscience avant de déguster.

La montagne donne ce qu'elle a de meilleur à ceux qui savent l'écouter.`,
      content_ar: `الزعتر الذي ينمو على المنحدرات الوعرة لتوبقال يصقل شخصيته في الثلج والشمس الحارقة. إنها عشبة سيادية، مشبعة بالقوة المعدنية للجبل.

يتم حصاد هذا الزعتر البري يدوياً من قبل حراس المعرفة المحلية، وهو يمتلك تركيزاً من الزيوت الأساسية لا مثيل له، القادرة على تطهير النفس وتقوية الروح.

الاستخدام الطقسي:
نقع في درجة حرارة 85 مئوية لمدة 7 دقائق. استنشق الأبخرة أولاً لفتح مسارات الوعي قبل التذوق.

الجبل يعطي أفضل ما لديه لمن يعرف كيف يستمع إليه.`,
      image: "wild_thyme.jpg",
      excerpt: "Une transmission sur la force minérale du thym sauvage récolté sur les crêtes enneigées du Haut Atlas."
    },
    {
      title: "La Verveine Citronnée : Le Sommeil du Juste",
      title_ar: "اللويزة الليمونية: نوم العادل",
      content: `Quand l'ombre du Toubkal s'étend sur la vallée, le rituel de la Verveine commence. Ses feuilles, froissées entre les doigts, libèrent un arôme qui apaise instantanément le tumulte du monde extérieur.

C'est l'alliée des nuits réparatrices. Dans nos traditions, la Verveine est le baume qui répare les fils invisibles de notre paix intérieure.

Conseil de Scribe :
Ajoutez une goutte de miel de montagne pour sceller les bienfaits de cette herbe sacrée. Laissez le silence s'installer.`,
      content_ar: `عندما يمتد ظل توبقال على الوادي، يبدأ طقس اللويزة. أوراقها، عند فركها بين الأصابع، تطلق رائحة تهدئ على الفور صخب العالم الخارجي.

إنها حليفة الليالي المريحة. في تقاليدنا، اللويزة هي البلسم الذي يصلح الخيوط غير المرئية لسلامنا الداخلي.

نصيحة السكرتير:
أضف قطرة من عسل الجبل لختم فوائد هذه العشبة المقدسة. اترك الصمت يستقر.`,
      image: "verbena_tea.jpg",
      excerpt: "Le secret des nuits sereines et de la paix intérieure révélé à travers le cycle de la verveine citronnée."
    }
  ];

  try {
    for (const manuscript of manuscripts) {
      await prisma.blog.create({
        data: manuscript
      });
    }
    console.log('✅ 3 Royal Manuscripts have been archived in the Library.');
  } catch (error) {
    console.error('❌ Error archival:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedManuscripts();
