"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function LuxuryBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 100 };
  const moveX = useSpring(mouseX, springConfig);
  const moveY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) / 25;
      const y = (clientY - window.innerHeight / 2) / 25;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none opacity-20 dark:opacity-40 transition-opacity duration-1000">
      {/* Deepest Mountain Layer */}
      <motion.div 
        className="absolute bottom-0 left-[-10%] w-[120%] h-[60%] flex items-end justify-center"
        style={{ x: moveX, y: moveY }}
      >
        <svg viewBox="0 0 1000 300" className="w-full text-foreground/5 fill-current">
          <path d="M0,300 L200,50 L450,180 L700,20 L1000,300 Z" />
        </svg>
      </motion.div>

      {/* Mid Mountain Layer */}
      <motion.div 
        className="absolute bottom-0 left-[-20%] w-[140%] h-[50%] flex items-end justify-center"
        style={{ 
          x: useSpring(mouseX, { damping: 40, stiffness: 80 }), 
          y: useSpring(mouseY, { damping: 40, stiffness: 80 }) 
        }}
      >
        <svg viewBox="0 0 1000 300" className="w-full text-[#C5A059]/5 fill-current">
          <path d="M0,300 L150,150 L350,250 L600,100 L850,220 L1000,300 Z" />
        </svg>
      </motion.div>

      {/* Grain / Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
    </div>
  );
}
