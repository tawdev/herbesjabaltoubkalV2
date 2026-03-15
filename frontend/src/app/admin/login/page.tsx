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
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 px-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-12 border border-secondary/50">
        <div className="flex flex-col items-center gap-4 text-center mb-10">
          <span className="text-4xl font-bold text-primary italic font-serif">Jabal Toubkal</span>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
            <p className="text-[10px] text-foreground/40 font-black uppercase tracking-widest">High Atlas Harvest Management</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/70 ml-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border-secondary/50 bg-secondary/10 px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
              placeholder="admin"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/70 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border-secondary/50 bg-secondary/10 px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-foreground/40 font-medium">
          Protected Area • Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
