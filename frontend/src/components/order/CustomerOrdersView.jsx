import React, { useState, useEffect } from 'react';
import { Package, Calendar, CheckCircle2, Clock, RotateCcw, AlertCircle, ChevronDown, Check } from 'lucide-react';
import { api } from '../../services/api';

export default function CustomerOrdersView() {
  const [orders, setOrders] = useState([]);
  const [returnModalOrder, setReturnModalOrder] = useState(null);
  const [returnReason, setReturnReason] = useState('Wrong size');
  const [refundMethod, setRefundMethod] = useState('ORIGINAL');
  const [returnSuccess, setReturnSuccess] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await api.getCustomerOrders();
      setOrders(data || []);
    } catch (e) {}
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.requestReturn({
        orderId: returnModalOrder.orderId,
        reason: returnReason,
        refundMethod
      });
      setReturnSuccess(`Return pickup scheduled for order ${returnModalOrder.orderId}`);
      setReturnModalOrder(null);
      loadOrders();
      setTimeout(() => setReturnSuccess(''), 4000);
    } catch (err) {}
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <Package className="w-6 h-6 text-blue-600" />
            <span>My Orders & Returns</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Track package arrivals and manage item returns</p>
        </div>
      </div>

      {returnSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs flex items-center space-x-2 font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{returnSuccess}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 text-xs">
          No orders placed yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Top Order Summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-slate-900 text-base">Order #{order.orderId}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Placed on {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • Total: <strong>₹{order.summary.totalPaid}</strong>
                  </p>
                </div>

                {order.status === 'DELIVERED' && !order.returnRequested && (
                  <button
                    onClick={() => setReturnModalOrder(order)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Return / Exchange</span>
                  </button>
                )}

                {order.returnRequested && (
                  <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-xl">
                    Return Pickup Scheduled
                  </span>
                )}
              </div>

              {/* Customer Package Language */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-700">
                  {order.fulfillments.length > 1
                    ? `Your order is arriving in ${order.fulfillments.length} separate packages:`
                    : 'Your package delivery timeline:'}
                </p>

                {order.fulfillments.map((pkg, idx) => (
                  <div key={pkg.shipmentId} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-3">
                        <img src={pkg.image} alt={pkg.item} className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1" />
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Package {idx + 1}</span>
                          <h4 className="font-black text-slate-900 text-sm">{pkg.item}</h4>
                          <p className="text-slate-500 text-[11px]">Brand: {pkg.brand} • Qty: {pkg.qty}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                          {pkg.status.replace(/_/g, ' ')}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">Courier: {pkg.courier.split(' ')[0]}</p>
                      </div>
                    </div>

                    {/* Customer-Friendly 4-Step Milestone */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-2 border-t border-slate-200">
                      {[
                        { title: 'Order Confirmed', completed: true },
                        { title: 'Packed & Shipped', completed: ['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(pkg.status) },
                        { title: 'Out for Delivery', completed: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(pkg.status) },
                        { title: 'Delivered', completed: pkg.status === 'DELIVERED' }
                      ].map((step, sIdx) => (
                        <div key={sIdx} className="flex items-center space-x-1.5">
                          {step.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full bg-slate-300 shrink-0" />
                          )}
                          <span className={step.completed ? 'font-bold text-slate-900' : 'text-slate-400'}>
                            {step.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Return & Refund Modal (Blueprint Rule 12 & 20) */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-6 relative shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">Request Return for #{returnModalOrder.orderId}</h3>
            
            <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Why are you returning?</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-medium"
                >
                  <option value="Wrong size">Wrong size</option>
                  <option value="Damaged product">Damaged product</option>
                  <option value="Wrong product received">Wrong product received</option>
                  <option value="Product quality issue">Product quality issue</option>
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Refund Method</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <p className="font-bold text-slate-900">Original Payment Method (UPI / Card)</p>
                  <p className="text-[11px] text-slate-500">Refund credited within 24 hours of warehouse QC approval.</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReturnModalOrder(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition shadow-sm"
                >
                  Submit Return Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}