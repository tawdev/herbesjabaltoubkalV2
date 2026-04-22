"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full bg-border animate-pulse" />;
  }

  const toggleTheme = (e: React.MouseEvent) => {
    const nextTheme = theme === "light" ? "dark" : "light";
    
    // Dispatch custom event for the Eclipse animation
    const event = new CustomEvent("theme-eclipse", {
      detail: {
        x: e.clientX,
        y: e.clientY,
        theme: nextTheme
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-[#C5A059]/30 bg-card text-[#C5A059] hover:bg-[#C5A059]/10 transition-all flex items-center justify-center w-10 h-10 focus:outline-none relative group"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 rounded-full border border-[#C5A059]/10 scale-110 group-hover:scale-125 transition-transform duration-500" />
      {theme === "light" ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in zoom-in duration-500">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in zoom-in duration-500">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )}
    </button>
  );
}
