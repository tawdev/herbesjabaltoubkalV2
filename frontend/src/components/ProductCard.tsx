"use client";

import Image from "next/image";
import Link from "next/link";
import { getProductImage } from "@/lib/images";
import { useCart } from "@/context/CartContext";
import { FaBagShopping, FaXmark } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSound } from "@/context/SoundContext";

interface ProductCardProps {
  product: any;
}

const AVAILABLE_WEIGHTS = [50, 100, 250, 500, 1000];

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { playPaperSound, playMetallicSound } = useSound();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);

  // Parse base weight from DB
  const baseWeightStr = product.weight ? String(product.weight) : "";
  const baseWeightMatch = baseWeightStr.match(/(\d+)/);
  const baseWeightNum = baseWeightMatch ? parseInt(baseWeightMatch[1], 10) : 100;
  
  const basePriceNum = product.promo_price ? parseFloat(product.promo_price) : parseFloat(product.price || 0);
  const pricePerUnit = baseWeightNum > 0 ? basePriceNum / baseWeightNum : basePriceNum;

  useEffect(() => {
    if (isModalOpen && !selectedWeight) setSelectedWeight(baseWeightNum);
  }, [isModalOpen, baseWeightNum, selectedWeight]);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playPaperSound();
    setIsModalOpen(true);
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playPaperSound();
    setIsModalOpen(false);
  };

  const confirmAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playMetallicSound();
    
    addToCart({
      id: `${product.id}-${selectedWeight}g`, // Unique ID for Cartesian storage by weight
      name: `${product.name}`,
      price: selectedWeight ? (selectedWeight * pricePerUnit) : basePriceNum,
      promo_price: null, // Wipe promo to force the calculated price
      image: product.image,
      weight: `${selectedWeight}g`
    });
    
    setIsModalOpen(false);
  };

  const calculatedPrice = selectedWeight ? (selectedWeight * pricePerUnit).toFixed(2) : basePriceNum.toFixed(2);

  return (
    <>
      <Link 
        href={`/products/${product.id}`} 
        className="group flex flex-col gap-8 transform hover:-translate-y-2 transition-all duration-700"
      >
        {/* Immersive Visual Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#050505] border border-[#C5A059]/10 transition-all duration-700 group-hover:border-[#C5A059]/50 shadow-2xl group-hover:shadow-[#C5A059]/5">
          {product.promo && (
            <div className="absolute top-6 left-6 z-10 text-[9px] font-black uppercase tracking-[0.4em] text-black bg-[#C5A059] px-3 py-1 shadow-xl">
              Limited Offering
            </div>
          )}
          <Image
            src={getProductImage(product.image, product.name)}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Subtle Quick View Text */}
          <div className="absolute bottom-8 left-0 right-0 text-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
             <span className="text-[9px] font-black uppercase tracking-[0.6em] text-[#C5A059]">View Ritual Details</span>
          </div>
        </div>

        {/* Information Manifest */}
        <div className="flex flex-col items-center text-center px-4 space-y-4 flex-1">
          <div className="space-y-1 w-full">
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C5A059]/40 block line-clamp-1 min-h-[1em]">
               {typeof product.category === 'object' ? product.category.name : product.category}
             </span>
             <h3 className="font-serif text-2xl font-black tracking-tight text-foreground group-hover:text-[#C5A059] transition-colors uppercase leading-tight line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
               {product.name}
             </h3>
          </div>
          
          <div className="flex flex-col items-center gap-6 w-full mt-auto">
             <div className="flex flex-col items-center min-h-[2.5rem] justify-center">
                {product.promo_price ? (
                  <div className="flex items-baseline gap-4">
                    <span className="text-xl font-serif font-black text-[#C5A059] tabular-nums">{parseFloat(product.promo_price).toLocaleString()} MAD</span>
                    <span className="text-sm text-foreground/20 line-through font-serif tabular-nums">{parseFloat(product.price).toLocaleString()} MAD</span>
                  </div>
                ) : (
                  <span className="text-xl font-serif font-black text-[#C5A059] tabular-nums">{parseFloat(product.price).toLocaleString()} MAD</span>
                )}
             </div>

             <button 
               onClick={handleOpenModal}
               className="w-full min-w-[180px] py-4 border border-[#C5A059]/20 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 hover:text-black hover:bg-[#C5A059] hover:border-[#C5A059] transition-all flex items-center justify-center gap-4 bg-transparent shadow-xl rounded-sm group/btn relative z-10"
             >
               <FaBagShopping size={14} className="group-hover/btn:scale-110 transition-transform" />
               Ajouter au panier
             </button>
          </div>
        </div>
      </Link>

      {/* Pop-up Modal using React Portal to escape nested transforms */}
      {isModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={handleCloseModal} />
          
          <div className="relative w-full max-w-lg bg-card border border-[#C5A059]/20 shadow-2xl p-8 md:p-12 z-10 animate-in zoom-in-95 duration-500">
             <button 
                onClick={handleCloseModal}
                className="absolute top-6 right-6 text-foreground/30 hover:text-[#C5A059] transition-colors p-2"
             >
                <FaXmark size={24} />
             </button>

             <div className="text-center space-y-12">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059]">Customize Ritual</h4>
                   <h3 className="text-3xl font-serif uppercase tracking-tight">{product.name}</h3>
                </div>

                <div className="space-y-6">
                   <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30">Select Desired Weight</p>
                   <div className="grid grid-cols-3 gap-4">
                      {AVAILABLE_WEIGHTS.map(weight => (
                         <button
                           key={weight}
                           onClick={(e) => { e.stopPropagation(); playPaperSound(); setSelectedWeight(weight); }}
                           className={`py-4 border rounded-sm text-sm font-serif italic transition-all ${
                              selectedWeight === weight 
                              ? "border-[#C5A059] bg-[#C5A059] text-black shadow-[0_0_20px_rgba(197,160,89,0.2)]" 
                              : "border-foreground/10 text-foreground/50 hover:border-[#C5A059]/50"
                           }`}
                         >
                           {weight}g
                         </button>
                      ))}
                   </div>

                   {/* Custom Weight Injection */}
                   <div className="flex items-center gap-6 pt-8 border-t border-[#C5A059]/10">
                      <div className="flex flex-col items-start gap-1">
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C5A059]">Poids Personnalisé</span>
                         <span className="text-[8px] font-bold uppercase tracking-widest text-foreground/20">Dosage Spécifique</span>
                      </div>
                      <div className="relative flex-1">
                         <input 
                           type="number"
                           min="1"
                           step="1"
                           className="w-full bg-black/40 border border-[#C5A059]/20 p-4 rounded-sm text-foreground font-serif text-xl outline-none focus:border-[#C5A059] transition-all pr-16 tabular-nums"
                           value={selectedWeight || ""}
                           onChange={(e) => setSelectedWeight(parseInt(e.target.value) || 0)}
                           placeholder="Ex: 350"
                         />
                         <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#C5A059] tracking-widest opacity-40">GRAMMES</span>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-[#C5A059]/10 flex flex-col gap-8">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] uppercase font-black tracking-widest text-[#C5A059]/50">Alchemic Total</span>
                      <span className="text-4xl font-serif text-[#C5A059] tabular-nums leading-none">
                         {calculatedPrice} <span className="text-sm">MAD</span>
                      </span>
                   </div>

                   <button 
                     onClick={confirmAddToCart}
                     className="w-full bg-[#C5A059] text-black text-[12px] font-black uppercase tracking-[0.5em] py-5 transition-all hover:bg-white shadow-xl flex items-center justify-center gap-4"
                   >
                     <FaBagShopping size={18} />
                     Confirmer & Ajouter
                   </button>
                </div>
             </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
