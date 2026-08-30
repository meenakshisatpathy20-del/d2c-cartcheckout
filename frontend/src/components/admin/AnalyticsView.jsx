import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingBag,
  Users,
  Truck,
  PackageCheck,
  RotateCcw,
  Clock3,
  Warehouse,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ArrowUpRight
} from 'lucide-react';

function currency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function number(value) {
  return new Intl.NumberFormat('en-IN').format(
    Number(value || 0)
  );
}

function percent(value) {
  return `${Math.round(Number(value || 0))}%`;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  description,
  positive = true,
  className
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${className}`}
        >
          <Icon className="w-5 h-5" />
        </div>

        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-black ${
              positive
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {positive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>

      <p className="text-[9px] uppercase tracking-[0.16em] font-black text-slate-400 mt-4">
        {label}
      </p>

      <p className="text-xl font-black text-slate-950 mt-1">
        {value}
      </p>

      <p className="text-[10px] text-slate-500 mt-1">
        {description}
      </p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  total,
  suffix = '',
  className = 'bg-blue-600'
}) {
  const percentageValue =
    total > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (Number(value || 0) /
              Number(total || 1)) *
              100
          )
        )
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-[10px] font-bold text-slate-600">
          {label}
        </span>

        <span className="text-[10px] font-black text-slate-900">
          {number(value)}
          {suffix}
        </span>
      </div>

      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${className}`}
          style={{
            width: `${percentageValue}%`
          }}
        />
      </div>
    </div>
  );
}

