"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, ArrowLeft, Plus, Trash2, CheckCircle2 } from "lucide-react";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: "addr-1",
      fullName: "Sanyog Raghav",
      phone: "+91 98765 43210",
      street: "104, Heritage Palms Residency, Civil Lines",
      city: "Jaipur",
      state: "Rajasthan",
      postalCode: "302006",
      isDefault: true,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newPostal, setNewPostal] = useState("");

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPostal) return;

    setAddresses([
      ...addresses,
      {
        id: `addr-${Date.now()}`,
        fullName: "Sanyog Raghav",
        phone: "+91 98765 43210",
        street: newStreet,
        city: newCity,
        state: newState || "Delhi",
        postalCode: newPostal,
        isDefault: false,
      },
    ]);
    setShowAddForm(false);
    setNewStreet("");
    setNewCity("");
    setNewState("");
    setNewPostal("");
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-burgundy/10">
          <div>
            <Link
              href="/account"
              className="text-xs text-burgundy font-semibold hover:underline flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Account
            </Link>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-burgundy-dark">
              Saved Delivery Addresses
            </h1>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>

        {/* Add Address Form Modal / Box */}
        {showAddForm && (
          <form
            onSubmit={handleAddAddress}
            className="bg-white p-6 rounded-2xl border border-burgundy/20 shadow-md space-y-4 text-xs"
          >
            <h3 className="font-heading font-bold text-base text-burgundy-dark">
              Add New Delivery Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-charcoal mb-1">
                  Street Address & House No.
                </label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="Flat / House no, Building name, Street"
                  className="w-full px-3 py-2 border border-burgundy/20 rounded-xl outline-none focus:border-burgundy"
                />
              </div>
              <div>
                <label className="block font-semibold text-charcoal mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. New Delhi"
                  className="w-full px-3 py-2 border border-burgundy/20 rounded-xl outline-none focus:border-burgundy"
                />
              </div>
              <div>
                <label className="block font-semibold text-charcoal mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  placeholder="e.g. Delhi"
                  className="w-full px-3 py-2 border border-burgundy/20 rounded-xl outline-none focus:border-burgundy"
                />
              </div>
              <div>
                <label className="block font-semibold text-charcoal mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={newPostal}
                  onChange={(e) => setNewPostal(e.target.value)}
                  placeholder="110001"
                  className="w-full px-3 py-2 border border-burgundy/20 rounded-xl outline-none focus:border-burgundy"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-lighter rounded-xl text-gray"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-burgundy hover:bg-burgundy-dark text-white rounded-xl font-semibold"
              >
                Save Address
              </button>
            </div>
          </form>
        )}

        {/* Addresses list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white p-6 rounded-2xl border border-burgundy/10 shadow-xs space-y-3 relative text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-burgundy/10">
                  <span className="font-heading font-bold text-sm text-charcoal flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-burgundy" /> {addr.fullName}
                  </span>
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Default
                    </span>
                  )}
                </div>

                <div className="pt-2 text-charcoal/80 space-y-1">
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} — {addr.postalCode}
                  </p>
                  <p className="text-gray font-medium">Phone: {addr.phone}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-burgundy/5 flex justify-end">
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="text-gray hover:text-red-600 transition-colors p-1"
                  aria-label="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
