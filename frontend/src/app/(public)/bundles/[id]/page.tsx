"use client";

import Image from "next/image";
import { getBundle } from "@/lib/api";
import { notFound } from "next/navigation";
import { getBundleImage } from "@/lib/images";
import React, { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { FaBagShopping, FaPlus, FaMinus, FaStar, FaLeaf, FaArrowLeftLong, FaRegGem, FaGifts } from "react-icons/fa6";
import Link from "next/link";

export default function BundleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [bundle, setBundle] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [notFoundState, setNotFound] = useState(false);

  useEffect(() => {
    getBundle(id).then(setBundle).catch(() => setNotFound(true));
  }, [id]);

  if (notFoundState) return notFound();

  if (!bundle) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8">
      <div className="w-12 h-12 border-2 border-[#C5A059]/10 border-t-[#C5A059] rounded-full animate-spin" />
      <p className="text-[#C5A059] font-serif italic tracking-[0.4em] uppercase text-[9px]">Summoning Ritual...</p>
    </div>
  );

  const handleAddToCart = () => {
    // Add multiple quantities by calling addToCart with a custom payload
    for(let i=0; i<quantity; i++){
      addToCart({
        id: `bundle-${bundle.id}`,
        name: bundle.name,
        price: bundle.price,
        image: bundle.image,
        weight: "Ritual Pack",
      });
    }
  };

  return (
    <div className="bg-background min-h-screen pb-40 animate-in fade-in duration-1000">
      <div className="container mx-auto py-16 px-6 lg:px-24">
        {/* Superior Navigation */}
        <nav className="mb-12 flex items-center justify-between border-b border-[#C5A059]/10 pb-8">
           <Link href="/bundles" className="flex items-center gap-4 group">
              <FaArrowLeftLong className="text-[#C5A059] group-hover:-translate-x-2 transition-transform" size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 group-hover:text-foreground transition-colors">Return to Collections</span>
           </Link>
           <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A059]/30 border border-[#C5A059]/20 px-3 py-1">Ritual Ref: BDL-{bundle.id.toString().padStart(4, '0')}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Visual Presentation */}
          <div className="relative aspect-square md:aspect-[4/5] bg-[#050505] shadow-2xl p-4 border border-[#C5A059]/20 group">
             <div className="absolute inset-0 bg-[#C5A059]/5 blur-3xl z-0" />
             <div className="relative w-full h-full overflow-hidden border border-[#C5A059]/10 z-10">
                <Image
                   src={getBundleImage(bundle.image)}
                   alt={bundle.name}
                   fill
                   unoptimized
                   className="object-cover group-hover:scale-105 transition-transform duration-[5s] grayscale-[0.2] group-hover:grayscale-0"
                   priority
                />
             </div>
             
             {/* Signature Plaque */}
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background border border-[#C5A059]/30 px-10 py-4 shadow-2xl z-20 flex items-center gap-4">
                 <FaRegGem className="text-[#C5A059]" size={16} />
                 <span className="text-[10px] uppercase font-black tracking-[0.5em] text-[#C5A059]">Curated Experience</span>
             </div>
          </div>

          {/* Ritual Manifesto */}
          <div className="space-y-16">
             <div className="space-y-8">
                <div className="flex items-center gap-4">
                   <FaGifts className="text-[#C5A059]" size={14} />
                   <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#C5A059]">Atlas Collection</span>
                </div>
                <div className="space-y-4">
                   <h1 className="text-5xl md:text-7xl font-serif text-foreground uppercase tracking-tighter leading-[0.9]">
                      {bundle.name}
                   </h1>
                </div>
                
                <div className="flex items-end gap-4 border-b border-[#C5A059]/10 pb-8">
                   <span className="text-5xl font-serif font-black text-[#C5A059] tabular-nums leading-none">
                      {parseFloat(bundle.price).toLocaleString()}
                   </span>
                   <span className="text-sm font-black text-[#C5A059]/50 uppercase tracking-widest pb-1">MAD</span>
                </div>
             </div>

             <div className="space-y-10">
                <p className="text-xl text-foreground/70 font-serif italic line-clamp-4 leading-relaxed border-l-[3px] border-[#C5A059]/40 pl-8">
                   {bundle.description || "An exclusive selection of premium botanicals."}
                </p>
                
             </div>

             <div className="pt-10 border-t border-[#C5A059]/10 space-y-8">
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-6">
                   <div className="flex items-center bg-black border border-[#C5A059]/30 p-2 rounded-sm w-full sm:w-auto">
                     <button 
                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
                       className="w-16 h-16 flex items-center justify-center text-[#C5A059] bg-white/5 hover:bg-[#C5A059] hover:text-black transition-all"
                     >
                       <FaMinus size={14} />
                     </button>
                     <span className="w-16 text-center font-black text-2xl text-white tabular-nums select-none tracking-tighter">{quantity}</span>
                     <button 
                       onClick={() => setQuantity(quantity + 1)}
                       className="w-16 h-16 flex items-center justify-center text-[#C5A059] bg-white/5 hover:bg-[#C5A059] hover:text-black transition-all"
                     >
                       <FaPlus size={14} />
                     </button>
                   </div>
                   
                   <button 
                     onClick={handleAddToCart}
                     className="flex-1 bg-[#C5A059] text-black text-[12px] font-black uppercase tracking-[0.5em] px-8 py-4 shadow-xl transition-all duration-500 flex items-center justify-center gap-6 hover:bg-white"
                   >
                     <FaBagShopping size={24} className="hover:scale-125 transition-transform duration-500" />
                     Commit to Ritual
                   </button>
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}
