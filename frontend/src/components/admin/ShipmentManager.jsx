import React from 'react';
import { Truck, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

export default function ShipmentManager({ orders, onRefresh }) {
  const handleStatusChange = async (orderId, shipmentId, newStatus) => {
    try {
      await api.updateShipmentStatus(orderId, shipmentId, newStatus);
      onRefresh();
    } catch (err) {}
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <Truck className="w-5 h-5 mr-2 text-blue-700" />
          <span>Shiprocket Multi-Brand Shipments</span>
        </div>
        <button
          onClick={onRefresh}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
        </button>
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          No orders placed yet. Place an order on the Storefront tab to see real-time warehouse splitting.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.orderId} className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-sm text-slate-900 mr-3">{order.orderId}</span>
                  <span className="text-slate-500">Customer: {order.customer.name} ({order.customer.pincode})</span>
                </div>
                <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  {order.paymentStatus} (₹{order.summary.totalPaid})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {order.fulfillments.map((f) => (
                  <div key={f.shipmentId} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-800">{f.brand}</span>
                        <p className="text-slate-600 mt-0.5">{f.item} (x{f.qty})</p>
                      </div>
                      <span className="font-mono font-bold bg-white text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                        {f.awb}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                      <span className="text-[11px] text-slate-500">{f.courier}</span>
                      <select
                        value={f.status}
                        onChange={(e) => handleStatusChange(order.orderId, f.shipmentId, e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
                      >
                        <option value="READY_TO_SHIP">READY TO SHIP</option>
                        <option value="IN_TRANSIT">IN TRANSIT</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}