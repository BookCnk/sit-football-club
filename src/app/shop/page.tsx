"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useShopItems } from "@/api/features/shop-items/shopItemsHooks";
import type { ShopItem } from "@/api/features/shop-items/shopItemsTypes";

type CartItem = {
  id: number;
  name: string;
  price: number;
  size: string | null;
  qty: number;
  image: string;
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function getImageUrl(images: unknown): string {
  const isSafeImageSrc = (value: string) =>
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://");
  // รองรับหลายรูปแบบ: string, string[], {url}, {url}[]
  if (!images) return "/placeholder.png";

  if (typeof images === "string") {
    const value = images.trim();
    return isSafeImageSrc(value) ? value : "/placeholder.png";
  }

  if (Array.isArray(images)) {
    const first = images[0];
    if (!first) return "/placeholder.png";
    if (typeof first === "string") {
      const value = first.trim();
      return isSafeImageSrc(value) ? value : "/placeholder.png";
    }
    if (typeof first === "object" && first && "url" in first) {
      const u = (first as any).url;
      if (typeof u === "string") {
        const value = u.trim();
        return isSafeImageSrc(value) ? value : "/placeholder.png";
      }
    }
    return "/placeholder.png";
  }

  if (typeof images === "object" && images && "url" in images) {
    const u = (images as any).url;
    if (typeof u === "string") {
      const value = u.trim();
      return isSafeImageSrc(value) ? value : "/placeholder.png";
    }
  }

  return "/placeholder.png";
}

function getSizesArray(sizes: unknown): string[] | null {
  if (!sizes) return null;
  if (Array.isArray(sizes)) {
    const arr = sizes.filter((x) => typeof x === "string") as string[];
    return arr.length ? arr : null;
  }
  return null;
}

function getBadge(badge: unknown): string | null {
  if (!badge) return null;
  if (typeof badge === "string") return badge;
  return null;
}

// ── Skeleton Components ───────────────────────────────────────────────────────────
function ProductCardSkeleton() {
  return (
    <div className="bg-neutral-900/60 border border-white/5 rounded-lg overflow-hidden flex flex-col animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-neutral-800 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
        {/* Badge skeleton */}
        <div className="absolute top-3 left-3 w-12 h-5 bg-neutral-700 rounded" />
      </div>

      {/* Info skeleton */}
      <div className="p-5 flex flex-col flex-1">
        {/* Subtitle skeleton */}
        <div className="h-3 bg-neutral-800 rounded w-20 mb-2" />

        {/* Title skeleton */}
        <div className="h-4 bg-neutral-700 rounded w-3/4 mb-3" />

        {/* Description skeleton */}
        <div className="flex-1 space-y-2 mb-4">
          <div className="h-3 bg-neutral-800 rounded" />
          <div className="h-3 bg-neutral-800 rounded w-5/6" />
          <div className="h-3 bg-neutral-800 rounded w-4/6" />
        </div>

        {/* Size picker skeleton */}
        <div className="mb-4">
          <div className="h-2 bg-neutral-800 rounded w-8 mb-2" />
          <div className="flex gap-1.5">
            <div className="w-8 h-8 bg-neutral-800 rounded" />
            <div className="w-8 h-8 bg-neutral-800 rounded" />
            <div className="w-8 h-8 bg-neutral-800 rounded" />
          </div>
        </div>

        {/* Price and button skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="h-5 bg-neutral-700 rounded w-16" />
          <div className="h-8 bg-neutral-700 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

function ShopPageSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
function ProductCard({
  item,
  onAddToCart,
}: {
  item: {
    id: number;
    name: string;
    subtitle?: string | null;
    price: number;
    badge: string | null;
    image: string;
    sizes: string[] | null;
    description: string;
  };
  onAddToCart: (item: CartItem) => void;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    item.sizes ? (item.sizes[0] ?? null) : null,
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
      <Link
        href={`/shop/${item.id}`}
        className="relative aspect-square overflow-hidden bg-neutral-900 block">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
        />
        {item.badge && (
          <span
            className={`absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
              item.badge === "NEW"
                ? "bg-red-600 text-white"
                : "bg-white text-black"
            }`}>
            {item.badge}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[9px] uppercase tracking-widest text-neutral-500 mb-1">
          {item.subtitle ?? "Official Merchandise"}
        </span>

        <Link href={`/shop/${item.id}`}>
          <h3 className="font-display font-semibold text-sm tracking-tight mb-1 text-white hover:text-neutral-300 transition-colors">
            {item.name}
          </h3>
        </Link>

        <p className="text-[11px] text-neutral-500 leading-relaxed mb-4 flex-1 line-clamp-3">
          {item.description}
        </p>

        {/* Size picker */}
        {item.sizes && (
          <div className="mb-4">
            <span className="text-[9px] uppercase tracking-widest text-neutral-600 mb-2 block">
              Size
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {item.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-8 h-8 text-[10px] font-bold border transition-all duration-150 rounded-sm ${
                    selectedSize === sz
                      ? "bg-white text-black border-white"
                      : "border-white/15 text-neutral-400 hover:border-white/40"
                  }`}>
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span className="font-display font-bold text-lg text-white">
            ฿{item.price.toLocaleString()}
          </span>
          <button
            onClick={handleAdd}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 rounded-sm ${
              added
                ? "bg-green-600 text-white scale-95"
                : "bg-white text-black hover:bg-neutral-200 hover:scale-105 active:scale-95"
            }`}>
            {added ? "✓ Added" : "Add to Cart"}
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
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-[#0a0a0a] border-l border-white/10 z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
          <span className="font-display font-semibold tracking-tight text-lg">
            Cart ({cart.reduce((s, i) => s + i.qty, 0)})
          </span>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-xl leading-none">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-neutral-600 text-sm">
              Your cart is empty
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex gap-4 items-start">
                <div className="w-14 h-14 bg-neutral-900 rounded border border-white/5 flex-shrink-0 relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {item.name}
                  </p>
                  {item.size && (
                    <p className="text-[10px] text-neutral-500 uppercase">
                      Size: {item.size}
                    </p>
                  )}
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    ฿{item.price.toLocaleString()} × {item.qty}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(item.id, item.size)}
                  className="text-neutral-600 hover:text-red-500 transition-colors text-xs mt-1">
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
              <span className="font-display font-bold text-white text-lg">
                ฿{total.toLocaleString()}
              </span>
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
  const { data, isLoading, error } = useShopItems();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "JERSEY" | "MERCH">("ALL");

  const products = useMemo(() => {
    const items = (data ?? []) as ShopItem[];

    return items.map((it) => ({
      id: it.id,
      name: it.name,
      subtitle: it.subtitle ?? null,
      price: Number(it.price),
      badge: getBadge(it.badge),
      image: getImageUrl(it.images),
      sizes: getSizesArray(it.sizes),
      description: it.description,
    }));
  }, [data]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return products;
    if (filter === "JERSEY") return products.filter((p) => !!p.sizes?.length);
    return products.filter((p) => !p.sizes?.length);
  }, [products, filter]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (c) => c.id === item.id && c.size === item.size,
      );
      if (existing) {
        return prev.map((c) =>
          c.id === item.id && c.size === item.size
            ? { ...c, qty: c.qty + 1 }
            : c,
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number, size: string | null) => {
    setCart((prev) => prev.filter((c) => !(c.id === id && c.size === size)));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <CartDrawer
        cart={cart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
      />

      <div className="min-h-screen bg-gradient-to-b from-[#030303] to-[#0a0a0a]">
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.12),transparent_60%)]" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 mb-8">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-neutral-400">Shop</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-[10px] font-mono text-red-500 tracking-widest uppercase mb-3 block">
                  [ OFFICIAL MERCHANDISE ]
                </span>
                <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
                  CLUB
                  <br />
                  <span className="italic font-serif text-neutral-600">
                    SHOP
                  </span>
                </h1>
              </div>

              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-3 px-6 py-3 border border-white/15 hover:border-white/40 hover:bg-white/5 transition-all duration-200 rounded-sm self-start md:self-auto">
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  Cart
                </span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 bg-red-600 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex gap-1 mt-12 border-b border-white/10">
              {(["ALL", "JERSEY", "MERCH"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border-b-2 -mb-px ${
                    filter === f
                      ? "border-red-500 text-white"
                      : "border-transparent text-neutral-500 hover:text-neutral-300"
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
          {isLoading ? (
            <ShopPageSkeleton />
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
              <div className="text-red-200 text-sm mb-2">
                Failed to load products
              </div>
              <div className="text-red-400 text-xs">
                {(error as Error).message}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-neutral-500 text-sm mb-2">
                No products found
              </div>
              <div className="text-neutral-600 text-xs">
                Try adjusting your filters
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
