"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <div
      className="group relative bg-cream-dark/40 rounded-2xl overflow-hidden border border-burgundy/10 hover:border-gold/40 transition-all duration-300 hover:shadow-lg flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-dark">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <span className="bg-burgundy text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              {discount}% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-gold-dark text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-sm">
              Bestseller
            </span>
          )}
        </div>

        {/* Action Buttons (Wishlist & Quick View) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={() => setIsLiked(!isLiked)}
            aria-label="Add to wishlist"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
              isLiked
                ? "bg-burgundy text-white"
                : "bg-white/90 text-charcoal hover:bg-white hover:text-burgundy"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Quick Add Overlay on Hover */}
        <div
          className={`absolute inset-x-3 bottom-3 z-10 transition-all duration-300 ${
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3 pointer-events-none"
          }`}
        >
          <Link
            href={`/product/${product.slug}`}
            className="w-full bg-burgundy/95 hover:bg-burgundy text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Select Options</span>
          </Link>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray mb-1">
            <span className="capitalize">{product.category}&apos;s {product.subcategory}</span>
            <div className="flex items-center gap-1 text-gold-dark font-medium">
              <Star className="w-3.5 h-3.5 fill-gold-dark text-gold-dark" />
              <span>4.9</span>
            </div>
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-heading font-semibold text-charcoal group-hover:text-burgundy transition-colors text-sm sm:text-base line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Colors */}
        <div className="mt-3 pt-2 border-t border-burgundy/5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-burgundy-dark text-base sm:text-lg">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && (
              <span className="text-xs text-gray line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          {/* Color preview dots */}
          <div className="flex items-center -space-x-1">
            {product.colors.slice(0, 3).map((col, idx) => (
              <span
                key={idx}
                title={col.name}
                className="w-3 h-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: col.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
