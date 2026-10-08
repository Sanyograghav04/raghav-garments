"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-16 bg-cream border-t border-burgundy/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-burgundy via-burgundy-dark to-burgundy text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-xl border border-gold/30 text-center relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-2xl mx-auto relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1 rounded-full text-gold-light text-xs font-semibold">
              <Mail className="w-3.5 h-3.5" />
              <span>Privileged Access</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-cream">
              Enjoy 15% Off Your First Order
            </h2>

            <p className="text-cream-dark/80 text-sm sm:text-base leading-relaxed">
              Subscribe to receive exclusive invitations to couture drops, private sale access, and styling inspirations.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 bg-cream text-burgundy font-semibold px-6 py-3 rounded-full text-sm shadow-md animate-fadeIn">
                <Check className="w-4 h-4 text-gold-dark" />
                <span>Thank you! Your exclusive voucher has been reserved.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-white text-charcoal placeholder-gray px-5 py-3.5 rounded-full text-sm outline-none focus:ring-2 focus:ring-gold transition-all"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gold hover:bg-gold-light text-charcoal font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <p className="text-[11px] text-cream-dark/60">
              We respect your privacy. Unsubscribe anytime with one click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
