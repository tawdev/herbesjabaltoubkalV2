"use client";

import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaEnvelope, FaLocationDot, FaPhone, FaArrowUpLong } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-background border-t border-[#C5A059]/10 pt-32 pb-20 relative overflow-hidden">
      {/* Decorative Background Text */}
      <div className="absolute top-20 left-0 right-0 text-center text-[250px] font-serif italic text-foreground/[0.01] pointer-events-none select-none">
        Toubkal
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-32">
          {/* Brand Identity Column */}
          <div className="lg:col-span-5 space-y-12">
            <Link href="/" className="inline-block transform hover:scale-105 transition-transform duration-500">
               <div className="relative h-32 w-32">
                <Image
                  src="/images/logo/luxury_logo_transparent.png"
                  alt="Herbes Jabal Toubkal"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <div className="max-w-md space-y-8">
               <p className="text-xl font-serif italic text-foreground/40 leading-relaxed">
                 &quot;Harvesting the soul of the High Atlas. We transmit the ancestral wisdom of Moroccan botanicals to the modern world, one ritual at a time.&quot;
               </p>
               <div className="flex gap-8">
                  {[
                    { icon: <FaInstagram size={18} />, href: "#" },
                    { icon: <FaFacebookF size={18} />, href: "#" },
                    { icon: <FaWhatsapp size={18} />, href: "#" },
                  ].map((social, i) => (
                    <a key={i} href={social.href} className="w-12 h-12 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059]/40 hover:text-[#C5A059] hover:border-[#C5A059] transition-all rounded-sm">
                       {social.icon}
                    </a>
                  ))}
               </div>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-10">
              <h4 className="text-[15px] font-black uppercase tracking-[0.4em] text-[#C5A059]">The Sanctuary</h4>
              <nav className="flex flex-col gap-6">
                {['Home', 'Catalog', 'Ritual Packs', 'Recipes', 'Manuscrits'].map((item) => (
                  <Link key={item} href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase() === 'catalog' ? 'products' : item.toLowerCase() === 'manuscrits' ? 'blog' : item.toLowerCase() === 'ritual packs' ? 'bundles' : item.toLowerCase()}`} className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-[#C5A059] transition-colors">{item}</Link>
                ))}
              </nav>
            </div>
            
            <div className="space-y-10">
              <h4 className="text-[15px] font-black uppercase tracking-[0.4em] text-[#C5A059]">Assistance</h4>
              <nav className="flex flex-col gap-6">
                {['Contact', 'Shipping', 'Terms', 'Privacy'].map((item) => (
                  <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-[#C5A059] transition-colors">{item}</Link>
                ))}
              </nav>
            </div>

            <div className="space-y-10 col-span-2 md:col-span-1">
              <h4 className="text-[15px] font-black uppercase tracking-[0.4em] text-[#C5A059]">Dispatch Center</h4>
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4 text-foreground/50 text-[14px] font-serif italic">
                  <FaLocationDot size={18} className="mt-1 text-[#C5A059]/40" />
                  <p>48 Lot IGUIDER Allal El Fasi<br />Marrakech, Morocco</p>
                </div>
                <div className="flex items-center gap-4 text-foreground/50 text-[14px] tracking-widest">
                  <FaPhone size={18} className="text-[#C5A059]/40" />
                  <p>+212 (0) 661 118 649</p>
                </div>
                <div className="flex items-center gap-4 text-foreground/50 text-[14px] tracking-widest group">
                  <FaEnvelope size={18} className="text-[#C5A059]/40" />
                  <p className="group-hover:text-[#C5A059] transition-colors">contact@jabaltoubkal.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-20 border-t border-[#C5A059]/10 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <span className="text-[14px] font-bold uppercase tracking-[0.25em] text-foreground/50 italic">
                © {new Date().getFullYear()} Jabal Toubkal. Developed by{' '}
                <a 
                  href="https://cdigital.ma" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#C5A059] hover:text-foreground transition-colors not-italic font-black"
                >
                  cdigital.ma
                </a>
              </span>
              <div className="flex gap-8">
                 <span className="text-[14px] font-bold uppercase tracking-widest text-foreground/30">Currency: MAD</span>
                 <span className="text-[14px] font-bold uppercase tracking-widest text-foreground/30">Region: MENA</span>
              </div>
           </div>

           <div className="hidden lg:block text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">
             Purity. Wisdom. Heritage.
           </div>
        </div>
      </div>

      {/* Floating Elevation Ritual (Back to Top) */}
      <ScrollToTop />
    </footer>
  );
}

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-28 right-8 z-50">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="relative group"
          >
            {/* Tooltip */}
            <div className="absolute bottom-1/2 right-full mr-4 translate-y-1/2 whitespace-nowrap bg-white/90 backdrop-blur-md py-2 px-4 rounded-xl shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none hidden md:block">
               <div className="text-[#C5A059] font-black uppercase tracking-widest text-[10px]">Elevation Ritual</div>
               <div className="text-slate-500 text-[10px] font-bold text-right">Retour au sommet</div>
            </div>

            <button
              onClick={scrollToTop}
              className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer overflow-hidden border border-white/20"
              style={{ background: 'linear-gradient(135deg, #C5A059 0%, #967A41 100%)' }}
            >
              <FaArrowUpLong size={24} className="group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
