"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function ContactPage() {
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-secondary/10 py-24">
        <div className="container mx-auto px-6 lg:px-8 text-center space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[0.4em] text-xs"
          >
            Get In Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight"
          >
            Contact <span className="text-primary italic font-serif">Us</span>
          </motion.h1>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Info */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl italic">Visit our workshop</h2>
              <p className="text-foreground/60 text-lg leading-relaxed font-medium">
                Our main office is located in the heart of Marrakech, where we process 
                only the finest harvests from the High Atlas cooperatives.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Email</span>
                <p className="font-bold">contact@herbesjabaltoubkal.com</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Phone</span>
                <p className="font-bold">+212 524308038</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Address</span>
                <p className="font-bold">Marrakech, Morocco <br />High Atlas Support Office</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Hours</span>
                <p className="font-bold">Mon - Sat: 9AM - 6PM</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-[3rem] p-10 md:p-12 border shadow-xl shadow-secondary/20">
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center gap-6"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Message Sent!</h3>
                  <p className="text-foreground/60 font-medium">Thank you for reaching out. We'll get back to you soon.</p>
                </div>
                <button 
                  onClick={() => setSuccess(false)}
                  className="text-primary font-bold hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Full Name</label>
                  <input
                    name="name"
                    required
                    className="w-full rounded-2xl bg-secondary/10 border-none px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-2xl bg-secondary/10 border-none px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Your Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full rounded-2xl bg-secondary/10 border-none px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-primary py-5 text-lg font-black text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
