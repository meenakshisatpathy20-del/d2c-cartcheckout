import React, { useState, useEffect } from 'react';
import { Truck, Search, AlertCircle, Calendar, CheckCircle2, Clock, MapPin, Printer, FileText } from 'lucide-react';
import { api } from '../../services/api';

export default function TrackOrderView({ initialOrderId }) {
  const [trackQuery, setTrackQuery] = useState(initialOrderId || 'D2C-849201');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      handleTrack(initialOrderId);
    } else {
      handleTrack('D2C-849201');
    }
  }, [initialOrderId]);

  const handleTrack = async (customQuery) => {
    const q = (customQuery || trackQuery).trim();
    if (!q) return;
    setLoading(true);
    setTrackError('');
    setTrackedOrder(null);
    try {
      const data = await api.trackOrder(q);
      setTrackedOrder(data);
    } catch (err) {
      setTrackError(err.message || 'No order found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <Truck className="w-6 h-6 text-blue-600" />
            <span>Real-Time Multi-Brand Order Tracking</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Search with your unified Order ID or individual courier AWB (Waybill) number.
          </p>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. D2C-849201) or AWB"
            value={trackQuery}
            onChange={(e) => setTrackQuery(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs flex-1 text-slate-900 uppercase font-mono outline-none focus:border-blue-600"
          />
          <button
            onClick={() => handleTrack()}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-6 py-3 rounded-2xl shadow-sm transition"
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </div>

        {trackError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{trackError}</span>
          </div>
        )}
      </div>

      {trackedOrder && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-lg text-slate-900">{trackedOrder.orderId}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {trackedOrder.paymentStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1" /> Placed on: {new Date(trackedOrder.placedAt).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Amount Paid</span>
                <span className="text-2xl font-black text-blue-700">₹{trackedOrder.summary.totalPaid}</span>
                <p className="text-[11px] text-slate-400 font-medium">via {trackedOrder.paymentMethod}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">Shipping Details</span>
                <p className="font-bold text-slate-800 text-sm mt-1">{trackedOrder.customer.name}</p>
                <p className="text-slate-600">{trackedOrder.customer.address}</p>
                <p className="text-slate-600">
                  {trackedOrder.customer.city} - <strong>{trackedOrder.customer.pincode}</strong>
                </p>
              </div>
              <div className="sm:text-right">
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">Tax & Billing Invoice</span>
                <p className="font-mono font-bold text-slate-800 mt-1">Invoice: {trackedOrder.invoiceNumber}</p>
                <p className="text-slate-600">GST Included: ₹{trackedOrder.summary.gstIncluded}</p>
                <p className="text-emerald-700 font-bold">Estimated Delivery: {trackedOrder.estimatedDelivery}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Dispatched Packages & Milestones ({trackedOrder.fulfillments.length} Origins)
            </h3>

            {trackedOrder.fulfillments.map((f) => (
              <div key={f.shipmentId} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-4">
                  <div className="flex items-center space-x-3">
                    <img src={f.image} alt={f.item} className="w-14 h-14 rounded-2xl object-contain bg-slate-50 border border-slate-200 p-1.5" />
                    <div>
                      <span className="text-xs font-black uppercase text-blue-700 tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                        {f.brand}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm mt-1">{f.item}</h4>
                      <p className="text-xs text-slate-500">
                        Qty: {f.qty} • ₹{f.unitPrice} each • Depot: <strong>{f.pickupWarehouse}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="bg-slate-100 text-slate-800 font-mono font-bold text-xs px-3 py-1 rounded-xl border border-slate-300 block w-fit sm:ml-auto">
                      AWB: {f.awb}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 block mt-1">{f.courier}</span>
                    <span className="inline-block mt-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {f.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
                  {f.timeline?.map((step, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
                      <div className="flex items-center space-x-1.5">
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : step.active ? (
                          <Clock className="w-4 h-4 text-orange-500 animate-pulse flex-shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full bg-slate-300 flex-shrink-0" />
                        )}
                        <span
                          className={`font-bold text-[11px] ${
                            step.completed ? 'text-slate-900' : step.active ? 'text-orange-700' : 'text-slate-400'
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 pl-5">{step.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}