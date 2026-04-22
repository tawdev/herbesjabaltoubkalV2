export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
  console.log(`[DEBUG] getRecipes fetching from: ${API_URL}/recipes`);
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

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'no body');
    throw new Error(`Failed to fetch recipe (Status ${res.status}): ${errorText}`);
  }
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

  console.log(`[API] Fetching orders from: ${API_URL}/orders`);
  
  const res = await fetch(`${API_URL}/orders`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'No error body');
    console.error(`[API] getOrders fail: ${res.status} ${errorText}`);
    throw new Error(`Failed to fetch orders: ${res.status} ${errorText}`);
  }
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

export async function getBundles() {
  const res = await fetch(`${API_URL}/bundles`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch bundles");
  return res.json();
}

export async function getBundle(id: string) {
  const res = await fetch(`${API_URL}/bundles/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch bundle");
  return res.json();
}

export async function getUsers(token?: string) {
  const headers: any = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/users`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}
