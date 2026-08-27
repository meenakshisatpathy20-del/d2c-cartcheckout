import React, { useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('admin@d2cmall.com');
  const [password, setPassword] = useState('D2CMall@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.adminLogin(email, password);

      localStorage.setItem('d2c_admin_token', data.token);
      localStorage.setItem('d2c_admin', JSON.stringify(data.admin));

      if (onLogin) {
        onLogin(data.admin);
      }
    } catch (err) {
      setError(err.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 px-7 py-8 text-white">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center mb-5 shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-300">
              D2C Mall Operations
            </p>

            <h1 className="text-2xl font-black mt-2">
              Warehouse Admin
            </h1>

            <p className="text-xs text-blue-200 mt-2">
              Secure access to orders, customers, shipments and inventory.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-7 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-700 mb-2">
                Admin Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-slate-950 disabled:opacity-60 text-white rounded-xl py-3.5 font-black text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign in to Operations
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Protected warehouse operations
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}