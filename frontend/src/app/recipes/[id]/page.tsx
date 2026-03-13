import Image from "next/image";
import { getRecipe } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const recipe = await getRecipe(params.id);

  if (!recipe) notFound();

  return (
    <div className="container py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Recipe Header */}
        <div className="relative h-[60vh] rounded-[3rem] overflow-hidden shadow-2xl mb-16">
          <Image
            src={recipe.image.startsWith('http') ? recipe.image : `/${recipe.image}`}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12">
            <div className="flex gap-4 mb-4">
              <span className="bg-primary px-4 py-1.5 rounded-full text-xs font-bold text-primary-foreground shadow-lg">
                {recipe.difficulty || 'Easy'}
              </span>
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white">
                {recipe.cooking_time}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">{recipe.title}</h1>
            <span className="text-2xl text-white/60 font-medium mt-2 italic font-serif" dir="rtl">{recipe.title_ar}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-16">
          {/* Sidebar: Ingredients & Spices */}
          <div className="md:col-span-1 flex flex-col gap-12">
            <div className="p-8 bg-secondary/20 rounded-[2.5rem] border border-secondary/50">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-primary">✦</span> Ingredients
              </h3>
              <ul className="space-y-4">
                {recipe.ingredients.split('\n').map((ing: string, i: number) => (
                  <li key={i} className="flex gap-3 text-foreground/80 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {recipe.spices_used && (
              <div className="p-8 bg-accent/10 rounded-[2.5rem] border border-accent/20">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-accent">✧</span> Spices Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.spices_used.split(',').map((spice: string, i: number) => (
                    <span key={i} className="bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm border">
                      {spice.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main: Steps */}
          <div className="md:col-span-2 space-y-12">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold tracking-tight">Step-by-Step Preparation</h3>
              <div className="space-y-10">
                {recipe.steps.split('\n').filter((s: string) => s.trim()).map((step: string, i: number) => (
                  <div key={i} className="flex gap-8 group">
                    <span className="text-5xl font-black text-secondary group-hover:text-primary/20 transition-colors">{(i + 1).toString().padStart(2, '0')}</span>
                    <div className="flex flex-col gap-2 pt-2">
                      <p className="text-lg text-foreground/80 leading-relaxed">{step.replace(/^\d+\.\s*/, '')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-12 border-t">
              <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-2">Love this recipe?</h4>
                  <p className="text-foreground/60">Order authentic spices featured in this dish and bring the taste of Morocco to your home.</p>
                </div>
                <a href="/products" className="rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105">
                  Shop Spices
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
