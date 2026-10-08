import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { getProductBySlug, getRelatedProducts, getAllProducts } from "@/lib/products";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductCard } from "@/components/ui/product-card";
import { ProductJsonLd } from "@/components/seo/product-json-ld";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | RAGHAV GARMENTS",
    };
  }

  return {
    title: `${product.name} | RAGHAV GARMENTS`,
    description: product.description,
    openGraph: {
      title: `${product.name} | RAGHAV GARMENTS`,
      description: product.description,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);

  return (
    <div className="min-h-screen bg-cream py-6 sm:py-10">
      <ProductJsonLd product={product} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center space-x-2 text-xs text-gray mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap pb-1"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="hover:text-burgundy flex items-center gap-1 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-gray/40 shrink-0" />
          <Link
            href={`/${product.category}`}
            className="capitalize hover:text-burgundy transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-gray/40 shrink-0" />
          <span className="text-gray/70">{product.subcategory}</span>
          <ChevronRight className="w-3 h-3 text-gray/40 shrink-0" />
          <span className="font-semibold text-burgundy truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Main Product Showcase (Gallery + Info) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery - 7 cols on large screens */}
          <div className="lg:col-span-7 sticky top-28">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Product Details & Purchase Form - 5 cols */}
          <div className="lg:col-span-5 bg-white/60 backdrop-blur-xs p-6 sm:p-8 rounded-3xl border border-burgundy/10 shadow-xs">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16">
          <ProductReviews
            productId={product.id}
            productName={product.name}
            rating={product.rating}
            reviewCount={product.reviewCount}
            initialReviews={product.reviews}
          />
        </div>

        {/* Related Products Recommendation */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-burgundy/10">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <span className="text-xs uppercase tracking-widest text-burgundy font-semibold">
                Curated for You
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-burgundy-dark">
                You May Also Like
              </h2>
              <p className="text-xs sm:text-sm text-gray">
                Complete your wardrobe with coordinating handcrafted ensembles.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
