import React from 'react';
import { ShieldCheck, Truck, RotateCcw, BadgeCheck } from 'lucide-react';

const items = [
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    text: 'Protected checkout'
  },
  {
    icon: Truck,
    title: 'Pan-India Delivery',
    text: 'Reliable shipping'
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    text: 'Simple return process'
  },
  {
    icon: BadgeCheck,
    title: '100% Authentic',
    text: 'Verified brand products'
  }
];

export default function TrustStrip() {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map(({ icon: Icon, title, text }) => (
        <div
          key={title}
          className="group bg-white border border-slate-200 rounded-2xl p-4 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
              <Icon className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs font-black text-slate-900">
                {title}
              </p>

              <p className="text-[10px] text-slate-500 mt-0.5">
                {text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}