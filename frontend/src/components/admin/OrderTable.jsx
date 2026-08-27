import React from 'react';
import {
  Eye,
  Package,
  UserRound,
  Truck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import OrderStatusBadge from '../customer/OrderStatusBadge';

export default function OrderTable({
  orders = [],
  page = 1,
  totalPages = 1,
  total = 0,
  onPageChange,
  onViewOrder
}) {
  if (!orders.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
        <Package className="w-10 h-10 text-slate-300 mx-auto" />

        <h3 className="text-sm font-black text-slate-900 mt-4">
          No orders found
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-[10px] font-black uppercase text-slate-500">
                Order
              </th>

              <th className="text-left px-5 py-3 text-[10px] font-black uppercase text-slate-500">
                Customer
              </th>

              <th className="text-left px-5 py-3 text-[10px] font-black uppercase text-slate-500">
                Items
              </th>

              <th className="text-left px-5 py-3 text-[10px] font-black uppercase text-slate-500">
                Amount
              </th>

              <th className="text-left px-5 py-3 text-[10px] font-black uppercase text-slate-500">
                Payment
              </th>

              <th className="text-left px-5 py-3 text-[10px] font-black uppercase text-slate-500">
                Status
              </th>

              <th className="text-left px-5 py-3 text-[10px] font-black uppercase text-slate-500">
                Shipment
              </th>

              <th className="px-5 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              const itemCount = (order.fulfillments || [])
                .reduce(
                  (sum, item) => sum + Number(item.qty || 0),
                  0
                );

              const shipmentCount =
                order.fulfillments?.length || 0;

              return (
                <tr
                  key={order.orderId}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-mono text-xs font-black text-slate-950">
                      {order.orderId}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(
                        order.placedAt
                      ).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>

                    <p className="text-[9px] font-bold text-slate-400 mt-1">
                      {order.invoiceNumber}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                        <UserRound className="w-4 h-4" />
                      </div>

                      <div>
                        <p className="text-xs font-black text-slate-900">
                          {order.customer?.name || 'Unknown'}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          {order.customer?.phone || 'No phone'}
                        </p>

                        <p className="text-[10px] text-slate-400">
                          {order.customer?.city || '-'}{' '}
                          {order.customer?.pincode || ''}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs font-black text-slate-900">
                      {itemCount} items
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1 max-w-[180px] truncate">
                      {(order.fulfillments || [])
                        .map((item) => item.item)
                        .join(', ')}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-black text-slate-950">
                      ₹
                      {Number(
                        order.summary?.totalPaid || 0
                      ).toLocaleString('en-IN')}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1">
                      {order.paymentMethod || '-'}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-[10px] font-black text-emerald-700">
                      {order.paymentStatus || 'UNKNOWN'}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <OrderStatusBadge
                      status={order.status}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />

                      <div>
                        <p className="text-[10px] font-black text-slate-800">
                          {shipmentCount} shipment
                          {shipmentCount !== 1 ? 's' : ''}
                        </p>

                        <p className="text-[9px] text-slate-400">
                          {(order.fulfillments || [])
                            .map(
                              (item) =>
                                item.courier ||
                                item.carrier
                            )
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        onViewOrder?.(order)
                      }
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-slate-500 hover:text-blue-700 inline-flex items-center justify-center transition"
                      title="View order"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-500">
          Showing {orders.length} of {total} orders
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
            className="w-8 h-8 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-[10px] font-black text-slate-700 px-2">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange?.(page + 1)}
            className="w-8 h-8 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}