'use client';

import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';

const STAT_VALUES = [2025, 40, 0];
const STAT_LABELS = ['Season', 'Members', 'Latest Champions'];
const STAT_DISPLAY = ['2025', '40+', 'IT3K 2026'];

function AnimatedStat({
  value,
  label,
  display,
  trigger,
}: {
  value: number;
  label: string;
  display: string;
  trigger: boolean;
}) {
  const count = useCountUp({ end: value, duration: 1800 }, trigger);
  const isNumeric = value > 100;

  return (
    <div className="flex flex-col">
      <span className="text-3xl font-display font-bold text-white">
        {isNumeric ? count.toString() : display}
      </span>
      <span className="text-[10px] uppercase text-neutral-500 tracking-widest">{label}</span>
    </div>
  );
}

export default function HistorySection() {
  const { ref: sectionRef, inView } = useInView();

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="max-w-7xl mx-auto px-6 mb-32"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Video slides in from left when visible */}
        <div
          className={`order-2 md:order-1 relative transition-all duration-900 ease-out ${
            inView ? 'animate-slide-in-left' : 'opacity-0'
          }`}
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-red-900 rounded-lg blur-2xl opacity-20" />
          <video
            autoPlay
            muted
            loop
            playsInline
            className="relative rounded-sm border border-white/10 shadow-2xl w-full h-auto object-cover"
          >
            <source src="/IMG_2061.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Content slides in from right */}
        <div
          className={`order-1 md:order-2 transition-all duration-900 ease-out ${
            inView ? 'animate-slide-in-right' : 'opacity-0'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-4 block">
            Club Overview
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tighter mb-6">
            SIT FOOTBALL CLUB
            <br />
            IN <span className="text-neutral-500">2025</span>
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed mb-8">
            In 2025, SIT Football Club continued to represent the School of Information Technology
            at King Mongkut&apos;s University of Technology Thonburi with discipline, unity, and
            competitive ambition. With a club community of more than 40 members, the team
            strengthened its identity on and off the pitch, building the standard that led to its
            latest title as IT3K 2026 champions.
          </p>
          <div className="flex gap-8">
            {STAT_VALUES.map((val, i) => (
              <AnimatedStat
                key={STAT_LABELS[i]}
                value={val}
                label={STAT_LABELS[i]}
                display={STAT_DISPLAY[i]}
                trigger={inView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
