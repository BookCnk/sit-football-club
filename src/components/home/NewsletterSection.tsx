'use client';

import { useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';
import FadeUp from '@/components/ui/FadeUp';

export default function NewsletterSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitted(true);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-32 text-center">
      <FadeUp>
        {/* Glowing animated mail icon */}
        <Mail className="w-8 h-8 mx-auto text-red-500 mb-6 animate-shimmer-glow" />

        <h2 className="text-4xl font-display font-bold tracking-tighter mb-4">
          SUBSCRIBE TO SIT FC
        </h2>
        <p className="text-neutral-400 text-sm max-w-lg mx-auto mb-8">
          Stay connected with SIT Football Club — get match updates, squad news, and club announcements straight to your inbox.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-900/20 border border-green-700/30 rounded-sm text-green-400 text-sm animate-fade-in">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Thanks! You&apos;re now subscribed.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 text-white placeholder:text-neutral-600 transition-all duration-200"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 text-white placeholder:text-neutral-600 transition-all duration-200"
              required
            />
            <button
              type="submit"
              className="bg-white text-black font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-sm hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Sign Up
            </button>
          </form>
        )}
      </FadeUp>
    </section>
  );
}
