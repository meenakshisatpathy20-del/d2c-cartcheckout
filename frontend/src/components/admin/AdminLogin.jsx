import React, { useState } from "react";
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Package,
  Warehouse,
  Truck,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AdminLogin({
  api,
  onLogin,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Enter your admin email.");
      return;
    }

    if (!password) {
      setError("Enter your password.");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (api?.adminLogin) {
        response = await api.adminLogin({
          email: cleanEmail,
          password,
          rememberMe,
        });
      } else {
        /*
         * Temporary development fallback.
         *
         * This will be replaced by the final backend
         * authentication when api.js/server.js are
         * consolidated.
         */
        if (
          cleanEmail === "admin@d2cmall.com" &&
          password === "admin123"
        ) {
          response = {
            success: true,
            token: "development-admin-token",
            user: {
              id: "admin-001",
              name: "D2C Mall Admin",
              email: cleanEmail,
              role: "ADMIN",
              warehouse: "ALL",
            },
          };
        } else {
          throw new Error(
            "Invalid admin credentials."
          );
        }
      }

      if (!response?.success && !response?.token) {
        throw new Error(
          response?.message ||
            "Unable to authenticate administrator."
        );
      }

      const session = {
        authenticated: true,
        token: response.token || null,
        user: response.user || {
          name: "D2C Mall Admin",
          email: cleanEmail,
          role: "ADMIN",
          warehouse: "ALL",
        },
        loggedInAt: new Date().toISOString(),
      };

      const storage = rememberMe
        ? localStorage
        : sessionStorage;

      storage.setItem(
        "d2c_admin_session",
        JSON.stringify(session)
      );

      onLogin?.(session);
    } catch (err) {
      setError(
        err?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-700/20 blur-3xl" />

      <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* BRAND PANEL */}
          <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-blue-950 p-10 text-white">
            <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full border-[40px] border-white/10" />

            <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full border-[40px] border-green-400/20" />

            <div className="relative z-10 flex flex-col justify-between w-full">
              <div>
                <div className="inline-flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>

                  <div>
                    <p className="text-xl font-black tracking-tight">
                      D2C MALL
                    </p>

                    <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-orange-100">
                      One Stop Lifestyle Shop
                    </p>
                  </div>
                </div>

                <div className="mt-20">
                  <p className="text-xs uppercase tracking-[0.25em] font-black text-yellow-300">
                    Operations Center
                  </p>

                  <h1 className="text-5xl font-black leading-[0.95] mt-4">
                    Run your
                    <br />
                    marketplace.
                  </h1>

                  <p className="text-sm text-white/75 mt-5 max-w-sm leading-6">
                    Manage orders, customers, inventory,
                    warehouses and shipments from one
                    secure workspace.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-12">
                <Feature
                  icon={Warehouse}
                  label="Warehouses"
                />

                <Feature
                  icon={Truck}
                  label="Shipments"
                />

                <Feature
                  icon={ShieldCheck}
                  label="Secure"
                />
              </div>
            </div>
          </div>

          {/* LOGIN PANEL */}
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>

              <div>
                <p className="text-lg font-black text-slate-950">
                  D2C MALL
                </p>

                <p className="text-[8px] uppercase tracking-[0.18em] font-black text-orange-600">
                  Operations
                </p>
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 text-orange-700 px-3 py-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />

                  <span className="text-[9px] uppercase tracking-[0.12em] font-black">
                    Secure Admin Access
                  </span>
                </div>

                <h2 className="text-3xl font-black text-slate-950 mt-4">
                  Welcome back
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Sign in to manage D2C Mall operations.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />

                  <div>
                    <p className="text-xs font-black text-red-800">
                      Login unsuccessful
                    </p>

                    <p className="text-[10px] text-red-700 mt-0.5">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.12em] font-black text-slate-700 mb-2">
                    Admin Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      placeholder="admin@d2cmall.com"
                      autoComplete="username"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.12em] font-black text-slate-700 mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(
                          event.target.checked
                        )
                      }
                      className="w-3.5 h-3.5 accent-orange-500"
                    />

                    <span className="text-[10px] font-bold text-slate-500">
                      Remember me
                    </span>
                  </label>

                  <button
                    type="button"
                    className="text-[10px] font-black text-blue-800 hover:text-orange-600"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to Operations
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />

                  <p className="text-[9px] text-slate-500">
                    Authorized warehouse and operations
                    personnel only.
                  </p>
                </div>
              </div>

              <p className="text-center text-[9px] text-slate-400 mt-6">
                D2C Mall Operations • Secure Workspace
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  label,
}) {
  return (
    <div className="rounded-xl bg-white/10 border border-white/10 p-3">
      <Icon className="w-5 h-5 text-yellow-300" />

      <p className="text-[9px] font-black mt-3">
        {label}
      </p>
    </div>
  );
}