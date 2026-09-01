import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  Gift,
  Home,
  MessageCircle,
  PackageCheck,
  Share2,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";

const FALLBACK_ORDER = {
  orderId: "D2C-84729163",
  status: "CONFIRMED",
  createdAt: new Date().toISOString(),
  paymentMethod: "UPI",
  paymentStatus: "PAID",
  deliveryOption: "standard",
  estimatedDelivery: "2–5 business days",
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
    subtotal: 829,
    discount: 470,
    couponDiscount: 0,
    delivery: 79,
    total: 908,
  },
};

export default function OrderConfirmationView({
  order: initialOrder,
  api,
  onTrackOrder,
  onContinueShopping,
  onViewOrders,
}) {
  const order = initialOrder || FALLBACK_ORDER;

  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const orderItems = order.items || [];

  const totalItems = useMemo(
    () =>
      orderItems.reduce(
        (sum, item) =>
          sum + Number(item.quantity || 1),
        0
      ),
    [orderItems]
  );

  const orderId =
    order.orderId ||
    order.id ||
    "D2C-ORDER";

  const total =
    Number(
      order.totals?.total ||
        order.total ||
        order.amount ||
        0
    );

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(
        orderId
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

  const shareOrder = async () => {
    setSharing(true);

    const shareData = {
      title: "My D2C Order",
      text: `My order ${orderId} has been confirmed.`,
    };

    try {
      if (
        navigator.share
      ) {
        await navigator.share(
          shareData
        );
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text}`
        );

        setCopied(true);

        setTimeout(
          () => setCopied(false),
          1800
        );
      }
    } catch {
      // User cancelled native share.
    } finally {
      setSharing(false);
    }
  };

  const downloadInvoice = async () => {
    if (api?.downloadInvoice) {
      try {
        await api.downloadInvoice(
          orderId
        );
        return;
      } catch {
        // Fall through to printable invoice.
      }
    }

    window.print();
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] text-slate-950">
      {/* HEADER */}

      <header className="bg-white border-b border-slate-100">
        <div className="max-w-[1150px] mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <button
              type="button"
              onClick={
                onContinueShopping
              }
              className="inline-flex items-center gap-2 text-[9px] font-black"
            >
              <ArrowLeft className="w-4 h-4" />
              CONTINUE SHOPPING
            </button>

            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-500" />

              <span className="text-[10px] font-black">
                ORDER CONFIRMED
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

      <main className="max-w-[1150px] mx-auto px-4 sm:px-6 py-8">
        {/* SUCCESS HERO */}

        <section className="relative overflow-hidden rounded-[28px] bg-blue-950 text-white p-7 sm:p-10">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="absolute -left-20 -bottom-32 w-72 h-72 rounded-full bg-pink-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-xl">
              <Check className="w-9 h-9 text-white" />
            </div>

            <p className="text-[8px] uppercase tracking-[0.25em] font-black text-orange-400 mt-6">
              PAYMENT SUCCESSFUL
            </p>

            <h1 className="text-3xl sm:text-4xl font-black mt-2">
              Your order is confirmed!
            </h1>

            <p className="text-xs text-white/50 max-w-md mt-3 leading-relaxed">
              Thank you for shopping with us. We've received your order and our fulfilment team is already getting it ready.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur">
                <p className="text-[6px] text-white/40 font-black">
                  ORDER ID
                </p>

                <p className="text-[9px] font-black mt-1">
                  {orderId}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  copyOrderId
                }
                className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 flex items-center gap-2 text-[7px] font-black"
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}

                {copied
                  ? "COPIED"
                  : "COPY"}
              </button>
            </div>
          </div>
        </section>

        {/* DELIVERY TIMELINE */}

        <section className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-7 mt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[8px] uppercase tracking-[0.18em] font-black text-orange-500">
                DELIVERY STATUS
              </p>

              <h2 className="text-xl font-black mt-1">
                We're getting it ready
              </h2>

              <p className="text-[8px] text-slate-400 mt-1">
                Estimated delivery:{" "}
                <span className="font-black text-slate-600">
                  {order.estimatedDelivery ||
                    order.deliveryEta ||
                    "2–5 business days"}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onTrackOrder?.(
                  order
                )
              }
              className="h-10 px-5 rounded-xl bg-orange-500 text-white text-[8px] font-black inline-flex items-center justify-center gap-2"
            >
              TRACK ORDER
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-8">
            <TimelineStep
              icon={Check}
              label="Order Placed"
              done
            />

            <TimelineStep
              icon={PackageCheck}
              label="Processing"
              active
            />

            <TimelineStep
              icon={Truck}
              label="Shipped"
            />

            <TimelineStep
              icon={Home}
              label="Delivered"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 mt-5">
          {/* LEFT */}

          <div className="space-y-5">
            {/* ITEMS */}

            <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black">
                    Your Items
                  </h2>

                  <p className="text-[7px] text-slate-400 mt-1">
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "item"
                      : "items"}{" "}
                    in this order
                  </p>
                </div>

                <span className="px-2.5 py-1.5 rounded-lg bg-green-50 text-[7px] font-black text-green-600">
                  CONFIRMED
                </span>
              </div>

              <div>
                {orderItems.map(
                  (
                    item,
                    index
                  ) => (
                    <OrderItem
                      key={
                        item.id ||
                        item.productId ||
                        index
                      }
                      item={
                        item
                      }
                      last={
                        index ===
                        orderItems.length -
                          1
                      }
                    />
                  )
                )}
              </div>
            </section>

            {/* ADDRESS */}

            <section className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Home className="w-4 h-4 text-orange-500" />
                </div>

                <div>
                  <h2 className="text-sm font-black">
                    Delivery Address
                  </h2>

                  <p className="text-[7px] text-slate-400 mt-1">
                    Your order will be delivered here
                  </p>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <p className="text-[9px] font-black">
                    {
                      order.address
                        ?.name
                    }
                  </p>

                  <span className="px-2 py-0.5 rounded-md bg-white text-[6px] font-black">
                    {order.address
                      ?.type ||
                      "Home"}
                  </span>
                </div>

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

                <p className="text-[8px] text-slate-500 mt-2">
                  {order.address
                    ?.phone ||
                    order.customer
                      ?.phone}
                </p>
              </div>
            </section>

            {/* PAYMENT */}

            <section className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>

                <div>
                  <h2 className="text-sm font-black">
                    Payment
                  </h2>

                  <p className="text-[7px] text-slate-400 mt-1">
                    Your payment has been successfully processed.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                <InfoBox
                  label="METHOD"
                  value={
                    order.paymentMethod ||
                    "UPI"
                  }
                />

                <InfoBox
                  label="STATUS"
                  value={
                    order.paymentStatus ||
                    "PAID"
                  }
                  green
                />

                <InfoBox
                  label="AMOUNT"
                  value={formatCurrency(
                    total
                  )}
                />
              </div>
            </section>

            {/* ACTIONS */}

            <section className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <ActionButton
                  icon={Truck}
                  text="Track Order"
                  onClick={() =>
                    onTrackOrder?.(
                      order
                    )
                  }
                  primary
                />

                <ActionButton
                  icon={Download}
                  text="Invoice"
                  onClick={
                    downloadInvoice
                  }
                />

                <ActionButton
                  icon={Share2}
                  text={
                    sharing
                      ? "Sharing..."
                      : "Share Order"
                  }
                  onClick={
                    shareOrder
                  }
                />
              </div>
            </section>
          </div>

          {/* RIGHT */}

          <aside className="lg:sticky lg:top-24 h-fit space-y-3">
            {/* SUMMARY */}

            <section className="bg-white rounded-2xl border border-slate-100 p-5">
              <h2 className="text-sm font-black">
                Order Summary
              </h2>

              <div className="space-y-3 mt-5">
                <SummaryRow
                  label="Items"
                  value={formatCurrency(
                    order.totals
                      ?.subtotal ||
                      0
                  )}
                />

                <SummaryRow
                  label="Discount"
                  value={`-${formatCurrency(
                    order.totals
                      ?.discount ||
                      0
                  )}`}
                  green
                />

                {Number(
                  order.totals
                    ?.couponDiscount ||
                    0
                ) > 0 && (
                  <SummaryRow
                    label="Coupon"
                    value={`-${formatCurrency(
                      order.totals
                        .couponDiscount
                    )}`}
                    green
                  />
                )}

                <SummaryRow
                  label="Delivery"
                  value={
                    Number(
                      order.totals
                        ?.delivery ||
                        0
                    ) === 0
                      ? "FREE"
                      : formatCurrency(
                          order.totals
                            .delivery
                        )
                  }
                  green={
                    Number(
                      order.totals
                        ?.delivery ||
                        0
                    ) === 0
                  }
                />

                <div className="border-t border-dashed border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">
                      Paid
                    </span>

                    <span className="text-xl font-black">
                      {formatCurrency(
                        total
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* NEXT STEPS */}

            <section className="rounded-2xl bg-orange-50 border border-orange-100 p-5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />

                <p className="text-[9px] font-black text-orange-800">
                  WHAT HAPPENS NEXT?
                </p>
              </div>

              <div className="space-y-4 mt-5">
                <NextStep
                  number="01"
                  title="We pack your order"
                  text="Our fulfilment team prepares your items."
                />

                <NextStep
                  number="02"
                  title="Your order ships"
                  text="You'll receive tracking details automatically."
                />

                <NextStep
                  number="03"
                  title="It arrives at your door"
                  text="Track the delivery right from your account."
                />
              </div>
            </section>

            {/* SUPPORT */}

            <section className="bg-blue-950 text-white rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-orange-400" />

                <div>
                  <p className="text-[9px] font-black">
                    NEED HELP?
                  </p>

                  <p className="text-[7px] text-white/40 mt-1">
                    Our support team is here for you.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 w-full h-9 rounded-lg bg-white/10 hover:bg-white/20 text-[8px] font-black"
              >
                CONTACT SUPPORT
              </button>
            </section>
          </aside>
        </div>

        {/* REVIEW CTA */}

        <section className="mt-5 rounded-2xl bg-white border border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1">
              {[1, 2, 3, 4, 5].map(
                (item) => (
                  <Star
                    key={item}
                    className="w-4 h-4 fill-orange-400 text-orange-400"
                  />
                )
              )}
            </div>

            <div>
              <p className="text-[9px] font-black">
                LOVE YOUR PURCHASE?
              </p>

              <p className="text-[7px] text-slate-400 mt-1">
                Share your experience with the community.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="h-10 px-5 rounded-xl border border-slate-200 text-[8px] font-black hover:border-orange-500"
          >
            WRITE A REVIEW
          </button>
        </section>

        {/* FINAL CTA */}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-7">
          <button
            type="button"
            onClick={
              onContinueShopping
            }
            className="w-full sm:w-auto h-11 px-7 rounded-xl bg-orange-500 text-white text-[9px] font-black inline-flex items-center justify-center gap-2"
          >
            CONTINUE SHOPPING
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onViewOrders}
            className="w-full sm:w-auto h-11 px-7 rounded-xl border border-slate-200 text-[9px] font-black"
          >
            VIEW ALL ORDERS
          </button>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   ORDER ITEM
============================================================ */

function OrderItem({
  item,
  last,
}) {
  return (
    <div
      className={`p-5 flex gap-4 ${
        !last
          ? "border-b border-slate-100"
          : ""
      }`}
    >
      <div className="w-20 h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            🛍️
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[7px] uppercase tracking-[0.12em] text-orange-500 font-black">
          {item.brand ||
            "D2C"}
        </p>

        <p className="text-xs font-black mt-1">
          {item.name ||
            item.title ||
            "Product"}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {item.size && (
            <span className="px-2 py-1 rounded-md bg-slate-50 text-[6px] font-bold text-slate-500">
              Size:{" "}
              {item.size}
            </span>
          )}

          {item.color && (
            <span className="px-2 py-1 rounded-md bg-slate-50 text-[6px] font-bold text-slate-500">
              {item.color}
            </span>
          )}

          <span className="px-2 py-1 rounded-md bg-slate-50 text-[6px] font-bold text-slate-500">
            Qty:{" "}
            {item.quantity ||
              1}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm font-black">
            {formatCurrency(
              Number(
                item.price || 0
              ) *
                Number(
                  item.quantity ||
                    1
                )
            )}
          </span>

          {item.mrp && (
            <span className="text-[7px] text-slate-400 line-through">
              {formatCurrency(
                Number(
                  item.mrp
                ) *
                  Number(
                    item.quantity ||
                      1
                  )
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TIMELINE
============================================================ */

function TimelineStep({
  icon: Icon,
  label,
  done,
  active,
}) {
  return (
    <div className="relative text-center">
      <div
        className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center ${
          done
            ? "bg-green-600 text-white"
            : active
            ? "bg-orange-500 text-white"
            : "bg-slate-100 text-slate-300"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <p
        className={`text-[7px] font-black mt-2 ${
          done || active
            ? "text-slate-800"
            : "text-slate-300"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

/* ============================================================
   SUMMARY
============================================================ */

function SummaryRow({
  label,
  value,
  green,
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[8px] text-slate-500">
        {label}
      </span>

      <span
        className={`text-[9px] font-black ${
          green
            ? "text-green-600"
            : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function InfoBox({
  label,
  value,
  green,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[6px] text-slate-400 font-black">
        {label}
      </p>

      <p
        className={`text-[9px] font-black mt-1 ${
          green
            ? "text-green-600"
            : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   ACTIONS
============================================================ */

function ActionButton({
  icon: Icon,
  text,
  onClick,
  primary,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 rounded-xl text-[8px] font-black flex items-center justify-center gap-2 ${
        primary
          ? "bg-orange-500 text-white"
          : "border border-slate-200 text-slate-700 hover:border-orange-500"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {text}
    </button>
  );
}

function NextStep({
  number,
  title,
  text,
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-white text-orange-600 flex items-center justify-center text-[7px] font-black flex-shrink-0">
        {number}
      </div>

      <div>
        <p className="text-[8px] font-black text-orange-800">
          {title}
        </p>

        <p className="text-[7px] text-orange-700/50 mt-1 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function formatCurrency(
  value
) {
  return `₹${Number(
    value || 0
  ).toLocaleString(
    "en-IN"
  )}`;
}