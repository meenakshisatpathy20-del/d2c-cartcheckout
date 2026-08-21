import React, { useState } from 'react';
import { Flame, Copy, Check, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function SaleBanner({ onApplyCoupon }) {
  const [copiedCode, setCopiedCode] = useState(null);

  const coupons = [
    { code: 'D2C100', desc: 'Flat ₹100 Off (Min ₹999)', badge: 'FLAT', color: 'from-orange-500 to-amber-500' },
    { code: 'FREESHIP', desc: 'Zero Freight Fee (Min ₹500)', badge: 'FREE SHIPPING', color: 'from-emerald-500 to-teal-500' },
    { code: 'FESTIVE20', desc: '20% Mega Off (Min ₹1999)', badge: 'FESTIVE', color: 'from-blue-500 to-indigo-500' }
  ];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    if (onApplyCoupon) onApplyCoupon(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 p-8 mb-10 shadow-2xl shadow-blue-950/40">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 via-emerald-600/10 to-orange-500/10 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 px-3.5 py-1 rounded-full text-xs font-black uppercase text-orange-400">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
            <span>Multi-Brand Direct Festival Sale</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            Direct Warehouse Dispatch. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
              Verified Stock & Shiprocket Express.
            </span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 leading-relaxed">
            Consolidated cart & split logistics for <span className="text-emerald-400 font-bold">Luxura Sciences</span> (Mumbai), <span className="text-blue-400 font-bold">Shiv-Naresh</span> (Delhi) and <span className="text-orange-400 font-bold">Swarg Homes</span> (Jaipur).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto">
          {coupons.map((c) => (
            <button
              key={c.code}
              onClick={() => handleCopy(c.code)}
              className="group flex-1 sm:flex-none flex items-center justify-between bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition-all shadow-lg active:scale-95"
            >
              <div className="text-left mr-4">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-sm text-white tracking-wide">{c.code}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${c.color}`}>
                    {c.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{c.desc}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-slate-700 text-slate-300 transition-colors">
                {copiedCode === c.code ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}