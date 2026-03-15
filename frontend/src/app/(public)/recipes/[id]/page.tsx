import Image from "next/image";
import { getRecipe } from "@/lib/api";
import { notFound } from "next/navigation";
import { getRecipeImage } from "@/lib/images";
import Link from "next/link";

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const recipe = await getRecipe(params.id);

  if (!recipe) notFound();

  return (
    <div className="container mx-auto py-24 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-12">
          <Link
            href="/recipes"
            aria-label="Back to recipes list"
            className="text-primary font-bold text-sm hover:underline flex items-center gap-2 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Recipes
          </Link>
        </div>

        {/* Recipe Header */}
        <div className="relative h-[65vh] rounded-[3.5rem] overflow-hidden shadow-2xl mb-20 border-8 border-white">
          <Image
            src={getRecipeImage(recipe.image, recipe.title)}
            alt={recipe.title}
            fill
            unoptimized
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-16">
            <div className="flex gap-4 mb-6">
              <span className="bg-primary/90 backdrop-blur-md px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest text-primary-foreground shadow-xl">
                {recipe.difficulty || 'Medium'}
              </span>
              <span className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-xl flex items-center gap-2">
                <span className="text-sm">⏱️</span> {recipe.cooking_time}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-4">{recipe.title}</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-20">
          {/* Left: Ingredients */}
          <div className="lg:col-span-4 space-y-12">
            <div className="p-10 bg-secondary/10 rounded-[3rem] border border-secondary/50 sticky top-32">
              <h3 className="text-3xl font-bold mb-10 flex items-center gap-4">
                <span className="h-10 w-10 flex items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl">✦</span>
                Ingredients
              </h3>
              <ul className="space-y-6">
                {recipe.ingredients.split(',').map((ing: string, i: number) => (
                  <li key={i} className="flex gap-4 text-foreground/90 leading-relaxed font-serif italic text-lg border-b border-secondary/30 pb-4 last:border-0 font-medium">
                    <span className="text-primary font-bold text-sm mt-1">0{i+1}</span>
                    {ing.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Steps */}
          <div className="lg:col-span-8 flex flex-col gap-16">
            <div className="space-y-12">
              <div className="flex flex-col gap-2">
                <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">The Process</span>
                <h3 className="text-5xl font-bold tracking-tight">Preparation Steps</h3>
              </div>

              <div className="space-y-16">
                {recipe.steps.split(/\d+\.\s*/).filter((s: string) => s.trim()).map((step: string, i: number) => (
                  <div key={i} className="flex gap-10 group">
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-7xl font-black text-secondary/30 group-hover:text-primary/20 transition-all duration-500">{(i + 1).toString().padStart(2, '0')}</span>
                      <div className="w-1 flex-1 bg-gradient-to-b from-secondary/20 to-transparent group-last:hidden" />
                    </div>
                    <div className="flex flex-col gap-4 pt-4">
                      <p className="text-xl text-foreground/80 leading-relaxed font-serif italic font-medium">
                        {step.trim()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="pt-20">
              <div className="relative p-12 bg-primary rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-12 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-colors" />
                <div className="relative flex-1 text-center md:text-left">
                  <h4 className="text-3xl font-bold text-white mb-4">Did you enjoy this recipe?</h4>
                  <p className="text-primary-foreground/80 text-lg font-serif italic">Order the authentic herbs and spices used in this dish and enjoy the taste of the Atlas at home.</p>
                </div>
                <Link
                  href="/products"
                  className="relative rounded-full bg-white px-10 py-5 font-black uppercase tracking-widest text-primary shadow-xl transition-all hover:scale-110 active:scale-95 hover:shadow-2xl"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
