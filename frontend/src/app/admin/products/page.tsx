"use client";

import { useEffect, useState } from "react";
import { getProducts, API_URL } from "@/lib/api";
import { getProductImage } from "@/lib/images";
import Image from "next/image";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const fetchProductsData = async () => {
    try {
      setLoading(true);
      const data = await getProducts({});
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    // We'll use the API_URL from lib/api indirectly by using fetch with same config
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchProductsData();
    } catch (err) {
      console.error(err);
    }
  };

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
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    const token = localStorage.getItem("token");

    let imageName = formData.get("image") as string || "placeholder.jpeg";

    // 1. Handle File Upload if a new file is selected
    if (selectedFile) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        const uploadRes = await fetch(`${API_URL}/uploads/product`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadFormData,
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageName = uploadData.filename;
        } else {
          const errText = await uploadRes.text();
          console.error("Image upload failed:", uploadRes.status, errText);
          alert(`Image upload failed: ${uploadRes.status} ${errText}`);
        }
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }

    const data = {
      name: formData.get("name"),
      name_ar: formData.get("name_ar"),
      price: parseFloat(formData.get("price") as string),
      weight: formData.get("weight"),
      category: formData.get("category"),
      stock: parseInt(formData.get("stock") as string, 10),
      description: formData.get("description"),
      description_ar: formData.get("description_ar"),
      image: imageName,
      promo: formData.get("promo") === "on",
      best_seller: formData.get("best_seller") === "on",
      promo_price: formData.get("promo_price") ? parseFloat(formData.get("promo_price") as string) : null,
    };

    try {
      const url = editingProduct ? `${API_URL}/products/${editingProduct.id}` : `${API_URL}/products`;
      const method = editingProduct ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingProduct(null);
        setPreviewImage(null);
        setSelectedFile(null);
        fetchProductsData();
      } else {
        console.error("Failed to save product:", await res.text());
        alert("Failed to save product. Check console.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving product.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
          <p className="text-foreground/50 font-medium">Organize and update your spice catalog.</p>
        </div>
        <button 
          onClick={() => { 
            setEditingProduct(null); 
            setPreviewImage(null);
            setSelectedFile(null);
            setIsModalOpen(true); 
          }}
          className="rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105"
        >
          Add New Product
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-secondary shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/10 border-b">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Product</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Price</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Stock</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-foreground/30 font-bold animate-pulse">Loading spices...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-foreground/30 font-bold">No products found.</td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-2xl bg-secondary/10 overflow-hidden border shadow-sm">
                        <Image
                          src={getProductImage(product.image, product.name)}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{product.name}</span>
                        <span className="text-[10px] font-bold text-foreground/30 uppercase">{product.weight}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary/50 text-[10px] font-black uppercase text-foreground/60 tracking-widest">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-emerald-600 underline underline-offset-4 decoration-emerald-200">{product.price} MAD</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <span className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                       <span className="font-bold text-sm">{product.stock} Units</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                <button 
                  onClick={() => { 
                    setEditingProduct(product); 
                    setPreviewImage(getProductImage(product.image, product.name));
                    setSelectedFile(null);
                    setIsModalOpen(true); 
                  }}
                  className="text-blue-500 hover:text-blue-700 font-bold text-xs transition-colors"
                >
                  Edit
                </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal Placeholder - In a real app we'd build a full form here */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[2.5rem] p-12 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-8">{editingProduct ? 'Edit Product' : 'Create New Spice Entry'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <label className="flex flex-col gap-2 text-xs font-bold uppercase text-foreground/50">
                  Name (EN)
                  <input name="name" defaultValue={editingProduct?.name} required className="p-3 border rounded-xl text-sm text-foreground normal-case font-medium" />
                </label>
                <label className="flex flex-col gap-2 text-xs font-bold uppercase text-foreground/50">
                  Name (AR)
                  <input name="name_ar" defaultValue={editingProduct?.name_ar} required className="p-3 border rounded-xl text-sm text-foreground normal-case font-medium text-right" dir="rtl" />
                </label>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <label className="flex flex-col gap-2 text-xs font-bold uppercase text-foreground/50">
                  Price (MAD)
                  <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="p-3 border rounded-xl text-sm text-foreground normal-case font-medium" />
                </label>
                <label className="flex flex-col gap-2 text-xs font-bold uppercase text-foreground/50">
                  Stock Units
                  <input name="stock" type="number" defaultValue={editingProduct?.stock ?? 0} required className="p-3 border rounded-xl text-sm text-foreground normal-case font-medium" />
                </label>
                <label className="flex flex-col gap-2 text-xs font-bold uppercase text-foreground/50">
                  Weight (e.g. 100g)
                  <input name="weight" defaultValue={editingProduct?.weight} required className="p-3 border rounded-xl text-sm text-foreground normal-case font-medium" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <label className="flex flex-col gap-2 text-xs font-bold uppercase text-foreground/50">
                  Category
                  <select name="category" defaultValue={editingProduct?.category || "spices"} className="p-3 border rounded-xl text-sm text-foreground normal-case font-medium">
                    <option value="spices">Spices</option>
                    <option value="herbs">Herbs</option>
                    <option value="mixes">Mixes</option>
                    <option value="ground">Ground</option>
                    <option value="whole">Whole</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-xs font-bold uppercase text-foreground/50">
                  Image
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl bg-secondary/10 overflow-hidden border shadow-sm flex-shrink-0">
                      {(previewImage || editingProduct?.image) ? (
                        <Image
                          src={previewImage || getProductImage(editingProduct.image, editingProduct.name)}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground/20 text-xs">No Img</div>
                      )}
                    </div>
                    <label className="flex-1 cursor-pointer rounded-xl border-2 border-dashed border-secondary hover:border-primary/30 transition-colors p-3 text-center">
                      <span className="text-[10px] text-foreground/40 font-black uppercase tracking-widest">
                        {selectedFile ? selectedFile.name : "Click to Upload Image"}
                      </span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    <input type="hidden" name="image" defaultValue={editingProduct?.image} />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <label className="flex items-center gap-3 text-xs font-bold uppercase text-foreground/50">
                  <input type="checkbox" name="promo" defaultChecked={editingProduct?.promo} className="w-5 h-5 accent-primary" />
                  Is on Promo?
                </label>
                <label className="flex flex-col gap-2 text-xs font-bold uppercase text-foreground/50">
                  Promo Price (optional)
                  <input name="promo_price" type="number" step="0.01" defaultValue={editingProduct?.promo_price} className="p-3 border rounded-xl text-sm text-foreground normal-case font-medium" />
                </label>
                <label className="flex items-center gap-3 text-xs font-bold uppercase text-foreground/50">
                  <input type="checkbox" name="best_seller" defaultChecked={editingProduct?.best_seller} className="w-5 h-5 accent-accent" />
                  Best Seller?
                </label>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <label className="flex flex-col gap-2 text-xs font-bold uppercase text-foreground/50">
                  Description (EN)
                  <textarea name="description" rows={3} defaultValue={editingProduct?.description} className="p-3 border rounded-xl text-sm text-foreground normal-case font-medium resize-none" />
                </label>
                <label className="flex flex-col gap-2 text-xs font-bold uppercase text-foreground/50">
                  Description (AR)
                  <textarea name="description_ar" rows={3} defaultValue={editingProduct?.description_ar} className="p-3 border rounded-xl text-sm text-foreground normal-case font-medium text-right resize-none" dir="rtl" />
                </label>
              </div>

              <div className="flex gap-4 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full border border-secondary px-8 py-4 font-bold hover:bg-secondary/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit" 
                  disabled={uploading}
                  className="flex-1 rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                       <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
