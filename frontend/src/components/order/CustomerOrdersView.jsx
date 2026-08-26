import React, { useEffect, useMemo, useState } from 'react';
import {
  Package,
  Calendar,
  CheckCircle2,
  RotateCcw,
  Truck,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock3,
  ShieldCheck,
  ShoppingBag,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  CreditCard,
  X,
  Navigation,
  Warehouse,
  Copy,
  Check,
  FileText,
  Phone,
  MessageCircle,
  Download,
  IndianRupee,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';

export default function CustomerOrdersView() {
  const [orders, setOrders] = useState([]);
  const [returnModalOrder, setReturnModalOrder] = useState(null);
  const [trackingShipment, setTrackingShipment] = useState(null);
  const [returnReason, setReturnReason] = useState('Wrong size');
  const [refundMethod, setRefundMethod] = useState('ORIGINAL');
  const [returnSuccess, setReturnSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedOrders, setExpandedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReturn, setSubmittingReturn] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await api.getCustomerOrders();
      setOrders(data || []);
    } catch (e) {
      setError(e?.message || 'Unable to load your orders right now.');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleTrackShipment = async (pkg) => {
    try {
      const order = await api.trackOrder(pkg.awb || pkg.shipmentId);

      const shipment =
        order.fulfillments?.find(
          (item) =>
            item.shipmentId === pkg.shipmentId ||
            item.awb === pkg.awb
        ) || pkg;

      setTrackingShipment({
        ...shipment,
        orderId: order.orderId
      });
    } catch (err) {
      setError(err?.message || 'Unable to load shipment tracking.');
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();

    if (!returnModalOrder) return;

    setSubmittingReturn(true);

    try {
      await api.requestReturn({
        orderId: returnModalOrder.orderId,
        reason: returnReason,
        refundMethod
      });

      setReturnSuccess(
        `Return request for order #${returnModalOrder.orderId} has been submitted successfully.`
      );

      setReturnModalOrder(null);
      await loadOrders();

      setTimeout(() => setReturnSuccess(''), 5000);
    } catch (err) {
      setError(err?.message || 'Unable to submit the return request.');
    } finally {
      setSubmittingReturn(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        String(order.orderId || '').toLowerCase().includes(query) ||
        order.fulfillments?.some(
          (pkg) =>
            String(pkg.item || '').toLowerCase().includes(query) ||
            String(pkg.brand || '').toLowerCase().includes(query) ||
            String(pkg.awb || '').toLowerCase().includes(query) ||
            String(pkg.shipmentId || '').toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === 'ALL' ||
        getOrderFilterStatus(order) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const delivered = orders.filter(
      (order) => order.status === 'DELIVERED'
    ).length;

    const active = orders.filter(
      (order) =>
        order.status !== 'DELIVERED' &&
        !order.returnRequested
    ).length;

    const returns = orders.filter(
      (order) => order.returnRequested
    ).length;

    const totalSpend = orders.reduce(
      (sum, order) =>
        sum + Number(order.summary?.totalPaid || 0),
      0
    );

    return {
      total: orders.length,
      active,
      delivered,
      returns,
      totalSpend
    };
  }, [orders]);

  return (
    <div className="max-w-7xl mx-auto space-y-7">
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              D2C Mall Customer Hub
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mt-3">
              Orders, Tracking & Returns
            </h2>

            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Track every package, manage returns, access invoices and
              monitor your complete D2C Mall purchase journey.
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-black hover:bg-slate-100 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Orders
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
          <HubMetric
            label="Orders"
            value={stats.total}
            icon={ShoppingBag}
          />
          <HubMetric
            label="In Progress"
            value={stats.active}
            icon={Truck}
          />
          <HubMetric
            label="Delivered"
            value={stats.delivered}
            icon={CheckCircle2}
          />
          <HubMetric
            label="Total Spent"
            value={`₹${stats.totalSpend.toLocaleString('en-IN')}`}
            icon={IndianRupee}
          />
        </div>
      </div>

      {returnSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-black">
              Return request submitted
            </p>
            <p className="text-xs mt-1">
              {returnSuccess}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-sm font-black">
                Something went wrong
              </p>
              <p className="text-xs mt-1">
                {error}
              </p>
            </div>
          </div>

          <button
            onClick={() => setError('')}
            className="text-xs font-black"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order ID, product, brand or AWB..."
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-blue-500 transition"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {[
              ['ALL', 'All Orders'],
              ['ACTIVE', 'In Progress'],
              ['DELIVERED', 'Delivered'],
              ['RETURNED', 'Returns']
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  statusFilter === value
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard
            icon={Truck}
            title="Track every shipment"
            text="Orders can arrive in separate packages from different regional hubs."
          />
          <InsightCard
            icon={ShieldCheck}
            title="Secure purchases"
            text="Your payment, shipment and return information stays linked to the order."
          />
          <InsightCard
            icon={RotateCcw}
            title="Easy returns"
            text="Request eligible returns directly from your order history."
          />
        </div>
      )}

      {loading ? (
        <OrdersLoading />
      ) : filteredOrders.length === 0 ? (
        <EmptyOrders
          hasSearch={Boolean(searchQuery)}
          hasOrders={orders.length > 0}
          onClear={() => {
            setSearchQuery('');
            setStatusFilter('ALL');
          }}
        />
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const expanded =
              expandedOrders[order.orderId] ?? true;

            return (
              <OrderCard
                key={order.orderId}
                order={order}
                expanded={expanded}
                onToggle={() => toggleOrder(order.orderId)}
                onReturn={() => setReturnModalOrder(order)}
                onTrack={handleTrackShipment}
              />
            );
          })}
        </div>
      )}

      {returnModalOrder && (
        <ReturnModal
          order={returnModalOrder}
          returnReason={returnReason}
          setReturnReason={setReturnReason}
          refundMethod={refundMethod}
          setRefundMethod={setRefundMethod}
          submitting={submittingReturn}
          onClose={() => setReturnModalOrder(null)}
          onSubmit={handleReturnSubmit}
        />
      )}

      {trackingShipment && (
        <TrackingModal
          shipment={trackingShipment}
          onClose={() => setTrackingShipment(null)}
        />
      )}
    </div>
  );
}

