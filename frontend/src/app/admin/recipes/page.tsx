"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getRecipes, API_URL } from "@/lib/api";
import { getRecipeImage } from "@/lib/images";
import { FaPlus, FaPencil, FaTrashCan, FaClock, FaChartBar, FaUtensils, FaScroll } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function AdminRecipesPage() {
  const router = useRouter();
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
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    try {
      setLoading(true);
      const data = await getRecipes();
      setRecipes(Array.isArray(data) ? data : []);
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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Executive Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#C5A059]/10 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-6 w-[2px] bg-[#C5A059]" />
             <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]/80">Culinary Grimoire</h4>
          </div>
          <h1 className="text-5xl font-serif font-bold text-foreground tracking-tight">Ancient <span className="text-[#C5A059]">Rituals</span></h1>
          <p className="text-foreground/40 font-serif italic text-lg">Curate and publish alchemical culinary sequences for the soul.</p>
        </div>
        <button 
          onClick={() => {
            setEditingRecipe(null);
            setIsModalOpen(true);
          }}
          className="px-10 py-5 bg-[#C5A059] text-black font-black uppercase tracking-widest text-xs transition-all hover:bg-foreground hover:text-background flex items-center gap-4 rounded-sm shadow-xl shadow-[#C5A059]/10"
        >
          <FaPlus size={16} />
          Create New Ritual
        </button>
      </header>

      {/* Premium Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
          <div className="col-span-full py-40 text-center flex flex-col items-center gap-6">
             <div className="w-12 h-12 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
             <span className="text-lg font-serif italic text-[#C5A059] tracking-widest animate-pulse">Summoning ancestral knowledge...</span>
          </div>
        ) : recipes.map((recipe) => (
          <div key={recipe.id} className="group relative flex flex-col bg-card border border-[#C5A059]/10 shadow-2xl transition-all hover:border-[#C5A059]/40 hover:-translate-y-2 rounded-sm overflow-hidden">
             <div className="relative aspect-[16/10] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                <Image 
                   src={getRecipeImage(recipe.image, recipe.title)} 
                   alt={recipe.title}
                   fill
                   unoptimized
                   className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute bottom-4 left-6 z-20">
                   <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#C5A059]">
                      <span className="bg-black/60 px-3 py-1 border border-[#C5A059]/20 flex items-center gap-2"><FaClock /> {recipe.cooking_time}</span>
                      <span className="bg-black/60 px-3 py-1 border border-[#C5A059]/20 flex items-center gap-2"><FaChartBar /> {recipe.difficulty}</span>
                   </div>
                </div>
             </div>
             
             <div className="p-8 space-y-4 flex-1 flex flex-col">
                <div className="space-y-1">
                   <h3 className="font-serif text-2xl font-bold uppercase tracking-wider text-foreground group-hover:text-[#C5A059] transition-colors leading-snug line-clamp-2">
                     {recipe.title_ar || recipe.title}
                   </h3>
                   <div className="h-0.5 w-12 bg-[#C5A059]/30 group-hover:w-full transition-all duration-700" />
                </div>
                <p className="text-sm text-foreground/40 line-clamp-3 italic font-serif leading-relaxed flex-1">
                  {recipe.description_ar || recipe.description}
                </p>
                
                <div className="flex items-center justify-between pt-8 border-t border-[#C5A059]/5 mt-4">
                  <button 
                    onClick={() => {
                      setEditingRecipe(recipe);
                      setIsModalOpen(true);
                    }}
                    className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] hover:text-foreground transition-all flex items-center gap-2 group/btn"
                  >
                    <FaPencil size={12} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                    Refine
                  </button>
                  <button 
                    onClick={() => handleDelete(recipe.id)}
                    className="text-[11px] font-black uppercase tracking-widest text-red-900/60 hover:text-red-500 transition-all flex items-center gap-2 group/btn"
                  >
                    <FaTrashCan size={12} className="group-hover/btn:scale-110 transition-transform" />
                    Dissolve
                  </button>
                </div>
             </div>
          </div>
        ))}
        {!loading && recipes.length === 0 && (
          <div className="col-span-full py-32 text-center text-foreground/10 font-serif italic text-3xl tracking-widest">The grimoire awaits your first ritual.</div>
        )}
      </div>

      {/* Ritual Formulation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 md:p-10 overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-6xl bg-card border border-[#C5A059]/20 p-10 md:p-20 shadow-2xl animate-in fade-in zoom-in duration-500 my-auto rounded-sm">
            <header className="flex items-center justify-between mb-16 border-b border-[#C5A059]/10 pb-10">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059]/50 mb-2">Ancestral Compilation</h4>
                  <h2 className="text-4xl font-serif text-[#C5A059] uppercase tracking-widest font-bold">{editingRecipe ? 'Refine Ritual' : 'Formulate New Ritual'}</h2>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-foreground/20 hover:text-[#C5A059] transition-all hover:rotate-90">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
               </button>
            </header>
            
            <form onSubmit={handleSubmit} className="space-y-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                {/* Left Side: Latin Script */}
                <div className="space-y-12">
                  <div className="flex items-center gap-4 mb-4">
                     <FaScroll className="text-[#C5A059]/40" />
                     <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#C5A059]">Latin Script (EN)</h3>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/50">The Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-lg text-foreground focus:outline-none focus:border-[#C5A059] transition-all rounded-sm" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/50">The Narrative (Description)</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full bg-background border border-[#C5A059]/10 p-6 text-sm text-foreground/70 font-serif italic focus:border-[#C5A059] transition-all resize-none rounded-sm" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/50">Alchemic Components (Ingredients)</label>
                    <textarea name="ingredients" value={formData.ingredients} onChange={handleInputChange} rows={5} className="w-full bg-background border border-[#C5A059]/10 p-6 text-sm text-foreground/70 font-serif italic focus:border-[#C5A059] transition-all resize-none rounded-sm" placeholder="List the sacred elements..." />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/50">Execution Sequence (Steps)</label>
                    <textarea name="steps" value={formData.steps} onChange={handleInputChange} rows={6} className="w-full bg-background border border-[#C5A059]/10 p-6 text-sm text-foreground/70 font-serif italic focus:border-[#C5A059] transition-all resize-none rounded-sm" placeholder="The ancestral preparation method..." />
                  </div>
                </div>

                {/* Right Side: Arabic Script & Meta */}
                <div className="space-y-12">
                  <div className="flex items-center justify-end gap-4 mb-4">
                     <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#C5A059]">النص العربي (AR)</h3>
                     <FaScroll className="text-[#C5A059]/40" />
                  </div>
                  <div className="space-y-4 text-right">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/50">العنوان</label>
                    <input type="text" name="title_ar" value={formData.title_ar} onChange={handleInputChange} dir="rtl" className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-2xl text-[#C5A059] text-right focus:outline-none focus:border-[#C5A059] transition-all font-arabic rounded-sm" />
                  </div>
                  <div className="space-y-4 text-right">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/50">الوصف الروحي</label>
                    <textarea name="description_ar" value={formData.description_ar} onChange={handleInputChange} rows={3} dir="rtl" className="w-full bg-background border border-[#C5A059]/10 p-6 text-xl text-foreground/70 text-right focus:border-[#C5A059] transition-all font-arabic resize-none rounded-sm" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/50">Chronos (Cooking Time)</label>
                      <input type="text" name="cooking_time" value={formData.cooking_time} onChange={handleInputChange} className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-base text-foreground focus:outline-none focus:border-[#C5A059] transition-all rounded-sm" placeholder="e.g. 45 min" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/50">Ascension (Difficulty)</label>
                      <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-xs font-black uppercase tracking-widest text-[#C5A059] focus:outline-none focus:border-[#C5A059] transition-colors appearance-none cursor-pointer rounded-sm">
                        <option value="Easy">Easy (Initiate)</option>
                        <option value="Medium">Medium (Adept)</option>
                        <option value="Hard">Intermédiaire (Master)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/50">Visual Aura</label>
                    <div className="relative group overflow-hidden border-2 border-dashed border-[#C5A059]/10 hover:border-[#C5A059]/40 transition-all p-12 text-center cursor-pointer rounded-sm bg-black/5">
                      <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className="flex flex-col items-center justify-center gap-4">
                        <FaUtensils size={24} className="text-[#C5A059]/20 group-hover:text-[#C5A059] transition-colors" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#C5A059]/40 group-hover:text-[#C5A059] transition-colors">
                          {selectedFile ? selectedFile.name : (formData.image ? "Manifest Existing Image" : "Transmit New Aura")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-8 pt-16 border-t border-[#C5A059]/10">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-[#C5A059]/20 py-6 text-[11px] font-black uppercase tracking-[0.4em] text-[#C5A059] hover:bg-red-900/10 hover:border-red-900/40 hover:text-red-600 transition-all rounded-sm"
                >
                  Dissolve Manifestation
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#C5A059] py-6 text-[11px] font-black uppercase tracking-[0.4em] text-black hover:bg-white transition-all disabled:opacity-50 rounded-sm shadow-2xl shadow-[#C5A059]/20 font-bold"
                >
                  {isSubmitting ? "Transforming..." : (editingRecipe ? "Re-Seal Ritual" : "Publish Sequence")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
