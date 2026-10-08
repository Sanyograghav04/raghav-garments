"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MapPin,
  Check,
} from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { SizeGuideModal } from "./size-guide-modal";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Accordion open states
  const [openSection, setOpenSection] = useState<string>("details");

  // Pincode delivery checker simulation
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<null | {
    valid: boolean;
    date: string;
  }>(null);

  const [addedAnimation, setAddedAnimation] = useState(false);

  const isLiked = isInWishlist(product.id);
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize, selectedColor, quantity);
    router.push("/cart");
  };

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      const formatted = deliveryDate.toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      setPincodeStatus({ valid: true, date: formatted });
    } else {
      setPincodeStatus({ valid: false, date: "" });
    }
  };

  const toggleAccordion = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Category, SKU & Title */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray mb-2">
          <span className="uppercase tracking-wider font-semibold text-burgundy">
            {product.category} &bull; {product.subcategory}
          </span>
          {product.sku && <span className="text-gray/70">SKU: {product.sku}</span>}
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal leading-tight">
          {product.name}
        </h1>

        {/* Ratings & Reviews summary */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1 bg-burgundy/10 px-2.5 py-1 rounded-md text-burgundy-dark font-semibold text-xs">
            <Star className="w-3.5 h-3.5 fill-gold-dark text-gold-dark" />
            <span>{product.rating}</span>
          </div>
          <a
            href="#reviews"
            className="text-xs text-gray hover:text-burgundy underline transition-colors"
          >
            {product.reviewCount} Verified Reviews
          </a>
          <span className="text-gray/40">&bull;</span>
          <span className="text-xs text-emerald-700 font-medium">
            {product.in_stock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Pricing */}
      <div className="p-4 rounded-xl bg-cream-dark/60 border border-burgundy/10 flex items-baseline gap-3">
        <span className="text-3xl font-bold text-burgundy-dark font-heading">
          {formatPrice(product.price)}
        </span>
        {product.compare_price && (
          <>
            <span className="text-base text-gray line-through">
              {formatPrice(product.compare_price)}
            </span>
            <span className="bg-burgundy text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              Save {discount}% ({formatPrice(product.compare_price - product.price)})
            </span>
          </>
        )}
      </div>

      {/* Short description */}
      <p className="text-sm text-charcoal/80 leading-relaxed">
        {product.longDescription || product.description}
      </p>

      {/* Color Selection */}
      {product.colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-charcoal">
              Color: <strong className="text-burgundy font-bold">{selectedColor}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {product.colors.map((c) => {
              const isSelected = selectedColor === c.name;
              return (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`group flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                    isSelected
                      ? "border-burgundy bg-burgundy/5 ring-1 ring-burgundy"
                      : "border-gray-lighter hover:border-burgundy/40"
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs block"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-xs font-medium text-charcoal pr-1">
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-charcoal">
            Select Size: <strong className="text-burgundy font-bold">{selectedSize}</strong>
          </span>
          <button
            onClick={() => setSizeGuideOpen(true)}
            className="flex items-center gap-1 text-burgundy hover:underline font-semibold"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Size Chart</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {product.sizes.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-12 h-11 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center ${
                  isSelected
                    ? "bg-burgundy text-white border-burgundy shadow-sm"
                    : "bg-white text-charcoal border-burgundy/20 hover:border-burgundy"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity & CTA Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-burgundy/20 rounded-xl bg-white px-2 py-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-9 flex items-center justify-center text-charcoal hover:text-burgundy font-bold"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-semibold text-charcoal">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-9 flex items-center justify-center text-charcoal hover:text-burgundy font-bold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Bag */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-burgundy hover:bg-burgundy-dark text-white font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] text-sm group"
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`p-3.5 rounded-xl border transition-colors flex items-center justify-center ${
              isLiked
                ? "bg-burgundy text-white border-burgundy"
                : "border-burgundy/20 text-charcoal hover:text-burgundy hover:border-burgundy bg-white"
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          className="w-full bg-gold hover:bg-gold-dark text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-sm"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Buy Now &bull; Express Checkout</span>
        </button>
      </div>

      {/* Pincode delivery checker */}
      <div className="bg-white p-4 rounded-xl border border-burgundy/10 space-y-2">
        <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-burgundy" />
          <span>Delivery Options & Pincode Checker</span>
        </label>
        <form onSubmit={checkPincode} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter 6-digit pincode (e.g. 110001)"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="flex-1 text-xs px-3 py-2 border border-burgundy/20 rounded-lg outline-none focus:border-burgundy bg-cream/30"
          />
          <button
            type="submit"
            className="bg-burgundy text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-burgundy-dark transition-colors"
          >
            Check
          </button>
        </form>

        {pincodeStatus && (
          <div className="text-xs pt-1">
            {pincodeStatus.valid ? (
              <p className="text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Delivery by <strong>{pincodeStatus.date}</strong> &bull; Free Shipping Available
              </p>
            ) : (
              <p className="text-red-600">Please enter a valid 6-digit Indian PIN code.</p>
            )}
          </div>
        )}
      </div>

      {/* Accordions */}
      <div className="border-t border-burgundy/10 divide-y divide-burgundy/10 text-xs">
        {/* Product Details */}
        <div>
          <button
            onClick={() => toggleAccordion("details")}
            className="w-full py-3.5 flex items-center justify-between font-semibold text-charcoal hover:text-burgundy text-left"
          >
            <span className="text-sm font-heading font-bold">Product Specifications & Details</span>
            {openSection === "details" ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {openSection === "details" && (
            <div className="pb-4 text-charcoal/80 space-y-2">
              <ul className="list-disc list-inside space-y-1 pl-1">
                {product.details?.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                )) || <li>Handcrafted premium tailoring from Raghav Garments.</li>}
              </ul>
            </div>
          )}
        </div>

        {/* Fabric & Care */}
        <div>
          <button
            onClick={() => toggleAccordion("care")}
            className="w-full py-3.5 flex items-center justify-between font-semibold text-charcoal hover:text-burgundy text-left"
          >
            <span className="text-sm font-heading font-bold">Fabric & Wash Care</span>
            {openSection === "care" ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {openSection === "care" && (
            <div className="pb-4 text-charcoal/80 space-y-2">
              <ul className="list-disc list-inside space-y-1 pl-1">
                {product.fabric_care?.map((care, idx) => (
                  <li key={idx}>{care}</li>
                )) || (
                  <>
                    <li>Premium woven fabric</li>
                    <li>Dry clean recommended to maintain fabric luster</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Shipping & Returns */}
        <div>
          <button
            onClick={() => toggleAccordion("shipping")}
            className="w-full py-3.5 flex items-center justify-between font-semibold text-charcoal hover:text-burgundy text-left"
          >
            <span className="text-sm font-heading font-bold">Shipping, Delivery & 30-Day Returns</span>
            {openSection === "shipping" ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {openSection === "shipping" && (
            <div className="pb-4 text-charcoal/80 space-y-2">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
                <span>
                  <strong>Free Standard Delivery</strong> on all orders above ₹999 across all pin codes in India.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <RotateCcw className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
                <span>
                  <strong>Hassle-Free 30-Day Returns:</strong> If you are not satisfied with size or fit, we arrange a free doorstep pickup.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
                <span>
                  <strong>Authenticity Guarantee:</strong> 100% genuine handcrafted fabrics and artisan quality.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
      />
    </div>
  );
}