function OrderCard({
  order,
  expanded,
  onToggle,
  onReturn,
  onTrack
}) {
  const orderStatus = getOrderStatusLabel(order);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-black text-slate-950">
                Order #{order.orderId}
              </span>

              <StatusBadge status={orderStatus} />

              {order.paymentStatus && (
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  Payment: {order.paymentStatus}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(order.placedAt)}
              </span>

              <span className="hidden sm:inline text-slate-300">
                •
              </span>

              <span>
                Total:{' '}
                <strong className="text-slate-900">
                  ₹{Number(
                    order.summary?.totalPaid || 0
                  ).toLocaleString('en-IN')}
                </strong>
              </span>

              {order.customer?.city && (
                <>
                  <span className="hidden sm:inline text-slate-300">
                    •
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {order.customer.city}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {order.status === 'DELIVERED' &&
              !order.returnRequested && (
                <button
                  onClick={onReturn}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Return / Exchange
                </button>
              )}

            {order.returnRequested && (
              <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold px-3 py-2 rounded-xl">
                <RotateCcw className="w-3.5 h-3.5" />
                Return Requested
              </span>
            )}

            <button
              onClick={onToggle}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50"
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100">
          {order.fulfillments?.length > 1 && (
            <div className="mx-5 sm:mx-6 mt-5 bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-sm font-black text-blue-950">
                    Your order is arriving in {order.fulfillments.length} packages
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Items are being fulfilled from different inventory locations for faster delivery.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-5 sm:p-6 space-y-4">
            {order.fulfillments?.map((pkg, index) => (
              <ShipmentCard
                key={
                  pkg.shipmentId ||
                  `${order.orderId}-${index}`
                }
                pkg={pkg}
                index={index}
                onTrack={onTrack}
              />
            ))}
          </div>

          <div className="border-t border-slate-100 px-5 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Secure order
                </span>

                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                  GST invoice
                </span>

                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-orange-500" />
                  Pan-India delivery
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    alert(
                      `Invoice: ${
                        order.invoiceNumber ||
                        'Invoice will be available after processing'
                      }`
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Invoice
                </button>

                <button
                  onClick={() =>
                    alert(
                      'Reorder functionality will connect to the product/cart service.'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50"
                >
                  Reorder
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShipmentCard({ pkg, index, onTrack }) {
  const status = normalizeStatus(pkg.status);

  const timeline = [
    {
      label: 'Confirmed',
      complete: true
    },
    {
      label: 'Packed',
      complete: [
        'SHIPPED',
        'IN_TRANSIT',
        'OUT_FOR_DELIVERY',
        'DELIVERED'
      ].includes(status)
    },
    {
      label: 'In Transit',
      complete: [
        'IN_TRANSIT',
        'OUT_FOR_DELIVERY',
        'DELIVERED'
      ].includes(status)
    },
    {
      label: 'Out for Delivery',
      complete: [
        'OUT_FOR_DELIVERY',
        'DELIVERED'
      ].includes(status)
    },
    {
      label: 'Delivered',
      complete: status === 'DELIVERED'
    }
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
              <img
                src={pkg.image}
                alt={pkg.item}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider font-black text-slate-400">
                Package {index + 1}
              </p>

              <h4 className="font-black text-slate-900 text-sm mt-0.5">
                {pkg.item}
              </h4>

              <p className="text-[11px] text-slate-500 mt-1">
                {pkg.brand} · Qty {pkg.qty}
              </p>
            </div>
          </div>

          <div className="lg:text-right">
            <StatusBadge status={getShipmentStatusLabel(status)} />

            <p className="text-[10px] text-slate-400 mt-2">
              {pkg.carrier ||
                pkg.courier ||
                'Logistics partner'}
            </p>
          </div>
        </div>

        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          <LogisticsInfo
            icon={Warehouse}
            label="Fulfilled From"
            value={
              pkg.pickupWarehouse ||
              'D2C Mall Warehouse'
            }
          />

          <LogisticsInfo
            icon={Truck}
            label="Carrier"
            value={
              pkg.carrier ||
              pkg.courier ||
              'Assigned carrier'
            }
          />

          <LogisticsInfo
            icon={Navigation}
            label="AWB / Tracking"
            value={
              pkg.awb ||
              pkg.trackingId ||
              pkg.shipmentId ||
              'Generating...'
            }
          />
        </div>

        <div className="mt-5 bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            {timeline.map((step, timelineIndex) => (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      step.complete
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-white border-slate-200 text-slate-300'
                    }`}
                  >
                    {step.complete ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock3 className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <span
                    className={`hidden sm:block text-[9px] font-bold text-center mt-2 max-w-[70px] leading-3 ${
                      step.complete
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {timelineIndex < timeline.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-1 ${
                      timeline[timelineIndex + 1].complete
                        ? 'bg-emerald-400'
                        : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            {pkg.awb && (
              <span className="flex items-center gap-1.5">
                AWB:
                <strong className="font-mono text-slate-800">
                  {pkg.awb}
                </strong>
              </span>
            )}

            {pkg.shipmentId && (
              <span>
                Shipment:{' '}
                <strong className="font-mono text-slate-800">
                  {pkg.shipmentId}
                </strong>
              </span>
            )}
          </div>

          <button
            onClick={() => onTrack(pkg)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            Track Shipment
          </button>
        </div>
      </div>
    </div>
  );
}

function TrackingModal({ shipment, onClose }) {
  const status = normalizeStatus(shipment.status);

  const timeline = [
    {
      label: 'Order Confirmed',
      description: 'Your order has been confirmed.',
      complete: true
    },
    {
      label: 'Packed & Dispatched',
      description: 'Package has left the warehouse.',
      complete: [
        'SHIPPED',
        'IN_TRANSIT',
        'OUT_FOR_DELIVERY',
        'DELIVERED'
      ].includes(status)
    },
    {
      label: 'In Transit',
      description: 'Package is moving through the logistics network.',
      complete: [
        'IN_TRANSIT',
        'OUT_FOR_DELIVERY',
        'DELIVERED'
      ].includes(status)
    },
    {
      label: 'Out for Delivery',
      description: 'Package is with the delivery network.',
      complete: [
        'OUT_FOR_DELIVERY',
        'DELIVERED'
      ].includes(status)
    },
    {
      label: 'Delivered',
      description: 'Package has been delivered.',
      complete: status === 'DELIVERED'
    }
  ];

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-black text-blue-600">
              Live Shipment Tracking
            </p>

            <h3 className="text-xl font-black text-slate-950 mt-1">
              Track your package
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-black text-blue-100">
                  Current Status
                </p>

                <h4 className="text-2xl font-black mt-1">
                  {getShipmentStatusLabel(status)}
                </h4>

                <p className="text-xs text-blue-100 mt-1">
                  Order #{shipment.orderId}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
            </div>

            {status !== 'DELIVERED' && status !== 'CANCELLED' && (
              <div className="mt-5 bg-white/10 rounded-xl p-3 flex items-center gap-2">
                <Clock3 className="w-4 h-4" />
                <span className="text-xs font-bold">
                  Shipment is actively moving through the delivery network
                </span>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <TrackingInfo
              label="AWB Number"
              value={
                shipment.awb ||
                shipment.trackingId ||
                'Not available'
              }
              copyable
            />

            <TrackingInfo
              label="Shipment ID"
              value={
                shipment.shipmentId ||
                'Not available'
              }
            />

            <TrackingInfo
              label="Carrier"
              value={
                shipment.carrier ||
                shipment.courier ||
                'Assigned carrier'
              }
            />

            <TrackingInfo
              label="Pickup Warehouse"
              value={
                shipment.pickupWarehouse ||
                'D2C Mall Warehouse'
              }
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-5">
              <Navigation className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-black text-slate-900">
                Shipment Journey
              </h4>
            </div>

            <div>
              {timeline.map((step, index) => (
                <div
                  key={step.label}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        step.complete
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {step.complete ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Clock3 className="w-4 h-4" />
                      )}
                    </div>

                    {index < timeline.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          timeline[index + 1].complete
                            ? 'bg-emerald-300'
                            : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </div>

                  <div className="pb-7">
                    <p
                      className={`text-sm font-black ${
                        step.complete
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <div className="flex gap-3 items-center">
              <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl p-1">
                <img
                  src={shipment.image}
                  alt={shipment.item}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <p className="font-black text-sm text-slate-900">
                  {shipment.item}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {shipment.brand} · Qty {shipment.qty}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => alert('Customer support will be connected to your support channel.')}
              className="h-11 rounded-xl border border-slate-200 text-slate-700 text-xs font-black hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Get Help
            </button>

            <button
              onClick={() => alert('Carrier contact will be connected to your logistics integration.')}
              className="h-11 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Delivery Support
            </button>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />

            <p className="text-[11px] text-emerald-800">
              Your shipment is being handled through D2C Mall's
              logistics network. Tracking status updates as the package
              progresses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReturnModal({
  order,
  returnReason,
  setReturnReason,
  refundMethod,
  setRefundMethod,
  submitting,
  onClose,
  onSubmit
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-black text-orange-600">
              Returns Center
            </p>

            <h3 className="text-lg font-black text-slate-950 mt-1">
              Return Order #{order.orderId}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="p-6 space-y-5"
        >
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs font-bold text-slate-700">
              Return process
            </p>

            <div className="flex items-center justify-between mt-4">
              <ReturnStep number="1" label="Request" active />
              <div className="flex-1 h-px bg-slate-200 mx-2" />
              <ReturnStep number="2" label="Pickup" />
              <div className="flex-1 h-px bg-slate-200 mx-2" />
              <ReturnStep number="3" label="QC" />
              <div className="flex-1 h-px bg-slate-200 mx-2" />
              <ReturnStep number="4" label="Refund" />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 block mb-2">
              Why are you returning this order?
            </label>

            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500"
            >
              <option>Wrong size</option>
              <option>Damaged product</option>
              <option>Wrong product received</option>
              <option>Product quality issue</option>
              <option>Changed my mind</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 block mb-2">
              Refund method
            </label>

            <button
              type="button"
              onClick={() => setRefundMethod('ORIGINAL')}
              className={`w-full text-left rounded-xl border p-4 transition ${
                refundMethod === 'ORIGINAL'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />

                <div>
                  <p className="text-sm font-black text-slate-900">
                    Original Payment Method
                  </p>

                  <p className="text-[11px] text-slate-500 mt-1">
                    Refund to your original UPI/card/payment method after warehouse quality check.
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800">
            <strong>Important:</strong> Return eligibility and refund timing
            depend on the product's return policy and successful warehouse QC.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-black"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function HubMetric({ label, value, icon: Icon }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <Icon className="w-4 h-4 text-blue-200" />
        <span className="text-xl font-black">
          {value}
        </span>
      </div>

      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-300 mt-2">
        {label}
      </p>
    </div>
  );
}

function InsightCard({ icon: Icon, title, text }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3">
      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>

      <div>
        <p className="text-xs font-black text-slate-900">
          {title}
        </p>

        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

function LogisticsInfo({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-blue-600" />

        <span className="text-[9px] uppercase tracking-wide font-black text-slate-400">
          {label}
        </span>
      </div>

      <p className="text-xs font-black text-slate-800 mt-2 line-clamp-2">
        {value}
      </p>
    </div>
  );
}

function TrackingInfo({ label, value, copyable }) {
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);

      setTimeout(() => setCopied(false), 1500);
    } catch (e) {}
  };

  return (
    <div className="border border-slate-200 rounded-xl p-3">
      <p className="text-[9px] uppercase tracking-wide font-black text-slate-400">
        {label}
      </p>

      <div className="flex items-center justify-between gap-2 mt-1">
        <p className="text-xs font-black text-slate-800 break-all">
          {value}
        </p>

        {copyable && (
          <button
            onClick={copyValue}
            className="shrink-0 p-1.5 rounded-lg hover:bg-slate-100"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = String(status || '').toUpperCase();

  let styles = 'bg-slate-100 text-slate-600';

  if (normalized.includes('DELIVER')) {
    styles = 'bg-emerald-100 text-emerald-700';
  } else if (
    normalized.includes('TRANSIT') ||
    normalized.includes('SHIPPED') ||
    normalized.includes('OUT') ||
    normalized.includes('DISPATCH')
  ) {
    styles = 'bg-blue-100 text-blue-700';
  } else if (normalized.includes('RETURN')) {
    styles = 'bg-orange-100 text-orange-700';
  } else if (normalized.includes('CANCEL')) {
    styles = 'bg-rose-100 text-rose-700';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black ${styles}`}
    >
      {String(status || 'Processing').replace(/_/g, ' ')}
    </span>
  );
}

function ReturnStep({ number, label, active = false }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${
          active
            ? 'bg-blue-600 text-white'
            : 'bg-white border border-slate-200 text-slate-400'
        }`}
      >
        {number}
      </div>

      <span className="text-[9px] font-bold text-slate-500 mt-1">
        {label}
      </span>
    </div>
  );
}

function OrdersLoading() {
  return (
    <div className="space-y-4">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="bg-white border border-slate-200 rounded-3xl p-6 animate-pulse"
        >
          <div className="h-4 bg-slate-100 rounded w-48" />
          <div className="h-3 bg-slate-100 rounded w-72 mt-3" />
          <div className="h-36 bg-slate-100 rounded-2xl mt-6" />
        </div>
      ))}
    </div>
  );
}

function EmptyOrders({ hasSearch, hasOrders, onClear }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
        <Package className="w-7 h-7 text-slate-400" />
      </div>

      <h3 className="text-lg font-black text-slate-900 mt-5">
        {hasOrders ? 'No matching orders' : 'No orders yet'}
      </h3>

      <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
        {hasOrders
          ? 'Try changing your search or order status filter.'
          : 'Your D2C Mall purchases will appear here once you place your first order.'}
      </p>

      {(hasSearch || hasOrders) && (
        <button
          onClick={onClear}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black"
        >
          Clear filters
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

function normalizeStatus(status) {
  return String(status || 'PROCESSING').toUpperCase();
}

function getOrderFilterStatus(order) {
  if (order.returnRequested) return 'RETURNED';

  if (order.status === 'DELIVERED') return 'DELIVERED';

  return 'ACTIVE';
}

function getOrderStatusLabel(order) {
  if (order.returnRequested) return 'Return Requested';

  return String(
    order.status || 'PROCESSING'
  ).replace(/_/g, ' ');
}

function getShipmentStatusLabel(status) {
  const labels = {
    PROCESSING: 'Processing',
    CONFIRMED: 'Order Confirmed',
    SHIPPED: 'Dispatched',
    IN_TRANSIT: 'In Transit',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    RETURNED: 'Returned'
  };

  return (
    labels[status] ||
    String(status || 'Processing').replace(/_/g, ' ')
  );
}

function formatDate(date) {
  if (!date) return '—';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}