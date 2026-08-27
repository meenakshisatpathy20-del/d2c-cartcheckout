import React from 'react';
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap
} from 'lucide-react';

export default function DeliveryPromiseCard({
  estimatedDays = 2,
  courier = 'Delhivery Surface',
  freeShipping = true
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4">
      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-orange-200/30 blur-2xl" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>

          <div>
            <p className="text-xs font-black text-slate-950">
              Fast Pan-India Delivery
            </p>

            <p className="text-[10px] text-slate-500">
              Fulfilled through verified logistics partners
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white/80 rounded-xl p-2.5 border border-white">
            <Zap className="w-3.5 h-3.5 text-orange-500" />

            <p className="text-[9px] text-slate-500 mt-1">
              Delivery
            </p>

            <p className="text-[10px] font-black text-slate-900">
              {estimatedDays} days
            </p>
          </div>

          <div className="bg-white/80 rounded-xl p-2.5 border border-white">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />

            <p className="text-[9px] text-slate-500 mt-1">
              Authentic
            </p>

            <p className="text-[10px] font-black text-slate-900">
              Verified
            </p>
          </div>

          <div className="bg-white/80 rounded-xl p-2.5 border border-white">
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />

            <p className="text-[9px] text-slate-500 mt-1">
              Returns
            </p>

            <p className="text-[10px] font-black text-slate-900">
              7 Days
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white">
          <span className="text-[10px] font-bold text-slate-500">
            {courier}
          </span>

          {freeShipping && (
            <span className="text-[10px] font-black text-emerald-700">
              FREE SHIPPING
            </span>
          )}
        </div>
      </div>
    </div>
  );
}