import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useCheckout } from '../../context/CheckoutContext';

export default function OrderSuccess({ onReset }) {
  const { confirmedOrder } = useCheckout();
  if (!confirmedOrder) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <div className="text-center mb-6">
        <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
        <h2 className="text-2xl font-black text-slate-900">Order Confirmed!</h2>
        <p className="text-xs text-slate-500 mt-1">
          Order ID: <span className="font-mono font-bold text-slate-800">{confirmedOrder.orderId}</span>
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {confirmedOrder.fulfillments.map((f, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-slate-800 text-sm block">{f.brand}</span>
              <p className="text-slate-500 mt-0.5">{f.item} (Qty: {f.qty})</p>
              <p className="text-slate-400 mt-1">Origin Hub: {f.pickupWarehouse}</p>
            </div>
            <div className="text-right">
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-mono font-semibold border border-blue-200 block">
                {f.awb}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">{f.courier}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="w-full bg-slate-900 text-white text-xs font-bold py-3 rounded-xl hover:bg-slate-800"
      >
        Return to Store
      </button>
    </div>
  );
}