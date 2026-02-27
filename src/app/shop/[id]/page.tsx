'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronDown, ChevronRight, Loader2, UploadCloud } from 'lucide-react';
import { useShopItem } from '@/api/features/shop-items/shopItemsHooks';
import type { ShopItem } from '@/api/features/shop-items/shopItemsTypes';
import { getErrorMessage, useToast } from '@/hooks/useToast';

const MAX_SLIP_SIZE_MB = 5;

function isSafeImageSrc(value: string) {
  return value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://');
}

function getImageUrls(images: unknown) {
  if (typeof images === 'string' && images.trim()) {
    const value = images.trim();
    return isSafeImageSrc(value) ? [value] : ['/placeholder.png'];
  }

  if (Array.isArray(images)) {
    const urls = images
      .map((entry) => {
        if (typeof entry === 'string') {
          const value = entry.trim();
          return isSafeImageSrc(value) ? value : '';
        }

        if (typeof entry === 'object' && entry && 'url' in entry) {
          const url = (entry as { url?: unknown }).url;
          if (typeof url === 'string') {
            const value = url.trim();
            return isSafeImageSrc(value) ? value : '';
          }
        }

        return '';
      })
      .filter(Boolean);

    return urls.length > 0 ? urls : ['/placeholder.png'];
  }

  if (typeof images === 'object' && images && 'url' in images) {
    const url = (images as { url?: unknown }).url;
    if (typeof url === 'string' && url.trim()) {
      const value = url.trim();
      return isSafeImageSrc(value) ? [value] : ['/placeholder.png'];
    }
  }

  return ['/placeholder.png'];
}

function getSizes(sizes: unknown) {
  if (!Array.isArray(sizes)) {
    return null;
  }

  const values = sizes
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter(Boolean);

  return values.length > 0 ? values : null;
}

function getBadge(badge: unknown) {
  return typeof badge === 'string' && badge.trim() ? badge.trim() : null;
}

