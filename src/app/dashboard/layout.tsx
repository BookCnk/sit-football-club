"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ExternalLink,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  ShoppingCart,
  Trophy,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="flex items-center gap-3 text-sm text-neutral-400">
          <Loader2 className="h-5 w-5 animate-spin text-red-500" />
          Checking admin authorization...
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const navItems = [
    {
      label: "Shop Inventory",
      href: "/dashboard",
      icon: Package,
      exact: true,
    },
    {
      label: "Orders Management",
      href: "/dashboard/orders",
      icon: ShoppingCart,
      exact: false,
    },
    {
      label: "IT Relation Teams",
      href: "/dashboard/it-relation",
      icon: Trophy,
      exact: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.12),transparent_35%)]" />

      {/* MOBILE TOPBAR */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#090909]/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/20 text-red-500">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-sm font-bold tracking-wide">
              SIT FC ADMIN
            </div>
            <div className="text-[10px] text-neutral-500">Dashboard Panel</div>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg border border-white/10 p-2 text-neutral-300 transition hover:bg-white/5 hover:text-white"
          aria-label="Toggle menu">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex">
        {/* SIDEBAR OVERLAY FOR MOBILE */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0a0a0a] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
          {/* SIDEBAR BRAND HEADER */}
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="font-display text-base font-bold tracking-wider text-white">
                SIT FOOTBALL
              </div>
              <div className="font-mono text-[10px] tracking-widest text-red-500 uppercase">
                Admin Control
              </div>
            </div>
          </div>

          {/* SIDEBAR MENU LINKS */}
          <div className="flex-1 space-y-6 px-4 py-6 overflow-y-auto">
            <div>
              <div className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                Menu & Management
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-semibold tracking-wider transition ${
                        isActive
                          ? "bg-red-600/15 text-white border-l-2 border-red-500 shadow-sm"
                          : "text-neutral-400 hover:bg-white/[0.04] hover:text-white"
                      }`}>
                      <Icon
                        className={`h-4 w-4 ${
                          isActive ? "text-red-500" : "text-neutral-500"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div>
              <div className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                Quick Shortcuts
              </div>
              <nav className="space-y-1">
                <Link
                  href="/shop"
                  target="_blank"
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs text-neutral-400 transition hover:bg-white/[0.04] hover:text-white">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-neutral-500" />
                    <span>View Storefront</span>
                  </div>
                </Link>
              </nav>
            </div>
          </div>

          {/* SIDEBAR FOOTER (USER & LOGOUT) */}
          <div className="border-t border-white/10 p-4 space-y-3 bg-[#070707]">
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                Signed in as
              </div>
              <div className="mt-0.5 truncate text-xs font-medium text-white">
                {user.email}
              </div>
              <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-red-600/20 px-2 py-0.5 text-[9px] font-bold tracking-widest text-red-400 uppercase">
                <ShieldCheck className="h-3 w-3" /> Administrator
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-xs font-bold tracking-wider text-red-300 transition hover:border-red-500/50 hover:bg-red-500/20 hover:text-white">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 px-4 py-8 sm:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
