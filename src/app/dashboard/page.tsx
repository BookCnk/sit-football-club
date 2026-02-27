'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Package, PencilLine, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import {
  useCreateShopItem,
  useDeleteShopItem,
  useShopItems,
  useUpdateShopItem,
} from '@/api/features/shop-items/shopItemsHooks';
import type { CreateShopItemInput, ShopItem } from '@/api/features/shop-items/shopItemsTypes';
import { useAuth } from '@/hooks/useAuth';

type ShopItemFormState = {
  name: string;
  subtitle: string;
  price: string;
  badge: string;
  imagesText: string;
  sizesText: string;
  description: string;
  payment: string;
  shipping: string;
};

const EMPTY_FORM: ShopItemFormState = {
  name: '',
  subtitle: '',
  price: '',
  badge: '',
  imagesText: '',
  sizesText: '',
  description: '',
  payment: '',
  shipping: '',
};

function toText(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function parseStringList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function isSafeImageSrc(value: string) {
  return value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://');
}

function getImageList(images: unknown) {
  if (typeof images === 'string' && images.trim()) {
    const value = images.trim();
    return isSafeImageSrc(value) ? [value] : [];
  }

  if (Array.isArray(images)) {
    return images
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
          return '';
        }

        return '';
      })
      .filter(Boolean);
  }

  if (typeof images === 'object' && images && 'url' in images) {
    const url = (images as { url?: unknown }).url;
    if (typeof url === 'string') {
      const value = url.trim();
      return isSafeImageSrc(value) ? [value] : [];
    }
    return [];
  }

  return [];
}

function getSizeList(sizes: unknown) {
  if (!Array.isArray(sizes)) {
    return [];
  }

  return sizes
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter(Boolean);
}

function getPrimaryImage(images: unknown) {
  const imageList = getImageList(images);
  return imageList[0] || '/placeholder.png';
}

