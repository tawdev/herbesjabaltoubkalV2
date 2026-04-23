import { MetadataRoute } from 'next';
import { getProducts, getRecipes, getBlogs } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://herbesjabaltoubkal.ma';

  // Fetch dynamic content
  const [products, recipes, blogs] = await Promise.all([
    getProducts({}).catch(() => []),
    getRecipes().catch(() => []),
    getBlogs().catch(() => []),
  ]);

  // Dynamic Routes
  const productRoutes = products.map((p: any) => ({
    url: `${baseUrl}/products/${p.id}`,
    lastModified: p.updated_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const recipeRoutes = recipes.map((r: any) => ({
    url: `${baseUrl}/recipes/${r.id}`,
    lastModified: r.created_at || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const blogRoutes = blogs.map((b: any) => ({
    url: `${baseUrl}/blog/${b.id}`,
    lastModified: b.updated_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Routes statiques
  const staticRoutes = ['', '/products', '/about', '/recipes', '/blog', '/contact', '/bundles'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.8,
    })
  );

  return [...staticRoutes, ...productRoutes, ...recipeRoutes, ...blogRoutes];
}
