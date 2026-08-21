import React, { useState } from 'react';
import { Tag, Copy, Check, Truck, ShieldCheck, RotateCcw, Clock } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function PromotionalBanners() {
  const { setAppliedCoupon, subtotal } = useCart();
  const [copiedCode, setCopiedCode] = useState('');

  const coupons = [
    { code: 'D2C100', discount: 'Flat ₹100 Off', min: 'Min Order ₹999', badge: 'FLAT OFF', bg: 'from-orange-500 to-amber-500' },
    { code: 'FREESHIP', discount: 'Free Shipping', min: 'Min Order ₹499', badge: 'NO FREIGHT', bg: 'from-blue-600 to-indigo-600' },
    { code: 'FESTIVE20', discount: '20% Mega Savings', min: 'Min Order ₹1999', badge: 'FESTIVE', bg: 'from-emerald-600 to-teal-600' }
  ];

  const handleApply = (c) => {
    navigator.clipboard.writeText(c.code);
    setCopiedCode(c.code);
    setAppliedCoupon({
      code: c.code,
      discountAmount: c.code === 'D2C100' ? 100 : c.code === 'FREESHIP' ? 50 : Math.round(subtotal * 0.20) || 250
    });
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 3 Real E-Commerce Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.code}
            className={`rounded-3xl bg-gradient-to-br ${c.bg} p-5 text-white shadow-sm flex flex-col justify-between relative overflow-hidden`}
          >
            <div className="space-y-1">
              <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                {c.badge}
              </span>
              <h3 className="text-lg font-black">{c.discount}</h3>
              <p className="text-xs text-white/80">{c.min}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center text-xs">
              <span className="font-mono font-bold tracking-wider">{c.code}</span>
              <button
                onClick={() => handleApply(c)}
                className="bg-white text-slate-900 font-bold px-3 py-1 rounded-xl text-xs hover:bg-slate-100 transition flex items-center space-x-1"
              >
                {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === c.code ? 'Applied' : 'Apply'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Trust Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Express Delivery</p>
            <p className="text-slate-500 text-[11px]">2-4 Days Pan-India</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900">100% Genuine</p>
            <p className="text-slate-500 text-[11px]">Direct brand guarantee</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Easy Returns</p>
            <p className="text-slate-500 text-[11px]">7-Day door pickup</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Live Updates</p>
            <p className="text-slate-500 text-[11px]">SMS & WhatsApp tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
}