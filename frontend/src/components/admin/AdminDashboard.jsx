import React, { useMemo } from 'react';
import {
  ShoppingBag,
  IndianRupee,
  Users,
  Truck,
  Package,
  AlertTriangle,
  Warehouse,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  CheckCircle2,
  CircleDot,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

const statusStyles = {
  CONFIRMED:
    'bg-blue-50 text-blue-700 border-blue-100',
  PROCESSING:
    'bg-yellow-50 text-yellow-700 border-yellow-100',
  PACKED:
    'bg-orange-50 text-orange-700 border-orange-100',
  READY_TO_DISPATCH:
    'bg-orange-50 text-orange-700 border-orange-100',
  SHIPPED:
    'bg-indigo-50 text-indigo-700 border-indigo-100',
  IN_TRANSIT:
    'bg-blue-50 text-blue-700 border-blue-100',
  OUT_FOR_DELIVERY:
    'bg-green-50 text-green-700 border-green-100',
  DELIVERED:
    'bg-green-50 text-green-700 border-green-100',
  CANCELLED:
    'bg-red-50 text-red-700 border-red-100',
  RETURNED:
    'bg-red-50 text-red-700 border-red-100'
};

function formatCurrency(value) {
  return new Intl.NumberFormat(
    'en-IN',
    {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }
  ).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return '—';

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  ).format(new Date(value));
}

function getStatusClass(status) {
  return (
    statusStyles[status] ||
    'bg-slate-50 text-slate-600 border-slate-100'
  );
}

function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  iconClass,
  trend,
  trendLabel,
  onClick
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/40 transition group"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          <Icon className="w-5 h-5" />
        </div>

        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-[10px] font-black ${
              trend >= 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {trend >= 0 ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}

            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-black mt-5">
        {label}
      </p>

      <p className="text-2xl font-black text-slate-950 mt-1 tracking-tight">
        {value}
      </p>

      <div className="flex items-center justify-between mt-2">
        <p className="text-[10px] text-slate-500 font-semibold">
          {trendLabel || subtext}
        </p>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-500 transition" />
      </div>
    </button>
  );
}

