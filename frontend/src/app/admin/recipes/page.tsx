"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getRecipes, API_URL } from "@/lib/api";
import { getRecipeImage } from "@/lib/images";

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this recipe from the collection?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/recipes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchRecipes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recipes Management</h1>
          <p className="text-foreground/50 font-medium">Curate culinary inspiration for your customers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105"
        >
          Create New Recipe
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center text-foreground/30 font-bold animate-pulse">Loading recipes...</div>
        ) : recipes.map((recipe) => (
          <div key={recipe.id} className="group relative flex flex-col gap-6 p-6 bg-white rounded-[2.5rem] border border-secondary shadow-sm transition-all hover:shadow-xl">
             <div className="relative aspect-video rounded-3xl overflow-hidden grayscale-[50%] group-hover:grayscale-0 transition-all duration-500">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
                <Image 
                   src={getRecipeImage(recipe.image, recipe.title)} 
                   alt={recipe.title}
                   fill
                   unoptimized
                   className="object-cover"
                />
             </div>
             <div className="flex flex-col gap-2">
                <h3 className="font-bold text-xl truncate">{recipe.title_ar || recipe.title}</h3>
                <p className="text-xs text-foreground/40 line-clamp-2 italic">{recipe.description_ar || recipe.description}</p>
             </div>
             <div className="flex items-center justify-between mt-auto pt-4 border-t border-secondary/50">
                <div className="flex items-center gap-2">
                   <span className="px-3 py-1 bg-secondary/50 rounded-lg text-[10px] font-black uppercase tracking-widest text-foreground/60">{recipe.cooking_time}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-blue-500 hover:text-blue-700 font-bold text-xs">Edit</button>
                  <button 
                    onClick={() => handleDelete(recipe.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-xs"
                  >
                    Delete
                  </button>
                </div>
             </div>
          </div>
        ))}
        {!loading && recipes.length === 0 && (
          <div className="col-span-full py-20 text-center text-foreground/30 font-bold italic">No recipes found. Start adding some!</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-12 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-8">New Recipe Details</h2>
            <div className="space-y-6 text-xs text-foreground/40 font-bold uppercase tracking-widest text-center py-10 border-2 border-dashed rounded-3xl mb-10">
               Recipe Content Management System <br />
               (Prisma-backed storage integration)
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-full border border-secondary px-8 py-4 font-bold hover:bg-secondary/10 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                Publish Recipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
