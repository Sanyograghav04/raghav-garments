"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, FREE_SHIPPING_THRESHOLD } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShippingFee,
    getTotal,
    getTotalCount,
  } = useCartStore();

  const totalCount = getTotalCount();
  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();

  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Prevent background scrolling when cart drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-cream shadow-2xl flex flex-col border-l border-burgundy/10"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-burgundy/10 flex items-center justify-between bg-cream-dark/50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-burgundy" />
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-burgundy-dark">
                    Shopping Bag
                  </h2>
                  <span className="bg-burgundy/10 text-burgundy text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalCount} {totalCount === 1 ? "item" : "items"}
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 text-charcoal/60 hover:text-burgundy rounded-full hover:bg-burgundy/5 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="bg-burgundy/5 px-5 sm:px-6 py-3 border-b border-burgundy/10">
                <div className="flex items-center gap-2 text-xs text-charcoal font-medium mb-1.5">
                  <Truck className="w-4 h-4 text-burgundy shrink-0" />
                  {remainingForFreeShipping > 0 ? (
                    <span>
                      Add{" "}
                      <strong className="text-burgundy">
                        {formatPrice(remainingForFreeShipping)}
                      </strong>{" "}
                      more for <strong>FREE Delivery</strong>!
                    </span>
                  ) : (
                    <span className="text-burgundy font-semibold">
                      🎉 Congratulations! You unlocked FREE Delivery!
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-gray-lighter rounded-full overflow-hidden">
                  <div
                    className="h-full bg-burgundy transition-all duration-500 rounded-full"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy mb-4">
                      <ShoppingBag className="w-8 h-8 stroke-1" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-charcoal mb-1">
                      Your bag is empty
                    </h3>
                    <p className="text-xs text-gray max-w-xs mb-6">
                      Explore our handcrafted royal sherwanis, Banarasi sarees, and kids festive collections.
                    </p>
                    <button
                      onClick={closeCart}
                      className="bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold px-6 py-3 rounded-full shadow-md transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  items.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3 bg-white rounded-xl border border-burgundy/10 shadow-xs relative group"
                      >
                        {/* Product Thumbnail */}
                        <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-cream-dark shrink-0">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            sizes="80px"
                            className="object-cover object-top"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <Link
                                href={`/product/${item.product.slug}`}
                                onClick={closeCart}
                                className="font-heading text-sm font-semibold text-charcoal hover:text-burgundy line-clamp-1 transition-colors"
                              >
                                {item.product.name}
                              </Link>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-gray hover:text-red-600 transition-colors p-1"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Attributes */}
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray">
                              <span className="bg-cream-dark px-1.5 py-0.5 rounded font-medium text-charcoal">
                                Size: {item.size}
                              </span>
                              <span className="flex items-center gap-1">
                                Color: {item.color}
                              </span>
                            </div>
                          </div>

                          {/* Price & Quantity Controls */}
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-lighter">
                            <span className="font-semibold text-burgundy-dark text-sm">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>

                            <div className="flex items-center border border-burgundy/20 rounded-md bg-cream/40">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 text-charcoal hover:text-burgundy transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-semibold text-charcoal">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 text-charcoal hover:text-burgundy transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer / Checkout CTA */}
              {items.length > 0 && (
                <div className="p-5 sm:p-6 bg-cream-dark/60 border-t border-burgundy/10 space-y-4">
                  {/* Cost breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray">
                      <span>Subtotal</span>
                      <span className="font-medium text-charcoal">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray">
                      <span>Shipping</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="text-emerald-700 font-semibold uppercase text-[11px]">
                            FREE
                          </span>
                        ) : (
                          formatPrice(shippingFee)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-burgundy-dark pt-2 border-t border-burgundy/10">
                      <span>Estimated Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="w-full bg-burgundy hover:bg-burgundy-dark text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm group"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="w-full bg-white hover:bg-cream-dark text-burgundy-dark border border-burgundy/20 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center text-xs transition-colors"
                    >
                      View Full Bag & Apply Coupons
                    </Link>
                  </div>

                  {/* Trust guarantee */}
                  <div className="flex items-center justify-center gap-2 text-[11px] text-gray pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% Verified Secure Checkout • 30-Day Easy Returns</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
