'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'TEAM', href: '#' },
  { label: 'SHOP', href: '/shop' },
  { label: 'HISTORY', href: '#' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/70 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/sit-football.jpg"
            alt="SIT FC Logo"
            width={40}
            height={40}
            className="object-contain group-hover:scale-110 transition-transform duration-300"
          />
          <div className="flex flex-col">
            <span className="font-display font-semibold tracking-tight text-white leading-none">SIT FOOTBALL CLUB</span>
            <span className="text-[10px] text-red-500 tracking-[0.2em] font-medium">KMUTT · FACULTY OF IT</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 text-xs font-medium tracking-widest text-neutral-400">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`hover:text-white transition-colors ${label === 'SHOP' ? 'text-red-500' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4 text-neutral-500">
            <Instagram className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
          </div>
          <button
            className="lg:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-black/95 border-t border-white/5 px-6 py-6 flex flex-col gap-5 text-sm font-medium tracking-widest text-neutral-400">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`hover:text-white transition-colors ${label === 'SHOP' ? 'text-red-500' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      {/* Announcement Bar */}
      <div className="w-full bg-red-600/10 border-y border-red-600/20 py-2">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-red-400">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            SIT FC vs Chulalongkorn FC — SAT 15 MAR · 15:00
          </span>
          <span className="hover:text-white cursor-pointer transition-colors">Get Tickets -&gt;</span>
        </div>
      </div>
    </nav>
  );
}
