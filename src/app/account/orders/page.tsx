"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Package, ArrowLeft, ExternalLink, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function OrdersPage() {
  const [orders] = useState([
    {
      id: "ord-1001",
      order_number: "RG-2026-8492",
      date: "04 Oct 2026",
      status: "Delivered",
      total: 14999,
      itemCount: 1,
      items: [
        {
          name: "Royal Velvet Embroidered Sherwani",
          size: "40",
          color: "Burgundy",
          price: 14999,
        },
      ],
    },
  ]);

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-burgundy/10">
          <div>
            <Link
              href="/account"
              className="text-xs text-burgundy font-semibold hover:underline flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Account
            </Link>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-burgundy-dark">
              Order History & Tracking
            </h1>
          </div>
        </div>

        {/* Orders list */}
        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-burgundy/10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="font-heading text-lg font-bold text-charcoal">
              No orders placed yet
            </h2>
            <p className="text-xs text-gray max-w-sm mx-auto">
              When you order handcrafted sherwanis, sarees, or festive wear, your orders will appear here.
            </p>
            <Link
              href="/collections"
              className="inline-block bg-burgundy text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-burgundy-dark transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white p-6 rounded-2xl border border-burgundy/10 shadow-xs space-y-4 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-burgundy/10">
                  <div>
                    <span className="text-gray">Order ID: </span>
                    <strong className="text-charcoal font-semibold">{ord.order_number}</strong>
                    <span className="text-gray/50 mx-2">&bull;</span>
                    <span className="text-gray">{ord.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full text-[11px]">
                      <Clock className="w-3 h-3" /> {ord.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {ord.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-charcoal"
                    >
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-[11px] text-gray">
                          Size: {item.size} &bull; Color: {item.color}
                        </div>
                      </div>
                      <div className="font-bold text-burgundy-dark">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-burgundy/10">
                  <span className="font-bold text-charcoal">
                    Total: <strong className="text-burgundy-dark">{formatPrice(ord.total)}</strong>
                  </span>

                  <button className="text-burgundy font-semibold hover:underline inline-flex items-center gap-1">
                    <span>View Invoice</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
