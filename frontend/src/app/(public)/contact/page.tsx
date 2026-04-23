"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { API_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ContactPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    // WhatsApp Redirection
    const whatsappNumber = "+212607790956";
    const whatsappMessage = `*New Contact Request*%0A%0A*Full Name:* ${data.name}%0A*Email Address:* ${data.email}%0A*Your Message:* ${data.message}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${whatsappMessage}`;

    try {
      // Still send to backend for records
      const res = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        form.reset();
        // Redirect to WhatsApp in a new tab
        window.open(whatsappUrl, "_blank");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header Area */}
      <section className="py-24 border-b border-[#C5A059]/10">
        <div className="container mx-auto px-6 lg:px-12 text-center space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#C5A059] font-bold uppercase tracking-[0.5em] text-[10px]"
          >
            The Oracle
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-[#C5A059] uppercase tracking-tight"
          >
            Connect <span className="text-foreground/20 italic">with Us</span>
          </motion.h1>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-12 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          {/* Info */}
          <div className="space-y-16">
            <div className="space-y-8">
              <h2 className="text-4xl font-serif text-[#C5A059] uppercase tracking-widest italic leading-tight">Visit our botanical <br />sanctuary</h2>
              <p className="text-foreground/40 text-lg leading-relaxed font-serif italic">
                Our workshop is located in the heart of Marrakech, where we process 
                only the finest harvests from the High Atlas cooperatives.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
              <div className="space-y-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/20">The Scroll</span>
                <p className="text-[#C5A059] font-serif italic text-lg truncate">contact@herbesjabaltoubkal.com</p>
              </div>
              <div className="space-y-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/20">The Voice</span>
                <p className="text-[#C5A059] font-serif italic text-lg">+212 524308038</p>
              </div>
              <div className="space-y-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/20">The Sanctuary</span>
                <p className="text-foreground/70 font-serif italic leading-relaxed text-sm">Marrakech, Morocco <br />High Atlas Support Office</p>
              </div>
              <div className="space-y-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/20">Ritual Hours</span>
                <p className="text-foreground/70 font-serif italic text-sm">Mon - Sat: 09:00 — 18:00</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card border border-[#C5A059]/10 p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center gap-10"
              >
                <div className="w-24 h-24 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0c.815 0 1.583.315 2.181.888m-4.362 0C10.417 3.315 11.185 3 12 3" />
                    </svg>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-serif text-[#C5A059] uppercase tracking-widest">Message Received</h3>
                  <p className="text-foreground/40 font-serif italic">Your inquiry has been inscribed in our records. We shall respond soon.</p>
                </div>
                <button 
                  onClick={() => setSuccess(false)}
                  className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] hover:text-foreground transition-all underline underline-offset-8 decoration-[#C5A059]/30"
                >
                  Send another inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="space-y-4">
                  <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-foreground/20 ml-1">Full Name</label>
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    defaultValue={user?.username || ""}
                    className="w-full bg-transparent border-b border-[#C5A059]/20 py-4 text-[#C5A059] focus:border-[#C5A059] outline-none transition-all font-serif italic text-lg"
                    placeholder="Inscribe your name"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-foreground/20 ml-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    defaultValue={user?.email || ""}
                    className="w-full bg-transparent border-b border-[#C5A059]/20 py-4 text-[#C5A059] focus:border-[#C5A059] outline-none transition-all font-serif italic text-lg"
                    placeholder="Your digital scroll"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-foreground/20 ml-1">Your Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-transparent border-b border-[#C5A059]/20 py-4 text-[#C5A059] focus:border-[#C5A059] outline-none transition-all font-serif italic text-lg resize-none"
                    placeholder="What Wisdom do you seek?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full border border-[#C5A059] bg-[#C5A059] py-6 text-[11px] font-bold uppercase tracking-[0.5em] text-black transition-all hover:bg-black hover:text-[#C5A059] disabled:opacity-50"
                >
                  {loading ? "SENDING..." : "SEND ENQUIRY"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
