import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-secondary/50 transition-all hover:shadow-xl hover:-translate-y-1">
        {product.promo && (
          <div className="absolute top-4 left-4 z-10 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-md">
            Sale
          </div>
        )}
        {product.best_seller && (
          <div className={`absolute top-4 ${product.promo ? 'left-20' : 'left-4'} z-10 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground shadow-md`}>
            Best Seller
          </div>
        )}
        <Image
          src={product.image.startsWith('http') ? product.image : `/${product.image}`}
          alt={product.name}
          fill
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
        />
        <button className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-primary text-primary-foreground opacity-0 transition-all hover:scale-110 group-hover:opacity-100 flex items-center justify-center shadow-xl translate-y-4 group-hover:translate-y-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
      <Link href={`/products/${product.id}`} className="flex flex-col items-start px-2">
        <span className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">{product.category}</span>
        <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-xs text-foreground/50 line-clamp-1 h-4">{product.name_ar}</p>
        <div className="flex items-center gap-2 mt-3 w-full justify-between">
          <div className="flex flex-col">
            {product.promo_price ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-primary">{product.promo_price} MAD</span>
                <span className="text-sm text-foreground/40 line-through">{product.price} MAD</span>
              </div>
            ) : (
              <span className="font-bold text-xl text-primary">{product.price} MAD</span>
            )}
            <span className="text-[10px] text-foreground/40 font-medium uppercase tracking-tighter">per {product.weight}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md">
            ★ {product.rating || '5.0'}
          </div>
        </div>
      </Link>
    </div>
  );
}
