import React, { useState, useEffect } from 'react';
import { Box, Truck, RefreshCw, ShieldCheck, IndianRupee, Layers, CheckCircle2, TrendingUp, AlertTriangle, Download, ArrowUpRight } from 'lucide-react';
import { api } from '../../services/api';

export default function WarehouseHubView({ products, onRefresh }) {
  const [orders, setOrders] = useState([]);
  const [leads, setLeads] = useState([]);
  const [filterWarehouse, setFilterWarehouse] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const ord = await api.getCustomerOrders();
      setOrders(ord || []);
      const ld = await api.getFranchiseLeads();
      setLeads(ld || []);
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
      loadData();
    } catch (e) {}
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      
      {/* 1. Amazon Shipping & Velocity Operations SLA Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-bold uppercase text-slate-500">Live Physical Stock</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{products.reduce((a, b) => a + b.stock, 0)} Units</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Across 4 Central Depots</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-bold uppercase text-slate-500">Amazon Shipping SLA</p>
          <p className="text-2xl font-black text-blue-600 mt-1">99.4%</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Same-Day Induction Rate</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-bold uppercase text-slate-500">Velocity Express Carrier TAT</p>
          <p className="text-2xl font-black text-orange-500 mt-1">1.8 Days</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Average Metro Transit</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-bold uppercase text-slate-500">Franchise Inquiries (FOFO/FOCO)</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{leads.length + 18} Leads</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Active Investor Pipeline</p>
        </div>
      </div>

      {/* 2. Stock Inwarding Management */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center">
              <Box className="w-5 h-5 mr-2 text-orange-500" />
              <span>Multi-Depot Inventory Inwarding & Physical Allocation</span>
            </h2>
            <p className="text-xs text-slate-500">Manage stock reserves across Luxura Sciences, Hungama HiLife, and AccessHer hubs</p>
          </div>

          <select
            value={filterWarehouse}
            onChange={(e) => setFilterWarehouse(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">All Regional Hubs</option>
            <option value="Mumbai">Mumbai Bhiwandi Central Hub</option>
            <option value="Delhi">Delhi NCR Air Express Depot</option>
            <option value="Jaipur">Jaipur Heritage Depot</option>
            <option value="Bengaluru">Bengaluru Whitefield Hub</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products
            .filter((p) => filterWarehouse === 'ALL' || p.warehouseCity.includes(filterWarehouse))
            .map((p) => (
              <div key={p.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase text-white px-2 py-0.5 rounded shadow-xs" style={{ backgroundColor: p.brandColor }}>
                      {p.brand}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">₹{p.price}</span>
                  </div>
                  <p className="font-bold text-xs text-slate-900 mt-2 line-clamp-1">{p.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{p.warehouseCity}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-600 font-bold">Allocated Stock:</span>
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

      {/* 3. Live Carrier Split Dispatch Board */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-blue-600" />
              <span>Carrier Manifest & Dispatch Routing Engine</span>
            </h2>
            <p className="text-xs text-slate-500">Amazon Shipping Logistics and Velocity Carrier Manifest Control</p>
          </div>
          <button onClick={loadData} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl font-bold flex items-center cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </button>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <div>
                  <span className="font-mono font-black text-slate-900 text-sm mr-2">{order.orderId}</span>
                  <span className="text-slate-500">Recipient: <strong>{order.customer.name}</strong> ({order.customer.pincode}, {order.customer.city})</span>
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
                      <span className="text-slate-500 text-[11px] font-semibold">{f.carrier || f.courier}</span>
                      <select
                        value={f.status}
                        onChange={(e) => handleStatusChange(order.orderId, f.shipmentId, e.target.value)}
                        className="bg-slate-50 border border-slate-300 text-slate-800 font-bold text-[11px] rounded-lg px-2 py-1 outline-none cursor-pointer"
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