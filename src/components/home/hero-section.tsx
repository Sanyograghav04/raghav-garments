"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Award } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream to-cream-dark/60 py-12 lg:py-20 border-b border-burgundy/5">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-burgundy/10 border border-burgundy/20 px-4 py-1.5 rounded-full text-burgundy text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-gold-dark" />
              <span>The Royal Couture Collection 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-burgundy-dark tracking-tight leading-[1.15]">
              Where Royal Heritage Meets{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-burgundy via-gold-dark to-burgundy italic">
                Modern Luxury.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-charcoal/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover bespoke ethnic couture, handwoven Banarasi silks, and impeccably tailored everyday essentials designed for Men, Women &amp; Kids.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/women"
                className="w-full sm:w-auto bg-burgundy hover:bg-burgundy-dark text-white font-medium px-8 py-3.5 rounded-full shadow-lg shadow-burgundy/20 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base group"
              >
                <span>Shop Women&apos;s Couture</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/men"
                className="w-full sm:w-auto bg-white/80 hover:bg-white text-burgundy border border-burgundy/30 font-medium px-8 py-3.5 rounded-full hover:border-burgundy transition-all duration-300 flex items-center justify-center text-sm sm:text-base shadow-sm"
              >
                Explore Men&apos;s Wear
              </Link>
            </div>

            {/* Micro Trust Proof */}
            <div className="pt-6 border-t border-burgundy/10 flex items-center justify-center lg:justify-start gap-8 text-xs text-charcoal/70">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-dark" />
                <span>Authentic Handloom Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-burgundy text-sm">50,000+</span>
                <span>Happy Patrons Across India</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Primary Hero Image Container */}
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"
                alt="Raghav Garments Festive Collection"
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 1024px) 90vw, 450px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
            </div>

            {/* Floating Highlight Card */}
            <div className="absolute -bottom-6 -left-4 sm:left-4 bg-cream/95 backdrop-blur-md p-4 rounded-2xl border border-gold/30 shadow-xl max-w-[200px] sm:max-w-[230px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-burgundy flex items-center justify-center text-gold font-bold text-xs shrink-0">
                  RG
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gold-dark font-semibold">
                    New Arrival
                  </p>
                  <p className="font-heading font-bold text-charcoal text-xs sm:text-sm">
                    Pure Silk Banarasi
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Tag */}
            <div className="absolute top-6 -right-2 sm:right-2 bg-burgundy text-cream text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg border border-gold/40">
              Up to 30% Off
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
