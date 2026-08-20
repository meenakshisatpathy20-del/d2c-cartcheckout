import React, { useState } from 'react';
import { Sparkles, Copy, Check, Flame, Zap } from 'lucide-react';

export default function SaleBanner({ onApplyCoupon }) {
  const [copiedCode, setCopiedCode] = useState(null);

  const coupons = [
    { code: 'D2C100', desc: '₹100 OFF (Min ₹999)', badge: 'FLAT' },
    { code: 'FREESHIP', desc: 'FREE SHIPPING (Min ₹500)', badge: 'SAVINGS' },
    { code: 'FESTIVE20', desc: '20% OFF (Min ₹1999)', badge: 'MEGA' }
  ];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    if (onApplyCoupon) onApplyCoupon(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 shadow-xl border border-blue-900/50 mb-8">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>Multi-Brand Super Sale</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-50">
            Direct-to-Consumer Festival Deals
          </h2>
          <p className="text-xs md:text-sm text-slate-300">
            Shop directly from brand-certified warehouses in Mumbai, Delhi & Jaipur with verified Shiprocket express delivery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {coupons.map((c) => (
            <button
              key={c.code}
              onClick={() => handleCopy(c.code)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-2 rounded-xl text-xs backdrop-blur-sm transition-all group active:scale-95"
            >
              <div className="text-left">
                <div className="flex items-center space-x-1.5">
                  <span className="font-mono font-black text-orange-400">{c.code}</span>
                  <span className="text-[9px] bg-emerald-500/30 text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                    {c.badge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5">{c.desc}</p>
              </div>
              <div className="pl-2 text-slate-400 group-hover:text-white">
                {copiedCode === c.code ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}