"use client";

import { create } from "zustand";
import { Product } from "@/types/product";

interface QuickViewStore {
  product: Product | null;
  isOpen: boolean;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

export const useQuickViewStore = create<QuickViewStore>((set) => ({
  product: null,
  isOpen: false,
  openQuickView: (product: Product) => set({ product, isOpen: true }),
  closeQuickView: () => set({ isOpen: false, product: null }),
}));
