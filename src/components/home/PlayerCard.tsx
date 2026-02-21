import Image from 'next/image';
import type { Player } from '@/types';

interface Props {
  player: Player;
}

export default function PlayerCard({ player }: Props) {
  return (
    <div className="group w-full aspect-[3/4] relative overflow-hidden rounded-lg border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
      <Image
        src={player.image}
        alt={`${player.firstName} ${player.lastName}`}
        fill
        sizes="(max-width: 1280px) 20vw, 224px"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
  );
}
