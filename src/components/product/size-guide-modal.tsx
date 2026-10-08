"use client";

import React, { useState } from "react";
import { X, Ruler } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCategory } from "@/types/product";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ProductCategory;
}

export function SizeGuideModal({
  isOpen,
  onClose,
  category,
}: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"in" | "cm">("in");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-burgundy/10 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-burgundy/10">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-burgundy" />
              <h3 className="font-heading text-xl font-bold text-burgundy-dark">
                Size & Measurement Guide
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray hover:text-burgundy rounded-full hover:bg-burgundy/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Unit Switcher */}
          <div className="flex items-center justify-between my-4">
            <span className="text-xs text-gray uppercase tracking-wider font-semibold">
              Category: <span className="text-burgundy capitalize">{category}</span>
            </span>
            <div className="inline-flex rounded-lg border border-burgundy/20 p-0.5 bg-cream">
              <button
                onClick={() => setUnit("in")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  unit === "in"
                    ? "bg-burgundy text-white shadow-xs"
                    : "text-charcoal/70 hover:text-burgundy"
                }`}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setUnit("cm")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  unit === "cm"
                    ? "bg-burgundy text-white shadow-xs"
                    : "text-charcoal/70 hover:text-burgundy"
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Tables depending on category */}
          <div className="overflow-x-auto my-4">
            {category === "men" && (
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-cream-dark text-burgundy-dark font-semibold">
                    <th className="p-3 border-b border-burgundy/10">Size Tag</th>
                    <th className="p-3 border-b border-burgundy/10">Chest ({unit})</th>
                    <th className="p-3 border-b border-burgundy/10">Waist ({unit})</th>
                    <th className="p-3 border-b border-burgundy/10">Shoulder ({unit})</th>
                    <th className="p-3 border-b border-burgundy/10">Kurta / Sherwani Length ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-lighter text-charcoal">
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">38 (S)</td>
                    <td className="p-3">{unit === "in" ? "38 - 39" : "96 - 99"}</td>
                    <td className="p-3">{unit === "in" ? "32 - 34" : "81 - 86"}</td>
                    <td className="p-3">{unit === "in" ? "17.5" : "44.5"}</td>
                    <td className="p-3">{unit === "in" ? "40" : "101.6"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">40 (M)</td>
                    <td className="p-3">{unit === "in" ? "40 - 41" : "101 - 104"}</td>
                    <td className="p-3">{unit === "in" ? "34 - 36" : "86 - 91"}</td>
                    <td className="p-3">{unit === "in" ? "18.0" : "45.7"}</td>
                    <td className="p-3">{unit === "in" ? "41" : "104.1"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">42 (L)</td>
                    <td className="p-3">{unit === "in" ? "42 - 43" : "106 - 109"}</td>
                    <td className="p-3">{unit === "in" ? "36 - 38" : "91 - 96"}</td>
                    <td className="p-3">{unit === "in" ? "18.5" : "47.0"}</td>
                    <td className="p-3">{unit === "in" ? "42" : "106.7"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">44 (XL)</td>
                    <td className="p-3">{unit === "in" ? "44 - 45" : "111 - 114"}</td>
                    <td className="p-3">{unit === "in" ? "38 - 40" : "96 - 101"}</td>
                    <td className="p-3">{unit === "in" ? "19.0" : "48.2"}</td>
                    <td className="p-3">{unit === "in" ? "43" : "109.2"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">46 (XXL)</td>
                    <td className="p-3">{unit === "in" ? "46 - 47" : "116 - 119"}</td>
                    <td className="p-3">{unit === "in" ? "40 - 42" : "101 - 106"}</td>
                    <td className="p-3">{unit === "in" ? "19.5" : "49.5"}</td>
                    <td className="p-3">{unit === "in" ? "44" : "111.8"}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {category === "women" && (
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-cream-dark text-burgundy-dark font-semibold">
                    <th className="p-3 border-b border-burgundy/10">Size Tag</th>
                    <th className="p-3 border-b border-burgundy/10">Bust ({unit})</th>
                    <th className="p-3 border-b border-burgundy/10">Waist ({unit})</th>
                    <th className="p-3 border-b border-burgundy/10">Hip ({unit})</th>
                    <th className="p-3 border-b border-burgundy/10">Lehenga / Anarkali Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-lighter text-charcoal">
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">XS (34)</td>
                    <td className="p-3">{unit === "in" ? "34" : "86.4"}</td>
                    <td className="p-3">{unit === "in" ? "28" : "71.1"}</td>
                    <td className="p-3">{unit === "in" ? "36" : "91.4"}</td>
                    <td className="p-3">{unit === "in" ? "42 in" : "106 cm"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">S (36)</td>
                    <td className="p-3">{unit === "in" ? "36" : "91.4"}</td>
                    <td className="p-3">{unit === "in" ? "30" : "76.2"}</td>
                    <td className="p-3">{unit === "in" ? "38" : "96.5"}</td>
                    <td className="p-3">{unit === "in" ? "42 in" : "106 cm"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">M (38)</td>
                    <td className="p-3">{unit === "in" ? "38" : "96.5"}</td>
                    <td className="p-3">{unit === "in" ? "32" : "81.3"}</td>
                    <td className="p-3">{unit === "in" ? "40" : "101.6"}</td>
                    <td className="p-3">{unit === "in" ? "43 in" : "109 cm"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">L (40)</td>
                    <td className="p-3">{unit === "in" ? "40" : "101.6"}</td>
                    <td className="p-3">{unit === "in" ? "34" : "86.4"}</td>
                    <td className="p-3">{unit === "in" ? "42" : "106.7"}</td>
                    <td className="p-3">{unit === "in" ? "43 in" : "109 cm"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">XL (42)</td>
                    <td className="p-3">{unit === "in" ? "42" : "106.7"}</td>
                    <td className="p-3">{unit === "in" ? "36" : "91.4"}</td>
                    <td className="p-3">{unit === "in" ? "44" : "111.8"}</td>
                    <td className="p-3">{unit === "in" ? "44 in" : "111 cm"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">Free Size (Sarees)</td>
                    <td colSpan={4} className="p-3 text-gray">
                      Standard length 5.5 meters with 0.8 meter unstitched blouse piece.
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {category === "kids" && (
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-cream-dark text-burgundy-dark font-semibold">
                    <th className="p-3 border-b border-burgundy/10">Age Group</th>
                    <th className="p-3 border-b border-burgundy/10">Chest ({unit})</th>
                    <th className="p-3 border-b border-burgundy/10">Waist ({unit})</th>
                    <th className="p-3 border-b border-burgundy/10">Height Range ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-lighter text-charcoal">
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">2-3 Y</td>
                    <td className="p-3">{unit === "in" ? "21 - 22" : "53 - 56"}</td>
                    <td className="p-3">{unit === "in" ? "20 - 21" : "51 - 53"}</td>
                    <td className="p-3">{unit === "in" ? "34 - 38" : "86 - 96"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">4-5 Y</td>
                    <td className="p-3">{unit === "in" ? "23 - 24" : "58 - 61"}</td>
                    <td className="p-3">{unit === "in" ? "21 - 22" : "53 - 56"}</td>
                    <td className="p-3">{unit === "in" ? "39 - 43" : "99 - 109"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">6-7 Y</td>
                    <td className="p-3">{unit === "in" ? "25 - 26" : "63 - 66"}</td>
                    <td className="p-3">{unit === "in" ? "22 - 23" : "56 - 58"}</td>
                    <td className="p-3">{unit === "in" ? "44 - 48" : "112 - 122"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-burgundy">8-9 Y</td>
                    <td className="p-3">{unit === "in" ? "27 - 28" : "68 - 71"}</td>
                    <td className="p-3">{unit === "in" ? "24 - 25" : "61 - 63"}</td>
                    <td className="p-3">{unit === "in" ? "49 - 53" : "124 - 134"}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Tip Note */}
          <div className="bg-cream p-3.5 rounded-xl border border-burgundy/10 text-xs text-charcoal/80">
            <p>
              💡 <strong>Fitting Tip:</strong> All Raghav Garments ethnic wear includes 2 inches of inner margin for effortless custom alterations if needed.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
