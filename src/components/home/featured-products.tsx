"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<"all" | "men" | "women" | "kids">("all");

  const filteredProducts =
    activeTab === "all"
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.category === activeTab);

  return (
    <section className="py-16 sm:py-24 bg-cream-dark/30 border-y border-burgundy/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark mb-2">
              Customer Favorites
            </p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-burgundy-dark">
              Trending &amp; Bestsellers
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-cream p-1 rounded-full border border-burgundy/10 self-start md:self-auto overflow-x-auto max-w-full">
            {(
              [
                { id: "all", label: "All Items" },
                { id: "women", label: "Women" },
                { id: "men", label: "Men" },
                { id: "kids", label: "Kids" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-burgundy text-white shadow-sm"
                    : "text-charcoal/70 hover:text-burgundy"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 3} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-white border border-burgundy/20 hover:border-burgundy text-burgundy hover:bg-burgundy hover:text-white px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm"
          >
            <span>Explore All 200+ Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
