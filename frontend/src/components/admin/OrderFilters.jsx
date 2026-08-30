import React from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  CalendarDays,
  ArrowDownUp
} from 'lucide-react';

const statuses = [
  'ALL',
  'CONFIRMED',
  'PROCESSING',
  'PACKED',
  'SHIPPED',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED'
];

const paymentStatuses = [
  'ALL',
  'PAID',
  'PENDING',
  'FAILED',
  'REFUNDED'
];

const warehouses = [
  'ALL',
  'Mumbai',
  'Delhi',
  'Jaipur',
  'Bengaluru'
];

const carriers = [
  'ALL',
  'Delhivery',
  'Blue Dart',
  'Shiprocket'
];

const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'highest_value', label: 'Highest value' },
  { value: 'lowest_value', label: 'Lowest value' },
  { value: 'customer', label: 'Customer name' }
];

export default function OrderFilters({
  filters,
  onChange,
  onReset,
  total = 0
}) {
  const update = (key, value) => {
    onChange({
      ...filters,
      [key]: value,
      page: 1
    });
  };

  const hasFilters =
    filters.search ||
    filters.status !== 'ALL' ||
    filters.paymentStatus !== 'ALL' ||
    filters.warehouse !== 'ALL' ||
    filters.carrier !== 'ALL' ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="p-4 border-b border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-orange-500" />

              <h2 className="text-sm font-black text-slate-950">
                Order Management
              </h2>
            </div>

            <p className="text-[10px] text-slate-500 mt-1">
              Search, filter and manage customer orders
            </p>
          </div>

          <div className="text-[10px] font-black text-slate-500">
            {total.toLocaleString('en-IN')} total orders
          </div>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            placeholder="Search order ID, customer, phone, product, SKU, AWB..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
          />

          {filters.search && (
            <button
              onClick={() => update('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-wide text-slate-400 mb-1.5">
              Order Status
            </label>

            <select
              value={filters.status}
              onChange={(e) => update('status', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-600"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-wide text-slate-400 mb-1.5">
              Payment
            </label>

            <select
              value={filters.paymentStatus}
              onChange={(e) =>
                update('paymentStatus', e.target.value)
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-600"
            >
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-wide text-slate-400 mb-1.5">
              Warehouse
            </label>

            <select
              value={filters.warehouse}
              onChange={(e) =>
                update('warehouse', e.target.value)
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-600"
            >
              {warehouses.map((warehouse) => (
                <option key={warehouse} value={warehouse}>
                  {warehouse === 'ALL'
                    ? 'All Warehouses'
                    : warehouse}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-wide text-slate-400 mb-1.5">
              Carrier
            </label>

            <select
              value={filters.carrier}
              onChange={(e) =>
                update('carrier', e.target.value)
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-600"
            >
              {carriers.map((carrier) => (
                <option key={carrier} value={carrier}>
                  {carrier === 'ALL'
                    ? 'All Carriers'
                    : carrier}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wide text-slate-400 mb-1.5">
              <CalendarDays className="w-3 h-3" />
              From
            </label>

            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                update('dateFrom', e.target.value)
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wide text-slate-400 mb-1.5">
              <CalendarDays className="w-3 h-3" />
              To
            </label>

            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                update('dateTo', e.target.value)
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <ArrowDownUp className="w-3.5 h-3.5 text-blue-600" />

            <span className="text-[10px] font-black text-slate-500">
              Sort by
            </span>

            <select
              value={filters.sort}
              onChange={(e) =>
                update('sort', e.target.value)
              }
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-slate-700 outline-none"
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-[10px] font-black text-red-600 hover:text-red-700"
            >
              <X className="w-3.5 h-3.5" />
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}