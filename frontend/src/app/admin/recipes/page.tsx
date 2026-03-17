"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getRecipes, API_URL } from "@/lib/api";
import { getRecipeImage } from "@/lib/images";
import { FaPlus, FaPencil, FaTrashCan } from "react-icons/fa6";

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    title_ar: "",
    description: "",
    description_ar: "",
    ingredients: "",
    ingredients_ar: "",
    steps: "",
    steps_ar: "",
    cooking_time: "",
    difficulty: "Easy",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  useEffect(() => {
    if (editingRecipe) {
      setFormData({
        title: editingRecipe.title || "",
        title_ar: editingRecipe.title_ar || "",
        description: editingRecipe.description || "",
        description_ar: editingRecipe.description_ar || "",
        ingredients: editingRecipe.ingredients || "",
        ingredients_ar: editingRecipe.ingredients_ar || "",
        steps: editingRecipe.steps || "",
        steps_ar: editingRecipe.steps_ar || "",
        cooking_time: editingRecipe.cooking_time || "",
        difficulty: editingRecipe.difficulty || "Easy",
        image: editingRecipe.image || "",
      });
    } else {
      setFormData({
        title: "",
        title_ar: "",
        description: "",
        description_ar: "",
        ingredients: "",
        ingredients_ar: "",
        steps: "",
        steps_ar: "",
        cooking_time: "",
        difficulty: "Easy",
        image: "",
      });
    }
    setSelectedFile(null);
  }, [editingRecipe, isModalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      let finalImagePath = formData.image;

      // 1. Upload image if new one selected
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        const uploadRes = await fetch(`${API_URL}/uploads/recipe`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: uploadData,
        });
        const uploadResult = await uploadRes.json();
        if (uploadResult.filename) {
          finalImagePath = uploadResult.filename;
        }
      }

      // 2. Create or Update recipe
      const recipeData = { ...formData, image: finalImagePath };
      const url = editingRecipe 
        ? `${API_URL}/recipes/${editingRecipe.id}`
        : `${API_URL}/recipes`;
      
      const res = await fetch(url, {
        method: editingRecipe ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipeData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchRecipes();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || "Failed to save recipe"}`);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
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
          onClick={() => {
            setEditingRecipe(null);
            setIsModalOpen(true);
          }}
          className="group flex items-center gap-3 rounded-full bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <FaPlus size={18} className="transition-transform group-hover:rotate-90" />
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
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setEditingRecipe(recipe);
                      setIsModalOpen(true);
                    }}
                    aria-label="Edit recipe"
                    className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-90 shadow-sm"
                  >
                    <FaPencil size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(recipe.id)}
                    aria-label="Delete recipe"
                    className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all active:scale-90 shadow-sm"
                  >
                    <FaTrashCan size={14} />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl my-8 animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-8">
              {editingRecipe ? `Edit: ${editingRecipe.title}` : "New Recipe Details"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: English Info */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-primary/60 border-b pb-2">English Details</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full p-4 rounded-2xl bg-secondary/10 border-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full p-4 rounded-2xl bg-secondary/10 border-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Ingredients</label>
                    <textarea name="ingredients" value={formData.ingredients} onChange={handleInputChange} rows={4} placeholder="List items..." className="w-full p-4 rounded-2xl bg-secondary/10 border-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Steps</label>
                    <textarea name="steps" value={formData.steps} onChange={handleInputChange} rows={4} placeholder="1. Heat...&#10;2. Add..." className="w-full p-4 rounded-2xl bg-secondary/10 border-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>

                {/* Right Column: Arabic Info & Meta */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-primary/60 border-b pb-2">أرقام وتفاصيل عربية</h3>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold">العنوان</label>
                    <input type="text" name="title_ar" value={formData.title_ar} onChange={handleInputChange} dir="rtl" className="w-full p-4 rounded-2xl bg-secondary/10 border-none focus:ring-2 focus:ring-primary/20 text-right" />
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold">الوصف</label>
                    <textarea name="description_ar" value={formData.description_ar} onChange={handleInputChange} rows={2} dir="rtl" className="w-full p-4 rounded-2xl bg-secondary/10 border-none focus:ring-2 focus:ring-primary/20 text-right" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Time (e.g. 20 min)</label>
                      <input type="text" name="cooking_time" value={formData.cooking_time} onChange={handleInputChange} className="w-full p-4 rounded-2xl bg-secondary/10 border-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Difficulty</label>
                      <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} className="w-full p-4 rounded-2xl bg-secondary/10 border-none focus:ring-2 focus:ring-primary/20">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Intermédiare</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">Recipe Illustration</label>
                    <div className="relative group overflow-hidden rounded-2xl bg-secondary/10 p-4 border-2 border-dashed border-secondary hover:border-primary/40 transition-colors">
                      <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className="flex flex-col items-center justify-center py-4 text-center">
                        <span className="text-xs font-bold text-foreground/40 italic">
                          {selectedFile ? selectedFile.name : (formData.image || "Tap to select photo")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full border border-secondary px-8 py-5 font-bold hover:bg-secondary/10 transition-colors active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-full bg-primary px-8 py-5 font-bold text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : (editingRecipe ? "Update Recipe" : "Publish Recipe")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
