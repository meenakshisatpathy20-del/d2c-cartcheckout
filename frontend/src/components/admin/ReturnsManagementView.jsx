import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  IndianRupee,
  Package,
  RefreshCw,
  Search,
  Truck,
  X,
  XCircle
} from "lucide-react";

const initialReturns = [
  {
    id: "RET-10021",
    orderId: "D2C-849201",
    customer: "Meenakshi",
    phone: "9876543210",
    product: "Essence Mascara",
    sku: "sku-1",
    reason: "Product damaged",
    requestedAt: "2026-09-01T10:24:00",
    status: "requested",
    pickupStatus: "not_scheduled",
    refundStatus: "pending",
    refundAmount: 599,
    paymentMethod: "Razorpay",
    warehouse: "Mumbai Bhiwandi Hub"
  },
  {
    id: "RET-10020",
    orderId: "D2C-849185",
    customer: "Rahul Sharma",
    phone: "9812345678",
    product: "Glamour Eyeshadow",
    sku: "sku-2",
    reason: "Wrong product received",
    requestedAt: "2026-08-31T16:10:00",
    status: "approved",
    pickupStatus: "scheduled",
    refundStatus: "pending",
    refundAmount: 899,
    paymentMethod: "UPI",
    warehouse: "Delhi NCR Hub"
  },
  {
    id: "RET-10019",
    orderId: "D2C-849144",
    customer: "Ananya Verma",
    phone: "9988776655",
    product: "Velvet Touch Powder",
    sku: "sku-3",
    reason: "Product not as expected",
    requestedAt: "2026-08-30T11:40:00",
    status: "picked_up",
    pickupStatus: "completed",
    refundStatus: "processing",
    refundAmount: 749,
    paymentMethod: "Card",
    warehouse: "Bengaluru Whitefield Hub"
  },
  {
    id: "RET-10018",
    orderId: "D2C-849101",
    customer: "Arjun Singh",
    phone: "9123456780",
    product: "Chic Fragrance CK One",
    sku: "sku-4",
    reason: "Changed my mind",
    requestedAt: "2026-08-28T09:15:00",
    status: "refunded",
    pickupStatus: "completed",
    refundStatus: "completed",
    refundAmount: 1299,
    paymentMethod: "Razorpay",
    warehouse: "Jaipur Depot"
  },
  {
    id: "RET-10017",
    orderId: "D2C-849078",
    customer: "Priya Nair",
    phone: "9090909090",
    product: "Hydrating Face Serum",
    sku: "sku-5",
    reason: "Wrong size",
    requestedAt: "2026-08-27T18:05:00",
    status: "rejected",
    pickupStatus: "not_scheduled",
    refundStatus: "not_applicable",
    refundAmount: 0,
    paymentMethod: "COD",
    warehouse: "Mumbai Bhiwandi Hub"
  }
];

const statusConfig = {
  requested: {
    label: "Requested",
    className: "bg-amber-50 text-amber-700 border-amber-200"
  },
  approved: {
    label: "Approved",
    className: "bg-blue-50 text-blue-700 border-blue-200"
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200"
  },
  picked_up: {
    label: "Picked Up",
    className: "bg-purple-50 text-purple-700 border-purple-200"
  },
  refunded: {
    label: "Refunded",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200"
  }
};

