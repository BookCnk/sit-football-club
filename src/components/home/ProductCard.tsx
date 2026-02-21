'use client';

import Image from 'next/image';
import type { Product } from '@/types';
import FadeUp from '@/components/ui/FadeUp';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  return (
    <FadeUp delay={index * 80}>
      <div className="group cursor-pointer">
        <div className="bg-[#0a0a0a] rounded-md aspect-square flex items-center justify-center p-6 border border-white/5 relative overflow-hidden hover:border-white/20 transition-all duration-300">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
          />
          {product.isNew && (
            <div className="absolute top-2 right-2 bg-red-600 text-[10px] font-bold text-white px-2 py-0.5 rounded-sm z-10 animate-red-pulse">
              NEW
            </div>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold group-hover:text-red-500 transition-colors">{product.name}</h3>
          <p className="text-xs text-neutral-500 mt-1">{product.price}</p>
        </div>
      </div>
    </FadeUp>
  );
}
