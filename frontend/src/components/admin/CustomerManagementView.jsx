import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Download,
  Users,
  UserRound,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  IndianRupee,
  RotateCcw,
  ChevronRight,
  X,
  CalendarDays,
  CreditCard,
  Package,
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Crown,
  TrendingUp,
  Clock3,
} from "lucide-react";

const DEFAULT_FILTERS = {
  search: "",
  segment: "ALL",
  city: "ALL",
  sort: "recent",
  page: 1,
  limit: 15,
};

const FALLBACK_CUSTOMERS = [
  {
    id: "CUS-1001",
    name: "Meenakshi",
    email: "meenakshi@example.com",
    phone: "+91 98765 43210",
    city: "Ranchi",
    state: "Jharkhand",
    pincode: "835215",
    createdAt: "2026-08-18T10:30:00.000Z",
    totalOrders: 8,
    totalSpent: 18490,
    returnedOrders: 1,
    lastOrderAt: "2026-08-31T15:30:00.000Z",
    status: "ACTIVE",
  },
  {
    id: "CUS-1002",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "+91 98111 22334",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    createdAt: "2026-07-11T10:30:00.000Z",
    totalOrders: 12,
    totalSpent: 32890,
    returnedOrders: 0,
    lastOrderAt: "2026-08-29T12:10:00.000Z",
    status: "ACTIVE",
  },
  {
    id: "CUS-1003",
    name: "Riya Kapoor",
    email: "riya@example.com",
    phone: "+91 98989 11223",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    createdAt: "2026-05-20T10:30:00.000Z",
    totalOrders: 4,
    totalSpent: 9240,
    returnedOrders: 1,
    lastOrderAt: "2026-08-20T12:10:00.000Z",
    status: "ACTIVE",
  },
];

