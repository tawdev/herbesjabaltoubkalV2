import { Metadata, ResolvingMetadata } from 'next';
import { getBlog } from "@/lib/api";
import { notFound } from "next/navigation";
import BlogDetailClient from "@/components/BlogDetailClient";
import { getBlogImage } from "@/lib/images";

type Props = {
  params: Promise<{ id: string }>;
};

// SEO: Generate Dynamic Metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id;
  const blog = await getBlog(id).catch(() => null);

  if (!blog) {
    return { title: 'Article non trouvé' };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const imageUrl = getBlogImage(blog.image);

  return {
    title: blog.title,
    description: blog.excerpt || blog.content?.substring(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.content?.substring(0, 160),
      url: `https://herbesjabaltoubkal.ma/blog/${id}`,
      siteName: 'Herbes Jabal Toubkal',
      images: [imageUrl, ...previousImages],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || blog.content?.substring(0, 160),
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  const id = (await params).id;
  const blog = await getBlog(id).catch(() => null);

  if (!blog) return notFound();

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    image: getBlogImage(blog.image),
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: {
      '@type': 'Organization',
      name: 'Herbes Jabal Toubkal',
    },
    description: blog.excerpt || blog.content?.substring(0, 160),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailClient blog={blog} />
    </>
  );
}
