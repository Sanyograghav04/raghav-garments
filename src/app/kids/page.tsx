import React from "react";
import { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import { ProductListingView } from "@/components/product/product-listing-view";

export const metadata: Metadata = {
  title: "Kids Festive & Celebration Wear | RAGHAV GARMENTS",
  description:
    "Soft, lightweight, and skin-friendly ethnic kurtas, lehenga cholis, shararas, and party blazers for boys and girls.",
};

export default function KidsPage() {
  const products = getProductsByCategory("kids");

  return (
    <ProductListingView
      category="kids"
      title="Kids Celebration Wear"
      subtitle="Pure cotton linings, non-itchy embroidery, and playful twirl-friendly silhouettes crafted with affection for little ones."
      initialProducts={products}
    />
  );
}
