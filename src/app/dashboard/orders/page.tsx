'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Loader2, PackageSearch, ShieldCheck, Trash2 } from 'lucide-react';
import { useDeleteOrder, useOrders, useUpdateOrderStatus } from '@/api/features/orders/ordersHooks';
import type { OrderStatus, ShopOrder } from '@/api/features/orders/ordersTypes';
import { useAuth } from '@/hooks/useAuth';

const PAGE_SIZE = 10;
const ORDER_STATUSES: OrderStatus[] = ['pending', 'verified', 'completed', 'cancelled'];

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown date';
  }

  return parsed.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusClassName(status: string) {
  if (status === 'completed') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100';
  }

  if (status === 'verified') {
    return 'border-sky-500/30 bg-sky-500/10 text-sky-100';
  }

  if (status === 'cancelled') {
    return 'border-red-500/30 bg-red-500/10 text-red-100';
  }

  return 'border-amber-500/30 bg-amber-500/10 text-amber-100';
}

export default function DashboardOrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const ordersQuery = useOrders({
    page,
    pageSize: PAGE_SIZE,
    status: statusFilter,
    search,
  });
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  const orders = ordersQuery.data?.data ?? [];
  const pagination = ordersQuery.data?.pagination;

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.replace('/login');
    }
  }, [authLoading, router, user]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search]);

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  async function handleStatusChange(order: ShopOrder, status: OrderStatus) {
    setFeedback(null);

    try {
      await updateStatus.mutateAsync({ id: order.id, status });
      setFeedback({
        type: 'success',
        message: `Order #${order.id} updated to ${status}.`,
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update order.',
      });
    }
  }

  async function handleDelete(order: ShopOrder) {
    const confirmed = window.confirm(`Delete order #${order.id}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setFeedback(null);

    try {
      await deleteOrder.mutateAsync(order.id);
      setFeedback({
        type: 'success',
        message: `Order #${order.id} deleted.`,
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete order.',
      });
    }
  }

  function applySearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchInput.trim());
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
              Admin Orders
            </div>
            <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
              Manage Orders
              <span className="block text-neutral-500">Review slips and update status</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-400">
              Review incoming orders, verify payment slips, and keep order status updated without
              leaving the admin panel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-neutral-300">
              {user.email}
            </div>
            <Link
              href="/dashboard"
              className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
            >
              Back to Shop Admin
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

        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr,220px]">
          <form
            onSubmit={applySearch}
            className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-neutral-950/80 p-5 md:flex-row"
          >
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by email, phone, screen name, or item"
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
            />
            <button
              type="submit"
              className="rounded-2xl bg-white px-5 py-3 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-[1.01]"
            >
              Search
            </button>
          </form>

          <div className="rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
            <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
              Status Filter
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | OrderStatus)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
            >
              <option value="all">All statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
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

        <section className="rounded-3xl border border-white/10 bg-neutral-950/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Orders</div>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                Paginated Order Table
              </h2>
            </div>
            <div className="text-sm text-neutral-500">
              {pagination ? `${pagination.total} total orders` : 'Loading orders...'}
            </div>
          </div>

          {ordersQuery.isLoading ? (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-neutral-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading orders...
            </div>
          ) : ordersQuery.error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-5 text-sm text-red-100">
              {ordersQuery.error instanceof Error ? ordersQuery.error.message : 'Failed to load orders.'}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-4 py-16 text-center">
              <PackageSearch className="mb-4 h-8 w-8 text-neutral-600" />
              <div className="text-sm text-neutral-400">No orders found for this filter.</div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                      <th className="px-4 py-2">Order</th>
                      <th className="px-4 py-2">Item</th>
                      <th className="px-4 py-2">Contact</th>
                      <th className="px-4 py-2">Customization</th>
                      <th className="px-4 py-2">Slip</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Created</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="bg-white/[0.03]">
                        <td className="rounded-l-2xl border-y border-l border-white/10 px-4 py-4 align-top">
                          <div className="font-display text-lg font-semibold">#{order.id}</div>
                          <div className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
                            THB {Number(order.shopItem.price).toLocaleString()}
                          </div>
                        </td>
                        <td className="border-y border-white/10 px-4 py-4 align-top">
                          <div className="font-medium text-white">{order.shopItem.name}</div>
                          <div className="mt-1 text-sm text-neutral-400">
                            {order.shopItem.subtitle || 'Official Merchandise'}
                          </div>
                        </td>
                        <td className="border-y border-white/10 px-4 py-4 align-top text-sm text-neutral-300">
                          <div>{order.contactPhone}</div>
                          <div className="mt-1 text-neutral-500">{order.contactEmail}</div>
                        </td>
                        <td className="border-y border-white/10 px-4 py-4 align-top text-sm text-neutral-300">
                          <div>Size: {order.selectedSize || '-'}</div>
                          <div className="mt-1">Name: {order.screenName || '-'}</div>
                          <div className="mt-1">Number: {order.screenNumber || '-'}</div>
                        </td>
                        <td className="border-y border-white/10 px-4 py-4 align-top">
                          <a
                            href={order.slipImageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-widest text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                            View Slip
                          </a>
                        </td>
                        <td className="border-y border-white/10 px-4 py-4 align-top">
                          <select
                            value={order.status}
                            onChange={(event) =>
                              handleStatusChange(order, event.target.value as OrderStatus)
                            }
                            disabled={updateStatus.isPending}
                            className={`rounded-full border px-3 py-2 text-xs uppercase tracking-widest outline-none transition-colors ${getStatusClassName(order.status)}`}
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border-y border-white/10 px-4 py-4 align-top text-sm text-neutral-400">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="rounded-r-2xl border-y border-r border-white/10 px-4 py-4 align-top">
                          <button
                            type="button"
                            onClick={() => handleDelete(order)}
                            disabled={deleteOrder.isPending}
                            className="inline-flex items-center gap-2 rounded-full border border-red-500/30 px-3 py-2 text-xs uppercase tracking-widest text-red-200 transition-colors hover:border-red-400/50 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-neutral-500">
                  Page {pagination?.page ?? 1} of {pagination?.totalPages ?? 1}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={!pagination || pagination.page <= 1}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-neutral-300 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) =>
                        pagination ? Math.min(pagination.totalPages, current + 1) : current + 1,
                      )
                    }
                    disabled={!pagination || pagination.page >= pagination.totalPages}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-neutral-300 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </section>
    </div>
  );
}
