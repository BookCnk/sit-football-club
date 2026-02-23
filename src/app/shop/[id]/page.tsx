'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';

// ── Product data (shared with shop page) ─────────────────────────────────────
const SHOP_ITEMS = [
  {
    id: 1,
    name: 'SIT FC Home Kit 2025',
    subtitle: 'Official Match Jersey',
    price: 850,
    badge: 'PRE-ORDER',
    images: [
      'https://htfc.co.uk/wp-content/uploads/2025/02/Body-Warmer.png',
      'https://htfc.co.uk/wp-content/uploads/2025/10/thepitmen-jumper.webp',
      'https://htfc.co.uk/wp-content/uploads/2025/02/Body-Warmer.png',
      'https://htfc.co.uk/wp-content/uploads/2025/02/Body-Warmer.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'เสื้อเหย้าอย่างเป็นทางการของ SIT Football Club ฤดูกาล 2025 ผลิตจากผ้าโพลีเอสเตอร์คุณภาพสูง ระบายอากาศดี เหมาะสำหรับการแข่งขันและสวมใส่ในชีวิตประจำวัน มีตราสโมสร SIT FC ปักที่หน้าอก',
    payment: 'ชำระผ่าน PromptPay / Bank Transfer\nบัญชี: SIT Football Club\nธ.กสิกรไทย เลขที่: 000-0-00000-0\nหลังโอนส่งสลิปมาที่ LINE: @sitfc',
    shipping: 'จัดส่งภายใน 3-5 วันทำการหลังยืนยันการชำระเงิน\nจัดส่งผ่าน Kerry Express ทั่วไทย\nรับด้วยตนเองได้ที่คณะ SIT อาคาร IT โดยไม่มีค่าใช้จ่าย',
  },
  {
    id: 2,
    name: 'SIT FC Away Kit 2025',
    subtitle: 'Official Away Jersey',
    price: 850,
    badge: 'PRE-ORDER',
    images: [
      'https://htfc.co.uk/wp-content/uploads/2025/10/thepitmen-jumper.webp',
      'https://htfc.co.uk/wp-content/uploads/2025/02/Body-Warmer.png',
      'https://htfc.co.uk/wp-content/uploads/2025/10/thepitmen-jumper.webp',
      'https://htfc.co.uk/wp-content/uploads/2025/10/thepitmen-jumper.webp',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'เสื้อเยือนอย่างเป็นทางการ ฤดูกาล 2025 โดดเด่นด้วยดีไซน์สีขาว-แดง สไตล์ KMUTT',
    payment: 'ชำระผ่าน PromptPay / Bank Transfer\nบัญชี: SIT Football Club\nธ.กสิกรไทย เลขที่: 000-0-00000-0',
    shipping: 'จัดส่งภายใน 3-5 วันทำการ\nจัดส่งผ่าน Kerry Express ทั่วไทย',
  },
  {
    id: 3,
    name: "'We Are SIT' Hoodie",
    subtitle: 'Premium Supporter Wear',
    price: 950,
    badge: null,
    images: [
      'https://htfc.co.uk/wp-content/uploads/2025/10/thepitmen-jumper.webp',
      'https://htfc.co.uk/wp-content/uploads/2025/10/thepitmen-jumper.webp',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'ฮู้ดดี้คุณภาพพรีเมี่ยม สกรีนตราสโมสรด้านหน้า ผ้าหนา นุ่ม ใส่อุ่น',
    payment: 'ชำระผ่าน PromptPay / Bank Transfer',
    shipping: 'จัดส่งภายใน 3-5 วันทำการ',
  },
  {
    id: 4,
    name: 'Training Jersey 2025',
    subtitle: 'Player Edition',
    price: 650,
    badge: 'LIMITED',
    images: [
      'https://htfc.co.uk/wp-content/uploads/2025/02/Body-Warmer.png',
      'https://htfc.co.uk/wp-content/uploads/2025/02/Body-Warmer.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'เสื้อฝึกซ้อมรุ่น Player Edition เหมือนที่นักเตะสวมใส่จริงในการซ้อม',
    payment: 'ชำระผ่าน PromptPay / Bank Transfer',
    shipping: 'จัดส่งภายใน 3-5 วันทำการ',
  },
  {
    id: 5,
    name: 'SIT FC Black Pen',
    subtitle: 'Official Merchandise',
    price: 50,
    badge: null,
    images: ['https://htfc.co.uk/wp-content/uploads/2025/02/Pen.jpg'],
    sizes: null,
    description: 'ปากกาโลโก้ SIT FC สีดำ ของที่ระลึกอย่างเป็นทางการ',
    payment: 'ชำระผ่าน PromptPay / Bank Transfer',
    shipping: 'จัดส่งภายใน 3-5 วันทำการ',
  },
  {
    id: 6,
    name: 'Club Pin Badge',
    subtitle: "Collector's Item",
    price: 120,
    badge: null,
    images: ['https://htfc.co.uk/wp-content/uploads/2025/02/Wooden-Circle-Keyring.jpg'],
    sizes: null,
    description: 'เข็มกลัดโลโก้สโมสร งานแฮนด์เมดสำหรับนักสะสม',
    payment: 'ชำระผ่าน PromptPay / Bank Transfer',
    shipping: 'จัดส่งภายใน 3-5 วันทำการ',
  },
];

// ── Accordion item ─────────────────────────────────────────────────────────────
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-white/10">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex justify-between items-center py-4 text-[11px] uppercase tracking-widest font-bold text-neutral-300 hover:text-white transition-colors"
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-5 text-[12px] text-neutral-400 leading-relaxed whitespace-pre-line">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const item = SHOP_ITEMS.find((p) => p.id === Number(params.id));

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(item?.sizes?.[1] ?? null);
  const [printName, setPrintName] = useState('NO SCREEN');
  const [added, setAdded] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center text-neutral-500 text-sm">
        Product not found.{' '}
        <Link href="/shop" className="text-red-500 ml-2 underline">Back to Shop</Link>
      </div>
    );
  }

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030303] to-[#0a0a0a]">
      {/* Bg grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-600 mb-10">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-400 truncate max-w-[200px]">{item.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* ── LEFT: Image Gallery ─────────────────────────────────────── */}
          <div className="flex gap-4">
            {/* Thumbnail strip */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              {item.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-14 h-14 bg-neutral-900 border rounded overflow-hidden transition-all duration-200 flex-shrink-0 ${
                    activeImg === i ? 'border-white/60' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image src={src} alt={`${item.name} view ${i + 1}`} fill sizes="56px" className="object-contain p-1" />
                  </div>
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative flex-1 aspect-square bg-neutral-900/80 border border-white/10 rounded-lg overflow-hidden">
              {/* Glow bg */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.12),transparent_70%)]" />

              {/* Badge overlay */}
              {item.badge && (
                <div className="absolute inset-0 flex flex-col items-center justify-start pt-8 pointer-events-none z-10">
                  <span className="text-2xl font-display font-black tracking-[0.15em] text-white drop-shadow-lg">
                    {item.badge}
                  </span>
                  <span className="mt-1 px-4 py-1 border border-white/40 text-white font-bold font-display text-sm tracking-widest">
                    ฿{item.price.toLocaleString()}.-
                  </span>
                </div>
              )}

              <Image
                src={item.images[activeImg]}
                alt={item.name}
                fill
                sizes="(max-width: 1024px) 90vw, 50vw"
                className="object-contain p-8 transition-all duration-300"
              />
            </div>
          </div>

          {/* ── RIGHT: Product Info ─────────────────────────────────────── */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">{item.subtitle}</span>
            <h1 className="font-display font-semibold text-2xl md:text-3xl tracking-tight text-white mb-4 leading-tight">
              {item.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-display font-bold text-white">฿{item.price.toLocaleString()}</span>
              {item.badge === 'PRE-ORDER' && (
                <span className="text-[10px] uppercase tracking-widest text-red-500 border border-red-600/40 bg-red-600/10 px-2 py-1 rounded">
                  Pre-Order
                </span>
              )}
            </div>

            {/* Size Selector */}
            {item.sizes && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    SIZE : <span className="text-white">{selectedSize}</span>
                  </span>
                  <button className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white transition-colors border-b border-neutral-700">
                    SIZE CHART
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {item.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-[44px] h-11 px-3 text-[11px] font-bold uppercase tracking-wider border transition-all duration-150 rounded-sm ${
                        selectedSize === sz
                          ? 'bg-white text-black border-white scale-105'
                          : 'border-white/15 text-neutral-400 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Screen Printing Name */}
            {item.sizes && (
              <div className="mb-8">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-3">
                  Screen Printing Name
                </label>
                <div className="relative">
                  <select
                    value={printName}
                    onChange={(e) => setPrintName(e.target.value)}
                    className="w-full appearance-none bg-neutral-900 border border-white/15 text-white text-[11px] uppercase tracking-wider px-4 py-3 pr-10 rounded-sm focus:outline-none focus:border-white/40 transition-colors"
                  >
                    <option value="NO SCREEN">NO SCREEN</option>
                    <option value="NAME + NUMBER">NAME + NUMBER (฿+150)</option>
                    <option value="NAME ONLY">NAME ONLY (฿+100)</option>
                    <option value="NUMBER ONLY">NUMBER ONLY (฿+80)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAdd}
              className={`w-full py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-200 rounded-sm mb-6 ${
                added
                  ? 'bg-green-600 text-white scale-95'
                  : 'bg-white text-black hover:bg-neutral-200 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>

            {/* Contact note */}
            <p className="text-[10px] text-neutral-600 uppercase tracking-widest text-center mb-8">
              สอบถามเพิ่มเติม LINE: <span className="text-neutral-400">@sitfc</span>
            </p>

            {/* Accordion */}
            <div className="border-b border-white/10">
              <Accordion title="Description">
                {item.description}
              </Accordion>
              <Accordion title="Payment">
                {item.payment}
              </Accordion>
              <Accordion title="Shipping & Return">
                {item.shipping}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
