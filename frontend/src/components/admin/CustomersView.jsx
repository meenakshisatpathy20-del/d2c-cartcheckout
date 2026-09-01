import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Download,
  Filter,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  Star,
  Tag,
  User,
  Users,
  X,
} from "lucide-react";

const DEFAULT_FILTERS = {
  search: "",
  segment: "ALL",
  status: "ALL",
  city: "ALL",
  sort: "recent",
  page: 1,
  limit: 15,
};

const FALLBACK_CUSTOMERS = [
  {
    id: "CUS-10001",
    name: "Meenakshi",
    email: "meenakshi@example.com",
    phone: "+91 98765 43210",
    city: "Ranchi",
    state: "Jharkhand",
    pincode: "834001",
    status: "ACTIVE",
    segment: "VIP",
    orders: 18,
    totalSpent: 38450,
    averageOrderValue: 2136,
    returns: 1,
    cancelled: 0,
    points: 2450,
    rating: 4.9,
    joinedAt: "2026-02-12T10:20:00.000Z",
    lastOrderAt: "2026-08-31T16:40:00.000Z",
    tags: ["VIP", "Repeat"],
    addresses: 2,
  },
  {
    id: "CUS-10002",
    name: "Riya Kapoor",
    email: "riya.kapoor@example.com",
    phone: "+91 98989 11223",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    status: "ACTIVE",
    segment: "REPEAT",
    orders: 9,
    totalSpent: 18490,
    averageOrderValue: 2054,
    returns: 0,
    cancelled: 1,
    points: 980,
    rating: 4.8,
    joinedAt: "2026-04-21T09:15:00.000Z",
    lastOrderAt: "2026-08-31T15:18:00.000Z",
    tags: ["Repeat"],
    addresses: 3,
  },
  {
    id: "CUS-10003",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98111 22334",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    status: "ACTIVE",
    segment: "NEW",
    orders: 2,
    totalSpent: 5180,
    averageOrderValue: 2590,
    returns: 0,
    cancelled: 0,
    points: 310,
    rating: 4.7,
    joinedAt: "2026-08-19T13:20:00.000Z",
    lastOrderAt: "2026-08-30T12:30:00.000Z",
    tags: ["New"],
    addresses: 1,
  },
  {
    id: "CUS-10004",
    name: "Kabir Singh",
    email: "kabir.singh@example.com",
    phone: "+91 98770 55441",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    status: "ACTIVE",
    segment: "AT_RISK",
    orders: 6,
    totalSpent: 9320,
    averageOrderValue: 1553,
    returns: 2,
    cancelled: 2,
    points: 410,
    rating: 4.3,
    joinedAt: "2026-03-08T10:00:00.000Z",
    lastOrderAt: "2026-07-14T17:45:00.000Z",
    tags: ["At Risk"],
    addresses: 2,
  },
  {
    id: "CUS-10005",
    name: "Ananya Verma",
    email: "ananya.verma@example.com",
    phone: "+91 97654 22119",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    status: "ACTIVE",
    segment: "REPEAT",
    orders: 12,
    totalSpent: 27640,
    averageOrderValue: 2303,
    returns: 1,
    cancelled: 0,
    points: 1720,
    rating: 4.9,
    joinedAt: "2026-01-29T08:45:00.000Z",
    lastOrderAt: "2026-08-29T18:10:00.000Z",
    tags: ["Repeat", "Beauty"],
    addresses: 2,
  },
];

