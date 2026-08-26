import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Truck,
  RefreshCw,
  ShieldCheck,
  IndianRupee,
  Layers,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Download,
  ArrowUpRight,
  Search,
  PackageCheck,
  Clock3,
  MapPin,
  Warehouse,
  Activity,
  ChevronRight,
  X,
  Copy,
  Check,
  RotateCcw,
  Users,
  BarChart3,
  CircleDollarSign,
  Navigation,
  CircleAlert,
  Filter
} from 'lucide-react';

import { api } from '../../services/api';

export default function WarehouseHubView({
  products = [],
  onRefresh
}) {
  const [orders, setOrders] = useState([]);
  const [leads, setLeads] = useState([]);
  const [filterWarehouse, setFilterWarehouse] =
    useState('ALL');

  const [shipmentFilter, setShipmentFilter] =
    useState('ALL');

  const [searchQuery, setSearchQuery] =
    useState('');

  const [activePanel, setActivePanel] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState('');

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const [copiedAwb, setCopiedAwb] =
    useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [ord, ld] = await Promise.all([
        api.getCustomerOrders(),
        api.getFranchiseLeads()
      ]);

      setOrders(ord || []);
      setLeads(ld || []);
    } catch (e) {
      setError(
        e?.message ||
          'Unable to load operations data.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (
    skuId,
    newStock
  ) => {
    const stock = Number(newStock);

    if (!Number.isFinite(stock) || stock < 0) {
      setError('Stock must be a valid positive number.');
      return;
    }

    setActionLoading(`stock-${skuId}`);
    setError('');

    try {
      await api.updateStock(skuId, stock);

      if (onRefresh) {
        await onRefresh();
      }

      showSuccess(
        'Inventory quantity updated successfully.'
      );
    } catch (e) {
      setError(
        e?.message ||
          'Unable to update inventory.'
      );
    } finally {
      setActionLoading('');
    }
  };

  const handleStatusChange = async (
    orderId,
    shipmentId,
    newStatus
  ) => {
    const key = `${orderId}-${shipmentId}`;

    setActionLoading(key);
    setError('');

    try {
      await api.updateShipmentStatus(
        orderId,
        shipmentId,
        newStatus
      );

      await loadData();

      showSuccess(
        `Shipment ${shipmentId} moved to ${formatStatus(
          newStatus
        )}.`
      );
    } catch (e) {
      setError(
        e?.message ||
          'Unable to update shipment status.'
      );
    } finally {
      setActionLoading('');
    }
  };

  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess('');
    }, 3500);
  };

  const warehouseStats = useMemo(() => {
    const stats = {};

    products.forEach((product) => {
      const warehouse =
        product.warehouseCity ||
        'Unassigned';

      if (!stats[warehouse]) {
        stats[warehouse] = {
          name: warehouse,
          units: 0,
          skus: 0,
          value: 0,
          lowStock: 0
        };
      }

      stats[warehouse].units +=
        Number(product.stock || 0);

      stats[warehouse].skus += 1;

      stats[warehouse].value +=
        Number(product.stock || 0) *
        Number(product.price || 0);

      if (Number(product.stock || 0) <= 20) {
        stats[warehouse].lowStock += 1;
      }
    });

    return Object.values(stats);
  }, [products]);

  const totalStock = products.reduce(
    (sum, product) =>
      sum + Number(product.stock || 0),
    0
  );

  const inventoryValue = products.reduce(
    (sum, product) =>
      sum +
      Number(product.stock || 0) *
        Number(product.price || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) <= 20
  );

  const allShipments = useMemo(() => {
    return orders.flatMap((order) =>
      (order.fulfillments || []).map(
        (shipment) => ({
          ...shipment,
          orderId: order.orderId,
          customer: order.customer,
          paymentStatus:
            order.paymentStatus,
          totalPaid:
            order.summary?.totalPaid || 0,
          placedAt: order.placedAt
        })
      )
    );
  }, [orders]);

  const shipmentCounts = useMemo(() => {
    return {
      all: allShipments.length,

      ready: allShipments.filter((s) =>
        ['READY_TO_SHIP', 'PROCESSING', 'CONFIRMED'].includes(
          String(s.status).toUpperCase()
        )
      ).length,

      transit: allShipments.filter((s) =>
        ['SHIPPED', 'IN_TRANSIT'].includes(
          String(s.status).toUpperCase()
        )
      ).length,

      delivery: allShipments.filter(
        (s) =>
          String(s.status).toUpperCase() ===
          'OUT_FOR_DELIVERY'
      ).length,

      delivered: allShipments.filter(
        (s) =>
          String(s.status).toUpperCase() ===
          'DELIVERED'
      ).length
    };
  }, [allShipments]);

  const filteredShipments =
    allShipments.filter((shipment) => {
      const query =
        searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        String(shipment.orderId)
          .toLowerCase()
          .includes(query) ||
        String(shipment.awb || '')
          .toLowerCase()
          .includes(query) ||
        String(shipment.item || '')
          .toLowerCase()
          .includes(query) ||
        String(shipment.brand || '')
          .toLowerCase()
          .includes(query) ||
        String(
          shipment.customer?.name || ''
        )
          .toLowerCase()
          .includes(query);

      const status =
        String(
          shipment.status || ''
        ).toUpperCase();

      let matchesFilter = true;

      if (shipmentFilter === 'READY') {
        matchesFilter = [
          'READY_TO_SHIP',
          'PROCESSING',
          'CONFIRMED'
        ].includes(status);
      }

      if (shipmentFilter === 'TRANSIT') {
        matchesFilter = [
          'SHIPPED',
          'IN_TRANSIT'
        ].includes(status);
      }

      if (shipmentFilter === 'DELIVERY') {
        matchesFilter =
          status === 'OUT_FOR_DELIVERY';
      }

      if (shipmentFilter === 'DELIVERED') {
        matchesFilter =
          status === 'DELIVERED';
      }

      return (
        matchesSearch &&
        matchesFilter
      );
    });

  const filteredProducts = products.filter(
    (product) =>
      filterWarehouse === 'ALL' ||
      String(
        product.warehouseCity || ''
      ).includes(filterWarehouse)
  );

  const copyAwb = async (awb) => {
    if (!awb) return;

    try {
      await navigator.clipboard.writeText(
        String(awb)
      );

      setCopiedAwb(awb);

      setTimeout(
        () => setCopiedAwb(''),
        1500
      );
    } catch (e) {}
  };

  const exportOperations = () => {
    const rows = [
      [
        'Order ID',
        'Shipment ID',
        'AWB',
        'Brand',
        'Product',
        'Warehouse',
        'Carrier',
        'Status',
        'Customer',
        'Pincode'
      ],
      ...allShipments.map((shipment) => [
        shipment.orderId,
        shipment.shipmentId,
        shipment.awb || '',
        shipment.brand || '',
        shipment.item || '',
        shipment.pickupWarehouse || '',
        shipment.carrier ||
          shipment.courier ||
          '',
        shipment.status || '',
        shipment.customer?.name || '',
        shipment.customer?.pincode || ''
      ])
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) =>
            `"${String(cell).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;
    link.download =
      'd2c-mall-operations.csv';

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-200">

      {/* =====================================================
          OPERATIONS HEADER
      ====================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

        <div>
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[1.7px] font-black text-blue-600">
                D2C Mall Operations
              </p>

              <h1 className="text-2xl font-black text-slate-950">
                Fulfillment Control Center
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-500 mt-3 max-w-2xl">
            Monitor inventory, warehouse allocation,
            shipment movement, carrier performance and
            franchise demand from one operational view.
          </p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={exportOperations}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-4 h-4" />
            Export Manifest
          </button>

          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-60"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                loading
                  ? 'animate-spin'
                  : ''
              }`}
            />
            Refresh
          </button>

        </div>
      </div>

      {/* =====================================================
          ALERTS
      ====================================================== */}

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <CircleAlert className="w-5 h-5 text-rose-600" />

            <div>
              <p className="text-xs font-black text-rose-900">
                Operations error
              </p>

              <p className="text-[11px] text-rose-700 mt-0.5">
                {error}
              </p>
            </div>
          </div>

          <button
            onClick={() => setError('')}
            className="text-rose-600"
          >
            <X className="w-4 h-4" />
          </button>

        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-center gap-3">

          <CheckCircle2 className="w-5 h-5 text-emerald-600" />

          <p className="text-xs font-bold text-emerald-800">
            {success}
          </p>

        </div>
      )}

      {/* =====================================================
          KPI GRID
      ====================================================== */}

      <div className="grid grid-cols-2 xl:grid-cols-6 gap-3">

        <KpiCard
          label="Physical Stock"
          value={`${totalStock.toLocaleString(
            'en-IN'
          )}`}
          suffix="units"
          icon={Box}
          tone="blue"
        />

        <KpiCard
          label="Inventory Value"
          value={formatCurrency(
            inventoryValue
          )}
          icon={IndianRupee}
          tone="emerald"
        />

        <KpiCard
          label="Active Shipments"
          value={
            shipmentCounts.all -
            shipmentCounts.delivered
          }
          suffix="packages"
          icon={Truck}
          tone="orange"
        />

        <KpiCard
          label="Out for Delivery"
          value={
            shipmentCounts.delivery
          }
          suffix="today"
          icon={Navigation}
          tone="violet"
        />

        <KpiCard
          label="Low Stock SKUs"
          value={
            lowStockProducts.length
          }
          suffix="attention"
          icon={AlertTriangle}
          tone="rose"
        />

        <KpiCard
          label="Franchise Leads"
          value={
            leads.length + 18
          }
          suffix="active"
          icon={Users}
          tone="slate"
        />

      </div>

      {/* =====================================================
          OPERATION PIPELINE
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">

          <div>
            <h2 className="text-base font-black text-slate-950">
              Shipment Operations Pipeline
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Live fulfillment movement across the D2C Mall network.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-black text-emerald-600">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live Operations
          </span>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">

          <PipelineStep
            label="All Shipments"
            count={shipmentCounts.all}
            active={
              shipmentFilter === 'ALL'
            }
            onClick={() =>
              setShipmentFilter('ALL')
            }
          />

          <PipelineStep
            label="Ready to Ship"
            count={shipmentCounts.ready}
            active={
              shipmentFilter === 'READY'
            }
            onClick={() =>
              setShipmentFilter('READY')
            }
          />

          <PipelineStep
            label="In Transit"
            count={shipmentCounts.transit}
            active={
              shipmentFilter === 'TRANSIT'
            }
            onClick={() =>
              setShipmentFilter('TRANSIT')
            }
          />

          <PipelineStep
            label="Out for Delivery"
            count={shipmentCounts.delivery}
            active={
              shipmentFilter === 'DELIVERY'
            }
            onClick={() =>
              setShipmentFilter('DELIVERY')
            }
          />

          <PipelineStep
            label="Delivered"
            count={shipmentCounts.delivered}
            active={
              shipmentFilter === 'DELIVERED'
            }
            onClick={() =>
              setShipmentFilter('DELIVERED')
            }
          />

        </div>
      </div>

      {/* =====================================================
          WAREHOUSE NETWORK
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-blue-600" />
              Regional Warehouse Network
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Inventory distribution across your current fulfillment hubs.
            </p>
          </div>

          <button
            onClick={() =>
              setActivePanel('warehouses')
            }
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-blue-600"
          >
            View network
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

          {warehouseStats.map(
            (warehouse) => (
              <WarehouseCard
                key={warehouse.name}
                warehouse={warehouse}
                onClick={() => {
                  const city =
                    getWarehouseFilter(
                      warehouse.name
                    );

                  if (city) {
                    setFilterWarehouse(city);
                  }
                }}
              />
            )
          )}

        </div>
      </div>

      {/* =====================================================
          INVENTORY MANAGEMENT
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">

        <div className="p-5 sm:p-6 border-b border-slate-100">

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

            <div>
              <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                <Box className="w-5 h-5 text-orange-500" />
                Multi-Depot Inventory
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Manage physical stock allocation across D2C Mall warehouses.
              </p>
            </div>

            <div className="flex items-center gap-2">

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3">

                <Filter className="w-3.5 h-3.5 text-slate-400" />

                <select
                  value={filterWarehouse}
                  onChange={(e) =>
                    setFilterWarehouse(
                      e.target.value
                    )
                  }
                  className="bg-transparent py-2 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="ALL">
                    All Regional Hubs
                  </option>

                  <option value="Mumbai">
                    Mumbai Bhiwandi
                  </option>

                  <option value="Delhi">
                    Delhi NCR
                  </option>

                  <option value="Jaipur">
                    Jaipur
                  </option>

                  <option value="Bengaluru">
                    Bengaluru
                  </option>
                </select>

              </div>

            </div>
          </div>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="mx-5 sm:mx-6 mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4">

            <div className="flex items-start gap-3">

              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />

              <div>
                <p className="text-xs font-black text-amber-900">
                  {lowStockProducts.length} SKU
                  {lowStockProducts.length > 1
                    ? 's'
                    : ''}{' '}
                  need inventory attention
                </p>

                <p className="text-[11px] text-amber-700 mt-1">
                  Stock levels are at or below the current
                  operational alert threshold.
                </p>
              </div>

            </div>
          </div>
        )}

        <div className="p-5 sm:p-6">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>
                <tr className="text-left border-b border-slate-100">

                  <th className="pb-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">
                    Product
                  </th>

                  <th className="pb-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">
                    Brand
                  </th>

                  <th className="pb-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">
                    Warehouse
                  </th>

                  <th className="pb-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">
                    Unit Price
                  </th>

                  <th className="pb-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">
                    Stock
                  </th>

                  <th className="pb-3 text-[10px] uppercase tracking-wider text-slate-400 font-black">
                    Inventory Value
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => {
                    const stock =
                      Number(
                        product.stock || 0
                      );

                    const low =
                      stock <= 20;

                    return (
                      <tr
                        key={product.id}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                      >

                        <td className="py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg p-1 flex items-center justify-center">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            </div>

                            <div>
                              <p className="text-xs font-black text-slate-900 max-w-[230px] truncate">
                                {product.name}
                              </p>

                              <p className="text-[10px] text-slate-400 mt-0.5">
                                SKU {product.id}
                              </p>
                            </div>

                          </div>

                        </td>

                        <td className="py-4">

                          <span
                            className="inline-flex px-2 py-1 rounded-md text-[9px] uppercase tracking-wide font-black text-white"
                            style={{
                              backgroundColor:
                                product.brandColor ||
                                '#334155'
                            }}
                          >
                            {product.brand}
                          </span>

                        </td>

                        <td className="py-4">

                          <div className="flex items-center gap-1.5">

                            <MapPin className="w-3.5 h-3.5 text-slate-400" />

                            <span className="text-xs font-bold text-slate-700">
                              {product.warehouseCity ||
                                'Unassigned'}
                            </span>

                          </div>

                        </td>

                        <td className="py-4">

                          <span className="text-xs font-bold text-slate-800">
                            ₹
                            {Number(
                              product.price || 0
                            ).toLocaleString(
                              'en-IN'
                            )}
                          </span>

                        </td>

                        <td className="py-4">

                          <div className="flex items-center gap-2">

                            <input
                              type="number"
                              min="0"
                              defaultValue={stock}
                              key={stock}
                              onBlur={(e) =>
                                handleStockUpdate(
                                  product.id,
                                  e.target.value
                                )
                              }
                              className={`w-20 bg-white border rounded-lg px-2 py-1.5 text-xs font-black text-center outline-none ${
                                low
                                  ? 'border-amber-300 text-amber-700 bg-amber-50'
                                  : 'border-slate-200 text-slate-900'
                              }`}
                            />

                            {actionLoading ===
                              `stock-${product.id}` && (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                            )}

                          </div>

                        </td>

                        <td className="py-4">

                          <span className="text-xs font-black text-slate-900">
                            ₹
                            {(
                              stock *
                              Number(
                                product.price || 0
                              )
                            ).toLocaleString(
                              'en-IN'
                            )}
                          </span>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>
            </table>

          </div>

          {filteredProducts.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No inventory found for this warehouse.
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          SHIPMENT CONTROL
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">

        <div className="p-5 sm:p-6 border-b border-slate-100">

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

            <div>
              <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Carrier Manifest & Dispatch Control
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Manage Amazon Shipping, Velocity and other carrier fulfillment movement.
              </p>
            </div>

            <div className="relative w-full lg:w-80">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

              <input
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search order, AWB, product..."
                className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 text-xs outline-none focus:bg-white focus:border-blue-500"
              />

            </div>

          </div>
        </div>

        <div className="p-5 sm:p-6">

          {filteredShipments.length === 0 ? (
            <div className="py-12 text-center">

              <PackageCheck className="w-8 h-8 text-slate-300 mx-auto" />

              <p className="text-sm font-bold text-slate-500 mt-3">
                No shipments match this filter.
              </p>

            </div>
          ) : (
            <div className="space-y-3">

              {filteredShipments.map(
                (shipment) => {

                  const key = `${shipment.orderId}-${shipment.shipmentId}`;

                  const currentStatus =
                    String(
                      shipment.status ||
                        'READY_TO_SHIP'
                    ).toUpperCase();

                  return (
                    <div
                      key={key}
                      className="border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition"
                    >

                      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">

                        {/* Shipment Identity */}

                        <div className="flex items-start gap-3 min-w-0">

                          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                            <PackageCheck className="w-5 h-5 text-blue-600" />
                          </div>

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="font-mono text-xs font-black text-slate-950">
                                {shipment.orderId}
                              </span>

                              <span className="text-slate-300">
                                /
                              </span>

                              <span className="font-mono text-[10px] text-slate-500">
                                {shipment.shipmentId}
                              </span>

                            </div>

                            <p className="text-xs font-black text-slate-800 mt-1 truncate max-w-[320px]">
                              {shipment.item}
                            </p>

                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {shipment.brand} · Qty{' '}
                              {shipment.qty}
                            </p>

                          </div>
                        </div>

                        {/* AWB */}

                        <div className="flex items-center gap-2">

                          <div>
                            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-black">
                              AWB
                            </p>

                            <p className="font-mono text-xs font-black text-slate-800 mt-1">
                              {shipment.awb ||
                                'Generating'}
                            </p>
                          </div>

                          {shipment.awb && (
                            <button
                              onClick={() =>
                                copyAwb(
                                  shipment.awb
                                )
                              }
                              className="p-1.5 rounded-lg hover:bg-slate-100"
                            >
                              {copiedAwb ===
                              shipment.awb ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </button>
                          )}

                        </div>

                        {/* Warehouse */}

                        <div>

                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-black">
                            Origin
                          </p>

                          <div className="flex items-center gap-1.5 mt-1">

                            <Warehouse className="w-3.5 h-3.5 text-slate-400" />

                            <span className="text-xs font-bold text-slate-700">
                              {shipment.pickupWarehouse ||
                                'D2C Mall Hub'}
                            </span>

                          </div>

                        </div>

                        {/* Carrier */}

                        <div>

                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-black">
                            Carrier
                          </p>

                          <p className="text-xs font-black text-slate-800 mt-1">
                            {shipment.carrier ||
                              shipment.courier ||
                              'Assigned'}
                          </p>

                        </div>

                        {/* Status */}

                        <div className="flex items-center gap-2">

                          <StatusBadge
                            status={currentStatus}
                          />

                          <select
                            value={
                              currentStatus
                            }
                            disabled={
                              actionLoading === key
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                shipment.orderId,
                                shipment.shipmentId,
                                e.target.value
                              )
                            }
                            className="bg-slate-50 border border-slate-200 text-slate-800 font-bold text-[10px] rounded-lg px-2 py-2 outline-none cursor-pointer"
                          >
                            <option value="READY_TO_SHIP">
                              READY TO SHIP
                            </option>

                            <option value="IN_TRANSIT">
                              IN TRANSIT
                            </option>

                            <option value="OUT_FOR_DELIVERY">
                              OUT FOR DELIVERY
                            </option>

                            <option value="DELIVERED">
                              DELIVERED
                            </option>

                          </select>

                          {actionLoading === key && (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                          )}

                        </div>

                      </div>

                      {/* Customer / Destination */}

                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                        <div className="flex flex-wrap items-center gap-4">

                          <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <Users className="w-3.5 h-3.5" />
                            {shipment.customer?.name ||
                              'Customer'}
                          </span>

                          <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <MapPin className="w-3.5 h-3.5" />
                            {shipment.customer?.city ||
                              'Destination'}
                            {' · '}
                            {shipment.customer?.pincode ||
                              ''}
                          </span>

                          <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <CircleDollarSign className="w-3.5 h-3.5" />
                            ₹
                            {Number(
                              shipment.totalPaid || 0
                            ).toLocaleString(
                              'en-IN'
                            )}
                          </span>

                        </div>

                        <button
                          onClick={() =>
                            setActivePanel(
                              shipment
                            )
                          }
                          className="inline-flex items-center gap-1 text-[10px] font-black text-blue-600"
                        >
                          Shipment details
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>
      </div>

      {/* =====================================================
          OPERATIONAL ALERTS + FRANCHISE
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Inventory Attention
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                SKUs requiring replenishment review.
              </p>
            </div>

            <span className="text-xs font-black text-amber-600">
              {lowStockProducts.length}
            </span>

          </div>

          <div className="mt-5 space-y-2">

            {lowStockProducts
              .slice(0, 5)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl"
                >

                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-9 h-9 bg-white border border-slate-200 rounded-lg p-1 shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate max-w-[220px]">
                        {product.name}
                      </p>

                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {product.warehouseCity}
                      </p>
                    </div>

                  </div>

                  <span className="text-xs font-black text-amber-600">
                    {product.stock} left
                  </span>

                </div>
              ))}

            {lowStockProducts.length === 0 && (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto" />

                <p className="text-xs font-bold text-slate-500 mt-2">
                  No low-stock alerts.
                </p>
              </div>
            )}

          </div>
        </div>

        <div className="bg-slate-950 rounded-3xl p-5 sm:p-6 text-white">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-wider font-black text-orange-400">
                Franchise Network
              </p>

              <h2 className="text-lg font-black mt-1">
                Investor Pipeline
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Active FOFO / FOCO opportunities.
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-400" />
            </div>

          </div>

          <div className="grid grid-cols-3 gap-2 mt-6">

            <DarkMetric
              label="Leads"
              value={leads.length + 18}
            />

            <DarkMetric
              label="Active"
              value={
                leads.filter(
                  (lead) =>
                    lead.status !==
                    'CLOSED'
                ).length
              }
            />

            <DarkMetric
              label="Pipeline"
              value="₹+"
            />

          </div>

          <button
            onClick={() =>
              setActivePanel('franchise')
            }
            className="mt-5 w-full bg-white text-slate-900 rounded-xl py-2.5 text-xs font-black flex items-center justify-center gap-2 hover:bg-slate-100"
          >
            Open Franchise Pipeline
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

      {/* =====================================================
          SHIPMENT DETAIL PANEL
      ====================================================== */}

      {activePanel &&
        activePanel !== 'warehouses' &&
        activePanel !== 'franchise' && (
          <ShipmentDetailPanel
            shipment={activePanel}
            onClose={() =>
              setActivePanel(null)
            }
          />
        )}

      {activePanel === 'warehouses' && (
        <WarehouseNetworkPanel
          warehouses={warehouseStats}
          onClose={() =>
            setActivePanel(null)
          }
        />
      )}

      {activePanel === 'franchise' && (
        <FranchisePipelinePanel
          leads={leads}
          onClose={() =>
            setActivePanel(null)
          }
        />
      )}

    </div>
  );
}

