import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="col-span-1">
            <Image
              src="/sit-football.jpg"
              alt="SIT FC Logo"
              width={64}
              height={64}
              className="object-contain mb-6 grayscale hover:grayscale-0 transition-all"
            />
            <p className="text-xs text-neutral-500 leading-relaxed mb-6">
              SIT Football Club<br />
              King Mongkut&apos;s University of Technology Thonburi<br />
              Faculty of Information Technology
            </p>
            <div className="flex gap-4 text-neutral-400">
              <Facebook className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
              <Twitter className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
              <Youtube className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
              <Instagram className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3 text-xs text-neutral-500 font-medium">
              {['Home', 'News', 'Tickets', 'Club Shop', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-red-500 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Teams */}
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Teams</h4>
            <ul className="space-y-3 text-xs text-neutral-500 font-medium">
              {['First Team Squad', 'Fixtures & Results', 'Ladies Team', 'Scholars'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-red-500 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit Us */}
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Visit Us</h4>
            <address className="text-xs text-neutral-500 not-italic leading-relaxed">
              126 Pracha Uthit Rd<br />
              Bang Mod, Thung Khru<br />
              Bangkok 10140<br /><br />
              <span className="text-white block mt-2">sitfc@kmutt.ac.th</span>
              <span className="text-white">02-470-9999</span>
            </address>
          </div>
        </div>

        {/* Sponsors */}
        <div className="border-t border-white/5 pt-10 flex flex-wrap justify-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          {['KMUTT', 'FACULTY OF IT', 'SIT SPORT', 'THAI FA'].map((sponsor) => (
            <span key={sponsor} className="text-xl font-display font-bold text-white">{sponsor}</span>
          ))}
        </div>

        <div className="mt-10 text-center text-[10px] text-neutral-700 uppercase tracking-widest">
          &copy; 2025 SIT Football Club · KMUTT. All Rights Reserved.
        </div>        <div className="mt-10 text-center text-[10px] text-neutral-700 uppercase tracking-widest">
          &copy; Make by Book Chanakarn
        </div>
      </div>
    </footer>
  );
}
