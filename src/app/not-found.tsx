import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-8xl font-heading font-bold text-burgundy">404</h1>
      <p className="mt-4 text-xl text-charcoal">Page not found</p>
      <p className="mt-2 text-gray">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 bg-burgundy text-white px-8 py-3 rounded-full hover:bg-burgundy-dark transition-colors duration-300 text-sm font-medium"
      >
        Back to Home
      </Link>
    </main>
  );
}
