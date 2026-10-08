import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const CATEGORY_ITEMS = [
  {
    title: "Women's Collection",
    subtitle: "Sarees, Lehengas & Anarkalis",
    href: "/women",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    badge: "120+ Styles",
  },
  {
    title: "Men's Collection",
    subtitle: "Sherwanis, Kurtas & Linens",
    href: "/men",
    image: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80",
    badge: "95+ Styles",
  },
  {
    title: "Kids' Collection",
    subtitle: "Festive Sets & Celebrations",
    href: "/kids",
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
    badge: "60+ Styles",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-16 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark mb-2">
            Curated For The Entire Family
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-burgundy-dark">
            Shop by Category
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORY_ITEMS.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group relative h-[420px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-burgundy/10"
            >
              {/* Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />

              {/* Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-burgundy text-[11px] font-bold px-3 py-1 rounded-full">
                {item.badge}
              </div>

              {/* Content at bottom */}
              <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white group-hover:text-gold-light transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-cream-dark/80 text-xs sm:text-sm mt-1">
                    {item.subtitle}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-cream/90 group-hover:bg-gold text-burgundy group-hover:text-charcoal flex items-center justify-center transition-all duration-300 shadow-md">
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
