import { Product, ProductCategory, FilterState } from "@/types/product";
import { MOCK_PRODUCTS } from "./mock-data";
import { createClient } from "./supabase/client";

export async function fetchProductsFromDB(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS;
    }

    return data as Product[];
  } catch {
    return MOCK_PRODUCTS;
  }
}

export function getAllProducts(): Product[] {
  return MOCK_PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts(limit = 6): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.featured).slice(0, limit);
}

export function getSaleProducts(): Product[] {
  return MOCK_PRODUCTS.filter(
    (p) => p.compare_price && p.compare_price > p.price
  );
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return MOCK_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory)
  ).slice(0, limit);
}

export function getSubcategoriesForCategory(category?: string): string[] {
  const products = category
    ? MOCK_PRODUCTS.filter((p) => p.category === category)
    : MOCK_PRODUCTS;
  const subs = new Set(products.map((p) => p.subcategory));
  return Array.from(subs);
}

export function getAllSizes(category?: string): string[] {
  const products = category
    ? MOCK_PRODUCTS.filter((p) => p.category === category)
    : MOCK_PRODUCTS;
  const sizes = new Set<string>();
  products.forEach((p) => p.sizes.forEach((s) => sizes.add(s)));
  return Array.from(sizes);
}

export function getAllColors(): { name: string; hex: string }[] {
  const colorMap = new Map<string, string>();
  MOCK_PRODUCTS.forEach((p) => {
    p.colors.forEach((c) => {
      if (!colorMap.has(c.name)) {
        colorMap.set(c.name, c.hex);
      }
    });
  });
  return Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
}

export function filterAndSortProducts(
  products: Product[],
  filters: Partial<FilterState>
): Product[] {
  let result = [...products];

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.subcategories && filters.subcategories.length > 0) {
    result = result.filter((p) =>
      filters.subcategories!.includes(p.subcategory)
    );
  }

  if (typeof filters.minPrice === "number") {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (typeof filters.maxPrice === "number") {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.sizes && filters.sizes.length > 0) {
    result = result.filter((p) =>
      p.sizes.some((s) => filters.sizes!.includes(s))
    );
  }

  if (filters.colors && filters.colors.length > 0) {
    result = result.filter((p) =>
      p.colors.some((c) => filters.colors!.includes(c.name))
    );
  }

  if (filters.inStockOnly) {
    result = result.filter((p) => p.in_stock);
  }

  // Sorting
  switch (filters.sortBy) {
    case "price-low":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      result.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "featured":
    default:
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  return result;
}

export function searchProducts(query: string): Product[] {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return [];

  return MOCK_PRODUCTS.filter((p) => {
    return (
      p.name.toLowerCase().includes(cleanQuery) ||
      p.description.toLowerCase().includes(cleanQuery) ||
      p.subcategory.toLowerCase().includes(cleanQuery) ||
      p.category.toLowerCase().includes(cleanQuery) ||
      p.colors.some((c) => c.name.toLowerCase().includes(cleanQuery)) ||
      p.details?.some((d) => d.toLowerCase().includes(cleanQuery))
    );
  });
}
