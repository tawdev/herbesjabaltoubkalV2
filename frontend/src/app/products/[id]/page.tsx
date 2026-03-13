import Image from "next/image";
import { getProduct } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) notFound();

  return (
    <div className="container py-20 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Image */}
        <div className="relative aspect-square rounded-[2.5rem] bg-white border border-secondary/50 p-12 shadow-inner-lg">
          <Image
            src={product.image.startsWith('http') ? product.image : `/${product.image}`}
            alt={product.name}
            fill
            className="object-contain p-16 mix-blend-multiply"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-accent uppercase tracking-[0.2em]">{product.category}</span>
            <div className="flex items-center justify-between">
              <h1 className="text-5xl font-bold tracking-tight">{product.name}</h1>
              <span className="text-2xl font-bold text-foreground/20 italic font-serif" dir="rtl">{product.name_ar}</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-yellow-500 font-bold">★★★★★</span>
              <span className="text-sm text-foreground/40 font-medium">({product.reviews?.length || 0} Customer Reviews)</span>
              <span className="h-4 w-px bg-secondary" />
              <span className="text-sm font-bold text-emerald-600">In Stock</span>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-primary">{product.promo_price || product.price} MAD</span>
            {product.promo_price && (
              <span className="text-xl text-foreground/30 line-through">{product.price} MAD</span>
            )}
            <span className="text-sm text-foreground/50 font-medium">/ {product.weight}</span>
          </div>

          <p className="text-lg text-foreground/70 leading-relaxed border-l-4 border-primary/20 pl-6 italic">
            {product.description}
          </p>

          <div className="flex flex-col gap-6 pt-6 border-t">
            <div className="flex items-center gap-6">
              <div className="flex items-center border rounded-full px-4 py-2 bg-secondary/20">
                <button className="w-8 h-8 flex items-center justify-center font-bold">-</button>
                <span className="w-12 text-center font-bold">1</span>
                <button className="w-8 h-8 flex items-center justify-center font-bold">+</button>
              </div>
              <button className="flex-1 rounded-full bg-primary py-4 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90">
                Add to Cart
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 text-sm">
            <div className="p-4 rounded-2xl bg-secondary/10 flex flex-col gap-1">
              <span className="font-bold text-foreground/40 uppercase text-[10px] tracking-widest">Origin</span>
              <span className="font-bold">{product.origin_country || 'Global'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/10 flex flex-col gap-1">
              <span className="font-bold text-foreground/40 uppercase text-[10px] tracking-widest">Natural</span>
              <span className="font-bold">100% Organic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits & Usage section */}
      {(product.benefits || product.usage_method) && (
        <section className="mt-32 grid md:grid-cols-2 gap-12">
          {product.benefits && (
            <div className="space-y-6">
              <h3 className="text-3xl font-bold">Health Benefits</h3>
              <div className="text-foreground/70 leading-relaxed bg-accent/5 p-8 rounded-[2rem] border border-accent/10">
                {product.benefits}
              </div>
            </div>
          )}
          {product.usage_method && (
            <div className="space-y-6">
              <h3 className="text-3xl font-bold">How to Use</h3>
              <div className="text-foreground/70 leading-relaxed bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
                {product.usage_method}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
