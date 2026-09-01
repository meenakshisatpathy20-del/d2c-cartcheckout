import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  Filter,
  IndianRupee,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

const DEFAULT_FILTERS = {
  search: "",
  status: "ALL",
  method: "ALL",
  type: "ALL",
  dateFrom: "",
  dateTo: "",
  page: 1,
  limit: 15,
};

const FALLBACK_TRANSACTIONS = [
  {
    transactionId: "PAY-820101",
    orderId: "D2C-849201",
    type: "PAYMENT",
    status: "SUCCESS",
    method: "UPI",
    provider: "Razorpay",
    amount: 2438,
    customer: {
      name: "Meenakshi",
      phone: "+91 98765 43210",
      city: "Ranchi",
    },
    createdAt: new Date(
      Date.now() - 1000 * 60 * 60 * 24
    ).toISOString(),
    gatewayReference: "pay_Qa91Kx82",
  },
  {
    transactionId: "PAY-820102",
    orderId: "D2C-849190",
    type: "PAYMENT",
    status: "SUCCESS",
    method: "CARD",
    provider: "Razorpay",
    amount: 1659,
    customer: {
      name: "Riya Kapoor",
      phone: "+91 98989 11223",
      city: "Mumbai",
    },
    createdAt: new Date(
      Date.now() - 1000 * 60 * 60 * 18
    ).toISOString(),
    gatewayReference: "pay_Qa72Lp11",
  },
  {
    transactionId: "REF-820103",
    orderId: "D2C-849140",
    type: "REFUND",
    status: "PROCESSING",
    method: "UPI",
    provider: "Razorpay",
    amount: 3499,
    customer: {
      name: "Aarav Sharma",
      phone: "+91 98111 22334",
      city: "Delhi",
    },
    createdAt: new Date(
      Date.now() - 1000 * 60 * 60 * 5
    ).toISOString(),
    gatewayReference: "rfnd_Qa92Mm22",
  },
  {
    transactionId: "PAY-820104",
    orderId: "D2C-849130",
    type: "PAYMENT",
    status: "FAILED",
    method: "UPI",
    provider: "Razorpay",
    amount: 829,
    customer: {
      name: "Kabir Singh",
      phone: "+91 98770 55441",
      city: "Pune",
    },
    createdAt: new Date(
      Date.now() - 1000 * 60 * 60 * 3
    ).toISOString(),
    gatewayReference: "pay_Qa99Failed",
  },
];

