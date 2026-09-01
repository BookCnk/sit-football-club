"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  PackageSearch,
  Trash2,
} from "lucide-react";
import {
  useDeleteOrder,
  useOrders,
  useUpdateOrderStatus,
} from "@/api/features/orders/ordersHooks";
import type { OrderStatus, ShopOrder } from "@/api/features/orders/ordersTypes";
import { getErrorMessage, useToast } from "@/hooks/useToast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SystemModal from "@/components/ui/SystemModal";

const PAGE_SIZE = 10;
const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "verified",
  "completed",
  "cancelled",
];

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return parsed.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusClassName(status: string) {
  if (status === "completed") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "verified") {
    return "border-sky-500/30 bg-sky-500/10 text-sky-300";
  }

  if (status === "cancelled") {
    return "border-red-500/30 bg-red-500/10 text-red-300";
  }

  return "border-amber-500/30 bg-amber-500/10 text-amber-300";
}

export default function DashboardOrdersPage() {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [orderToDelete, setOrderToDelete] = useState<ShopOrder | null>(null);
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null);

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
    setPage(1);
  }, [statusFilter, search]);

  async function handleStatusChange(order: ShopOrder, status: OrderStatus) {
    try {
      await updateStatus.mutateAsync({ id: order.id, status });
      toast.success(
        `Order #${order.id} updated to ${status}.`,
        "Order updated",
      );
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to update order."),
        "Update failed",
      );
    }
  }

  function requestDelete(order: ShopOrder) {
    setOrderToDelete(order);
  }

  function closeDeleteModal() {
    if (deleteOrder.isPending) {
      return;
    }

    setOrderToDelete(null);
  }

  async function confirmDelete() {
    if (!orderToDelete) {
      return;
    }

    const order = orderToDelete;
    try {
      await deleteOrder.mutateAsync(order.id);
      toast.success(`Order #${order.id} deleted.`, "Order deleted");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to delete order."),
        "Delete failed",
      );
    } finally {
      setOrderToDelete(null);
    }
  }

  function applySearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchInput.trim());
  }

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="border-b border-white/10 pb-6">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-red-500">
          ORDERS MANAGEMENT
        </div>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Customer Orders & Slips
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Review incoming purchases, inspect transfer slips, and update order statuses.
        </p>
      </div>

      {/* FILTER & SEARCH */}
      <div className="grid gap-4 lg:grid-cols-[1fr,240px]">
        <form
          onSubmit={applySearch}
          className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#090909] p-4 md:flex-row">
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by email, phone, custom name, or product..."
            className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500"
          />
          <button
            type="submit"
            className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-red-500">
            Search
          </button>
        </form>

        <div className="rounded-2xl border border-white/10 bg-[#090909] p-4 flex flex-col justify-center">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | OrderStatus)
            }
            className="w-full rounded-xl border border-white/15 bg-[#111] px-4 py-2.5 text-xs uppercase tracking-wider text-white outline-none transition focus:border-red-500">
            <option value="all">Filter: All Statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                Status: {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ORDERS TABLE SECTION */}
      <section className="rounded-3xl border border-white/10 bg-[#090909] p-6 shadow-2xl">
        <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
              Orders Table
            </div>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
              Order Records
            </h2>
          </div>
          <div className="text-xs font-mono text-neutral-400">
            {pagination
              ? `Total: ${pagination.total} orders`
              : "Loading orders..."}
          </div>
        </div>

        {ordersQuery.isLoading ? (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-neutral-400">
            <Loader2 className="h-4 w-4 animate-spin text-red-500" />
            Loading orders...
          </div>
        ) : ordersQuery.error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-5 text-sm text-red-100">
            {ordersQuery.error instanceof Error
              ? ordersQuery.error.message
              : "Failed to load orders."}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-4 py-16 text-center">
            <PackageSearch className="mb-4 h-8 w-8 text-neutral-600" />
            <div className="text-sm text-neutral-400">
              No orders matching this search or filter criteria.
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                    <th className="px-4 py-2">Order</th>
                    <th className="px-4 py-2">Product Item</th>
                    <th className="px-4 py-2">Contact</th>
                    <th className="px-4 py-2">Custom Details</th>
                    <th className="px-4 py-2">Slip</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="bg-white/[0.03]">
                      <td className="rounded-l-2xl border-y border-l border-white/10 px-4 py-4 align-top">
                        <div className="font-display text-base font-bold text-white">
                          #{order.id}
                        </div>
                        <div className="mt-1 font-mono text-xs text-red-400">
                          THB {Number(order.shopItem.price).toLocaleString()}
                        </div>
                      </td>
                      <td className="border-y border-white/10 px-4 py-4 align-top">
                        <div className="font-medium text-white">
                          {order.shopItem.name}
                        </div>
                        <div className="mt-1 text-xs text-neutral-400">
                          {order.shopItem.subtitle || "Official Merchandise"}
                        </div>
                      </td>
                      <td className="border-y border-white/10 px-4 py-4 align-top text-xs text-neutral-300">
                        <div>Phone: {order.contactPhone}</div>
                        <div className="mt-1 text-neutral-400">
                          Email: {order.contactEmail}
                        </div>
                      </td>
                      <td className="border-y border-white/10 px-4 py-4 align-top text-xs text-neutral-300">
                        <div>Size: {order.selectedSize || "-"}</div>
                        <div className="mt-1">
                          Name: {order.screenName || "-"}
                        </div>
                        <div className="mt-1">
                          Number: {order.screenNumber || "-"}
                        </div>
                      </td>
                      <td className="border-y border-white/10 px-4 py-4 align-top">
                        <button
                          onClick={() => setSelectedSlip(order.slipImageUrl)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:border-white/30 hover:text-white">
                          <Eye className="h-3.5 w-3.5" />
                          View Slip
                        </button>
                      </td>
                      <td className="border-y border-white/10 px-4 py-4 align-top">
                        <select
                          value={order.status}
                          onChange={(event) =>
                            handleStatusChange(
                              order,
                              event.target.value as OrderStatus,
                            )
                          }
                          disabled={updateStatus.isPending}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-bold uppercase tracking-wider outline-none transition appearance-none bg-[#111] cursor-pointer ${getStatusClassName(
                            order.status,
                          )}`}>
                          {ORDER_STATUSES.map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-neutral-900 text-white">
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border-y border-white/10 px-4 py-4 align-top text-xs text-neutral-400 font-mono">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="rounded-r-2xl border-y border-r border-white/10 px-4 py-4 align-top">
                        <button
                          type="button"
                          onClick={() => requestDelete(order)}
                          disabled={deleteOrder.isPending}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50">
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 md:flex-row md:items-center md:justify-between">
              <div className="text-xs font-mono text-neutral-400">
                Page {pagination?.page ?? 1} of {pagination?.totalPages ?? 1}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                  disabled={!pagination || pagination.page <= 1}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-neutral-300 transition hover:border-white/30 hover:text-white disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPage((current) =>
                      pagination
                        ? Math.min(pagination.totalPages, current + 1)
                        : current + 1,
                    )
                  }
                  disabled={
                    !pagination || pagination.page >= pagination.totalPages
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-neutral-300 transition hover:border-white/30 hover:text-white disabled:opacity-40">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <ConfirmModal
        open={Boolean(orderToDelete)}
        title="Delete Order"
        message={
          orderToDelete
            ? `Delete order #${orderToDelete.id}? This action cannot be undone.`
            : "Delete this order? This action cannot be undone."
        }
        confirmLabel="Delete Order"
        cancelLabel="Keep Order"
        danger
        loading={deleteOrder.isPending}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      <SystemModal
        open={Boolean(selectedSlip)}
        onClose={() => setSelectedSlip(null)}
        title="Payment Slip"
        description="Review the uploaded transfer slip before approving the order."
        maxWidthClassName="max-w-4xl">
        {selectedSlip && (
          <div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-2">
              <img
                src={selectedSlip}
                alt="Payment slip"
                className="max-h-[72vh] w-full rounded-xl object-contain"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <a
                href={selectedSlip}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-300 transition hover:border-white/30 hover:text-white">
                <Eye className="h-4 w-4" />
                Open In New Tab
              </a>
            </div>
          </div>
        )}
      </SystemModal>
    </div>
  );
}
