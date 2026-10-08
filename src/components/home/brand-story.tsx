import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export function BrandStory() {
  const PILLARS = [
    {
      title: "Master Craftsmanship",
      desc: "Every thread and embroidery motif is meticulously crafted by generational artisans across Varanasi and Jaipur.",
    },
    {
      title: "100% Pure Natural Fabrics",
      desc: "We exclusively source premium katan silk, organic European linen, and royal velvet to ensure unmatched comfort.",
    },
    {
      title: "Modern Tailored Fit",
      desc: "Traditional grandeur reimagined with contemporary cuts that fit effortlessly for everyday wear and grand celebrations.",
    },
  ];

  return (
    <section className="py-20 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-charcoal text-cream rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden border border-gold/30 shadow-2xl">
          {/* Background subtle glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-burgundy/30 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold-light px-3.5 py-1 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>The Raghav Garments Philosophy</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-cream leading-tight">
                Rooted in Heritage, <br />
                <span className="text-gold-light italic">Woven for the Modern World.</span>
              </h2>

              <p className="text-cream-dark/80 text-sm sm:text-base leading-relaxed max-w-xl">
                Founded with a deep love for India&apos;s timeless textile legacy, Raghav Garments brings couture-grade ethnic and contemporary wear directly to your wardrobe without compromise.
              </p>

              {/* 3 Pillars */}
              <div className="space-y-4 pt-2">
                {PILLARS.map((pillar, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-heading font-semibold text-cream text-base">
                        {pillar.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-cream-dark/70 leading-relaxed mt-0.5">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-charcoal font-semibold px-7 py-3 rounded-full text-sm transition-all duration-300 shadow-md"
                >
                  <span>Explore The Brand Heritage</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold/40 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
                  alt="Raghav Garments Artisanal Craftsmanship"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 80vw, 400px"
                />
              </div>

              {/* Floating Stat Box */}
              <div className="absolute -bottom-4 -left-4 bg-burgundy/95 backdrop-blur-md p-4 rounded-xl border border-gold/40 shadow-xl text-center">
                <p className="text-2xl font-heading font-bold text-cream">25+ Years</p>
                <p className="text-[11px] uppercase tracking-wider text-gold-light">Of Trusted Legacy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
