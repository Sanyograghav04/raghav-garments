import React from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

export function TrustSection() {
  const BADGES = [
    {
      icon: Truck,
      title: "Complimentary Shipping",
      desc: "On all orders exceeding ₹999 across India.",
    },
    {
      icon: RotateCcw,
      title: "30-Day Easy Returns",
      desc: "Doorstep pickup & instant exchange guarantee.",
    },
    {
      icon: ShieldCheck,
      title: "100% Secure Payment",
      desc: "Encrypted Razorpay, UPI & card checkout.",
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      desc: "Our styling concierge is here 7 days a week.",
    },
  ];

  return (
    <section className="py-12 bg-cream-dark/50 border-b border-burgundy/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {BADGES.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-2xl bg-cream border border-burgundy/10 shadow-sm hover:border-gold/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-burgundy/10 flex items-center justify-center text-burgundy shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-charcoal text-sm">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-gray mt-0.5 leading-relaxed">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
