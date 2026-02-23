'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ── Shop Items Data ─────────────────────────────────────────────────────────
const SHOP_ITEMS = [
  {
    id: 1,
    name: 'SIT FC Home Kit 2025',
    subtitle: 'Official Match Jersey',
    price: 850,
    badge: 'NEW',
    image: 'https://htfc.co.uk/wp-content/uploads/2025/02/Body-Warmer.png',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'เสื้อเหย้าอย่างเป็นทางการของ SIT Football Club ฤดูกาล 2025 ผลิตจากผ้าคุณภาพสูงเพื่อสมรรถภาพที่ดีที่สุด',
  },
  {
    id: 2,
    name: "SIT FC Away Kit 2025",
    subtitle: 'Official Away Jersey',
    price: 850,
    badge: 'NEW',
    image: 'https://htfc.co.uk/wp-content/uploads/2025/10/thepitmen-jumper.webp',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'เสื้อเยือนอย่างเป็นทางการ โดดเด่นด้วยดีไซน์สไตล์ KMUTT',
  },
  {
    id: 3,
    name: "'We Are SIT' Hoodie",
    subtitle: 'Premium Supporter Wear',
    price: 950,
    badge: null,
    image: 'https://htfc.co.uk/wp-content/uploads/2025/10/thepitmen-jumper.webp',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'ฮู้ดดี้คุณภาพพรีเมี่ยม สกรีนตราสโมสรด้านหน้า',
  },
  {
    id: 4,
    name: 'Training Jersey 2025',
    subtitle: 'Player Edition',
    price: 650,
    badge: 'LIMITED',
    image: 'https://htfc.co.uk/wp-content/uploads/2025/02/Body-Warmer.png',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'เสื้อฝึกซ้อมรุ่น Player Edition เหมือนที่นักเตะสวมใส่จริง',
  },
  {
    id: 5,
    name: 'SIT FC Black Pen',
    subtitle: 'Official Merchandise',
    price: 50,
    badge: null,
    image: 'https://htfc.co.uk/wp-content/uploads/2025/02/Pen.jpg',
    sizes: null,
    description: 'ปากกาโลโก้ SIT FC สีดำ ของที่ระลึกอย่างเป็นทางการ',
  },
  {
    id: 6,
    name: 'Club Pin Badge',
    subtitle: 'Collector\'s Item',
    price: 120,
    badge: null,
    image: 'https://htfc.co.uk/wp-content/uploads/2025/02/Wooden-Circle-Keyring.jpg',
    sizes: null,
    description: 'เข็มกลัดโลโก้สโมสร งานแฮนด์เมดสำหรับนักสะสม',
  },
];

type CartItem = {
  id: number;
  name: string;
  price: number;
  size: string | null;
  qty: number;
  image: string;
};

// ── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  item,
  onAddToCart,
}: {
  item: (typeof SHOP_ITEMS)[0];
  onAddToCart: (item: CartItem) => void;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    item.sizes ? item.sizes[1] : null
  );
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      size: selectedSize,
      qty: 1,
      image: item.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-neutral-900/60 border border-white/5 rounded-lg overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col">
      {/* Image — links to detail */}
      <Link href={`/shop/${item.id}`} className="relative aspect-square overflow-hidden bg-neutral-900 block">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
        />
        {item.badge && (
          <span className={`absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
            item.badge === 'NEW' ? 'bg-red-600 text-white' : 'bg-white text-black'
          }`}>
            {item.badge}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[9px] uppercase tracking-widest text-neutral-500 mb-1">{item.subtitle}</span>
        <Link href={`/shop/${item.id}`}>
          <h3 className="font-display font-semibold text-sm tracking-tight mb-1 text-white hover:text-neutral-300 transition-colors">{item.name}</h3>
        </Link>
        <p className="text-[11px] text-neutral-500 leading-relaxed mb-4 flex-1">{item.description}</p>

        {/* Size picker */}
        {item.sizes && (
          <div className="mb-4">
            <span className="text-[9px] uppercase tracking-widest text-neutral-600 mb-2 block">Size</span>
            <div className="flex gap-1.5 flex-wrap">
              {item.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-8 h-8 text-[10px] font-bold border transition-all duration-150 rounded-sm ${
                    selectedSize === sz
                      ? 'bg-white text-black border-white'
                      : 'border-white/15 text-neutral-400 hover:border-white/40'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span className="font-display font-bold text-lg text-white">฿{item.price.toLocaleString()}</span>
          <button
            onClick={handleAdd}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 rounded-sm ${
              added
                ? 'bg-green-600 text-white scale-95'
                : 'bg-white text-black hover:bg-neutral-200 hover:scale-105 active:scale-95'
            }`}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Cart Drawer ───────────────────────────────────────────────────────────────
function CartDrawer({
  cart,
  open,
  onClose,
  onRemove,
}: {
  cart: CartItem[];
  open: boolean;
  onClose: () => void;
  onRemove: (id: number, size: string | null) => void;
}) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-sm bg-[#0a0a0a] border-l border-white/10 z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
          <span className="font-display font-semibold tracking-tight text-lg">Cart ({cart.reduce((s, i) => s + i.qty, 0)})</span>
          <button onClick={onClose} className="text-neutral-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-neutral-600 text-sm">Your cart is empty</div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 items-start">
                <div className="w-14 h-14 bg-neutral-900 rounded border border-white/5 flex-shrink-0 relative overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                  {item.size && <p className="text-[10px] text-neutral-500 uppercase">Size: {item.size}</p>}
                  <p className="text-[11px] text-neutral-400 mt-0.5">฿{item.price.toLocaleString()} × {item.qty}</p>
                </div>
                <button
                  onClick={() => onRemove(item.id, item.size)}
                  className="text-neutral-600 hover:text-red-500 transition-colors text-xs mt-1"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-white/10 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Total</span>
              <span className="font-display font-bold text-white text-lg">฿{total.toLocaleString()}</span>
            </div>
            <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold uppercase tracking-widest transition-all duration-200 rounded-sm hover:scale-[1.02] active:scale-95">
              Checkout
            </button>
            <p className="text-[9px] text-neutral-600 text-center uppercase tracking-widest">
              ติดต่อสอบถาม LINE: @sitfc
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// ── Main Shop Page ────────────────────────────────────────────────────────────
export default function ShopPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'JERSEY' | 'MERCH'>('ALL');

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id && c.size === item.size);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id && c.size === item.size ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number, size: string | null) => {
    setCart((prev) => prev.filter((c) => !(c.id === id && c.size === size)));
  };

  const jerseys = [1, 2, 3, 4];
  const merch = [5, 6];
  const filtered = filter === 'ALL'
    ? SHOP_ITEMS
    : filter === 'JERSEY'
    ? SHOP_ITEMS.filter((i) => jerseys.includes(i.id))
    : SHOP_ITEMS.filter((i) => merch.includes(i.id));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onRemove={removeFromCart} />

      <div className="min-h-screen bg-gradient-to-b from-[#030303] to-[#0a0a0a]">
        {/* Decoration grid */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

        {/* Hero Banner */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.12),transparent_60%)]" />
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-neutral-400">Shop</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-[10px] font-mono text-red-500 tracking-widest uppercase mb-3 block">
                  [ OFFICIAL MERCHANDISE ]
                </span>
                <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
                  CLUB<br /><span className="italic font-serif text-neutral-600">SHOP</span>
                </h1>
              </div>

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-3 px-6 py-3 border border-white/15 hover:border-white/40 hover:bg-white/5 transition-all duration-200 rounded-sm self-start md:self-auto"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest">Cart</span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 bg-red-600 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 mt-12 border-b border-white/10">
              {(['ALL', 'JERSEY', 'MERCH'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border-b-2 -mb-px ${
                    filter === f
                      ? 'border-red-500 text-white'
                      : 'border-transparent text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((item) => (
              <ProductCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
