export default function HeroSection() {
  return (
    <header className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-[center_80%] opacity-30"
      >
        <source
          src="/b288f342648f4a4fbf6b1be723cc12c2.mov"
          type="video/mp4"
        />
      </video>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15),transparent_70%)]" />

      {/* Content — each element animate-in via CSS classes in globals.css */}
      <div className="relative z-10 text-center flex flex-col items-center w-full max-w-6xl mx-auto px-6 py-36">

        {/* Badge fades in from above */}
        <div className="hero-badge mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-neutral-300">Official Website</span>
        </div>

        {/* Headline fades up with slight delay */}
        <h1 className="hero-title text-[clamp(2.5rem,10vw,9rem)] leading-[0.85] font-display font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-600 mix-blend-overlay w-full">
          WE ARE<br />SIT FOOTBALL  CLUB
        </h1>

        {/* Tagline */}
        <p className="hero-sub mt-8 text-neutral-400 max-w-md text-sm md:text-base font-light tracking-wide">
          King Mongkut’s University of Technology Thonburi
        </p>

        {/* Buttons */}
        <div className="hero-buttons mt-12 flex flex-col md:flex-row gap-4">
          <button className="px-8 py-3 bg-white text-black text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all duration-200 rounded-sm">
            Buy Match Tickets
          </button>
          <button className="px-8 py-3 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200 rounded-sm backdrop-blur-sm">
            Visit Club Shop
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent animate-bounce" />
      </div>
    </header>
  );
}
