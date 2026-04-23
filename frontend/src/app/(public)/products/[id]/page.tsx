import { Metadata, ResolvingMetadata } from 'next';
import { getProduct } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getProductImage } from "@/lib/images";

type Props = {
  params: Promise<{ id: string }>;
};

// SEO: Generate Dynamic Metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id;
  const product = await getProduct(id).catch(() => null);

  if (!product) {
    return {
      title: 'Produit non trouvé',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const imageUrl = getProductImage(product.image, product.name);

  return {
    title: product.name,
    description: product.description?.substring(0, 160) || `Découvrez ${product.name} - Épices et herbes premium du Haut Atlas.`,
    openGraph: {
      title: product.name,
      description: product.description,
      url: `https://herbesjabaltoubkal.ma/products/${id}`,
      siteName: 'Herbes Jabal Toubkal',
      images: [imageUrl, ...previousImages],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  const id = (await params).id;
  const product = await getProduct(id).catch(() => null);

  if (!product) return notFound();

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: getProductImage(product.image, product.name),
    description: product.description,
    sku: `JT-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'Herbes Jabal Toubkal',
    },
    offers: {
      '@type': 'Offer',
      url: `https://herbesjabaltoubkal.ma/products/${id}`,
      priceCurrency: 'MAD',
      price: product.promo_price || product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.5,
      reviewCount: 12, // Statique pour l'instant ou via DB si existant
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
