"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useQuickViewStore } from "@/stores/quick-view-store";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist, getTotalCount } = useWishlistStore();
  const { openQuickView } = useQuickViewStore();
  const totalCount = getTotalCount();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-cream py-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-10 h-10 stroke-1" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-burgundy-dark">
              Your Wishlist is Empty
            </h1>
            <p className="text-sm text-gray leading-relaxed">
              Save your favorite royal sherwanis, Banarasi sarees, and kids festive sets to shop later.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 bg-burgundy hover:bg-burgundy-dark text-white text-sm font-semibold px-8 py-3.5 rounded-full shadow-md transition-all"
            >
              <span>Explore Garments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 pb-6 border-b border-burgundy/10">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-burgundy-dark">
              My Saved Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-gray mt-1">
              {totalCount} {totalCount === 1 ? "item" : "items"} saved for upcoming occasions
            </p>
          </div>
          <button
            onClick={clearWishlist}
            className="text-xs text-gray hover:text-red-600 transition-colors flex items-center gap-1 font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All Saved
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
          {items.map((product) => {
            const discount = product.compare_price
              ? Math.round(
                  ((product.compare_price - product.price) / product.compare_price) * 100
                )
              : 0;

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-2xl overflow-hidden border border-burgundy/10 hover:border-gold/40 transition-all shadow-xs flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] w-full bg-cream-dark overflow-hidden">
                  <Link href={`/product/${product.slug}`} className="block w-full h-full">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-charcoal hover:bg-red-50 hover:text-red-600 flex items-center justify-center shadow-md transition-all z-10"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-3 left-3 bg-burgundy text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      {discount}% OFF
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-burgundy">
                      {product.category}&apos;s {product.subcategory}
                    </span>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-heading text-sm font-semibold text-charcoal hover:text-burgundy line-clamp-1 transition-colors mt-0.5">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-bold text-burgundy-dark text-base">
                        {formatPrice(product.price)}
                      </span>
                      {product.compare_price && (
                        <span className="text-xs text-gray line-through">
                          {formatPrice(product.compare_price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action: Select Size & Add to Bag */}
                  <button
                    onClick={() => openQuickView(product)}
                    className="w-full bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Select Size & Move to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
