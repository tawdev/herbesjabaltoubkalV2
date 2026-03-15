import { API_URL } from "./api";

// Spice name fallback images (Unsplash)
const SPICE_IMAGES: Record<string, string> = {
  cumin: "https://images.unsplash.com/photo-1596040033229-a9821ebd0544",
  paprika: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
  turmeric: "https://images.unsplash.com/photo-1615485291234-9d694218aebe",
  coriander: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed",
  cinnamon: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
  ginger: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15",
  pepper: "https://images.unsplash.com/photo-1518887668165-01e1f90dae1e",
  cardamom: "https://images.unsplash.com/photo-1641744219565-4b0ff31e9e28",
  saffron: "https://images.unsplash.com/photo-1562280963-8a5475740a10",
  oregano: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4",
  thyme: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
  mint: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1",
};

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1596040033229-a9821ebd0544";
const DEFAULT_RECIPE_IMAGE =
  "https://images.unsplash.com/photo-1540189567003-538ed6b23a0c";
const DEFAULT_BLOG_IMAGE =
  "https://images.unsplash.com/photo-1488459739036-79ef9bfdd285";

/**
 * Encode only the filename part of a path, keeping slashes.
 * We resolve it relative to API_URL if it doesn't have it.
 */
function toPublicUrl(relativePath: string): string {
  if (relativePath.startsWith("http")) return relativePath;
  
  // Normalize slashes
  const normalized = relativePath.replace(/\\/g, "/");
  const parts = normalized.split("/");
  const filename = parts.pop() || "";
  
  // If the path already has a leading slash, or we want it relative to root
  const pathPart = [...parts, encodeURIComponent(filename)].join("/");
  
  // Provide full URL to ensure Next.js can resolve it correctly even in subpages
  return `${API_URL}/${pathPart.startsWith("/") ? pathPart.slice(1) : pathPart}`;
}

/**
 * Resolves a product image.
 */
export function getProductImage(image: string, name?: string): string {
  if (!image) return getNameBasedImage(name) ?? DEFAULT_PRODUCT_IMAGE;
  if (image.startsWith("http")) return image;
  if (image.startsWith("images/")) return toPublicUrl(image);
  return toPublicUrl(`images/products/${image}`);
}

/**
 * Resolves a recipe image.
 */
export function getRecipeImage(image: string, _title?: string): string {
  if (!image) return DEFAULT_RECIPE_IMAGE;
  if (image.startsWith("http")) return image;
  if (image.startsWith("images/")) return toPublicUrl(image);
  return toPublicUrl(`images/recipes/${image}`);
}

function getNameBasedImage(name?: string): string | undefined {
  if (!name) return undefined;
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(SPICE_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return undefined;
}

/**
 * Resolves a blog image.
 * Blog images are stored in frontend/public/images/blogs/ so they can be
 * served as local static assets at /images/blogs/FILENAME — no backend needed.
 */
export function getBlogImage(image: string | null): string {
  if (!image) return DEFAULT_BLOG_IMAGE;
  if (image.startsWith("http")) return image;

  // For slider/ or other sub-directory seeded images, use local path
  if (image.startsWith("slider/") || image.startsWith("images/")) {
    return `/${image}`;
  }

  // For all uploaded and seeded blog images — serve from public/images/blogs/
  return `/images/blogs/${image}`;
}