export default function CustomerManagementView({
  api,
}) {
  const [customers, setCustomers] = useState([]);

  const [orders, setOrders] = useState([]);

  const [filters, setFilters] =
    useState(DEFAULT_FILTERS);

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 15,
      total: 0,
      totalPages: 1,
    });

  const loadCustomers = useCallback(
    async () => {
      setLoading(true);
      setError("");

      try {
        const params =
          new URLSearchParams();

        Object.entries(filters).forEach(
          ([key, value]) => {
            if (
              value !== "" &&
              value !== null &&
              value !== undefined
            ) {
              params.set(key, value);
            }
          }
        );

        let customerResponse = null;
        let orderResponse = null;

        if (api?.getAdminCustomers) {
          customerResponse =
            await api.getAdminCustomers(
              params.toString()
            );
        }

        if (api?.getAdminOrders) {
          orderResponse =
            await api.getAdminOrders(
              "limit=200"
            );
        }

        const customerList =
          customerResponse?.customers ||
          FALLBACK_CUSTOMERS;

        setCustomers(customerList);

        setOrders(
          orderResponse?.orders || []
        );

        if (customerResponse) {
          setPagination({
            page:
              customerResponse.page ||
              1,
            limit:
              customerResponse.limit ||
              15,
            total:
              customerResponse.total ||
              customerList.length,
            totalPages:
              customerResponse.totalPages ||
              1,
          });
        } else {
          setPagination({
            page: 1,
            limit: 15,
            total: customerList.length,
            totalPages: 1,
          });
        }
      } catch (err) {
        setError(
          err?.message ||
            "Unable to load customer data."
        );

        setCustomers(
          FALLBACK_CUSTOMERS
        );
      } finally {
        setLoading(false);
      }
    },
    [api, filters]
  );

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const metrics = useMemo(() => {
    const totalCustomers =
      customers.length;

    const totalRevenue =
      customers.reduce(
        (sum, customer) =>
          sum +
          Number(
            customer.totalSpent || 0
          ),
        0
      );

    const totalOrders =
      customers.reduce(
        (sum, customer) =>
          sum +
          Number(
            customer.totalOrders || 0
          ),
        0
      );

    const repeatCustomers =
      customers.filter(
        (customer) =>
          Number(
            customer.totalOrders || 0
          ) > 1
      ).length;

    const returns =
      customers.reduce(
        (sum, customer) =>
          sum +
          Number(
            customer.returnedOrders ||
              0
          ),
        0
      );

    return {
      totalCustomers,
      totalRevenue,
      totalOrders,
      repeatCustomers,
      returns,
    };
  }, [customers]);

  const enrichedCustomers =
    useMemo(() => {
      return customers.map(
        (customer) => {
          const customerOrders =
            orders.filter(
              (order) =>
                matchesCustomer(
                  order,
                  customer
                )
            );

          const derivedOrders =
            customerOrders.length;

          const derivedSpend =
            customerOrders.reduce(
              (sum, order) =>
                sum +
                Number(
                  order.summary
                    ?.totalPaid || 0
                ),
              0
            );

          return {
            ...customer,
            totalOrders:
              Number(
                customer.totalOrders
              ) ||
              derivedOrders,

            totalSpent:
              Number(
                customer.totalSpent
              ) ||
              derivedSpend,

            orders:
              customerOrders,
          };
        }
      );
    }, [customers, orders]);

  const exportCustomers = () => {
    if (!enrichedCustomers.length) {
      return;
    }

    const headers = [
      "Customer ID",
      "Name",
      "Email",
      "Phone",
      "City",
      "State",
      "Pincode",
      "Orders",
      "Total Spent",
      "Returns",
      "Last Order",
      "Status",
    ];

    const rows =
      enrichedCustomers.map(
        (customer) => [
          customer.id || "",
          customer.name || "",
          customer.email || "",
          customer.phone || "",
          customer.city || "",
          customer.state || "",
          customer.pincode || "",
          customer.totalOrders || 0,
          customer.totalSpent || 0,
          customer.returnedOrders || 0,
          customer.lastOrderAt || "",
          customer.status || "ACTIVE",
        ]
      );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value
              ).replaceAll(
                '"',
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;

    anchor.download =
      `d2c-customers-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    anchor.click();

    URL.revokeObjectURL(url);
  };

  const updateFilter = (
    key,
    value
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page:
        key === "page"
          ? value
          : 1,
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] font-black text-orange-600">
                Customer Intelligence
              </p>

              <h1 className="text-2xl font-black text-slate-950">
                Customers
              </h1>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Understand every customer from
            first checkout to repeat purchase,
            return and lifetime value.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadCustomers}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              className={
                loading
                  ? "w-3.5 h-3.5 animate-spin"
                  : "w-3.5 h-3.5"
              }
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={exportCustomers}
            disabled={
              !enrichedCustomers.length
            }
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* CUSTOMER KPI */}

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <CustomerKpi
          icon={Users}
          label="Customers"
          value={
            metrics.totalCustomers
          }
          tone="blue"
        />

        <CustomerKpi
          icon={IndianRupee}
          label="Customer Revenue"
          value={formatCurrency(
            metrics.totalRevenue
          )}
          tone="orange"
        />

        <CustomerKpi
          icon={ShoppingBag}
          label="Orders"
          value={
            metrics.totalOrders
          }
          tone="green"
        />

        <CustomerKpi
          icon={Crown}
          label="Repeat Buyers"
          value={
            metrics.repeatCustomers
          }
          tone="yellow"
        />

        <CustomerKpi
          icon={RotateCcw}
          label="Returns"
          value={metrics.returns}
          tone="red"
        />
      </div>

      {/* ERROR */}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-yellow-700 mt-0.5" />

          <div>
            <p className="text-xs font-black text-yellow-900">
              Customer data warning
            </p>

            <p className="text-[9px] text-yellow-800 mt-1">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* FILTERS */}

      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              value={filters.search}
              onChange={(event) =>
                updateFilter(
                  "search",
                  event.target.value
                )
              }
              placeholder="Search name, phone, email, ID..."
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            />
          </div>

          <select
            value={filters.segment}
            onChange={(event) =>
              updateFilter(
                "segment",
                event.target.value
              )
            }
            className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-bold outline-none"
          >
            <option value="ALL">
              All Customers
            </option>
            <option value="NEW">
              New Customers
            </option>
            <option value="REPEAT">
              Repeat Buyers
            </option>
            <option value="VIP">
              VIP Customers
            </option>
            <option value="AT_RISK">
              At Risk
            </option>
          </select>

          <select
            value={filters.city}
            onChange={(event) =>
              updateFilter(
                "city",
                event.target.value
              )
            }
            className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-bold outline-none"
          >
            <option value="ALL">
              All Cities
            </option>
            <option value="Mumbai">
              Mumbai
            </option>
            <option value="Delhi">
              Delhi
            </option>
            <option value="Bengaluru">
              Bengaluru
            </option>
            <option value="Ranchi">
              Ranchi
            </option>
            <option value="Jaipur">
              Jaipur
            </option>
          </select>

          <select
            value={filters.sort}
            onChange={(event) =>
              updateFilter(
                "sort",
                event.target.value
              )
            }
            className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-bold outline-none"
          >
            <option value="recent">
              Recently Active
            </option>
            <option value="spend_high">
              Highest Spend
            </option>
            <option value="orders_high">
              Most Orders
            </option>
            <option value="oldest">
              Oldest Customer
            </option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="h-10 px-4 rounded-xl bg-orange-50 text-orange-700 text-xs font-black hover:bg-orange-100"
          >
            Reset
          </button>
        </div>
      </div>

      {/* CUSTOMER TABLE */}

      {loading ? (
        <CustomerTableSkeleton />
      ) : (
        <CustomerTable
          customers={enrichedCustomers}
          onSelect={setSelectedCustomer}
        />
      )}

      {/* PAGINATION */}

      {!loading &&
        pagination.totalPages > 1 && (
          <CustomerPagination
            page={pagination.page}
            totalPages={
              pagination.totalPages
            }
            total={pagination.total}
            onPageChange={(page) =>
              updateFilter(
                "page",
                page
              )
            }
          />
        )}

      {/* CUSTOMER DRAWER */}

      {selectedCustomer && (
        <CustomerDrawer
          customer={
            selectedCustomer
          }
          api={api}
          onClose={() =>
            setSelectedCustomer(
              null
            )
          }
        />
      )}
    </div>
  );
}

/* ============================================================
   KPI
============================================================ */

function CustomerKpi({
  icon: Icon,
  label,
  value,
  tone,
}) {
  const styles = {
    blue:
      "bg-blue-50 text-blue-800",
    orange:
      "bg-orange-50 text-orange-700",
    green:
      "bg-green-50 text-green-700",
    yellow:
      "bg-yellow-50 text-yellow-700",
    red:
      "bg-red-50 text-red-700",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${styles[tone]}`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <p className="text-[8px] uppercase tracking-[0.1em] font-black text-slate-400 mt-4">
        {label}
      </p>

      <p className="text-lg font-black text-slate-950 mt-1">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   TABLE
============================================================ */

function CustomerTable({
  customers,
  onSelect,
}) {
  if (!customers.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center">
        <Users className="w-10 h-10 mx-auto text-slate-300" />

        <p className="text-sm font-black text-slate-600 mt-4">
          No customers found
        </p>

        <p className="text-xs text-slate-400 mt-1">
          Try changing your search or
          filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <TableHeading>
                Customer
              </TableHeading>

              <TableHeading>
                Contact
              </TableHeading>

              <TableHeading>
                Location
              </TableHeading>

              <TableHeading>
                Orders
              </TableHeading>

              <TableHeading>
                Lifetime Value
              </TableHeading>

              <TableHeading>
                Activity
              </TableHeading>

              <TableHeading>
                Segment
              </TableHeading>

              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {customers.map(
              (
                customer,
                index
              ) => (
                <CustomerRow
                  key={
                    customer.id ||
                    index
                  }
                  customer={
                    customer
                  }
                  onSelect={
                    onSelect
                  }
                />
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomerRow({
  customer,
  onSelect,
}) {
  const orders =
    Number(
      customer.totalOrders || 0
    );

  const spend =
    Number(
      customer.totalSpent || 0
    );

  const segment =
    getCustomerSegment(
      customer
    );

  return (
    <tr
      onClick={() =>
        onSelect(customer)
      }
      className="border-b border-slate-100 last:border-0 hover:bg-orange-50/30 cursor-pointer transition"
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar
            name={
              customer.name
            }
          />

          <div>
            <p className="text-[10px] font-black text-slate-900">
              {customer.name ||
                "Customer"}
            </p>

            <p className="text-[8px] text-slate-400 mt-1">
              {customer.id ||
                "Customer ID"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <p className="text-[9px] font-bold text-slate-700">
          {customer.phone ||
            "No phone"}
        </p>

        <p className="text-[8px] text-slate-400 mt-1">
          {customer.email ||
            "No email"}
        </p>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-orange-500" />

          <p className="text-[9px] font-bold">
            {customer.city ||
              "—"}
          </p>
        </div>

        <p className="text-[7px] text-slate-400 mt-1">
          {customer.state ||
            ""}{" "}
          {customer.pincode ||
            ""}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-sm font-black">
          {orders}
        </p>

        {orders > 1 && (
          <span className="text-[7px] text-green-700 font-black">
            Repeat
          </span>
        )}
      </td>

      <td className="px-4 py-4">
        <p className="text-xs font-black text-slate-950">
          {formatCurrency(
            spend
          )}
        </p>

        {orders > 0 && (
          <p className="text-[7px] text-slate-400 mt-1">
            Avg{" "}
            {formatCurrency(
              Math.round(
                spend /
                  orders
              )
            )}
          </p>
        )}
      </td>

      <td className="px-4 py-4">
        <p className="text-[8px] font-bold text-slate-600">
          {formatDate(
            customer.lastOrderAt
          )}
        </p>
      </td>

      <td className="px-4 py-4">
        <CustomerSegmentBadge
          segment={segment}
        />
      </td>

      <td className="px-4 py-4">
        <ChevronRight className="w-4 h-4 text-slate-300" />
      </td>
    </tr>
  );
}

/* ============================================================
   DRAWER
============================================================ */

function CustomerDrawer({
  customer,
  api,
  onClose,
}) {
  const [details, setDetails] =
    useState(customer);

  const [loading, setLoading] =
    useState(false);

  const [orders, setOrders] =
    useState(
      customer.orders || []
    );

  useEffect(() => {
    const loadDetails =
      async () => {
        if (
          !api?.getAdminCustomer
        ) {
          return;
        }

        try {
          setLoading(true);

          const response =
            await api.getAdminCustomer(
              customer.id
            );

          if (response?.customer) {
            setDetails(
              response.customer
            );
          }

          if (
            response?.orders
          ) {
            setOrders(
              response.orders
            );
          }
        } catch (error) {
          console.error(
            "Customer details failed:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    loadDetails();
  }, [api, customer.id]);

  const totalSpent =
    Number(
      details.totalSpent || 0
    );

  const totalOrders =
    Number(
      details.totalOrders || 0
    );

  const averageOrderValue =
    totalOrders
      ? Math.round(
          totalSpent /
            totalOrders
        )
      : 0;

  const returnedOrders =
    Number(
      details.returnedOrders ||
        0
    );

  const segment =
    getCustomerSegment(
      details
    );

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close customer drawer"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl overflow-y-auto">
        {/* DRAWER HEADER */}

        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar
                name={
                  details.name
                }
                large
              />

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black">
                    {details.name ||
                      "Customer"}
                  </h2>

                  <CustomerSegmentBadge
                    segment={segment}
                  />
                </div>

                <p className="text-[8px] text-slate-400 mt-1">
                  {details.id ||
                    "Customer"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* CUSTOMER SUMMARY */}

          <div className="rounded-2xl bg-blue-950 text-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] uppercase tracking-[0.14em] text-orange-300 font-black">
                  Lifetime Value
                </p>

                <p className="text-3xl font-black mt-1">
                  {formatCurrency(
                    totalSpent
                  )}
                </p>
              </div>

              <Crown className="w-7 h-7 text-yellow-300" />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
              <DarkCustomerStat
                label="Orders"
                value={
                  totalOrders
                }
              />

              <DarkCustomerStat
                label="Avg Order"
                value={formatCurrency(
                  averageOrderValue
                )}
              />

              <DarkCustomerStat
                label="Returns"
                value={
                  returnedOrders
                }
              />
            </div>
          </div>

          {/* CONTACT */}

          <section>
            <DrawerSectionTitle
              icon={UserRound}
              title="Customer Profile"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              <InfoCard
                icon={Phone}
                label="Phone"
                value={
                  details.phone ||
                  "Not provided"
                }
              />

              <InfoCard
                icon={Mail}
                label="Email"
                value={
                  details.email ||
                  "Not provided"
                }
              />

              <InfoCard
                icon={CalendarDays}
                label="Customer Since"
                value={formatDate(
                  details.createdAt
                )}
              />

              <InfoCard
                icon={Activity}
                label="Last Order"
                value={formatDate(
                  details.lastOrderAt
                )}
              />
            </div>
          </section>

          {/* ADDRESS */}

          <section>
            <DrawerSectionTitle
              icon={MapPin}
              title="Primary Address"
            />

            <div className="bg-slate-50 rounded-xl p-4 mt-3">
              <p className="text-[10px] font-black text-slate-800">
                {details.address ||
                  details.name ||
                  "Customer Address"}
              </p>

              <p className="text-[9px] text-slate-500 mt-2">
                {details.city ||
                  "City"}
                ,{" "}
                {details.state ||
                  "State"}{" "}
                -{" "}
                {details.pincode ||
                  "Pincode"}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-[7px] font-black px-2 py-1 rounded-md bg-green-100 text-green-700">
                  DEFAULT ADDRESS
                </span>

                <span className="text-[7px] font-black px-2 py-1 rounded-md bg-blue-100 text-blue-700">
                  SERVICEABLE
                </span>
              </div>
            </div>
          </section>

          {/* ORDER HISTORY */}

          <section>
            <div className="flex items-center justify-between">
              <DrawerSectionTitle
                icon={ShoppingBag}
                title="Order History"
              />

              <span className="text-[8px] font-black text-slate-400">
                {orders.length} shown
              </span>
            </div>

            <div className="space-y-2 mt-3">
              {loading ? (
                <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
              ) : orders.length ? (
                orders.map(
                  (
                    order,
                    index
                  ) => (
                    <CustomerOrderRow
                      key={
                        order.orderId ||
                        index
                      }
                      order={order}
                    />
                  )
                )
              ) : (
                <div className="border border-dashed border-slate-200 rounded-xl p-7 text-center">
                  <Package className="w-6 h-6 mx-auto text-slate-300" />

                  <p className="text-[9px] text-slate-400 mt-2">
                    No order history
                    available.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* CUSTOMER BEHAVIOUR */}

          <section>
            <DrawerSectionTitle
              icon={TrendingUp}
              title="Customer Behaviour"
            />

            <div className="grid grid-cols-2 gap-2 mt-3">
              <BehaviourCard
                icon={ShoppingBag}
                label="Purchase Frequency"
                value={
                  totalOrders >= 5
                    ? "High"
                    : totalOrders >= 2
                    ? "Medium"
                    : "New"
                }
                tone="blue"
              />

              <BehaviourCard
                icon={Heart}
                label="Loyalty"
                value={
                  totalOrders >= 5
                    ? "Strong"
                    : totalOrders >= 2
                    ? "Growing"
                    : "New"
                }
                tone="orange"
              />

              <BehaviourCard
                icon={RotateCcw}
                label="Return Rate"
                value={
                  totalOrders
                    ? `${Math.round(
                        (returnedOrders /
                          totalOrders) *
                          100
                      )}%`
                    : "0%"
                }
                tone={
                  returnedOrders >
                  0
                    ? "yellow"
                    : "green"
                }
              />

              <BehaviourCard
                icon={CreditCard}
                label="Payment"
                value="Healthy"
                tone="green"
              />
            </div>
          </section>

          {/* CUSTOMER OPERATIONS */}

          <section className="rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-400 p-4">
            <div className="flex gap-3">
              <Activity className="w-5 h-5 text-blue-950 shrink-0" />

              <div>
                <p className="text-xs font-black text-blue-950">
                  Customer 360
                </p>

                <p className="text-[9px] text-blue-950/70 mt-1 leading-4">
                  This profile connects customer
                  identity, address, purchases,
                  payments, returns and lifetime
                  value. Future CRM actions can
                  plug into this same surface.
                </p>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

/* ============================================================
   ORDER ROW
============================================================ */

function CustomerOrderRow({
  order,
}) {
  const status =
    String(
      order.status ||
        "CONFIRMED"
    ).toUpperCase();

  return (
    <div className="border border-slate-200 rounded-xl p-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
          <ShoppingBag className="w-4 h-4" />
        </div>

        <div className="flex-1">
          <p className="text-[9px] font-black">
            {order.orderId ||
              "Order"}
          </p>

          <p className="text-[7px] text-slate-400 mt-1">
            {formatDate(
              order.placedAt
            )}
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
    </div>
  );
}

/* ============================================================
   INFO
============================================================ */

function InfoCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-3">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-orange-500" />

        <p className="text-[7px] uppercase font-black text-slate-400">
          {label}
        </p>
      </div>

      <p className="text-[9px] font-bold text-slate-700 mt-2 break-words">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   BEHAVIOUR
============================================================ */

function BehaviourCard({
  icon: Icon,
  label,
  value,
  tone,
}) {
  const styles = {
    blue:
      "bg-blue-50 text-blue-800",
    orange:
      "bg-orange-50 text-orange-700",
    green:
      "bg-green-50 text-green-700",
    yellow:
      "bg-yellow-50 text-yellow-700",
  };

  return (
    <div
      className={`rounded-xl p-3 ${styles[tone]}`}
    >
      <Icon className="w-4 h-4" />

      <p className="text-[7px] uppercase font-black mt-3 opacity-60">
        {label}
      </p>

      <p className="text-xs font-black mt-1">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   DARK STAT
============================================================ */

function DarkCustomerStat({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-white/10 border border-white/10 p-3">
      <p className="text-[7px] uppercase font-black text-white/40">
        {label}
      </p>

      <p className="text-xs font-black mt-2">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   SECTION TITLE
============================================================ */

function DrawerSectionTitle({
  icon: Icon,
  title,
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-orange-600" />

      <h3 className="text-xs font-black text-slate-900">
        {title}
      </h3>
    </div>
  );
}

/* ============================================================
   SEGMENT
============================================================ */

function CustomerSegmentBadge({
  segment,
}) {
  const styles = {
    VIP:
      "bg-yellow-100 text-yellow-800",
    REPEAT:
      "bg-blue-100 text-blue-700",
    NEW:
      "bg-green-100 text-green-700",
    AT_RISK:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 rounded-md text-[7px] font-black ${
        styles[segment] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {formatStatus(segment)}
    </span>
  );
}

/* ============================================================
   AVATAR
============================================================ */

function Avatar({
  name,
  large = false,
}) {
  const initials =
    String(name || "C")
      .split(" ")
      .slice(0, 2)
      .map(
        (part) =>
          part[0]
      )
      .join("")
      .toUpperCase();

  return (
    <div
      className={`${
        large
          ? "w-12 h-12 text-sm"
          : "w-9 h-9 text-[9px]"
      } rounded-xl bg-gradient-to-br from-orange-400 to-yellow-300 text-blue-950 flex items-center justify-center font-black shrink-0`}
    >
      {initials}
    </div>
  );
}

/* ============================================================
   PAGINATION
============================================================ */

function CustomerPagination({
  page,
  totalPages,
  total,
  onPageChange,
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-[9px] text-slate-400">
        Page {page} of{" "}
        {totalPages} · {total} customers
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() =>
            onPageChange(
              page - 1
            )
          }
          className="px-3 py-2 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-30"
        >
          Previous
        </button>

        <span className="px-3 py-2 rounded-lg bg-blue-950 text-white text-[9px] font-black">
          {page}
        </span>

        <button
          type="button"
          disabled={
            page >= totalPages
          }
          onClick={() =>
            onPageChange(
              page + 1
            )
          }
          className="px-3 py-2 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   SKELETON
============================================================ */

function CustomerTableSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
      {Array.from({
        length: 7,
      }).map((_, index) => (
        <div
          key={index}
          className="h-14 rounded-xl bg-slate-100 animate-pulse"
        />
      ))}
    </div>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function TableHeading({
  children,
}) {
  return (
    <th className="text-left px-4 py-3 text-[8px] uppercase tracking-[0.12em] font-black text-slate-500">
      {children}
    </th>
  );
}

function getCustomerSegment(
  customer
) {
  const orders =
    Number(
      customer.totalOrders || 0
    );

  const spent =
    Number(
      customer.totalSpent || 0
    );

  if (spent >= 25000 || orders >= 10) {
    return "VIP";
  }

  if (orders >= 2) {
    return "REPEAT";
  }

  return "NEW";
}

function matchesCustomer(
  order,
  customer
) {
  const orderCustomer =
    order.customer || {};

  if (
    customer.id &&
    orderCustomer.id
  ) {
    return (
      customer.id ===
      orderCustomer.id
    );
  }

  if (
    customer.phone &&
    orderCustomer.phone
  ) {
    return (
      customer.phone ===
      orderCustomer.phone
    );
  }

  if (
    customer.email &&
    orderCustomer.email
  ) {
    return (
      customer.email.toLowerCase() ===
      orderCustomer.email.toLowerCase()
    );
  }

  return (
    customer.name &&
    orderCustomer.name &&
    customer.name.toLowerCase() ===
      orderCustomer.name.toLowerCase()
  );
}

function formatCurrency(value) {
  return `₹${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatStatus(value) {
  return String(
    value || ""
  )
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) =>
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