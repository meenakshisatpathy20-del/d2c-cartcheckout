import React, { useMemo, useState } from 'react';
import {
  Search,
  Users,
  ShoppingBag,
  IndianRupee,
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  X,
  ChevronRight,
  UserRound,
  Package,
  CalendarDays,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

function currency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function date(value) {
  if (!value) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
}

function statusClass(status) {
  const styles = {
    CONFIRMED:
      'bg-blue-50 text-blue-700 border-blue-100',
    PROCESSING:
      'bg-yellow-50 text-yellow-700 border-yellow-100',
    PACKED:
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

  return (
    styles[status] ||
    'bg-slate-50 text-slate-600 border-slate-100'
  );
}

function Metric({
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

function CustomerDrawer({
  customer,
  orders,
  onClose,
  onViewOrder
}) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close customer details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />

      <aside className="absolute right-0 top-0 h-full w-full sm:max-w-xl bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
                Customer profile
              </p>

              <h2 className="text-sm font-black text-slate-950 mt-0.5">
                Customer Details
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="rounded-2xl bg-slate-950 text-white p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-400 text-slate-950 flex items-center justify-center">
                <UserRound className="w-7 h-7" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black truncate">
                  {customer.name || 'Customer'}
                </h3>

                <p className="text-[10px] text-slate-400 mt-1">
                  {customer.customerId || '—'}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] font-black text-green-400">
                    ACTIVE CUSTOMER
                  </span>

                  {customer.returnCount > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[9px] font-black text-orange-400">
                      {customer.returnCount} RETURN
                      {customer.returnCount > 1
                        ? 'S'
                        : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-lg font-black">
                  {customer.orderCount || 0}
                </p>
                <p className="text-[9px] text-slate-400">
                  Orders
                </p>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-sm font-black">
                  {currency(
                    customer.lifetimeSpend
                  )}
                </p>
                <p className="text-[9px] text-slate-400">
                  Lifetime spend
                </p>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-sm font-black">
                  {currency(
                    customer.averageOrderValue
                  )}
                </p>
                <p className="text-[9px] text-slate-400">
                  Avg. order
                </p>
              </div>
            </div>
          </div>

          <section>
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Contact information
            </p>

            <div className="mt-3 rounded-2xl border border-slate-200 divide-y divide-slate-100">
              <div className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-700" />
                </div>

                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-black">
                    Phone
                  </p>

                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {customer.phone || 'Not available'}
                  </p>
                </div>
              </div>

              <div className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-orange-600" />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] text-slate-400 uppercase font-black">
                    Email
                  </p>

                  <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">
                    {customer.email || 'Not available'}
                  </p>
                </div>
              </div>

              <div className="p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-green-700" />
                </div>

                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-black">
                    Delivery address
                  </p>

                  <p className="text-xs font-bold text-slate-800 mt-0.5 leading-relaxed">
                    {customer.address || 'Address not available'}
                    {customer.city
                      ? `, ${customer.city}`
                      : ''}
                    {customer.state
                      ? `, ${customer.state}`
                      : ''}
                    {customer.pincode
                      ? ` - ${customer.pincode}`
                      : ''}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
                  Purchase history
                </p>

                <h3 className="text-sm font-black text-slate-950 mt-1">
                  Customer orders
                </h3>
              </div>

              <span className="text-[10px] font-black text-slate-400">
                {orders.length} total
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {orders.length === 0 ? (
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-8 text-center">
                  <ShoppingBag className="w-7 h-7 text-slate-300 mx-auto" />

                  <p className="text-xs font-black text-slate-500 mt-2">
                    No orders found
                  </p>
                </div>
              ) : (
                orders.map(order => (
                  <button
                    key={order.orderId}
                    type="button"
                    onClick={() =>
                      onViewOrder?.(order)
                    }
                    className="w-full text-left rounded-xl border border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black text-blue-700">
                          {order.orderId}
                        </p>

                        <p className="text-[9px] text-slate-400 mt-1">
                          {date(order.placedAt)}
                        </p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-4">
                      <span
                        className={`px-2.5 py-1 rounded-full border text-[9px] font-black ${statusClass(
                          order.status
                        )}`}
                      >
                        {String(
                          order.status || 'UNKNOWN'
                        ).replaceAll('_', ' ')}
                      </span>

                      <span className="text-xs font-black text-slate-900">
                        {currency(
                          order.summary?.totalPaid
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-[9px] text-slate-500">
                      <Package className="w-3.5 h-3.5" />

                      {order.fulfillments?.length ||
                        0}{' '}
                      shipment
                      {(order.fulfillments?.length ||
                        0) !== 1
                        ? 's'
                        : ''}
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>

          <div className="rounded-xl bg-yellow-50 border border-yellow-100 p-4">
            <div className="flex gap-3">
              <CalendarDays className="w-4 h-4 text-yellow-700 mt-0.5" />

              <div>
                <p className="text-xs font-black text-yellow-900">
                  Last order
                </p>

                <p className="text-[10px] text-yellow-700 mt-1">
                  {customer.lastOrderAt
                    ? date(customer.lastOrderAt)
                    : 'No previous order'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function AdminCustomersView({
  customers = [],
  loading = false,
  onRefresh,
  onViewOrder
}) {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const filteredCustomers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) return customers;

    return customers.filter(customer =>
      [
        customer.customerId,
        customer.name,
        customer.phone,
        customer.email,
        customer.city,
        customer.state,
        customer.pincode
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [customers, search]);

  const totalSpend = useMemo(
    () =>
      customers.reduce(
        (sum, customer) =>
          sum +
          Number(
            customer.lifetimeSpend || 0
          ),
        0
      ),
    [customers]
  );

  const totalOrders = useMemo(
    () =>
      customers.reduce(
        (sum, customer) =>
          sum +
          Number(
            customer.orderCount || 0
          ),
        0
      ),
    [customers]
  );

  const totalReturns = useMemo(
    () =>
      customers.reduce(
        (sum, customer) =>
          sum +
          Number(
            customer.returnCount || 0
          ),
        0
      ),
    [customers]
  );

  const customerOrders =
    selectedCustomer?.orders || [];

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] font-black text-orange-600">
              Customer intelligence
            </p>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
              Customers
            </h1>

            <p className="text-xs text-slate-500 mt-2">
              Understand customer value, purchase history,
              contact information and returns.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Metric
            icon={Users}
            label="Customers"
            value={customers.length}
            description="Unique customers"
            className="bg-blue-50 text-blue-700"
          />

          <Metric
            icon={ShoppingBag}
            label="Orders"
            value={totalOrders}
            description="Orders across customers"
            className="bg-orange-50 text-orange-600"
          />

          <Metric
            icon={IndianRupee}
            label="Lifetime GMV"
            value={currency(totalSpend)}
            description="Customer purchase value"
            className="bg-green-50 text-green-700"
          />

          <Metric
            icon={RotateCcw}
            label="Returns"
            value={totalReturns}
            description="Return requests"
            className="bg-yellow-50 text-yellow-700"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={e =>
                setSearch(e.target.value)
              }
              placeholder="Search name, phone, email, city or customer ID..."
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-[10px] text-slate-500">
              Showing{' '}
              <span className="font-black text-slate-800">
                {filteredCustomers.length}
              </span>{' '}
              customers
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-[10px] font-black text-orange-600 hover:text-orange-700"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3, 4, 5, 6].map(
                item => (
                  <div
                    key={item}
                    className="h-16 rounded-xl bg-slate-100 animate-pulse"
                  />
                )
              )}
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-14 text-center">
              <Users className="w-9 h-9 text-slate-300 mx-auto" />

              <p className="text-sm font-black text-slate-600 mt-3">
                No customers found
              </p>

              <p className="text-[10px] text-slate-400 mt-1">
                Try a different name, phone, email or
                customer ID.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Contact
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Location
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Orders
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Lifetime spend
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Last order
                    </th>

                    <th className="px-5 py-3" />
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map(
                    customer => (
                      <tr
                        key={
                          customer.customerId ||
                          customer.email ||
                          customer.phone
                        }
                        onClick={() =>
                          setSelectedCustomer(
                            customer
                          )
                        }
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                              <UserRound className="w-4 h-4" />
                            </div>

                            <div>
                              <p className="text-xs font-black text-slate-900">
                                {customer.name ||
                                  'Customer'}
                              </p>

                              <p className="text-[9px] text-slate-400 mt-0.5">
                                {customer.customerId ||
                                  '—'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-[10px] font-bold text-slate-700">
                            {customer.phone ||
                              '—'}
                          </p>

                          <p className="text-[9px] text-slate-400 mt-1">
                            {customer.email ||
                              '—'}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-slate-400" />

                            <span className="text-[10px] font-semibold text-slate-600">
                              {customer.city ||
                                '—'}
                              {customer.pincode
                                ? ` • ${customer.pincode}`
                                : ''}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[9px] font-black text-blue-700">
                            <ShoppingBag className="w-3 h-3" />
                            {customer.orderCount ||
                              0}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-xs font-black text-slate-900">
                            {currency(
                              customer.lifetimeSpend
                            )}
                          </p>

                          <p className="text-[9px] text-slate-400 mt-1">
                            Avg.{' '}
                            {currency(
                              customer.averageOrderValue
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-[10px] font-semibold text-slate-600">
                            {date(
                              customer.lastOrderAt
                            )}
                          </p>

                          {customer.returnCount >
                            0 && (
                            <p className="text-[9px] text-orange-600 font-bold mt-1">
                              {customer.returnCount}{' '}
                              return
                              {customer.returnCount >
                              1
                                ? 's'
                                : ''}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <ChevronRight className="w-4 h-4 text-slate-300" />
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

      <CustomerDrawer
        customer={selectedCustomer}
        orders={customerOrders}
        onClose={() =>
          setSelectedCustomer(null)
        }
        onViewOrder={onViewOrder}
      />
    </>
  );
}