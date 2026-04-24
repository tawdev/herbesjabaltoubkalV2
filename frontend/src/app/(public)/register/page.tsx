"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleaned = value.replace(/[^\d+]/g, "");
      setFormData({ ...formData, [name]: cleaned });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les secrets ne correspondent pas. Veuillez les harmoniser.");
      setLoading(false);
      return;
    }

    // Phone validation (Moroccan format)
    const phoneRegex = /^(?:\+212|0)([567]\d{8})$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setError("Le lien téléphonique est invalide. Utilisez le format +212 ou 06/07.");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const regRes = await fetch(`${API_URL}/auth/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (regRes.ok) {
        const logRes = await fetch(`${API_URL}/auth/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });

        if (logRes.ok) {
          const data = await logRes.json();
          login(data.access_token, data.user);
        } else {
          setError("Compte créé, mais l'accès automatique a échoué. Veuillez vous connecter manuellement.");
        }
      } else {
        const errData = await regRes.json();
        const msg = Array.isArray(errData.message) ? errData.message[0] : errData.message;
        setError(msg || "Impossible de forger cet accès. Vérifiez les informations.");
      }
    } catch (err) {
      setError("Un obstacle empêche la création de votre lien avec la montagne.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FDFBF7]">
      {/* Visual Side */}
      <div className="relative hidden lg:block overflow-hidden order-last">
        <Image 
          src="/images/auth-bg.png" 
          alt="Moroccan Spice Heritage" 
          fill 
          className="object-cover scale-105 hover:scale-110 transition-transform duration-[10s]"
          priority
        />
        <div className="absolute inset-0 bg-[#C5A059]/10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#FDFBF7]" />
        
        <div className="absolute bottom-20 right-20 max-w-md text-right">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/80 mb-4 block">Héritage du Toubkal</span>
                <h2 className="text-5xl font-serif text-white leading-tight uppercase mb-6">Forger une <br /><span className="italic">Alliance</span></h2>
                <p className="text-white/60 font-serif italic text-lg leading-relaxed">
                  "Rejoignez notre cercle et accédez aux secrets les plus profonds de l'Atlas."
                </p>
            </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8 md:p-20 relative">
        <div className="absolute top-10 left-10 lg:left-20">
             <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] hover:text-black transition-colors flex items-center gap-3 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
                Quitter l'Antre
             </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl"
        >
          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-serif text-black uppercase tracking-tight mb-4">Inscription</h1>
            <p className="text-sm text-black/40 font-serif italic">Prenez place au sein de notre communauté d'initiés.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-50 border-l-2 border-red-500 text-red-800 text-xs font-serif italic"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div className="relative">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-2 block">Nom Complet</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent border-b border-[#C5A059]/20 py-3 text-sm text-black focus:outline-none focus:border-[#C5A059] transition-all"
                        />
                    </div>
                    <div className="relative">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-2 block">Adresse Email</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent border-b border-[#C5A059]/20 py-3 text-sm text-black focus:outline-none focus:border-[#C5A059] transition-all"
                        />
                    </div>
                    <div className="relative">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-2 block">Secret (Mot de passe)</label>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent border-b border-[#C5A059]/20 py-3 text-sm text-black focus:outline-none focus:border-[#C5A059] transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute bottom-3 right-0 text-[#C5A059]/40 hover:text-[#C5A059] transition-colors"
                        >
                          {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    </div>
                    <div className="relative">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-2 block">Confirmation du Secret</label>
                        <input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent border-b border-[#C5A059]/20 py-3 text-sm text-black focus:outline-none focus:border-[#C5A059] transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute bottom-3 right-0 text-[#C5A059]/40 hover:text-[#C5A059] transition-colors"
                        >
                          {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="relative">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-2 block">Téléphone (Optionnel)</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            pattern="^(?:\+212|0)([567]\d{8})$"
                            title="Format: +212... ou 06... / 07... / 05..."
                            className="w-full bg-transparent border-b border-[#C5A059]/20 py-3 text-sm text-black focus:outline-none focus:border-[#C5A059] transition-all"
                        />
                    </div>
                    <div className="relative">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-2 block">Demeure (Adresse)</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-transparent border border-[#C5A059]/20 p-4 text-sm text-black focus:outline-none focus:border-[#C5A059] transition-all resize-none"
                            placeholder="Pour vos futures livraisons..."
                        />
                    </div>
                </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black py-5 text-[11px] font-bold uppercase tracking-[0.4em] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all shadow-xl shadow-black/5 flex items-center justify-center gap-4 group"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Initialiser le Lien
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center lg:text-left">
            <p className="text-[11px] text-black/30 font-bold uppercase tracking-widest leading-loose">
              Déjà membre du cercle ? <br />
              <Link href="/login" className="text-[#C5A059] hover:text-black transition-colors underline underline-offset-4 decoration-[#C5A059]/20 mt-2 inline-block">
                S'identifier
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
