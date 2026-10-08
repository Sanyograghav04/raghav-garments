import React from "react";
import { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { ProductListingView } from "@/components/product/product-listing-view";

export const metadata: Metadata = {
  title: "All Festive & Heritage Collections | RAGHAV GARMENTS",
  description:
    "Explore the complete curated catalogue of luxury festive garments for men, women, and kids from Raghav Garments.",
};

export default function CollectionsPage() {
  const products = getAllProducts();

  return (
    <ProductListingView
      title="Heritage & Contemporary Collections"
      subtitle="Explore our complete line of handwoven sarees, bespoke sherwanis, festive shararas, and everyday linen essentials."
      initialProducts={products}
    />
  );
}
