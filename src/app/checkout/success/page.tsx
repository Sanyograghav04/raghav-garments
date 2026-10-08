"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Package,
  ArrowRight,
  ShieldCheck,
  Truck,
  PhoneCall,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || `RG-${new Date().getFullYear()}-8492`;
  const paymentId = searchParams.get("paymentId");
  const method = searchParams.get("method");
  const total = Number(searchParams.get("total")) || 14999;

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 4);
  const formattedDeliveryDate = estimatedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-cream py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Animated Badge */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-burgundy font-semibold">
            Order Confirmed & Placed
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-burgundy-dark">
            Thank You for Shopping with Raghav Garments!
          </h1>
          <p className="text-xs sm:text-sm text-gray max-w-md mx-auto">
            Your handcrafted garments have entered tailored processing and will be dispatched promptly.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-burgundy/10 shadow-sm text-left text-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-burgundy/10">
            <div>
              <span className="text-gray block text-[10px] uppercase font-semibold">
                Order Reference
              </span>
              <strong className="text-burgundy-dark font-heading text-lg font-bold">
                {orderNumber}
              </strong>
            </div>

            <div className="text-right">
              <span className="text-gray block text-[10px] uppercase font-semibold">
                Amount Paid
              </span>
              <strong className="text-charcoal font-bold text-base">
                {formatPrice(total)}
              </strong>
            </div>
          </div>

          {paymentId && (
            <div className="flex justify-between text-gray text-[11px] pb-2 border-b border-gray-lighter">
              <span>Razorpay Transaction ID:</span>
              <span className="font-mono text-charcoal">{paymentId}</span>
            </div>
          )}

          {method === "cod" && (
            <div className="flex justify-between text-amber-800 text-[11px] pb-2 border-b border-gray-lighter bg-amber-50/50 p-2 rounded-lg">
              <span>Payment Mode:</span>
              <span className="font-semibold">Cash on Delivery (Pay upon arrival)</span>
            </div>
          )}

          {/* Delivery timeline */}
          <div className="flex items-start gap-3 p-4 bg-cream/50 rounded-2xl border border-burgundy/10">
            <Truck className="w-5 h-5 text-burgundy shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-charcoal">
                Estimated Delivery: {formattedDeliveryDate}
              </p>
              <p className="text-gray text-[11px]">
                You will receive real-time SMS & Email tracking updates once your package leaves our boutique.
              </p>
            </div>
          </div>

          {/* Support Helpline */}
          <div className="flex items-center justify-between pt-2 text-[11px] text-gray">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-burgundy" /> Need help? Call Concierge: +91 (800) 123-4567
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 30-Day Easy Returns
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/account/orders"
            className="bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold px-6 py-3.5 rounded-full shadow-md transition-all inline-flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Track Order in Account</span>
          </Link>

          <Link
            href="/collections"
            className="bg-white hover:bg-cream-dark text-charcoal border border-burgundy/20 text-xs font-semibold px-6 py-3.5 rounded-full shadow-2xs transition-all inline-flex items-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center text-xs text-gray">Loading confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
