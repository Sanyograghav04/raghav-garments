// Core product types

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: "men" | "women" | "kids";
  subcategory: string;
  price: number;
  compare_price?: number; // Original price before discount
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  in_stock: boolean;
  stock_count: number;
  featured: boolean;
  created_at: string;
};

export type ProductColor = {
  name: string;
  hex: string;
};

export type CartItem = {
  product: Product;
  size: string;
  color: string;
  quantity: number;
};
