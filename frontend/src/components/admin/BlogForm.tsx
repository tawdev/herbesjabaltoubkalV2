"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";
import { getBlogImage } from "@/lib/images";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
    console.log('[BlogForm] Token present:', !!token, token ? `${token.substring(0, 30)}...` : 'NONE');

    if (!token) {
      alert('Session expirée. Veuillez vous reconnecter sur /admin/login');
      setLoading(false);
      return;
    }

    let imageName = initialData?.image || null;

    // Handle image upload if a new file is selected
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
        } else {
          const uploadError = await uploadRes.text();
          alert(`Image upload failed: ${uploadError}`);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Network error during image upload.");
        setLoading(false);
        return;
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
      } else {
        const errText = await res.text();
        alert(`Failed to save blog: ${errText}`);
      }
    } catch (err) {
      console.error("Failed to save blog:", err);
      alert("Network error while saving the article.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-foreground/40">Article Title (English)</label>
            <input
              name="title"
              defaultValue={initialData?.title}
              required
              placeholder="e.g. The Secrets of Saffron"
              className="w-full bg-secondary/10 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
            />
          </div>

          <div className="space-y-2 text-right">
            <label className="text-sm font-bold uppercase tracking-widest text-foreground/40">عنوان المقال (Arabic)</label>
            <input
              name="title_ar"
              defaultValue={initialData?.title_ar}
              required
              dir="rtl"
              placeholder="مثال: أسرار الزعفران"
              className="w-full bg-secondary/10 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-lg font-serif"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-foreground/40">Short Excerpt (English)</label>
            <textarea
              name="excerpt"
              defaultValue={initialData?.excerpt}
              required
              rows={3}
              placeholder="A brief summary for the card..."
              className="w-full bg-secondary/10 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none transition-all font-medium resize-none"
            />
          </div>

          <div className="space-y-2 text-right">
            <label className="text-sm font-bold uppercase tracking-widest text-foreground/40">ملخص قصير (Arabic)</label>
            <textarea
              name="excerpt_ar"
              defaultValue={initialData?.excerpt_ar}
              required
              dir="rtl"
              rows={3}
              placeholder="ملخص موجز للمقال..."
              className="w-full bg-secondary/10 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none transition-all font-medium resize-none text-lg font-serif"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-foreground/40">Cover Image</label>
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-secondary/10 border-2 border-dashed border-secondary flex items-center justify-center group cursor-pointer">
              {previewImage ? (
                <Image src={previewImage} alt="Preview" fill className="object-cover" unoptimized />
              ) : (
                <div className="flex flex-col items-center gap-2 text-foreground/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  <span className="text-xs font-bold uppercase tracking-widest">Upload Photo</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-foreground/40">Article Content (English)</label>
          <textarea
            name="content"
            defaultValue={initialData?.content}
            required
            rows={12}
            placeholder="Write your story here..."
            className="w-full bg-secondary/10 border-none rounded-2xl px-8 py-6 focus:ring-2 focus:ring-primary outline-none transition-all font-serif text-lg leading-relaxed"
          />
        </div>

        <div className="space-y-2 text-right">
          <label className="text-sm font-bold uppercase tracking-widest text-foreground/40">محتوى المقال (Arabic)</label>
          <textarea
            name="content_ar"
            defaultValue={initialData?.content_ar}
            required
            dir="rtl"
            rows={12}
            placeholder="اكتب قصتك هنا..."
            className="w-full bg-secondary/10 border-none rounded-2xl px-8 py-6 focus:ring-2 focus:ring-primary outline-none transition-all font-serif text-lg leading-relaxed"
          />
        </div>
      </div>

      <div className="pt-6 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : mode === "create" ? "Publish Article" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-12 py-5 rounded-full font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
