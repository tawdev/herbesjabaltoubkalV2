"use client";

import { useEffect, useState } from "react";
import { getProducts, API_URL } from "@/lib/api";
import { FaBoxes, FaExclamationTriangle, FaCheckCircle, FaSave, FaArrowUp, FaArrowDown, FaHistory } from "react-icons/fa";
import Image from "next/image";
import { getProductImage } from "@/lib/images";

export default function StockManagementPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [batchValues, setBatchValues] = useState<Record<number, string>>({});

  const fetchProducts = async () => {
    try {
      const data = await getProducts({});
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Stock fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProductStock = async (id: number, stock: number, minStock: number) => {
    setSavingId(id);
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ stock: Number(stock), min_stock: Number(minStock) }),
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Update Stock Error:", err);
    } finally {
      setSavingId(null);
    }
  };

  const handleBatchUpdate = (id: number, currentStock: number, minStock: number) => {
    const val = parseInt(batchValues[id] || "0");
    if (val !== 0) {
      updateProductStock(id, currentStock + val, minStock);
      setBatchValues({ ...batchValues, [id]: "" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
        <p className="text-[#C5A059] font-serif italic tracking-widest animate-pulse">Quantifying the Alchemical Reserves...</p>
      </div>
    );
  }

  const stableCount = products.filter(p => (p.stock || 0) > (p.min_stock || 5)).length;
  const healthScore = Math.round((stableCount / Math.max(products.length, 1)) * 100);

  return (
    <div className="space-y-12 pb-24 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-8 w-[2px] bg-[#C5A059]" />
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]/60">Supply Chain Intel</h4>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground tracking-tight leading-none">
            Stock <span className="text-[#C5A059]">Reserves</span>
          </h1>
          <p className="text-foreground/40 font-serif italic text-lg ml-1">Maintain the equilibrium of your botanical vaults.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-4 bg-card border border-[#C5A059]/20 flex items-center gap-4 group">
              <div className="flex flex-col items-start">
                 <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A059]/60">Vault Integrity</span>
                 <span className="text-xl font-serif font-bold text-foreground">
                    {stableCount} / {products.length} Stable
                 </span>
              </div>
              <FaCheckCircle className="text-[#C5A059] opacity-20 group-hover:opacity-100 transition-opacity" />
           </div>
        </div>
      </header>

      <div className="bg-card border border-[#C5A059]/10 shadow-2xl rounded-sm overflow-hidden">
         <div className="grid grid-cols-12 px-10 py-6 border-b border-[#C5A059]/10 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]">
            <div className="col-span-1">Ref</div>
            <div className="col-span-3">Essence / Product</div>
            <div className="col-span-2 text-center">Batch Add</div>
            <div className="col-span-2 text-center">Current Stock</div>
            <div className="col-span-2 text-center">Min threshold</div>
            <div className="col-span-2 text-center">Status</div>
         </div>

         <div className="divide-y divide-[#C5A059]/5">
            {products.map((product) => {
              const isLow = (product.stock || 0) <= (product.min_stock || 5);
              const isEmpty = (product.stock || 0) === 0;
              
              return (
                <div key={product.id} className="grid grid-cols-12 px-10 py-8 items-center hover:bg-[#C5A059]/5 transition-all group">
                   <div className="col-span-1 font-serif text-foreground/40 text-xs tabular-nums tracking-widest">
                      #{product.id.toString().padStart(3, '0')}
                   </div>
                   
                   <div className="col-span-3 flex items-center gap-6">
                      <div className="relative w-16 h-16 bg-black border border-[#C5A059]/10 overflow-hidden shadow-lg rounded-sm group-hover:scale-110 transition-transform duration-500">
                         <Image 
                           src={getProductImage(product.image, product.name)} 
                           alt={product.name} 
                           fill 
                           unoptimized
                           className="object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all"
                         />
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-sm font-bold uppercase tracking-wider text-foreground group-hover:text-[#C5A059] transition-colors">{product.name}</span>
                         <span className="text-[10px] font-black uppercase tracking-widest text-foreground/50">{product.category?.name || "Pure Herb"}</span>
                      </div>
                   </div>

                   <div className="col-span-2 flex justify-center">
                      <div className="flex items-center gap-2 bg-[#C5A059]/10 border border-[#C5A059]/30 p-1.5 rounded-sm w-32">
                         <input 
                           type="text"
                           placeholder="+N"
                           className="bg-transparent border-none w-full text-center text-xs font-black uppercase tracking-widest text-foreground outline-none placeholder:text-foreground/20"
                           value={batchValues[product.id] || ""}
                           onChange={(e) => setBatchValues({ ...batchValues, [product.id]: e.target.value })}
                           onKeyDown={(e) => e.key === 'Enter' && handleBatchUpdate(product.id, product.stock, product.min_stock)}
                         />
                         <button 
                           onClick={() => handleBatchUpdate(product.id, product.stock, product.min_stock)}
                           className="w-8 h-8 flex items-center justify-center bg-[#C5A059] text-black rounded-sm hover:bg-foreground hover:text-background transition-all"
                         >
                            <FaArrowUp size={8} />
                         </button>
                      </div>
                   </div>

                   <div className="col-span-2 flex justify-center">
                      <div className="flex items-center gap-4 bg-muted border border-[#C5A059]/20 p-2 rounded-sm w-32 justify-between shadow-inner">
                         <button 
                           onClick={() => updateProductStock(product.id, Math.max(0, (product.stock || 0) - 1), product.min_stock)}
                           className="w-8 h-8 flex items-center justify-center hover:bg-[#C5A059]/10 text-foreground/40 hover:text-[#C5A059] transition-all"
                         >
                            <FaArrowDown size={10} />
                         </button>
                         <input 
                           type="number"
                           className="bg-transparent border-none w-12 text-center text-lg font-serif font-bold text-foreground outline-none tabular-nums"
                           value={product.stock || 0}
                           onChange={(e) => updateProductStock(product.id, parseInt(e.target.value) || 0, product.min_stock)}
                         />
                         <button 
                           onClick={() => updateProductStock(product.id, (product.stock || 0) + 1, product.min_stock)}
                           className="w-8 h-8 flex items-center justify-center hover:bg-[#C5A059]/10 text-foreground/40 hover:text-[#C5A059] transition-all"
                         >
                            <FaArrowUp size={10} />
                         </button>
                      </div>
                   </div>

                   <div className="col-span-2 flex justify-center">
                      <div className="flex items-center gap-3 bg-muted border border-foreground/10 p-2 rounded-sm w-24 justify-between group/min shadow-inner">
                         <input 
                           type="number"
                           className="bg-transparent border-none w-full text-center text-xs font-black uppercase tracking-widest text-[#C5A059] outline-none tabular-nums focus:text-foreground"
                           value={product.min_stock || 5}
                           onChange={(e) => updateProductStock(product.id, product.stock, parseInt(e.target.value) || 0)}
                         />
                      </div>
                   </div>

                   <div className="col-span-2 flex justify-center">
                      {isEmpty ? (
                        <div className="flex items-center gap-2 px-6 py-2 border border-red-900/60 bg-red-950/10 text-red-700 rounded-full animate-pulse shadow-sm">
                           <FaExclamationTriangle size={10} />
                           <span className="text-[9px] font-black uppercase tracking-widest">Depleted</span>
                        </div>
                      ) : isLow ? (
                        <div className="flex items-center gap-2 px-6 py-2 border border-amber-900/60 bg-amber-950/10 text-amber-700 rounded-full shadow-sm">
                           <FaExclamationTriangle size={10} />
                           <span className="text-[9px] font-black uppercase tracking-widest">Critical</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-6 py-2 border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#C5A059] rounded-full shadow-sm">
                           <FaCheckCircle size={10} />
                           <span className="text-[9px] font-black uppercase tracking-widest font-bold">Sufficient</span>
                        </div>
                      )}
                   </div>
                </div>
              );
            })}
         </div>
      </div>

      <footer className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-12 bg-[#121212] border border-[#C5A059]/20 rounded-sm space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#C5A059]/5 blur-3xl rounded-full" />
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <h4 className="text-2xl font-serif font-bold text-white uppercase tracking-widest">Inventory Health</h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]/60">Alchemical Sustainability Index</p>
               </div>
               <FaHistory className="text-[#C5A059]/20 text-3xl group-hover:rotate-180 transition-transform duration-1000" />
            </div>
            
            <div className="flex items-end gap-12 pt-4">
               <div className="flex flex-col gap-2">
                  <span className="text-4xl font-serif font-bold text-white tabular-nums">
                     {healthScore}%
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A059]/80">Vault Integrity Score</span>
               </div>
               <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-[#C5A059] to-[#E5C079] transition-all duration-1000"
                    style={{ width: `${healthScore}%` }}
                  />
               </div>
            </div>
         </div>

         <div className="p-12 bg-card border border-dashed border-[#C5A059]/20 rounded-sm flex flex-col justify-center items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full border border-[#C5A059]/20 flex items-center justify-center">
               <FaBoxes className="text-[#C5A059]/40 text-3xl" />
            </div>
            <div className="space-y-2">
               <h4 className="text-xl font-serif font-bold text-foreground uppercase tracking-widest">Need Restock?</h4>
               <p className="text-xs text-foreground/40 font-serif italic max-w-xs">Contact the high-altitude cooperatives to replenish your depleted essences.</p>
            </div>
            <button className="px-10 py-4 bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:bg-[#C5A059] hover:text-black transition-all rounded-sm shadow-xl">
               Contact Cooperatives
            </button>
         </div>
      </footer>
    </div>
  );
}
