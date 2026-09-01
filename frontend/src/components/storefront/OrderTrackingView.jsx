import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Copy,
  HelpCircle,
  Home,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  Phone,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  XCircle,
  Zap,
} from "lucide-react";

const FALLBACK_ORDER = {
  orderId: "D2C-84729163",
  status: "SHIPPED",
  createdAt: new Date().toISOString(),
  paymentMethod: "UPI",
  paymentStatus: "PAID",
  carrier: "Delhivery",
  trackingNumber: "DLV8472916382",
  estimatedDelivery: "September 4, 2026",
  currentLocation: "Bengaluru Hub",
  customer: {
    name: "Priyank Raj",
    phone: "9876543210",
  },
  address: {
    name: "Priyank Raj",
    phone: "9876543210",
    address: "24, MG Road, Near City Centre",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    type: "Home",
  },
  items: [
    {
      id: "P1",
      name: "Essence Mascara Lash Princess",
      brand: "Essence",
      price: 829,
      quantity: 1,
      image:
        "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    },
  ],
  totals: {
    total: 908,
  },
};

const FALLBACK_EVENTS = [
  {
    id: "placed",
    title: "Order Placed",
    description: "Your order has been successfully placed.",
    location: "Online",
    time: "Sep 1, 2026 · 6:32 PM",
    completed: true,
  },
  {
    id: "confirmed",
    title: "Order Confirmed",
    description: "Payment received and order confirmed.",
    location: "D2C Fulfilment",
    time: "Sep 1, 2026 · 6:34 PM",
    completed: true,
  },
  {
    id: "packed",
    title: "Packed",
    description: "Your items have been packed and are ready to ship.",
    location: "Bengaluru Warehouse",
    time: "Sep 2, 2026 · 9:18 AM",
    completed: true,
  },
  {
    id: "shipped",
    title: "Shipped",
    description: "Your package is on its way.",
    location: "Bengaluru Hub",
    time: "Sep 2, 2026 · 1:42 PM",
    completed: true,
    active: true,
  },
  {
    id: "out-for-delivery",
    title: "Out for Delivery",
    description: "Your package will be delivered today.",
    location: "Local Delivery Hub",
    time: "Expected soon",
    completed: false,
  },
  {
    id: "delivered",
    title: "Delivered",
    description: "Package delivered successfully.",
    location: "Your Address",
    time: "Pending",
    completed: false,
  },
];

export default function OrderTrackingView({
  order: initialOrder,
  api,
  onBack,
  onViewOrders,
  onContinueShopping,
  onCancelOrder,
  onReturnOrder,
  onContactSupport,
}) {
  const [order, setOrder] = useState(
    initialOrder || FALLBACK_ORDER
  );

  const [events, setEvents] =
    useState(FALLBACK_EVENTS);

  const [loading, setLoading] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [showAllEvents, setShowAllEvents] =
    useState(false);

  const [showCancelModal, setShowCancelModal] =
    useState(false);

  const [cancelReason, setCancelReason] =
    useState("");

  const [actionMessage, setActionMessage] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState(new Date());

  useEffect(() => {
    let mounted = true;

    async function loadTracking() {
      if (
        !api?.getOrderTracking ||
        !order?.orderId
      ) {
        return;
      }

      try {
        setLoading(true);

        const response =
          await api.getOrderTracking(
            order.orderId
          );

        if (!mounted) {
          return;
        }

        if (response?.order) {
          setOrder(response.order);
        }

        if (
          Array.isArray(
            response?.events
          )
        ) {
          setEvents(
            response.events
          );
        }

        setLastUpdated(
          new Date()
        );
      } catch {
        // Keep local tracking state until backend is connected.
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTracking();

    return () => {
      mounted = false;
    };
  }, [api, order?.orderId]);

  const refreshTracking = async () => {
    setRefreshing(true);
    setActionMessage("");

    try {
      if (
        api?.getOrderTracking &&
        order?.orderId
      ) {
        const response =
          await api.getOrderTracking(
            order.orderId
          );

        if (response?.order) {
          setOrder(response.order);
        }

        if (
          Array.isArray(
            response?.events
          )
        ) {
          setEvents(
            response.events
          );
        }
      }

      setLastUpdated(
        new Date()
      );

      setActionMessage(
        "Tracking information updated."
      );
    } catch {
      setActionMessage(
        "Unable to refresh tracking right now."
      );
    } finally {
      setRefreshing(false);
    }
  };

  const trackingNumber =
    order.trackingNumber ||
    order.awb ||
    order.shipment?.trackingNumber ||
    "Not assigned yet";

  const carrier =
    order.carrier ||
    order.shipment?.carrier ||
    "D2C Logistics";

  const status = String(
    order.status ||
      "PROCESSING"
  ).toUpperCase();

  const isDelivered =
    status === "DELIVERED";

  const isCancelled =
    status === "CANCELLED";

  const isShipped =
    [
      "SHIPPED",
      "IN_TRANSIT",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ].includes(status);

  const activeEventIndex =
    useMemo(() => {
      const index =
        events.findIndex(
          (event) =>
            event.active
        );

      if (index >= 0) {
        return index;
      }

      const completed =
        events.filter(
          (event) =>
            event.completed
        );

      return Math.max(
        completed.length - 1,
        0
      );
    }, [events]);

  const visibleEvents =
    showAllEvents
      ? events
      : events.slice(
          0,
          Math.min(events.length, 5)
        );

  const copyTrackingNumber =
    async () => {
      if (
        !trackingNumber ||
        trackingNumber ===
          "Not assigned yet"
      ) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          trackingNumber
        );

        setCopied(true);

        setTimeout(
          () => setCopied(false),
          1800
        );
      } catch {
        setCopied(false);
      }
    };

  const handleCancel = async () => {
    if (!cancelReason) {
      setActionMessage(
        "Please select a cancellation reason."
      );
      return;
    }

    try {
      if (
        api?.cancelOrder
      ) {
        await api.cancelOrder(
          order.orderId,
          cancelReason
        );
      }

      await onCancelOrder?.(
        order,
        cancelReason
      );

      setOrder((current) => ({
        ...current,
        status: "CANCELLED",
      }));

      setShowCancelModal(false);

      setActionMessage(
        "Cancellation request submitted."
      );
    } catch (error) {
      setActionMessage(
        error?.message ||
          "Unable to cancel this order."
      );
    }
  };

  const handleReturn = async () => {
    try {
      await onReturnOrder?.(
        order
      );

      setActionMessage(
        "Return request started."
      );
    } catch (error) {
      setActionMessage(
        error?.message ||
          "Unable to start the return."
      );
    }
  };

  const canCancel =
    !isDelivered &&
    !isCancelled &&
    [
      "PLACED",
      "CONFIRMED",
      "PROCESSING",
      "PACKED",
    ].includes(status);

  const canReturn =
    isDelivered ||
    status === "DELIVERED";

  return (
    <div className="min-h-screen bg-[#fffaf7] text-slate-950">
      {/* HEADER */}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-[9px] font-black"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK
            </button>

            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-500" />

              <span className="text-[10px] font-black">
                TRACK ORDER
              </span>
            </div>

            <button
              type="button"
              onClick={onViewOrders}
              className="hidden sm:block text-[8px] font-black text-slate-500 hover:text-orange-500"
            >
              MY ORDERS
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        {/* TOP ORDER CARD */}

        <section className="relative overflow-hidden rounded-[26px] bg-blue-950 text-white p-6 sm:p-8">
          <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1.5 rounded-lg bg-orange-500 text-[7px] font-black">
                    {formatStatus(
                      status
                    )}
                  </span>

                  {isShipped &&
                    !isDelivered && (
                      <span className="px-2.5 py-1.5 rounded-lg bg-white/10 text-[7px] font-black">
                        IN TRANSIT
                      </span>
                    )}
                </div>

                <p className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-black mt-5">
                  ORDER
                </p>

                <h1 className="text-2xl sm:text-3xl font-black mt-1">
                  {order.orderId ||
                    order.id}
                </h1>

                <p className="text-[8px] text-white/40 mt-2">
                  Placed{" "}
                  {formatDate(
                    order.createdAt
                  )}
                </p>
              </div>

              <div className="md:text-right">
                <p className="text-[7px] text-white/40 font-black">
                  ESTIMATED DELIVERY
                </p>

                <p className="text-xl font-black mt-1">
                  {order.estimatedDelivery ||
                    order.deliveryEta ||
                    "2–5 business days"}
                </p>

                <p className="text-[7px] text-white/40 mt-2">
                  We'll keep you updated automatically.
                </p>
              </div>
            </div>

            {/* TRACKING NUMBER */}

            <div className="mt-7 p-4 rounded-2xl bg-white/10 border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-[7px] text-white/40 font-black">
                    SHIPMENT
                  </p>

                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs font-black">
                      {trackingNumber}
                    </p>

                    <button
                      type="button"
                      onClick={
                        copyTrackingNumber
                      }
                      className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center"
                    >
                      {copied ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-[7px] text-white/40 font-black">
                    CARRIER
                  </p>

                  <p className="text-[9px] font-black mt-1">
                    {carrier}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE REFRESH */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                refreshing ||
                loading
                  ? "bg-orange-500 animate-pulse"
                  : "bg-green-500"
              }`}
            />

            <p className="text-[7px] text-slate-400">
              Last updated{" "}
              {formatTime(
                lastUpdated
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={
              refreshTracking
            }
            disabled={refreshing}
            className="inline-flex items-center gap-2 w-fit px-3 py-2 rounded-lg bg-white border border-slate-200 text-[7px] font-black disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3 h-3 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />
            REFRESH STATUS
          </button>
        </div>

        {actionMessage && (
          <div className="mt-3 rounded-xl bg-green-50 border border-green-100 p-3">
            <p className="text-[8px] font-black text-green-700">
              {actionMessage}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 mt-5">
          {/* LEFT */}

          <div className="space-y-5">
            {/* VISUAL PROGRESS */}

            <section className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.18em] font-black text-orange-500">
                    LIVE JOURNEY
                  </p>

                  <h2 className="text-xl font-black mt-1">
                    {isDelivered
                      ? "Delivered successfully"
                      : isCancelled
                      ? "Order cancelled"
                      : "Your package is on its way"}
                  </h2>
                </div>

                <div className="hidden sm:flex w-11 h-11 rounded-xl bg-orange-50 items-center justify-center">
                  {isDelivered ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : isCancelled ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Truck className="w-5 h-5 text-orange-500" />
                  )}
                </div>
              </div>

              <div className="relative mt-8">
                <div className="absolute left-[18px] right-[18px] top-[18px] h-1 bg-slate-100 rounded-full" />

                <div
                  className="absolute left-[18px] top-[18px] h-1 bg-orange-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      (activeEventIndex /
                        Math.max(
                          events.length -
                            1,
                          1
                        )) *
                        100,
                      100
                    )}%`,
                  }}
                />

                <div className="relative flex justify-between">
                  {events
                    .slice(
                      0,
                      4
                    )
                    .map(
                      (
                        event,
                        index
                      ) => (
                        <ProgressNode
                          key={
                            event.id ||
                            index
                          }
                          event={
                            event
                          }
                          active={
                            index <=
                            activeEventIndex
                          }
                        />
                      )
                    )}
                </div>
              </div>
            </section>

            {/* TRACKING EVENTS */}

            <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black">
                    Tracking Updates
                  </h2>

                  <p className="text-[7px] text-slate-400 mt-1">
                    Every movement, from warehouse to doorstep.
                  </p>
                </div>

                <span className="text-[7px] font-black text-slate-400">
                  {events.length} EVENTS
                </span>
              </div>

              <div className="p-5">
                <div className="relative">
                  <div className="absolute left-[15px] top-3 bottom-3 w-px bg-slate-200" />

                  <div className="space-y-6">
                    {visibleEvents.map(
                      (
                        event,
                        index
                      ) => (
                        <TrackingEvent
                          key={
                            event.id ||
                            index
                          }
                          event={
                            event
                          }
                          active={
                            index ===
                            activeEventIndex
                          }
                          last={
                            index ===
                            visibleEvents.length -
                              1
                          }
                        />
                      )
                    )}
                  </div>
                </div>

                {events.length >
                  5 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllEvents(
                        (current) =>
                          !current
                      )
                    }
                    className="w-full mt-6 h-10 rounded-xl bg-slate-50 text-[8px] font-black flex items-center justify-center gap-2"
                  >
                    {showAllEvents
                      ? "SHOW LESS"
                      : "VIEW ALL TRACKING UPDATES"}

                    <ChevronDown
                      className={`w-3.5 h-3.5 transition ${
                        showAllEvents
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                )}
              </div>
            </section>

            {/* CURRENT LOCATION */}

            <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.18em] font-black text-orange-500">
                      CURRENT LOCATION
                    </p>

                    <h2 className="text-xl font-black mt-1">
                      {order.currentLocation ||
                        order.shipment
                          ?.currentLocation ||
                        "In transit"}
                    </h2>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-500" />
                  </div>
                </div>

                <div className="relative h-32 rounded-xl bg-slate-100 mt-5 overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute left-[15%] top-[25%] w-32 h-1 bg-white rotate-12" />
                    <div className="absolute left-[45%] top-[50%] w-40 h-1 bg-white -rotate-6" />
                    <div className="absolute right-[5%] top-[30%] w-28 h-1 bg-white rotate-45" />
                    <div className="absolute left-[30%] bottom-[15%] w-36 h-1 bg-white rotate-45" />
                  </div>

                  <div className="absolute left-[24%] top-[38%] w-3 h-3 rounded-full bg-orange-500 ring-8 ring-orange-500/10" />

                  <div className="absolute left-[51%] top-[49%] w-3 h-3 rounded-full bg-orange-500 ring-8 ring-orange-500/10" />

                  <div className="absolute right-[20%] top-[28%] w-4 h-4 rounded-full bg-green-500 ring-8 ring-green-500/10" />

                  <div className="absolute left-[51%] top-[49%] h-px w-[25%] bg-orange-500 rotate-[-12deg] origin-left" />

                  <div className="absolute right-[16%] top-[22%] px-3 py-2 rounded-lg bg-white shadow-lg">
                    <p className="text-[7px] font-black">
                      PACKAGE
                    </p>

                    <p className="text-[6px] text-slate-400 mt-1">
                      Moving to you
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-950 text-white flex items-center justify-center">
                      <Truck className="w-3.5 h-3.5" />
                    </div>

                    <div>
                      <p className="text-[8px] font-black">
                        {carrier}
                      </p>

                      <p className="text-[6px] text-slate-400 mt-1">
                        Shipment in transit
                      </p>
                    </div>
                  </div>

                  <span className="text-[7px] font-black text-green-600">
                    LIVE
                  </span>
                </div>
              </div>
            </section>

            {/* PACKAGE */}

            <section className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Package className="w-4 h-4 text-orange-500" />
                </div>

                <div>
                  <h2 className="text-sm font-black">
                    Package Details
                  </h2>

                  <p className="text-[7px] text-slate-400 mt-1">
                    {order.items?.length ||
                      0}{" "}
                    products in this shipment
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-5">
                {(
                  order.items ||
                  []
                ).map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.id ||
                        index
                      }
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50"
                    >
                      <div className="w-12 h-12 rounded-lg bg-white overflow-hidden flex-shrink-0">
                        {item.image && (
                          <img
                            src={
                              item.image
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[7px] text-slate-400 font-black">
                          {item.brand ||
                            "D2C"}
                        </p>

                        <p className="text-[9px] font-black truncate mt-1">
                          {item.name ||
                            item.title}
                        </p>
                      </div>

                      <span className="text-[8px] font-black">
                        ×
                        {item.quantity ||
                          1}
                      </span>
                    </div>
                  )
                )}
              </div>
            </section>
          </div>

          {/* RIGHT */}

          <aside className="lg:sticky lg:top-24 h-fit space-y-3">
            {/* ADDRESS */}

            <section className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <p className="text-[8px] uppercase tracking-[0.12em] font-black">
                  DELIVERING TO
                </p>

                <Home className="w-3.5 h-3.5 text-orange-500" />
              </div>

              <p className="text-[10px] font-black mt-4">
                {order.address?.name ||
                  order.customer?.name}
              </p>

              <p className="text-[8px] text-slate-500 leading-relaxed mt-2">
                {
                  order.address
                    ?.address
                }
                ,{" "}
                {
                  order.address
                    ?.city
                }
                ,{" "}
                {
                  order.address
                    ?.state
                }{" "}
                -{" "}
                {
                  order.address
                    ?.pincode
                }
              </p>

              <div className="flex items-center gap-2 mt-3 text-[8px] text-slate-500">
                <Phone className="w-3 h-3" />
                {order.address
                  ?.phone ||
                  order.customer
                    ?.phone}
              </div>
            </section>

            {/* SHIPMENT */}

            <section className="bg-white rounded-2xl border border-slate-100 p-5">
              <p className="text-[8px] uppercase tracking-[0.12em] font-black">
                SHIPMENT DETAILS
              </p>

              <div className="space-y-3 mt-4">
                <ShipmentRow
                  label="Carrier"
                  value={carrier}
                />

                <ShipmentRow
                  label="Tracking ID"
                  value={
                    trackingNumber
                  }
                  copy
                  onCopy={
                    copyTrackingNumber
                  }
                />

                <ShipmentRow
                  label="Delivery"
                  value={
                    order.estimatedDelivery ||
                    order.deliveryEta ||
                    "2–5 days"
                  }
                />

                <ShipmentRow
                  label="Payment"
                  value={
                    order.paymentStatus ||
                    "PAID"
                  }
                  green
                />
              </div>
            </section>

            {/* ORDER VALUE */}

            <section className="bg-white rounded-2xl border border-slate-100 p-5">
              <p className="text-[8px] uppercase tracking-[0.12em] font-black">
                ORDER VALUE
              </p>

              <div className="flex items-center justify-between mt-4">
                <span className="text-[9px] text-slate-500">
                  Total paid
                </span>

                <span className="text-xl font-black">
                  {formatCurrency(
                    order.totals
                      ?.total ||
                      order.total ||
                      order.amount
                  )}
                </span>
              </div>
            </section>

            {/* ACTIONS */}

            {!isCancelled && (
              <section className="bg-white rounded-2xl border border-slate-100 p-5">
                <p className="text-[8px] uppercase tracking-[0.12em] font-black">
                  MANAGE ORDER
                </p>

                <div className="space-y-2 mt-4">
                  {canCancel && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowCancelModal(
                          true
                        )
                      }
                      className="w-full h-10 rounded-xl border border-red-100 text-red-600 text-[8px] font-black flex items-center justify-center gap-2 hover:bg-red-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      CANCEL ORDER
                    </button>
                  )}

                  {canReturn && (
                    <button
                      type="button"
                      onClick={
                        handleReturn
                      }
                      className="w-full h-10 rounded-xl border border-slate-200 text-[8px] font-black flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      RETURN / REPLACE
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      onContactSupport?.(
                        order
                      )
                    }
                    className="w-full h-10 rounded-xl bg-blue-950 text-white text-[8px] font-black flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    GET HELP
                  </button>
                </div>
              </section>
            )}

            {/* SUPPORT */}

            <section className="rounded-2xl bg-orange-50 border border-orange-100 p-5">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-4 h-4 text-orange-500 mt-0.5" />

                <div>
                  <p className="text-[9px] font-black text-orange-800">
                    SOMETHING NOT RIGHT?
                  </p>

                  <p className="text-[7px] text-orange-700/60 mt-2 leading-relaxed">
                    If your shipment is delayed or the package has an issue, contact support and we'll help resolve it.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      onContactSupport?.(
                        order
                      )
                    }
                    className="mt-3 text-[8px] font-black text-orange-700 inline-flex items-center gap-1"
                  >
                    CONTACT SUPPORT
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* BOTTOM CTA */}

        <section className="mt-6 rounded-2xl bg-blue-950 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[8px] uppercase tracking-[0.18em] font-black text-orange-400">
              KEEP SHOPPING
            </p>

            <h2 className="text-lg font-black mt-1">
              Find your next favourite.
            </h2>

            <p className="text-[7px] text-white/40 mt-1">
              New drops, flash sales and customer favourites are waiting.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onContinueShopping
            }
            className="h-10 px-5 rounded-xl bg-orange-500 text-white text-[8px] font-black inline-flex items-center justify-center gap-2"
          >
            SHOP NOW
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      </main>

      {/* CANCEL MODAL */}

      {showCancelModal && (
        <CancelModal
          reason={cancelReason}
          setReason={
            setCancelReason
          }
          onClose={() =>
            setShowCancelModal(
              false
            )
          }
          onConfirm={
            handleCancel
          }
        />
      )}
    </div>
  );
}

/* ============================================================
   PROGRESS NODE
============================================================ */

function ProgressNode({
  event,
  active,
}) {
  const Icon =
    event.icon ||
    getEventIcon(
      event.id
    );

  return (
    <div className="relative z-10 w-20 sm:w-28 text-center">
      <div
        className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center ${
          active
            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <p
        className={`text-[6px] sm:text-[7px] font-black mt-2 ${
          active
            ? "text-slate-800"
            : "text-slate-400"
        }`}
      >
        {event.title}
      </p>
    </div>
  );
}

/* ============================================================
   TRACKING EVENT
============================================================ */

function TrackingEvent({
  event,
  active,
  last,
}) {
  const Icon =
    event.icon ||
    getEventIcon(
      event.id
    );

  return (
    <div className="relative flex gap-4">
      <div
        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          event.completed ||
          active
            ? active
              ? "bg-orange-500 text-white"
              : "bg-green-600 text-white"
            : "bg-slate-100 text-slate-300"
        }`}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>

      <div className="flex-1 pb-1">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <p
              className={`text-[10px] font-black ${
                active
                  ? "text-orange-600"
                  : ""
              }`}
            >
              {event.title}
            </p>

            <p className="text-[8px] text-slate-500 mt-1">
              {event.description}
            </p>

            {event.location && (
              <div className="flex items-center gap-1 mt-2 text-[7px] text-slate-400">
                <MapPin className="w-2.5 h-2.5" />
                {event.location}
              </div>
            )}
          </div>

          <span className="text-[7px] font-bold text-slate-400 whitespace-nowrap">
            {event.time}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SHIPMENT ROW
============================================================ */

function ShipmentRow({
  label,
  value,
  copy,
  onCopy,
  green,
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[8px] text-slate-400">
        {label}
      </span>

      <div className="flex items-center gap-2 text-right">
        <span
          className={`text-[8px] font-black ${
            green
              ? "text-green-600"
              : ""
          }`}
        >
          {value}
        </span>

        {copy && (
          <button
            type="button"
            onClick={onCopy}
            className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center"
          >
            <Copy className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   CANCEL MODAL
============================================================ */

function CancelModal({
  reason,
  setReason,
  onClose,
  onConfirm,
}) {
  const reasons = [
    "Ordered by mistake",
    "Found a better price",
    "Delivery is taking too long",
    "No longer needed",
    "Want to change the product",
    "Other",
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black">
              Cancel Order
            </h2>

            <p className="text-[7px] text-slate-400 mt-1">
              Please tell us why you're cancelling.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          <div className="space-y-2">
            {reasons.map(
              (item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() =>
                    setReason(
                      item
                    )
                  }
                  className={`w-full text-left p-3 rounded-xl border text-[8px] font-bold ${
                    reason === item
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-slate-200"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <div className="flex gap-2 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-slate-200 text-[8px] font-black"
            >
              KEEP ORDER
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 h-11 rounded-xl bg-red-500 text-white text-[8px] font-black"
            >
              CANCEL ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function getEventIcon(
  id
) {
  switch (
    String(id || "").toLowerCase()
  ) {
    case "placed":
      return ShoppingBag;

    case "confirmed":
      return Check;

    case "packed":
      return PackageCheck;

    case "shipped":
      return Truck;

    case "out-for-delivery":
      return Zap;

    case "delivered":
      return Home;

    default:
      return Package;
  }
}

function formatStatus(
  status
) {
  return String(status || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );
}

function formatCurrency(
  value
) {
  return `₹${Number(
    value || 0
  ).toLocaleString(
    "en-IN"
  )}`;
}

function formatDate(
  value
) {
  if (!value) {
    return "recently";
  }

  const date = new Date(
    value
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function formatTime(
  value
) {
  if (!value) {
    return "just now";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "just now";
  }

  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
}