import Image from "next/image";
import Link from "next/link";
import { getRecipes } from "@/lib/api";

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <div className="container py-20 px-4">
      <div className="flex flex-col items-center gap-4 text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight">Culinary Inspiration</h1>
        <p className="text-foreground/60 max-w-2xl text-lg">
          Master the art of spice with our curated collection of traditional and modern recipes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {recipes.map((recipe: any) => (
          <Link 
            key={recipe.id} 
            href={`/recipes/${recipe.id}`}
            className="group flex flex-col gap-6 overflow-hidden rounded-3xl bg-secondary/10 border border-secondary/50 transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={recipe.image.startsWith('http') ? recipe.image : `/${recipe.image}`}
                alt={recipe.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-bold shadow-sm">
                {recipe.cooking_time}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 p-8 pt-2">
              <div className="flex flex-col">
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{recipe.title}</h3>
                <span className="text-sm text-foreground/40 font-medium">{recipe.title_ar}</span>
              </div>
              <p className="text-foreground/60 line-clamp-2 text-sm leading-relaxed">
                {recipe.description}
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-secondary">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">View Recipe</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
