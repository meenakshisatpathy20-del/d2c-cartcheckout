import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Warehouse,
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function AdminLogin({
  onLogin,
  loading = false,
  error = ''
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) return;
    if (!password) return;

    if (onLogin) {
      await onLogin({
        username: username.trim(),
        password
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-7">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center shadow-2xl shadow-orange-500/20">
            <Warehouse className="w-8 h-8 text-slate-950" />
          </div>

          <h1 className="mt-5 text-2xl font-black text-white tracking-tight">
            D2C MALL
          </h1>

          <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
            Operations Console
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-7 pt-7 pb-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Admin Sign In
                </h2>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Access orders, warehouse operations,
                  shipments, customers and inventory.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-7 mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />

              <div>
                <p className="text-xs font-black text-red-800">
                  Sign in failed
                </p>

                <p className="text-[11px] text-red-700 mt-0.5">
                  {error}
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="px-7 pb-7 space-y-5"
          >
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-black text-slate-600 mb-2">
                Username
              </label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Enter admin username"
                  autoComplete="username"
                  disabled={loading}
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-black text-slate-600 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-50"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !username.trim() ||
                !password
              }
              className="w-full h-12 rounded-xl bg-slate-950 text-white text-sm font-black flex items-center justify-center gap-2 transition hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-950/10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Enter Operations Console
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-slate-100 px-7 py-4 bg-slate-50">
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              Protected warehouse operations
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-500 mt-5">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}