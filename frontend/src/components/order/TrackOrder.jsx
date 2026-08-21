import React, { useState } from 'react';
import { Truck, Search, AlertCircle, PackageCheck, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../../services/api';

export default function TrackOrder() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQueries = ['D2C-849201', 'AWB9481023IN'];

  const handleTrack = async (customQuery) => {
    const q = (customQuery || query).trim();
    if (!q) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const data = await api.trackOrder(q);
      setOrder(data);
    } catch (err) {
      setError(err.message || 'No shipment found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <Truck className="w-6 h-6 text-blue-400" />
            <span>Real-Time Order & AWB Tracking</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track multi-brand shipments across Shiprocket regional depots
          </p>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. D2C-104921) or Courier AWB"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs flex-1 text-white uppercase placeholder-slate-600 outline-none focus:border-blue-500 font-mono"
          />
          <button
            onClick={() => handleTrack()}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black px-6 py-3 rounded-2xl flex items-center shadow-lg shadow-blue-500/20"
          >
            <Search className="w-4 h-4 mr-1.5" />
            <span>{loading ? 'Searching...' : 'Track'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <span>Quick test queries:</span>
          {sampleQueries.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                handleTrack(s);
              }}
              className="font-mono bg-slate-800 hover:bg-slate-700 text-blue-300 px-2 py-0.5 rounded-lg border border-slate-700 transition"
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-4 rounded-2xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {order && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <span className="font-mono font-black text-base text-white">{order.orderId}</span>
              <p className="text-xs text-slate-400 mt-0.5">
                Recipient: <strong className="text-slate-200">{order.customer.name}</strong> • Destination Pincode: <strong className="text-slate-200">{order.customer.pincode} ({order.customer.city})</strong>
              </p>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-black px-3 py-1 rounded-full w-fit">
              {order.paymentStatus} (₹{order.summary.totalPaid})
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Split Shipments Breakdown ({order.fulfillments.length} Regional Origins)
            </h3>

            {order.fulfillments.map((f) => {
              const steps = [
                { title: 'Order Confirmed', completed: true },
                { title: `Dispatched from ${f.pickupWarehouse}`, completed: ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(f.status) },
                { title: 'In Transit with Courier', completed: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(f.status) },
                { title: 'Delivered', completed: f.status === 'DELIVERED' }
              ];

              return (
                <div key={f.shipmentId} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <span className="font-black text-white text-sm">{f.brand}</span>
                      <p className="text-slate-300 mt-0.5">{f.item} (Qty: {f.qty})</p>
                      <p className="text-slate-500 text-[11px] mt-1">Origin Depot: {f.pickupWarehouse}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-xl text-xs block">
                        {f.awb}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1 block">{f.courier}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                      {steps.map((step, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${step.completed ? 'text-emerald-400' : 'text-slate-700'}`} />
                          <span className={step.completed ? 'text-slate-200 font-bold' : 'text-slate-600'}>
                            {step.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}