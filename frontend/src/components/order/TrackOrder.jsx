import React, { useState } from 'react';
import { Truck, Search, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function TrackOrder() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const data = await api.trackOrder(query.trim());
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center">
          <Truck className="w-5 h-5 mr-2 text-blue-700" /> Track Multi-Brand Order
        </h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. D2C-123456) or AWB"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-xs flex-1 outline-none uppercase focus:border-blue-700"
          />
          <button
            onClick={handleTrack}
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center"
          >
            <Search className="w-3.5 h-3.5 mr-1" /> {loading ? '...' : 'Track'}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-600 flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1" /> {error}
          </p>
        )}
      </div>

      {order && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center text-xs">
            <div>
              <span className="font-mono font-bold text-sm text-slate-900">{order.orderId}</span>
              <p className="text-slate-500 mt-0.5">Dest: {order.customer.pincode} ({order.customer.city})</p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              {order.paymentStatus}
            </span>
          </div>

          <div className="space-y-3">
            {order.fulfillments.map((f) => (
              <div key={f.shipmentId} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{f.brand}</span>
                    <p className="text-slate-600 mt-0.5">{f.item} (Qty: {f.qty})</p>
                    <p className="text-slate-400 mt-1">Origin: {f.pickupWarehouse}</p>
                  </div>
                  <span className="font-mono font-bold bg-white text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                    {f.awb}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500">{f.courier}</span>
                  <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                    {f.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}