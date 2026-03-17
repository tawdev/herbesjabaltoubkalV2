import Image from "next/image";
import Link from "next/link";
import { getRecipes } from "@/lib/api";
import { getRecipeImage } from "@/lib/images";

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <div className="container mx-auto py-24 px-6 lg:px-8">
      <div className="flex flex-col items-center gap-6 text-center mb-24">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            aria-label="Back to home page"
            className="text-primary font-bold text-sm hover:underline flex items-center gap-2 justify-center mb-4 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Home
          </Link>
          <span className="text-foreground/70 font-black uppercase tracking-[0.4em] text-xs">Jabal Toubkal Kitchen</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Moroccan Recipes</h1>
        </div>
        <p className="text-foreground/80 max-w-2xl text-lg text-pretty italic font-semibold font-serif">
          Master the art of Moroccan cuisine with our curated collection of traditional and modern recipes featuring the finest Atlas herbs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {recipes.map((recipe: any) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            aria-label={`View recipe for ${recipe.title}`}
            className="group flex flex-col gap-6 overflow-hidden rounded-[2.5rem] bg-white border border-secondary/50 transition-all hover:shadow-2xl hover:-translate-y-2"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={getRecipeImage(recipe.image, recipe.title)}
                alt={recipe.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-6 right-6 rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-2">
                <span className="text-lg">⏱️</span> {recipe.cooking_time}
              </div>
            </div>

            <div className="flex flex-col gap-4 p-8 pt-2">
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{recipe.title}</h3>
              </div>
              <p className="text-foreground/80 line-clamp-2 text-sm leading-relaxed italic font-semibold font-serif">
                {recipe.description}
              </p>
              <div className="flex items-center gap-4 mt-4 pt-6 border-t border-secondary/50">
                <span className="text-xs font-black uppercase tracking-widest text-primary group-hover:tracking-[0.2em] transition-all">View Recipe</span>
                <div className="h-0.5 w-8 bg-primary/20 group-hover:w-16 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
