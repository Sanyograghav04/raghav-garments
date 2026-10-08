import React from "react";
import { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import { ProductListingView } from "@/components/product/product-listing-view";

export const metadata: Metadata = {
  title: "Women's Royal Ethnic Collection | RAGHAV GARMENTS",
  description:
    "Discover pure Banarasi silk sarees, bridal lehengas, Chanderi Anarkalis, and artisanal kurtis crafted with heritage perfection.",
};

export default function WomenPage() {
  const products = getProductsByCategory("women");

  return (
    <ProductListingView
      category="women"
      title="Women's Royal Collection"
      subtitle="Pure Banarasi handlooms, intricate bridal lehengas, and ethereal Anarkali ensembles crafted for celebratory grace."
      initialProducts={products}
    />
  );
}
