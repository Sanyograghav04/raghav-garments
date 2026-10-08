import React from "react";
import { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import { ProductListingView } from "@/components/product/product-listing-view";

export const metadata: Metadata = {
  title: "Men's Ethnic & Festive Collection | RAGHAV GARMENTS",
  description:
    "Explore regal sherwanis, handcrafted jodhpuri suits, linen kurtas, and festive bundi sets for modern gentlemen.",
};

export default function MenPage() {
  const products = getProductsByCategory("men");

  return (
    <ProductListingView
      category="men"
      title="Men's Regal Collection"
      subtitle="From heirloom zardozi sherwanis to breathable linen kurtas, designed for grandeur, comfort, and distinction."
      initialProducts={products}
    />
  );
}