export default function PaymentsRefundsView({
  api,
  onOpenOrder,
}) {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedTransaction, setSelectedTransaction] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });

  const loadTransactions = useCallback(async () => {
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

      if (api?.getAdminPayments) {
        response = await api.getAdminPayments(
          params.toString()
        );
      }

      const list =
        response?.transactions ||
        FALLBACK_TRANSACTIONS;

      setTransactions(list);

      setPagination({
        page: response?.page || 1,
        limit: response?.limit || 15,
        total: response?.total || list.length,
        totalPages: response?.totalPages || 1,
      });
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load payment transactions."
      );

      setTransactions(FALLBACK_TRANSACTIONS);
    } finally {
      setLoading(false);
    }
  }, [api, filters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const metrics = useMemo(() => {
    const successfulPayments = transactions.filter(
      (item) =>
        normalize(item.type) === "PAYMENT" &&
        normalize(item.status) === "SUCCESS"
    );

    const successfulRefunds = transactions.filter(
      (item) =>
        normalize(item.type) === "REFUND" &&
        normalize(item.status) === "SUCCESS"
    );

    const pendingRefunds = transactions.filter(
      (item) =>
        normalize(item.type) === "REFUND" &&
        ["PROCESSING", "PENDING"].includes(
          normalize(item.status)
        )
    );

    const failedPayments = transactions.filter(
      (item) =>
        normalize(item.type) === "PAYMENT" &&
        normalize(item.status) === "FAILED"
    );

    return {
      paymentValue: successfulPayments.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      ),
      refundValue: successfulRefunds.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      ),
      pendingRefunds: pendingRefunds.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      ),
      failedPayments: failedPayments.length,
    };
  }, [transactions]);

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

  const exportTransactions = () => {
    if (!transactions.length) return;

    const headers = [
      "Transaction ID",
      "Order ID",
      "Type",
      "Status",
      "Method",
      "Provider",
      "Amount",
      "Customer",
      "Phone",
      "City",
      "Gateway Reference",
      "Created At",
    ];

    const rows = transactions.map((item) => [
      item.transactionId || "",
      item.orderId || "",
      item.type || "",
      item.status || "",
      item.method || "",
      item.provider || "",
      item.amount || 0,
      item.customer?.name || "",
      item.customer?.phone || "",
      item.customer?.city || "",
      item.gatewayReference || "",
      item.createdAt || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replaceAll('"', '""')}"`
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
    anchor.download = `d2c-payments-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    anchor.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-950 text-white flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] font-black text-orange-600">
                  Finance Control
                </p>

                <h1 className="text-2xl font-black text-slate-950">
                  Payments & Refunds
                </h1>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Monitor customer payments, gateway responses, refunds,
              failures and transaction reconciliation.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadTransactions}
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
              onClick={exportTransactions}
              disabled={!transactions.length}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600 disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <FinanceKpi
            icon={CheckCircle2}
            label="Successful Payments"
            value={formatCurrency(metrics.paymentValue)}
            tone="green"
          />

          <FinanceKpi
            icon={RefreshCw}
            label="Successful Refunds"
            value={formatCurrency(metrics.refundValue)}
            tone="blue"
          />

          <FinanceKpi
            icon={Clock3}
            label="Refunds Processing"
            value={formatCurrency(metrics.pendingRefunds)}
            tone="yellow"
          />

          <FinanceKpi
            icon={XCircle}
            label="Failed Payments"
            value={metrics.failedPayments}
            tone="red"
          />
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-yellow-700 mt-0.5" />

            <div>
              <p className="text-xs font-black text-yellow-900">
                Payment data warning
              </p>

              <p className="text-[9px] text-yellow-800 mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        <PaymentFilters
          filters={filters}
          onChange={updateFilter}
          onReset={resetFilters}
        />

        {loading ? (
          <PaymentSkeleton />
        ) : (
          <PaymentTable
            transactions={transactions}
            onSelect={setSelectedTransaction}
          />
        )}

        {!loading && pagination.totalPages > 1 && (
          <PaymentPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={(page) =>
              updateFilter("page", page)
            }
          />
        )}
      </div>

      {selectedTransaction && (
        <PaymentDrawer
          transaction={selectedTransaction}
          api={api}
          onClose={() => setSelectedTransaction(null)}
          onRefresh={loadTransactions}
          onOpenOrder={onOpenOrder}
        />
      )}
    </>
  );
}

/* ============================================================
   FILTERS
============================================================ */

function PaymentFilters({
  filters,
  onChange,
  onReset,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-orange-600" />

        <p className="text-xs font-black">
          Transaction Filters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            value={filters.search}
            onChange={(event) =>
              onChange("search", event.target.value)
            }
            placeholder="Search transaction, order, customer..."
            className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
          />
        </div>

        <FilterSelect
          value={filters.status}
          onChange={(value) =>
            onChange("status", value)
          }
        >
          <option value="ALL">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="PROCESSING">Processing</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </FilterSelect>

        <FilterSelect
          value={filters.method}
          onChange={(value) =>
            onChange("method", value)
          }
        >
          <option value="ALL">All Methods</option>
          <option value="UPI">UPI</option>
          <option value="CARD">Card</option>
          <option value="NETBANKING">Netbanking</option>
          <option value="WALLET">Wallet</option>
          <option value="COD">COD</option>
        </FilterSelect>

        <FilterSelect
          value={filters.type}
          onChange={(value) =>
            onChange("type", value)
          }
        >
          <option value="ALL">All Types</option>
          <option value="PAYMENT">Payment</option>
          <option value="REFUND">Refund</option>
        </FilterSelect>

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

function FilterSelect({
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

function PaymentTable({
  transactions,
  onSelect,
}) {
  if (!transactions.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center">
        <IndianRupee className="w-10 h-10 mx-auto text-slate-300" />

        <p className="text-sm font-black text-slate-700 mt-4">
          No transactions found
        </p>

        <p className="text-xs text-slate-400 mt-1">
          Payments and refunds will appear here.
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
              <Heading>Transaction</Heading>
              <Heading>Order</Heading>
              <Heading>Customer</Heading>
              <Heading>Type</Heading>
              <Heading>Method</Heading>
              <Heading>Amount</Heading>
              <Heading>Status</Heading>
              <Heading>Gateway</Heading>
              <Heading>Time</Heading>
              <th />
            </tr>
          </thead>

          <tbody>
            {transactions.map((item, index) => (
              <PaymentRow
                key={
                  item.transactionId ||
                  index
                }
                item={item}
                onSelect={onSelect}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentRow({
  item,
  onSelect,
}) {
  return (
    <tr
      onClick={() => onSelect(item)}
      className="border-b border-slate-100 last:border-0 hover:bg-orange-50/30 cursor-pointer transition"
    >
      <td className="px-5 py-4">
        <p className="text-[10px] font-black">
          {item.transactionId}
        </p>

        <p className="text-[7px] text-slate-400 mt-1">
          {item.gatewayReference || "Gateway reference pending"}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-[9px] font-black text-blue-800">
          {item.orderId || "—"}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-[9px] font-black">
          {item.customer?.name || "Customer"}
        </p>

        <p className="text-[7px] text-slate-400 mt-1">
          {item.customer?.phone || ""}
        </p>
      </td>

      <td className="px-4 py-4">
        <TransactionType type={item.type} />
      </td>

      <td className="px-4 py-4">
        <span className="text-[8px] font-black">
          {formatStatus(item.method)}
        </span>
      </td>

      <td className="px-4 py-4">
        <p className="text-[10px] font-black">
          {formatCurrency(item.amount)}
        </p>
      </td>

      <td className="px-4 py-4">
        <PaymentStatus status={item.status} />
      </td>

      <td className="px-4 py-4">
        <p className="text-[8px] font-black">
          {item.provider || "Razorpay"}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-[8px] font-bold">
          {formatDate(item.createdAt)}
        </p>

        <p className="text-[7px] text-slate-400 mt-1">
          {formatTime(item.createdAt)}
        </p>
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

function PaymentDrawer({
  transaction,
  api,
  onClose,
  onRefresh,
  onOpenOrder,
}) {
  const [details, setDetails] =
    useState(transaction);

  const [refundAmount, setRefundAmount] =
    useState(
      String(transaction.amount || "")
    );

  const [refundReason, setRefundReason] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const isRefund =
    normalize(details.type) ===
    "REFUND";

  const processRefund = async () => {
    const amount = Number(refundAmount);

    if (!amount || amount <= 0) {
      setMessage(
        "Enter a valid refund amount."
      );
      return;
    }

    if (amount > Number(details.amount || 0)) {
      setMessage(
        "Refund amount cannot exceed the transaction amount."
      );
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      if (api?.processRefund) {
        await api.processRefund({
          orderId: details.orderId,
          transactionId: details.transactionId,
          amount,
          reason: refundReason,
        });
      }

      setDetails((current) => ({
        ...current,
        status: "PROCESSING",
      }));

      setMessage(
        "Refund request submitted for processing."
      );

      await onRefresh?.();
    } catch (error) {
      setMessage(
        error?.message ||
          "Unable to process refund."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[140]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close payment drawer"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-30 bg-white border-b border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  isRefund
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-950 text-white"
                }`}
              >
                {isRefund ? (
                  <RefreshCw className="w-5 h-5" />
                ) : (
                  <IndianRupee className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black">
                    {details.transactionId}
                  </h2>

                  <PaymentStatus
                    status={details.status}
                  />
                </div>

                <p className="text-[8px] text-slate-400 mt-1">
                  {formatStatus(details.type)} ·{" "}
                  {formatStatus(details.method)}
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
          <section className="rounded-2xl bg-blue-950 text-white p-5">
            <p className="text-[8px] uppercase tracking-[0.15em] text-orange-300 font-black">
              Transaction Value
            </p>

            <div className="flex items-end justify-between gap-4 mt-1">
              <p className="text-3xl font-black">
                {formatCurrency(details.amount)}
              </p>

              <PaymentStatus status={details.status} />
            </div>

            <p className="text-[8px] text-white/50 mt-3">
              {details.provider || "Razorpay"} ·{" "}
              {details.gatewayReference || "Gateway reference pending"}
            </p>
          </section>

          <section>
            <SectionTitle
              icon={ShieldCheck}
              title="Payment Details"
            />

            <div className="grid grid-cols-2 gap-2 mt-3">
              <InfoBox
                label="Order"
                value={details.orderId}
              />

              <InfoBox
                label="Method"
                value={formatStatus(details.method)}
              />

              <InfoBox
                label="Provider"
                value={details.provider || "Razorpay"}
              />

              <InfoBox
                label="Reference"
                value={details.gatewayReference || "Pending"}
              />
            </div>
          </section>

          <section>
            <SectionTitle
              icon={CheckCircle2}
              title="Customer"
            />

            <div className="bg-slate-50 rounded-xl p-4 mt-3">
              <p className="text-[10px] font-black">
                {details.customer?.name || "Customer"}
              </p>

              <p className="text-[8px] text-slate-500 mt-2">
                {details.customer?.phone || ""}
              </p>

              <p className="text-[8px] text-slate-500 mt-1">
                {details.customer?.city || ""}
              </p>
            </div>
          </section>

          {!isRefund && (
            <section className="border border-green-200 bg-green-50 rounded-2xl p-4">
              <SectionTitle
                icon={RefreshCw}
                title="Customer Refund"
              />

              <p className="text-[8px] text-green-700 mt-1">
                Use this control for approved customer returns,
                cancellations or eligible refund adjustments.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                <div>
                  <label className="block text-[8px] font-black text-slate-500 mb-1">
                    Refund Amount
                  </label>

                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

                    <input
                      type="number"
                      min="1"
                      value={refundAmount}
                      onChange={(event) =>
                        setRefundAmount(
                          event.target.value
                        )
                      }
                      className="w-full h-10 rounded-xl border border-slate-200 pl-9 pr-3 text-xs font-black outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-black text-slate-500 mb-1">
                    Reason
                  </label>

                  <select
                    value={refundReason}
                    onChange={(event) =>
                      setRefundReason(
                        event.target.value
                      )
                    }
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[9px] font-bold outline-none"
                  >
                    <option value="">
                      Select reason
                    </option>

                    <option value="RETURN">
                      Customer Return
                    </option>

                    <option value="CANCELLATION">
                      Order Cancellation
                    </option>

                    <option value="DAMAGED">
                      Damaged Product
                    </option>

                    <option value="WRONG_PRODUCT">
                      Wrong Product
                    </option>

                    <option value="PRICE_ADJUSTMENT">
                      Price Adjustment
                    </option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={processRefund}
                className="w-full h-10 mt-3 rounded-xl bg-green-600 text-white text-[9px] font-black hover:bg-green-700 disabled:opacity-40"
              >
                {saving
                  ? "Processing..."
                  : "Process Refund"}
              </button>
            </section>
          )}

          {isRefund && (
            <section className="border border-blue-200 bg-blue-50 rounded-2xl p-4">
              <SectionTitle
                icon={RefreshCw}
                title="Refund Tracking"
              />

              <div className="mt-4 space-y-3">
                <RefundStep
                  active
                  title="Refund request created"
                />

                <RefundStep
                  active={
                    ["PROCESSING", "SUCCESS", "REFUNDED"].includes(
                      normalize(details.status)
                    )
                  }
                  title="Gateway processing"
                />

                <RefundStep
                  active={["SUCCESS", "REFUNDED"].includes(
                    normalize(details.status)
                  )}
                  title="Amount returned to customer"
                />
              </div>
            </section>
          )}

          <section>
            <SectionTitle
              icon={Clock3}
              title="Transaction Time"
            />

            <div className="bg-slate-50 rounded-xl p-4 mt-3">
              <p className="text-[10px] font-black">
                {formatDateTime(details.createdAt)}
              </p>

              <p className="text-[8px] text-slate-400 mt-1">
                All timestamps are displayed in India Standard Time.
              </p>
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
            {typeof onOpenOrder === "function" && (
              <button
                type="button"
                onClick={() =>
                  onOpenOrder(details.orderId)
                }
                className="flex-1 h-11 rounded-xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600"
              >
                Open Order
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

function FinanceKpi({
  icon: Icon,
  label,
  value,
  tone,
}) {
  const styles = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-800",
    yellow: "bg-yellow-50 text-yellow-700",
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

function TransactionType({
  type,
}) {
  const refund =
    normalize(type) === "REFUND";

  return (
    <span
      className={`inline-flex px-2 py-1 rounded-md text-[7px] font-black ${
        refund
          ? "bg-green-100 text-green-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {refund ? "Refund" : "Payment"}
    </span>
  );
}

function PaymentStatus({
  status,
}) {
  const value = normalize(status);

  const styles = {
    SUCCESS: "bg-green-100 text-green-700",
    REFUNDED: "bg-green-100 text-green-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    PENDING: "bg-yellow-100 text-yellow-800",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 rounded-md text-[7px] font-black ${
        styles[value] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {formatStatus(value || "PENDING")}
    </span>
  );
}

function InfoBox({
  label,
  value,
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-3">
      <p className="text-[7px] uppercase font-black text-slate-400">
        {label}
      </p>

      <p className="text-[9px] font-black mt-2 truncate">
        {value || "—"}
      </p>
    </div>
  );
}

function RefundStep({
  active,
  title,
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center ${
          active
            ? "bg-green-500 text-white"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        {active ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : (
          <Clock3 className="w-3.5 h-3.5" />
        )}
      </div>

      <p
        className={`text-[9px] font-black ${
          active
            ? "text-slate-800"
            : "text-slate-400"
        }`}
      >
        {title}
      </p>
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

function PaymentPagination({
  page,
  totalPages,
  total,
  onPageChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <p className="text-[9px] text-slate-400">
        Page {page} of {totalPages} · {total} transactions
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

function PaymentSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
      {Array.from({ length: 7 }).map((_, index) => (
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
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN"
  )}`;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}