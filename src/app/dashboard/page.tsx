'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Loader2, Package, PencilLine, Plus, Trash2 } from 'lucide-react';
import {
  useCreateShopItem,
  useDeleteShopItem,
  useShopItems,
  useUpdateShopItem,
} from '@/api/features/shop-items/shopItemsHooks';
import type { CreateShopItemInput, ShopItem } from '@/api/features/shop-items/shopItemsTypes';
import { getErrorMessage, useToast } from '@/hooks/useToast';
import ConfirmModal from '@/components/ui/ConfirmModal';

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
  const toast = useToast();
  const { data, isLoading, error } = useShopItems();
  const createItem = useCreateShopItem();
  const updateItem = useUpdateShopItem();
  const deleteItem = useDeleteShopItem();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ShopItem | null>(null);
  const [form, setForm] = useState<ShopItemFormState>(EMPTY_FORM);

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
    if (!selectedItem) {
      return;
    }

    setForm(toFormState(selectedItem));
  }, [selectedItem]);

  function resetForm() {
    setSelectedId(null);
    setForm(EMPTY_FORM);
  }

  function handleEdit(item: ShopItem) {
    setSelectedId(item.id);
    setForm(toFormState(item));
  }

  function handleChange(field: keyof ShopItemFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);
    const images = parseStringList(form.imagesText);
    const sizes = parseStringList(form.sizesText);

    if (!name || !description || Number.isNaN(price) || price < 0 || images.length === 0) {
      toast.error('Name, price, description, and at least one image are required.', 'Validation error');
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
      toast.success(selectedId ? 'Shop item updated.' : 'Shop item created.', 'Shop saved');
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, 'Failed to save shop item.'), 'Save failed');
    }
  }

  function requestDelete(item: ShopItem) {
    setItemToDelete(item);
  }

  function closeDeleteModal() {
    if (deleteItem.isPending) {
      return;
    }

    setItemToDelete(null);
  }

  async function confirmDelete() {
    if (!itemToDelete) {
      return;
    }

    const item = itemToDelete;
    try {
      await deleteItem.mutateAsync(item.id);

      if (selectedId === item.id) {
        resetForm();
      }

      toast.success(`Deleted "${item.name}".`, 'Item deleted');
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError, 'Failed to delete shop item.'), 'Delete failed');
    } finally {
      setItemToDelete(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="border-b border-white/10 pb-6">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-red-500">
          INVENTORY MANAGEMENT
        </div>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Shop Items & Products
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Create, update, and manage products displayed on the SIT FC storefront.
        </p>
      </div>

      {/* STATS SUMMARY CARDS */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
            Total Items
          </div>
          <div className="mt-1 font-display text-3xl font-semibold text-white">{items.length}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
            Jersey Kits
          </div>
          <div className="mt-1 font-display text-3xl font-semibold text-white">{jerseyCount}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
            Merchandise
          </div>
          <div className="mt-1 font-display text-3xl font-semibold text-white">{merchCount}</div>
        </div>
      </div>

      {/* TWO COLUMN GRID: CATALOGUE & EDITOR */}
      <div className="grid gap-8 xl:grid-cols-[1.05fr,1.35fr]">
        {/* CATALOGUE LIST */}
        <section className="rounded-3xl border border-white/10 bg-[#090909] p-6 shadow-2xl">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
                Catalogue
              </div>
              <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
                Product List
              </h2>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-200 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              New Item
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-neutral-400">
              <Loader2 className="h-4 w-4 animate-spin text-red-500" />
              Loading shop items...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-5 text-sm text-red-100">
              {error instanceof Error ? error.message : 'Failed to load shop items.'}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-neutral-500">
              No products yet. Create the first shop item using the editor form.
            </div>
          ) : (
            <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              {items.map((item) => {
                const image = getPrimaryImage(item.images);
                const isSelected = selectedId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-4 transition ${
                      isSelected
                        ? 'border-red-500/50 bg-red-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                        <Image
                          src={image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                            #{item.id}
                          </span>
                          {item.badge && (
                            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] uppercase tracking-widest text-neutral-200">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <h3 className="truncate font-display text-lg font-semibold tracking-tight">
                          {item.name}
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {item.subtitle || 'Official Merchandise'}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-neutral-400 font-mono">
                          <span>THB {Number(item.price).toLocaleString()}</span>
                          <span>·</span>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-2 border-t border-white/5 pt-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold tracking-wider text-neutral-300 transition hover:border-white/30 hover:text-white"
                      >
                        <PencilLine className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => requestDelete(item)}
                        disabled={deleteItem.isPending}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold tracking-wider text-red-300 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* EDITOR FORM */}
        <section className="rounded-3xl border border-white/10 bg-[#090909] p-6 shadow-2xl">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
                Item Editor
              </div>
              <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
                {selectedId ? 'Edit Shop Item' : 'Create New Item'}
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono tracking-wider text-neutral-300">
              <Package className="h-3.5 w-3.5 text-red-500" />
              {selectedId ? `ID #${selectedId}` : 'New Item Draft'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-neutral-300">
                  Item Name <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
                  placeholder="e.g. SIT FC Home Kit 2026"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-medium text-neutral-300">Subtitle</span>
                <input
                  value={form.subtitle}
                  onChange={(event) => handleChange('subtitle', event.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
                  placeholder="e.g. Official Match Jersey"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-neutral-300">
                  Price (THB) <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.price}
                  onChange={(event) => handleChange('price', event.target.value)}
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
                  placeholder="850"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-medium text-neutral-300">Badge Label</span>
                <input
                  value={form.badge}
                  onChange={(event) => handleChange('badge', event.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
                  placeholder="e.g. NEW / PRE-ORDER / LIMITED"
                />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-neutral-300">
                Image URLs <span className="text-red-500">*</span>
              </span>
              <textarea
                value={form.imagesText}
                onChange={(event) => handleChange('imagesText', event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
                placeholder={`/images/jersey-front.png\nhttps://example.com/jersey-back.png`}
              />
              <p className="text-[11px] text-neutral-500">
                Enter image paths or full URLs separated by line breaks.
              </p>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-neutral-300">Available Sizes</span>
              <textarea
                value={form.sizesText}
                onChange={(event) => handleChange('sizesText', event.target.value)}
                rows={2}
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
                placeholder="S, M, L, XL, 2XL"
              />
              <p className="text-[11px] text-neutral-500">
                Comma-separated sizes (leave empty for merchandise with no sizes).
              </p>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-neutral-300">
                Product Description <span className="text-red-500">*</span>
              </span>
              <textarea
                value={form.description}
                onChange={(event) => handleChange('description', event.target.value)}
                rows={4}
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
                placeholder="Describe fabric material, fit guidelines, and detail specs..."
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-neutral-300">Payment Details</span>
                <textarea
                  value={form.payment}
                  onChange={(event) => handleChange('payment', event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
                  placeholder="PromptPay / Bank Transfer details"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-medium text-neutral-300">Shipping Info</span>
                <textarea
                  value={form.shipping}
                  onChange={(event) => handleChange('shipping', event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
                  placeholder="Shipping schedule and courier options"
                />
              </label>
            </div>

            {/* PREVIEW CARD */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
                Live Preview
              </div>
              <div className="flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                  <Image
                    src={getPrimaryImage(parseStringList(form.imagesText))}
                    alt={form.name || 'Draft item preview'}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-neutral-400">
                    {form.subtitle.trim() || 'Official Merchandise'}
                  </div>
                  <div className="truncate font-display text-xl font-semibold tracking-tight text-white">
                    {form.name.trim() || 'Untitled product'}
                  </div>
                  <div className="mt-1 font-mono text-sm text-red-400 font-semibold">
                    THB {Number(form.price || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-red-500 disabled:bg-neutral-700"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {selectedId ? 'Save Changes' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/15 px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-300 transition hover:border-white/40 hover:text-white"
              >
                Reset Form
              </button>
            </div>
          </form>
        </section>
      </div>

      <ConfirmModal
        open={Boolean(itemToDelete)}
        title="Delete Shop Item"
        message={
          itemToDelete
            ? `Delete "${itemToDelete.name}"? This action cannot be undone.`
            : 'Delete this item? This action cannot be undone.'
        }
        confirmLabel="Delete Item"
        cancelLabel="Keep Item"
        danger
        loading={deleteItem.isPending}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
