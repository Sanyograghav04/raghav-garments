import React from "react";
import { Sparkles, Truck, ShieldCheck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-burgundy text-cream text-xs sm:text-sm py-2 px-4 border-b border-gold/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-gold-light">
          <Truck className="w-3.5 h-3.5" />
          <span>Complimentary Shipping on Orders Above ₹999</span>
        </div>

        <div className="w-full md:w-auto text-center font-medium tracking-wide flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
          <span>Festive Exclusive: Use code <strong className="text-gold tracking-widest uppercase underline underline-offset-2">RAGHAV15</strong> for 15% off</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-gold-light">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Handcrafted &amp; Authentic</span>
        </div>
      </div>
    </div>
  );
}
