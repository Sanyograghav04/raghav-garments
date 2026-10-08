"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Check,
} from "lucide-react";
import { useCartStore, FREE_SHIPPING_THRESHOLD } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getDiscount,
    getShippingFee,
    getTotal,
    getTotalCount,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<null | {
    code: string;
    discountAmount: number;
  }>(null);
  const [couponError, setCouponError] = useState("");

  const subtotal = getSubtotal();
  const baseDiscount = getDiscount();
  const shippingFee = getShippingFee();
  const totalCount = getTotalCount();

  const couponSavings = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, getTotal() - couponSavings);

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "RAGHAV10") {
      const discount = Math.round(subtotal * 0.1);
      setAppliedCoupon({ code: "RAGHAV10 (10% OFF)", discountAmount: discount });
      setCouponError("");
    } else if (code === "FESTIVE500" && subtotal >= 3000) {
      setAppliedCoupon({ code: "FESTIVE500 (₹500 OFF)", discountAmount: 500 });
      setCouponError("");
    } else if (code === "FESTIVE500" && subtotal < 3000) {
      setCouponError("FESTIVE500 requires a minimum order of ₹3,000.");
    } else {
      setCouponError("Invalid coupon code. Try 'RAGHAV10'");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-cream py-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-10 h-10 stroke-1" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-burgundy-dark">
              Your Shopping Bag is Empty
            </h1>
            <p className="text-sm text-gray leading-relaxed">
              Explore our handcrafted royal sherwanis, Banarasi sarees, and kids festive collections.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 bg-burgundy hover:bg-burgundy-dark text-white text-sm font-semibold px-8 py-3.5 rounded-full shadow-md transition-all"
            >
              <span>Explore Collections</span>
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
              Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-gray mt-1">
              You have {totalCount} {totalCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-gray hover:text-red-600 transition-colors flex items-center gap-1 font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Bag
          </button>
        </div>

        {/* Free Shipping Alert Banner */}
        <div className="mt-6 bg-white p-4 sm:p-5 rounded-2xl border border-burgundy/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-burgundy" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add{" "}
                  <strong className="text-burgundy">
                    {formatPrice(remainingForFreeShipping)}
                  </strong>{" "}
                  more to qualify for <strong>FREE Delivery</strong>!
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> You have unlocked FREE Express Delivery on this order!
                </span>
              )}
            </div>
            <span className="text-xs text-gray font-bold">
              {progressToFreeShipping}%
            </span>
          </div>
          <div className="w-full h-2 bg-cream-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-burgundy transition-all duration-500 rounded-full"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Main Grid: Cart Items (Left 8 cols) + Order Summary (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              return (
                <div
                  key={item.id}
                  className="bg-white p-4 sm:p-6 rounded-2xl border border-burgundy/10 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                >
                  {/* Thumbnail */}
                  <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-cream-dark shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="96px"
                      className="object-cover object-top"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-burgundy tracking-wider">
                          {item.product.category}&apos;s {item.product.subcategory}
                        </span>
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="block font-heading text-base font-bold text-charcoal hover:text-burgundy transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray hover:text-red-600 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal/80">
                      <span className="bg-cream px-2 py-0.5 rounded border border-burgundy/10 font-medium">
                        Size: <strong>{item.size}</strong>
                      </span>
                      <span className="bg-cream px-2 py-0.5 rounded border border-burgundy/10 font-medium">
                        Color: <strong>{item.color}</strong>
                      </span>
                    </div>

                    {/* Quantity + Subtotal Row */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-burgundy/20 rounded-xl bg-cream/50 px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal hover:text-burgundy font-bold"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal hover:text-burgundy font-bold"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-burgundy-dark text-base sm:text-lg">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-gray">
                            {formatPrice(item.product.price)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-2 flex justify-between items-center text-xs">
              <Link
                href="/collections"
                className="text-burgundy font-semibold hover:underline flex items-center gap-1"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary & Checkout Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-burgundy/10 shadow-xs space-y-6">
              <h2 className="font-heading text-xl font-bold text-burgundy-dark pb-3 border-b border-burgundy/10">
                Order Summary
              </h2>

              {/* Coupon Code Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-charcoal flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-burgundy" /> Have a Coupon Code?
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <span className="font-semibold">{appliedCoupon.code}</span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-600 hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. RAGHAV10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 text-xs px-3 py-2.5 border border-burgundy/20 rounded-xl uppercase outline-none focus:border-burgundy bg-cream/20"
                    />
                    <button
                      type="submit"
                      className="bg-burgundy text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-burgundy-dark transition-colors shadow-2xs"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-xs pt-2 border-t border-burgundy/10">
                <div className="flex justify-between text-charcoal/80">
                  <span>Bag Subtotal ({totalCount} items)</span>
                  <span className="font-semibold text-charcoal">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {baseDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Retail Savings</span>
                    <span>-{formatPrice(baseDiscount)}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(couponSavings)}</span>
                  </div>
                )}

                <div className="flex justify-between text-charcoal/80">
                  <span>Standard Shipping</span>
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

                <div className="flex justify-between text-base font-bold text-burgundy-dark pt-3 border-t border-burgundy/10">
                  <span>Total Amount</span>
                  <span className="text-xl font-heading font-extrabold text-burgundy-dark">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
                <p className="text-[10px] text-gray text-right">
                  Inclusive of all taxes & duties
                </p>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full bg-burgundy hover:bg-burgundy-dark text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all text-sm group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Trust Badges in summary */}
              <div className="pt-2 border-t border-burgundy/5 space-y-2 text-[11px] text-gray">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Encrypted & Safe Razorpay Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-burgundy shrink-0" />
                  <span>30-Day Easy Doorstep Returns & Exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
