import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Clock3,
  IndianRupee,
  Package,
  RefreshCw,
  RotateCcw,
  ShoppingBag,
  Truck,
  Users,
  Warehouse,
  XCircle,
} from "lucide-react";

const FALLBACK_DASHBOARD = {
  metrics: {
    revenue: 1284500,
    orders: 842,
    customers: 691,
    averageOrderValue: 1525,
    pendingOrders: 37,
    deliveredOrders: 714,
    cancelledOrders: 18,
    returnOrders: 24,
    refundPending: 112450,
  },

  revenueTrend: [
    { label: "Mon", value: 164000 },
    { label: "Tue", value: 182000 },
    { label: "Wed", value: 157000 },
    { label: "Thu", value: 211000 },
    { label: "Fri", value: 194000 },
    { label: "Sat", value: 219000 },
    { label: "Sun", value: 157500 },
  ],

  orderFunnel: [
    { label: "Placed", value: 842 },
    { label: "Confirmed", value: 811 },
    { label: "Packed", value: 774 },
    { label: "Shipped", value: 748 },
    { label: "Delivered", value: 714 },
  ],

  warehouses: [
    {
      name: "Mumbai Bhiwandi",
      stock: 94,
      orders: 218,
      delayed: 4,
      health: "HEALTHY",
    },
    {
      name: "Delhi NCR",
      stock: 81,
      orders: 193,
      delayed: 7,
      health: "HEALTHY",
    },
    {
      name: "Bengaluru Whitefield",
      stock: 73,
      orders: 165,
      delayed: 5,
      health: "WATCH",
    },
    {
      name: "Jaipur",
      stock: 62,
      orders: 91,
      delayed: 9,
      health: "WATCH",
    },
  ],

  topProducts: [
    {
      name: "Essence Mascara Lash Princess",
      sales: 182,
      revenue: 150878,
      stock: 99,
    },
    {
      name: "Eyeshadow Palette with Mirror",
      sales: 141,
      revenue: 233919,
      stock: 34,
    },
    {
      name: "Powder Canister Compact",
      sales: 119,
      revenue: 148036,
      stock: 89,
    },
    {
      name: "Calvin Klein CK One EDT",
      sales: 96,
      revenue: 335904,
      stock: 45,
    },
  ],

  recentOrders: [
    {
      orderId: "D2C-849201",
      customer: "Meenakshi",
      amount: 2438,
      status: "SHIPPED",
      payment: "PAID",
      city: "Ranchi",
      time: new Date(
        Date.now() - 1000 * 60 * 12
      ).toISOString(),
    },
    {
      orderId: "D2C-849200",
      customer: "Riya Kapoor",
      amount: 1659,
      status: "PACKED",
      payment: "PAID",
      city: "Mumbai",
      time: new Date(
        Date.now() - 1000 * 60 * 28
      ).toISOString(),
    },
    {
      orderId: "D2C-849199",
      customer: "Aarav Sharma",
      amount: 3499,
      status: "DELIVERED",
      payment: "PAID",
      city: "Delhi",
      time: new Date(
        Date.now() - 1000 * 60 * 42
      ).toISOString(),
    },
    {
      orderId: "D2C-849198",
      customer: "Kabir Singh",
      amount: 829,
      status: "PENDING",
      payment: "PENDING",
      city: "Pune",
      time: new Date(
        Date.now() - 1000 * 60 * 55
      ).toISOString(),
    },
  ],

  alerts: [
    {
      type: "LOW_STOCK",
      title: "12 SKUs below reorder level",
      description:
        "Inventory replenishment is required across 3 warehouses.",
      severity: "HIGH",
    },
    {
      type: "REFUND",
      title: "₹1.12L refunds pending",
      description:
        "Refunds are awaiting processing or gateway confirmation.",
      severity: "MEDIUM",
    },
    {
      type: "DELIVERY",
      title: "25 shipments delayed",
      description:
        "Carrier SLA exceptions need operational attention.",
      severity: "MEDIUM",
    },
  ],
};