const refundConfig = {
  pending: "text-amber-600",
  processing: "text-blue-600",
  completed: "text-emerald-600",
  not_applicable: "text-slate-400"
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN");

export default function ReturnsManagementView({
  api,
  onViewOrder
}) {
  const [returns, setReturns] = useState(initialReturns);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [refundStatus, setRefundStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState("");

  const loadReturns = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      if (api?.getAdminReturns) {
        const response = await api.getAdminReturns({
          search,
          status,
          refundStatus,
          page,
          limit
        });

        const data = response?.data || response;

        if (Array.isArray(data?.returns)) {
          setReturns(data.returns);
        }
      }
    } catch {
      setToast("Using latest available return data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReturns();
  }, [page, status, refundStatus]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 2600);

    return () => clearTimeout(timer);
  }, [toast]);

  const filteredReturns = useMemo(() => {
    const query = search.trim().toLowerCase();

    return returns.filter((item) => {
      const matchesSearch =
        !query ||
        `${item.id} ${item.orderId} ${item.customer} ${item.phone} ${item.product} ${item.sku}`
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "all" || item.status === status;

      const matchesRefund =
        refundStatus === "all" ||
        item.refundStatus === refundStatus;

      return matchesSearch && matchesStatus && matchesRefund;
    });
  }, [returns, search, status, refundStatus]);

  const metrics = useMemo(() => {
    const requested = returns.filter(
      (item) => item.status === "requested"
    ).length;

    const approved = returns.filter(
      (item) => item.status === "approved"
    ).length;

    const processing = returns.filter(
      (item) =>
        item.refundStatus === "processing" ||
        item.refundStatus === "pending"
    ).length;

    const refunded = returns
      .filter((item) => item.refundStatus === "completed")
      .reduce(
        (sum, item) => sum + Number(item.refundAmount || 0),
        0
      );

    return {
      requested,
      approved,
      processing,
      refunded
    };
  }, [returns]);

  const performAction = async (returnItem, action, payload = {}) => {
    setActionLoading(true);

    try {
      if (api?.updateAdminReturn) {
        await api.updateAdminReturn(returnItem.id, {
          action,
          ...payload
        });
      }

      const statusMap = {
        approve: {
          status: "approved",
          pickupStatus: "scheduled",
          refundStatus: "pending"
        },
        reject: {
          status: "rejected",
          pickupStatus: "not_scheduled",
          refundStatus: "not_applicable"
        },
        pickup: {
          status: "picked_up",
          pickupStatus: "completed",
          refundStatus: "processing"
        },
        refund: {
          status: "refunded",
          pickupStatus: "completed",
          refundStatus: "completed"
        }
      };

      const next = statusMap[action];

      if (next) {
        setReturns((current) =>
          current.map((item) =>
            item.id === returnItem.id
              ? {
                  ...item,
                  ...next
                }
              : item
          )
        );
      }

      setSelectedReturn((current) =>
        current && current.id === returnItem.id
          ? {
              ...current,
              ...next
            }
          : current
      );

      setRejectReason("");

      setToast(
        action === "approve"
          ? "Return approved and pickup scheduled"
          : action === "reject"
          ? "Return request rejected"
          : action === "pickup"
          ? "Pickup marked as completed"
          : "Refund marked as completed"
      );
    } catch {
      setToast("Unable to update return request");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-orange-600">
              <RefreshCw size={17} />
              Post-Purchase Operations
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              Returns & Refunds
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review return requests, manage pickups and control refunds.
            </p>
          </div>

          <button
            onClick={() => loadReturns(true)}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["Pending Requests", metrics.requested, Clock3],
            ["Approved", metrics.approved, CheckCircle2],
            ["Refunds Processing", metrics.processing, IndianRupee],
            ["Refunded Value", `₹${money(metrics.refunded)}`, RefreshCw]
          ].map(([label, value, Icon]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {label}
                </span>

                <Icon size={17} className="text-orange-500" />
              </div>

              <div className="mt-3 text-xl font-black text-slate-900">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search return ID, order, customer, phone, SKU..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="all">All Return Status</option>
              <option value="requested">Requested</option>
              <option value="approved">Approved</option>
              <option value="picked_up">Picked Up</option>
              <option value="refunded">Refunded</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={refundStatus}
              onChange={(event) => {
                setRefundStatus(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="all">All Refunds</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="not_applicable">Not Applicable</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-black text-slate-900">
              Return Requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review and process customer return requests.
            </p>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : filteredReturns.length === 0 ? (
            <div className="p-14 text-center">
              <Package
                size={40}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-black text-slate-800">
                No returns found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr>
                    {[
                      "Return",
                      "Customer",
                      "Product",
                      "Reason",
                      "Amount",
                      "Status",
                      "Pickup",
                      "Refund",
                      "Action"
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredReturns.map((item) => {
                    const config =
                      statusConfig[item.status] ||
                      statusConfig.requested;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelectedReturn(item)}
                            className="text-left"
                          >
                            <p className="font-black text-slate-900 hover:text-orange-600">
                              {item.id}
                            </p>

                            <p className="mt-1 text-xs font-semibold text-slate-400">
                              {item.orderId}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(item.requestedAt)}
                            </p>
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-800">
                            {item.customer}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {item.phone}
                          </p>
                        </td>

                        <td className="max-w-[190px] px-5 py-4">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {item.product}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {item.sku}
                          </p>
                        </td>

                        <td className="max-w-[170px] px-5 py-4 text-sm text-slate-600">
                          {item.reason}
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-black text-slate-900">
                            ₹{money(item.refundAmount)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-bold ${config.className}`}
                          >
                            {config.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-xs font-bold capitalize text-slate-600">
                            {item.pickupStatus.replaceAll("_", " ")}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`text-xs font-black capitalize ${
                              refundConfig[item.refundStatus] ||
                              "text-slate-500"
                            }`}
                          >
                            {item.refundStatus.replaceAll("_", " ")}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelectedReturn(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                          >
                            <Eye size={14} />
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 p-4">
            <span className="text-xs font-semibold text-slate-500">
              Page {page}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPage((current) =>
                    Math.max(current - 1, 1)
                  )
                }
                disabled={page === 1}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() =>
                  setPage((current) => current + 1)
                }
                disabled={filteredReturns.length < limit}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedReturn && (
        <div className="fixed inset-0 z-50 bg-slate-950/50">
          <div className="absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5">
              <div>
                <h2 className="font-black text-slate-900">
                  Return Review
                </h2>

                <p className="text-xs text-slate-400">
                  {selectedReturn.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedReturn(null)}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <Package size={22} />
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900">
                      {selectedReturn.product}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      SKU: {selectedReturn.sku}
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-800">
                      Refund: ₹
                      {money(selectedReturn.refundAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-400">
                    Customer
                  </p>
                  <p className="mt-1 font-black text-slate-900">
                    {selectedReturn.customer}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedReturn.phone}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-400">
                    Payment
                  </p>
                  <p className="mt-1 font-black text-slate-900">
                    {selectedReturn.paymentMethod}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-400">
                    Warehouse
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {selectedReturn.warehouse}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-400">
                    Requested
                  </p>
                  <p className="mt-1 font-black text-slate-900">
                    {formatDate(selectedReturn.requestedAt)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Return Reason
                </p>

                <p className="mt-2 font-bold text-slate-800">
                  {selectedReturn.reason}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-4 font-black text-slate-900">
                  Return Progress
                </p>

                <div className="space-y-4">
                  {[
                    [
                      "Return Requested",
                      true,
                      Clock3
                    ],
                    [
                      "Return Approved",
                      ["approved", "picked_up", "refunded"].includes(
                        selectedReturn.status
                      ),
                      CheckCircle2
                    ],
                    [
                      "Pickup Completed",
                      ["picked_up", "refunded"].includes(
                        selectedReturn.status
                      ),
                      Truck
                    ],
                    [
                      "Refund Completed",
                      selectedReturn.refundStatus === "completed",
                      IndianRupee
                    ]
                  ].map(([label, complete, Icon]) => (
                    <div
                      key={label}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          complete
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Icon size={16} />
                      </div>

                      <span
                        className={`text-sm font-bold ${
                          complete
                            ? "text-slate-800"
                            : "text-slate-400"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedReturn.status === "requested" && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={actionLoading}
                    onClick={() =>
                      performAction(
                        selectedReturn,
                        "approve"
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white disabled:opacity-50"
                  >
                    <CheckCircle2 size={17} />
                    Approve Return
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => {
                      if (!rejectReason) {
                        setRejectReason(
                          "Return policy criteria not satisfied"
                        );
                      }

                      performAction(
                        selectedReturn,
                        "reject",
                        {
                          reason:
                            rejectReason ||
                            "Return policy criteria not satisfied"
                        }
                      );
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white disabled:opacity-50"
                  >
                    <XCircle size={17} />
                    Reject
                  </button>
                </div>
              )}

              {selectedReturn.status === "approved" &&
                selectedReturn.pickupStatus === "scheduled" && (
                  <button
                    disabled={actionLoading}
                    onClick={() =>
                      performAction(
                        selectedReturn,
                        "pickup"
                      )
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white disabled:opacity-50"
                  >
                    <Truck size={17} />
                    Mark Pickup Completed
                  </button>
                )}

              {selectedReturn.status === "picked_up" &&
                selectedReturn.refundStatus === "processing" && (
                  <button
                    disabled={actionLoading}
                    onClick={() =>
                      performAction(
                        selectedReturn,
                        "refund"
                      )
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white disabled:opacity-50"
                  >
                    <IndianRupee size={17} />
                    Complete Refund
                  </button>
                )}

              {onViewOrder && (
                <button
                  onClick={() =>
                    onViewOrder(selectedReturn.orderId)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  View Original Order
                </button>
              )}

              {selectedReturn.status === "rejected" && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 text-red-600"
                  />

                  <div>
                    <p className="text-sm font-black text-red-800">
                      Return rejected
                    </p>

                    <p className="mt-1 text-xs text-red-700">
                      No pickup or refund should be initiated for this
                      request.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-[80] rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}