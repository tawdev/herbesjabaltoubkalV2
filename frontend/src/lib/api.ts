export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  const queryParams = new URLSearchParams();
  if (searchParams.category) queryParams.set("category", String(searchParams.category));
  if (searchParams.minPrice) queryParams.set("minPrice", String(searchParams.minPrice));
  if (searchParams.maxPrice) queryParams.set("maxPrice", String(searchParams.maxPrice));
  if (searchParams.search) queryParams.set("search", String(searchParams.search));

  const res = await fetch(`${API_URL}/products?${queryParams.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'no body');
    throw new Error(`Failed to fetch products: ${res.status} ${errorText}`);
  }
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

export async function getBlogs() {
  const res = await fetch(`${API_URL}/blogs`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}

export async function getBlog(id: string) {
  const res = await fetch(`${API_URL}/blogs/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch blog");
  return res.json();
}

export async function getOrders(token?: string) {
  const headers: any = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/orders`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function getContacts(token?: string) {
  const headers: any = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/contacts`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch contacts");
  return res.json();
}
