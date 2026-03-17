"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-32 max-w-4xl space-y-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Legal</span>
        <h1 className="text-5xl italic">Privacy Policy</h1>
        <p className="text-xl text-foreground/60 leading-relaxed italic font-serif">At Herbes Jabal Toubkal, we respect your privacy and are committed to protecting your personal data.</p>
      </motion.div>

      <div className="prose prose-slate max-w-none text-foreground/70 leading-relaxed space-y-10">
        <section className="space-y-4">
            <h2 className="text-2xl italic text-primary">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you make a purchase, sign up for our newsletter, or contact our support team. This includes your name, email address, phone number, and shipping address.</p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl italic text-primary">2. How We Use Your Data</h2>
            <p>Your data is used exclusively to process your orders, provide customer support, and improve your shopping experience. We never sell your personal information to third parties.</p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl italic text-primary">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure.</p>
        </section>
      </div>
    </div>
  );
}
