"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  CheckCircle,
  Package,
} from "lucide-react";
import { Product, ProductCategory } from "@/types/product";
import { formatPrice, slugify } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

function ProductsContent() {
  const searchParams = useSearchParams();
  const shouldOpenNew = searchParams.get("action") === "new";

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modal states
  const [modalOpen, setModalOpen] = useState(shouldOpenNew);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<ProductCategory>("men");
  const [formSubcategory, setFormSubcategory] = useState("");
  const [formPrice, setFormPrice] = useState<number>(4999);
  const [formComparePrice, setFormComparePrice] = useState<number>(6999);
  const [formStock, setFormStock] = useState<number>(15);
  const [formImage, setFormImage] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSizes, setFormSizes] = useState("S, M, L, XL");
  const [formFeatured, setFormFeatured] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadProducts = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setProducts(data as Product[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openNewModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory("men");
    setFormSubcategory("Ethnic Wear");
    setFormPrice(4999);
    setFormComparePrice(6999);
    setFormStock(20);
    setFormImage("https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=80");
    setFormDescription("Handcrafted luxury garment with artisan stitching.");
    setFormSizes("38, 40, 42, 44");
    setFormFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormSubcategory(p.subcategory);
    setFormPrice(p.price);
    setFormComparePrice(p.compare_price || 0);
    setFormStock(p.stock_count);
    setFormImage(p.images[0] || "");
    setFormDescription(p.description);
    setFormSizes(p.sizes.join(", "));
    setFormFeatured(p.featured);
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    const slug = slugify(formName);
    const parsedSizes = formSizes.split(",").map((s) => s.trim()).filter(Boolean);

    const productPayload: Partial<Product> = {
      name: formName,
      slug: editingProduct ? editingProduct.slug : slug,
      category: formCategory,
      subcategory: formSubcategory || "Ethnic Wear",
      price: Number(formPrice),
      compare_price: Number(formComparePrice) || undefined,
      stock_count: Number(formStock),
      in_stock: Number(formStock) > 0,
      images: [formImage || "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=80"],
      sizes: parsedSizes,
      description: formDescription,
      featured: formFeatured,
      rating: editingProduct?.rating || 5.0,
      reviewCount: editingProduct?.reviewCount || 0,
      colors: editingProduct?.colors || [{ name: "Burgundy", hex: "#7C1D3E" }],
    };

    try {
      const supabase = createClient();
      if (editingProduct) {
        // Update in Supabase
        await supabase.from("products").update(productPayload).eq("id", editingProduct.id);
        setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...productPayload } as Product : p)));
        setSuccessMsg("Garment updated successfully!");
      } else {
        // Insert in Supabase
        const newId = `prod-${Date.now()}`;
        const newProduct = {
          ...productPayload,
          id: newId,
          created_at: new Date().toISOString(),
        } as Product;

        await supabase.from("products").insert([newProduct]);
        setProducts([newProduct, ...products]);
        setSuccessMsg("New garment added to catalog!");
      }

      setTimeout(() => {
        setSuccessMsg("");
        setModalOpen(false);
      }, 1000);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this garment from the catalog?")) return;

    try {
      const supabase = createClient();
      await supabase.from("products").delete().eq("id", id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchQuery && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-burgundy-dark">
            Products & Inventory
          </h1>
          <p className="text-xs text-gray mt-1">
            Manage your store catalog, pricing variations, and real-time stock levels.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 bg-burgundy hover:bg-burgundy-dark text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-burgundy/10 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by garment name, subcategory, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-burgundy/20 outline-none focus:border-burgundy bg-cream/20 text-charcoal"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          {["all", "men", "women", "kids"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? "bg-burgundy text-white shadow-2xs"
                  : "bg-cream-dark text-charcoal/80 hover:bg-cream"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-burgundy/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-cream-dark/60 border-b border-burgundy/10 text-charcoal font-bold">
                <th className="py-3.5 px-4">Garment</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-lighter">
              {filteredProducts.map((p) => {
                const isLowStock = p.stock_count <= 8;
                return (
                  <tr key={p.id} className="hover:bg-cream/40 transition-colors">
                    {/* Garment Image & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-cream-dark shrink-0">
                          <Image
                            src={p.images[0] || "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=80"}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-cover object-top"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-heading font-semibold text-charcoal truncate max-w-xs">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-gray">{p.sku || "SKU: RG-GEN"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 capitalize">
                      <span className="bg-cream px-2 py-0.5 rounded border border-burgundy/10 text-[11px] font-medium text-charcoal">
                        {p.category} &bull; {p.subcategory}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-burgundy-dark">
                      {formatPrice(p.price)}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-semibold ${
                            isLowStock ? "text-amber-700" : "text-emerald-700"
                          }`}
                        >
                          {p.stock_count} units
                        </span>
                        {isLowStock && (
                          <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            <AlertTriangle className="w-3 h-3" /> Low
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Featured */}
                    <td className="py-3 px-4">
                      {p.featured ? (
                        <span className="bg-gold/20 text-gold-dark font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      ) : (
                        <span className="text-gray text-[10px]">Standard</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-charcoal/70 hover:text-burgundy hover:bg-cream rounded-lg transition-colors"
                          title="Edit Garment"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-charcoal/70 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Garment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal (Add / Edit) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs">
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-burgundy/10 text-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-burgundy/10">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-burgundy" />
                <h3 className="font-heading text-lg font-bold text-burgundy-dark">
                  {editingProduct ? "Edit Garment" : "Add New Garment to Catalog"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray hover:text-burgundy"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg ? (
              <div className="py-10 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-heading font-bold text-base text-charcoal">
                  {successMsg}
                </h4>
              </div>
            ) : (
              <form onSubmit={handleSaveProduct} className="space-y-4 pt-4">
                {/* Title */}
                <div>
                  <label className="block font-semibold text-charcoal mb-1">
                    Garment Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Royal Silk Embroidered Bandhgala"
                    className="w-full px-3 py-2 border border-burgundy/20 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>

                {/* Category & Subcategory */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-charcoal mb-1">
                      Department
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) =>
                        setFormCategory(e.target.value as ProductCategory)
                      }
                      className="w-full px-3 py-2 border border-burgundy/20 rounded-xl outline-none focus:border-burgundy bg-white capitalize cursor-pointer"
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="kids">Kids</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      value={formSubcategory}
                      onChange={(e) => setFormSubcategory(e.target.value)}
                      placeholder="e.g. Ethnic Wear, Sarees, Lehengas"
                      className="w-full px-3 py-2 border border-burgundy/20 rounded-xl outline-none focus:border-burgundy"
                    />
                  </div>
                </div>

                {/* Price, Compare Price, Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-charcoal mb-1">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-burgundy/20 rounded-xl outline-none focus:border-burgundy"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">
                      Compare Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formComparePrice}
                      onChange={(e) => setFormComparePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-burgundy/20 rounded-xl outline-none focus:border-burgundy"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">
                      Units in Stock
                    </label>
                    <input
                      type="number"
                      required
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-burgundy/20 rounded-xl outline-none focus:border-burgundy"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block font-semibold text-charcoal mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-burgundy/20 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>

                {/* Sizes */}
                <div>
                  <label className="block font-semibold text-charcoal mb-1">
                    Available Sizes (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formSizes}
                    onChange={(e) => setFormSizes(e.target.value)}
                    placeholder="S, M, L, XL, XXL"
                    className="w-full px-3 py-2 border border-burgundy/20 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold text-charcoal mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe the fabric, tailoring, occasion, and craftsmanship..."
                    className="w-full px-3 py-2 border border-burgundy/20 rounded-xl outline-none focus:border-burgundy"
                  />
                </div>

                {/* Featured Checkbox */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="rounded border-burgundy/30 text-burgundy focus:ring-burgundy"
                    />
                    <span className="font-semibold text-charcoal">
                      Feature on Homepage & Best-seller section
                    </span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t border-burgundy/10">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 border border-gray-lighter rounded-xl text-gray hover:text-charcoal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-burgundy hover:bg-burgundy-dark text-white rounded-xl font-semibold shadow-xs"
                  >
                    {editingProduct ? "Save Changes" : "Add Product"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gray">Loading inventory manager...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
