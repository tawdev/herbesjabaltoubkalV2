"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 font-serif relative overflow-hidden">
      {/* Mystical Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C5A059]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#C5A059]/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md bg-card border border-[#C5A059]/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] p-12 relative group">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#C5A059] opacity-40" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#C5A059] opacity-40" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#C5A059] opacity-40" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#C5A059] opacity-40" />

        <div className="flex flex-col items-center gap-6 text-center mb-12">
           <div className="relative">
             <span className="text-4xl font-serif font-bold text-[#C5A059] tracking-[0.2em] uppercase">Sanctum</span>
             <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent mt-2" />
           </div>
           <p className="text-[9px] text-foreground/30 font-black uppercase tracking-[0.4em]">Administrative Access Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]/60 ml-1">Identity</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-[#C5A059]/10 rounded-none px-6 py-5 outline-none focus:border-[#C5A059] transition-all text-sm font-serif text-foreground tracking-widest placeholder:text-foreground/5"
              placeholder="Username"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]/60 ml-1">Codex</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-[#C5A059]/10 rounded-none px-6 py-5 outline-none focus:border-[#C5A059] transition-all text-sm font-serif text-foreground tracking-widest placeholder:text-foreground/5"
              placeholder="Password"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-950/20 border border-red-900/40 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] text-center animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C5A059] py-6 text-black text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1 relative group overflow-hidden"
          >
            <span className="relative z-10">{loading ? "Synchronizing..." : "Enter the Sanctum"}</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </form>

        <div className="mt-12 flex flex-col items-center gap-4">
           <div className="w-8 h-px bg-white/5" />
           <p className="text-center text-[8px] text-foreground/20 font-black uppercase tracking-[0.5em]">
              Ancestral Guard System v2.0
           </p>
        </div>
      </div>
    </div>
  );
}
