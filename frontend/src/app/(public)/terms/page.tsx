"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-6 py-32 max-w-4xl space-y-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Legal</span>
        <h1 className="text-5xl italic">Terms of Service</h1>
        <p className="text-xl text-foreground/60 leading-relaxed italic font-serif">By using our services, you agree to the following terms and conditions.</p>
      </motion.div>

      <div className="prose prose-slate max-w-none text-foreground/70 leading-relaxed space-y-10">
        <section className="space-y-4">
            <h2 className="text-2xl italic text-primary">1. Product Information</h2>
            <p>Our products are natural botanical items. While we strive for consistency, natural variations in color and texture are normal and expected.</p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl italic text-primary">2. Orders and Payment</h2>
            <p>All orders are subject to acceptance and availability. Prices are in MAD and include applicable taxes. Payment is currently handled via cash on delivery (Poste).</p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl italic text-primary">3. Returns and Refunds</h2>
            <p>Due to the consumable nature of our products, returns are only accepted for damaged items or shipping errors. Please inspect your order upon delivery.</p>
        </section>
      </div>
    </div>
  );
}