function getText(value: unknown, fallback = 'Contact club admin for details.') {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function normalizeItem(item: ShopItem) {
  return {
    id: item.id,
    name: item.name,
    subtitle: item.subtitle?.trim() || 'Official Merchandise',
    price: Number(item.price),
    badge: getBadge(item.badge),
    images: getImageUrls(item.images),
    sizes: getSizes(item.sizes),
    description: item.description,
    payment: getText(item.payment, 'Contact club admin for payment details.'),
    shipping: getText(item.shipping, 'Contact club admin for shipping details.'),
  };
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-white/10">
      <button
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between py-4 text-[11px] font-bold uppercase tracking-widest text-neutral-300 transition-colors hover:text-white"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="whitespace-pre-line pb-5 text-[12px] leading-relaxed text-neutral-400">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const itemId = Number(params?.id);
  const validItemId = Number.isInteger(itemId) && itemId > 0 ? itemId : '';
  const { data, isLoading, error } = useShopItem(validItemId);
  const toast = useToast();

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [screenName, setScreenName] = useState('');
  const [screenNumber, setScreenNumber] = useState('');
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreviewUrl, setSlipPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const item = data ? normalizeItem(data) : null;

  useEffect(() => {
    if (!item) {
      return;
    }

    setActiveImg(0);
    setSelectedSize(item.sizes?.[0] ?? null);
    setContactPhone('');
    setContactEmail('');
    setScreenName('');
    setScreenNumber('');
    setSlipFile(null);
    setSlipPreviewUrl(null);
  }, [item?.id]);

  useEffect(() => {
    if (!slipFile) {
      setSlipPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(slipFile);
    setSlipPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [slipFile]);

  if (!validItemId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] px-6 text-sm text-neutral-500">
        Invalid product.
        <Link href="/shop" className="ml-2 text-red-500 underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] px-6 text-sm text-neutral-400">
        Loading product...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] px-6 text-sm text-neutral-500">
        Product not found.
        <Link href="/shop" className="ml-2 text-red-500 underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!item) {
      toast.error('Product data is unavailable.', 'Order failed');
      return;
    }

    if (!contactPhone.trim()) {
      toast.error('Please enter a contact phone number.', 'Validation error');
      return;
    }

    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      toast.error('Please enter a valid contact email.', 'Validation error');
      return;
    }

    if (item.sizes && !selectedSize) {
      toast.error('Please select a size before placing the order.', 'Validation error');
      return;
    }

    if (!slipFile) {
      toast.error('Please upload a payment slip image.', 'Validation error');
      return;
    }

    if (!slipFile.type.startsWith('image/')) {
      toast.error('Slip upload must be an image file.', 'Validation error');
      return;
    }

    if (slipFile.size > MAX_SLIP_SIZE_MB * 1024 * 1024) {
      toast.error(`Slip image must be ${MAX_SLIP_SIZE_MB}MB or smaller.`, 'Validation error');
      return;
    }

    const formData = new FormData();
    formData.append('shopItemId', String(item.id));
    formData.append('contactPhone', contactPhone.trim());
    formData.append('contactEmail', contactEmail.trim());
    formData.append('selectedSize', selectedSize || '');
    formData.append('screenName', screenName.trim());
    formData.append('screenNumber', screenNumber.trim());
    formData.append('slipFile', slipFile);

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to submit order.');
      }

      toast.success(
        `Reference #${payload.order.id}. We will review your slip and contact you soon.`,
        'Order submitted',
      );
      setContactPhone('');
      setContactEmail('');
      setScreenName('');
      setScreenNumber('');
      setSlipFile(null);
    } catch (submitErrorValue) {
      toast.error(getErrorMessage(submitErrorValue, 'Failed to submit order.'), 'Order failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030303] to-[#0a0a0a]">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-32">
        <nav className="mb-10 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-600">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/shop" className="transition-colors hover:text-white">
            Shop
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="max-w-[200px] truncate text-neutral-400">{item.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 xl:gap-20">
          <div className="flex flex-col-reverse gap-4 lg:flex-row">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {item.images.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  onClick={() => setActiveImg(index)}
                  className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded border transition-all duration-200 lg:h-14 lg:w-14 ${
                    activeImg === index
                      ? 'border-white/60'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="relative h-full w-full bg-neutral-900">
                    <Image
                      src={src}
                      alt={`${item.name} view ${index + 1}`}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  </div>
                </button>
              ))}
            </div>

            <div className="relative w-full aspect-square overflow-hidden rounded-lg border border-white/10 bg-neutral-900/80 lg:flex-1">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.12),transparent_70%)]" />

              {item.badge && (
                <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-start pt-8">
                  <span className="font-display text-2xl font-black tracking-[0.15em] text-white drop-shadow-lg">
                    {item.badge}
                  </span>
                  <span className="mt-1 border border-white/40 px-4 py-1 font-display text-sm font-bold tracking-widest text-white">
                    THB {item.price.toLocaleString()}
                  </span>
                </div>
              )}

              <Image
                src={item.images[activeImg] ?? item.images[0]}
                alt={item.name}
                fill
                sizes="(max-width: 1024px) 90vw, 50vw"
                className="object-contain p-8 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="mb-2 text-[10px] uppercase tracking-widest text-neutral-500">
              {item.subtitle}
            </span>
            <h1 className="mb-4 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {item.name}
            </h1>

            <div className="mb-4 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-white">
                THB {item.price.toLocaleString()}
              </span>
              {item.badge === 'PRE-ORDER' && (
                <span className="rounded border border-red-600/40 bg-red-600/10 px-2 py-1 text-[10px] uppercase tracking-widest text-red-500">
                  Pre-Order
                </span>
              )}
            </div>

            <p className="mb-8 text-sm leading-6 text-neutral-400">
              Submit your order details and upload the payment slip here. Once the slip is verified,
              the club team will contact you through the phone number or email you provide.
            </p>

            <form onSubmit={handleSubmit} className="mb-10 space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              {item.sizes && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Size : <span className="text-white">{selectedSize}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-600">
                      Required
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`h-11 min-w-[44px] rounded-sm border px-3 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 ${
                          selectedSize === size
                            ? 'scale-105 border-white bg-white text-black'
                            : 'border-white/15 text-neutral-400 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Contact Phone
                  </span>
                  <input
                    value={contactPhone}
                    onChange={(event) => setContactPhone(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
                    placeholder="08x-xxx-xxxx"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Contact Email
                  </span>
                  <input
                    value={contactEmail}
                    onChange={(event) => setContactEmail(event.target.value)}
                    type="email"
                    className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Name To Screen
                  </span>
                  <input
                    value={screenName}
                    onChange={(event) => setScreenName(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
                    placeholder="PLAYER NAME"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Number To Screen
                  </span>
                  <input
                    value={screenNumber}
                    onChange={(event) => setScreenNumber(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
                    placeholder="10"
                  />
                </label>
              </div>

              <label className="block space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Upload Payment Slip
                </span>
                <div className="rounded-3xl border border-dashed border-white/15 bg-neutral-950/70 p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-white">Slip image required</div>
                        <div className="text-xs text-neutral-500">
                          JPG, PNG, or WEBP. Maximum {MAX_SLIP_SIZE_MB}MB.
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => setSlipFile(event.target.files?.[0] || null)}
                      className="block w-full text-sm text-neutral-400 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-black hover:file:bg-neutral-200 md:w-auto"
                    />
                  </div>

                  {slipFile && (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="mb-3 text-xs text-neutral-400">{slipFile.name}</div>
                      {slipPreviewUrl && (
                        <img
                          src={slipPreviewUrl}
                          alt="Slip preview"
                          className="max-h-64 w-full rounded-2xl object-contain bg-black/40"
                        />
                      )}
                    </div>
                  )}
                </div>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-200 ${
                  isSubmitting
                    ? 'cursor-not-allowed bg-white/10 text-neutral-500'
                    : 'bg-white text-black hover:scale-[1.01] hover:bg-neutral-200 active:scale-95'
                }`}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Submitting Order...' : 'Submit Order'}
              </button>
            </form>

            <div className="border-b border-white/10">
              <Accordion title="Description">{item.description}</Accordion>
              <Accordion title="Payment">{item.payment}</Accordion>
              <Accordion title="Shipping & Return">{item.shipping}</Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
