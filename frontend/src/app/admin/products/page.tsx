"use client";

import { useEffect, useState } from "react";
import { getProducts, API_URL } from "@/lib/api";
import { getProductImage } from "@/lib/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlus, FaPencil, FaTrashCan, FaBoxOpen, FaLayerGroup } from "react-icons/fa6";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchProductsData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    try {
      setLoading(true);
      const data = await getProducts({});
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchProductsData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    const token = localStorage.getItem("token");

    let imageName = formData.get("image") as string || "placeholder.jpeg";

    if (selectedFile) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        const uploadRes = await fetch(`${API_URL}/uploads/product`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: uploadFormData,
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageName = uploadData.filename;
        }
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }

    const data = {
      name: formData.get("name"),
      name_ar: formData.get("name_ar"),
      price: parseFloat(formData.get("price") as string),
      weight: formData.get("weight"),
      category: formData.get("category"),
      stock: parseInt(formData.get("stock") as string, 10),
      description: formData.get("description"),
      description_ar: formData.get("description_ar"),
      image: imageName,
      promo: formData.get("promo") === "on",
      best_seller: formData.get("best_seller") === "on",
      promo_price: formData.get("promo_price") ? parseFloat(formData.get("promo_price") as string) : null,
      origin_country: formData.get("origin_country"),
      ingredients: formData.get("ingredients"),
      benefits: formData.get("benefits"),
      usage_method: formData.get("usage_method"),
    };

    try {
      const url = editingProduct ? `${API_URL}/products/${editingProduct.id}` : `${API_URL}/products`;
      const method = editingProduct ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingProduct(null);
        setPreviewImage(null);
        setSelectedFile(null);
        fetchProductsData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Executive Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#C5A059]/10 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-6 w-[2px] bg-[#C5A059]" />
             <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]/80">Catalog Inventory</h4>
          </div>
          <h1 className="text-5xl font-serif font-bold text-foreground tracking-tight">Essence <span className="text-[#C5A059]">Rituals</span></h1>
          <p className="text-foreground/40 font-serif italic text-lg">Curate and manage the alchemical catalog of Jabal Toubkal.</p>
        </div>
        <button 
          onClick={() => { 
            setEditingProduct(null); 
            setPreviewImage(null);
            setSelectedFile(null);
            setIsModalOpen(true); 
          }}
          className="px-10 py-5 bg-[#C5A059] text-black font-black uppercase tracking-widest text-xs transition-all hover:bg-foreground hover:text-background flex items-center gap-4 rounded-sm shadow-xl shadow-[#C5A059]/10"
        >
          <FaPlus size={16} />
          Add New Essence
        </button>
      </header>

      {/* Modern Inventory Table */}
      <div className="bg-card border border-[#C5A059]/10 shadow-2xl rounded-sm overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20">
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]">Distillation (Product)</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]">Taxonomy</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]">Value</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]">Stock Level</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059] text-right">Manipulation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5A059]/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-10 h-10 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
                       <span className="text-[#C5A059] font-serif italic tracking-widest">Summoning data...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center text-foreground/20 font-serif italic text-xl">The grimoire is currently empty.</td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-[#C5A059]/5 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-8">
                      <div className="relative w-20 h-20 bg-black overflow-hidden border border-[#C5A059]/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
                        <Image
                          src={getProductImage(product.image, product.name)}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:opacity-100 opacity-80 transition-opacity"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-sm uppercase tracking-widest text-foreground group-hover:text-[#C5A059] transition-colors">{product.name}</span>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] px-2 py-0.5 border border-white/5 rounded-full">{product.weight}</span>
                           {product.best_seller && <span className="text-[8px] font-black text-black bg-[#C5A059] px-2 py-0.5 uppercase tracking-widest rounded-full">Elite</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[11px] font-black uppercase tracking-widest text-foreground/50 border border-white/10 px-4 py-1.5 rounded-sm bg-black/10">
                      {typeof product.category === 'object' ? product.category.name : product.category}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                       <span className="font-serif text-[#C5A059] text-xl font-bold">{product.price} MAD</span>
                       {product.promo_price && <span className="text-[10px] text-foreground/20 line-through decoration-[#C5A059]/40">{product.promo_price} MAD</span>}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={`h-full transition-all duration-1000 ${product.stock > 10 ? 'bg-[#C5A059]' : 'bg-red-800'}`} 
                            style={{ width: `${Math.min((product.stock/50)*100, 100)}%` }}
                          />
                       </div>
                       <span className={`text-[11px] font-black uppercase tracking-widest ${product.stock > 10 ? 'text-foreground/40' : 'text-red-800'}`}>{product.stock} Units</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-8">
                      <button 
                        onClick={() => { 
                          setEditingProduct(product); 
                          setPreviewImage(getProductImage(product.image, product.name));
                          setSelectedFile(null);
                          setIsModalOpen(true); 
                        }}
                        className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] hover:text-foreground transition-all flex items-center gap-2 group/btn"
                      >
                        <FaPencil size={12} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                        Refine
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-[11px] font-black uppercase tracking-widest text-red-900/60 hover:text-red-500 transition-all flex items-center gap-2 group/btn"
                      >
                        <FaTrashCan size={12} className="group-hover/btn:scale-110 transition-transform" />
                        Vanish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Refinement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 md:p-10 overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-5xl bg-card border border-[#C5A059]/20 p-10 md:p-20 shadow-2xl animate-in fade-in zoom-in duration-500 my-auto rounded-sm">
            <header className="flex items-center justify-between mb-16 border-b border-[#C5A059]/10 pb-10">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059]/50 mb-2">Alchemic Synthesis</h4>
                  <h2 className="text-4xl font-serif text-[#C5A059] uppercase tracking-widest font-bold">{editingProduct ? 'Refine Essence' : 'Manifest New Essence'}</h2>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-foreground/20 hover:text-[#C5A059] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
               </button>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Denomination (EN)</label>
                  <input name="name" defaultValue={editingProduct?.name} required className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-base text-foreground focus:outline-none focus:border-[#C5A059] transition-all rounded-sm" />
                </div>
                <div className="space-y-4 text-right">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">التسمية (AR)</label>
                  <input name="name_ar" defaultValue={editingProduct?.name_ar} required className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-2xl text-[#C5A059] text-right focus:outline-none focus:border-[#C5A059] transition-all font-arabic rounded-sm" dir="rtl" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Value (MAD)</label>
                  <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-base text-[#C5A059] focus:outline-none focus:border-[#C5A059] transition-all font-bold" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Promo Value</label>
                  <input name="promo_price" type="number" step="0.01" defaultValue={editingProduct?.promo_price} className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-base text-foreground focus:outline-none focus:border-[#C5A059] transition-all" placeholder="Optional" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Quantities</label>
                  <input name="stock" type="number" defaultValue={editingProduct?.stock ?? 0} required className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-base text-foreground focus:outline-none focus:border-[#C5A059] transition-all" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Mass (Weight)</label>
                  <input name="weight" defaultValue={editingProduct?.weight} required className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-base text-foreground focus:outline-none focus:border-[#C5A059] transition-all" placeholder="e.g. 100g" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                   <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Taxonomy</label>
                   <select name="category" defaultValue={editingProduct?.category || "spices"} className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-xs font-black uppercase tracking-widest text-[#C5A059] focus:outline-none focus:border-[#C5A059] transition-colors cursor-pointer appearance-none rounded-sm">
                     <option value="spices">Spices</option>
                     <option value="herbs">Herbs</option>
                     <option value="mixes">Mixes</option>
                     <option value="ground">Ground</option>
                     <option value="whole">Whole</option>
                   </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Visual manifest</label>
                  <div className="flex items-center gap-8">
                     <div className="relative w-24 h-24 bg-black border border-[#C5A059]/20 shadow-2xl shrink-0 overflow-hidden">
                        {(previewImage || editingProduct?.image) ? (
                          <Image src={previewImage || getProductImage(editingProduct.image, editingProduct.name)} alt="Preview" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-foreground/5 text-[10px] font-bold uppercase text-center p-4">No Image</div>
                        )}
                     </div>
                     <label className="flex-1 cursor-pointer border-2 border-dashed border-[#C5A059]/10 hover:border-[#C5A059]/40 transition-all p-8 text-center group rounded-sm bg-black/5">
                        <span className="text-[10px] text-[#C5A059]/40 font-black uppercase tracking-[0.3em] group-hover:text-[#C5A059] transition-colors">
                          {selectedFile ? selectedFile.name : "Capture New Aura"}
                        </span>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                     </label>
                     <input type="hidden" name="image" defaultValue={editingProduct?.image} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Geographic Origin</label>
                  <input name="origin_country" defaultValue={editingProduct?.origin_country || "Morocco - High Atlas"} className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-base text-foreground focus:outline-none focus:border-[#C5A059] transition-all rounded-sm" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Botanical Components</label>
                  <input name="ingredients" defaultValue={editingProduct?.ingredients} className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-base text-foreground focus:outline-none focus:border-[#C5A059] transition-all rounded-sm" placeholder="List the alchemy..." />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Alchemic Narrative (EN)</label>
                  <textarea name="description" rows={4} defaultValue={editingProduct?.description} className="w-full bg-background border border-[#C5A059]/10 p-6 text-sm text-foreground/70 font-serif italic focus:border-[#C5A059] transition-all resize-none rounded-sm" placeholder="The story of the essence..." />
                </div>
                <div className="space-y-4 text-right">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">سرد الروح (AR)</label>
                  <textarea name="description_ar" rows={4} defaultValue={editingProduct?.description_ar} className="w-full bg-background border border-[#C5A059]/10 p-6 text-xl text-[#C5A059]/70 font-arabic focus:border-[#C5A059] transition-all text-right resize-none rounded-sm" dir="rtl" />
                </div>
              </div>

              <div className="flex items-center gap-14 py-10 border-y border-[#C5A059]/10">
                <label className="flex items-center gap-5 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059] cursor-pointer group">
                  <input type="checkbox" name="promo" defaultChecked={editingProduct?.promo} className="w-6 h-6 accent-[#C5A059] bg-background border-[#C5A059]/30 rounded-sm" />
                  <span className="group-hover:text-foreground transition-colors">Apply Promotion</span>
                </label>
                <label className="flex items-center gap-5 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059] cursor-pointer group">
                  <input type="checkbox" name="best_seller" defaultChecked={editingProduct?.best_seller} className="w-6 h-6 accent-[#C5A059] bg-background border-[#C5A059]/30 rounded-sm" />
                  <span className="group-hover:text-foreground transition-colors">Elite Status</span>
                </label>
              </div>

              <div className="flex gap-8 pt-10">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-[#C5A059]/20 py-6 text-[11px] font-black uppercase tracking-[0.4em] text-[#C5A059] hover:bg-red-900/10 hover:border-red-900/40 hover:text-red-600 transition-all rounded-sm"
                >
                  Dissolve Changes
                </button>
                <button
                  type="submit" 
                  disabled={uploading}
                  className="flex-1 bg-[#C5A059] py-6 text-[11px] font-black uppercase tracking-[0.4em] text-black hover:bg-white transition-all disabled:opacity-50 rounded-sm shadow-2xl shadow-[#C5A059]/20">
                  {uploading ? 'Manifesting...' : (editingProduct ? 'Re-Seal Essence' : 'Seal the Essence')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
