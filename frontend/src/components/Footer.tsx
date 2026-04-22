import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaEnvelope, FaLocationDot, FaPhone, FaArrowUpLong } from "react-icons/fa6";

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
               <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]">The Sanctuary</h4>
               <nav className="flex flex-col gap-6">
                 {['Home', 'Catalog', 'Ritual Packs', 'Recipes', 'Manuscrits'].map((item) => (
                    <Link key={item} href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase() === 'manuscrits' ? 'blog' : item.toLowerCase() === 'ritual packs' ? 'bundles' : item.toLowerCase()}`} className="text-sm font-bold uppercase tracking-widest text-foreground/40 hover:text-[#C5A059] transition-colors">{item}</Link>
                 ))}
               </nav>
            </div>
            
            <div className="space-y-10">
               <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]">Assistance</h4>
               <nav className="flex flex-col gap-6">
                 {['Contact', 'Shipping', 'Terms', 'Privacy'].map((item) => (
                    <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm font-bold uppercase tracking-widest text-foreground/40 hover:text-[#C5A059] transition-colors">{item}</Link>
                 ))}
               </nav>
            </div>

            <div className="space-y-10 col-span-2 md:col-span-1">
               <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]">Dispatch Center</h4>
               <div className="flex flex-col gap-8">
                  <div className="flex items-start gap-4 text-foreground/50 text-sm font-serif italic">
                     <FaLocationDot size={16} className="mt-1 text-[#C5A059]/40" />
                     <p>High Atlas Mountains,<br />Marrakech Region, Morocco</p>
                  </div>
                  <div className="flex items-center gap-4 text-foreground/50 text-sm tracking-widest">
                     <FaPhone size={16} className="text-[#C5A059]/40" />
                     <p>+212 (0) 6XX XXX XXX</p>
                  </div>
                  <div className="flex items-center gap-4 text-foreground/50 text-sm tracking-widest group">
                     <FaEnvelope size={16} className="text-[#C5A059]/40" />
                     <p className="group-hover:text-[#C5A059] transition-colors">essence@jabaltoubkal.com</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-20 border-t border-[#C5A059]/10 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/40 italic">
                © {new Date().getFullYear()} Jabal Toubkal. Ancestral Heritage Authenticated.
              </span>
              <div className="flex gap-8">
                 <span className="text-[11px] font-black uppercase tracking-widest text-foreground/30">Currency: MAD</span>
                 <span className="text-[11px] font-black uppercase tracking-widest text-foreground/30">Region: MENA</span>
              </div>
           </div>

           <button 
              onClick={scrollToTop}
              className="flex items-center gap-4 group text-xs font-black uppercase tracking-[0.3em] text-[#C5A059] hover:text-foreground transition-all"
           >
              Elevation Ritual
              <div className="w-10 h-10 border border-[#C5A059]/20 flex items-center justify-center group-hover:bg-[#C5A059] group-hover:text-black transition-all">
                 <FaArrowUpLong size={12} className="group-hover:-translate-y-2 transition-transform duration-500" />
              </div>
           </button>
        </div>
      </div>
    </footer>
  );
}
