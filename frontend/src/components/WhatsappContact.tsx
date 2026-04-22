"use client";

import { useState, useEffect } from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

export default function WhatsappContact() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleChat = () => setIsOpen(!isOpen);

    // Herbes Jabal Toubkal Brand Color
    const themeColor = "#C0560D"; // Site Primary Spice Color

    const t = {
        title: "Support Herbes Jabal Toubkal",
        status: "En ligne",
        description: "Bonjour ! Comment pouvons-nous vous aider aujourd'hui ?",
        role: "Service Client",
        tooltip_title: "Besoin d'aide ?",
        tooltip_sub: "Discutez avec nous sur WhatsApp"
    };

    if (!mounted) return null;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleChat}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-24 md:bottom-28 right-4 md:right-8 z-50 w-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    >
                        <div className="p-6 text-foreground" style={{ background: `linear-gradient(135deg, ${themeColor} 0%, #8B3D08 100%)` }}>
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                                    <FaWhatsapp size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{t.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-xs text-foreground/80 font-bold">{t.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <p className="text-slate-700 text-sm leading-relaxed font-serif italic font-medium">{t.description}</p>
                            <a
                                href="https://wa.me/+212607790956"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-100 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-foreground font-bold text-lg shadow-lg font-serif italic" style={{ backgroundColor: themeColor }}>
                                        JT
                                    </div>
                                    <div>
                                        <span className="block font-bold text-slate-900">Herbes Jabal Toubkal</span>
                                        <span className="text-xs text-slate-600 font-bold uppercase tracking-widest">{t.role}</span>
                                    </div>
                                </div>
                                <FaWhatsapp size={24} style={{ color: themeColor }} className="group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-8 right-8 z-50">
                <motion.button
                    onClick={toggleChat}
                    aria-label={isOpen ? "Fermer le support WhatsApp" : "Ouvrir le support WhatsApp"}
                    title={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
                    className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-foreground overflow-hidden cursor-pointer"
                    style={{ background: isOpen ? '#ef4444' : `linear-gradient(135deg, ${themeColor} 0%, #8B3D08 100%)` }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ rotate: isOpen ? 0 : [0, -5, 5, -5, 0] }}
                    transition={{ rotate: { duration: 2, repeat: isOpen ? 0 : Infinity, repeatDelay: 3 } }}
                >
                    {isOpen ? <FaTimes size={28} /> : <FaWhatsapp size={28} />}
                </motion.button>
            </div>

            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        className="fixed bottom-10 right-20 md:right-24 z-40 bg-white/90 backdrop-blur-md py-2 px-4 rounded-xl shadow-xl border border-gray-100 hidden md:block"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="text-industrial-dark font-black uppercase tracking-widest text-[10px] text-primary">{t.tooltip_title}</div>
                        <div className="text-slate-500 text-[10px] font-bold">{t.tooltip_sub}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
