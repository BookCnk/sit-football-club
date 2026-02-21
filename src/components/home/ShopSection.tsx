import type { Product } from '@/types';

interface Props {
  products: Product[];
}

export default function ShopSection({ products: _products }: Props) {
  return (
    <section className="border-t border-white/10 bg-neutral-900/30 py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Coming Soon */}
        <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
          
          <div>
            <h2 className="text-3xl font-display font-semibold tracking-tighter mb-2">
              OFFICIAL <span className="text-neutral-600">MERCHANDISE</span>
            </h2>
            <p className="text-neutral-500 text-sm uppercase tracking-widest">Coming Soon</p>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>

      {/* ============================================================
          SHOP CODE — commented out, restore when ready
      ===============================================================

      import { ArrowLeft, ArrowRight } from 'lucide-react';
      import ProductCard from './ProductCard';
      import FadeUp from '@/components/ui/FadeUp';

      <div className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-display font-semibold tracking-tighter">
              OFFICIAL <span className="text-neutral-600">MERCHANDISE</span>
            </h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all duration-200" aria-label="Previous">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all duration-200" aria-label="Next">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <FadeUp delay={400}>
          <div className="mt-12 text-center">
            <button className="w-full md:w-auto px-8 py-3 bg-red-600 text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-200">
              Browse the Shop
            </button>
          </div>
        </FadeUp>
      </div>

      ============================================================ */}
    </section>
  );
}
