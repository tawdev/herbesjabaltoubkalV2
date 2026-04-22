"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";
import { getBlogImage } from "@/lib/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaFeatherPointed, FaImage, FaCircleExclamation, FaFileContract, FaCircleCheck } from "react-icons/fa6";

interface BlogFormProps {
  initialData?: any;
  mode: "create" | "edit";
}

export default function BlogForm({ initialData, mode }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.image ? getBlogImage(initialData.image) : null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const token = localStorage.getItem("token");

    if (!token) {
      alert('Session expired. Please re-authenticate.');
      setLoading(false);
      return;
    }

    let imageName = initialData?.image || null;

    if (selectedFile) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        
        const uploadRes = await fetch(`${API_URL}/uploads/blog`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: uploadFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageName = uploadData.filename;
        }
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }

    const data = {
      title: String(formData.get("title") || ""),
      title_ar: String(formData.get("title_ar") || ""),
      excerpt: String(formData.get("excerpt") || ""),
      excerpt_ar: String(formData.get("excerpt_ar") || ""),
      content: String(formData.get("content") || ""),
      content_ar: String(formData.get("content_ar") || ""),
      image: imageName,
    };

    try {
      const url = mode === "create" 
        ? `${API_URL}/blogs` 
        : `${API_URL}/blogs/${initialData.id}`;
      
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/blogs");
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to save blog:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-16 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Editorial Section */}
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-10">
             <div className="flex items-center gap-4 border-b border-[#C5A059]/10 pb-4">
                <FaFeatherPointed size={16} className="text-[#C5A059]/40" />
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]">Latin Narrative (EN)</h3>
             </div>
             
             <div className="space-y-4">
               <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]/50">Main Title</label>
               <input
                 name="title"
                 defaultValue={initialData?.title}
                 required
                 placeholder="The Essence of Ancestral Trade..."
                 className="w-full bg-background border-b border-[#C5A059]/20 p-6 text-3xl font-serif text-foreground focus:border-[#C5A059] outline-none transition-all placeholder:text-foreground/5 rounded-sm"
               />
             </div>

             <div className="space-y-4">
               <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]/50">The Prologue (Short Excerpt)</label>
               <textarea
                 name="excerpt"
                 defaultValue={initialData?.excerpt}
                 required
                 rows={3}
                 placeholder="A brief summary for the archival cards..."
                 className="w-full bg-background border border-[#C5A059]/10 p-8 text-base text-foreground/60 font-serif italic focus:border-[#C5A059] outline-none transition-all resize-none placeholder:text-foreground/5 rounded-sm leading-relaxed"
               />
             </div>
          </div>

          <div className="space-y-10">
             <div className="flex items-center justify-end gap-4 border-b border-[#C5A059]/10 pb-4">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]">النص العربي (AR)</h3>
                <FaFeatherPointed size={16} className="text-[#C5A059]/40" />
             </div>

             <div className="space-y-4 text-right">
               <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]/50">العنوان الرئيسي</label>
               <input
                 name="title_ar"
                 defaultValue={initialData?.title_ar}
                 required
                 dir="rtl"
                 placeholder="عنوان المقال الروحي..."
                 className="w-full bg-background border-b border-[#C5A059]/20 p-6 text-4xl font-serif text-[#C5A059] text-right focus:border-[#C5A059] outline-none transition-all placeholder:text-foreground/5 font-arabic rounded-sm"
               />
             </div>

             <div className="space-y-4 text-right">
               <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]/50">المقدمة (ملخص)</label>
               <textarea
                 name="excerpt_ar"
                 defaultValue={initialData?.excerpt_ar}
                 required
                 dir="rtl"
                 rows={3}
                 placeholder="ملخص موجز للمقال باللغة العربية..."
                 className="w-full bg-background border border-[#C5A059]/10 p-8 text-xl text-foreground/60 font-serif italic text-right focus:border-[#C5A059] outline-none transition-all resize-none placeholder:text-foreground/5 font-arabic rounded-sm leading-relaxed"
               />
             </div>
          </div>
        </div>

        {/* Media & Meta Section */}
        <div className="lg:col-span-4 space-y-10">
           <div className="flex items-center gap-4 border-b border-[#C5A059]/10 pb-4">
              <FaImage size={16} className="text-[#C5A059]/40" />
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]">Visual Essence</h3>
           </div>

           <div className="space-y-6">
              <div className="relative aspect-[4/5] bg-black/40 border-2 border-dashed border-[#C5A059]/10 flex items-center justify-center group cursor-pointer overflow-hidden rounded-sm hover:border-[#C5A059]/40 transition-all shadow-2xl">
                {previewImage ? (
                  <Image src={previewImage} alt="Preview" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" unoptimized />
                ) : (
                  <div className="flex flex-col items-center gap-6 text-foreground/10 group-hover:text-[#C5A059]/30 transition-colors px-10 text-center">
                    <FaImage size={48} strokeWidth={1} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Transmit Visual Cover</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="absolute inset-0 border-[30px] border-black/40 pointer-events-none opacity-60 group-hover:opacity-20 transition-opacity" />
              </div>

              <div className="bg-card/50 border border-[#C5A059]/10 p-6 rounded-sm space-y-4">
                 <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#C5A059]/50">
                    <FaCircleExclamation size={14} />
                    Publication Tip
                 </div>
                 <p className="text-[11px] text-foreground/40 font-serif italic leading-relaxed">
                   High-resolution portraits (4:5) are recommended for a majestic display in the Grimoire Chronicles.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-16 border-t border-[#C5A059]/10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
             <FaFileContract size={16} className="text-[#C5A059]/40" />
             <label className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]">Detailed Chronicle (EN)</label>
          </div>
          <textarea
            name="content"
            defaultValue={initialData?.content}
            required
            rows={15}
            placeholder="Document the deep sequence of the ritual..."
            className="w-full bg-black/20 border border-[#C5A059]/10 p-10 text-lg leading-relaxed text-foreground/80 font-serif focus:border-[#C5A059] outline-none transition-all rounded-sm resize-none custom-scrollbar"
          />
        </div>

        <div className="space-y-6 text-right">
          <div className="flex items-center justify-end gap-4 mb-2">
             <label className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]">التفاصيل الروحية (AR)</label>
             <FaFileContract size={16} className="text-[#C5A059]/40" />
          </div>
          <textarea
            name="content_ar"
            defaultValue={initialData?.content_ar}
            required
            dir="rtl"
            rows={15}
            placeholder="اكتب تفاصيل القصة هنا بكل عمق..."
            className="w-full bg-black/20 border border-[#C5A059]/10 p-10 text-2xl leading-relaxed text-[#C5A059]/80 font-serif focus:border-[#C5A059] outline-none transition-all rounded-sm font-arabic resize-none custom-scrollbar"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-20 flex flex-col md:flex-row gap-10 border-t border-[#C5A059]/20">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#C5A059] text-black px-16 py-8 text-[11px] font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-white hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-6 rounded-sm font-bold"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : <FaCircleCheck size={18} />}
          {loading ? "Transforming..." : mode === "create" ? "Seal & Publish Chronicle" : "Re-Seal Ritual Knowledge"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="md:w-1/3 py-8 border border-[#C5A059]/20 text-[#C5A059]/40 text-[11px] font-black uppercase tracking-[0.5em] hover:text-[#C5A059] hover:bg-[#C5A059]/5 transition-all rounded-sm"
        >
          Dissolve Changes
        </button>
      </div>
    </form>
  );
}
