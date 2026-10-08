"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { AnnouncementBar } from "./announcement-bar";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
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
          <div className="flex items-center space-x-3 sm:space-x-4">
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
              href="/account/wishlist"
              className="p-2 text-charcoal/80 hover:text-burgundy transition-colors rounded-full hover:bg-burgundy/5 relative"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-burgundy text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 text-charcoal/80 hover:text-burgundy transition-colors rounded-full hover:bg-burgundy/5 relative"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-gold-dark text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>

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
          <div className="border-t border-burgundy/10 bg-cream-dark/95 backdrop-blur-md px-4 py-3">
            <div className="max-w-2xl mx-auto flex items-center gap-2">
              <Search className="w-5 h-5 text-gray" />
              <input
                type="text"
                placeholder="Search sherwanis, sarees, kurtas, suits..."
                className="w-full bg-transparent border-none outline-none text-charcoal placeholder-gray text-sm focus:ring-0"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs uppercase text-burgundy font-semibold hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-full bg-cream border-b border-burgundy/10 shadow-xl px-6 py-6 transition-all duration-300">
            <div className="flex flex-col space-y-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-charcoal hover:text-burgundy py-2 border-b border-burgundy/5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex items-center justify-between">
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-sm font-medium text-burgundy"
                >
                  <User className="w-4 h-4" /> My Account
                </Link>
                <span className="text-xs text-gray">{SITE.tagline}</span>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
