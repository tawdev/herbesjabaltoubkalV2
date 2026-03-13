import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const products = await getProducts(searchParams);

  return (
    <div className="container py-20 px-4">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Simple Sidebar Filter */}
        <aside className="w-full md:w-64 flex flex-col gap-8 shrink-0">
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <div className="flex flex-col gap-2">
              {["Spices", "Herbs", "Mixes", "Ground", "Whole"].map((cat) => (
                <a
                  key={cat}
                  href={`/products?category=${cat.toLowerCase()}`}
                  className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center justify-between group"
                >
                  {cat}
                  <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Price Range</h3>
            <div className="flex flex-col gap-4">
              <input type="range" className="accent-primary" min="0" max="200" />
              <div className="flex justify-between text-xs font-bold text-foreground/60">
                <span>0 MAD</span>
                <span>200 MAD</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 flex flex-col gap-10">
          <div className="flex items-center justify-between border-b pb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              {searchParams.category ? `Collection: ${searchParams.category}` : "All Products"}
              <span className="ml-4 text-sm font-normal text-foreground/40">({products.length} Items Found)</span>
            </h1>
            <select className="bg-transparent text-sm font-bold border-none focus:ring-0 outline-none cursor-pointer">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-secondary/10 rounded-3xl border-2 border-dashed">
              <span className="text-5xl mb-4">🌿</span>
              <p className="font-bold text-xl">No spices found</p>
              <p className="text-foreground/50">Try adjusting your filters or search.</p>
              <a href="/products" className="mt-6 text-primary font-bold underline">Reset Filters</a>
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
