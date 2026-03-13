const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  const queryParams = new URLSearchParams();
  if (searchParams.category) queryParams.set("category", String(searchParams.category));
  if (searchParams.minPrice) queryParams.set("minPrice", String(searchParams.minPrice));
  if (searchParams.maxPrice) queryParams.set("maxPrice", String(searchParams.maxPrice));
  if (searchParams.search) queryParams.set("search", String(searchParams.search));

  const res = await fetch(`${API_URL}/products?${queryParams.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function getRecipes() {
  const res = await fetch(`${API_URL}/recipes`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
}

export async function getRecipe(id: string) {
  const res = await fetch(`${API_URL}/recipes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch recipe");
  return res.json();
}
