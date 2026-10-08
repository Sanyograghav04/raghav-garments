import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { QuickViewModal } from "@/components/product/quick-view-modal";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAGHAV GARMENTS | Premium Indian Fashion for Men, Women & Kids",
  description:
    "Shop premium handcrafted ethnic and contemporary garments for the whole family. Explore curated collections of sherwanis, sarees, lehengas, kurtas, and casuals at RAGHAV GARMENTS.",
  keywords: [
    "Raghav Garments",
    "ethnic wear",
    "Indian fashion",
    "men",
    "women",
    "kids",
    "sarees",
    "sherwani",
    "anarkali",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <QuickViewModal />
      </body>
    </html>
  );
}
