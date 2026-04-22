"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeEclipse() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [targetTheme, setTargetTheme] = useState<string | null>(null);

  useEffect(() => {
    const handleThemeEvent = (e: CustomEvent) => {
      const { x, y, theme: nextTheme } = e.detail;
      setClickPos({ x, y });
      setTargetTheme(nextTheme);
      setIsTransitioning(true);

      // Start the actual theme change halfway through the animation
      setTimeout(() => {
        setTheme(nextTheme);
      }, 400);

      // End transition state
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    };

    window.addEventListener("theme-eclipse" as any, handleThemeEvent);
    return () => window.removeEventListener("theme-eclipse" as any, handleThemeEvent);
  }, [setTheme]);

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          initial={{ 
            clipPath: `circle(0% at ${clickPos.x}px ${clickPos.y}px)`,
          }}
          animate={{ 
            clipPath: `circle(150% at ${clickPos.x}px ${clickPos.y}px)`,
          }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.5, ease: "easeOut" }
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.4, 0, 0.2, 1] // Noble, smooth ease
          }}
          className="fixed inset-0 pointer-events-none z-[9999]"
          style={{
            backgroundColor: targetTheme === "light" ? "hsl(37, 67%, 98%)" : "hsl(240, 10%, 3.9%)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
