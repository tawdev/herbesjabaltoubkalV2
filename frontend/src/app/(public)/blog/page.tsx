"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBlogs } from "@/lib/api";
import { getBlogImage } from "@/lib/images";
import { FaBookOpen, FaFeatherPointed, FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogs().then(data => {
      setBlogs(data);
      setLoading(false);
    });
  }, []);

  const nextManuscript = () => {
    if (currentIndex < blogs.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const prevManuscript = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-8">
       <div className="w-16 h-16 border-b-2 border-[#C5A059] rounded-full animate-spin" />
       <p className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.5em]">Opening the Vault...</p>
    </div>
  );

  return (
    <div className="bg-background min-h-screen pt-32 pb-32 overflow-hidden selection:bg-[#C5A059] selection:text-black transition-colors duration-500">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col items-center">
        
        {/* Header ritualisé */}
        <header className="text-center mb-20 space-y-8 max-w-4xl">
           <div className="flex items-center justify-center gap-6 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C5A059]/40" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#C5A059]">The Library of Wisdom</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C5A059]/40" />
           </div>
           <h1 className="text-6xl md:text-9xl font-serif font-black tracking-tighter text-foreground uppercase leading-[0.8]">
             Les <span className="text-[#C5A059]">Manuscrits</span>
           </h1>
           <p className="text-foreground/40 text-xl font-serif italic max-w-2xl mx-auto leading-relaxed">
             Ancient herbal transmissions, harvest cycles, and botanical secrets preserved for the seekers of purity.
           </p>
        </header>

        {/* The Book Container */}
        <div className="relative w-full max-w-7xl aspect-[16/10] md:aspect-[16/8] perspective-2000">
          
          <AnimatePresence mode="wait">
             {blogs.length > 0 ? (
               <motion.div 
                 key={currentIndex}
                 initial={{ rotateY: 90, opacity: 0 }}
                 animate={{ rotateY: 0, opacity: 1 }}
                 exit={{ rotateY: -90, opacity: 0 }}
                 transition={{ duration: 0.8, ease: "easeInOut" }}
                 className="relative w-full h-full flex transform-style-3d shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-x border-[#C5A059]/10"
               >
                 {/* Left Page (Visual) */}
                 <div className="hidden md:block flex-1 bg-card relative overflow-hidden border-r border-[#C5A059]/20">
                    {/* Paper Texture Overlay */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />
                    <Image
                      src={getBlogImage(blogs[currentIndex].image)}
                      alt={blogs[currentIndex].title}
                      fill
                      className="object-cover grayscale-[0.5] opacity-60"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-12 left-12 space-y-2">
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C5A059]">Archival Ref. #{blogs[currentIndex].id.toString().padStart(4, '0')}</span>
                       <div className="h-px w-20 bg-[#C5A059]/30" />
                    </div>

                    <div className="absolute bottom-12 left-12 right-12 space-y-4">
                       <p className="text-4xl font-serif font-black text-foreground uppercase tracking-tighter leading-none italic opacity-30">
                         {blogs[currentIndex].title_ar}
                       </p>
                    </div>
                 </div>

                 {/* Right Page (Content) */}
                 <div className="flex-1 bg-[#f5f1e8] p-8 md:p-20 relative flex flex-col justify-between overflow-hidden">
                    {/* Paper Texture */}
                    <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] rotate-45" />
                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]" />
                    
                    <div className="relative z-10 space-y-12">
                       <div className="flex justify-between items-center border-b border-black/10 pb-6">
                          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-black/40">Transmission Record</span>
                          <span className="text-[10px] font-serif italic text-black/60">{new Date(blogs[currentIndex].created_at).toLocaleDateString()}</span>
                       </div>

                       <div className="space-y-6">
                          <h2 className="text-5xl md:text-7xl font-serif text-black font-black uppercase tracking-tighter leading-[0.9] italic">
                             {blogs[currentIndex].title}
                          </h2>
                          <p className="text-black/60 text-lg md:text-xl font-serif italic leading-relaxed line-clamp-4 md:line-clamp-6">
                            {blogs[currentIndex].excerpt || (blogs[currentIndex].content.substring(0, 300) + "...")}
                          </p>
                       </div>

                       <Link 
                         href={`/blog/${blogs[currentIndex].id}`}
                         className="inline-flex items-center gap-6 group"
                       >
                          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform shadow-xl">
                             <FaFeatherPointed size={18} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black">Decipher Entirety</span>
                       </Link>
                    </div>

                    <div className="relative z-10 flex justify-between items-center pt-12 border-t border-black/10 mt-auto">
                       <span className="text-[9px] font-black text-black/30">PAGE {currentIndex + 1} OF {blogs.length}</span>
                       <div className="flex gap-4">
                          <button 
                            onClick={prevManuscript}
                            disabled={currentIndex === 0}
                            className={`w-10 h-10 border border-black/10 flex items-center justify-center transition-all ${currentIndex === 0 ? 'opacity-10 cursor-not-allowed' : 'hover:bg-black hover:text-white'}`}
                          >
                             <FaChevronLeft size={12} />
                          </button>
                          <button 
                            onClick={nextManuscript}
                            disabled={currentIndex === blogs.length - 1}
                            className={`w-10 h-10 border border-black/10 flex items-center justify-center transition-all ${currentIndex === blogs.length - 1 ? 'opacity-10 cursor-not-allowed' : 'hover:bg-black hover:text-white'}`}
                          >
                             <FaChevronRight size={12} />
                          </button>
                       </div>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="relative w-full h-full flex transform-style-3d shadow-2xl"
               >
                 <div className="flex-1 bg-[#121212] flex items-center justify-center border-r border-[#C5A059]/10">
                    <FaBookOpen size={80} className="text-[#C5A059]/5 animate-pulse" />
                 </div>
                 <div className="flex-1 bg-[#f5f1e8] p-24 flex flex-col items-center justify-center text-center space-y-10">
                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]" />
                    <h2 className="text-4xl font-serif text-black uppercase tracking-tighter italic opacity-20">The Archives are Silent.</h2>
                    <p className="font-serif italic text-black/40 text-lg max-w-sm">
                      No transmissions have been recorded in this lunar cycle. The scribes are currently gathering wisdom from the mountains.
                    </p>
                    <div className="h-20 w-px bg-black/10" />
                 </div>
               </motion.div>
             )}
          </AnimatePresence>

          {/* Book Spine Shadow */}
          <div className="absolute top-0 bottom-0 left-[50%] w-px bg-black/40 z-20 hidden md:block" />
          <div className="absolute top-0 bottom-0 left-[50%] w-10 bg-gradient-to-r from-black/20 to-transparent z-10 hidden md:block" />
          <div className="absolute top-0 bottom-0 right-[50%] w-10 bg-gradient-to-l from-black/20 to-transparent z-10 hidden md:block" />

        </div>

        {/* List index under the book (optional, for direct access) */}
        {blogs.length > 0 && (
          <div className="mt-20 flex flex-wrap justify-center gap-4">
             {blogs.map((_, idx) => (
               <button 
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-12 h-1 bg-[#C5A059] transition-all duration-500 ${currentIndex === idx ? 'opacity-100 scale-x-125' : 'opacity-10'}`}
               />
             ))}
          </div>
        )}

      </div>
    </div>
  );
}
