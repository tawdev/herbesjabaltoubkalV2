"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaLink } from "react-icons/fa6";
import { useCart } from "@/context/CartContext";

export default function ActionableIngredient({ 
  name, 
  index, 
  product 
}: { 
  name: string; 
  index: number; 
  product?: any 
}) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex gap-8 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-[#C5A059]/30 font-serif italic text-2xl group-hover:text-[#C5A059] transition-colors">
        {(index + 1).toString().padStart(2, '0')}
      </span>
      
      <div className="pt-2 flex-1 flex flex-col gap-1 relative">
        {product ? (
          <div className="flex items-center justify-between">
            <Link 
              href={`/products/${product.id}`}
              className="text-sm font-black text-foreground uppercase tracking-[0.2em] hover:text-[#C5A059] transition-colors flex items-center gap-3"
            >
              {name}
              <FaLink size={10} className="opacity-0 group-hover:opacity-40 transition-opacity" />
            </Link>
            
            <button
               onClick={() => addToCart(product, 1)}
               className="p-2 text-[#C5A059]/40 hover:text-[#C5A059] hover:scale-125 transition-all"
               title="Invoke directly to cart"
            >
               <FaPlus size={12} />
            </button>
          </div>
        ) : (
          <span className="text-sm font-black text-foreground/60 uppercase tracking-[0.2em]">
            {name}
          </span>
        )}
        
        <span className="h-[1px] w-0 group-hover:w-full bg-[#C5A059]/20 transition-all duration-700" />

        {/* Hover Preview Card */}
        <AnimatePresence>
          {isHovered && product && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.98 }}
              className="absolute left-0 bottom-full mb-4 w-64 bg-card border border-[#C5A059]/20 p-4 shadow-2xl z-[60] backdrop-blur-xl"
            >
              <div className="relative aspect-square w-full mb-4 overflow-hidden border border-[#C5A059]/10">
                <Image
                  src={product.image.startsWith('http') ? product.image : `/images/products/${product.image}`}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-widest">{product.price} MAD</span>
                  <span className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest">{product.weight}</span>
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-widest leading-tight">{product.name}</h4>
              </div>
              <div className="mt-4 pt-4 border-t border-[#C5A059]/10">
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#C5A059]/60 italic">Available in the Vault</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
