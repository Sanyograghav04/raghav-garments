"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-4xl font-heading font-bold text-burgundy">
        Something went wrong
      </h1>
      <p className="mt-4 text-gray max-w-md">
        We encountered an unexpected error. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 bg-burgundy text-white px-8 py-3 rounded-full hover:bg-burgundy-dark transition-colors duration-300 text-sm font-medium"
      >
        Try Again
      </button>
    </main>
  );
}
