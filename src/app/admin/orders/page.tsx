"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  Eye,
  X,
  MapPin,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

type AdminOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "paid" | "unpaid";
  total: number;
  created_at: string;
  items: {
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }[];
};

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ord-1",
    order_number: "RG-2026-9812",
    customer_name: "Aarav Sharma",
    customer_email: "aarav.sharma@example.com",
    customer_phone: "+91 98765 12345",
    shipping_address: "14, Gulmohar Enclave, Ring Road",
    city: "New Delhi",
    postal_code: "110049",
    status: "delivered",
    payment_status: "paid",
    total: 14999,
    created_at: "Today, 02:45 PM",
    items: [
      {
        name: "Royal Velvet Embroidered Sherwani",
        size: "40",
        color: "Burgundy",
        quantity: 1,
        price: 14999,
      },
    ],
  },
  {
    id: "ord-2",
    order_number: "RG-2026-9811",
    customer_name: "Priyanka Mehta",
    customer_email: "priyanka.m@example.com",
    customer_phone: "+91 98234 56789",
    shipping_address: "702, Sea Green Apartments, Worli",
    city: "Mumbai",
    postal_code: "400018",
    status: "processing",
    payment_status: "paid",
    total: 18499,
    created_at: "Today, 11:20 AM",
    items: [
      {
        name: "Handwoven Banarasi Katan Silk Saree",
        size: "Free Size",
        color: "Crimson Red",
        quantity: 1,
        price: 18499,
      },
    ],
  },
  {
    id: "ord-3",
    order_number: "RG-2026-9810",
    customer_name: "Vikram Singhania",
    customer_email: "vikram.s@example.com",
    customer_phone: "+91 98111 22334",
    shipping_address: "Flat 4B, Malviya Nagar",
    city: "Jaipur",
    postal_code: "302017",
    status: "shipped",
    payment_status: "paid",
    total: 3499,
    created_at: "Yesterday",
    items: [
      {
        name: "Classic Linen Tailored Kurta Shirt",
        size: "L",
        color: "Warm Sand",
        quantity: 1,
        price: 3499,
      },
    ],
  },
  {
    id: "ord-4",
    order_number: "RG-2026-9809",
    customer_name: "Neha Khurana",
    customer_email: "neha.k@example.com",
    customer_phone: "+91 99988 77665",
    shipping_address: "B-21, Sector 15",
    city: "Chandigarh",
    postal_code: "160015",
    status: "pending",
    payment_status: "paid",
    total: 9999,
    created_at: "06 Oct 2026",
    items: [
      {
        name: "Chanderi Floral Anarkali Suit Set",
        size: "M",
        color: "Blush Rose",
        quantity: 1,
        price: 9999,
      },
    ],
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const handleStatusChange = (orderId: string, newStatus: AdminOrder["status"]) => {
    setOrders(
      orders.map((ord) =>
        ord.id === orderId ? { ...ord, status: newStatus } : ord
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchSearch =
      ord.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      statusFilter === "all" || ord.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-burgundy-dark">
            Orders Management
          </h1>
          <p className="text-xs text-gray mt-1">
            Track fulfillment, update shipping statuses, and view customer order invoices.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-burgundy/10 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-burgundy/20 outline-none focus:border-burgundy bg-cream/20 text-charcoal"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["all", "pending", "processing", "shipped", "delivered"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize whitespace-nowrap transition-all ${
                statusFilter === st
                  ? "bg-burgundy text-white shadow-2xs"
                  : "bg-cream-dark text-charcoal/80 hover:bg-cream"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-burgundy/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-cream-dark/60 border-b border-burgundy/10 text-charcoal font-bold">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items & Details</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-lighter">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-cream/40 transition-colors">
                  {/* Order Number */}
                  <td className="py-3 px-4 font-bold text-burgundy-dark">
                    {ord.order_number}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4">
                    <p className="font-semibold text-charcoal">{ord.customer_name}</p>
                    <p className="text-[10px] text-gray">{ord.city}</p>
                  </td>

                  {/* Items */}
                  <td className="py-3 px-4 max-w-xs truncate text-charcoal/80">
                    {ord.items.map((i) => `${i.name} (${i.size})`).join(", ")}
                  </td>

                  {/* Total Amount */}
                  <td className="py-3 px-4 font-bold text-charcoal">
                    {formatPrice(ord.total)}
                  </td>

                  {/* Payment */}
                  <td className="py-3 px-4">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {ord.payment_status}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) =>
                        handleStatusChange(
                          ord.id,
                          e.target.value as AdminOrder["status"]
                        )
                      }
                      className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${
                        ord.status === "delivered"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : ord.status === "shipped"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : ord.status === "processing"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="p-1.5 text-charcoal/70 hover:text-burgundy hover:bg-cream rounded-lg transition-colors"
                      title="Inspect Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal / Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs">
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-burgundy/10 text-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-burgundy/10">
              <div>
                <span className="text-[10px] text-gray uppercase font-semibold">
                  Order Details
                </span>
                <h3 className="font-heading text-lg font-bold text-burgundy-dark">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-gray hover:text-burgundy"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="p-4 bg-cream/40 rounded-2xl border border-burgundy/10 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-charcoal">
                <MapPin className="w-4 h-4 text-burgundy" /> Shipping & Customer Info
              </div>
              <p className="font-semibold text-charcoal">{selectedOrder.customer_name}</p>
              <p className="text-gray">{selectedOrder.customer_email} &bull; {selectedOrder.customer_phone}</p>
              <p className="text-charcoal/80">
                {selectedOrder.shipping_address}, {selectedOrder.city} — {selectedOrder.postal_code}
              </p>
            </div>

            {/* Ordered Items */}
            <div className="space-y-2">
              <h4 className="font-bold text-charcoal">Ordered Garments</h4>
              <div className="divide-y divide-gray-lighter">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-charcoal">{item.name}</p>
                      <p className="text-[10px] text-gray">
                        Size: {item.size} &bull; Color: {item.color} &bull; Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-burgundy-dark">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total & Status Selector */}
            <div className="pt-3 border-t border-burgundy/10 flex items-center justify-between">
              <div>
                <span className="text-gray block text-[10px]">Total Paid Amount</span>
                <span className="text-lg font-heading font-bold text-burgundy-dark">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray mb-1">
                  Change Status:
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedOrder.id,
                      e.target.value as AdminOrder["status"]
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-burgundy/20 font-semibold bg-white text-xs outline-none focus:border-burgundy"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
