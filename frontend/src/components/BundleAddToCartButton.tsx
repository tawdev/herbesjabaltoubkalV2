"use client";

import { useCart } from "@/context/CartContext";

interface BundleAddToCartButtonProps {
  bundle: any;
}

export default function BundleAddToCartButton({ bundle }: BundleAddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `bundle-${bundle.id}`,
      name: bundle.name,
      price: bundle.price,
      image: bundle.image,
      weight: "Ritual Pack",
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-[#C5A059] text-black text-[9px] font-bold uppercase tracking-widest px-8 py-4 shadow-xl transition-all duration-500 flex items-center justify-center gap-2 w-full hover:bg-white"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="14" 
        height="14" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      Ajouter au panier
    </button>
  );
}
