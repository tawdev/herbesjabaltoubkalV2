import Image from "next/image";
import Link from "next/link";
import { getRecipes } from "@/lib/api";
import { getRecipeImage } from "@/lib/images";
import { Metadata } from "next";
import { FaUtensils, FaRegClock, FaArrowRightLong } from "react-icons/fa6";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Alchemic Grimoire | Jabal Toubkal",
  description: "Master the ancestral art of Moroccan cuisine. Discover our traditional recipes and botanical rituals from the High Atlas.",
};

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <div className="bg-background min-h-screen pb-32 animate-in fade-in duration-1000">
      <div className="container mx-auto py-32 px-6 lg:px-20">
        <header className="flex flex-col items-center gap-12 text-center mb-40">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 mb-2">
               <div className="h-px w-12 bg-[#C5A059]/30" />
               <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#C5A059]">The Alchemic Grimoire</span>
               <div className="h-px w-12 bg-[#C5A059]/30" />
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter text-foreground leading-[0.85] uppercase">
              Culinary <span className="text-[#C5A059]">Rituals</span>
            </h1>
          </div>
          <p className="text-foreground/40 max-w-2xl text-xl font-serif italic leading-[1.8] border-l-2 border-[#C5A059]/20 pl-10 pr-10">
            Transmit the knowledge of the ancestors through every blend. Master the art of Moroccan cuisine with our curated botanical transmissions.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-24">
          {recipes.map((recipe: any) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="group flex flex-col bg-transparent relative hover:-translate-y-3 transition-all duration-700"
            >
              <div className="relative aspect-[4/5] overflow-hidden border border-[#C5A059]/10 bg-black shadow-2xl rounded-sm">
                <Image
                  src={getRecipeImage(recipe.image, recipe.title)}
                  alt={recipe.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-[3s] scale-105 group-hover:scale-125 grayscale-[0.3] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
                
                <div className="absolute top-8 right-0 translate-x-4 group-hover:translate-x-0 transition-transform duration-700">
                   <div className="border border-[#C5A059]/20 bg-background/90 backdrop-blur-xl px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059] shadow-2xl flex items-center gap-3">
                      <FaRegClock size={12} />
                      {recipe.cooking_time}
                   </div>
                </div>

                <div className="absolute bottom-10 left-10 right-10 space-y-6">
                    <div className="flex items-center gap-3 text-[#C5A059] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                       <FaUtensils size={14} />
                       <span className="text-[9px] font-black uppercase tracking-[0.4em]">{recipe.difficulty || 'Ancestral'}</span>
                    </div>
                </div>
              </div>

              <div className="flex flex-col pt-10 space-y-6 flex-1">
                <div className="space-y-4 flex-1 flex flex-col">
                  <h3 className="text-3xl font-serif text-foreground font-black uppercase tracking-tighter leading-tight group-hover:text-[#C5A059] transition-colors duration-500 line-clamp-2 min-h-[4.5rem] flex items-center">
                    {recipe.title}
                  </h3>
                  <div className="max-w-xs mt-auto">
                    <p className="text-foreground/40 line-clamp-2 text-base leading-relaxed font-serif italic border-l-2 border-[#C5A059]/10 pl-6 group-hover:border-[#C5A059]/40 transition-colors min-h-[3rem] flex items-center">
                      {recipe.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 pt-6 border-t border-[#C5A059]/10">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059] group-hover:text-foreground transition-all">Summon Recipe</span>
                  <FaArrowRightLong className="text-[#C5A059]/40 group-hover:text-foreground group-hover:translate-x-4 transition-all duration-500" size={16} />
                </div>
                
                <div className="absolute top-0 right-0 -translate-y-16 text-[150px] font-serif italic text-[#C5A059]/5 pointer-events-none select-none group-hover:text-[#C5A059]/10 transition-colors">
                   {recipe.id.toString().padStart(2, '0')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
