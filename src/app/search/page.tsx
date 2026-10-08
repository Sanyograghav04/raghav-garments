"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, Sparkles } from "lucide-react";
import { getAllProducts } from "@/lib/products";
import { ProductCard } from "@/components/ui/product-card";

const POPULAR_SEARCHES = [
  "Sherwani",
  "Banarasi Saree",
  "Anarkali",
  "Linen Shirt",
  "Lehenga",
  "Kids Festive",
  "Bundi Set",
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");

  const allProducts = useMemo(() => getAllProducts(), []);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = allProducts;

    if (q) {
      list = list.filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.colors.some((c) => c.name.toLowerCase().includes(q))
        );
      });
    }

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    switch (sortBy) {
      case "price-low":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...list].sort((a, b) => b.price - a.price);
      case "rating":
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [allProducts, query, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Big Search Input */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-burgundy font-semibold">
              Search Catalogue
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-burgundy-dark mt-1">
              Find Your Perfect Garment
            </h1>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-gray absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by attire, color, fabric, or occasion (e.g. Silk Saree, Velvet Sherwani)..."
                className="w-full bg-white pl-12 pr-12 py-4 rounded-2xl border border-burgundy/20 shadow-md text-sm sm:text-base text-charcoal placeholder-gray outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 transition-all"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    router.push("/search");
                  }}
                  className="absolute right-4 p-1 text-gray hover:text-burgundy"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>

          {/* Popular Search Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-gray flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-gold-dark" /> Popular:
            </span>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="text-xs bg-white/80 hover:bg-burgundy hover:text-white px-3 py-1 rounded-full border border-burgundy/10 text-charcoal transition-all shadow-2xs"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-12 pb-6 border-b border-burgundy/10 flex flex-wrap items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="inline-flex rounded-xl bg-white border border-burgundy/10 p-1 shadow-2xs">
            {[
              { id: "all", label: "All Items" },
              { id: "men", label: "Men" },
              { id: "women", label: "Women" },
              { id: "kids", label: "Kids" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === tab.id
                    ? "bg-burgundy text-white shadow-xs"
                    : "text-charcoal/70 hover:text-burgundy"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Results count & Sort */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-gray">
              Found <strong className="text-charcoal">{filteredResults.length}</strong> matches
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-burgundy/20 text-charcoal text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-burgundy shadow-2xs"
            >
              <option value="relevance">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        <div className="mt-8">
          {filteredResults.length === 0 ? (
            <div className="bg-white/80 rounded-2xl border border-burgundy/10 p-12 text-center space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-charcoal">
                No matching garments found
              </h3>
              <p className="text-xs text-gray leading-relaxed">
                We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try checking the spelling or exploring our curated categories.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("all");
                  router.push("/search");
                }}
                className="bg-burgundy text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-burgundy-dark transition-colors"
              >
                View Full Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center text-sm text-gray">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
