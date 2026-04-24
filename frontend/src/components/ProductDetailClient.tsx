"use client";

import Image from "next/image";
import { getProductImage } from "@/lib/images";
import React, { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FaBagShopping, FaPlus, FaMinus, FaStar, FaLeaf, FaEarthAfrica, FaFlaskVial, FaArrowLeftLong, FaMagnifyingGlassPlus, FaScroll, FaUserAstronaut, FaCircleCheck } from "react-icons/fa6";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailClient({ product }: { product: any }) {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('narrative');
  const [localReviews, setLocalReviews] = useState(product.reviews || []);
  const [newReview, setNewReview] = useState({ user_name: user?.username || '', rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const averageRating = localReviews.length > 0 
    ? localReviews.reduce((acc: any, rev: any) => acc + rev.rating, 0) / localReviews.length 
    : parseFloat(product.rating || 4.5);

  useEffect(() => {
    if (user) {
      setNewReview(prev => ({ ...prev, user_name: user.username }));
      // Check if user already reviewed this product (simple name match for now)
      const alreadyReviewed = localReviews.some((r: any) => r.user_name === user.username);
      setHasReviewed(alreadyReviewed);
    }
  }, [user, localReviews]);
  
  // Interactive Zoom State
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.user_name || !newReview.comment) return;
    
    setIsSubmittingReview(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3007";
      const res = await fetch(`${API_URL}/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      if (res.ok) {
        const addedReview = await res.json();
        setLocalReviews([addedReview, ...localReviews]);
        setNewReview({ user_name: '', rating: 5, comment: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-40 animate-in fade-in duration-1000">
      <div className="container mx-auto py-16 px-6 lg:px-24">
        {/* Navigation */}
        <nav className="mb-12 flex items-center justify-between border-b border-[#C5A059]/10 pb-8">
           <Link href="/products" className="flex items-center gap-4 group">
              <FaArrowLeftLong className="text-[#C5A059] group-hover:-translate-x-2 transition-transform" size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 group-hover:text-foreground transition-colors">Return to Library</span>
           </Link>
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
                       {product.weight} {product.unit || 'g'}
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
                      <FaStar key={i} size={10} className={i < Math.floor(averageRating) ? "text-[#C5A059]" : "text-[#C5A059]/20"} />
                    ))}
                    <span className="text-[10px] text-[#C5A059]/40 ml-2 font-bold">({localReviews.length})</span>
                 </div>
              </div>
            </div>

            {/* Narrative Tabs */}
            <div className="space-y-12">
               <div className="flex items-center gap-8 md:gap-12 border-b border-[#C5A059]/10 pb-8 overflow-x-auto no-scrollbar">
                  <button onClick={() => setActiveTab('narrative')} className={`text-[10px] font-black uppercase tracking-[0.5em] transition-all relative whitespace-nowrap ${activeTab === 'narrative' ? 'text-[#C5A059]' : 'text-foreground/20 hover:text-foreground'}`}>
                     Chronicle
                     {activeTab === 'narrative' && <div className="absolute bottom-[-33px] left-0 right-0 h-[2px] bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.5)]" />}
                  </button>
                  <button onClick={() => setActiveTab('properties')} className={`text-[10px] font-black uppercase tracking-[0.5em] transition-all relative whitespace-nowrap ${activeTab === 'properties' ? 'text-[#C5A059]' : 'text-foreground/20 hover:text-foreground'}`}>
                     Alchemics
                     {activeTab === 'properties' && <div className="absolute bottom-[-33px] left-0 right-0 h-[2px] bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.5)]" />}
                  </button>
                  <button onClick={() => setActiveTab('reviews')} className={`text-[10px] font-black uppercase tracking-[0.5em] transition-all relative whitespace-nowrap ${activeTab === 'reviews' ? 'text-[#C5A059]' : 'text-foreground/20 hover:text-foreground'}`}>
                     Avis ({localReviews.length})
                     {activeTab === 'reviews' && <div className="absolute bottom-[-33px] left-0 right-0 h-[2px] bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.5)]" />}
                  </button>
               </div>

               <div className="min-h-[140px] animate-in fade-in duration-1000">
                  <AnimatePresence mode="wait">
                    {activeTab === 'narrative' && (
                      <motion.p 
                        key="narrative"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="text-xl md:text-2xl text-foreground/60 leading-[1.8] font-serif italic border-l-2 border-[#C5A059]/20 pl-10 max-w-2xl"
                      >
                         {product.description || "Historical data for this specimen is currently archived."}
                      </motion.p>
                    )}
                    {activeTab === 'properties' && (
                      <motion.div 
                        key="properties"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-2 gap-16 uppercase"
                      >
                         <div className="space-y-4">
                            <h4 className="text-[9px] font-black tracking-[0.4em] text-[#C5A059]">Benefit Profile</h4>
                            <p className="text-base text-foreground/50 font-serif italic lowercase">{product.benefits || "Pure botanical essence."}</p>
                         </div>
                         <div className="space-y-4">
                            <h4 className="text-[9px] font-black tracking-[0.4em] text-[#C5A059]">Native Origin</h4>
                            <span className="text-sm font-black text-foreground tracking-widest block">{product.origin_country || 'Atlas, Morocco'}</span>
                         </div>
                      </motion.div>
                    )}
                    {activeTab === 'reviews' && (
                      <motion.div 
                        key="reviews"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-12"
                      >
                         {/* Review List */}
                         <div className="space-y-8 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                            {localReviews.length > 0 ? localReviews.map((rev: any, idx: number) => (
                               <div key={idx} className="border-l border-[#C5A059]/20 pl-6 space-y-2">
                                  <div className="flex items-center justify-between">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">{rev.user_name}</span>
                                     <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                           <FaStar key={i} size={8} className={i < rev.rating ? "text-[#C5A059]" : "text-[#C5A059]/10"} />
                                        ))}
                                     </div>
                                  </div>
                                  <p className="text-sm text-foreground/40 font-serif italic">&quot;{rev.comment}&quot;</p>
                               </div>
                            )) : (
                               <p className="text-sm text-foreground/20 font-serif italic">Soyez le premier à partager votre expérience.</p>
                            )}
                         </div>

                         {/* Add Review Form */}
                         {hasReviewed ? (
                            <div className="pt-8 border-t border-[#C5A059]/10 flex items-center gap-4 text-[#C5A059]/40 font-serif italic text-sm">
                               <FaCircleCheck size={18} />
                               Vous avez déjà scellé votre avis sur ce trésor de l&apos;Atlas.
                            </div>
                         ) : !user ? (
                            <div className="pt-8 border-t border-[#C5A059]/10 flex flex-col gap-4">
                               <p className="text-sm text-foreground/40 font-serif italic">Seuls les initiés peuvent laisser un témoignage.</p>
                               <Link href="/login" className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C5A059] hover:text-foreground transition-all">
                                  Se connecter pour donner mon avis
                               </Link>
                            </div>
                         ) : (
                            <form onSubmit={handleReviewSubmit} className="pt-8 border-t border-[#C5A059]/5 space-y-6">
                               <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-1">
                                     <label className="text-[8px] font-black uppercase tracking-widest text-[#C5A059]/50">Votre Identité</label>
                                     <input 
                                        disabled
                                        placeholder="Votre Nom"
                                        className="w-full bg-transparent border-b border-[#C5A059]/10 py-2 text-xs uppercase tracking-widest focus:outline-none opacity-50"
                                        value={newReview.user_name}
                                      />
                                  </div>
                                  <div className="space-y-1">
                                     <label className="text-[8px] font-black uppercase tracking-widest text-[#C5A059]/50">Sagesse (Note)</label>
                                     <select 
                                        className="w-full bg-transparent border-b border-[#C5A059]/10 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-[#C5A059] transition-all cursor-pointer"
                                        value={newReview.rating}
                                        onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                                     >
                                        {[5,4,3,2,1].map(n => (
                                          <option key={n} value={n} className="bg-black text-white">
                                            {n} {'★'.repeat(n)}{'☆'.repeat(5-n)}
                                          </option>
                                        ))}
                                     </select>
                                  </div>
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[8px] font-black uppercase tracking-widest text-[#C5A059]/50">Votre Témoignage</label>
                                  <textarea 
                                     required
                                     placeholder="Racontez votre expérience avec ce rituel..."
                                     rows={2}
                                     className="w-full bg-transparent border-b border-[#C5A059]/10 py-2 text-xs font-serif italic focus:outline-none focus:border-[#C5A059] transition-all resize-none"
                                     value={newReview.comment}
                                     onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                  />
                               </div>
                               <button 
                                  type="submit"
                                  disabled={isSubmittingReview}
                                  className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C5A059] hover:text-foreground transition-colors disabled:opacity-50"
                               >
                                  {isSubmittingReview ? "Transmission..." : "Partager mon expérience"}
                               </button>
                            </form>
                         )}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                  {product.stock > 0 ? "Ajouter au panier" : "Épuisé"}
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
