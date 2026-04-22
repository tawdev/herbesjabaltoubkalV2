"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { FaMortarPestle, FaCheck } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

export default function EnbodyEssenceButton({ products }: { products: any[] }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddAll = () => {
    if (products.length === 0) return;
    
    products.forEach(product => {
      addToCart(product, 1);
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  if (products.length === 0) return null;

  return (
    <button
      onClick={handleAddAll}
      disabled={isAdded}
      className={`relative w-full py-10 overflow-hidden transition-all duration-700 group ${
        isAdded 
        ? "bg-green-500/10 border-green-500/20 text-green-500" 
        : "bg-[#C5A059] text-black hover:bg-white"
      } border shadow-2xl rounded-sm`}
    >
      <AnimatePresence mode="wait">
        {!isAdded ? (
          <motion.div
            key="add"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-6">
              <FaMortarPestle className="group-hover:rotate-12 transition-transform" size={18} />
              <span className="text-[11px] font-black uppercase tracking-[0.5em]">Embody the Essence</span>
            </div>
            <span className="text-[8px] font-bold uppercase tracking-[0.3em] opacity-40">Add {products.length} Alchemic Artifacts to Cart</span>
          </motion.div>
        ) : (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-4"
          >
            <FaCheck size={18} />
            <span className="text-[11px] font-black uppercase tracking-[0.5em]">Ritual Synchronized</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Decorative pulse effect */}
      {!isAdded && (
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      )}
    </button>
  );
}
