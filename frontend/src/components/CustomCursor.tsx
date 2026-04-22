"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isImage, setIsImage] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" || 
        target.tagName === "BUTTON" || 
        target.tagName === "A"
      );
      
      setIsImage(
        target.tagName === "IMG" || 
        target.closest('.group') !== null
      );
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-[#C5A059] rounded-full pointer-events-none z-[9999] mix-blend-difference md:block hidden"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
          backgroundColor: isPointer ? "rgba(197, 160, 89, 0.2)" : "rgba(197, 160, 89, 0)",
          width: isImage ? 80 : isPointer ? 60 : 40,
          height: isImage ? 80 : isPointer ? 60 : 40,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#C5A059] rounded-full pointer-events-none z-[9999] md:block hidden"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isPointer ? 0 : 1,
        }}
      />
      
      {/* Visual Indicator for Image Zoom/Loupe */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] text-[#C5A059] text-[8px] font-black uppercase tracking-widest md:block hidden"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "20px",
          translateY: "20px",
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isImage ? 1 : 0,
        }}
      >
        {isImage ? "Examine" : ""}
      </motion.div>
    </>
  );
}
