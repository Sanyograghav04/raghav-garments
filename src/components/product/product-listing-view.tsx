"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, X, ArrowUpDown, RefreshCw, Check } from "lucide-react";
import { Product, ProductCategory, FilterState } from "@/types/product";
import { filterAndSortProducts, getSubcategoriesForCategory, getAllSizes, getAllColors } from "@/lib/products";
import { ProductCard } from "@/components/ui/product-card";
import { formatPrice } from "@/lib/utils";

interface ProductListingViewProps {
  title: string;
  subtitle: string;
  category?: ProductCategory;
  initialProducts: Product[];
  bannerImage?: string;
}

export function ProductListingView({
  title,
  subtitle,
  category,
  initialProducts,
}: ProductListingViewProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Available options
  const availableSubcategories = useMemo(
    () => getSubcategoriesForCategory(category),
    [category]
  );
  const availableSizes = useMemo(() => getAllSizes(category), [category]);
  const availableColors = useMemo(() => getAllColors(), []);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: category,
    subcategories: [],
    minPrice: 0,
    maxPrice: 60000,
    sizes: [],
    colors: [],
    inStockOnly: false,
    sortBy: "featured",
  });

  // Toggle subcategory
  const handleToggleSubcategory = (sub: string) => {
    setFilters((prev) => {
      const exists = prev.subcategories.includes(sub);
      return {
        ...prev,
        subcategories: exists
          ? prev.subcategories.filter((s) => s !== sub)
          : [...prev.subcategories, sub],
      };
    });
  };

  // Toggle size
  const handleToggleSize = (size: string) => {
    setFilters((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      };
    });
  };

  // Toggle color
  const handleToggleColor = (colorName: string) => {
    setFilters((prev) => {
      const exists = prev.colors.includes(colorName);
      return {
        ...prev,
        colors: exists
          ? prev.colors.filter((c) => c !== colorName)
          : [...prev.colors, colorName],
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      category: category,
      subcategories: [],
      minPrice: 0,
      maxPrice: 60000,
      sizes: [],
      colors: [],
      inStockOnly: false,
      sortBy: "featured",
    });
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(initialProducts, filters);
  }, [initialProducts, filters]);

  const activeFilterCount =
    filters.subcategories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.maxPrice < 60000 || filters.minPrice > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-cream">
      {/* Category Header Banner */}
      <section className="bg-cream-dark/60 border-b border-burgundy/10 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-burgundy font-semibold">
            Raghav Garments &bull; Curated Collection
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-dark">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Top Control Bar (Mobile filter toggle, Active counter, Sort Dropdown) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-burgundy/10">
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-burgundy/20 text-xs font-semibold text-burgundy shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            <span className="text-xs sm:text-sm text-gray font-medium">
              Showing <strong className="text-charcoal">{filteredProducts.length}</strong> items
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray hidden sm:inline flex items-center gap-1 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
            </span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sortBy: e.target.value as FilterState["sortBy"],
                })
              }
              className="bg-white border border-burgundy/20 text-charcoal text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:border-burgundy shadow-xs cursor-pointer"
            >
              <option value="featured">Featured / Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-4">
            <span className="text-xs text-gray font-medium">Active Filters:</span>
            {filters.subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => handleToggleSubcategory(sub)}
                className="inline-flex items-center gap-1 bg-burgundy/10 text-burgundy text-xs font-medium px-2.5 py-1 rounded-full hover:bg-burgundy/20 transition-colors"
              >
                <span>{sub}</span>
                <X className="w-3 h-3" />
              </button>
            ))}

            {filters.sizes.map((s) => (
              <button
                key={s}
                onClick={() => handleToggleSize(s)}
                className="inline-flex items-center gap-1 bg-burgundy/10 text-burgundy text-xs font-medium px-2.5 py-1 rounded-full hover:bg-burgundy/20 transition-colors"
              >
                <span>Size: {s}</span>
                <X className="w-3 h-3" />
              </button>
            ))}

            {filters.colors.map((c) => (
              <button
                key={c}
                onClick={() => handleToggleColor(c)}
                className="inline-flex items-center gap-1 bg-burgundy/10 text-burgundy text-xs font-medium px-2.5 py-1 rounded-full hover:bg-burgundy/20 transition-colors"
              >
                <span>Color: {c}</span>
                <X className="w-3 h-3" />
              </button>
            ))}

            {filters.inStockOnly && (
              <button
                onClick={() => setFilters({ ...filters, inStockOnly: false })}
                className="inline-flex items-center gap-1 bg-burgundy/10 text-burgundy text-xs font-medium px-2.5 py-1 rounded-full hover:bg-burgundy/20 transition-colors"
              >
                <span>In Stock Only</span>
                <X className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={resetFilters}
              className="text-xs text-burgundy font-semibold hover:underline ml-2 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Clear All
            </button>
          </div>
        )}

        {/* Layout Grid: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 sticky top-28 self-start bg-white/70 backdrop-blur-xs p-6 rounded-2xl border border-burgundy/10 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-burgundy/10">
              <h3 className="font-heading font-bold text-base text-burgundy-dark">
                Refine by
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-burgundy hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Subcategories */}
            {availableSubcategories.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal">
                  Category Style
                </h4>
                <div className="space-y-1.5 text-xs">
                  {availableSubcategories.map((sub) => {
                    const checked = filters.subcategories.includes(sub);
                    return (
                      <label
                        key={sub}
                        className="flex items-center gap-2 cursor-pointer text-charcoal/80 hover:text-burgundy"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleSubcategory(sub)}
                          className="rounded border-burgundy/30 text-burgundy focus:ring-burgundy"
                        />
                        <span className={checked ? "font-semibold text-burgundy" : ""}>
                          {sub}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price Range Slider */}
            <div className="space-y-2 pt-4 border-t border-burgundy/10">
              <div className="flex justify-between items-center text-xs">
                <h4 className="uppercase tracking-wider font-semibold text-charcoal">
                  Max Price
                </h4>
                <span className="font-bold text-burgundy">
                  {formatPrice(filters.maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={60000}
                step={1000}
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: Number(e.target.value) })
                }
                className="w-full accent-burgundy cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray">
                <span>₹1,000</span>
                <span>₹60,000+</span>
              </div>
            </div>

            {/* Sizes */}
            {availableSizes.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-burgundy/10">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal">
                  Size
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {availableSizes.map((s) => {
                    const checked = filters.sizes.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => handleToggleSize(s)}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                          checked
                            ? "bg-burgundy text-white border-burgundy font-semibold shadow-xs"
                            : "bg-white text-charcoal border-burgundy/20 hover:border-burgundy"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colors */}
            {availableColors.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-burgundy/10">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal">
                  Color
                </h4>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((c) => {
                    const checked = filters.colors.includes(c.name);
                    return (
                      <button
                        key={c.name}
                        onClick={() => handleToggleColor(c.name)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          checked
                            ? "border-burgundy ring-2 ring-burgundy/30 scale-110"
                            : "border-white shadow-xs hover:scale-105"
                        }`}
                        title={c.name}
                        style={{ backgroundColor: c.hex }}
                      >
                        {checked && <Check className="w-3 h-3 text-white drop-shadow" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* In Stock Toggle */}
            <div className="pt-4 border-t border-burgundy/10">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal font-medium">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) =>
                    setFilters({ ...filters, inStockOnly: e.target.checked })
                  }
                  className="rounded border-burgundy/30 text-burgundy focus:ring-burgundy"
                />
                <span>In Stock Items Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white/80 rounded-2xl border border-burgundy/10 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl font-bold text-charcoal">
                  No garments match your filters
                </h3>
                <p className="text-xs text-gray max-w-md mx-auto">
                  Try adjusting your price range, selected sizes, or category styles to discover matching pieces.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-burgundy text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-burgundy-dark transition-colors shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-xl flex flex-col p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-burgundy/10">
                <h3 className="font-heading font-bold text-lg text-burgundy-dark">
                  Filters
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 text-gray hover:text-burgundy"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Subcategories */}
              <div className="space-y-2 py-4 border-b border-burgundy/10">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal">
                  Category Style
                </h4>
                <div className="space-y-2 text-xs">
                  {availableSubcategories.map((sub) => (
                    <label key={sub} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.subcategories.includes(sub)}
                        onChange={() => handleToggleSubcategory(sub)}
                        className="rounded border-burgundy/30 text-burgundy"
                      />
                      <span>{sub}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2 py-4 border-b border-burgundy/10">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Max Price</span>
                  <span className="text-burgundy">{formatPrice(filters.maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={60000}
                  step={1000}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: Number(e.target.value) })
                  }
                  className="w-full accent-burgundy"
                />
              </div>

              {/* Sizes */}
              <div className="space-y-2 py-4 border-b border-burgundy/10">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal">
                  Size
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleToggleSize(s)}
                      className={`px-3 py-1 text-xs rounded-lg border ${
                        filters.sizes.includes(s)
                          ? "bg-burgundy text-white border-burgundy"
                          : "border-gray-lighter"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply / Reset Actions */}
              <div className="pt-6 mt-auto space-y-2">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-burgundy text-white py-3 rounded-xl text-xs font-semibold"
                >
                  Apply Filters ({filteredProducts.length} results)
                </button>
                <button
                  onClick={resetFilters}
                  className="w-full bg-cream text-charcoal py-2.5 rounded-xl text-xs font-semibold"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
