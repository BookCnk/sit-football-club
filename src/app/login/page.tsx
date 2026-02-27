"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/api/features/auth/authHooks";
import { useToast } from "@/hooks/useToast";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.length >= 6 && !login.isPending;
  }, [email, password, login.isPending]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const response = await login.mutateAsync({
        email: email.trim(),
        password,
      });

      toast.success(
        response.user.role === "admin"
          ? "Signed in. Redirecting to the admin dashboard."
          : "Signed in successfully.",
        "Login successful",
      );

      router.replace(response.redirectTo || (response.user.role === "admin" ? "/dashboard" : "/"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Login failed. Please try again.",
        "Login failed",
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#030303] to-[#0a0a0a] px-6 py-16">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.14),transparent_60%)]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-red-500">
            [ MEMBER ACCESS ]
          </span>
          <h1 className="bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-4xl font-display font-semibold tracking-tighter text-transparent">
            LOGIN
          </h1>
          <p className="mt-2 text-xs text-neutral-500">
            Sign in to access the admin area and manage club shop activity.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-neutral-900/60 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-neutral-500">Welcome back</div>
              <div className="text-lg font-display font-semibold tracking-tight text-white">
                Sign in
              </div>
            </div>
            <Link
              href="/"
              className="text-[10px] uppercase tracking-widest text-neutral-600 transition-colors hover:text-white"
            >
              SIT FC
            </Link>
          </div>

          <form onSubmit={onSubmit} className="space-y-5 p-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500">
                Email
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                className="w-full rounded-sm border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-white/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500">
                Password
              </label>

              <div className="relative">
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full rounded-sm border border-white/10 bg-[#0a0a0a] px-4 py-3 pr-12 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-neutral-500 transition-colors hover:text-white"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex select-none items-center gap-2 text-xs text-neutral-500">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="accent-red-600"
                  />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-neutral-500 transition-colors hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full rounded-sm py-3 text-[11px] font-bold uppercase tracking-widest transition-all duration-200 ${
                  canSubmit
                    ? "bg-white text-black hover:scale-[1.01] hover:bg-neutral-200 active:scale-95"
                    : "cursor-not-allowed bg-white/10 text-neutral-500"
                }`}
              >
                {login.isPending ? "Signing in..." : "Sign In"}
              </button>

              <p className="text-center text-[11px] text-neutral-600">
                No account yet?{" "}
                <Link
                  href="/register"
                  className="text-neutral-300 underline underline-offset-4 hover:text-white"
                >
                  Register
                </Link>
              </p>

              <p className="text-center text-[9px] uppercase tracking-widest text-neutral-700">
                By continuing, you agree to our Terms & Privacy
              </p>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center text-[10px] uppercase tracking-widest text-neutral-600">
          Tip: Password should be at least 6 characters.
        </div>
      </div>
    </div>
  );
}
