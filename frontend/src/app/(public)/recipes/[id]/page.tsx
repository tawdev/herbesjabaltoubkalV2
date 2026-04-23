import { Metadata, ResolvingMetadata } from 'next';
import Image from "next/image";
import { getRecipe, getProducts } from "@/lib/api";
import { notFound } from "next/navigation";
import { getRecipeImage } from "@/lib/images";
import Link from "next/link";
import { FaArrowLeftLong, FaRegClock, FaFireBurner, FaMortarPestle, FaScroll } from "react-icons/fa6";
import ActionableIngredient from "@/components/ActionableIngredient";
import EnbodyEssenceButton from "@/components/EnbodyEssenceButton";

type Props = {
  params: Promise<{ id: string }>;
};

// SEO: Generate Dynamic Metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id;
  const recipe = await getRecipe(id).catch(() => null);

  if (!recipe) {
    return { title: 'Recette non trouvée' };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const imageUrl = getRecipeImage(recipe.image, recipe.title);

  return {
    title: recipe.title,
    description: recipe.description?.substring(0, 160) || `Découvrez la recette ${recipe.title} utilisant les herbes Jabal Toubkal.`,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      url: `https://herbesjabaltoubkal.ma/recipes/${id}`,
      siteName: 'Herbes Jabal Toubkal',
      images: [imageUrl, ...previousImages],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.title,
      description: recipe.description,
      images: [imageUrl],
    },
  };
}

