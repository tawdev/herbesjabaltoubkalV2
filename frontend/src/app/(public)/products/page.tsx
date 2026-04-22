import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import PriceFilter from "@/components/PriceFilter";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Next.js 16+ requires awaiting searchParams
  const params = await searchParams;
  const products = await getProducts(params);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-32 px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Minimalist Sidebar Filter */}
          <aside className="w-full lg:w-80 flex flex-col gap-16 shrink-0 lg:sticky lg:top-32 lg:self-start">
            <div className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#C5A059]">The Alchemist Shop</h2>
              <p className="text-sm text-foreground/40 font-serif italic leading-relaxed">Curated botanical treasures harvested from the heart of the High Atlas.</p>
            </div>
            
            <div className="space-y-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/20">Collections</h3>
              <div className="flex flex-col gap-2">
                {["Spices", "Herbs", "Mixes", "Ground", "Whole"].map((cat) => {
                  const searchP = new URLSearchParams();
                  Object.entries(params).forEach(([k, v]) => {
                    if (v) searchP.set(k, String(v));
                  });
                  searchP.set("category", cat.toLowerCase());
                  const isActive = params.category === cat.toLowerCase();
                  
                  return (
                    <a
                      key={cat}
                      href={`/products?${searchP.toString()}`}
                      className={`text-[11px] font-bold uppercase tracking-[0.2em] py-3 flex items-center justify-between group transition-all ${isActive ? 'text-[#C5A059]' : 'text-foreground/40 hover:text-[#C5A059]'}`}
                    >
                      {cat}
                      <div className={`h-[1px] bg-[#C5A059] transition-all duration-500 ${isActive ? 'w-8' : 'w-0 group-hover:w-4'}`} />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/20">Price Ritual</h3>
              <div className="px-2">
                <PriceFilter maxPossiblePrice={200} />
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 flex flex-col gap-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-[#C5A059]/10">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-serif text-[#C5A059] uppercase tracking-tight">
                  {params.category ? `${params.category}` : "All Botanicals"}
                </h1>
                <span className="text-[9px] font-bold text-foreground/20 uppercase tracking-[0.3em]">{products.length} Treasures Unveiled</span>
              </div>
              <select className="bg-transparent text-[10px] font-bold uppercase tracking-widest border-none focus:ring-0 outline-none cursor-pointer text-foreground/40 hover:text-[#C5A059] transition-colors appearance-none">
                <option className="bg-background">Latest Arrivals</option>
                <option className="bg-background">Price: Ascending</option>
                <option className="bg-background">Price: Descending</option>
              </select>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-40 border border-[#C5A059]/5 bg-card">
                <div className="w-16 h-16 border border-[#C5A059]/20 rounded-full flex items-center justify-center mb-8">
                    <div className="w-8 h-[1px] bg-[#C5A059] rotate-45" />
                    <div className="w-8 h-[1px] bg-[#C5A059] -rotate-45 absolute" />
                </div>
                <p className="font-serif italic text-xl text-foreground/60">No botanicals match your search.</p>
                <a href="/products" className="mt-10 text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] hover:text-foreground transition-colors decoration-[#C5A059]/30 underline underline-offset-8">Reset the filters</a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