function toFormState(item: ShopItem): ShopItemFormState {
  return {
    name: item.name,
    subtitle: toText(item.subtitle),
    price: String(item.price),
    badge: toText(item.badge),
    imagesText: getImageList(item.images).join('\n'),
    sizesText: getSizeList(item.sizes).join(', '),
    description: item.description,
    payment: toText(item.payment),
    shipping: toText(item.shipping),
  };
}

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown date';
  }

  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { data, isLoading, error } = useShopItems();
  const createItem = useCreateShopItem();
  const updateItem = useUpdateShopItem();
  const deleteItem = useDeleteShopItem();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<ShopItemFormState>(EMPTY_FORM);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const items = Array.isArray(data) ? data : [];
  const selectedItem = items.find((item) => item.id === selectedId) ?? null;
  const isSubmitting = createItem.isPending || updateItem.isPending;

  let jerseyCount = 0;
  for (const item of items) {
    if (getSizeList(item.sizes).length > 0) {
      jerseyCount += 1;
    }
  }
  const merchCount = items.length - jerseyCount;

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.replace('/login');
    }
  }, [authLoading, router, user]);

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    setForm(toFormState(selectedItem));
  }, [selectedItem]);

  function resetForm() {
    setSelectedId(null);
    setForm(EMPTY_FORM);
    setFeedback(null);
  }

  function handleEdit(item: ShopItem) {
    setSelectedId(item.id);
    setForm(toFormState(item));
    setFeedback(null);
  }

  function handleChange(field: keyof ShopItemFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);
    const images = parseStringList(form.imagesText);
    const sizes = parseStringList(form.sizesText);

    if (!name || !description || Number.isNaN(price) || price < 0 || images.length === 0) {
      setFeedback({
        type: 'error',
        message: 'Name, price, description, and at least one image are required.',
      });
      return;
    }

    const payload: CreateShopItemInput = {
      name,
      subtitle: form.subtitle.trim() || null,
      price,
      badge: form.badge.trim() || null,
      images,
      sizes: sizes.length > 0 ? sizes : null,
      description,
      payment: form.payment.trim() || null,
      shipping: form.shipping.trim() || null,
    };

    try {
      const savedItem = selectedId
        ? await updateItem.mutateAsync({ id: selectedId, payload })
        : await createItem.mutateAsync(payload);

      setSelectedId(savedItem.id);
      setForm(toFormState(savedItem));
      setFeedback({
        type: 'success',
        message: selectedId ? 'Shop item updated.' : 'Shop item created.',
      });
    } catch (submitError) {
      setFeedback({
        type: 'error',
        message: submitError instanceof Error ? submitError.message : 'Failed to save shop item.',
      });
    }
  }

  async function handleDelete(item: ShopItem) {
    const confirmed = window.confirm(`Delete "${item.name}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setFeedback(null);

    try {
      await deleteItem.mutateAsync(item.id);

      if (selectedId === item.id) {
        resetForm();
      }

      setFeedback({
        type: 'success',
        message: `Deleted "${item.name}".`,
      });
    } catch (deleteError) {
      setFeedback({
        type: 'error',
        message: deleteError instanceof Error ? deleteError.message : 'Failed to delete shop item.',
      });
    }
  }

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-[#050505] px-6 pt-32 pb-24 text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 text-sm text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking admin access...
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050505] via-[#0b0b0b] to-[#050505] text-white">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100px_100px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.14),transparent_35%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_30%)]" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-red-500">
              <ShieldCheck className="h-4 w-4" />
              Admin Dashboard
            </div>
            <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
              Manage Shop
              <span className="block text-neutral-500">Inventory and Content</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-400">
              Create, update, and remove shop items that power the storefront. Changes here affect
              the live catalogue and product detail pages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-neutral-300">
              {user.email}
            </div>
            <Link
              href="/shop"
              className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
            >
              View Shop
            </Link>
            <Link
              href="/dashboard/orders"
              className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
            >
              View Orders
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs uppercase tracking-widest text-red-200 transition-colors hover:border-red-400/50 hover:bg-red-500/20"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
              Total Items
            </div>
            <div className="font-display text-3xl font-semibold">{items.length}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
              Jersey Items
            </div>
            <div className="font-display text-3xl font-semibold">{jerseyCount}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
              Merchandise
            </div>
            <div className="font-display text-3xl font-semibold">{merchCount}</div>
          </div>
        </div>

        {feedback && (
          <div
            className={`mb-8 rounded-2xl border px-5 py-4 text-sm ${
              feedback.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
                : 'border-red-500/30 bg-red-500/10 text-red-100'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[1.05fr,1.35fr]">
          <section className="rounded-3xl border border-white/10 bg-neutral-950/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  Catalogue
                </div>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                  Existing Shop Items
                </h2>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
              >
                <Plus className="h-4 w-4" />
                New Item
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-neutral-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading shop items...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-5 text-sm text-red-100">
                {error instanceof Error ? error.message : 'Failed to load shop items.'}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-neutral-500">
                No products yet. Create the first shop item from the form.
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const image = getPrimaryImage(item.images);
                  const isSelected = selectedId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border p-4 transition-colors ${
                        isSelected
                          ? 'border-red-500/50 bg-red-500/10'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                          <Image
                            src={image}
                            alt={item.name}
                            fill
                            sizes="96px"
                            className="object-contain p-3"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                              #{item.id}
                            </span>
                            {item.badge && (
                              <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-widest text-neutral-200">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          <h3 className="truncate font-display text-xl font-semibold tracking-tight">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-neutral-400">
                            {item.subtitle || 'Official Merchandise'}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-neutral-500">
                            <span>THB {Number(item.price).toLocaleString()}</span>
                            <span>{formatDate(item.createdAt)}</span>
                            <span>{getSizeList(item.sizes).length > 0 ? 'JERSEY' : 'MERCH'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
                        >
                          <PencilLine className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={deleteItem.isPending}
                          className="inline-flex items-center gap-2 rounded-full border border-red-500/30 px-4 py-2 text-xs uppercase tracking-widest text-red-200 transition-colors hover:border-red-400/50 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-neutral-950/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  Editor
                </div>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                  {selectedId ? 'Edit Shop Item' : 'Create Shop Item'}
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-neutral-300">
                <Package className="h-4 w-4" />
                {selectedId ? `ID ${selectedId}` : 'New Draft'}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                    Name
                  </span>
                  <input
                    value={form.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
                    placeholder="SIT FC Home Kit 2026"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                    Subtitle
                  </span>
                  <input
                    value={form.subtitle}
                    onChange={(event) => handleChange('subtitle', event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
                    placeholder="Official Match Jersey"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                    Price (THB)
                  </span>
                  <input
                    value={form.price}
                    onChange={(event) => handleChange('price', event.target.value)}
                    type="number"
                    min="0"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
                    placeholder="850"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                    Badge
                  </span>
                  <input
                    value={form.badge}
                    onChange={(event) => handleChange('badge', event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
                    placeholder="NEW / PRE-ORDER / LIMITED"
                  />
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                  Images
                </span>
                <textarea
                  value={form.imagesText}
                  onChange={(event) => handleChange('imagesText', event.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
                  placeholder={`https://example.com/image-1.png\nhttps://example.com/image-2.png`}
                />
                <p className="text-xs text-neutral-500">
                  One URL per line or separated with commas. Stored as a JSON array.
                </p>
              </label>

              <label className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                  Sizes
                </span>
                <textarea
                  value={form.sizesText}
                  onChange={(event) => handleChange('sizesText', event.target.value)}
                  rows={2}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
                  placeholder="S, M, L, XL"
                />
                <p className="text-xs text-neutral-500">
                  Leave empty for merchandise without size options.
                </p>
              </label>

              <label className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                  Description
                </span>
                <textarea
                  value={form.description}
                  onChange={(event) => handleChange('description', event.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
                  placeholder="Describe the item, material, fit, and club details."
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                    Payment
                  </span>
                  <textarea
                    value={form.payment}
                    onChange={(event) => handleChange('payment', event.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
                    placeholder="PromptPay / Bank Transfer details"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                    Shipping
                  </span>
                  <textarea
                    value={form.shipping}
                    onChange={(event) => handleChange('shipping', event.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
                    placeholder="Shipping time, courier, pickup option"
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                  Preview
                </div>
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                    <Image
                      src={getPrimaryImage(parseStringList(form.imagesText))}
                      alt={form.name || 'Draft item preview'}
                      fill
                      sizes="96px"
                      className="object-contain p-3"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-xs uppercase tracking-widest text-neutral-500">
                      {form.subtitle.trim() || 'Official Merchandise'}
                    </div>
                    <div className="truncate font-display text-2xl font-semibold tracking-tight">
                      {form.name.trim() || 'Untitled item'}
                    </div>
                    <div className="mt-2 text-sm text-neutral-400">
                      THB {Number(form.price || 0).toLocaleString()}
                    </div>
                    {form.badge.trim() && (
                      <div className="mt-3 inline-flex rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-widest text-neutral-200">
                        {form.badge.trim()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {selectedId ? 'Save Changes' : 'Create Item'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
                >
                  Reset
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </div>
  );
}
