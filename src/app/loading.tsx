export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cream-dark border-t-burgundy" />
        <p className="text-sm text-gray">Loading...</p>
      </div>
    </div>
  );
}
