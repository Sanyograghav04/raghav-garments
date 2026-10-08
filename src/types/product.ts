// Core product & shop types

export type ProductCategory = "men" | "women" | "kids";

export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  sizePurchased?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  compare_price?: number; // Original price before discount
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  in_stock: boolean;
  stock_count: number;
  featured: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  details?: string[];
  fabric_care?: string[];
  sku?: string;
  created_at: string;
};

export type CartItem = {
  id: string; // generated unique id: `${product.id}-${size}-${color}`
  product: Product;
  size: string;
  color: string;
  quantity: number;
};

export type FilterState = {
  category?: string;
  subcategories: string[];
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  inStockOnly: boolean;
  sortBy: "featured" | "price-low" | "price-high" | "newest" | "rating";
};
