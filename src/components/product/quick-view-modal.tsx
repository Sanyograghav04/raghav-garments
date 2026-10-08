"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Star, Heart, ShoppingBag, Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuickViewStore } from "@/stores/quick-view-store";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { formatPrice } from "@/lib/utils";

export function QuickViewModal() {
  const { product, isOpen, closeQuickView } = useQuickViewStore();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedSize(product.sizes[0] || "");
      setSelectedColor(product.colors[0]?.name || "");
      setQuantity(1);
      setAddedAnimation(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const isLiked = isInWishlist(product.id);
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      closeQuickView();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-burgundy/10 z-10 grid grid-cols-1 md:grid-cols-2"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-charcoal hover:text-burgundy transition-colors shadow-sm"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Product Images Side */}
          <div className="bg-cream-dark p-6 flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-inner">
              <Image
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top"
              />
              {discount > 0 && (
                <div className="absolute top-3 left-3 bg-burgundy text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === idx
                        ? "border-burgundy scale-105 shadow-sm"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Side */}
          <div className="p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-burgundy font-semibold">
                  {product.category}&apos;s {product.subcategory}
                </span>
                <div className="flex items-center gap-1 text-gold-dark text-xs font-medium">
                  <Star className="w-4 h-4 fill-gold-dark text-gold-dark" />
                  <span>{product.rating}</span>
                  <span className="text-gray">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-burgundy-dark leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-charcoal">
                  {formatPrice(product.price)}
                </span>
                {product.compare_price && (
                  <span className="text-sm text-gray line-through">
                    {formatPrice(product.compare_price)}
                  </span>
                )}
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  In Stock ({product.stock_count} units left)
                </span>
              </div>

              <p className="text-xs text-gray leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-2">
                    Color: <span className="text-burgundy font-normal">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                          selectedColor === c.name
                            ? "border-burgundy ring-2 ring-burgundy/30 scale-110"
                            : "border-gray-lighter hover:scale-105"
                        }`}
                        title={c.name}
                      >
                        <span
                          className="w-full h-full rounded-full block"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-charcoal">
                    Select Size: <span className="text-burgundy">{selectedSize}</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedSize === s
                          ? "border-burgundy bg-burgundy text-white shadow-xs"
                          : "border-burgundy/20 text-charcoal hover:border-burgundy"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-burgundy/10 space-y-3 mt-4">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addedAnimation}
                  className="flex-1 bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-colors flex items-center justify-center ${
                    isLiked
                      ? "bg-burgundy/10 border-burgundy text-burgundy"
                      : "border-burgundy/20 text-charcoal hover:text-burgundy"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-burgundy" : ""}`} />
                </button>
              </div>

              <div className="text-center">
                <Link
                  href={`/product/${product.slug}`}
                  onClick={closeQuickView}
                  className="inline-flex items-center gap-1 text-xs text-burgundy font-semibold hover:underline"
                >
                  <span>View Full Product Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
