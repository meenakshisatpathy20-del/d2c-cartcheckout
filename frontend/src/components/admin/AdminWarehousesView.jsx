import React, { useMemo, useState } from 'react';
import {
  Warehouse,
  Package,
  Truck,
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MapPin,
  Boxes,
  Activity,
  ChevronRight,
  RefreshCw,
  X,
  IndianRupee,
  TrendingUp,
  Navigation
} from 'lucide-react';

function number(value) {
  return new Intl.NumberFormat('en-IN').format(
    Number(value || 0)
  );
}

function currency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function percentage(value) {
  return `${Math.round(Number(value || 0))}%`;
}

function healthStyle(health) {
  if (health === 'CRITICAL') {
    return 'bg-red-50 text-red-700 border-red-100';
  }

  if (health === 'WARNING') {
    return 'bg-yellow-50 text-yellow-700 border-yellow-100';
  }

  return 'bg-green-50 text-green-700 border-green-100';
}

function healthLabel(health) {
  if (health === 'CRITICAL') return 'Critical';
  if (health === 'WARNING') return 'Needs attention';
  return 'Healthy';
}

function getHealth(warehouse) {
  if (warehouse.health) {
    return warehouse.health;
  }

  const capacity = Number(
    warehouse.capacityUsedPercentage || 0
  );

  const delayed = Number(
    warehouse.delayedShipments || 0
  );

  if (capacity >= 90 || delayed >= 10) {
    return 'CRITICAL';
  }

  if (capacity >= 75 || delayed >= 5) {
    return 'WARNING';
  }

  return 'HEALTHY';
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  className
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${className}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <p className="mt-4 text-[9px] uppercase tracking-[0.16em] font-black text-slate-400">
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

function ProgressBar({
  value,
  danger = false
}) {
  const percentageValue = Math.max(
    0,
    Math.min(100, Number(value || 0))
  );

  return (
    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
      <div
        className={`h-full rounded-full ${
          danger
            ? 'bg-red-500'
            : percentageValue >= 80
            ? 'bg-yellow-500'
            : 'bg-green-500'
        }`}
        style={{
          width: `${percentageValue}%`
        }}
      />
    </div>
  );
}

function WarehouseDrawer({
  warehouse,
  onClose
}) {
  if (!warehouse) return null;

  const health = getHealth(warehouse);

  const capacity =
    Number(
      warehouse.capacityUsedPercentage || 0
    );

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close warehouse details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />

      <aside className="absolute right-0 top-0 h-full w-full sm:max-w-xl bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Warehouse operations
            </p>

            <h2 className="text-sm font-black text-slate-950 mt-1">
              {warehouse.name ||
                warehouse.city ||
                'Warehouse'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="rounded-2xl bg-slate-950 text-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] text-orange-400 font-black">
                  Operational health
                </p>

                <span
                  className={`inline-flex mt-2 px-3 py-1.5 rounded-full border text-[10px] font-black ${healthStyle(
                    health
                  )}`}
                >
                  {healthLabel(health)}
                </span>
              </div>

              <Warehouse className="w-7 h-7 text-orange-400" />
            </div>

            <div className="flex items-center gap-2 mt-5 text-slate-300">
              <MapPin className="w-4 h-4" />

              <span className="text-xs font-semibold">
                {warehouse.address ||
                  warehouse.city ||
                  'Location unavailable'}
              </span>
            </div>
          </div>

          {health !== 'HEALTHY' && (
            <div
              className={`rounded-xl border p-4 ${
                health === 'CRITICAL'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex gap-3">
                <AlertTriangle
                  className={`w-4 h-4 mt-0.5 ${
                    health === 'CRITICAL'
                      ? 'text-red-600'
                      : 'text-yellow-700'
                  }`}
                />

                <div>
                  <p className="text-xs font-black">
                    Warehouse requires attention
                  </p>

                  <p className="text-[10px] mt-1 text-slate-600">
                    {warehouse.healthMessage ||
                      'Review capacity, delayed shipments and dispatch workload.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <section>
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Capacity
            </p>

            <div className="mt-3 rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-800">
                  Storage utilization
                </span>

                <span className="text-xs font-black text-slate-900">
                  {percentage(capacity)}
                </span>
              </div>

              <ProgressBar
                value={capacity}
                danger={capacity >= 90}
              />

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[9px] uppercase font-black text-slate-400">
                    Used
                  </p>

                  <p className="text-sm font-black text-slate-900 mt-1">
                    {number(
                      warehouse.capacityUsed
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[9px] uppercase font-black text-slate-400">
                    Total capacity
                  </p>

                  <p className="text-sm font-black text-slate-900 mt-1">
                    {number(
                      warehouse.capacityTotal
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Fulfillment workload
            </p>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="rounded-xl border border-slate-200 p-4">
                <Package className="w-4 h-4 text-blue-700" />

                <p className="text-[9px] uppercase font-black text-slate-400 mt-3">
                  Inventory units
                </p>

                <p className="text-lg font-black text-slate-900 mt-1">
                  {number(
                    warehouse.inventoryUnits
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <ShoppingBag className="w-4 h-4 text-orange-600" />

                <p className="text-[9px] uppercase font-black text-slate-400 mt-3">
                  Pending orders
                </p>

                <p className="text-lg font-black text-slate-900 mt-1">
                  {number(
                    warehouse.pendingOrders
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <Truck className="w-4 h-4 text-indigo-700" />

                <p className="text-[9px] uppercase font-black text-slate-400 mt-3">
                  Active shipments
                </p>

                <p className="text-lg font-black text-slate-900 mt-1">
                  {number(
                    warehouse.activeShipments
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <AlertTriangle className="w-4 h-4 text-red-600" />

                <p className="text-[9px] uppercase font-black text-slate-400 mt-3">
                  Delayed
                </p>

                <p className="text-lg font-black text-slate-900 mt-1">
                  {number(
                    warehouse.delayedShipments
                  )}
                </p>
              </div>
            </div>
          </section>

          <section>
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Dispatch performance
            </p>

            <div className="mt-3 rounded-2xl border border-slate-200 divide-y divide-slate-100">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock3 className="w-4 h-4 text-slate-400" />

                  <div>
                    <p className="text-xs font-black text-slate-800">
                      Same-day dispatch
                    </p>

                    <p className="text-[9px] text-slate-400 mt-1">
                      Orders dispatched within target
                    </p>
                  </div>
                </div>

                <span className="text-sm font-black text-green-700">
                  {percentage(
                    warehouse.sameDayDispatchRate
                  )}
                </span>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-slate-400" />

                  <div>
                    <p className="text-xs font-black text-slate-800">
                      SLA compliance
                    </p>

                    <p className="text-[9px] text-slate-400 mt-1">
                      Shipment handling performance
                    </p>
                  </div>
                </div>

                <span className="text-sm font-black text-blue-700">
                  {percentage(
                    warehouse.slaCompliance
                  )}
                </span>
              </div>
            </div>
          </section>

          <section>
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Warehouse economics
            </p>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                <IndianRupee className="w-4 h-4 text-green-700" />

                <p className="text-[9px] uppercase font-black text-green-700 mt-3">
                  Inventory value
                </p>

                <p className="text-sm font-black text-green-900 mt-1">
                  {currency(
                    warehouse.inventoryValue
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                <TrendingUp className="w-4 h-4 text-blue-700" />

                <p className="text-[9px] uppercase font-black text-blue-700 mt-3">
                  Orders today
                </p>

                <p className="text-sm font-black text-blue-900 mt-1">
                  {number(
                    warehouse.ordersToday
                  )}
                </p>
              </div>
            </div>
          </section>

          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <div className="flex gap-3">
              <Navigation className="w-4 h-4 text-blue-700 mt-0.5" />

              <div>
                <p className="text-xs font-black text-slate-800">
                  Delivery coverage
                </p>

                <p className="text-[10px] text-slate-500 mt-1">
                  Primary service regions:{' '}
                  {warehouse.serviceRegions?.join(
                    ', '
                  ) ||
                    warehouse.serviceArea ||
                    'India-wide routing'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function AdminWarehousesView({
  warehouses = [],
  loading = false,
  onRefresh
}) {
  const [selectedWarehouse, setSelectedWarehouse] =
    useState(null);

  const [healthFilter, setHealthFilter] =
    useState('ALL');

  const filteredWarehouses = useMemo(() => {
    if (healthFilter === 'ALL') {
      return warehouses;
    }

    return warehouses.filter(
      warehouse =>
        getHealth(warehouse) === healthFilter
    );
  }, [warehouses, healthFilter]);

  const metrics = useMemo(() => {
    return warehouses.reduce(
      (result, warehouse) => {
        result.total += 1;

        const health =
          getHealth(warehouse);

        if (health === 'HEALTHY') {
          result.healthy += 1;
        }

        if (health === 'WARNING') {
          result.warning += 1;
        }

        if (health === 'CRITICAL') {
          result.critical += 1;
        }

        result.inventory += Number(
          warehouse.inventoryUnits || 0
        );

        result.pending += Number(
          warehouse.pendingOrders || 0
        );

        result.delayed += Number(
          warehouse.delayedShipments || 0
        );

        return result;
      },
      {
        total: 0,
        healthy: 0,
        warning: 0,
        critical: 0,
        inventory: 0,
        pending: 0,
        delayed: 0
      }
    );
  }, [warehouses]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] font-black text-orange-600">
              India fulfillment network
            </p>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
              Warehouses
            </h1>

            <p className="text-xs text-slate-500 mt-2">
              Monitor warehouse capacity, inventory,
              fulfillment workload and dispatch health.
            </p>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-black hover:bg-blue-900 transition disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                loading
                  ? 'animate-spin'
                  : ''
              }`}
            />

            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <MetricCard
            icon={Warehouse}
            label="Warehouses"
            value={metrics.total}
            description="Active fulfillment locations"
            className="bg-blue-50 text-blue-700"
          />

          <MetricCard
            icon={CheckCircle2}
            label="Healthy"
            value={metrics.healthy}
            description="Operating normally"
            className="bg-green-50 text-green-700"
          />

          <MetricCard
            icon={AlertTriangle}
            label="Attention"
            value={
              metrics.warning +
              metrics.critical
            }
            description="Need operational review"
            className="bg-yellow-50 text-yellow-700"
          />

          <MetricCard
            icon={Boxes}
            label="Inventory units"
            value={number(
              metrics.inventory
            )}
            description="Across network"
            className="bg-orange-50 text-orange-600"
          />

          <MetricCard
            icon={Truck}
            label="Delayed shipments"
            value={number(
              metrics.delayed
            )}
            description="Currently delayed"
            className="bg-red-50 text-red-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            ['ALL', 'All warehouses'],
            ['HEALTHY', 'Healthy'],
            ['WARNING', 'Needs attention'],
            ['CRITICAL', 'Critical']
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setHealthFilter(value)
              }
              className={`px-3 py-2 rounded-xl text-[10px] font-black border transition ${
                healthFilter === value
                  ? 'bg-slate-950 text-white border-slate-950'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-blue-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(
              item => (
                <div
                  key={item}
                  className="h-72 rounded-2xl bg-slate-100 animate-pulse"
                />
              )
            )}
          </div>
        ) : filteredWarehouses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-14 text-center">
            <Warehouse className="w-9 h-9 text-slate-300 mx-auto" />

            <p className="text-sm font-black text-slate-600 mt-3">
              No warehouses found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredWarehouses.map(
              warehouse => {
                const health =
                  getHealth(warehouse);

                const capacity =
                  Number(
                    warehouse.capacityUsedPercentage ||
                      0
                  );

                return (
                  <button
                    key={
                      warehouse.id ||
                      warehouse.name ||
                      warehouse.city
                    }
                    type="button"
                    onClick={() =>
                      setSelectedWarehouse(
                        warehouse
                      )
                    }
                    className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                          <Warehouse className="w-5 h-5" />
                        </div>

                        <div>
                          <h3 className="text-sm font-black text-slate-950">
                            {warehouse.name ||
                              warehouse.city ||
                              'Warehouse'}
                          </h3>

                          <div className="flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3 h-3 text-slate-400" />

                            <span className="text-[10px] text-slate-500 font-semibold">
                              {warehouse.city ||
                                warehouse.address ||
                                'India'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full border text-[9px] font-black whitespace-nowrap ${healthStyle(
                          health
                        )}`}
                      >
                        {healthLabel(health)}
                      </span>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] uppercase tracking-wider font-black text-slate-400">
                          Capacity
                        </span>

                        <span className="text-[10px] font-black text-slate-700">
                          {percentage(capacity)}
                        </span>
                      </div>

                      <ProgressBar
                        value={capacity}
                        danger={
                          capacity >= 90
                        }
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-5">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <Package className="w-3.5 h-3.5 text-blue-700" />

                        <p className="text-[8px] uppercase font-black text-slate-400 mt-2">
                          Inventory
                        </p>

                        <p className="text-xs font-black text-slate-900 mt-1">
                          {number(
                            warehouse.inventoryUnits
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <ShoppingBag className="w-3.5 h-3.5 text-orange-600" />

                        <p className="text-[8px] uppercase font-black text-slate-400 mt-2">
                          Pending
                        </p>

                        <p className="text-xs font-black text-slate-900 mt-1">
                          {number(
                            warehouse.pendingOrders
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <Truck className="w-3.5 h-3.5 text-indigo-700" />

                        <p className="text-[8px] uppercase font-black text-slate-400 mt-2">
                          Shipments
                        </p>

                        <p className="text-xs font-black text-slate-900 mt-1">
                          {number(
                            warehouse.activeShipments
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        {health ===
                        'HEALTHY' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                        )}

                        <span className="text-[9px] font-bold text-slate-500">
                          SLA{' '}
                          {percentage(
                            warehouse.slaCompliance
                          )}
                        </span>
                      </div>

                      <span className="flex items-center gap-1 text-[10px] font-black text-blue-700">
                        View operations
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        )}

        <div className="rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950 text-white p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-orange-400 font-black">
                Network operations
              </p>

              <h2 className="text-lg font-black mt-1">
                Centralized fulfillment control
              </h2>

              <p className="text-[10px] text-slate-300 mt-2 max-w-xl leading-relaxed">
                Orders, inventory and shipments will
                eventually be routed dynamically based on
                stock availability, customer pincode,
                carrier SLA and warehouse capacity.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-400/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-orange-400" />
              </div>

              <div>
                <p className="text-[9px] uppercase font-black text-slate-400">
                  Network pending
                </p>

                <p className="text-sm font-black">
                  {number(
                    metrics.pending
                  )}{' '}
                  orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WarehouseDrawer
        warehouse={selectedWarehouse}
        onClose={() =>
          setSelectedWarehouse(null)
        }
      />
    </>
  );
}