/* =========================================================
   KPI
========================================================= */

function KpiCard({
  label,
  value,
  suffix,
  icon: Icon,
  tone
}) {
  const tones = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    violet: 'bg-violet-50 text-violet-600',
    rose: 'bg-rose-50 text-rose-600',
    slate: 'bg-slate-100 text-slate-700'
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">

      <div className="flex items-center justify-between gap-2">

        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${tones[tone]}`}
        >
          <Icon className="w-4 h-4" />
        </div>

        {suffix && (
          <span className="text-[9px] uppercase tracking-wider font-black text-slate-400">
            {suffix}
          </span>
        )}

      </div>

      <p className="text-xl font-black text-slate-950 mt-3">
        {value}
      </p>

      <p className="text-[10px] font-bold text-slate-500 mt-1">
        {label}
      </p>

    </div>
  );
}

/* =========================================================
   PIPELINE
========================================================= */

function PipelineStep({
  label,
  count,
  active,
  onClick
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-xl border transition ${
        active
          ? 'bg-slate-950 border-slate-950 text-white'
          : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
      }`}
    >

      <div className="flex items-center justify-between">

        <span
          className={`text-[9px] uppercase tracking-wider font-black ${
            active
              ? 'text-slate-400'
              : 'text-slate-400'
          }`}
        >
          {label}
        </span>

        <ChevronRight
          className={`w-3.5 h-3.5 ${
            active
              ? 'text-white'
              : 'text-slate-300'
          }`}
        />

      </div>

      <p className="text-xl font-black mt-2">
        {count}
      </p>

    </button>
  );
}

