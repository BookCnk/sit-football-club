'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Home, Search, RotateCcw } from 'lucide-react';

export default function NotFound() {
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [goalScale, setGoalScale] = useState(1);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBallPosition({
        x: Math.random() * 80 - 40,
        y: Math.random() * 80 - 40,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const goalInterval = setInterval(() => {
      setGoalScale(1.1);
      setTimeout(() => setGoalScale(1), 300);
    }, 4000);

    return () => clearInterval(goalInterval);
  }, []);

  const handleBallClick = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030303] via-[#0a0a0a] to-[#050505] flex items-center justify-center px-6 py-16 overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />
      
      {/* Red glow effect */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.14),transparent_60%)]" />

      {/* Animated football field lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white transform -translate-y-1/2" />
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white transform -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-32 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Animated football */}
        <div className="mb-8 flex justify-center">
          <div 
            className={`relative cursor-pointer transition-all duration-300 ${isBouncing ? 'animate-bounce' : ''}`}
            style={{
              transform: `translate(${ballPosition.x}px, ${ballPosition.y}px)`,
              transition: 'transform 3s ease-in-out',
            }}
            onClick={handleBallClick}
          >
            <div className="w-24 h-24 bg-white rounded-full shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black transform -translate-y-1/2" />
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-black transform -translate-x-1/2" />
              <div className="absolute top-1/4 left-1/4 w-8 h-8 border-2 border-black rounded-full" />
              <div className="absolute bottom-1/4 right-1/4 w-8 h-8 border-2 border-black rounded-full" />
            </div>
          </div>
        </div>

        {/* Goal animation */}
        <div 
          className="mb-8 inline-block"
          style={{
            transform: `scale(${goalScale})`,
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-16 bg-white/20 border-2 border-white/40" />
            <div className="w-4 h-16 bg-white/20 border-2 border-white/40" />
            <div className="w-4 h-16 bg-white/20 border-2 border-white/40" />
          </div>
        </div>

        {/* 404 Text with animation */}
        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 animate-pulse">
            404
          </h1>
          <div className="mt-2 text-xl md:text-2xl font-semibold text-red-500 uppercase tracking-widest">
            Offside!
          </div>
        </div>

        {/* Error message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-white mb-4">
            Looks like the ball went out of bounds
          </h2>
          <p className="text-neutral-400 text-lg max-w-md mx-auto">
            The page you're looking for seems to have been moved, deleted, or never existed. 
            Let's get you back to the game!
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-200 hover:bg-neutral-200 hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border border-white/20 bg-white/5 text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-200 hover:border-white/40 hover:bg-white/10 hover:scale-[1.02] active:scale-95"
          >
            <Search className="h-4 w-4" />
            Browse Shop
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-200 hover:border-white/40 hover:bg-white/5 hover:scale-[1.02] active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Fun football facts */}
        <div className="mt-12 p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
          <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
            Did you know?
          </div>
          <p className="text-sm text-neutral-300">
            A football field is 100-110 meters long and 64-75 meters wide. 
            Just like this error page, sometimes you find yourself in unexpected territory!
          </p>
        </div>

        {/* Animated corner flags */}
        <div className="absolute top-10 left-10 w-2 h-8 bg-red-500 transform rotate-45 animate-pulse" />
        <div className="absolute top-10 right-10 w-2 h-8 bg-red-500 transform -rotate-45 animate-pulse" />
        <div className="absolute bottom-10 left-10 w-2 h-8 bg-red-500 transform -rotate-45 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-2 h-8 bg-red-500 transform rotate-45 animate-pulse" />
      </div>
    </div>
  );
}
