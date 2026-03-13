"use client";

import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3001/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
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
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
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
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center p-2 border shadow-sm">
                        {/* Placeholder for small image */}
                        🌿
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
                      <button className="text-blue-500 hover:text-blue-700 font-bold text-xs">Edit</button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs"
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
          <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-12 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-8">{editingProduct ? 'Edit Product' : 'Create New Spice Entry'}</h2>
            <div className="grid grid-cols-2 gap-6 mb-10 text-xs text-foreground/40 font-bold uppercase tracking-widest text-center py-10 border-2 border-dashed rounded-3xl">
               Product Form Implementation Placeholder <br />
               (Integrating NestJS CRUD Endpoints)
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-full border border-secondary px-8 py-4 font-bold hover:bg-secondary/10 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