/* =========================================================
   WAREHOUSE CARD
========================================================= */

function WarehouseCard({
  warehouse,
  onClick
}) {
  const capacity =
    Math.min(
      100,
      Math.max(
        8,
        Math.round(
          (warehouse.units /
            Math.max(
              warehouse.skus * 120,
              1
            )) *
            100
        )
      )
    );

  return (
    <button
      onClick={onClick}
      className="text-left border border-slate-200 rounded-2xl p-4 hover:border-blue-300 hover:shadow-sm transition"
    >

      <div className="flex items-start justify-between">

        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Warehouse className="w-4 h-4" />
        </div>

        <ArrowUpRight className="w-4 h-4 text-slate-300" />

      </div>

      <p className="text-xs font-black text-slate-900 mt-4">
        {warehouse.name}
      </p>

      <div className="flex items-end justify-between mt-3">

        <div>
          <p className="text-lg font-black text-slate-950">
            {warehouse.units.toLocaleString(
              'en-IN'
            )}
          </p>

          <p className="text-[10px] text-slate-400">
            units · {warehouse.skus} SKUs
          </p>
        </div>

        {warehouse.lowStock > 0 && (
          <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
            {warehouse.lowStock} alerts
          </span>
        )}

      </div>

      <div className="mt-4">

        <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
          <span>Utilization</span>
          <span>{capacity}%</span>
        </div>

        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{
              width: `${capacity}%`
            }}
          />
        </div>

      </div>
    </button>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status
}) {
  const normalized =
    String(
      status || ''
    ).toUpperCase();

  let style =
    'bg-slate-100 text-slate-600';

  if (
    normalized.includes(
      'DELIVER'
    )
  ) {
    style =
      'bg-emerald-100 text-emerald-700';
  } else if (
    normalized.includes(
      'TRANSIT'
    ) ||
    normalized.includes(
      'OUT'
    ) ||
    normalized.includes(
      'SHIPPED'
    )
  ) {
    style =
      'bg-blue-100 text-blue-700';
  } else if (
    normalized.includes(
      'RETURN'
    )
  ) {
    style =
      'bg-orange-100 text-orange-700';
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-[9px] font-black whitespace-nowrap ${style}`}
    >
      {formatStatus(status)}
    </span>
  );
}

/* =========================================================
   DARK METRIC
========================================================= */

function DarkMetric({
  label,
  value
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">

      <p className="text-lg font-black">
        {value}
      </p>

      <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1">
        {label}
      </p>

    </div>
  );
}

/* =========================================================
   SHIPMENT DETAIL PANEL
========================================================= */

function ShipmentDetailPanel({
  shipment,
  onClose
}) {
  const status =
    String(
      shipment.status ||
        'READY_TO_SHIP'
    ).toUpperCase();

  return (
    <Overlay onClose={onClose}>

      <div className="max-w-2xl">

        <PanelHeader
          eyebrow="Shipment Control"
          title={`Shipment ${shipment.shipmentId}`}
          onClose={onClose}
        />

        <div className="p-6 space-y-5">

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[9px] uppercase tracking-wider font-black text-blue-600">
                  Current status
                </p>

                <p className="text-xl font-black text-blue-950 mt-1">
                  {formatStatus(status)}
                </p>

                <p className="text-xs text-blue-700 mt-1">
                  Order #{shipment.orderId}
                </p>
              </div>

              <Truck className="w-7 h-7 text-blue-600" />

            </div>

          </div>

          <div className="grid grid-cols-2 gap-3">

            <DetailBox
              label="AWB"
              value={
                shipment.awb ||
                'Generating'
              }
            />

            <DetailBox
              label="Carrier"
              value={
                shipment.carrier ||
                shipment.courier ||
                'Assigned'
              }
            />

            <DetailBox
              label="Origin"
              value={
                shipment.pickupWarehouse ||
                'D2C Mall Hub'
              }
            />

            <DetailBox
              label="Destination"
              value={`${shipment.customer?.city || ''} ${
                shipment.customer?.pincode || ''
              }`}
            />

          </div>

          <div className="border border-slate-200 rounded-2xl p-5">

            <p className="text-xs font-black text-slate-900">
              Customer
            </p>

            <p className="text-sm font-black mt-2">
              {shipment.customer?.name ||
                'Customer'}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              {shipment.customer?.city ||
                'Destination'}
            </p>

          </div>

          <div className="border border-slate-200 rounded-2xl p-5">

            <p className="text-xs font-black text-slate-900">
              Package
            </p>

            <div className="flex gap-3 mt-3">

              <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 p-1">
                <img
                  src={shipment.image}
                  alt={shipment.item}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-black">
                  {shipment.item}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {shipment.brand} · Qty{' '}
                  {shipment.qty}
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>

    </Overlay>
  );
}

/* =========================================================
   WAREHOUSE PANEL
========================================================= */

function WarehouseNetworkPanel({
  warehouses,
  onClose
}) {
  return (
    <Overlay onClose={onClose}>

      <div className="max-w-3xl">

        <PanelHeader
          eyebrow="Network"
          title="Regional Warehouse Network"
          onClose={onClose}
        />

        <div className="p-6 grid sm:grid-cols-2 gap-3">

          {warehouses.map(
            (warehouse) => (
              <WarehouseCard
                key={warehouse.name}
                warehouse={warehouse}
                onClick={() => {}}
              />
            )
          )}

        </div>

      </div>

    </Overlay>
  );
}

/* =========================================================
   FRANCHISE PANEL
========================================================= */

function FranchisePipelinePanel({
  leads,
  onClose
}) {
  return (
    <Overlay onClose={onClose}>

      <div className="max-w-3xl">

        <PanelHeader
          eyebrow="Business Development"
          title="Franchise Investor Pipeline"
          onClose={onClose}
        />

        <div className="p-6">

          <div className="grid grid-cols-3 gap-3 mb-5">

            <DetailBox
              label="Total Leads"
              value={leads.length}
            />

            <DetailBox
              label="Active"
              value={
                leads.filter(
                  (lead) =>
                    lead.status !==
                    'CLOSED'
                ).length
              }
            />

            <DetailBox
              label="Pipeline"
              value="Active"
            />

          </div>

          <div className="space-y-2">

            {leads.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                No franchise leads available.
              </div>
            ) : (
              leads.map(
                (lead, index) => (
                  <div
                    key={
                      lead.id ||
                      index
                    }
                    className="border border-slate-200 rounded-xl p-4"
                  >

                    <div className="flex justify-between gap-3">

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {lead.name ||
                            lead.customerName ||
                            'Investor Lead'}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {lead.city ||
                            lead.location ||
                            'City not specified'}
                        </p>
                      </div>

                      <StatusBadge
                        status={
                          lead.status ||
                          'NEW'
                        }
                      />

                    </div>

                  </div>
                )
              )
            )}

          </div>

        </div>

      </div>

    </Overlay>
  );
}

/* =========================================================
   OVERLAY
========================================================= */

function Overlay({
  children,
  onClose
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
        {children}
      </div>

    </div>
  );
}

function PanelHeader({
  eyebrow,
  title,
  onClose
}) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">

      <div>
        <p className="text-[9px] uppercase tracking-wider font-black text-blue-600">
          {eyebrow}
        </p>

        <h3 className="text-xl font-black text-slate-950 mt-1">
          {title}
        </h3>
      </div>

      <button
        onClick={onClose}
        className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center"
      >
        <X className="w-5 h-5 text-slate-500" />
      </button>

    </div>
  );
}

function DetailBox({
  label,
  value
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-3">

      <p className="text-[9px] uppercase tracking-wider font-black text-slate-400">
        {label}
      </p>

      <p className="text-xs font-black text-slate-800 mt-1 break-words">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value) {
  if (typeof value === 'number') {
    if (value >= 10000000) {
      return `₹${(
        value / 10000000
      ).toFixed(1)}Cr`;
    }

    if (value >= 100000) {
      return `₹${(
        value / 100000
      ).toFixed(1)}L`;
    }

    if (value >= 1000) {
      return `₹${(
        value / 1000
      ).toFixed(1)}K`;
    }

    return `₹${value.toLocaleString(
      'en-IN'
    )}`;
  }

  return value;
}

function formatStatus(status) {
  return String(
    status || 'PROCESSING'
  )
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function getWarehouseFilter(name) {
  const value =
    String(name || '').toLowerCase();

  if (value.includes('mumbai')) {
    return 'Mumbai';
  }

  if (value.includes('delhi')) {
    return 'Delhi';
  }

  if (value.includes('jaipur')) {
    return 'Jaipur';
  }

  if (
    value.includes('bengaluru') ||
    value.includes('bangalore')
  ) {
    return 'Bengaluru';
  }

  return null;
}