function FunnelStep({
  label,
  value,
  percentageValue,
  icon: Icon,
  className
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${className}`}
        >
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1">
          <p className="text-[10px] font-black text-slate-800">
            {label}
          </p>

          <p className="text-[9px] text-slate-400 mt-0.5">
            {percentageValue}% of orders
          </p>
        </div>

        <p className="text-sm font-black text-slate-950">
          {number(value)}
        </p>
      </div>
    </div>
  );
}

function CarrierRow({
  carrier
}) {
  const deliveryRate =
    Number(carrier.deliveryRate || 0);

  return (
    <div className="p-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>

          <div>
            <p className="text-xs font-black text-slate-900">
              {carrier.name}
            </p>

            <p className="text-[9px] text-slate-400 mt-1">
              {number(carrier.shipments)} shipments
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs font-black text-green-700">
            {percent(deliveryRate)}
          </p>

          <p className="text-[8px] text-slate-400">
            delivered
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500"
            style={{
              width: `${Math.min(
                100,
                deliveryRate
              )}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}

function WarehouseRow({
  warehouse
}) {
  const health =
    warehouse.health || 'HEALTHY';

  const healthClass =
    health === 'CRITICAL'
      ? 'bg-red-50 text-red-700'
      : health === 'WARNING'
      ? 'bg-yellow-50 text-yellow-700'
      : 'bg-green-50 text-green-700';

  return (
    <div className="flex items-center gap-3 p-4 border-b border-slate-100 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
        <Warehouse className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-black text-slate-900 truncate">
          {warehouse.name ||
            warehouse.city ||
            'Warehouse'}
        </p>

        <p className="text-[9px] text-slate-400 mt-1">
          {number(
            warehouse.pendingOrders
          )}{' '}
          pending •{' '}
          {number(
            warehouse.delayedShipments
          )}{' '}
          delayed
        </p>
      </div>

      <span
        className={`px-2 py-1 rounded-full text-[8px] font-black ${healthClass}`}
      >
        {health === 'CRITICAL'
          ? 'Critical'
          : health === 'WARNING'
          ? 'Attention'
          : 'Healthy'}
      </span>
    </div>
  );
}

export default function AnalyticsView({
  analytics = {},
  orders = [],
  customers = [],
  shipments = [],
  warehouses = [],
  loading = false
}) {
  const computed = useMemo(() => {
    const totalOrders =
      Number(
        analytics.totalOrders
      ) || orders.length;

    const revenue =
      Number(
        analytics.revenue
      ) ||
      orders.reduce(
        (sum, order) =>
          sum +
          Number(
            order.summary?.totalPaid || 0
          ),
        0
      );

    const delivered =
      Number(
        analytics.deliveredOrders
      ) ||
      orders.filter(
        order =>
          order.status ===
          'DELIVERED'
      ).length;

    const cancelled =
      Number(
        analytics.cancelledOrders
      ) ||
      orders.filter(
        order =>
          order.status ===
          'CANCELLED'
      ).length;

    const returns =
      Number(
        analytics.returnedOrders
      ) ||
      orders.filter(
        order =>
          order.returnRequested
      ).length;

    const paidOrders =
      Number(
        analytics.paidOrders
      ) ||
      orders.filter(
        order =>
          order.paymentStatus ===
          'PAID'
      ).length;

    const activeShipments =
      Number(
        analytics.activeShipments
      ) ||
      shipments.filter(
        shipment =>
          [
            'SHIPPED',
            'IN_TRANSIT',
            'OUT_FOR_DELIVERY'
          ].includes(
            shipment.status
          )
      ).length;

    const exceptions =
      Number(
        analytics.shipmentExceptions
      ) ||
      shipments.filter(
        shipment =>
          shipment.status ===
            'EXCEPTION' ||
          shipment.exception
      ).length;

    const customerCount =
      Number(
        analytics.totalCustomers
      ) || customers.length;

    const aov =
      Number(
        analytics.aov
      ) ||
      (totalOrders > 0
        ? revenue / totalOrders
        : 0);

    const deliveryRate =
      Number(
        analytics.deliveryRate
      ) ||
      (totalOrders > 0
        ? (delivered /
            totalOrders) *
          100
        : 0);

    const paymentSuccessRate =
      Number(
        analytics.paymentSuccessRate
      ) ||
      (totalOrders > 0
        ? (paidOrders /
            totalOrders) *
          100
        : 0);

    const returnRate =
      Number(
        analytics.returnRate
      ) ||
      (totalOrders > 0
        ? (returns /
            totalOrders) *
          100
        : 0);

    return {
      totalOrders,
      revenue,
      delivered,
      cancelled,
      returns,
      paidOrders,
      activeShipments,
      exceptions,
      customerCount,
      aov,
      deliveryRate,
      paymentSuccessRate,
      returnRate
    };
  }, [
    analytics,
    orders,
    customers,
    shipments
  ]);

  const funnel = useMemo(() => {
    const total =
      computed.totalOrders || 1;

    return [
      {
        label: 'Orders placed',
        value: computed.totalOrders,
        percentage: 100,
        icon: ShoppingBag,
        className:
          'bg-blue-50 text-blue-700'
      },
      {
        label: 'Payment successful',
        value: computed.paidOrders,
        percentage: Math.round(
          (computed.paidOrders /
            total) *
            100
        ),
        icon: IndianRupee,
        className:
          'bg-green-50 text-green-700'
      },
      {
        label: 'Shipped',
        value:
          computed.activeShipments +
          computed.delivered,
        percentage: Math.round(
          ((computed.activeShipments +
            computed.delivered) /
            total) *
            100
        ),
        icon: Truck,
        className:
          'bg-indigo-50 text-indigo-700'
      },
      {
        label: 'Delivered',
        value: computed.delivered,
        percentage: Math.round(
          (computed.delivered /
            total) *
            100
        ),
        icon: PackageCheck,
        className:
          'bg-orange-50 text-orange-600'
      }
    ];
  }, [computed]);

  const carrierData =
    analytics.carriers ||
    [];

  const warehouseData =
    analytics.warehouses ||
    warehouses;

  const topProducts =
    analytics.topProducts ||
    [];

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-20 rounded-2xl bg-slate-100 animate-pulse" />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(
            item => (
              <div
                key={item}
                className="h-40 rounded-2xl bg-slate-100 animate-pulse"
              />
            )
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] font-black text-orange-600">
            Business intelligence
          </p>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
            Analytics
          </h1>

          <p className="text-xs text-slate-500 mt-2">
            Understand revenue, customers, fulfillment and
            delivery performance across the D2C network.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 border border-green-100">
          <Activity className="w-3.5 h-3.5 text-green-600" />

          <span className="text-[9px] font-black text-green-700">
            Operations data live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon={IndianRupee}
          label="Gross revenue"
          value={currency(
            computed.revenue
          )}
          change={
            analytics.revenueChange
              ? `${analytics.revenueChange}%`
              : undefined
          }
          positive={
            Number(
              analytics.revenueChange ||
                0
            ) >= 0
          }
          description="Total order value"
          className="bg-orange-50 text-orange-600"
        />

        <MetricCard
          icon={ShoppingBag}
          label="Orders"
          value={number(
            computed.totalOrders
          )}
          change={
            analytics.orderChange
              ? `${analytics.orderChange}%`
              : undefined
          }
          positive={
            Number(
              analytics.orderChange ||
                0
            ) >= 0
          }
          description="Orders received"
          className="bg-blue-50 text-blue-700"
        />

        <MetricCard
          icon={TrendingUp}
          label="Average order value"
          value={currency(
            computed.aov
          )}
          description="Revenue per order"
          className="bg-green-50 text-green-700"
        />

        <MetricCard
          icon={Users}
          label="Customers"
          value={number(
            computed.customerCount
          )}
          description="Customers in platform"
          className="bg-indigo-50 text-indigo-700"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon={PackageCheck}
          label="Delivery rate"
          value={percent(
            computed.deliveryRate
          )}
          description="Orders delivered"
          className="bg-green-50 text-green-700"
        />

        <MetricCard
          icon={IndianRupee}
          label="Payment success"
          value={percent(
            computed.paymentSuccessRate
          )}
          description="Successful paid orders"
          className="bg-blue-50 text-blue-700"
        />

        <MetricCard
          icon={RotateCcw}
          label="Return rate"
          value={percent(
            computed.returnRate
          )}
          description="Orders with return requests"
          positive={false}
          className="bg-yellow-50 text-yellow-700"
        />

        <MetricCard
          icon={AlertTriangle}
          label="Shipment exceptions"
          value={number(
            computed.exceptions
          )}
          description="Shipments needing attention"
          positive={false}
          className="bg-red-50 text-red-700"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Order funnel
            </p>

            <h2 className="text-sm font-black text-slate-950 mt-1">
              Checkout → Delivery
            </h2>
          </div>

          <div className="p-5 space-y-5">
            {funnel.map(
              (item, index) => (
                <React.Fragment
                  key={item.label}
                >
                  <FunnelStep
                    label={item.label}
                    value={item.value}
                    percentageValue={
                      item.percentage
                    }
                    icon={item.icon}
                    className={
                      item.className
                    }
                  />

                  {index <
                    funnel.length -
                      1 && (
                    <div className="ml-[18px] h-3 border-l border-dashed border-slate-200" />
                  )}
                </React.Fragment>
              )
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Fulfillment
            </p>

            <h2 className="text-sm font-black text-slate-950 mt-1">
              Operations health
            </h2>
          </div>

          <div className="p-5 space-y-6">
            <ProgressRow
              label="Payment success"
              value={
                computed.paymentSuccessRate
              }
              total={100}
              suffix="%"
              className="bg-green-500"
            />

            <ProgressRow
              label="Delivery success"
              value={
                computed.deliveryRate
              }
              total={100}
              suffix="%"
              className="bg-blue-600"
            />

            <ProgressRow
              label="Return-free orders"
              value={
                Math.max(
                  0,
                  100 -
                    computed.returnRate
                )
              }
              total={100}
              suffix="%"
              className="bg-orange-500"
            />

            <ProgressRow
              label="Active shipment load"
              value={
                computed.activeShipments
              }
              total={
                Math.max(
                  1,
                  computed.totalOrders
                )
              }
              className="bg-indigo-500"
            />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <Clock3 className="w-4 h-4 text-orange-600" />

                <p className="text-[9px] uppercase font-black text-slate-400 mt-3">
                  Active shipments
                </p>

                <p className="text-lg font-black text-slate-900 mt-1">
                  {number(
                    computed.activeShipments
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-4">
                <AlertTriangle className="w-4 h-4 text-red-600" />

                <p className="text-[9px] uppercase font-black text-red-700 mt-3">
                  Exceptions
                </p>

                <p className="text-lg font-black text-red-900 mt-1">
                  {number(
                    computed.exceptions
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
                Logistics
              </p>

              <h2 className="text-sm font-black text-slate-950 mt-1">
                Carrier performance
              </h2>
            </div>

            <Truck className="w-5 h-5 text-blue-700" />
          </div>

          {carrierData.length === 0 ? (
            <div className="p-10 text-center">
              <Truck className="w-8 h-8 text-slate-300 mx-auto" />

              <p className="text-xs font-black text-slate-600 mt-3">
                Carrier analytics will appear here
              </p>

              <p className="text-[9px] text-slate-400 mt-1">
                Connect shipment data to calculate live
                performance.
              </p>
            </div>
          ) : (
            carrierData.map(
              carrier => (
                <CarrierRow
                  key={carrier.name}
                  carrier={carrier}
                />
              )
            )
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
                Network
              </p>

              <h2 className="text-sm font-black text-slate-950 mt-1">
                Warehouse health
              </h2>
            </div>

            <Warehouse className="w-5 h-5 text-orange-600" />
          </div>

          {warehouseData.length === 0 ? (
            <div className="p-10 text-center">
              <Warehouse className="w-8 h-8 text-slate-300 mx-auto" />

              <p className="text-xs font-black text-slate-600 mt-3">
                Warehouse analytics will appear here
              </p>
            </div>
          ) : (
            warehouseData
              .slice(0, 6)
              .map(warehouse => (
                <WarehouseRow
                  key={
                    warehouse.id ||
                    warehouse.name ||
                    warehouse.city
                  }
                  warehouse={
                    warehouse
                  }
                />
              ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
                Merchandising
              </p>

              <h2 className="text-sm font-black text-slate-950 mt-1">
                Top products
              </h2>
            </div>

            <BarChart3 className="w-5 h-5 text-blue-700" />
          </div>

          {topProducts.length === 0 ? (
            <div className="p-10 text-center">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />

              <p className="text-xs font-black text-slate-600 mt-3">
                Product analytics will appear here
              </p>

              <p className="text-[9px] text-slate-400 mt-1">
                Sales data will populate this section after
                backend analytics are connected.
              </p>
            </div>
          ) : (
            <div>
              {topProducts.map(
                (product, index) => (
                  <div
                    key={
                      product.id ||
                      product.name
                    }
                    className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 last:border-0"
                  >
                    <span className="w-6 text-center text-[10px] font-black text-slate-400">
                      #{index + 1}
                    </span>

                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">
                        {product.name}
                      </p>

                      <p className="text-[9px] text-slate-400 mt-1">
                        {number(
                          product.units
                        )}{' '}
                        units sold
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black text-slate-900">
                        {currency(
                          product.revenue
                        )}
                      </p>

                      <p className="text-[8px] text-green-600 font-bold mt-1">
                        revenue
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-6">
          <p className="text-[9px] uppercase tracking-[0.2em] text-orange-400 font-black">
            Executive snapshot
          </p>

          <h2 className="text-lg font-black mt-2">
            D2C platform health
          </h2>

          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-300">
                Delivery performance
              </span>

              <span className="text-xs font-black">
                {percent(
                  computed.deliveryRate
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-300">
                Payment success
              </span>

              <span className="text-xs font-black">
                {percent(
                  computed.paymentSuccessRate
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-300">
                Active shipments
              </span>

              <span className="text-xs font-black">
                {number(
                  computed.activeShipments
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-300">
                Customer base
              </span>

              <span className="text-xs font-black">
                {number(
                  computed.customerCount
                )}
              </span>
            </div>
          </div>

          <div className="mt-7 pt-5 border-t border-white/10">
            <div className="flex items-start gap-3">
              {computed.exceptions ===
              0 ? (
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
              )}

              <div>
                <p className="text-xs font-black">
                  {computed.exceptions ===
                  0
                    ? 'No active shipment exceptions'
                    : `${number(
                        computed.exceptions
                      )} shipment exceptions require attention`}
                </p>

                <p className="text-[9px] text-slate-400 mt-1">
                  Review the shipment operations panel for
                  individual cases.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-[10px] font-black text-orange-400">
            Operations intelligence
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}