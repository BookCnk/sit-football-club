"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/api/features/auth/authHooks";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.length >= 6 && !login.isPending;
  }, [email, password, login.isPending]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const response = await login.mutateAsync({
        email: email.trim(),
        password,
      });

      // ✅ cookie token ถูก set โดย backend แล้ว (httpOnly)
      router.replace(response.redirectTo || (response.user.role === "admin" ? "/dashboard" : "/"));
    } catch (err: any) {
      setError(err?.message || "ล็อกอินไม่สำเร็จ ลองใหม่อีกครั้ง");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030303] to-[#0a0a0a] flex items-center justify-center px-6 py-16">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.14),transparent_60%)]" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-6 text-center">
          <span className="text-[10px] font-mono text-red-500 tracking-widest uppercase block mb-2">
            [ MEMBER ACCESS ]
          </span>
          <h1 className="text-4xl font-display font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
            LOGIN
          </h1>
          <p className="mt-2 text-xs text-neutral-500">
            เข้าสู่ระบบเพื่อดูสิทธิพิเศษและจัดการคำสั่งซื้อ
          </p>
        </div>

        <div className="bg-neutral-900/60 border border-white/10 rounded-lg overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-500 uppercase tracking-widest">
                Welcome back
              </div>
              <div className="font-display font-semibold text-lg tracking-tight text-white">
                Sign in
              </div>
            </div>
            <Link
              href="/"
              className="text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white transition-colors">
              SIT FC
            </Link>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-5">
            {error && (
              <div className="border border-red-500/30 bg-red-500/10 text-red-200 text-sm rounded-md px-4 py-3">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                className="w-full bg-[#0a0a0a] border border-white/10 focus:border-white/30 outline-none rounded-sm px-4 py-3 text-sm text-white placeholder:text-neutral-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500">
                Password
              </label>

              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full bg-[#0a0a0a] border border-white/10 focus:border-white/30 outline-none rounded-sm px-4 py-3 pr-12 text-sm text-white placeholder:text-neutral-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-neutral-500 select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="accent-red-600"
                  />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-neutral-500 hover:text-white transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full py-3 text-[11px] font-bold uppercase tracking-widest transition-all duration-200 rounded-sm ${
                  canSubmit
                    ? "bg-white text-black hover:bg-neutral-200 hover:scale-[1.01] active:scale-95"
                    : "bg-white/10 text-neutral-500 cursor-not-allowed"
                }`}>
                {login.isPending ? "Signing in..." : "Sign In"}
              </button>

              <p className="text-[11px] text-neutral-600 text-center">
                ยังไม่มีบัญชี?{" "}
                <Link
                  href="/register"
                  className="text-neutral-300 hover:text-white underline underline-offset-4">
                  สมัครสมาชิก
                </Link>
              </p>

              <p className="text-[9px] text-neutral-700 text-center uppercase tracking-widest">
                By continuing, you agree to our Terms & Privacy
              </p>
            </div>
          </form>
        </div>

        <div className="mt-4 text-[10px] text-neutral-600 uppercase tracking-widest text-center">
          Tip: Password อย่างน้อย 6 ตัวอักษร
        </div>
      </div>
    </div>
  );
}
