import React from "react";
import { Metadata } from "next";
import { getSaleProducts } from "@/lib/products";
import { ProductListingView } from "@/components/product/product-listing-view";

export const metadata: Metadata = {
  title: "Seasonal Festive Sale — Up to 35% Off | RAGHAV GARMENTS",
  description:
    "Limited time special prices on handcrafted ethnic wear, festive ensembles, and royal garments.",
};

export default function SalePage() {
  const products = getSaleProducts();

  return (
    <ProductListingView
      title="Seasonal Sale & Special Offers"
      subtitle="Exclusive limited-time savings on handpicked sherwanis, Banarasi sarees, and kids festive sets."
      initialProducts={products}
    />
  );
}
