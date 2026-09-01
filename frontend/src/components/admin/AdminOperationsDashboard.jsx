import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Clock3,
  IndianRupee,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
  UserRound,
  Users,
  Warehouse,
  XCircle,
  Zap,
} from "lucide-react";

export default function AdminOperationsDashboard({
  api,
  onNavigate,
}) {
  const [data, setData] = useState({
    orders: [],
    shipments: [],
    customers: [],
    inventory: [],
    warehouses: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        ordersResponse,
        shipmentsResponse,
        customersResponse,
        inventoryResponse,
        warehousesResponse,
      ] = await Promise.all([
        api?.getAdminOrders
          ? api.getAdminOrders("limit=100")
          : Promise.resolve({ orders: [] }),

        api?.getAdminShipments
          ? api.getAdminShipments("limit=100")
          : Promise.resolve({ shipments: [] }),

        api?.getAdminCustomers
          ? api.getAdminCustomers("limit=100")
          : Promise.resolve({ customers: [] }),

        api?.getAdminInventory
          ? api.getAdminInventory("limit=100")
          : Promise.resolve({ inventory: [] }),

        api?.getAdminWarehouses
          ? api.getAdminWarehouses()
          : Promise.resolve({ warehouses: [] }),
      ]);

      setData({
        orders:
          ordersResponse?.orders || [],
        shipments:
          shipmentsResponse?.shipments || [],
        customers:
          customersResponse?.customers || [],
        inventory:
          inventoryResponse?.inventory ||
          inventoryResponse?.products ||
          [],
        warehouses:
          warehousesResponse?.warehouses ||
          [],
      });
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load operations dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const metrics = useMemo(() => {
    const orders = data.orders;
    const shipments = data.shipments;
    const inventory = data.inventory;

    const totalRevenue = orders.reduce(
      (sum, order) =>
        sum +
        Number(
          order.summary?.totalPaid || 0
        ),
      0
    );

    const paidOrders = orders.filter(
      (order) =>
        String(
          order.paymentStatus || ""
        ).toUpperCase() === "PAID"
    ).length;

    const pendingOrders = orders.filter(
      (order) =>
        ![
          "DELIVERED",
          "CANCELLED",
        ].includes(
          String(
            order.status || ""
          ).toUpperCase()
        )
    ).length;

    const delivered = shipments.filter(
      (shipment) =>
        String(
          shipment.status || ""
        ).toUpperCase() === "DELIVERED"
    ).length;

    const inTransit = shipments.filter(
      (shipment) =>
        [
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
        ].includes(
          String(
            shipment.status || ""
          ).toUpperCase()
        )
    ).length;

    const exceptions = shipments.filter(
      (shipment) =>
        [
          "FAILED_DELIVERY",
          "RTO",
          "CANCELLED",
        ].includes(
          String(
            shipment.status || ""
          ).toUpperCase()
        )
    ).length;

    const lowStock = inventory.filter(
      (item) => {
        const stock =
          Number(item.stock || 0);

        const threshold =
          Number(
            item.lowStockThreshold ||
              10
          );

        return (
          stock > 0 &&
          stock <= threshold
        );
      }
    ).length;

    const outOfStock = inventory.filter(
      (item) =>
        Number(item.stock || 0) <= 0
    ).length;

    const totalUnits =
      inventory.reduce(
        (sum, item) =>
          sum +
          Number(
            item.stock || 0
          ),
        0
      );

    const slaRisk = shipments.filter(
      (shipment) =>
        [
          "AT_RISK",
          "BREACHED",
          "DELAYED",
        ].includes(
          String(
            shipment.slaStatus || ""
          ).toUpperCase()
        )
    ).length;

    return {
      totalRevenue,
      paidOrders,
      pendingOrders,
      delivered,
      inTransit,
      exceptions,
      lowStock,
      outOfStock,
      totalUnits,
      slaRisk,
    };
  }, [data]);

  const statusCounts = useMemo(() => {
    const result = {};

    data.orders.forEach((order) => {
      const status =
        order.status || "UNKNOWN";

      result[status] =
        (result[status] || 0) + 1;
    });

    return result;
  }, [data.orders]);

  const recentOrders = useMemo(() => {
    return [...data.orders]
      .sort(
        (a, b) =>
          new Date(
            b.placedAt || 0
          ) -
          new Date(
            a.placedAt || 0
          )
      )
      .slice(0, 6);
  }, [data.orders]);

  const attentionItems = useMemo(() => {
    const items = [];

    if (metrics.outOfStock > 0) {
      items.push({
        type: "critical",
        icon: XCircle,
        title: `${metrics.outOfStock} products out of stock`,
        description:
          "Orders may be blocked until inventory is replenished.",
        action: "Inventory",
        target: "inventory",
      });
    }

    if (metrics.lowStock > 0) {
      items.push({
        type: "warning",
        icon: AlertTriangle,
        title: `${metrics.lowStock} products running low`,
        description:
          "Review warehouse stock before the next order spike.",
        action: "Review stock",
        target: "warehouses",
      });
    }

    if (metrics.slaRisk > 0) {
      items.push({
        type: "warning",
        icon: Clock3,
        title: `${metrics.slaRisk} shipments need attention`,
        description:
          "These shipments are at risk of missing their SLA.",
        action: "Shipments",
        target: "shipments",
      });
    }

    if (metrics.exceptions > 0) {
      items.push({
        type: "critical",
        icon: Truck,
        title: `${metrics.exceptions} delivery exceptions`,
        description:
          "Failed deliveries, RTOs or cancelled shipments require review.",
        action: "Resolve",
        target: "shipments",
      });
    }

    return items.slice(0, 5);
  }, [metrics]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-5">
      {/* HERO */}

      <div className="relative overflow-hidden rounded-3xl bg-blue-950 text-white p-6">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute right-20 bottom-[-100px] w-72 h-72 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

              <p className="text-[8px] uppercase tracking-[0.2em] font-black text-green-300">
                Operations Live
              </p>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              Command Center
            </h1>

            <p className="text-xs text-white/60 mt-2 max-w-xl">
              Your D2C business at a glance —
              orders, customers, payments,
              inventory and delivery operations.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            className="self-start xl:self-center inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-xs font-black hover:bg-white/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Data
          </button>
        </div>

        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <HeroMetric
            label="Revenue"
            value={formatCurrency(
              metrics.totalRevenue
            )}
            icon={IndianRupee}
          />

          <HeroMetric
            label="Orders"
            value={data.orders.length}
            icon={ShoppingBag}
          />

          <HeroMetric
            label="Customers"
            value={data.customers.length}
            icon={Users}
          />

          <HeroMetric
            label="Delivered"
            value={metrics.delivered}
            icon={CheckCircle2}
          />
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-yellow-700 mt-0.5" />

          <div>
            <p className="text-xs font-black text-yellow-900">
              Some live data could not be loaded
            </p>

            <p className="text-[9px] text-yellow-800 mt-1">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* PRIMARY METRICS */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard
          icon={ShoppingBag}
          label="Open Orders"
          value={metrics.pendingOrders}
          subtitle={`${metrics.paidOrders} paid orders`}
          tone="orange"
          onClick={() =>
            navigate(
              onNavigate,
              "orders"
            )
          }
        />

        <MetricCard
          icon={Truck}
          label="In Transit"
          value={metrics.inTransit}
          subtitle={`${metrics.delivered} delivered`}
          tone="blue"
          onClick={() =>
            navigate(
              onNavigate,
              "shipments"
            )
          }
        />

        <MetricCard
          icon={Boxes}
          label="Stock Units"
          value={metrics.totalUnits}
          subtitle={`${metrics.lowStock} low stock`}
          tone="green"
          onClick={() =>
            navigate(
              onNavigate,
              "warehouses"
            )
          }
        />

        <MetricCard
          icon={AlertTriangle}
          label="Needs Attention"
          value={
            metrics.exceptions +
            metrics.slaRisk +
            metrics.outOfStock
          }
          subtitle="Across operations"
          tone="yellow"
        />
      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5">
        {/* RECENT ORDERS */}

        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div>
              <p className="text-[8px] uppercase tracking-[0.14em] text-orange-600 font-black">
                Commerce
              </p>

              <h2 className="text-sm font-black text-slate-950 mt-1">
                Recent Orders
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  onNavigate,
                  "orders"
                )
              }
              className="text-[9px] font-black text-blue-800 flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentOrders.length ? (
              recentOrders.map(
                (order, index) => (
                  <RecentOrder
                    key={
                      order.orderId ||
                      index
                    }
                    order={order}
                  />
                )
              )
            ) : (
              <EmptyState
                icon={ShoppingBag}
                text="No orders yet"
              />
            )}
          </div>
        </section>

        {/* ATTENTION */}

        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>

              <div>
                <p className="text-[8px] uppercase tracking-[0.14em] text-red-600 font-black">
                  Action Center
                </p>

                <h2 className="text-sm font-black text-slate-950 mt-1">
                  Needs Attention
                </h2>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {attentionItems.length ? (
              attentionItems.map(
                (item, index) => (
                  <AttentionCard
                    key={index}
                    item={item}
                    onClick={() =>
                      navigate(
                        onNavigate,
                        item.target
                      )
                    }
                  />
                )
              )
            ) : (
              <div className="rounded-xl bg-green-50 p-5 text-center">
                <CheckCircle2 className="w-6 h-6 mx-auto text-green-600" />

                <p className="text-xs font-black text-green-900 mt-2">
                  Everything looks good
                </p>

                <p className="text-[9px] text-green-700 mt-1">
                  No critical operational issues.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* OPERATIONS GRID */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ORDER STATUS */}

        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <SectionHeader
            icon={Activity}
            eyebrow="Order Pipeline"
            title="Order Status"
          />

          <div className="mt-5 space-y-3">
            <StatusProgress
              label="Confirmed"
              value={
                statusCounts.CONFIRMED ||
                0
              }
              total={
                data.orders.length
              }
              tone="blue"
            />

            <StatusProgress
              label="Processing"
              value={
                statusCounts.PROCESSING ||
                0
              }
              total={
                data.orders.length
              }
              tone="orange"
            />

            <StatusProgress
              label="Shipped"
              value={
                statusCounts.SHIPPED ||
                0
              }
              total={
                data.orders.length
              }
              tone="yellow"
            />

            <StatusProgress
              label="Delivered"
              value={
                statusCounts.DELIVERED ||
                0
              }
              total={
                data.orders.length
              }
              tone="green"
            />
          </div>
        </section>

        {/* DELIVERY */}

        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <SectionHeader
            icon={Truck}
            eyebrow="Logistics"
            title="Delivery Health"
          />

          <div className="mt-5 grid grid-cols-2 gap-3">
            <HealthBox
              label="Delivered"
              value={
                metrics.delivered
              }
              icon={CheckCircle2}
              tone="green"
            />

            <HealthBox
              label="In Transit"
              value={
                metrics.inTransit
              }
              icon={Truck}
              tone="blue"
            />

            <HealthBox
              label="SLA Risk"
              value={
                metrics.slaRisk
              }
              icon={Clock3}
              tone="yellow"
            />

            <HealthBox
              label="Exceptions"
              value={
                metrics.exceptions
              }
              icon={XCircle}
              tone="red"
            />
          </div>
        </section>

        {/* INVENTORY */}

        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <SectionHeader
            icon={Boxes}
            eyebrow="Inventory"
            title="Stock Health"
          />

          <div className="mt-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-black text-slate-950">
                  {metrics.totalUnits.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="text-[8px] uppercase tracking-[0.1em] font-black text-slate-400 mt-1">
                  Total units
                </p>
              </div>

              <Boxes className="w-7 h-7 text-orange-500" />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <MiniStat
                label="Healthy"
                value={Math.max(
                  0,
                  data.inventory.length -
                    metrics.lowStock -
                    metrics.outOfStock
                )}
                tone="green"
              />

              <MiniStat
                label="Low"
                value={
                  metrics.lowStock
                }
                tone="yellow"
              />

              <MiniStat
                label="Out"
                value={
                  metrics.outOfStock
                }
                tone="red"
              />

              <MiniStat
                label="SKUs"
                value={
                  data.inventory.length
                }
                tone="blue"
              />
            </div>
          </div>
        </section>
      </div>

      {/* WAREHOUSE NETWORK */}

      <section className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <SectionHeader
            icon={Warehouse}
            eyebrow="Fulfillment Network"
            title="Warehouse Overview"
          />

          <button
            type="button"
            onClick={() =>
              navigate(
                onNavigate,
                "warehouses"
              )
            }
            className="text-[9px] font-black text-blue-800 flex items-center gap-1"
          >
            Manage Warehouses
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-5">
          {(data.warehouses.length
            ? data.warehouses
            : fallbackWarehouses
          ).map(
            (warehouse) => (
              <WarehouseHealthCard
                key={
                  warehouse.id ||
                  warehouse.name
                }
                warehouse={
                  warehouse
                }
                inventory={
                  data.inventory
                }
              />
            )
          )}
        </div>
      </section>

      {/* CUSTOMER + PERFORMANCE */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-blue-950 text-white rounded-2xl p-5">
          <SectionHeader
            icon={Users}
            eyebrow="Customer Intelligence"
            title="Customer Base"
            dark
          />

          <div className="grid grid-cols-2 gap-3 mt-5">
            <DarkStat
              label="Customers"
              value={
                data.customers.length
              }
            />

            <DarkStat
              label="Orders / Customer"
              value={
                data.customers.length
                  ? (
                      data.orders.length /
                      data.customers.length
                    ).toFixed(1)
                  : "0.0"
              }
            />

            <DarkStat
              label="Paid Orders"
              value={
                metrics.paidOrders
              }
            />

            <DarkStat
              label="Revenue"
              value={formatCurrency(
                metrics.totalRevenue
              )}
            />
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <SectionHeader
            icon={Activity}
            eyebrow="System Pulse"
            title="Operational Snapshot"
          />

          <div className="mt-5 space-y-3">
            <PulseRow
              label="Checkout → Order"
              value={
                metrics.paidOrders
                  ? "Healthy"
                  : "Waiting"
              }
              tone={
                metrics.paidOrders
                  ? "green"
                  : "yellow"
              }
            />

            <PulseRow
              label="Order → Shipment"
              value={
                metrics.inTransit +
                metrics.delivered
                  ? "Active"
                  : "Waiting"
              }
              tone="blue"
            />

            <PulseRow
              label="Shipment → Delivery"
              value={
                metrics.delivered
                  ? "Moving"
                  : "Waiting"
              }
              tone={
                metrics.delivered
                  ? "green"
                  : "yellow"
              }
            />

            <PulseRow
              label="Inventory Availability"
              value={
                metrics.outOfStock ===
                0
                  ? "Healthy"
                  : "Attention"
              }
              tone={
                metrics.outOfStock ===
                0
                  ? "green"
                  : "red"
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* ============================================================
   HERO
============================================================ */

function HeroMetric({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-xl bg-white/10 border border-white/10 p-4">
      <Icon className="w-4 h-4 text-orange-300" />

      <p className="text-[8px] uppercase tracking-[0.12em] font-black text-white/50 mt-3">
        {label}
      </p>

      <p className="text-lg font-black mt-1">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   METRIC CARD
============================================================ */

function MetricCard({
  icon: Icon,
  label,
  value,
  subtitle,
  tone,
  onClick,
}) {
  const tones = {
    orange:
      "bg-orange-50 text-orange-600",
    blue:
      "bg-blue-50 text-blue-800",
    green:
      "bg-green-50 text-green-700",
    yellow:
      "bg-yellow-50 text-yellow-700",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md hover:border-orange-200 transition"
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${tones[tone]}`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <p className="text-[8px] uppercase tracking-[0.1em] font-black text-slate-400 mt-4">
        {label}
      </p>

      <p className="text-xl font-black text-slate-950 mt-1">
        {value}
      </p>

      <p className="text-[8px] text-slate-400 mt-1">
        {subtitle}
      </p>
    </button>
  );
}

/* ============================================================
   RECENT ORDER
============================================================ */

function RecentOrder({
  order,
}) {
  const status =
    String(
      order.status ||
        "CONFIRMED"
    ).toUpperCase();

  return (
    <div className="px-5 py-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
        <ShoppingBag className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-slate-900">
          {order.orderId ||
            "Order"}
        </p>

        <p className="text-[8px] text-slate-400 mt-1 truncate">
          {order.customer?.name ||
            "Customer"}{" "}
          ·{" "}
          {order.customer?.city ||
            "India"}
        </p>
      </div>

      <div className="text-right">
        <p className="text-[10px] font-black">
          {formatCurrency(
            order.summary
              ?.totalPaid || 0
          )}
        </p>

        <span
          className={`inline-flex mt-1 px-2 py-1 rounded-md text-[7px] font-black ${getOrderStatusClass(
            status
          )}`}
        >
          {formatStatus(
            status
          )}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   ATTENTION
============================================================ */

function AttentionCard({
  item,
  onClick,
}) {
  const Icon = item.icon;

  const critical =
    item.type === "critical";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl p-3 flex items-center gap-3 ${
        critical
          ? "bg-red-50 hover:bg-red-100"
          : "bg-yellow-50 hover:bg-yellow-100"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          critical
            ? "bg-red-100 text-red-600"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-[9px] font-black ${
            critical
              ? "text-red-900"
              : "text-yellow-900"
          }`}
        >
          {item.title}
        </p>

        <p
          className={`text-[8px] mt-1 ${
            critical
              ? "text-red-700"
              : "text-yellow-800"
          }`}
        >
          {item.description}
        </p>
      </div>

      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
    </button>
  );
}

/* ============================================================
   STATUS PROGRESS
============================================================ */

function StatusProgress({
  label,
  value,
  total,
  tone,
}) {
  const percentage = total
    ? Math.min(
        100,
        Math.round(
          (value / total) * 100
        )
      )
    : 0;

  const bars = {
    blue: "bg-blue-700",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-[9px] font-bold text-slate-600">
          {label}
        </p>

        <p className="text-[9px] font-black">
          {value}
        </p>
      </div>

      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
        <div
          className={`h-full rounded-full ${bars[tone]}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   HEALTH
============================================================ */

function HealthBox({
  label,
  value,
  icon: Icon,
  tone,
}) {
  const styles = {
    green:
      "bg-green-50 text-green-700",
    blue:
      "bg-blue-50 text-blue-800",
    yellow:
      "bg-yellow-50 text-yellow-700",
    red:
      "bg-red-50 text-red-700",
  };

  return (
    <div
      className={`rounded-xl p-3 ${styles[tone]}`}
    >
      <Icon className="w-4 h-4" />

      <p className="text-lg font-black mt-3">
        {value}
      </p>

      <p className="text-[7px] uppercase font-black mt-1">
        {label}
      </p>
    </div>
  );
}

/* ============================================================
   INVENTORY MINI
============================================================ */

function MiniStat({
  label,
  value,
  tone,
}) {
  const styles = {
    green:
      "bg-green-50 text-green-700",
    yellow:
      "bg-yellow-50 text-yellow-700",
    red:
      "bg-red-50 text-red-700",
    blue:
      "bg-blue-50 text-blue-800",
  };

  return (
    <div
      className={`rounded-xl p-3 ${styles[tone]}`}
    >
      <p className="text-[7px] uppercase font-black">
        {label}
      </p>

      <p className="text-sm font-black mt-1">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   WAREHOUSE
============================================================ */

function WarehouseHealthCard({
  warehouse,
  inventory,
}) {
  const items =
    inventory.filter(
      (item) =>
        item.warehouseId ===
          warehouse.id ||
        item.warehouse ===
          warehouse.name ||
        item.warehouseCity ===
          warehouse.name
    );

  const units =
    items.reduce(
      (sum, item) =>
        sum +
        Number(
          item.stock || 0
        ),
      0
    );

  const capacity =
    Number(
      warehouse.capacity ||
        5000
    );

  const utilization =
    Math.min(
      100,
      Math.round(
        (units / capacity) *
          100
      )
    );

  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
          <Warehouse className="w-4 h-4" />
        </div>

        <span className="text-[7px] font-black text-green-700 bg-green-50 px-2 py-1 rounded-md">
          ACTIVE
        </span>
      </div>

      <p className="text-[10px] font-black mt-4">
        {warehouse.name}
      </p>

      <p className="text-[8px] text-slate-400 mt-1">
        {warehouse.city ||
          "India"}
      </p>

      <div className="mt-4">
        <div className="flex justify-between">
          <span className="text-[7px] uppercase font-black text-slate-400">
            Capacity
          </span>

          <span className="text-[8px] font-black">
            {utilization}%
          </span>
        </div>

        <div className="h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full ${
              utilization >= 90
                ? "bg-red-500"
                : utilization >= 70
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{
              width: `${utilization}%`,
            }}
          />
        </div>
      </div>

      <p className="text-[8px] text-slate-400 mt-3">
        {units.toLocaleString(
          "en-IN"
        )}{" "}
        units stored
      </p>
    </div>
  );
}

/* ============================================================
   DARK STAT
============================================================ */

function DarkStat({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-white/10 border border-white/10 p-4">
      <p className="text-[7px] uppercase tracking-[0.1em] font-black text-white/40">
        {label}
      </p>

      <p className="text-lg font-black mt-2">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   PULSE
============================================================ */

function PulseRow({
  label,
  value,
  tone,
}) {
  const dots = {
    green: "bg-green-500",
    blue: "bg-blue-600",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  return (
    <div className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${dots[tone]}`}
        />

        <p className="text-[9px] font-bold text-slate-600">
          {label}
        </p>
      </div>

      <p className="text-[9px] font-black">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   HEADER
============================================================ */

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  dark = false,
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          dark
            ? "bg-white/10 text-orange-300"
            : "bg-orange-50 text-orange-600"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div>
        <p
          className={`text-[8px] uppercase tracking-[0.14em] font-black ${
            dark
              ? "text-orange-300"
              : "text-orange-600"
          }`}
        >
          {eyebrow}
        </p>

        <h2
          className={`text-sm font-black mt-1 ${
            dark
              ? "text-white"
              : "text-slate-950"
          }`}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}

/* ============================================================
   EMPTY
============================================================ */

function EmptyState({
  icon: Icon,
  text,
}) {
  return (
    <div className="py-12 text-center">
      <Icon className="w-7 h-7 mx-auto text-slate-300" />

      <p className="text-xs font-black text-slate-500 mt-3">
        {text}
      </p>
    </div>
  );
}

/* ============================================================
   SKELETON
============================================================ */

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-64 rounded-3xl bg-slate-200 animate-pulse" />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-2xl bg-slate-100 animate-pulse"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="h-72 rounded-2xl bg-slate-100 animate-pulse" />

        <div className="h-72 rounded-2xl bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function navigate(
  callback,
  destination
) {
  if (typeof callback === "function") {
    callback(destination);
  }
}

function formatCurrency(value) {
  return `₹${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
}

function formatStatus(value) {
  return String(
    value || ""
  )
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function getOrderStatusClass(
  status
) {
  const classes = {
    CONFIRMED:
      "bg-blue-100 text-blue-700",
    PROCESSING:
      "bg-orange-100 text-orange-700",
    SHIPPED:
      "bg-yellow-100 text-yellow-800",
    DELIVERED:
      "bg-green-100 text-green-700",
    CANCELLED:
      "bg-red-100 text-red-700",
  };

  return (
    classes[status] ||
    "bg-slate-100 text-slate-600"
  );
}

const fallbackWarehouses = [
  {
    id: "WH-MUM",
    name: "Mumbai Bhiwandi Hub",
    city: "Mumbai",
    state: "Maharashtra",
    capacity: 5000,
  },
  {
    id: "WH-DEL",
    name: "Delhi NCR Hub",
    city: "Delhi",
    state: "Delhi",
    capacity: 4500,
  },
  {
    id: "WH-BLR",
    name: "Bengaluru Whitefield Hub",
    city: "Bengaluru",
    state: "Karnataka",
    capacity: 4000,
  },
  {
    id: "WH-JAI",
    name: "Jaipur Depot Hub",
    city: "Jaipur",
    state: "Rajasthan",
    capacity: 3000,
  },
];