export default async function RecipeDetailPage({
  params,
}: Props) {
  const { id } = await params;
  
  let recipe;
  let products: any[] = [];
  try {
    const [recipeData, productsData] = await Promise.all([
      getRecipe(id),
      getProducts({}).catch(() => [])
    ]);
    recipe = recipeData;
    products = productsData;
  } catch (error) {
    console.error("Recipe fetch error:", error);
    return notFound();
  }

  if (!recipe) notFound();

  // Process ingredients and match with products
  const ingredientNames = recipe.ingredients.split(',').map((i: string) => i.trim());
  
  // Find which products match the ingredients
  const ingredientsWithProducts = ingredientNames.map((ingName: string) => {
    // Basic fuzzy matching: if ingredient name is in product name or vice versa
    const matchingProduct = products.find(p => 
      p.name.toLowerCase().includes(ingName.toLowerCase()) || 
      ingName.toLowerCase().includes(p.name.toLowerCase())
    );
    return { name: ingName, product: matchingProduct };
  });

  // Filter products for the "Add All" button (only those found in the database)
  const availableProducts = ingredientsWithProducts
    .filter((item: any) => item.product)
    .map((item: any) => item.product);

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: getRecipeImage(recipe.image, recipe.title),
    description: recipe.description,
    prepTime: 'PT15M', // Fallback
    cookTime: recipe.cooking_time ? `PT${recipe.cooking_time.replace(/[^0-9]/g, '')}M` : 'PT30M',
    recipeIngredient: ingredientNames,
    recipeInstructions: recipe.steps.split(/\d+\.\s*/).filter((s: string) => s.trim()).map((step: string) => ({
      '@type': 'HowToStep',
      text: step.trim(),
    })),
    author: {
      '@type': 'Organization',
      name: 'Herbes Jabal Toubkal',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-background min-h-screen pb-32 animate-in fade-in duration-1000">
        <div className="container mx-auto py-20 px-6 lg:px-12 xl:px-20">
          <div className="max-w-[1400px] mx-auto">
            {/* Back Navigation */}
            <div className="mb-20">
              <Link
                href="/recipes"
                className="text-foreground/30 text-[10px] font-black uppercase tracking-[0.4rem] hover:text-[#C5A059] transition-all flex items-center gap-6 group"
              >
                <FaArrowLeftLong className="group-hover:-translate-x-3 transition-transform" size={16} />
                The Grimoire Archives
              </Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-32 items-start">
              {/* Left: Content & Narrative */}
              <div className="xl:col-span-7 space-y-16 md:space-y-24 order-2 xl:order-1">
                  <div className="space-y-8 md:space-y-10">
                      <div className="flex flex-wrap items-center gap-4 md:gap-8">
                          <div className="flex items-center gap-3 text-[#C5A059]">
                             <FaFireBurner size={14} />
                             <span className="text-[10px] font-black uppercase tracking-[0.4em]">{recipe.difficulty || 'Ancestral Ritual'}</span>
                          </div>
                          <div className="hidden sm:block h-px w-12 bg-[#C5A059]/30" />
                          <div className="flex items-center gap-3 text-foreground/30">
                             <FaRegClock size={14} />
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] font-serif">{recipe.cooking_time}</span>
                          </div>
                      </div>
                      
                      <div className="space-y-6">
                         <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-foreground font-black uppercase leading-[0.85] tracking-tight">{recipe.title}</h1>
                         <div className="flex justify-start xl:justify-end pt-2">
                         </div>
                      </div>
                      
                      <p className="text-lg md:text-2xl text-foreground/60 font-serif italic leading-relaxed max-w-2xl border-l-[3px] border-[#C5A059]/20 pl-6 md:pl-10">
                          {recipe.description}
                      </p>
                  </div>
 
                  <div className="space-y-8 md:space-y-12">
                     <div className="flex items-center gap-6">
                        <FaMortarPestle size={20} className="text-[#C5A059]" />
                        <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-[#C5A059]">Botanical Components</h3>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8 bg-card/10 border border-[#C5A059]/5 p-6 md:p-12 rounded-sm shadow-inner">
                          {ingredientsWithProducts.map((item: any, i: number) => (
                            <ActionableIngredient 
                              key={i} 
                              name={item.name} 
                              index={i} 
                              product={item.product} 
                            />
                          ))}
                     </div>
                     
                     {/* Add All To Cart Button */}
                     {availableProducts.length > 0 && (
                       <div className="pt-4 md:pt-8">
                          <EnbodyEssenceButton products={availableProducts} />
                       </div>
                     )}
                  </div>
 
                  <div className="space-y-12 md:space-y-16">
                      <div className="flex items-center gap-6">
                         <FaScroll size={20} className="text-[#C5A059]" />
                         <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-[#C5A059]">Process Sequence</h3>
                      </div>
                      <div className="space-y-16 md:space-y-24">
                          {recipe.steps.split(/\d+\.\s*/).filter((s: string) => s.trim()).map((step: string, i: number) => (
                          <div key={i} className="flex flex-col md:flex-row gap-8 md:gap-12 group">
                              <div className="md:w-32 flex flex-col items-start md:items-center">
                                 <span className="text-4xl md:text-6xl font-serif italic font-black text-[#C5A059]/10 group-hover:text-[#C5A059] transition-all duration-700">{(i + 1).toString().padStart(2, '0')}</span>
                                 <div className="hidden md:block h-full w-px bg-[#C5A059]/10 mt-6 group-last:hidden" />
                              </div>
                              <div className="flex-1 space-y-6">
                                 <p className="text-lg md:text-xl text-foreground/80 leading-[2] tracking-wide font-serif italic selection:bg-[#C5A059] selection:text-black">
                                     {step.trim()}
                                 </p>
                                 <div className="h-px w-0 group-hover:w-32 bg-[#C5A059] transition-all duration-1000" />
                              </div>
                          </div>
                          ))}
                      </div>
                  </div>
              </div>
 
              {/* Right: Immersive Media */}
              <div className="xl:col-span-5 space-y-12 md:space-y-16 order-1 xl:order-2 xl:sticky xl:top-32">
                  <div className="aspect-video sm:aspect-square xl:aspect-[4/5] relative border border-[#C5A059]/10 p-2 md:p-3 bg-black shadow-2xl overflow-hidden rounded-sm group">
                      <div className="relative w-full h-full overflow-hidden">
                          <Image
                              src={getRecipeImage(recipe.image, recipe.title)}
                              alt={recipe.title}
                              fill
                              unoptimized
                              className="object-cover transition-transform duration-[3s] scale-105 group-hover:scale-125"
                              priority
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                          <div className="absolute bottom-10 left-10 right-10 text-center">
                             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Visual Manifestation</span>
                          </div>
                      </div>
                  </div>

                  {/* Exclusive CTA */}
                  <div className="p-8 md:p-16 border border-[#C5A059]/20 bg-card relative overflow-hidden group/cta">
                      <div className="absolute top-0 right-0 p-1 border-b border-l border-[#C5A059]/10 text-[8px] font-black uppercase tracking-[0.3em] text-[#C5A059]/30">Merchant Link</div>
                      <div className="relative z-10 space-y-10 text-center">
                          <h4 className="text-3xl font-serif uppercase tracking-widest text-foreground font-black">Embody the <span className="text-[#C5A059]">Essence</span></h4>
                          <p className="text-[11px] uppercase tracking-[0.4em] leading-relaxed font-bold text-foreground/40 italic">Procure the authentic botanical resources used <br />in this ritual transmission.</p>
                          <Link
                              href="/products"
                              className="inline-block bg-[#C5A059] text-black px-16 py-6 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-xl shadow-[#C5A059]/10"
                          >
                              Shop the Artifacts
                          </Link>
                      </div>
                      <div className="absolute -bottom-10 -right-10 text-[120px] text-[#C5A059]/5 font-serif pointer-events-none select-none">"</div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
