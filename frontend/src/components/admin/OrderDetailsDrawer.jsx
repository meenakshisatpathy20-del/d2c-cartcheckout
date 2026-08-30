import React from 'react';
import {
  X,
  UserRound,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Package,
  Truck,
  FileText,
  CalendarDays,
  IndianRupee,
  ExternalLink
} from 'lucide-react';
import OrderStatusBadge from '../customer/OrderStatusBadge';

export default function OrderDetailsDrawer({
  order,
  onClose,
  onTrackShipment
}) {
  if (!order) return null;

  const customer = order.customer || {};
  const fulfillments = order.fulfillments || [];
  const summary = order.summary || {};

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm">
      <div
        className="absolute inset-y-0 right-0 w-full max-w-2xl bg-slate-50 shadow-2xl overflow-y-auto"
      >
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-600">
              Order Details
            </p>

            <h2 className="font-mono text-lg font-black text-slate-950 mt-1">
              {order.orderId}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-slate-400 font-bold">
                  Current order status
                </p>

                <div className="mt-2">
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold">
                  Order value
                </p>

                <p className="text-xl font-black text-blue-800 mt-1">
                  ₹
                  {Number(
                    summary.totalPaid || 0
                  ).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400">
                  Invoice
                </p>

                <p className="text-xs font-bold text-slate-800 mt-1">
                  {order.invoiceNumber || 'Not generated'}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-black uppercase text-slate-400">
                  Placed
                </p>

                <p className="text-xs font-bold text-slate-800 mt-1">
                  {new Date(
                    order.placedAt
                  ).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <UserRound className="w-4 h-4 text-blue-700" />

              <h3 className="text-sm font-black text-slate-950">
                Customer Information
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[9px] font-black uppercase text-slate-400">
                  Full Name
                </p>

                <p className="text-xs font-black text-slate-900 mt-1">
                  {customer.name || 'Not provided'}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-emerald-600" />

                  <p className="text-[9px] font-black uppercase text-slate-400">
                    Mobile
                  </p>
                </div>

                <p className="text-xs font-black text-slate-900 mt-1">
                  {customer.phone || 'Not provided'}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 sm:col-span-2">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-blue-600" />

                  <p className="text-[9px] font-black uppercase text-slate-400">
                    Email
                  </p>
                </div>

                <p className="text-xs font-black text-slate-900 mt-1 break-all">
                  {customer.email || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />

                <div>
                  <p className="text-[9px] font-black uppercase text-blue-700">
                    Delivery Address
                  </p>

                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {customer.address || 'Address not provided'}
                  </p>

                  <p className="text-[11px] text-slate-600 mt-1">
                    {[
                      customer.city,
                      customer.state,
                      customer.pincode
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-emerald-600" />

              <h3 className="text-sm font-black text-slate-950">
                Payment Details
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400">
                  Status
                </p>

                <p className="text-xs font-black text-emerald-700 mt-1">
                  {order.paymentStatus || 'UNKNOWN'}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-black uppercase text-slate-400">
                  Method
                </p>

                <p className="text-xs font-bold text-slate-800 mt-1">
                  {order.paymentMethod || 'Unknown'}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-black uppercase text-slate-400">
                  Items
                </p>

                <p className="text-xs font-black text-slate-900 mt-1">
                  ₹
                  {Number(
                    summary.itemSubtotal || 0
                  ).toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-black uppercase text-slate-400">
                  Shipping
                </p>

                <p className="text-xs font-black text-slate-900 mt-1">
                  ₹
                  {Number(
                    summary.shippingFee || 0
                  ).toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-black uppercase text-slate-400">
                  Discount
                </p>

                <p className="text-xs font-black text-emerald-700 mt-1">
                  -₹
                  {Number(
                    summary.discountAmount || 0
                  ).toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-black uppercase text-slate-400">
                  Total Paid
                </p>

                <p className="text-xs font-black text-blue-800 mt-1">
                  ₹
                  {Number(
                    summary.totalPaid || 0
                  ).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-orange-600" />

              <h3 className="text-sm font-black text-slate-950">
                Order Items
              </h3>
            </div>

            <div className="space-y-3">
              {fulfillments.map((item) => (
                <div
                  key={item.shipmentId}
                  className="border border-slate-100 rounded-xl p-3 flex gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.item}
                    className="w-14 h-14 rounded-xl bg-slate-50 object-contain p-1"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[9px] font-black uppercase text-blue-600">
                          {item.brand}
                        </p>

                        <p className="text-xs font-black text-slate-900 mt-1">
                          {item.item}
                        </p>
                      </div>

                      <span className="text-xs font-black text-slate-900">
                        ×{item.qty}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-2">
                      Warehouse: {item.pickupWarehouse}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-4 h-4 text-blue-700" />

              <h3 className="text-sm font-black text-slate-950">
                Shipments
              </h3>
            </div>

            <div className="space-y-3">
              {fulfillments.map((shipment) => (
                <div
                  key={shipment.shipmentId}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs font-black text-slate-900">
                        {shipment.shipmentId}
                      </p>

                      <p className="text-[10px] text-slate-500 mt-1">
                        {shipment.courier || shipment.carrier}
                      </p>
                    </div>

                    <OrderStatusBadge
                      status={shipment.status}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400">
                        AWB
                      </p>

                      <p className="font-mono text-[10px] font-bold text-blue-700 mt-1">
                        {shipment.awb || 'Pending'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400">
                        Origin
                      </p>

                      <p className="text-[10px] font-bold text-slate-700 mt-1">
                        {shipment.pickupWarehouse || '-'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onTrackShipment?.(shipment, order)
                    }
                    className="mt-3 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl py-2 text-[10px] font-black flex items-center justify-center gap-1.5 transition"
                  >
                    Track Shipment
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {order.returnRequested && (
            <section className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-700" />

                <h3 className="text-sm font-black text-orange-900">
                  Return Requested
                </h3>
              </div>

              <p className="text-xs text-orange-800 mt-2">
                Reason:{' '}
                {order.returnDetails?.reason ||
                  'Not specified'}
              </p>

              <p className="text-[10px] text-orange-700 mt-1">
                Requested:{' '}
                {order.returnDetails?.requestedAt
                  ? new Date(
                      order.returnDetails.requestedAt
                    ).toLocaleString('en-IN')
                  : '-'}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}