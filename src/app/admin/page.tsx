"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Package,
  Plus,
  ExternalLink,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/product";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("products").select("*");
        if (data && data.length > 0) {
          setProducts(data as Product[]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalCatalogValue = products.reduce(
    (acc, p) => acc + p.price * (p.stock_count || 10),
    0
  );
  const lowStockCount = products.filter((p) => p.stock_count <= 8).length;

  const mockRecentOrders = [
    {
      id: "ord-101",
      order_number: "RG-2026-9812",
      customer: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      items: "Royal Velvet Embroidered Sherwani (Size 40)",
      total: 14999,
      status: "Delivered",
      date: "Today, 02:45 PM",
    },
    {
      id: "ord-102",
      order_number: "RG-2026-9811",
      customer: "Priyanka Mehta",
      email: "priyanka.m@example.com",
      items: "Handwoven Banarasi Katan Silk Saree",
      total: 18499,
      status: "Processing",
      date: "Today, 11:20 AM",
    },
    {
      id: "ord-103",
      order_number: "RG-2026-9810",
      customer: "Vikram Singhania",
      email: "vikram.s@example.com",
      items: "Classic Linen Tailored Kurta Shirt (L)",
      total: 3499,
      status: "Shipped",
      date: "Yesterday",
    },
    {
      id: "ord-104",
      order_number: "RG-2026-9809",
      customer: "Neha Khurana",
      email: "neha.k@example.com",
      items: "Chanderi Floral Anarkali Suit Set (M)",
      total: 9999,
      status: "Delivered",
      date: "06 Oct 2026",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-burgundy-dark">
            Executive Merchant Dashboard
          </h1>
          <p className="text-xs text-gray mt-1">
            Real-time sales overview, inventory management, and fulfillment status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products?action=new"
            className="inline-flex items-center gap-2 bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Garment</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-white border border-burgundy/20 text-charcoal text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-2xs hover:bg-cream transition-colors"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-3xl border border-burgundy/10 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-gray">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-charcoal font-heading">
              ₹1,84,500
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% from last month
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-3xl border border-burgundy/10 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-gray">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-charcoal font-heading">
              128 Orders
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> 94% fulfillment rate
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-3xl border border-burgundy/10 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-gray">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Active Garments
            </span>
            <div className="w-9 h-9 rounded-full bg-gold/15 text-gold-dark flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-charcoal font-heading">
              {products.length} Products
            </div>
            <p className="text-[11px] text-gray mt-1">
              Catalog value: {formatPrice(totalCatalogValue)}
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-6 rounded-3xl border border-burgundy/10 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-gray">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Low Stock Alert
            </span>
            <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700 font-heading">
              {lowStockCount} Items
            </div>
            <p className="text-[11px] text-gray mt-1">
              Requires inventory replenishment
            </p>
          </div>
        </div>
      </div>

      {/* Main Tables Grid: Recent Orders (8 cols) + Best Sellers (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-burgundy/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-burgundy/10">
            <h2 className="font-heading text-lg font-bold text-burgundy-dark">
              Recent Customer Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-burgundy hover:underline font-semibold"
            >
              View All Orders &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-burgundy/10 text-gray font-semibold">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Item Details</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-lighter">
                {mockRecentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3 font-semibold text-burgundy-dark">
                      {ord.order_number}
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-charcoal">{ord.customer}</div>
                      <div className="text-[10px] text-gray">{ord.date}</div>
                    </td>
                    <td className="py-3 text-charcoal/80 max-w-xs truncate">
                      {ord.items}
                    </td>
                    <td className="py-3 font-bold text-charcoal">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          ord.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-800"
                            : ord.status === "Shipped"
                            ? "bg-blue-50 text-blue-800"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best-Selling Garments */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-burgundy/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-burgundy/10">
            <h2 className="font-heading text-lg font-bold text-burgundy-dark">
              Top Trending Garments
            </h2>
            <Link
              href="/admin/products"
              className="text-xs text-burgundy hover:underline font-semibold"
            >
              Inventory
            </Link>
          </div>

          <div className="space-y-3.5">
            {products.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-charcoal truncate">{p.name}</p>
                  <p className="text-[10px] text-gray capitalize">
                    {p.category} &bull; {p.subcategory}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-burgundy-dark">
                    {formatPrice(p.price)}
                  </p>
                  <p
                    className={`text-[10px] font-medium ${
                      p.stock_count <= 8 ? "text-amber-600" : "text-emerald-700"
                    }`}
                  >
                    {p.stock_count} in stock
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
