import React from "react";
import { Star, CheckCircle } from "lucide-react";
import { MOCK_REVIEWS } from "@/lib/mock-data";

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark mb-2">
            Loved Across India
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-burgundy-dark">
            What Our Patrons Say
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-cream-dark/40 p-8 rounded-3xl border border-burgundy/10 shadow-sm hover:border-gold/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-gold-dark mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-dark text-gold-dark" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-charcoal/90 text-sm leading-relaxed italic mb-6">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Author & Verified Tag */}
              <div className="pt-4 border-t border-burgundy/10 flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-semibold text-charcoal text-sm">
                    {review.name}
                  </h4>
                  <p className="text-xs text-gray">{review.city}</p>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-medium text-burgundy">
                  <CheckCircle className="w-3.5 h-3.5 text-gold-dark" />
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
