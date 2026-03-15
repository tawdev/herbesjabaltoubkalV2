"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  const brandColor = "#C0560D";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 z-0 grayscale-[20%] brightness-75 transition-transform duration-1000 transform hover:scale-105">
           <Image 
              src="https://images.unsplash.com/photo-1489493512598-d08130f49bea"
              alt="High Atlas Mountains"
              fill
              priority
              sizes="100vw"
              className="object-cover"
           />
        </div>
        
        <div className="relative z-20 container mx-auto px-6 text-center text-white space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Our Legacy</span>
            <h1 className="text-5xl md:text-7xl font-serif italic mb-6">Herbes Jabal Toubkal</h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium text-white/80 leading-relaxed font-serif">
              Cultivating the essence of the Atlas Mountains, bringing century-old Moroccan botanical wisdom to the modern kitchen.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
            <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Heritage</span>
              <h2 className="text-4xl md:text-5xl font-serif italic">A Journey Through the High Atlas</h2>
            </div>
            <p className="text-lg text-foreground/80 leading-relaxed font-serif font-semibold">
              Founded at the foot of North Africa's highest peak, Herbes Jabal Toubkal began with a simple vision: to preserve and share the extraordinary aromatic biodiversity of Morocco. 
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed font-serif font-semibold">
              Our journey takes us through remote mountain villages and hidden valleys, where we work hand-in-hand with local harvesters who have mastered the art of ecological gathering over generations.
            </p>
            <div className="flex gap-10 pt-6">
                <div>
                    <span className="block text-4xl font-serif italic text-primary">100%</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Organic Sourcing</span>
                </div>
                <div>
                    <span className="block text-4xl font-serif italic text-primary">25+</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Spices & Herbs</span>
                </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl skew-y-1"
          >
             <Image 
                src="https://images.unsplash.com/photo-1596733430284-f3da2b8b9392"
                alt="Moroccan Spices Market"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
             />
          </motion.div>
        </div>
      </section>

      {/* Ethical harvesting */}
      <section className="bg-secondary/10 py-32">
        <div className="container mx-auto px-6 text-center space-y-20">
            <div className="max-w-3xl mx-auto space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Our Values</span>
                <h2 className="text-4xl md:text-5xl font-serif italic text-center">Harvested with Heart</h2>
                <p className="text-lg text-foreground/80 font-serif font-semibold">We believe that true quality comes from a deep respect for the land and the people who nurture it.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                    {
                        title: "Ethical Sourcing",
                        desc: "Direct partnerships with mountain cooperatives ensuring fair wages and sustainable community growth.",
                        icon: "🤝"
                    },
                    {
                        title: "Sun-Dried Logic",
                        desc: "Preserving the natural oils and vibrant aromas through traditional Atlas sun-drying techniques.",
                        icon: "☀️"
                    },
                    {
                        title: "Carbon Conscious",
                        desc: "Small-batch processing that minimizes our footprint while maximizing flavor integrity.",
                        icon: "🌿"
                    }
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="p-12 bg-white rounded-[2.5rem] border border-secondary shadow-sm hover:shadow-xl transition-all group"
                    >
                        <div className="text-5xl mb-8 transform group-hover:scale-110 transition-transform">{item.icon}</div>
                        <h3 className="text-2xl font-serif italic mb-4">{item.title}</h3>
                        <p className="text-foreground/80 leading-relaxed font-serif font-medium">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-32 container mx-auto px-6">
        <div className="bg-primary rounded-[4rem] p-16 md:p-24 text-center text-white space-y-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 space-y-8"
            >
                <h2 className="text-4xl md:text-6xl font-serif italic">Bring the Atlas to Your Table</h2>
                <p className="max-w-xl mx-auto text-white/80 text-lg font-serif">Experience the authentic flavors of Morocco with our premium collection of hand-selected herbs and spices.</p>
                <div className="pt-8">
                    <a href="/products" className="inline-block bg-white text-primary px-12 py-5 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all hover:shadow-2xl active:scale-95">
                        Explore Collection
                    </a>
                </div>
            </motion.div>
        </div>
      </section>
    </div>
  );
}
