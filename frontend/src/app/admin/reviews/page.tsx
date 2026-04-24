"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FaTrashCan, FaStar, FaQuoteLeft, FaCommentDots } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products/all/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet avis ? Cette action est irréversible.")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/products/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#C5A059]/10 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-6 w-[2px] bg-[#C5A059]" />
             <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]/80">Public Testimonials</h4>
          </div>
          <h1 className="text-5xl font-serif font-bold text-foreground tracking-tight">Voices of <span className="text-[#C5A059]">Atlas</span></h1>
          <p className="text-foreground/40 font-serif italic text-lg">Manage and moderate the alchemical experiences shared by seekers.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-32 text-center">
            <div className="flex flex-col items-center gap-4">
               <div className="w-10 h-10 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
               <span className="text-[#C5A059] font-serif italic tracking-widest">Gathering echoes...</span>
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="col-span-full py-32 text-center text-foreground/20 font-serif italic text-xl">Silence reigns in the sanctuary. No reviews found.</div>
        ) : reviews.map((review) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-[#C5A059]/10 p-8 flex flex-col gap-6 relative group hover:border-[#C5A059]/30 transition-all rounded-sm shadow-xl"
          >
            <div className="flex justify-between items-start">
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">{review.user_name}</span>
                  <span className="text-[8px] font-bold text-foreground/20 uppercase tracking-[0.2em]">
                    {new Date(review.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
               </div>
               <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={10} className={i < review.rating ? "text-[#C5A059]" : "text-[#C5A059]/10"} />
                  ))}
               </div>
            </div>

            <div className="relative pt-4">
               <FaQuoteLeft className="text-[#C5A059]/10 absolute -top-2 -left-2" size={32} />
               <p className="text-sm text-foreground/60 font-serif italic leading-relaxed relative z-10">
                 &quot;{review.comment}&quot;
               </p>
            </div>

            <div className="mt-auto pt-6 border-t border-[#C5A059]/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/30" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{review.product?.name}</span>
               </div>
               <button 
                onClick={() => handleDelete(review.id)}
                className="text-red-900/40 hover:text-red-500 transition-colors p-2"
               >
                 <FaTrashCan size={14} />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
