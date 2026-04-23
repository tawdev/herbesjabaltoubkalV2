"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaPaperPlane } from "react-icons/fa6";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <section className="py-48 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-20 max-w-5xl text-center flex flex-col items-center gap-16">
        <div className="space-y-4">
           <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#C5A059]">Join the Circle</span>
           <h3 className="text-5xl md:text-8xl font-serif text-foreground font-black uppercase tracking-tighter">Become a <span className="italic text-[#C5A059]">Chronicler</span></h3>
        </div>
        <p className="text-xl text-foreground/50 font-serif italic max-w-xl">Register to receive our secret transmissions, limited harvest alerts, and alchemic guides.</p>
        
        <form onSubmit={handleSubmit} className="w-full max-w-3xl flex flex-col items-center gap-10">
          <div className="w-full relative">
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="YOUR SACRED EMAIL ADDRESS" 
              className="w-full bg-transparent border-b border-[#C5A059]/40 py-8 text-2xl font-serif text-foreground text-center focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-foreground/20 uppercase tracking-widest disabled:opacity-50"
              disabled={status === "success"}
            />
          </div>

          <button 
            type="submit"
            disabled={status !== "idle"}
            className={`relative px-24 py-8 overflow-hidden transition-all duration-700 group shadow-2xl rounded-sm ${
              status === "success" 
              ? "bg-green-500 text-white" 
              : "bg-[#C5A059] text-black hover:bg-foreground hover:text-background"
            }`}
          >
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.span 
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-[11px] font-black uppercase tracking-[0.5em]"
                >
                  Initiate Membership
                </motion.span>
              )}
              {status === "loading" && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                   <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                   <span className="text-[11px] font-black uppercase tracking-[0.5em]">Transmitting...</span>
                </motion.div>
              )}
              {status === "success" && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3"
                >
                   <FaCheck size={14} />
                   <span className="text-[11px] font-black uppercase tracking-[0.5em]">Ritual Confirmed</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </form>
      </div>
      
      {/* Background Decorative */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 text-[300px] font-serif italic text-foreground/[0.01] pointer-events-none select-none">Newsletter</div>
    </section>
  );
}
