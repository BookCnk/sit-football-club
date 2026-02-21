import Link from 'next/link';
import PlayerCard from './PlayerCard';
import type { Player } from '@/types';

interface Props {
  players: Player[];
}

export default function SquadSection({ players }: Props) {
  return (
    <section className="py-32 bg-gradient-to-b from-[#030303] to-[#0a0a0a] relative overflow-hidden">
      {/* Decoration Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="text-xs font-mono text-red-500 tracking-widest uppercase mb-4 block">
            [ FIRST TEAM SQUAD ]
          </span>
          <h2 className="text-5xl md:text-7xl font-display font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-700">
            MEET THE <span className="italic font-serif text-neutral-600">SQUAD</span>
          </h2>
        </div>

        {/* Always 5 columns at every breakpoint */}
        <div className="grid grid-cols-5 gap-4">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>

        
      </div>
    </section>
  );
}
