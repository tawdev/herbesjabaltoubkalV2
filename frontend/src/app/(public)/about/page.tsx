"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaHandshake, FaSun, FaLeaf } from "react-icons/fa6";

export default function AboutPage() {
  const brandColor = "#C0560D";

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10" />
        <div className="absolute inset-0 z-0 brightness-50">
           <Image 
              src="https://images.unsplash.com/photo-1489493512598-d08130f49bea"
              alt="High Atlas Mountains"
              fill
              priority
              className="object-cover scale-110"
           />
        </div>
        
        <div className="relative z-20 container mx-auto px-6 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#C5A059] mb-8 block">The Ancestral Legacy</span>
            <h1 className="text-6xl md:text-9xl font-serif text-[#C5A059] uppercase tracking-tighter leading-none mb-10">
                Herbes Jabal <br />
                <span className="text-foreground/20 italic lowercase">Toubkal</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl font-serif italic text-foreground/40 leading-relaxed">
              Cultivating the essence of the Atlas Mountains, bringing century-old Moroccan botanical wisdom to the modern world.
            </p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 overflow-hidden h-24 w-[1px]">
            <motion.div 
                animate={{ y: [0, 80, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full bg-gradient-to-b from-[#C5A059] to-transparent" 
            />
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-40 container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">The Origin</span>
              <h2 className="text-5xl md:text-6xl font-serif text-[#C5A059] uppercase tracking-tight leading-[0.9]">A Journey Through <br /><span className="text-foreground/20 italic lowercase">the High Atlas</span></h2>
            </div>
            <div className="space-y-8 font-serif italic text-foreground/50 text-lg leading-loose">
                <p>
                Founded at the foot of North Africa's highest peak, Jabal Toubkal began with a simple vision: to preserve and share the extraordinary aromatic biodiversity of Morocco. 
                </p>
                <p>
                Our journey takes us through remote mountain villages and hidden valleys, where we work hand-in-hand with local harvesters who have mastered the art of ecological gathering over generations.
                </p>
            </div>
            <div className="flex gap-16 pt-10 border-t border-[#C5A059]/10">
                <div>
                    <span className="block text-4xl font-serif italic text-[#C5A059]">100%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/20">Organic Sourcing</span>
                </div>
                <div>
                    <span className="block text-4xl font-serif italic text-[#C5A059]">25+</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/20">Elite Botanicals</span>
                </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[700px] border border-[#C5A059]/10 p-2 bg-card"
          >
             <div className="relative w-full h-full overflow-hidden brightness-75 hover:brightness-100 transition-all duration-1000">
                <Image 
                    src="/images/about_market.png"
                    alt="Moroccan Spices Market"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                />
             </div>
          </motion.div>
        </div>
      </section>

      {/* Ethical harvesting */}
      <section className="bg-[#0D0D0D] py-40 border-y border-[#C5A059]/10">
        <div className="container mx-auto px-6 text-center space-y-32">
            <div className="max-w-3xl mx-auto space-y-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#C5A059]">Rituals & Ethics</span>
                <h2 className="text-5xl md:text-7xl font-serif text-[#C5A059] uppercase tracking-tight">Harvested <br /><span className="text-foreground/20 italic lowercase">with Heart</span></h2>
                <p className="text-xl font-serif italic text-foreground/40">We believe that true brilliance emerges from a deep respect for the land and the souls who nurture it.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-[#C5A059]/10">
                {[
                    {
                        title: "Ethical Sourcing",
                        desc: "Direct partnerships with mountain cooperatives ensuring fair wages and sustainable community growth.",
                        icon: <FaHandshake />
                    },
                    {
                        title: "Solar Alchemy",
                        desc: "Preserving the natural oils and vibrant aromas through traditional Atlas sun-drying techniques.",
                        icon: <FaSun />
                    },
                    {
                        title: "Carbon Conscious",
                        desc: "Small-batch processing that minimizes our footprint while maximizing flavor integrity.",
                        icon: <FaLeaf />
                    }
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="p-16 lg:p-20 bg-background hover:bg-card transition-all group"
                    >
                        <div className="text-4xl mb-12 text-[#C5A059]/40 group-hover:text-[#C5A059] transition-all flex justify-center">{item.icon}</div>
                        <h3 className="text-2xl font-serif text-foreground uppercase tracking-widest mb-6">{item.title}</h3>
                        <p className="text-foreground/30 leading-loose font-serif italic text-sm">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-40 container mx-auto px-6 lg:px-12">
        <div className="border border-[#C5A059]/20 bg-card p-20 md:p-32 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-[#C5A059] to-transparent" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 space-y-12"
            >
                <h2 className="text-5xl md:text-7xl font-serif text-[#C5A059] uppercase tracking-tighter leading-none">Bring the Atlas <br /><span className="text-foreground/20 italic lowercase">to your Table</span></h2>
                <p className="max-w-xl mx-auto text-foreground/40 font-serif italic text-lg decoration-[#C5A059]/20 underline underline-offset-[12px]">Experience the authentic flavors of Morocco with our premium collection of hand-selected elixirs.</p>
                <div className="pt-8">
                    <a href="/products" className="inline-block border border-[#C5A059] px-16 py-6 text-[10px] font-bold uppercase tracking-[0.5em] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all">
                        Explore the Shop
                    </a>
                </div>
            </motion.div>
        </div>
      </section>
    </div>
  );
}
