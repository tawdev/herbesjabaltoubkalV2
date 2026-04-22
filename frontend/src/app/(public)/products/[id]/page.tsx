"use client";

import Image from "next/image";
import { getProduct } from "@/lib/api";
import { notFound } from "next/navigation";
import { getProductImage } from "@/lib/images";
import React, { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { FaBagShopping, FaPlus, FaMinus, FaStar, FaLeaf, FaEarthAfrica, FaFlaskVial, FaArrowLeftLong, FaMagnifyingGlassPlus, FaScroll } from "react-icons/fa6";
import Link from "next/link";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('narrative');
  const [notFoundState, setNotFound] = useState(false);
  
  // Interactive Zoom State
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProduct(id).then(setProduct).catch(() => setNotFound(true));
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  if (notFoundState) return notFound();

  if (!product) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8">
      <div className="w-10 h-10 border-2 border-[#C5A059]/10 border-t-[#C5A059] rounded-full animate-spin" />
      <p className="text-[#C5A059] font-serif italic tracking-[0.4em] uppercase text-[8px]">Unveiling Essence...</p>
    </div>
  );

  return (
    <div className="bg-background min-h-screen pb-40 animate-in fade-in duration-1000">
      <div className="container mx-auto py-16 px-6 lg:px-24">
        {/* Navigation */}
        <nav className="mb-12 flex items-center justify-between border-b border-[#C5A059]/10 pb-8">
           <Link href="/products" className="flex items-center gap-4 group">
              <FaArrowLeftLong className="text-[#C5A059] group-hover:-translate-x-2 transition-transform" size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 group-hover:text-foreground transition-colors">Return to Library</span>
           </Link>
           <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A059]/30">Archive Ref: {product.id}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Left Column: Interactive Zoom Canvas */}
          <div className="lg:col-span-5 space-y-12">
            <div 
              ref={imageRef}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              className="relative aspect-[4/5] bg-black border border-[#C5A059]/10 cursor-crosshair overflow-hidden group/zoom shadow-2xl"
            >
              <Image
                src={getProductImage(product.image, product.name)}
                alt={product.name}
                fill
                unoptimized
                className={`object-cover transition-opacity duration-500 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
                priority
              />
              
              {/* Zoomed Reality */}
              {isZoomed && (
                 <div 
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                       backgroundImage: `url(${getProductImage(product.image, product.name)})`,
                       backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                       backgroundSize: '250%',
                       backgroundRepeat: 'no-repeat'
                    }}
                 />
              )}

              {/* Decorative Labels */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-pulse" />
                 <span className="text-[9px] font-black tracking-[0.4em] text-white uppercase drop-shadow-md">Precision View</span>
              </div>
              
              {!isZoomed && (
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-700 bg-black/20 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-4 scale-90 group-hover/zoom:scale-100 transition-transform duration-700">
                       <FaMagnifyingGlassPlus className="text-[#C5A059]" size={24} />
                       <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white">Explore Micro-Details</span>
                    </div>
                 </div>
              )}
            </div>

            {/* Minor Visual Hooks */}
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-[#C5A059]/5 opacity-30 hover:opacity-100 transition-opacity duration-1000">
               <div className="flex items-center gap-6">
                  <FaLeaf size={14} className="text-[#C5A059]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] font-serif italic">Tested Purity</span>
               </div>
               <div className="flex items-center gap-6 justify-end">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] font-serif italic">Ethical Sourcing</span>
                  <FaEarthAfrica size={14} className="text-[#C5A059]" />
               </div>
            </div>
          </div>

          {/* Right Column: Information Manifest */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <div className="space-y-8">
              <div className="flex flex-col gap-6">
                 <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059] bg-[#C5A059]/5 px-4 py-1.5 border border-[#C5A059]/10">
                      {typeof product.category === 'object' ? product.category.name : product.category}
                    </span>
                     <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C5A059] bg-[#C5A059]/5 px-4 py-1.5 border border-[#C5A059]/10 rounded-sm">
                       {product.weight} Net Weight
                     </span>
                 </div>
                 <h1 className="text-6xl md:text-[85px] font-serif text-foreground font-black uppercase tracking-tighter leading-[0.8] mb-4">
                   {product.name}
                 </h1>
              </div>

              <div className="flex items-center justify-between pb-8 border-b border-[#C5A059]/10">
                 <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-serif font-black text-foreground tabular-nums">
                       {parseFloat(product.promo_price || product.price).toLocaleString()}
                    </span>
                    <span className="text-sm font-black text-[#C5A059] uppercase tracking-widest">MAD</span>
                    {product.promo_price && (
                      <span className="text-2xl text-foreground/10 line-through font-serif tabular-nums ml-4 italic">{parseFloat(product.price).toLocaleString()}</span>
                    )}
                 </div>
                 <div className="flex gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={10} className={i < Math.floor(product.rating || 0) ? "text-[#C5A059]" : "text-[#C5A059]/20"} />
                    ))}
                 </div>
              </div>
            </div>

            {/* Narrative Tabs */}
            <div className="space-y-12">
               <div className="flex items-center gap-12 border-b border-[#C5A059]/10 pb-8">
                  <button onClick={() => setActiveTab('narrative')} className={`text-[10px] font-black uppercase tracking-[0.5em] transition-all relative ${activeTab === 'narrative' ? 'text-[#C5A059]' : 'text-foreground/20 hover:text-foreground'}`}>
                     Chronicle
                     {activeTab === 'narrative' && <div className="absolute bottom-[-33px] left-0 right-0 h-[2px] bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.5)]" />}
                  </button>
                  <button onClick={() => setActiveTab('properties')} className={`text-[10px] font-black uppercase tracking-[0.5em] transition-all relative ${activeTab === 'properties' ? 'text-[#C5A059]' : 'text-foreground/20 hover:text-foreground'}`}>
                     Alchemics
                     {activeTab === 'properties' && <div className="absolute bottom-[-33px] left-0 right-0 h-[2px] bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.5)]" />}
                  </button>
               </div>

               <div className="min-h-[140px] animate-in fade-in duration-1000">
                  {activeTab === 'narrative' && (
                    <p className="text-xl md:text-2xl text-foreground/60 leading-[1.8] font-serif italic border-l-2 border-[#C5A059]/20 pl-10 max-w-2xl">
                       {product.description || "Historical data for this specimen is currently archived."}
                    </p>
                  )}

                  {activeTab === 'properties' && (
                    <div className="grid grid-cols-2 gap-16 uppercase">
                       <div className="space-y-4">
                          <h4 className="text-[9px] font-black tracking-[0.4em] text-[#C5A059]">Benefit Profile</h4>
                          <p className="text-base text-foreground/50 font-serif italic lowercase">{product.benefits || "Pure botanical essence."}</p>
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-[9px] font-black tracking-[0.4em] text-[#C5A059]">Native Origin</h4>
                          <span className="text-sm font-black text-foreground tracking-widest block">{product.origin_country || 'Atlas, Morocco'}</span>
                       </div>
                    </div>
                  )}
               </div>
            </div>

            {/* Interaction Ritual */}
            <div className="flex flex-col gap-10 pt-10 border-t border-[#C5A059]/10">
              <div className="flex flex-col md:flex-row items-stretch gap-4">
                <div className="flex items-center bg-black border border-[#C5A059]/20 p-1.5 rounded-sm overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-14 flex items-center justify-center text-[#C5A059] bg-white/5 hover:bg-[#C5A059] hover:text-black transition-all"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="w-16 text-center font-black text-2xl text-white tabular-nums select-none">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-14 h-14 flex items-center justify-center text-[#C5A059] bg-white/5 hover:bg-[#C5A059] hover:text-black transition-all"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
                
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 bg-[#C5A059] py-6 text-[12px] font-black uppercase tracking-[0.6em] text-black transition-all hover:bg-white hover:border-white flex items-center justify-center gap-6 group/btn shadow-2xl disabled:opacity-50 min-h-[70px] rounded-sm"
                  disabled={product.stock <= 0}
                >
                  <FaBagShopping size={20} className="group-hover/btn:scale-125 transition-transform duration-500" />
                  {product.stock > 0 ? "Adjoin to Collection" : "Archive Depleted"}
                </button>
              </div>

               <div className="flex items-center gap-8 justify-center text-[#C5A059]/20 pt-4">
                  <FaFlaskVial size={20} />
                  <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent" />
                  <FaScroll size={20} />
               </div>
            </div>
          </div>
        </div>

        {/* Global Ritual Context (Usage) */}
        {product.usage_method && (
          <div className="mt-40 border-t border-[#C5A059]/5 pt-24 text-center space-y-12">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#C5A059]/40 italic">Procedural Recommendation</span>
            <p className="text-3xl md:text-5xl text-foreground font-serif italic leading-tight max-w-4xl mx-auto opacity-80 decoration-[#C5A059]/20 underline underline-offset-[16px] decoration-1">
              &quot;{product.usage_method}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
