"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { AnnouncementBar } from "./announcement-bar";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const cartCount = mounted ? getCartCount() : 0;
  const wishlistCount = mounted ? getWishlistCount() : 0;

  return (
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
              className="p-2 text-burgundy-dark hover:text-burgundy transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            {NAV_LINKS.map((link) => {
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
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-burgundy rounded-full animate-fadeIn" />
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
                <span className="absolute top-1 right-1 bg-burgundy text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-scaleIn">
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
                <span className="absolute top-1 right-1 bg-gold-dark text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-scaleIn">
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

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-full bg-cream border-b border-burgundy/10 shadow-xl px-6 py-6 transition-all duration-300">
            <div className="flex flex-col space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-charcoal hover:text-burgundy py-2 border-b border-burgundy/5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col space-y-2">
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between text-sm font-medium text-charcoal hover:text-burgundy py-1"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-burgundy" /> Saved Wishlist
                  </span>
                  {wishlistCount > 0 && (
                    <span className="bg-burgundy text-white text-xs px-2 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCart();
                  }}
                  className="flex items-center justify-between text-sm font-medium text-charcoal hover:text-burgundy py-1 text-left"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-gold-dark" /> Shopping Bag
                  </span>
                  {cartCount > 0 && (
                    <span className="bg-gold-dark text-white text-xs px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-sm font-medium text-burgundy py-1 pt-2 border-t border-burgundy/5"
                >
                  <User className="w-4 h-4" /> My Account
                </Link>
                <span className="text-[11px] text-gray pt-1">{SITE.tagline}</span>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
