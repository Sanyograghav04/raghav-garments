export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      {/* Temporary placeholder — Phase 2 will build the real home page */}
      <div className="text-center space-y-6">
        <p className="text-sm font-body uppercase tracking-[0.3em] text-gold">
          Premium Fashion
        </p>
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-burgundy-dark">
          RAGHAV
          <br />
          <span className="text-burgundy">GARMENTS</span>
        </h1>
        <p className="max-w-md mx-auto text-gray text-lg">
          Curated fashion for Men, Women &amp; Kids.
          <br />
          Launching soon.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <button className="bg-burgundy text-white px-8 py-3 rounded-full hover:bg-burgundy-dark transition-colors duration-300 text-sm font-medium">
            Shop Now
          </button>
          <button className="border border-burgundy text-burgundy px-8 py-3 rounded-full hover:bg-burgundy hover:text-white transition-colors duration-300 text-sm font-medium">
            Explore
          </button>
        </div>
      </div>
    </main>
  );
}
