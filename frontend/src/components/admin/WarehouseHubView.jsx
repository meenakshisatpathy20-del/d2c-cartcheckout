import React, { useState, useEffect } from 'react';
import { Box, Truck, RefreshCw, ShieldCheck, IndianRupee, Layers, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function WarehouseHubView({ products, onRefresh }) {
  const [orders, setOrders] = useState([]);
  const [filterWarehouse, setFilterWarehouse] = useState('ALL');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const data = await api.getCustomerOrders();
      setOrders(data || []);
    } catch (e) {}
  };

  const handleStockUpdate = async (skuId, newStock) => {
    try {
      await api.updateStock(skuId, newStock);
      onRefresh();
    } catch (e) {}
  };

  const handleStatusChange = async (orderId, shipmentId, newStatus) => {
    try {
      await api.updateShipmentStatus(orderId, shipmentId, newStatus);
      loadAdminData();
    } catch (e) {}
  };

  return (
    <div className="space-y-8">
      {/* 4 True Operations KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-bold uppercase text-slate-500">Depot Physical Stock</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{products.reduce((a, b) => a + b.stock, 0)} Units</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Across 4 Regional Hubs</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-bold uppercase text-slate-500">Handover SLA</p>
          <p className="text-2xl font-black text-blue-600 mt-1">98.9%</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Same-Day Courier Handover</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-bold uppercase text-slate-500">Active Shiprocket Orders</p>
          <p className="text-2xl font-black text-orange-500 mt-1">{orders.length}</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Split-Hub Assignments</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-bold uppercase text-slate-500">Gross Realized Sales</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">₹42.8 Lakh</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+18.2% vs last month</p>
        </div>
      </div>

      {/* Stock Inwarding Management */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center">
              <Box className="w-5 h-5 mr-2 text-orange-500" />
              <span>Regional Inwarding & Stock Allocations</span>
            </h2>
            <p className="text-xs text-slate-500">Modify available inventory units per regional warehouse depot</p>
          </div>

          <select
            value={filterWarehouse}
            onChange={(e) => setFilterWarehouse(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">All Regional Depots</option>
            <option value="Mumbai">Mumbai Bhiwandi Hub</option>
            <option value="Delhi">Delhi NCR Hub</option>
            <option value="Bengaluru">Bengaluru Whitefield Hub</option>
            <option value="Jaipur">Jaipur Depot Hub</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products
            .filter((p) => filterWarehouse === 'ALL' || p.warehouseCity.includes(filterWarehouse))
            .map((p) => (
              <div key={p.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-white px-2 py-0.5 rounded" style={{ backgroundColor: p.brandColor }}>
                    {p.brand}
                  </span>
                  <p className="font-bold text-xs text-slate-900 mt-2 line-clamp-1">{p.name}</p>
                  <p className="text-[11px] text-slate-500">{p.warehouseCity}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-600 font-bold">Physical Stock:</span>
                  <input
                    type="number"
                    defaultValue={p.stock}
                    key={p.stock}
                    onBlur={(e) => handleStockUpdate(p.id, e.target.value)}
                    className="w-18 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-black text-center text-slate-900"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Multi-Brand Split Dispatch Board */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-blue-600" />
              <span>Shiprocket Split Dispatch Operations</span>
            </h2>
            <p className="text-xs text-slate-500">Live courier waybill statuses & status mapping engine</p>
          </div>
          <button onClick={loadAdminData} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold flex items-center">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </button>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <div>
                  <span className="font-mono font-black text-slate-900 text-sm mr-2">{order.orderId}</span>
                  <span className="text-slate-500">Recipient: <strong>{order.customer.name}</strong> ({order.customer.pincode})</span>
                </div>
                <span className="text-emerald-700 bg-emerald-100 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                  {order.paymentStatus} (₹{order.summary.totalPaid})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {order.fulfillments.map((f) => (
                  <div key={f.shipmentId} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900">{f.brand}</span>
                        <p className="text-slate-600 text-[11px]">{f.item} (x{f.qty})</p>
                        <p className="text-slate-400 text-[10px]">Origin: {f.pickupWarehouse}</p>
                      </div>
                      <span className="font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold text-[11px]">
                        {f.awb}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-slate-500 text-[11px]">{f.courier}</span>
                      <select
                        value={f.status}
                        onChange={(e) => handleStatusChange(order.orderId, f.shipmentId, e.target.value)}
                        className="bg-slate-50 border border-slate-300 text-slate-800 font-bold text-[11px] rounded-lg px-2 py-1 outline-none"
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
      </div>
    </div>
  );
}