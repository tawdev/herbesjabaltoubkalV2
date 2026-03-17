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
    <div className="container mx-auto py-24 px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Simple Sidebar Filter */}
        <aside className="w-full lg:w-72 flex flex-col gap-10 shrink-0 lg:sticky lg:top-32 lg:self-start">
          <div className="mb-4">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-2">Our Store</h2>
            <p className="text-xs text-foreground/40 font-bold leading-relaxed">Premium harvest from the heart of the Atlas Mountains.</p>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40 mb-6">Categories</h3>
            <div className="flex flex-col gap-1">
              {["Spices", "Herbs", "Mixes", "Ground", "Whole"].map((cat) => {
                const searchP = new URLSearchParams();
                Object.entries(params).forEach(([k, v]) => {
                  if (v) searchP.set(k, String(v));
                });
                searchP.set("category", cat.toLowerCase());
                
                return (
                  <a
                    key={cat}
                    href={`/products?${searchP.toString()}`}
                    className={`text-sm font-bold px-4 py-3 rounded-2xl flex items-center justify-between group transition-all hover:bg-primary/5 hover:text-primary ${params.category === cat.toLowerCase() ? 'bg-primary/10 text-primary' : 'text-foreground/70'}`}
                  >
                    {cat}
                    <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40 mb-6">Price Range</h3>
            <PriceFilter maxPossiblePrice={200} />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 flex flex-col gap-10">
          <div className="flex items-center justify-between border-b border-border/50 pb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {params.category ? `Collection: ${params.category}` : "All Products"}
              </h1>
              <span className="text-sm font-bold text-foreground/30 uppercase tracking-widest">{products.length} Items Found</span>
            </div>
            <select className="bg-transparent text-sm font-black border-none focus:ring-0 outline-none cursor-pointer text-foreground/60">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-secondary/10 rounded-[3rem] border-2 border-dashed border-secondary">
            <span className="text-6xl mb-6 text-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0c.815 0 1.583.315 2.181.888m-4.362 0C10.417 3.315 11.185 3 12 3" />
              </svg>
            </span>
              <p className="font-bold text-2xl">No spices found</p>
              <p className="text-foreground/50 mt-2 font-medium">Try adjusting your filters or search.</p>
              <a href="/products" className="mt-8 text-primary font-black underline underline-offset-4">Reset Filters</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
