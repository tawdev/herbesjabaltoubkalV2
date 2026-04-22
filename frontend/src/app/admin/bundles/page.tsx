"use client";

import { useEffect, useState } from "react";
import { getBundles, getProducts, API_URL } from "@/lib/api";
import { getBundleImage } from "@/lib/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlus, FaPencil, FaTrashCan, FaBoxArchive, FaTags, FaLayerGroup } from "react-icons/fa6";

export default function AdminBundlesPage() {
  const router = useRouter();
  const [bundles, setBundles] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [bundleItems, setBundleItems] = useState<{product_id: number, quantity: number}[]>([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [bundlesData, productsData] = await Promise.all([
        getBundles(),
        getProducts({})
      ]);
      setBundles(Array.isArray(bundlesData) ? bundlesData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to summon the ritual packs from the ether.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this ritual bundle?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/bundles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchData();
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

  const addItem = () => {
    setBundleItems([...bundleItems, { product_id: products[0]?.id, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setBundleItems(bundleItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...bundleItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setBundleItems(newItems);
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
        const uploadRes = await fetch(`${API_URL}/uploads/bundle`, {
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
      description: formData.get("description"),
      description_ar: formData.get("description_ar"),
      image: imageName,
      items: bundleItems,
    };

    try {
      const url = editingBundle ? `${API_URL}/bundles/${editingBundle.id}` : `${API_URL}/bundles`;
      const method = editingBundle ? "PATCH" : "POST";

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
        setEditingBundle(null);
        setPreviewImage(null);
        setSelectedFile(null);
        setBundleItems([]);
        fetchData();
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
             <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]/80">Ritual Collections</h4>
          </div>
          <h1 className="text-5xl font-serif font-bold text-foreground tracking-tight">Les <span className="text-[#C5A059]">Coffrets</span> de l'Atlas</h1>
          <p className="text-foreground/40 font-serif italic text-lg">Forge and manage initiation packs for the prestigious Jabal Toubkal rituals.</p>
        </div>
        <button 
          onClick={() => { 
            setEditingBundle(null); 
            setPreviewImage(null);
            setSelectedFile(null);
            setBundleItems([]);
            setIsModalOpen(true); 
          }}
          className="px-10 py-5 bg-[#C5A059] text-black font-black uppercase tracking-widest text-xs transition-all hover:bg-foreground hover:text-background flex items-center gap-4 rounded-sm shadow-xl shadow-[#C5A059]/10"
        >
          <FaPlus size={16} />
          Forge New Pack
        </button>
      </header>

      {/* Modern Bundle Inventory */}
      <div className="bg-card border border-[#C5A059]/10 shadow-2xl rounded-sm overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20">
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]">The Collection</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]">Essence Composition</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059]">Total Offering</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-[#C5A059] text-right">Manipulation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5A059]/5">
              {loading ? (
                <tr>
                   <td colSpan={4} className="px-10 py-32 text-center text-foreground/20 font-serif italic animate-pulse">Summoning ritual packs...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center text-red-500/50 font-serif italic">
                    <p className="text-xl">{error}</p>
                    <button onClick={() => fetchData()} className="mt-8 text-xs font-black uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/20 px-8 py-3 hover:bg-[#C5A059]/10">Retry Evocation</button>
                  </td>
                </tr>
              ) : bundles.map((bundle) => (
                <tr key={bundle.id} className="hover:bg-[#C5A059]/5 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-8">
                      <div className="relative w-24 h-24 bg-black overflow-hidden border border-[#C5A059]/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
                        <Image
                          src={getBundleImage(bundle.image)}
                          alt={bundle.name}
                          fill
                          unoptimized
                          className="w-full h-full object-cover group-hover:opacity-100 opacity-80 transition-opacity"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="font-bold text-sm uppercase tracking-widest text-foreground group-hover:text-[#C5A059] transition-colors">{bundle.name}</span>
                        <p className="text-[11px] font-serif italic text-foreground/30 line-clamp-1 max-w-[250px] leading-relaxed">{bundle.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-4">
                      <div className="flex -space-x-3 overflow-hidden">
                        {bundle.items?.map((item: any, i: number) => (
                          <div key={item.id} className="relative w-10 h-10 rounded-full border-2 border-[#111] overflow-hidden bg-background shadow-xl hover:z-50 hover:scale-110 transition-all cursor-help" title={item.product?.name}>
                            <img
                              src={item.product?.image ? `${API_URL}/images/products/${item.product.image}` : 'https://images.unsplash.com/photo-1596040033229-a9821ebd0544'}
                              alt={item.product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 max-w-[350px]">
                        {bundle.items?.map((item: any) => (
                          <span key={item.id} className="text-[9px] font-black uppercase tracking-widest bg-black/40 border border-[#C5A059]/20 text-[#C5A059] px-2.5 py-1 rounded-sm">
                            {item.quantity}x {item.product?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="font-serif text-[#C5A059] text-2xl font-bold tabular-nums">{parseFloat(bundle.price).toLocaleString()} <span className="text-xs">MAD</span></span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-8">
                      <button 
                        onClick={() => { 
                          setEditingBundle(bundle); 
                          setPreviewImage(getBundleImage(bundle.image));
                          setSelectedFile(null);
                          setBundleItems(bundle.items?.map((i: any) => ({ product_id: i.product_id, quantity: i.quantity })) || []);
                          setIsModalOpen(true); 
                        }}
                        className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] hover:text-foreground transition-all flex items-center gap-2 group/btn"
                      >
                        <FaPencil size={12} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                        Refine
                      </button>
                      <button 
                        onClick={() => handleDelete(bundle.id)}
                        className="text-[11px] font-black uppercase tracking-widest text-red-900/60 hover:text-red-500 transition-all flex items-center gap-2 group/btn"
                      >
                        <FaTrashCan size={12} className="group-hover/btn:scale-110 transition-transform" />
                        Vanish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {bundles.length === 0 && !loading && !error && (
                <tr>
                   <td colSpan={4} className="px-10 py-32 text-center text-foreground/20 font-serif italic text-2xl tracking-widest">No ritual paths formed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Bundle Formulation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 md:p-10 overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-5xl bg-card border border-[#C5A059]/20 p-10 md:p-20 shadow-2xl animate-in fade-in zoom-in duration-500 my-auto rounded-sm">
            <header className="flex items-center justify-between mb-16 border-b border-[#C5A059]/10 pb-10">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059]/50 mb-2">Curated Assemblage</h4>
                  <h2 className="text-4xl font-serif text-[#C5A059] uppercase tracking-widest font-bold">{editingBundle ? 'Refine Pack' : 'Forge New Pack'}</h2>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-foreground/20 hover:text-[#C5A059] transition-all hover:rotate-90">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
               </button>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Pack Denomination (EN)</label>
                  <input name="name" defaultValue={editingBundle?.name} required className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-base text-foreground focus:outline-none focus:border-[#C5A059] transition-all rounded-sm" />
                </div>
                <div className="space-y-4 text-right">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">اسم الباقة (AR)</label>
                  <input name="name_ar" defaultValue={editingBundle?.name_ar} required className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-2xl text-[#C5A059] text-right focus:outline-none focus:border-[#C5A059] transition-all font-arabic rounded-sm" dir="rtl" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Offering Price (MAD)</label>
                  <input name="price" type="number" step="0.01" defaultValue={editingBundle?.price} required className="w-full bg-background border-b border-[#C5A059]/20 p-5 text-base text-[#C5A059] focus:outline-none focus:border-[#C5A059] transition-all font-bold rounded-sm" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Visual Presentation</label>
                  <div className="flex items-center gap-8">
                    <div className="relative w-24 h-24 bg-black border border-[#C5A059]/20 shadow-2xl shrink-0 overflow-hidden">
                      {previewImage ? (
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground/5 text-[10px] font-bold uppercase text-center p-4">No Image</div>
                      )}
                    </div>
                    <label className="flex-1 cursor-pointer border-2 border-dashed border-[#C5A059]/10 hover:border-[#C5A059]/40 transition-all p-8 text-center group rounded-sm bg-black/5">
                      <span className="text-[10px] text-[#C5A059]/40 font-black uppercase tracking-[0.3em] group-hover:text-[#C5A059] transition-colors">
                        {selectedFile ? selectedFile.name : "Transmit New Aura"}
                      </span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    <input type="hidden" name="image" defaultValue={editingBundle?.image} />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                 <div className="flex items-center justify-between border-b border-[#C5A059]/10 pb-6">
                   <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#C5A059] flex items-center gap-4 italic">
                     <FaLayerGroup size={14} className="text-[#C5A059]/40" />
                     Pack Composition
                   </h3>
                   <button type="button" onClick={addItem} className="text-xs font-black uppercase tracking-widest text-black bg-[#C5A059] px-6 py-3 hover:bg-white transition-all rounded-sm flex items-center gap-3">
                     <FaPlus size={12} />
                     Adjoin Essence
                   </button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {bundleItems.map((item, index) => (
                     <div key={index} className="flex flex-col gap-6 bg-black/20 p-8 border border-[#C5A059]/5 relative rounded-sm group hover:border-[#C5A059]/30 transition-all duration-500">
                        <button type="button" onClick={() => removeItem(index)} className="absolute top-4 right-4 p-2 text-foreground/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 h-10 w-10 flex items-center justify-center border border-transparent hover:border-red-900/40 rounded-full">
                           <FaTrashCan size={14} />
                        </button>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/40 italic">Select Essence</label>
                           <select 
                             value={item.product_id}
                             onChange={(e) => updateItem(index, 'product_id', Number(e.target.value))}
                             className="w-full bg-background border-b border-[#C5A059]/20 p-4 text-sm text-foreground focus:outline-none focus:border-[#C5A059] transition-all rounded-sm appearance-none cursor-pointer"
                           >
                             {products.map(p => (
                               <option key={p.id} value={p.id} className="bg-card text-foreground">{p.name}</option>
                             ))}
                           </select>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/40 italic">Units Count</label>
                           <input 
                             type="number"
                             min="1"
                             value={item.quantity}
                             onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                             className="w-full bg-background border-b border-[#C5A059]/20 p-4 text-base text-foreground focus:outline-none focus:border-[#C5A059] transition-all rounded-sm font-bold"
                           />
                        </div>
                     </div>
                   ))}
                   {bundleItems.length === 0 && (
                     <div className="col-span-full py-16 text-center border border-dashed border-[#C5A059]/10 rounded-sm bg-black/5">
                        <p className="text-[#C5A059]/30 text-xs uppercase font-black tracking-widest">No components selected for this ritual collection.</p>
                     </div>
                   )}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Pack Soul Narrative (EN)</label>
                  <textarea name="description" rows={4} defaultValue={editingBundle?.description} className="w-full bg-background border border-[#C5A059]/10 p-6 text-sm text-foreground/70 font-serif italic focus:border-[#C5A059] transition-all resize-none rounded-sm" />
                </div>
                <div className="space-y-4 text-right">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">رواية الروح (AR)</label>
                  <textarea name="description_ar" rows={4} defaultValue={editingBundle?.description_ar} className="w-full bg-background border border-[#C5A059]/10 p-6 text-xl text-[#C5A059]/70 font-arabic focus:border-[#C5A059] transition-all text-right resize-none rounded-sm" dir="rtl" />
                </div>
              </div>

              <div className="flex gap-8 pt-10">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-[#C5A059]/20 py-6 text-[11px] font-black uppercase tracking-[0.4em] text-[#C5A059] hover:bg-red-900/10 hover:border-red-900/40 hover:text-red-600 transition-all rounded-sm"
                >
                  Dissolve Assembly
                </button>
                <button
                  type="submit" 
                  disabled={uploading}
                  className="flex-1 bg-[#C5A059] py-6 text-[11px] font-black uppercase tracking-[0.4em] text-black hover:bg-white transition-all disabled:opacity-50 rounded-sm shadow-2xl shadow-[#C5A059]/20 font-bold"
                >
                  {uploading ? 'Manifesting...' : 'Seal the Ritual Pack'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
