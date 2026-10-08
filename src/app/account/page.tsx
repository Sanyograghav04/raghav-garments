"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
  Shield,
  Save,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const { user, profile, isLoading, signOut, initialize, initialized } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"profile" | "addresses">("profile");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && !initialized) {
    return (
      <div className="min-h-[70vh] bg-cream flex items-center justify-center text-xs text-gray">
        Loading account profile...
      </div>
    );
  }

  // If not logged in, show Guest / Sign-in prompt
  if (!user) {
    return (
      <div className="min-h-[70vh] bg-cream py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-burgundy/10 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-bold text-burgundy-dark">
              Access Your Account
            </h2>
            <p className="text-xs text-gray leading-relaxed">
              Please sign in to view your orders, saved addresses, and tailored recommendations.
            </p>
          </div>
          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold py-3 px-6 rounded-xl shadow-sm block transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="w-full bg-cream hover:bg-cream-dark text-charcoal border border-burgundy/20 text-xs font-semibold py-3 px-6 rounded-xl block transition-colors"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header greeting */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-burgundy/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-burgundy text-white font-heading font-bold text-xl flex items-center justify-center shadow-md">
              {(profile?.full_name || user.email || "R").charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-xs text-gray">Welcome back,</span>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-burgundy-dark">
                {profile?.full_name || user.email?.split("@")[0]}
              </h1>
              <span className="text-xs text-gray">{user.email}</span>
            </div>
          </div>

          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 bg-burgundy text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:bg-burgundy-dark transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
          )}
        </div>

        {/* Account Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          {/* Sidebar Menu - 4 cols */}
          <aside className="lg:col-span-4 bg-white p-6 rounded-3xl border border-burgundy/10 shadow-xs space-y-2 text-xs">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-burgundy text-white shadow-xs"
                  : "text-charcoal hover:bg-cream"
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4" />
                <span>Personal Profile</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <Link
              href="/account/orders"
              className="w-full flex items-center justify-between p-3.5 rounded-xl font-medium text-charcoal hover:bg-cream transition-colors"
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-burgundy" />
                <span>My Orders & Tracking</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </Link>

            <Link
              href="/account/addresses"
              className="w-full flex items-center justify-between p-3.5 rounded-xl font-medium text-charcoal hover:bg-cream transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-burgundy" />
                <span>Saved Delivery Addresses</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </Link>

            <Link
              href="/wishlist"
              className="w-full flex items-center justify-between p-3.5 rounded-xl font-medium text-charcoal hover:bg-cream transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-burgundy" />
                <span>Saved Wishlist</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </Link>

            <div className="pt-4 border-t border-burgundy/10">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Tab Content - 8 cols */}
          <main className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-burgundy/10 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-burgundy/10">
              <div>
                <h2 className="font-heading text-xl font-bold text-burgundy-dark">
                  Profile Details
                </h2>
                <p className="text-xs text-gray">
                  Manage your personal details for faster checkout and deliveries.
                </p>
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/20 bg-cream/30 text-charcoal outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/20 bg-cream/30 text-charcoal outline-none focus:border-burgundy"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email || ""}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-lighter bg-gray-50 text-gray cursor-not-allowed"
                />
                <span className="text-[10px] text-gray mt-1 block">
                  Email address cannot be changed directly.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-burgundy hover:bg-burgundy-dark text-white font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
