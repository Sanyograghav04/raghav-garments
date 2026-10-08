// Site-wide constants for RAGHAV GARMENTS

export const SITE = {
  name: "RAGHAV GARMENTS",
  tagline: "Premium Fashion for Men, Women & Kids",
  description:
    "Shop premium garments for the whole family. Explore our curated collection at RAGHAV GARMENTS.",
  url: "https://raghavgarments.com", // Update after deployment
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Kids", href: "/kids" },
  { label: "Collections", href: "/collections" },
  { label: "Sale", href: "/sale" },
] as const;

export const CATEGORIES = [
  { label: "Men", slug: "men", image: "/images/categories/men.jpg" },
  { label: "Women", slug: "women", image: "/images/categories/women.jpg" },
  { label: "Kids", slug: "kids", image: "/images/categories/kids.jpg" },
] as const;

export const TRUST_BADGES = [
  { icon: "truck", label: "Free Shipping", detail: "On orders over ₹999" },
  { icon: "refresh", label: "Easy Returns", detail: "30-day return policy" },
  { icon: "shield", label: "Secure Payment", detail: "100% secure checkout" },
  { icon: "headphones", label: "24/7 Support", detail: "Dedicated support" },
] as const;
