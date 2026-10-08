"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Store,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/lib/constants";
import { AnnouncementBar } from "./announcement-bar";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

const MOBILE_CATEGORIES = [
  { label: "Home", href: "/" },
  { label: "Men's Collection", href: "/men", badge: "Sherwanis & Kurtas" },
  { label: "Women's Collection", href: "/women", badge: "Banarasi & Lehengas" },
  { label: "Kids' Celebration", href: "/kids", badge: "Boys & Girls Festive" },
  { label: "All Collections", href: "/collections" },
  { label: "Seasonal Festive Sale", href: "/sale", highlight: true, badge: "Up to 35% Off" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { openCart, getTotalCount: getCartCount } = useCartStore();
  const { getTotalCount: getWishlistCount } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and search when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  const cartCount = mounted ? getCartCount() : 0;
  const wishlistCount = mounted ? getWishlistCount() : 0;

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        <AnnouncementBar />

        <nav
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? "bg-cream/95 backdrop-blur-md shadow-md py-3 border-b border-burgundy/10"
              : "bg-cream py-4 border-b border-burgundy/5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-burgundy-dark hover:text-burgundy transition-colors rounded-lg active:scale-95"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-burgundy" />
                ) : (
                  <Menu className="w-6 h-6 text-burgundy" />
                )}
              </button>
            </div>

            {/* Logo */}
            <Link href="/" className="flex flex-col items-center group text-center">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-wider text-burgundy-dark group-hover:text-burgundy transition-colors">
                RAGHAV
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-gold-dark -mt-1">
                GARMENTS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {[
                { label: "Home", href: "/" },
                { label: "Men", href: "/men" },
                { label: "Women", href: "/women" },
                { label: "Kids", href: "/kids" },
                { label: "Collections", href: "/collections" },
                { label: "Sale", href: "/sale" },
              ].map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition-all relative py-1 ${
                      isActive
                        ? "text-burgundy font-semibold"
                        : "text-charcoal/80 hover:text-burgundy"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-burgundy rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-charcoal/80 hover:text-burgundy transition-colors rounded-full hover:bg-burgundy/5"
                aria-label="Search garments"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 text-charcoal/80 hover:text-burgundy transition-colors rounded-full hover:bg-burgundy/5 relative"
                aria-label="View Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-burgundy text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="p-2 text-charcoal/80 hover:text-burgundy transition-colors rounded-full hover:bg-burgundy/5 relative cursor-pointer"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-gold-dark text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Account */}
              <Link
                href="/account"
                className="p-2 text-charcoal/80 hover:text-burgundy transition-colors rounded-full hover:bg-burgundy/5 hidden sm:flex"
                aria-label="Account profile"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Search Bar dropdown */}
          {searchOpen && (
            <div className="border-t border-burgundy/10 bg-cream-dark/95 backdrop-blur-md px-4 py-3 shadow-inner">
              <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
                <Search className="w-5 h-5 text-gray shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sherwanis, banarasi sarees, linen shirts, kids lehengas..."
                  className="w-full bg-transparent border-none outline-none text-charcoal placeholder-gray text-sm focus:ring-0"
                  autoFocus
                />
                <button
                  type="submit"
                  className="text-xs uppercase bg-burgundy text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-burgundy-dark transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-xs text-gray hover:text-charcoal p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </nav>
      </header>

      {/* Full-Featured Mobile Slide-Out Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs"
            />

            {/* Slide-out Panel from Left */}
            <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="w-screen max-w-xs sm:max-w-sm bg-cream shadow-2xl flex flex-col justify-between border-r border-burgundy/10"
              >
                <div>
                  {/* Header */}
                  <div className="p-5 border-b border-burgundy/10 flex items-center justify-between bg-cream-dark/50">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col"
                    >
                      <span className="font-heading text-lg font-bold tracking-wider text-burgundy-dark">
                        RAGHAV
                      </span>
                      <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-gold-dark -mt-1">
                        GARMENTS
                      </span>
                    </Link>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-charcoal/70 hover:text-burgundy rounded-full hover:bg-burgundy/5"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5 text-burgundy" />
                    </button>
                  </div>

                  {/* Mobile Search Bar */}
                  <div className="p-4 border-b border-burgundy/10 bg-white">
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search attire, fabric, collection..."
                        className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-burgundy/20 bg-cream/30 text-charcoal outline-none focus:border-burgundy"
                      />
                      <Search className="w-4 h-4 text-gray absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </form>
                  </div>

                  {/* Category Navigation Links */}
                  <div className="p-4 space-y-1 text-xs">
                    <div className="text-[10px] uppercase font-bold text-gray tracking-wider px-3 pb-1">
                      Shop by Category
                    </div>
                    {MOBILE_CATEGORIES.map((cat) => {
                      const isActive = pathname === cat.href;
                      return (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                            cat.highlight
                              ? "bg-burgundy/10 text-burgundy font-bold border border-burgundy/20"
                              : isActive
                              ? "bg-burgundy text-white font-bold shadow-xs"
                              : "text-charcoal hover:bg-cream-dark font-medium"
                          }`}
                        >
                          <div>
                            <span className="text-sm">{cat.label}</span>
                            {cat.badge && (
                              <span
                                className={`block text-[10px] mt-0.5 ${
                                  isActive ? "text-white/80" : "text-gray font-normal"
                                }`}
                              >
                                {cat.badge}
                              </span>
                            )}
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 ${
                              isActive ? "text-white" : "text-gray/50"
                            }`}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Quick Actions & Support */}
                <div className="p-4 border-t border-burgundy/10 bg-cream-dark/40 space-y-2 text-xs">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-burgundy/10 font-semibold text-charcoal hover:text-burgundy shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-burgundy" /> My Account & Orders
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray" />
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-burgundy/5 border border-burgundy/10 font-semibold text-burgundy shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-burgundy" /> Merchant Admin Portal
                    </span>
                    <ChevronRight className="w-4 h-4 text-burgundy/50" />
                  </Link>

                  <div className="pt-2 text-center">
                    <p className="text-[10px] text-gray">{SITE.tagline}</p>
                    <p className="text-[10px] text-burgundy font-semibold mt-0.5">
                      Complimentary Shipping on Orders Above ₹999
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