export default function CustomersView({
  api,
  onOpenOrder,
}) {
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== "" &&
          value !== null &&
          value !== undefined
        ) {
          params.set(key, value);
        }
      });

      let response = null;

      if (api?.getAdminCustomers) {
        response = await api.getAdminCustomers(
          params.toString()
        );
      }

      const list =
        response?.customers ||
        response?.users ||
        FALLBACK_CUSTOMERS;

      setCustomers(list);

      setPagination({
        page: response?.page || 1,
        limit: response?.limit || 15,
        total: response?.total || list.length,
        totalPages: response?.totalPages || 1,
      });
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load customer records."
      );

      setCustomers(FALLBACK_CUSTOMERS);
    } finally {
      setLoading(false);
    }
  }, [api, filters]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const metrics = useMemo(() => {
    const totalCustomers = customers.length;

    const activeCustomers = customers.filter(
      (customer) =>
        normalize(customer.status) === "ACTIVE"
    ).length;

    const vipCustomers = customers.filter(
      (customer) =>
        normalize(customer.segment) === "VIP"
    ).length;

    const repeatCustomers = customers.filter(
      (customer) =>
        normalize(customer.segment) === "REPEAT"
    ).length;

    const atRiskCustomers = customers.filter(
      (customer) =>
        normalize(customer.segment) === "AT_RISK"
    ).length;

    const lifetimeValue = customers.reduce(
      (sum, customer) =>
        sum + Number(customer.totalSpent || 0),
      0
    );

    return {
      totalCustomers,
      activeCustomers,
      vipCustomers,
      repeatCustomers,
      atRiskCustomers,
      lifetimeValue,
    };
  }, [customers]);

  const cities = useMemo(() => {
    return [
      ...new Set(
        customers
          .map((customer) => customer.city)
          .filter(Boolean)
      ),
    ];
  }, [customers]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === "page" ? value : 1,
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const exportCustomers = () => {
    if (!customers.length) return;

    const headers = [
      "Customer ID",
      "Name",
      "Email",
      "Phone",
      "City",
      "State",
      "Pincode",
      "Status",
      "Segment",
      "Orders",
      "Total Spent",
      "Average Order Value",
      "Returns",
      "Cancelled",
      "Loyalty Points",
      "Joined At",
      "Last Order",
    ];

    const rows = customers.map((customer) => [
      customer.id || "",
      customer.name || "",
      customer.email || "",
      customer.phone || "",
      customer.city || "",
      customer.state || "",
      customer.pincode || "",
      customer.status || "",
      customer.segment || "",
      customer.orders || 0,
      customer.totalSpent || 0,
      customer.averageOrderValue || 0,
      customer.returns || 0,
      customer.cancelled || 0,
      customer.points || 0,
      customer.joinedAt || "",
      customer.lastOrderAt || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replaceAll(
                '"',
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `d2c-customers-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    anchor.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="space-y-5">
        {/* HEADER */}

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-950 text-white flex items-center justify-center">
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
              Manage customer profiles, segments, purchase history,
              loyalty activity and retention signals.
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
                className={`w-3.5 h-3.5 ${
                  loading ? "animate-spin" : ""
                }`}
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={exportCustomers}
              disabled={!customers.length}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600 disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />

              Export
            </button>
          </div>
        </div>

        {/* KPI */}

        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
          <CustomerKpi
            icon={Users}
            label="Customers"
            value={metrics.totalCustomers}
            tone="blue"
          />

          <CustomerKpi
            icon={CheckCircle2}
            label="Active"
            value={metrics.activeCustomers}
            tone="green"
          />

          <CustomerKpi
            icon={Star}
            label="VIP"
            value={metrics.vipCustomers}
            tone="orange"
          />

          <CustomerKpi
            icon={ShoppingBag}
            label="Repeat"
            value={metrics.repeatCustomers}
            tone="purple"
          />

          <CustomerKpi
            icon={AlertCircle}
            label="At Risk"
            value={metrics.atRiskCustomers}
            tone="red"
          />
        </div>

        {/* LIFETIME VALUE */}

        <div className="bg-blue-950 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[8px] uppercase tracking-[0.14em] text-orange-300 font-black">
              Customer Lifetime Value
            </p>

            <p className="text-3xl font-black mt-1">
              {formatCurrency(
                metrics.lifetimeValue
              )}
            </p>

            <p className="text-[8px] text-white/45 mt-1">
              Combined purchase value represented by the current customer dataset.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-xl bg-white/10">
              <p className="text-[7px] text-white/45">
                Repeat Customers
              </p>

              <p className="text-lg font-black mt-1">
                {metrics.repeatCustomers}
              </p>
            </div>

            <div className="px-4 py-3 rounded-xl bg-white/10">
              <p className="text-[7px] text-white/45">
                At Risk
              </p>

              <p className="text-lg font-black mt-1">
                {metrics.atRiskCustomers}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-yellow-700 mt-0.5" />

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

        <CustomerFilters
          filters={filters}
          cities={cities}
          onChange={updateFilter}
          onReset={resetFilters}
        />

        {/* TABLE */}

        {loading ? (
          <CustomerSkeleton />
        ) : (
          <CustomerTable
            customers={customers}
            onSelect={setSelectedCustomer}
          />
        )}

        {!loading &&
          pagination.totalPages > 1 && (
            <CustomerPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={(page) =>
                updateFilter("page", page)
              }
            />
          )}
      </div>

      {selectedCustomer && (
        <CustomerDrawer
          customer={selectedCustomer}
          api={api}
          onClose={() =>
            setSelectedCustomer(null)
          }
          onRefresh={loadCustomers}
          onOpenOrder={onOpenOrder}
        />
      )}
    </>
  );
}

/* ============================================================
   FILTERS
============================================================ */

function CustomerFilters({
  filters,
  cities,
  onChange,
  onReset,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-orange-600" />

        <p className="text-xs font-black">
          Customer Filters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            value={filters.search}
            onChange={(event) =>
              onChange(
                "search",
                event.target.value
              )
            }
            placeholder="Search customer, phone or email..."
            className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
          />
        </div>

        <Select
          value={filters.segment}
          onChange={(value) =>
            onChange("segment", value)
          }
        >
          <option value="ALL">
            All Segments
          </option>

          <option value="NEW">
            New
          </option>

          <option value="REPEAT">
            Repeat
          </option>

          <option value="VIP">
            VIP
          </option>

          <option value="AT_RISK">
            At Risk
          </option>
        </Select>

        <Select
          value={filters.status}
          onChange={(value) =>
            onChange("status", value)
          }
        >
          <option value="ALL">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>

          <option value="BLOCKED">
            Blocked
          </option>
        </Select>

        <Select
          value={filters.city}
          onChange={(value) =>
            onChange("city", value)
          }
        >
          <option value="ALL">
            All Cities
          </option>

          {cities.map((city) => (
            <option
              key={city}
              value={city}
            >
              {city}
            </option>
          ))}
        </Select>

        <Select
          value={filters.sort}
          onChange={(value) =>
            onChange("sort", value)
          }
        >
          <option value="recent">
            Most Recent
          </option>

          <option value="spend">
            Highest Spend
          </option>

          <option value="orders">
            Most Orders
          </option>

          <option value="name">
            Name
          </option>
        </Select>

        <button
          type="button"
          onClick={onReset}
          className="h-10 px-4 rounded-xl bg-orange-50 text-orange-700 text-xs font-black hover:bg-orange-100"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="appearance-none w-full h-10 rounded-xl border border-slate-200 bg-white px-3 pr-8 text-[10px] font-bold outline-none"
      >
        {children}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
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

        <p className="text-sm font-black text-slate-700 mt-4">
          No customers found
        </p>

        <p className="text-xs text-slate-400 mt-1">
          Try changing the customer filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <Heading>Customer</Heading>
              <Heading>Segment</Heading>
              <Heading>Orders</Heading>
              <Heading>Total Spend</Heading>
              <Heading>AOV</Heading>
              <Heading>Returns</Heading>
              <Heading>Location</Heading>
              <Heading>Last Order</Heading>
              <Heading>Status</Heading>
              <th />
            </tr>
          </thead>

          <tbody>
            {customers.map(
              (customer, index) => (
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
            <p className="text-[9px] font-black">
              {customer.name}
            </p>

            <p className="text-[7px] text-slate-400 mt-1">
              {customer.phone}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <CustomerSegment
          segment={
            customer.segment
          }
        />
      </td>

      <td className="px-4 py-4">
        <p className="text-[10px] font-black">
          {customer.orders || 0}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-[10px] font-black">
          {formatCurrency(
            customer.totalSpent
          )}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-[9px] font-black">
          {formatCurrency(
            customer.averageOrderValue
          )}
        </p>
      </td>

      <td className="px-4 py-4">
        <span
          className={`text-[9px] font-black ${
            Number(
              customer.returns || 0
            ) > 0
              ? "text-orange-600"
              : "text-slate-400"
          }`}
        >
          {customer.returns || 0}
        </span>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />

          <span className="text-[8px] font-bold">
            {customer.city ||
              "—"}
          </span>
        </div>
      </td>

      <td className="px-4 py-4">
        <p className="text-[8px] font-bold">
          {formatDate(
            customer.lastOrderAt
          )}
        </p>
      </td>

      <td className="px-4 py-4">
        <CustomerStatus
          status={
            customer.status
          }
        />
      </td>

      <td className="px-4">
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
  onRefresh,
  onOpenOrder,
}) {
  const [details, setDetails] =
    useState(customer);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [tagInput, setTagInput] =
    useState("");

  const loadDetails =
    useCallback(async () => {
      if (!api?.getAdminCustomer) {
        return;
      }

      try {
        const response =
          await api.getAdminCustomer(
            details.id
          );

        if (response?.customer) {
          setDetails(
            response.customer
          );
        }
      } catch (error) {
        console.error(
          "Customer details failed:",
          error
        );
      }
    }, [api, details.id]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const changeStatus =
    async (status) => {
      try {
        setSaving(true);
        setMessage("");

        if (api?.updateCustomerStatus) {
          await api.updateCustomerStatus(
            details.id,
            status
          );
        }

        setDetails(
          (current) => ({
            ...current,
            status,
          })
        );

        setMessage(
          `Customer status changed to ${formatStatus(
            status
          )}.`
        );

        await onRefresh?.();
      } catch (error) {
        setMessage(
          error?.message ||
            "Unable to update customer status."
        );
      } finally {
        setSaving(false);
      }
    };

  const addTag = async () => {
    const tag =
      tagInput.trim();

    if (!tag) return;

    const nextTags = [
      ...(details.tags || []),
      tag,
    ];

    try {
      setSaving(true);
      setMessage("");

      if (api?.updateCustomerTags) {
        await api.updateCustomerTags(
          details.id,
          nextTags
        );
      }

      setDetails(
        (current) => ({
          ...current,
          tags: nextTags,
        })
      );

      setTagInput("");

      setMessage(
        "Customer tag added."
      );
    } catch (error) {
      setMessage(
        error?.message ||
          "Unable to update customer tags."
      );
    } finally {
      setSaving(false);
    }
  };

  const removeTag = async (
    tag
  ) => {
    const nextTags = (
      details.tags || []
    ).filter(
      (item) => item !== tag
    );

    try {
      setSaving(true);

      if (api?.updateCustomerTags) {
        await api.updateCustomerTags(
          details.id,
          nextTags
        );
      }

      setDetails(
        (current) => ({
          ...current,
          tags: nextTags,
        })
      );
    } catch (error) {
      setMessage(
        error?.message ||
          "Unable to remove customer tag."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close customer drawer"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl overflow-y-auto">
        {/* HEADER */}

        <div className="sticky top-0 z-30 bg-white border-b border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar
                name={
                  details.name
                }
                large
              />

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black">
                    {details.name}
                  </h2>

                  <CustomerSegment
                    segment={
                      details.segment
                    }
                  />
                </div>

                <p className="text-[8px] text-slate-400 mt-1">
                  {details.id}
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
          {/* CUSTOMER HERO */}

          <section className="rounded-2xl bg-blue-950 text-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[8px] uppercase tracking-[0.15em] text-orange-300 font-black">
                  Customer Lifetime Spend
                </p>

                <p className="text-3xl font-black mt-1">
                  {formatCurrency(
                    details.totalSpent
                  )}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[7px] text-white/45">
                  Orders
                </p>

                <p className="text-2xl font-black">
                  {details.orders ||
                    0}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-6">
              <CustomerHeroMetric
                label="AOV"
                value={formatCurrency(
                  details.averageOrderValue
                )}
              />

              <CustomerHeroMetric
                label="Returns"
                value={
                  details.returns ||
                  0
                }
              />

              <CustomerHeroMetric
                label="Points"
                value={
                  details.points ||
                  0
                }
              />
            </div>
          </section>

          {/* CONTACT */}

          <section>
            <SectionTitle
              icon={User}
              title="Profile"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              <InfoBox
                icon={Mail}
                label="Email"
                value={
                  details.email
                }
              />

              <InfoBox
                icon={Phone}
                label="Phone"
                value={
                  details.phone
                }
              />

              <InfoBox
                icon={MapPin}
                label="Location"
                value={`${details.city || "—"}, ${
                  details.state || ""
                }`}
              />

              <InfoBox
                icon={CalendarDays}
                label="Joined"
                value={formatDate(
                  details.joinedAt
                )}
              />
            </div>
          </section>

          {/* SEGMENT */}

          <section>
            <SectionTitle
              icon={Tag}
              title="Customer Segment"
            />

            <div className="mt-3 p-4 rounded-xl bg-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] text-slate-400">
                    Current Segment
                  </p>

                  <div className="mt-2">
                    <CustomerSegment
                      segment={
                        details.segment
                      }
                    />
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[8px] text-slate-400">
                    Rating
                  </p>

                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />

                    <span className="text-[10px] font-black">
                      {details.rating ||
                        "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TAGS */}

          <section>
            <SectionTitle
              icon={Tag}
              title="Customer Tags"
            />

            <div className="flex flex-wrap gap-2 mt-3">
              {(details.tags || []).map(
                (tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() =>
                      removeTag(tag)
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-[8px] font-black"
                  >
                    {tag}

                    <X className="w-2.5 h-2.5" />
                  </button>
                )
              )}

              {!details.tags?.length && (
                <p className="text-[8px] text-slate-400">
                  No tags assigned.
                </p>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <input
                value={tagInput}
                onChange={(event) =>
                  setTagInput(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    addTag();
                  }
                }}
                placeholder="Add customer tag..."
                className="flex-1 h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-orange-500"
              />

              <button
                type="button"
                disabled={saving}
                onClick={addTag}
                className="px-4 h-10 rounded-xl bg-orange-500 text-white text-[9px] font-black"
              >
                Add
              </button>
            </div>
          </section>

          {/* ORDER PERFORMANCE */}

          <section>
            <SectionTitle
              icon={ShoppingBag}
              title="Purchase Performance"
            />

            <div className="grid grid-cols-2 gap-2 mt-3">
              <PerformanceBox
                label="Total Orders"
                value={
                  details.orders ||
                  0
                }
                icon={ShoppingBag}
              />

              <PerformanceBox
                label="Total Spend"
                value={formatCurrency(
                  details.totalSpent
                )}
                icon={IndianRupee}
              />

              <PerformanceBox
                label="Returns"
                value={
                  details.returns ||
                  0
                }
                icon={RotateCcwIcon}
              />

              <PerformanceBox
                label="Cancelled"
                value={
                  details.cancelled ||
                  0
                }
                icon={XCircleIcon}
              />
            </div>
          </section>

          {/* ADDRESS */}

          <section>
            <SectionTitle
              icon={MapPin}
              title="Saved Addresses"
            />

            <div className="mt-3 rounded-xl bg-slate-50 p-4">
              <p className="text-[9px] font-black">
                {details.city},{" "}
                {details.state}
              </p>

              <p className="text-[8px] text-slate-500 mt-1">
                Pincode{" "}
                {details.pincode ||
                  "—"}
              </p>

              <p className="text-[7px] text-slate-400 mt-2">
                {details.addresses ||
                  0}{" "}
                saved address
                {Number(
                  details.addresses ||
                    0
                ) === 1
                  ? ""
                  : "es"}
              </p>
            </div>
          </section>

          {/* STATUS */}

          <section className="border border-slate-200 rounded-2xl p-4">
            <SectionTitle
              icon={User}
              title="Account Status"
            />

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  changeStatus(
                    "ACTIVE"
                  )
                }
                className="px-3 py-2 rounded-lg bg-green-50 text-green-700 text-[8px] font-black"
              >
                Activate
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  changeStatus(
                    "INACTIVE"
                  )
                }
                className="px-3 py-2 rounded-lg bg-yellow-50 text-yellow-800 text-[8px] font-black"
              >
                Deactivate
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  changeStatus(
                    "BLOCKED"
                  )
                }
                className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-[8px] font-black"
              >
                Block
              </button>
            </div>
          </section>

          {message && (
            <div className="rounded-xl bg-orange-50 border border-orange-100 p-3">
              <p className="text-[8px] font-black text-orange-800">
                {message}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {typeof onOpenOrder ===
              "function" && (
              <button
                type="button"
                onClick={() =>
                  onOpenOrder({
                    customerId:
                      details.id,
                    customer:
                      details.name,
                  })
                }
                className="flex-1 h-11 rounded-xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600"
              >
                View Orders
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-slate-200 text-xs font-black"
            >
              Close
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function CustomerKpi({
  icon: Icon,
  label,
  value,
  tone,
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-800",
    green: "bg-green-50 text-green-700",
    orange: "bg-orange-50 text-orange-700",
    purple: "bg-purple-50 text-purple-700",
    red: "bg-red-50 text-red-700",
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

function CustomerHeroMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-white/10 p-3">
      <p className="text-[7px] uppercase tracking-[0.1em] text-white/45 font-black">
        {label}
      </p>

      <p className="text-base font-black mt-1">
        {value}
      </p>
    </div>
  );
}

function PerformanceBox({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-3">
      <Icon className="w-4 h-4 text-orange-600" />

      <p className="text-[7px] uppercase font-black text-slate-400 mt-3">
        {label}
      </p>

      <p className="text-base font-black mt-1">
        {value}
      </p>
    </div>
  );
}

function InfoBox({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-3">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-orange-600" />

        <p className="text-[7px] uppercase font-black text-slate-400">
          {label}
        </p>
      </div>

      <p className="text-[9px] font-black mt-2 truncate">
        {value || "—"}
      </p>
    </div>
  );
}

function CustomerSegment({
  segment,
}) {
  const value =
    normalize(segment);

  const styles = {
    VIP:
      "bg-orange-100 text-orange-700",
    REPEAT:
      "bg-purple-100 text-purple-700",
    NEW:
      "bg-blue-100 text-blue-700",
    AT_RISK:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 rounded-md text-[7px] font-black ${
        styles[value] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {formatStatus(
        value || "CUSTOMER"
      )}
    </span>
  );
}

function CustomerStatus({
  status,
}) {
  const value =
    normalize(status);

  const styles = {
    ACTIVE:
      "bg-green-100 text-green-700",
    INACTIVE:
      "bg-slate-100 text-slate-600",
    BLOCKED:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 rounded-md text-[7px] font-black ${
        styles[value] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {formatStatus(
        value || "ACTIVE"
      )}
    </span>
  );
}

function Avatar({
  name,
  large = false,
}) {
  const initials = String(
    name || "C"
  )
    .split(" ")
    .map(
      (part) =>
        part[0]
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black ${
        large
          ? "w-12 h-12 text-sm"
          : "w-9 h-9 text-[9px]"
      }`}
    >
      {initials}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-orange-600" />

      <h3 className="text-xs font-black">
        {title}
      </h3>
    </div>
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

function CustomerPagination({
  page,
  totalPages,
  total,
  onPageChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <p className="text-[9px] text-slate-400">
        Page {page} of {totalPages} ·{" "}
        {total} customers
      </p>

      <div className="flex gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() =>
            onPageChange(page - 1)
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
          disabled={page >= totalPages}
          onClick={() =>
            onPageChange(page + 1)
          }
          className="px-3 py-2 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function CustomerSkeleton() {
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

function RotateCcwIcon(props) {
  return (
    <RefreshCw {...props} />
  );
}

function XCircleIcon(props) {
  return (
    <AlertCircle {...props} />
  );
}

/* ============================================================
   HELPERS
============================================================ */

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

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

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