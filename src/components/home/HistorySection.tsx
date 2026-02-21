'use client';


import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';

const STAT_VALUES = [2010, 5000, 99];
const STAT_LABELS = ['Founded', 'Capacity', 'Cup Winners'];
const STAT_DISPLAY = ['2024', '40+', 'TH'];

function AnimatedStat({ value, label, display, trigger }: { value: number; label: string; display: string; trigger: boolean }) {
  const count = useCountUp({ end: value, duration: 1800 }, trigger);
  const isNumeric = !isNaN(value) && value > 100;
  return (
    <div className="flex flex-col">
      <span className="text-3xl font-display font-bold text-white">
        {isNumeric
          ? label === 'Capacity'
            ? count >= 5000 ? '5k+' : `${(count / 1000).toFixed(1)}k`
            : count.toString()
          : display}
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
        {/* Video — slides in from left when visible */}
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

        {/* Content — slides in from right */}
        <div
          className={`order-1 md:order-2 transition-all duration-900 ease-out ${
            inView ? 'animate-slide-in-right' : 'opacity-0'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-4 block">Our History</span>
          <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tighter mb-6">
            FROM THE CLASSROOM<br />TO <span className="text-neutral-500">THE PITCH</span>
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed mb-8">
            SIT Football Club was founded at King Mongkut&apos;s University of Technology Thonburi
            in 2010, uniting players from the School of Information Technology.
            Built on passion, teamwork, and the drive to win — we compete at the highest university level.
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
