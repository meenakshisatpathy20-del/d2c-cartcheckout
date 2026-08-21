
import React from 'react';
import { CheckCircle2, Sparkles, Truck, FileText, ArrowRight, X } from 'lucide-react';

export default function OrderSuccessModal({ order, isOpen, onClose, onViewTracking }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl p-6 sm:p-8 relative shadow-2xl space-y-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Flashing Icon Badge */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 relative z-10">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        </div>

        <div>
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Payment Verified & Order Split
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">Thank you for your order!</h2>
          <p className="text-xs text-slate-500 mt-1">
            Order ID: <span className="font-mono font-bold text-slate-900">{order.orderId}</span> • Invoice:{' '}
            <span className="font-mono font-bold text-blue-700">{order.invoiceNumber}</span>
          </p>
        </div>

        {/* Split Fulfillments Package Breakdown */}
        <div className="space-y-3 text-left">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">
            Split Warehouse Packages ({order.fulfillments.length} Regional Depots)
          </p>
          {order.fulfillments.map((f, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex justify-between items-center text-xs">
              <div className="flex items-center space-x-3">
                <img src={f.image} alt={f.item} className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1" />
                <div>
                  <span className="font-black text-slate-900 text-sm block">{f.brand}</span>
                  <p className="text-slate-600 mt-0.5">{f.item} (Qty: {f.qty})</p>
                  <p className="text-slate-400 text-[11px]">Dispatched from: <strong>{f.pickupWarehouse}</strong></p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl font-mono font-bold border border-blue-200 block">
                  {f.awb}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">{f.courier}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              if (onViewTracking) onViewTracking(order.orderId);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs shadow-md flex items-center justify-center space-x-1.5 transition cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Track Dispatch Timeline</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-2xl text-xs transition cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}