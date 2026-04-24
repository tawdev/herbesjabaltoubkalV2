"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userData = urlParams.get('user');
    const redirectTo = urlParams.get('redirect') || undefined;

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        login(token, user, redirectTo);
        // Clear query params
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error("Failed to parse user data from Google", e);
      }
    }
  }, [login]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect') || undefined;
        login(data.access_token, data.user, redirectTo);
      } else {
        const errData = await res.json();
        setError(errData.message || "Identification infructueuse. Veuillez vérifier vos secrets.");
      }
    } catch (err) {
      setError("Les divinités de la montagne sont temporairement inaccessibles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FDFBF7]">
      {/* Visual Side */}
      <div className="relative hidden lg:block overflow-hidden">
        <Image 
          src="/images/auth-bg.png" 
          alt="Moroccan Spice Heritage" 
          fill 
          className="object-cover scale-105 hover:scale-110 transition-transform duration-[10s]"
          priority
        />
        <div className="absolute inset-0 bg-[#C5A059]/10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#FDFBF7]" />
        
        <div className="absolute bottom-20 left-20 max-w-md">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/80 mb-4 block">Héritage du Toubkal</span>
                <h2 className="text-5xl font-serif text-white leading-tight uppercase mb-6">Le Rituel <br /><span className="italic">Commence Ici</span></h2>
                <p className="text-white/60 font-serif italic text-lg leading-relaxed">
                  "Chaque grain possède une âme, chaque parfum un souvenir. Rejoignez le cercle des initiés."
                </p>
            </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8 md:p-20 relative">
        <div className="absolute top-10 right-10">
             <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] hover:text-black transition-colors flex items-center gap-3 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
                Quitter l'Antre
             </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-16 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-serif text-black uppercase tracking-tight mb-4">Connexion</h1>
            <p className="text-sm text-black/40 font-serif italic">Entrez vos secrets pour accéder à la collection.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
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

            <div className="space-y-8">
              <div className="relative">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-2 block">Identité (Email)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-[#C5A059]/20 py-4 text-sm text-black focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-black/5"
                  placeholder="name@essence.com"
                />
              </div>

              <div className="relative">
                 <div className="flex items-center justify-between mb-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C5A059] block">Code Secret</label>
                    <button type="button" className="text-[8px] font-bold uppercase tracking-widest text-[#C5A059]/50 hover:text-[#C5A059] transition-colors">Oublié ?</button>
                 </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-[#C5A059]/20 py-4 text-sm text-black focus:outline-none focus:border-[#C5A059] transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute bottom-4 right-0 text-[#C5A059]/40 hover:text-[#C5A059] transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
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
                  S'identifier
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </>
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-[#FDFBF7] px-4 text-black/20">Ou utiliser</span></div>
            </div>

            <button
              type="button"
              onClick={() => {
                const urlParams = new URLSearchParams(window.location.search);
                const redirectTo = urlParams.get('redirect');
                let googleUrl = `${API_URL}/auth/google`;
                if (redirectTo) {
                  googleUrl += `?state=${encodeURIComponent(redirectTo)}`;
                }
                window.location.href = googleUrl;
              }}
              className="w-full border border-black/10 py-5 text-[11px] font-bold uppercase tracking-[0.4em] text-black hover:bg-black hover:text-[#C5A059] transition-all flex items-center justify-center gap-4 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              S'identifier avec Google
            </button>
          </form>

          <div className="mt-16 text-center lg:text-left">
            <p className="text-[11px] text-black/30 font-bold uppercase tracking-widest leading-loose">
              Nouveau parmi nous ? <br />
              <Link href="/register" className="text-[#C5A059] hover:text-black transition-colors underline underline-offset-4 decoration-[#C5A059]/20 mt-2 inline-block">
                Forger une nouvelle alliance
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
