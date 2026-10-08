import { HeroSection } from "@/components/home/hero-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { BrandStory } from "@/components/home/brand-story";
import { TrustSection } from "@/components/home/trust-section";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <BrandStory />
      <TrustSection />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