export default function AdminDashboardView({
  api,
  onNavigate,
  onOpenOrder,
  onOpenProduct,
}) {
  const [dashboard, setDashboard] =
    useState(FALLBACK_DASHBOARD);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard = useCallback(
    async () => {
      setLoading(true);
      setError("");

      try {
        let response = null;

        if (api?.getAdminDashboard) {
          response =
            await api.getAdminDashboard();
        }

        if (response) {
          setDashboard({
            ...FALLBACK_DASHBOARD,
            ...response,
            metrics: {
              ...FALLBACK_DASHBOARD.metrics,
              ...(response.metrics || {}),
            },
          });
        } else {
          setDashboard(
            FALLBACK_DASHBOARD
          );
        }
      } catch (err) {
        setError(
          err?.message ||
            "Unable to load dashboard."
        );

        setDashboard(
          FALLBACK_DASHBOARD
        );
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const metrics =
    dashboard.metrics;

  const trendMax =
    Math.max(
      ...dashboard.revenueTrend.map(
        (item) =>
          Number(item.value || 0)
      ),
      1
    );

  const funnelMax =
    Math.max(
      ...dashboard.orderFunnel.map(
        (item) =>
          Number(item.value || 0)
      ),
      1
    );

  return (
    <div className="space-y-5">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-950 text-white flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] font-black text-orange-600">
                Operations Command Center
              </p>

              <h1 className="text-2xl font-black text-slate-950">
                Dashboard
              </h1>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Real-time overview of sales, orders, fulfillment,
            inventory, payments and customer operations.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${
              loading
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh Dashboard
        </button>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-yellow-700 mt-0.5" />

          <div>
            <p className="text-xs font-black text-yellow-900">
              Dashboard data warning
            </p>

            <p className="text-[9px] text-yellow-800 mt-1">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* ======================================================
          PRIMARY KPIs
      ====================================================== */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <DashboardKpi
          icon={IndianRupee}
          label="Revenue"
          value={formatCurrency(
            metrics.revenue
          )}
          change="+12.8%"
          positive
          tone="orange"
        />

        <DashboardKpi
          icon={ShoppingBag}
          label="Orders"
          value={metrics.orders}
          change="+8.4%"
          positive
          tone="blue"
        />

        <DashboardKpi
          icon={Users}
          label="Customers"
          value={metrics.customers}
          change="+11.2%"
          positive
          tone="green"
        />

        <DashboardKpi
          icon={IndianRupee}
          label="Average Order Value"
          value={formatCurrency(
            metrics.averageOrderValue
          )}
          change="+4.6%"
          positive
          tone="purple"
        />
      </div>

      {/* ======================================================
          OPERATION SNAPSHOT
      ====================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniMetric
          icon={Clock3}
          label="Pending Orders"
          value={metrics.pendingOrders}
          onClick={() =>
            onNavigate?.("orders")
          }
        />

        <MiniMetric
          icon={Truck}
          label="Delivered"
          value={metrics.deliveredOrders}
          onClick={() =>
            onNavigate?.("orders")
          }
        />

        <MiniMetric
          icon={RotateCcw}
          label="Returns"
          value={metrics.returnOrders}
          onClick={() =>
            onNavigate?.("returns")
          }
        />

        <MiniMetric
          icon={IndianRupee}
          label="Refund Pending"
          value={formatCurrency(
            metrics.refundPending
          )}
          onClick={() =>
            onNavigate?.("payments")
          }
        />
      </div>

      {/* ======================================================
          REVENUE + FUNNEL
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-4">
        {/* REVENUE */}

        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[8px] uppercase tracking-[0.12em] font-black text-slate-400">
                Revenue Trend
              </p>

              <h2 className="text-lg font-black mt-1">
                Weekly Sales
              </h2>
            </div>

            <div className="px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 text-[8px] font-black flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              12.8%
            </div>
          </div>

          <div className="h-56 mt-6 flex items-end gap-2 sm:gap-4">
            {dashboard.revenueTrend.map(
              (item, index) => {
                const height = Math.max(
                  8,
                  Math.round(
                    (Number(
                      item.value || 0
                    ) /
                      trendMax) *
                      100
                  )
                );

                return (
                  <div
                    key={`${item.label}-${index}`}
                    className="flex-1 h-full flex flex-col justify-end items-center gap-2"
                  >
                    <div className="relative group w-full max-w-[42px]">
                      <div
                        className="w-full rounded-t-xl bg-orange-500 hover:bg-orange-400 transition-all"
                        style={{
                          height: `${height}%`,
                          minHeight: "14px",
                        }}
                      />

                      <div className="absolute left-1/2 -translate-x-1/2 -top-9 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap bg-slate-950 text-white rounded-lg px-2 py-1 text-[7px] font-black">
                        {formatCurrency(
                          item.value
                        )}
                      </div>
                    </div>

                    <span className="text-[8px] font-bold text-slate-400">
                      {item.label}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* ORDER FUNNEL */}

        <section className="bg-blue-950 text-white rounded-2xl p-5">
          <p className="text-[8px] uppercase tracking-[0.12em] font-black text-orange-300">
            Fulfillment Funnel
          </p>

          <h2 className="text-lg font-black mt-1">
            Order Journey
          </h2>

          <div className="space-y-4 mt-6">
            {dashboard.orderFunnel.map(
              (item, index) => {
                const width =
                  Math.max(
                    8,
                    Math.round(
                      (Number(
                        item.value || 0
                      ) /
                        funnelMax) *
                        100
                    )
                  );

                return (
                  <div
                    key={item.label}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[8px] font-bold text-white/65">
                        {item.label}
                      </span>

                      <span className="text-[9px] font-black">
                        {item.value}
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-400 transition-all"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              onNavigate?.("orders")
            }
            className="w-full mt-6 h-10 rounded-xl bg-white/10 hover:bg-white/15 text-[8px] font-black flex items-center justify-center gap-2"
          >
            View Fulfillment
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </section>
      </div>

      {/* ======================================================
          ALERTS
      ====================================================== */}

      <section className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.12em] font-black text-orange-600">
              Attention Required
            </p>

            <h2 className="text-lg font-black mt-1">
              Operational Alerts
            </h2>
          </div>

          <span className="px-2 py-1 rounded-lg bg-red-50 text-red-700 text-[8px] font-black">
            {dashboard.alerts.length} Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4">
          {dashboard.alerts.map(
            (alert, index) => (
              <OperationalAlert
                key={`${alert.title}-${index}`}
                alert={alert}
                onClick={() =>
                  handleAlertClick(
                    alert,
                    onNavigate
                  )
                }
              />
            )
          )}
        </div>
      </section>

      {/* ======================================================
          WAREHOUSES + TOP PRODUCTS
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* WAREHOUSES */}

        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-[0.12em] font-black text-slate-400">
                Supply Chain
              </p>

              <h2 className="text-lg font-black mt-1">
                Warehouse Health
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                onNavigate?.("inventory")
              }
              className="text-[8px] font-black text-orange-600"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3 mt-5">
            {dashboard.warehouses.map(
              (warehouse) => (
                <WarehouseRow
                  key={warehouse.name}
                  warehouse={
                    warehouse
                  }
                />
              )
            )}
          </div>
        </section>

        {/* TOP PRODUCTS */}

        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-[0.12em] font-black text-slate-400">
                Commerce
              </p>

              <h2 className="text-lg font-black mt-1">
                Top Products
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                onNavigate?.("products")
              }
              className="text-[8px] font-black text-orange-600"
            >
              View Catalog
            </button>
          </div>

          <div className="space-y-3 mt-5">
            {dashboard.topProducts.map(
              (product, index) => (
                <ProductRow
                  key={product.name}
                  product={product}
                  rank={index + 1}
                  onClick={() =>
                    onOpenProduct?.(
                      product
                    )
                  }
                />
              )
            )}
          </div>
        </section>
      </div>

      {/* ======================================================
          RECENT ORDERS
      ====================================================== */}

      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.12em] font-black text-slate-400">
              Live Activity
            </p>

            <h2 className="text-lg font-black mt-1">
              Recent Orders
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              onNavigate?.("orders")
            }
            className="inline-flex items-center gap-1 text-[8px] font-black text-orange-600"
          >
            View All
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <Heading>
                  Order
                </Heading>

                <Heading>
                  Customer
                </Heading>

                <Heading>
                  Amount
                </Heading>

                <Heading>
                  Payment
                </Heading>

                <Heading>
                  Status
                </Heading>

                <Heading>
                  Location
                </Heading>

                <Heading>
                  Time
                </Heading>

                <th />
              </tr>
            </thead>

            <tbody>
              {dashboard.recentOrders.map(
                (order) => (
                  <RecentOrderRow
                    key={
                      order.orderId
                    }
                    order={order}
                    onClick={() =>
                      onOpenOrder?.(
                        order.orderId
                      )
                    }
                  />
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================
          LOADING INDICATOR
      ====================================================== */}

      {loading && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-blue-950 text-white px-4 py-3 shadow-xl">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />

          <span className="text-[8px] font-black">
            Updating dashboard
          </span>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   KPI
============================================================ */

function DashboardKpi({
  icon: Icon,
  label,
  value,
  change,
  positive,
  tone,
}) {
  const styles = {
    orange:
      "bg-orange-50 text-orange-700",
    blue:
      "bg-blue-50 text-blue-800",
    green:
      "bg-green-50 text-green-700",
    purple:
      "bg-purple-50 text-purple-700",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${styles[tone]}`}
        >
          <Icon className="w-4 h-4" />
        </div>

        <span
          className={`inline-flex items-center gap-0.5 text-[7px] font-black ${
            positive
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {positive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}

          {change}
        </span>
      </div>

      <p className="text-[8px] uppercase tracking-[0.1em] font-black text-slate-400 mt-4">
        {label}
      </p>

      <p className="text-xl font-black text-slate-950 mt-1">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   MINI METRIC
============================================================ */

function MiniMetric({
  icon: Icon,
  label,
  value,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white border border-slate-200 rounded-2xl p-4 hover:border-orange-300 hover:shadow-sm transition"
    >
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-slate-700" />
        </div>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
      </div>

      <p className="text-[8px] uppercase tracking-[0.1em] font-black text-slate-400 mt-3">
        {label}
      </p>

      <p className="text-lg font-black mt-1">
        {value}
      </p>
    </button>
  );
}

/* ============================================================
   ALERT
============================================================ */

function OperationalAlert({
  alert,
  onClick,
}) {
  const severity =
    normalize(alert.severity);

  const icon =
    alert.type === "LOW_STOCK"
      ? ShieldAlertIcon
      : alert.type === "REFUND"
      ? IndianRupee
      : Truck;

  const Icon = icon;

  const styles = {
    HIGH:
      "border-red-200 bg-red-50 text-red-700",
    MEDIUM:
      "border-orange-200 bg-orange-50 text-orange-700",
    LOW:
      "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left border rounded-xl p-4 hover:shadow-sm transition ${
        styles[severity] ||
        styles.MEDIUM
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>

        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </div>

      <p className="text-[9px] font-black mt-4">
        {alert.title}
      </p>

      <p className="text-[8px] mt-1 opacity-75 leading-relaxed">
        {alert.description}
      </p>
    </button>
  );
}

/* ============================================================
   WAREHOUSE
============================================================ */

function WarehouseRow({
  warehouse,
}) {
  const health =
    normalize(
      warehouse.health
    );

  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
            <Warehouse className="w-4 h-4" />
          </div>

          <div>
            <p className="text-[9px] font-black">
              {warehouse.name}
            </p>

            <p className="text-[7px] text-slate-400 mt-1">
              {warehouse.orders} active fulfillment orders
            </p>
          </div>
        </div>

        <span
          className={`px-2 py-1 rounded-md text-[7px] font-black ${
            health === "HEALTHY"
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {health === "HEALTHY"
            ? "Healthy"
            : "Watch"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <div className="flex justify-between">
            <span className="text-[7px] text-slate-400">
              Stock Health
            </span>

            <span className="text-[7px] font-black">
              {warehouse.stock}%
            </span>
          </div>

          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full rounded-full bg-green-500"
              style={{
                width: `${Math.min(
                  100,
                  warehouse.stock
                )}%`,
              }}
            />
          </div>
        </div>

        <div>
          <p className="text-[7px] text-slate-400">
            Delayed
          </p>

          <p
            className={`text-[10px] font-black mt-1 ${
              warehouse.delayed > 5
                ? "text-red-600"
                : "text-slate-800"
            }`}
          >
            {warehouse.delayed}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PRODUCT
============================================================ */

function ProductRow({
  product,
  rank,
  onClick,
}) {
  const stock =
    Number(product.stock || 0);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 text-left rounded-xl p-2 hover:bg-slate-50 transition"
    >
      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400">
        {String(rank).padStart(2, "0")}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black truncate">
          {product.name}
        </p>

        <p className="text-[7px] text-slate-400 mt-1">
          {product.sales} units sold
        </p>
      </div>

      <div className="text-right">
        <p className="text-[9px] font-black">
          {formatCurrency(
            product.revenue
          )}
        </p>

        <p
          className={`text-[7px] mt-1 font-bold ${
            stock <= 20
              ? "text-orange-600"
              : "text-green-600"
          }`}
        >
          {stock} in stock
        </p>
      </div>
    </button>
  );
}

/* ============================================================
   ORDER
============================================================ */

function RecentOrderRow({
  order,
  onClick,
}) {
  return (
    <tr
      onClick={onClick}
      className="border-b border-slate-100 last:border-0 hover:bg-orange-50/30 cursor-pointer transition"
    >
      <td className="px-5 py-4">
        <p className="text-[9px] font-black text-blue-800">
          {order.orderId}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-[9px] font-black">
          {order.customer}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-[9px] font-black">
          {formatCurrency(
            order.amount
          )}
        </p>
      </td>

      <td className="px-4 py-4">
        <span
          className={`px-2 py-1 rounded-md text-[7px] font-black ${
            normalize(order.payment) ===
            "PAID"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {formatStatus(
            order.payment
          )}
        </span>
      </td>

      <td className="px-4 py-4">
        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[7px] font-black">
          {formatStatus(
            order.status
          )}
        </span>
      </td>

      <td className="px-4 py-4">
        <p className="text-[8px] font-bold text-slate-600">
          {order.city}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-[8px] text-slate-400">
          {formatRelativeTime(
            order.time
          )}
        </p>
      </td>

      <td className="px-4">
        <ChevronRight className="w-4 h-4 text-slate-300" />
      </td>
    </tr>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function ShieldAlertIcon(props) {
  return (
    <ShieldAlert
      {...props}
    />
  );
}

function Heading({
  children,
}) {
  return (
    <th className="text-left px-4 py-3 text-[8px] uppercase tracking-[0.12em] font-black text-slate-500">
      {children}
    </th>
  );
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replaceAll(" ", "_");
}

function formatStatus(value) {
  return normalize(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}

function formatCurrency(value) {
  return `₹${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
}

function formatRelativeTime(
  value
) {
  if (!value) return "—";

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  const seconds =
    Math.floor(
      (Date.now() -
        date.getTime()) /
        1000
    );

  if (seconds < 60) {
    return `${Math.max(
      1,
      seconds
    )}s ago`;
  }

  const minutes =
    Math.floor(
      seconds / 60
    );

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(
    hours / 24
  )}d ago`;
}

function handleAlertClick(
  alert,
  onNavigate
) {
  if (
    alert.type ===
    "LOW_STOCK"
  ) {
    onNavigate?.(
      "inventory"
    );
    return;
  }

  if (
    alert.type ===
    "REFUND"
  ) {
    onNavigate?.(
      "payments"
    );
    return;
  }

  if (
    alert.type ===
    "DELIVERY"
  ) {
    onNavigate?.(
      "shipments"
    );
  }
}