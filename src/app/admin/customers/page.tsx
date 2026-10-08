"use client";

import React, { useState } from "react";
import { Users, Search, Mail, Phone, ShoppingBag, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  role: "customer" | "admin";
  joinedDate: string;
};

const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: "cust-1",
    name: "Sanyog Raghav",
    email: "sanyog.raghav@example.com",
    phone: "+91 98765 43210",
    city: "Jaipur, Rajasthan",
    totalOrders: 6,
    totalSpent: 84990,
    role: "admin",
    joinedDate: "Jan 2026",
  },
  {
    id: "cust-2",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 12345",
    city: "New Delhi, Delhi",
    totalOrders: 3,
    totalSpent: 42997,
    role: "customer",
    joinedDate: "Feb 2026",
  },
  {
    id: "cust-3",
    name: "Priyanka Mehta",
    email: "priyanka.m@example.com",
    phone: "+91 98234 56789",
    city: "Mumbai, Maharashtra",
    totalOrders: 2,
    totalSpent: 28498,
    role: "customer",
    joinedDate: "Feb 2026",
  },
  {
    id: "cust-4",
    name: "Vikram Singhania",
    email: "vikram.s@example.com",
    phone: "+91 98111 22334",
    city: "Jaipur, Rajasthan",
    totalOrders: 4,
    totalSpent: 35996,
    role: "customer",
    joinedDate: "Jan 2026",
  },
  {
    id: "cust-5",
    name: "Neha Khurana",
    email: "neha.k@example.com",
    phone: "+91 99988 77665",
    city: "Chandigarh, Punjab",
    totalOrders: 1,
    totalSpent: 9999,
    role: "customer",
    joinedDate: "Mar 2026",
  },
];

export default function AdminCustomersPage() {
  const [customers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-burgundy-dark">
            Customer Directory
          </h1>
          <p className="text-xs text-gray mt-1">
            View registered patrons, lifetime purchase value, and contact profiles.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-burgundy/10 shadow-xs flex items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-burgundy/20 outline-none focus:border-burgundy bg-cream/20 text-charcoal"
          />
        </div>

        <span className="text-gray text-xs">
          Showing <strong className="text-charcoal">{filteredCustomers.length}</strong> patrons
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-burgundy/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-cream-dark/60 border-b border-burgundy/10 text-charcoal font-bold">
                <th className="py-3.5 px-4">Patron Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Lifetime Value</th>
                <th className="py-3.5 px-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-lighter">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-cream/40 transition-colors">
                  {/* Name & Avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-burgundy/10 text-burgundy font-bold text-xs flex items-center justify-center">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-charcoal">
                          {cust.name}
                        </p>
                        <p className="text-[10px] text-gray">Joined {cust.joinedDate}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="py-3 px-4 space-y-0.5">
                    <p className="text-charcoal flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray" /> {cust.email}
                    </p>
                    <p className="text-[10px] text-gray flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray" /> {cust.phone}
                    </p>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4 text-charcoal/80">
                    {cust.city}
                  </td>

                  {/* Total Orders */}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-charcoal bg-cream px-2 py-0.5 rounded border border-burgundy/10">
                      <ShoppingBag className="w-3 h-3 text-burgundy" />
                      {cust.totalOrders} orders
                    </span>
                  </td>

                  {/* Lifetime Value */}
                  <td className="py-3 px-4 font-bold text-burgundy-dark text-sm">
                    {formatPrice(cust.totalSpent)}
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4">
                    {cust.role === "admin" ? (
                      <span className="inline-flex items-center gap-1 bg-burgundy/10 text-burgundy text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase">
                        Customer
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
