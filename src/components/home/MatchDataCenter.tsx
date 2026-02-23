'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { NextMatch, LastResult } from '@/types';

interface Props {
  nextMatch: NextMatch;
  lastResult: LastResult;
}

export default function MatchDataCenter({ nextMatch, lastResult }: Props) {
  const nextCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = nextCardRef.current;
    if (!card) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };
    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative z-20 -mt-24 px-6 mb-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Next Match — Coming Soon */}
        <div
          ref={nextCardRef}
          className="bg-black/80 backdrop-blur-xl border border-white/10 p-8 rounded-lg spotlight-card scan-line"
        >
          <div className="flex justify-between items-start mb-8">
            <span className="text-[10px] uppercase tracking-widest text-red-500 border border-red-900/50 bg-red-900/10 px-2 py-1 rounded">
              Next Up
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              {nextMatch.date} • {nextMatch.time}
            </span>
          </div>

          {/* Coming Soon state */}
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            {/* Logo */}
            <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center border border-white/10">
              {nextMatch.home.logo && (
                <Image
                  src={nextMatch.home.logo}
                  alt={nextMatch.home.name}
                  width={64}
                  height={64}
                  className="object-contain rounded-full"
                />
              )}
            </div>

            <div className="text-center">
              <p className="text-2xl font-display font-semibold tracking-tight text-white mb-1">
                COMING SOON
              </p>
              <p className="text-[11px] text-neutral-500 uppercase tracking-widest">
                {nextMatch.venue}
              </p>
            </div>

            {/* Animated dots */}
            <div className="flex gap-2 mt-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button className="flex-1 py-2 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
              Tickets
            </button>
            <button className="flex-1 py-2 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
              Directions
            </button>
          </div>
        </div>

        {/* Last Result */}
        <div className="bg-neutral-900/50 backdrop-blur-md border border-white/5 p-8 rounded-lg spotlight-card">
          <div className="flex justify-between items-start mb-8">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 border border-white/5 px-2 py-1 rounded">
              Last Time Out
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              {lastResult.date} • {lastResult.competition}
            </span>
          </div>

          <div className="flex items-center justify-between">
            {/* Home team with logo */}
            <div className={`text-center ${lastResult.winner === 'home' ? '' : 'opacity-50'}`}>
              <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center border border-white/10 mb-2 mx-auto overflow-hidden">
                {lastResult.homeLogo ? (
                  <Image
                    src={lastResult.homeLogo}
                    alt={lastResult.homeTeam}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">{lastResult.homeTeam.slice(0, 3)}</span>
                )}
              </div>
              <span className="block text-lg font-display font-bold mb-1">{lastResult.homeTeam}</span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500">Home</span>
            </div>

            <div className="flex items-center gap-6 px-6 py-3 bg-black/50 rounded border border-white/5">
              <span className={`text-4xl font-display font-bold ${lastResult.winner === 'home' ? 'text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'text-neutral-600'}`}>
                {lastResult.homeScore}
              </span>
              <span className="w-px h-8 bg-white/10" />
              <span className={`text-4xl font-display font-bold ${lastResult.winner === 'away' ? 'text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'text-neutral-600'}`}>
                {lastResult.awayScore}
              </span>
            </div>

            {/* Away team with logo */}
            <div className="text-center">
              <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center border border-white/10 mb-2 mx-auto overflow-hidden">
                {lastResult.awayLogo ? (
                  <Image
                    src={lastResult.awayLogo}
                    alt={lastResult.awayTeam}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">{lastResult.awayTeam.slice(0, 3)}</span>
                )}
              </div>
              <span className={`block text-lg font-display font-bold mb-1 ${lastResult.winner === 'away' ? 'text-white' : ''}`}>
                {lastResult.awayTeam}
              </span>
              {lastResult.winner === 'away' && (
                <span className="text-[10px] uppercase tracking-widest text-red-500">Winner</span>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
            <div className="text-xs text-neutral-400">
              <span className="text-neutral-600 uppercase mr-2">Scorers:</span> {lastResult.scorers}
            </div>
            {/* <a href="#" className="text-[10px] uppercase font-bold tracking-widest hover:text-red-500 transition-colors">
              Match Report -&gt;
            </a> */}
          </div>
        </div>
      </div>
    </section>
  );
}