function SectionHeader({
  eyebrow,
  title,
  actionLabel,
  onAction
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div>
        {eyebrow && (
          <p className="text-[9px] uppercase tracking-[0.16em] text-orange-600 font-black">
            {eyebrow}
          </p>
        )}

        <h2 className="text-sm font-black text-slate-950 mt-1">
          {title}
        </h2>
      </div>

      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="text-[10px] font-black text-blue-700 hover:text-blue-900 flex items-center gap-1"
        >
          {actionLabel}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default function AdminDashboard({
  data = {},
  loading = false,
  onRefresh,
  onNavigate,
  onViewOrder
}) {
  const {
    totalOrders = 0,
    totalRevenue = 0,
    pendingOrders = 0,
    deliveredOrders = 0,
    totalCustomers = 0,
    totalShipments = 0,
    inTransitShipments = 0,
    shipmentExceptions = 0,
    recentOrders = [],
    lowStockProducts = [],
    warehouses = []
  } = data;

  const deliveryRate = useMemo(() => {
    if (!totalOrders) return 0;

    return Math.round(
      (deliveredOrders / totalOrders) *
        100
    );
  }, [
    deliveredOrders,
    totalOrders
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] font-black text-orange-600">
            Fulfillment Command Center
          </p>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
            Operations Dashboard
          </h1>

          <p className="text-xs text-slate-500 mt-2 max-w-2xl">
            Monitor orders, customers, inventory,
            warehouse operations and shipments from
            one place.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="self-start lg:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-black hover:bg-blue-900 transition disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${
              loading
                ? 'animate-spin'
                : ''
            }`}
          />
          Refresh data
        </button>
      </div>

      {/* Primary metrics */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Total Orders"
          value={totalOrders}
          subtext={`${pendingOrders} currently pending`}
          icon={ShoppingBag}
          iconClass="bg-orange-50 text-orange-600"
          onClick={() =>
            onNavigate?.('orders')
          }
        />

        <MetricCard
          label="Gross Revenue"
          value={formatCurrency(
            totalRevenue
          )}
          subtext="Across completed orders"
          icon={IndianRupee}
          iconClass="bg-green-50 text-green-700"
          trend={8.4}
          onClick={() =>
            onNavigate?.('analytics')
          }
        />

        <MetricCard
          label="Customers"
          value={totalCustomers}
          subtext="Unique customers"
          icon={Users}
          iconClass="bg-blue-50 text-blue-700"
          onClick={() =>
            onNavigate?.('customers')
          }
        />

        <MetricCard
          label="Active Shipments"
          value={inTransitShipments}
          subtext={`${totalShipments} total shipments`}
          icon={Truck}
          iconClass="bg-yellow-50 text-yellow-700"
          onClick={() =>
            onNavigate?.('shipments')
          }
        />
      </div>

      {/* Operational summary */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-slate-950 rounded-2xl p-5 text-white overflow-hidden relative">
          <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full bg-orange-500/10 blur-2xl" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] font-black text-orange-400">
                  Fulfillment Health
                </p>

                <h2 className="text-lg font-black mt-1">
                  Today's Operations
                </h2>
              </div>

              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <CircleDot className="w-5 h-5 text-green-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <Clock3 className="w-4 h-4 text-yellow-400" />

                <p className="text-xl font-black mt-3">
                  {pendingOrders}
                </p>

                <p className="text-[9px] text-slate-400 mt-1">
                  Pending
                </p>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <Truck className="w-4 h-4 text-blue-400" />

                <p className="text-xl font-black mt-3">
                  {inTransitShipments}
                </p>

                <p className="text-[9px] text-slate-400 mt-1">
                  In Transit
                </p>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <CheckCircle2 className="w-4 h-4 text-green-400" />

                <p className="text-xl font-black mt-3">
                  {deliveredOrders}
                </p>

                <p className="text-[9px] text-slate-400 mt-1">
                  Delivered
                </p>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <AlertTriangle className="w-4 h-4 text-red-400" />

                <p className="text-xl font-black mt-3">
                  {shipmentExceptions}
                </p>

                <p className="text-[9px] text-slate-400 mt-1">
                  Exceptions
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400">
                  Delivery completion
                </span>

                <span className="text-[10px] font-black text-green-400">
                  {deliveryRate}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{
                    width: `${deliveryRate}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Exception card */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <SectionHeader
            eyebrow="Attention required"
            title="Operations alerts"
          />

          <div className="space-y-3">
            <button
              type="button"
              onClick={() =>
                onNavigate?.('shipments')
              }
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100 text-left hover:border-red-200 transition"
            >
              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>

              <div className="flex-1">
                <p className="text-xs font-black text-red-900">
                  Shipment exceptions
                </p>

                <p className="text-[10px] text-red-700 mt-0.5">
                  {shipmentExceptions} need attention
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-red-300" />
            </button>

            <button
              type="button"
              onClick={() =>
                onNavigate?.('inventory')
              }
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-100 text-left hover:border-yellow-200 transition"
            >
              <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Package className="w-4 h-4 text-yellow-700" />
              </div>

              <div className="flex-1">
                <p className="text-xs font-black text-yellow-900">
                  Low stock
                </p>

                <p className="text-[10px] text-yellow-700 mt-0.5">
                  {lowStockProducts.length} products need restocking
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-yellow-300" />
            </button>

            <button
              type="button"
              onClick={() =>
                onNavigate?.('orders')
              }
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 text-left hover:border-blue-200 transition"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-blue-700" />
              </div>

              <div className="flex-1">
                <p className="text-xs font-black text-blue-900">
                  Pending fulfillment
                </p>

                <p className="text-[10px] text-blue-700 mt-0.5">
                  {pendingOrders} orders awaiting processing
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-blue-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent orders + warehouse */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-5 pb-3">
            <SectionHeader
              eyebrow="Latest activity"
              title="Recent orders"
              actionLabel="View all orders"
              onAction={() =>
                onNavigate?.('orders')
              }
            />
          </div>

          {recentOrders.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />

              <p className="text-xs font-black text-slate-600 mt-3">
                No orders yet
              </p>

              <p className="text-[10px] text-slate-400 mt-1">
                New customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-y border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Order
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders
                    .slice(0, 8)
                    .map(order => (
                      <tr
                        key={order.orderId}
                        onClick={() =>
                          onViewOrder?.(order)
                        }
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition"
                      >
                        <td className="px-5 py-3.5">
                          <p className="text-xs font-black text-blue-700">
                            {order.orderId}
                          </p>

                          <p className="text-[9px] text-slate-400 mt-0.5">
                            {order.invoiceNumber}
                          </p>
                        </td>

                        <td className="px-5 py-3.5">
                          <p className="text-xs font-bold text-slate-800">
                            {order.customer?.name ||
                              'Guest'}
                          </p>

                          <p className="text-[9px] text-slate-400 mt-0.5">
                            {order.customer?.city ||
                              '—'}
                          </p>
                        </td>

                        <td className="px-5 py-3.5">
                          <p className="text-xs font-black text-slate-900">
                            {formatCurrency(
                              order.summary?.totalPaid
                            )}
                          </p>

                          <p className="text-[9px] text-green-600 mt-0.5 font-bold">
                            {order.paymentStatus ||
                              '—'}
                          </p>
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full border text-[9px] font-black ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {String(
                              order.status ||
                                'UNKNOWN'
                            ).replaceAll(
                              '_',
                              ' '
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <p className="text-[10px] text-slate-500 font-semibold">
                            {formatDate(
                              order.placedAt
                            )}
                          </p>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Warehouses */}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-5 pb-3">
            <SectionHeader
              eyebrow="Fulfillment network"
              title="Warehouse health"
              actionLabel="Manage"
              onAction={() =>
                onNavigate?.('warehouses')
              }
            />
          </div>

          <div className="px-5 pb-5 space-y-3">
            {warehouses.length === 0 ? (
              <div className="py-8 text-center">
                <Warehouse className="w-7 h-7 text-slate-300 mx-auto" />

                <p className="text-xs font-black text-slate-500 mt-2">
                  No warehouse data
                </p>
              </div>
            ) : (
              warehouses.map(warehouse => {
                const isHealthy =
                  warehouse.active !== false;

                return (
                  <div
                    key={
                      warehouse.id ||
                      warehouse.name
                    }
                    className="rounded-xl border border-slate-100 p-3 hover:border-slate-200 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Warehouse className="w-4 h-4 text-blue-700" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-black text-slate-800 truncate">
                            {warehouse.name}
                          </p>

                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isHealthy
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                          />
                        </div>

                        <p className="text-[9px] text-slate-400 mt-0.5">
                          {warehouse.city ||
                            'India'}
                          {warehouse.state
                            ? `, ${warehouse.state}`
                            : ''}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="bg-slate-50 rounded-lg p-2">
                        <p className="text-sm font-black text-slate-900">
                          {warehouse.pendingOrders ||
                            0}
                        </p>

                        <p className="text-[8px] text-slate-400">
                          Pending
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-2">
                        <p className="text-sm font-black text-slate-900">
                          {warehouse.activeShipments ||
                            0}
                        </p>

                        <p className="text-[8px] text-slate-400">
                          Shipments
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-2">
                        <p className="text-sm font-black text-slate-900">
                          {warehouse.stockUnits ||
                            0}
                        </p>

                        <p className="text-[8px] text-slate-400">
                          Stock
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Low stock */}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 pb-3">
          <SectionHeader
            eyebrow="Inventory control"
            title="Low-stock products"
            actionLabel="Open inventory"
            onAction={() =>
              onNavigate?.('inventory')
            }
          />
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="px-5 pb-5">
            <div className="rounded-xl bg-green-50 border border-green-100 p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />

              <div>
                <p className="text-xs font-black text-green-900">
                  Inventory looks healthy
                </p>

                <p className="text-[10px] text-green-700 mt-0.5">
                  No products are currently below their
                  configured stock threshold.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                    Product
                  </th>

                  <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                    SKU
                  </th>

                  <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                    Warehouse
                  </th>

                  <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                    Current Stock
                  </th>

                  <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                    Threshold
                  </th>
                </tr>
              </thead>

              <tbody>
                {lowStockProducts.map(
                  product => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover bg-slate-100"
                          />

                          <div>
                            <p className="text-xs font-black text-slate-800">
                              {product.name}
                            </p>

                            <p className="text-[9px] text-slate-400">
                              {product.brand}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3 text-[10px] font-bold text-slate-500">
                        {product.id}
                      </td>

                      <td className="px-5 py-3 text-[10px] text-slate-500 font-semibold">
                        {product.warehouseCity}
                      </td>

                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-[9px] font-black text-red-700">
                          <AlertTriangle className="w-3 h-3" />
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-xs font-black text-slate-700">
                        {product.lowStockThreshold ??
                          10}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}