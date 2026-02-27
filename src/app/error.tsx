'use client';

import { useEffect } from 'react';
import { Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030303] via-[#0a0a0a] to-[#050505] flex items-center justify-center px-6 py-16">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />
      
      {/* Red glow effect */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.14),transparent_60%)]" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Red card animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-44 bg-red-600 rounded-lg shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <div className="absolute inset-2 border-2 border-white rounded flex items-center justify-center">
                <div className="text-white font-bold text-6xl">!</div>
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-black/20 rounded-full blur-sm" />
          </div>
        </div>

        {/* Error text */}
        <div className="mb-6">
          <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tighter text-red-500 mb-4">
            Red Card!
          </h1>
          <div className="text-xl md:text-2xl font-semibold text-white uppercase tracking-widest">
            Foul Detected
          </div>
        </div>

        {/* Error message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-white mb-4">
            Something went wrong on the field
          </h2>
          <p className="text-neutral-400 text-lg max-w-md mx-auto mb-4">
            We encountered an unexpected error. The referee has called a foul on this play.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-left">
              <p className="text-red-200 text-sm font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-red-300 text-xs mt-2 font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-200 hover:bg-neutral-200 hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          
          <a
            href="/"
            className="inline-flex items-center gap-2 border border-white/20 bg-white/5 text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-200 hover:border-white/40 hover:bg-white/10 hover:scale-[1.02] active:scale-95"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </a>
        </div>

        {/* Fun football fact */}
        <div className="mt-12 p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
          <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
            Football Fact
          </div>
          <p className="text-sm text-neutral-300">
            A red card means a player is sent off the field. Unlike our app, you can always come back and try again!
          </p>
        </div>
      </div>
    </div>
  );
}
