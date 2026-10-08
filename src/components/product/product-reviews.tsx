"use client";

import React, { useState } from "react";
import { Star, CheckCircle, MessageSquare, ThumbsUp, X } from "lucide-react";
import { ProductReview } from "@/types/product";

interface ProductReviewsProps {
  productId: string;
  productName: string;
  rating: number;
  reviewCount: number;
  initialReviews?: ProductReview[];
}

export function ProductReviews({
  productName,
  rating,
  reviewCount,
  initialReviews = [],
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>(
    initialReviews.length > 0
      ? initialReviews
      : [
          {
            id: "rev-mock-1",
            author: "Aarav Sharma",
            rating: 5,
            date: "14 Feb 2026",
            title: "Superb luxury finish!",
            comment:
              "The stitching and material quality exceeded my expectations. Looked incredible in real lighting during the evening function.",
            verified: true,
            sizePurchased: "40",
          },
          {
            id: "rev-mock-2",
            author: "Meera Kapoor",
            rating: 5,
            date: "02 Feb 2026",
            title: "Great fit and fast dispatch",
            comment:
              "Ordered this for a destination wedding. Delivery was swift, packaging was pristine, and fit was spot on.",
            verified: true,
            sizePurchased: "M",
          },
        ]
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      date: "Just now",
      title: newTitle || "Verified Customer Review",
      comment: newComment,
      verified: true,
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setNewAuthor("");
      setNewTitle("");
      setNewComment("");
    }, 1200);
  };

  return (
    <section id="reviews" className="pt-12 border-t border-burgundy/10">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-burgundy-dark mb-8 text-center sm:text-left">
          Customer Reviews & Ratings
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Rating Summary Box */}
          <div className="lg:col-span-4 bg-cream-dark/50 p-6 rounded-2xl border border-burgundy/10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="text-4xl sm:text-5xl font-extrabold text-burgundy-dark font-heading">
                {rating.toFixed(1)}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(rating)
                          ? "fill-gold-dark text-gold-dark"
                          : "text-gray-lighter"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray mt-1">
                  Based on {reviewCount} verified ratings
                </p>
              </div>
            </div>

            {/* Breakdown bars */}
            <div className="space-y-2 text-xs">
              {[
                { star: 5, pct: 85 },
                { star: 4, pct: 10 },
                { star: 3, pct: 3 },
                { star: 2, pct: 1 },
                { star: 1, pct: 1 },
              ].map((b) => (
                <div key={b.star} className="flex items-center gap-3">
                  <span className="w-12 text-gray font-medium">{b.star} Star</span>
                  <div className="flex-1 h-2 bg-gray-lighter rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-dark rounded-full"
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-gray">{b.pct}%</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="w-full bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-8 space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-5 rounded-2xl border border-burgundy/10 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-burgundy/10 text-burgundy font-bold text-xs flex items-center justify-center uppercase">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-charcoal text-sm">
                        {rev.author}
                      </span>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 ml-2 font-medium">
                          <CheckCircle className="w-3 h-3 fill-emerald-100" />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray">{rev.date}</span>
                </div>

                {/* Rating stars & size info */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating
                            ? "fill-gold-dark text-gold-dark"
                            : "text-gray-lighter"
                        }`}
                      />
                    ))}
                  </div>
                  {rev.sizePurchased && (
                    <span className="text-[11px] bg-cream-dark px-2 py-0.5 rounded text-charcoal font-medium">
                      Size: {rev.sizePurchased}
                    </span>
                  )}
                </div>

                {/* Review text */}
                <h4 className="font-heading font-semibold text-charcoal text-sm pt-1">
                  {rev.title}
                </h4>
                <p className="text-xs text-charcoal/80 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs">
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-burgundy/10">
            <div className="flex items-center justify-between pb-3 border-b border-burgundy/10">
              <h3 className="font-heading text-lg font-bold text-burgundy-dark">
                Review {productName}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray hover:text-burgundy"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-heading font-bold text-base text-charcoal">
                  Thank you for your review!
                </h4>
                <p className="text-xs text-gray">
                  Your feedback helps other shoppers choose authentic garments.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4 pt-4 text-xs">
                {/* Rating selection */}
                <div>
                  <label className="block font-semibold text-charcoal mb-1">
                    Your Rating:
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setNewRating(s)}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= newRating
                              ? "fill-gold-dark text-gold-dark"
                              : "text-gray-lighter"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Sanyog Raghav"
                    className="w-full px-3 py-2 border border-burgundy/20 rounded-lg outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">
                    Review Headline:
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Exquisite fabric and perfect tailoring"
                    className="w-full px-3 py-2 border border-burgundy/20 rounded-lg outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">
                    Your Experience / Comments:
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share details about the fabric, color, fit, or styling..."
                    className="w-full px-3 py-2 border border-burgundy/20 rounded-lg outline-none focus:border-burgundy"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-lighter text-gray hover:text-charcoal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-burgundy hover:bg-burgundy-dark text-white font-semibold shadow-xs"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
