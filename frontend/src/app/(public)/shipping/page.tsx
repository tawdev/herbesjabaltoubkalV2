"use client";

import { motion } from "framer-motion";

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-6 py-32 max-w-4xl space-y-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Service</span>
        <h1 className="text-5xl italic">Shipping & Delivery</h1>
        <p className="text-xl text-foreground/60 leading-relaxed italic font-serif">Everything you need to know about how we deliver our Atlas botanical treasures to your doorstep.</p>
      </motion.div>

      <div className="grid gap-12">
        <section className="space-y-6">
            <h2 className="text-2xl italic text-primary">Domestic Shipping (Morocco)</h2>
            <div className="prose prose-slate max-w-none text-foreground/70 leading-relaxed space-y-4">
                <p>We provide nationwide delivery through AMANA and local courier services. Our goal is to ensure your fresh spices and herbs arrive in perfect condition.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Processing Time:</strong> Orders are prepared and shipped within 1-2 business days.</li>
                    <li><strong>Delivery Time:</strong> 2-4 business days depending on your location.</li>
                    <li><strong>Shipping Rates:</strong> Flat rate of 45 MAD for all national orders. Free delivery for orders over 500 MAD.</li>
                </ul>
            </div>
        </section>

        <section className="space-y-6 p-10 bg-secondary/10 rounded-[2.5rem] border border-secondary">
             <h2 className="text-2xl italic">Need Help?</h2>
             <p className="text-foreground/70">If you have any questions about your delivery or need to track an order, please contact our support team on WhatsApp or via email.</p>
             <div className="pt-4">
                <a href="/contact" className="text-primary font-black uppercase tracking-widest text-sm hover:underline">Contact Support</a>
             </div>
        </section>
      </div>
    </div>
  );
}
