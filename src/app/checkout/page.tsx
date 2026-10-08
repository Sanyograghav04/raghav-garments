"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle,
  MapPin,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { formatPrice } from "@/lib/utils";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getDiscount, getShippingFee, getTotal, clearCart } =
    useCartStore();
  const { user, profile } = useAuthStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Delhi");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const baseShipping = getShippingFee();
  const expressFee = deliveryMethod === "express" ? 150 : 0;
  const shippingFee = baseShipping + expressFee;
  const total = subtotal + shippingFee;

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
    if (user?.email) {
      setEmail(user.email);
    }
  }, [profile, user]);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-cream py-16 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto">
            <CreditCard className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-burgundy-dark">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-xs text-gray">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/collections"
            className="inline-block bg-burgundy text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-burgundy-dark transition-colors"
          >
            Explore Garments
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName || !email || !phone || !street || !city || !postalCode) {
      setErrorMsg("Please fill in all shipping address fields.");
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items,
        shippingAddress: {
          fullName,
          email,
          phone,
          street,
          city,
          state,
          postalCode,
        },
        customerInfo: {
          name: fullName,
          email,
          phone,
        },
        userId: user?.id || null,
        subtotal,
        discount,
        shipping: shippingFee,
        total,
        isCod: paymentMethod === "cod",
      };

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initiate order.");
      }

      // If Cash on Delivery
      if (paymentMethod === "cod") {
        clearCart();
        router.push(
          `/checkout/success?order=${data.orderNumber}&method=cod&total=${total}`
        );
        return;
      }

      // Online Razorpay Payment
      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mockKeyId",
          amount: data.amount,
          currency: data.currency || "INR",
          name: "RAGHAV GARMENTS",
          description: `Order ${data.orderNumber}`,
          image: "/images/logo.png",
          order_id: data.orderId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderNumber: data.orderNumber,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                clearCart();
                router.push(
                  `/checkout/success?order=${data.orderNumber}&paymentId=${response.razorpay_payment_id}&total=${total}`
                );
              } else {
                setErrorMsg("Payment verification failed. Please contact support.");
              }
            } catch {
              setErrorMsg("Payment verification error.");
            }
          },
          prefill: {
            name: fullName,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#7C1D3E", // Burgundy
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback for simulation / direct success
        clearCart();
        router.push(
          `/checkout/success?order=${data.orderNumber}&paymentId=sim_pay_${Date.now()}&total=${total}`
        );
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-cream py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-6 border-b border-burgundy/10 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-semibold text-burgundy tracking-widest">
                Express Secure Checkout
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-burgundy-dark mt-0.5">
                Delivery & Payment
              </h1>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Checkout Grid: Form (7 cols) + Summary (5 cols) */}
          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 items-start"
          >
            {/* Left Column: Details & Shipping Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer & Shipping Address */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-burgundy/10 shadow-xs space-y-4 text-xs">
                <div className="flex items-center gap-2 font-heading font-bold text-base text-burgundy-dark pb-2 border-b border-burgundy/10">
                  <MapPin className="w-4 h-4 text-burgundy" />
                  <span>1. Delivery Address</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-charcoal mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sanyog Raghav"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/20 bg-cream/20 text-charcoal outline-none focus:border-burgundy"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">
                      Email Address (for order updates) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/20 bg-cream/20 text-charcoal outline-none focus:border-burgundy"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/20 bg-cream/20 text-charcoal outline-none focus:border-burgundy"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-charcoal mb-1">
                      Street Address / House / Apartment *
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Flat 104, Royal Palms Residency, Civil Lines"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/20 bg-cream/20 text-charcoal outline-none focus:border-burgundy"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Jaipur / New Delhi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/20 bg-cream/20 text-charcoal outline-none focus:border-burgundy"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">
                      State / Union Territory *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Rajasthan / Delhi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/20 bg-cream/20 text-charcoal outline-none focus:border-burgundy"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">
                      6-Digit PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="302006"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/20 bg-cream/20 text-charcoal outline-none focus:border-burgundy"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Speed */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-burgundy/10 shadow-xs space-y-3 text-xs">
                <div className="flex items-center gap-2 font-heading font-bold text-base text-burgundy-dark pb-2 border-b border-burgundy/10">
                  <Truck className="w-4 h-4 text-burgundy" />
                  <span>2. Delivery Speed</span>
                </div>

                <div className="space-y-2">
                  <label
                    onClick={() => setDeliveryMethod("standard")}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      deliveryMethod === "standard"
                        ? "border-burgundy bg-burgundy/5 ring-1 ring-burgundy"
                        : "border-gray-lighter hover:border-burgundy/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          deliveryMethod === "standard"
                            ? "border-burgundy bg-burgundy"
                            : "border-gray"
                        }`}
                      >
                        {deliveryMethod === "standard" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal">
                          Standard Express Delivery (3 - 5 Business Days)
                        </p>
                        <p className="text-[11px] text-gray">
                          Insured & tracked via BlueDart / Delhivery
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-800 uppercase text-[11px]">
                      {baseShipping === 0 ? "FREE" : formatPrice(baseShipping)}
                    </span>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod("express")}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      deliveryMethod === "express"
                        ? "border-burgundy bg-burgundy/5 ring-1 ring-burgundy"
                        : "border-gray-lighter hover:border-burgundy/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          deliveryMethod === "express"
                            ? "border-burgundy bg-burgundy"
                            : "border-gray"
                        }`}
                      >
                        {deliveryMethod === "express" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal">
                          Priority Air Dispatch (1 - 2 Business Days)
                        </p>
                        <p className="text-[11px] text-gray">
                          Priority warehouse dispatch with dedicated packaging
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-charcoal">
                      +₹150
                    </span>
                  </label>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-burgundy/10 shadow-xs space-y-3 text-xs">
                <div className="flex items-center gap-2 font-heading font-bold text-base text-burgundy-dark pb-2 border-b border-burgundy/10">
                  <CreditCard className="w-4 h-4 text-burgundy" />
                  <span>3. Payment Method</span>
                </div>

                <div className="space-y-2.5">
                  <label
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "razorpay"
                        ? "border-burgundy bg-burgundy/5 ring-1 ring-burgundy"
                        : "border-gray-lighter hover:border-burgundy/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                          paymentMethod === "razorpay"
                            ? "border-burgundy bg-burgundy"
                            : "border-gray"
                        }`}
                      >
                        {paymentMethod === "razorpay" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal">
                          Online Payment (Razorpay Secure Checkout)
                        </p>
                        <p className="text-[11px] text-gray mt-0.5">
                          UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking & Wallets
                        </p>
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                      Recommended
                    </span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-burgundy bg-burgundy/5 ring-1 ring-burgundy"
                        : "border-gray-lighter hover:border-burgundy/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                          paymentMethod === "cod"
                            ? "border-burgundy bg-burgundy"
                            : "border-gray"
                        }`}
                      >
                        {paymentMethod === "cod" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal">
                          Cash on Delivery (COD)
                        </p>
                        <p className="text-[11px] text-gray mt-0.5">
                          Pay cash or UPI to the courier agent upon doorstep delivery.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Submit (5 cols) */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-burgundy/10 shadow-xs space-y-5 text-xs">
                <h2 className="font-heading text-lg font-bold text-burgundy-dark pb-3 border-b border-burgundy/10">
                  Order Summary ({items.length} items)
                </h2>

                {/* Items list */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-cream-dark shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="56px"
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-charcoal truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-gray">
                          Size: {item.size} &bull; Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-burgundy-dark">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing totals */}
                <div className="space-y-2 pt-3 border-t border-burgundy/10">
                  <div className="flex justify-between text-gray">
                    <span>Subtotal</span>
                    <span className="text-charcoal font-semibold">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Retail Savings</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray">
                    <span>Delivery Charges</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase text-[10px]">
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
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray text-right">
                    Inclusive of all GST & duties
                  </p>
                </div>

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-burgundy hover:bg-burgundy-dark text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>
                        {paymentMethod === "cod" ? "Place COD Order" : "Pay with Razorpay"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Guarantees */}
                <div className="pt-2 border-t border-burgundy/5 space-y-1.5 text-[11px] text-gray">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% Genuine Handcrafted Fabrics & QC Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-dark shrink-0" />
                    <span>Complimentary Gift Packaging with every order</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
