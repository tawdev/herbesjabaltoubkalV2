"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { API_URL } from "@/lib/api";
import { getBlogImage } from "@/lib/images";
import Link from "next/link";
import { FaArrowLeftLong, FaRegCalendarDays, FaBookmark, FaFeatherPointed } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`${API_URL}/blogs/${params.id}`, { cache: "no-store" } as any)
      .then((res) => {
        if (!res.ok) { setNotFound(true); return null; }
        return res.json();
      })
      .then((data) => {
        if (data) setBlog(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-6">
        <div className="w-16 h-16 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
        <p className="text-[#C5A059] font-serif italic tracking-[0.3em] animate-pulse uppercase text-xs">Deciphering Archival Record...</p>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-10">
        <div className="space-y-4 text-center">
           <h1 className="text-4xl font-serif text-foreground/20 italic tracking-widest uppercase">The chronicle is lost to time.</h1>
        </div>
        <Link href="/blog" className="px-12 py-5 border border-[#C5A059]/20 text-[#C5A059] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#C5A059] hover:text-black transition-all">Return to Library</Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-24 selection:bg-[#C5A059] selection:text-black transition-colors duration-500">
      <div className="container mx-auto px-6 lg:px-20 max-w-5xl">
        
        <Link
          href="/blog"
          className="inline-flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059]/40 hover:text-[#C5A059] transition-all mb-20 group"
        >
          <FaArrowLeftLong className="group-hover:-translate-x-3 transition-transform" />
          The Library Index
        </Link>

        {/* The Single Page Manuscript */}
        <motion.article 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative bg-[#f5f1e8] shadow-[0_100px_200px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Paper Textures */}
          <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] rotate-45" />
          <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]" />
          
          <div className="relative z-10 p-10 md:p-24 space-y-16">
            
            {/* Header Ritual */}
            <header className="space-y-12 text-center border-b border-black/10 pb-16">
               <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-3 text-black/40">
                     <FaBookmark size={12} className="text-[#C5A059]" />
                     <span className="text-[9px] font-black uppercase tracking-[0.4em]">Archival Record</span>
                  </div>
                  <div className="h-px w-12 bg-black/10" />
                  <div className="text-[10px] font-serif italic text-black/60">
                    Transmitted on {new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
               </div>

               <div className="space-y-6">
                  <h1 className="text-5xl md:text-8xl font-serif text-black font-black uppercase tracking-tighter leading-[0.85] italic">
                    {blog.title}
                  </h1>
                  <div className="text-3xl md:text-4xl text-[#C5A059] font-serif italic font-arabic pt-4" dir="rtl">
                    {blog.title_ar}
                  </div>
               </div>
            </header>

            {/* Immersive Visual */}
            <div className="relative aspect-[16/10] w-full overflow-hidden shadow-inner grayscale-[0.3] hover:grayscale-0 transition-all duration-1000">
               <Image
                 src={getBlogImage(blog.image)}
                 alt={blog.title}
                 fill
                 className="object-cover"
                 unoptimized
               />
               <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
            </div>

            {/* Content Transcription */}
            <div className="grid md:grid-cols-2 gap-20 pt-10">
               <div className="space-y-8">
                  <div className="flex items-center gap-4 text-black/20 border-b border-black/5 pb-4">
                     <FaFeatherPointed size={14} />
                     <span className="text-[9px] font-black uppercase tracking-[0.4em]">Latin Script</span>
                  </div>
                  <div className="prose prose-sm md:prose-base max-w-none">
                     <div className="whitespace-pre-wrap leading-[2.2] text-xl text-black/80 font-serif italic space-y-8">
                        {blog.content}
                     </div>
                  </div>
               </div>

               <div className="space-y-8 text-right">
                  <div className="flex items-center justify-end gap-4 text-black/20 border-b border-black/5 pb-4">
                     <span className="text-[9px] font-black uppercase tracking-[0.4em]">النص الأصلي</span>
                     <FaFeatherPointed size={14} />
                  </div>
                  <div className="prose prose-sm md:prose-base max-w-none">
                     <div className="whitespace-pre-wrap leading-[2.2] text-3xl text-[#C5A059]/80 font-serif italic font-arabic" dir="rtl">
                        {blog.content_ar}
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer Seal */}
            <footer className="pt-24 border-t border-black/10 flex flex-col items-center gap-10">
               <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 border-2 border-[#C5A059]/20 rounded-full flex items-center justify-center relative group">
                     <div className="absolute inset-1 border border-[#C5A059]/10 rounded-full animate-spin-slow" />
                     <Image 
                        src="/images/logo/luxury_logo_transparent.png"
                        alt="Sanctum Seal"
                        width={40}
                        height={40}
                        className="opacity-20 group-hover:opacity-100 transition-opacity"
                     />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] text-black/20">Authenticated by Jabal Sanctum</span>
               </div>
               
               <p className="text-center text-black/40 text-sm font-serif italic max-w-lg">
                 This manuscript belongs to the eternal archives of Jabal Toubkal. Unauthorized reproduction of this transmission is strictly forbidden.
               </p>
            </footer>

          </div>
        </motion.article>

        <div className="mt-32 text-center">
           <Link 
             href="/products" 
             className="inline-block py-6 px-16 bg-[#C5A059] text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-2xl"
           >
             Procure Mentioned Botanicals
           </Link>
        </div>
      </div>
    </div>
  );
}
