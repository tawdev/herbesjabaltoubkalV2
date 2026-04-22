"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";
import { FaPlus, FaTrash, FaGripLines, FaSave, FaImage, FaPrint } from "react-icons/fa";
import { motion, Reorder } from "framer-motion";

interface Block {
  id: string;
  type: 'title' | 'text' | 'ingredients' | 'steps' | 'image';
  content: any;
}

export default function RecipeEditorPage() {
  const [recipeName, setRecipeName] = useState("Le Rituel du Thé Royal");
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'title', content: 'Infusion au Safran de Taliouine' },
    { id: '2', type: 'text', content: 'Une recette ancestrale pour apaiser l\'esprit et réchauffer le cœur.' },
    { id: '3', type: 'ingredients', content: ['3-4 filaments de Safran', '1 cuillère à café de Miel de Thym', '250ml d\'eau de source'] },
    { id: '4', type: 'steps', content: ['Chauffer l\'eau sans atteindre l\'ébullition.', 'Infuser le safran pendant 5 minutes.', 'Ajouter le miel et déguster en silence.'] },
  ]);
  const [saving, setSaving] = useState(false);

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'ingredients' || type === 'steps' ? [''] : '',
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, newContent: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert("Recette sauvegardée avec succès dans le Grimoire !");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16 pb-32">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Editor Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#C5A059]/20 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="h-8 w-[2px] bg-[#C5A059]" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]/60">Éditeur de Recettes Visuel</h4>
            </div>
            <input 
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              className="text-5xl md:text-6xl font-serif font-bold bg-transparent border-none outline-none text-[#C5A059] placeholder-[#C5A059]/20 w-full"
              placeholder="Titre de la Recette..."
            />
          </div>
          <div className="flex gap-4">
             <button 
               onClick={handleSave}
               disabled={saving}
               className="flex items-center gap-3 px-8 py-4 bg-[#C5A059] text-black text-[11px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all transform hover:-translate-y-1 rounded-sm shadow-xl shadow-[#C5A059]/10"
             >
                <FaSave /> {saving ? "Sauvegarde..." : "Inscrire au Grimoire"}
             </button>
             <button className="flex items-center gap-3 px-8 py-4 border border-[#C5A059]/20 text-[#C5A059] text-[11px] font-black uppercase tracking-widest hover:bg-[#C5A059] hover:text-black transition-all rounded-sm">
                <FaPrint /> Aperçu PDF
             </button>
          </div>
        </header>

        {/* Editor Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Controls Sidebar */}
          <aside className="lg:col-span-1 space-y-8 sticky top-12 h-fit">
             <div className="space-y-6 bg-card border border-[#C5A059]/10 p-8 rounded-sm shadow-sm">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">Ajouter un Élément</h5>
                <div className="grid grid-cols-1 gap-3">
                   {[
                     { label: 'Titre de Section', type: 'title' },
                     { label: 'Paragraphe', type: 'text' },
                     { label: 'Liste Ingrédients', type: 'ingredients' },
                     { label: 'Étapes de Préparation', type: 'steps' },
                     { label: 'Image Editorial', type: 'image' },
                   ].map(item => (
                     <button
                       key={item.type}
                       onClick={() => addBlock(item.type as any)}
                       className="flex items-center gap-4 p-4 border border-transparent bg-background/50 text-left text-[10px] font-black uppercase tracking-widest hover:border-[#C5A059]/40 hover:bg-[#C5A059]/5 hover:translate-x-1 transition-all group rounded-sm"
                     >
                        <div className="w-8 h-8 rounded-full border border-[#C5A059]/20 flex items-center justify-center group-hover:border-[#C5A059]/60 transition-colors">
                           <FaPlus className="text-[10px] text-[#C5A059]/40 group-hover:text-[#C5A059]" />
                        </div>
                        {item.label}
                     </button>
                   ))}
                </div>
             </div>
             
             <div className="p-8 bg-[#C5A059]/5 border border-[#C5A059]/10 rounded-sm">
                <p className="text-[10px] font-serif italic text-[#C5A059]/80 leading-relaxed uppercase tracking-[0.2em]">
                   Conseil de l'Alchimiste : Laissez respirer vos blocs pour une lecture plus spirituelle.
                </p>
             </div>
          </aside>

          {/* Main Editor */}
          <main className="lg:col-span-3 min-h-[600px] border border-dashed border-[#C5A059]/20 rounded-sm p-12 bg-card/30 shadow-inner">
             <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className="space-y-12">
                {blocks.map((block) => (
                  <Reorder.Item 
                    key={block.id} 
                    value={block}
                    className="group relative bg-card border border-[#C5A059]/10 p-10 rounded-sm hover:border-[#C5A059]/40 transition-all shadow-sm hover:shadow-2xl hover:shadow-[#C5A059]/10"
                  >
                     {/* Block Header/Drag Handle */}
                     <div className="absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-all cursor-grab active:cursor-grabbing p-4 text-[#C5A059]">
                        <FaGripLines />
                     </div>

                     <button 
                        onClick={() => removeBlock(block.id)}
                        className="absolute -right-4 -top-4 w-8 h-8 bg-background border border-red-900/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all text-[10px] text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <FaTrash />
                     </button>

                     {/* Block Content Renderers */}
                     {block.type === 'title' && (
                       <input 
                         value={block.content}
                         onChange={(e) => updateBlock(block.id, e.target.value)}
                         className="w-full bg-transparent border-b border-[#C5A059]/10 pb-2 text-2xl font-serif text-[#C5A059] outline-none focus:border-[#C5A059]/60 transition-colors"
                         placeholder="Titre de Section..."
                       />
                     )}

                     {block.type === 'text' && (
                       <textarea 
                         value={block.content}
                         onChange={(e) => updateBlock(block.id, e.target.value)}
                         className="w-full bg-transparent border-none text-lg text-foreground/70 font-serif italic leading-relaxed outline-none resize-none min-h-[100px] placeholder:text-foreground/20"
                         placeholder="Écrivez le savoir ancestral ici..."
                       />
                     )}

                     {(block.type === 'ingredients' || block.type === 'steps') && (
                       <div className="space-y-6">
                         <h6 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]/60">{block.type}</h6>
                         <div className="space-y-3">
                           {block.content.map((item: string, idx: number) => (
                             <div key={idx} className="flex gap-4 group/line items-center">
                                <span className="text-serif text-[#C5A059]/40 w-4 font-bold">{idx + 1}.</span>
                                <input 
                                  value={item}
                                  onChange={(e) => {
                                    const newArr = [...block.content];
                                    newArr[idx] = e.target.value;
                                    updateBlock(block.id, newArr);
                                  }}
                                  className="w-full bg-transparent border-none text-foreground/60 outline-none focus:text-foreground transition-colors py-1"
                                  placeholder={`Élément ${idx + 1}...`}
                                />
                             </div>
                           ))}
                         </div>
                         <button 
                            onClick={() => updateBlock(block.id, [...block.content, ''])}
                            className="text-[9px] font-black uppercase tracking-[0.5em] text-[#C5A059] hover:text-foreground transition-all flex items-center gap-3 mt-4"
                          >
                           <FaPlus size={8} /> Ajouter une ligne
                         </button>
                       </div>
                     )}

                     {block.type === 'image' && (
                       <div className="aspect-[21/9] bg-background border border-[#C5A059]/10 flex flex-col items-center justify-center gap-4 group/img relative overflow-hidden rounded-sm">
                          <FaImage className="text-4xl text-[#C5A059]/10 group-hover/img:text-[#C5A059]/20 transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]/40 group-hover/img:text-[#C5A059] transition-colors">Uploader une Image Éditoriale</span>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                       </div>
                     )}
                  </Reorder.Item>
                ))}
             </Reorder.Group>
             
             {blocks.length === 0 && (
               <div className="h-[400px] flex flex-col items-center justify-center space-y-6 opacity-40">
                  <FaScroll className="text-6xl text-[#C5A059]/20" />
                  <p className="font-serif italic text-foreground/40 text-lg">Votre grimoire est encore vide. Ajoutez un premier bloc.</p>
               </div>
             )}
          </main>
        </div>
      </div>
    </div>

  );
}
