import React, { useEffect, useState, useCallback } from 'react';
import {
  RefreshCw,
  Download,
  AlertCircle
} from 'lucide-react';

import OrderFilters from './OrderFilters';
import OrderTable from './OrderTable';
import OrderDetailsDrawer from './OrderDetailsDrawer';

export default function AdminOrdersView({
  api,
  onTrackShipment
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });

  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    paymentStatus: 'ALL',
    warehouse: 'ALL',
    carrier: 'ALL',
    dateFrom: '',
    dateTo: '',
    sort: 'newest',
    page: 1,
    limit: 20
  });

  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      if (!api?.getAdminOrders) {
        throw new Error(
          'Admin orders API is not available yet.'
        );
      }

      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== '' &&
          value !== null &&
          value !== undefined
        ) {
          params.set(key, value);
        }
      });

      const response = await api.getAdminOrders(
        params.toString()
      );

      setOrders(response?.orders || []);

      setPagination({
        page: response?.page || 1,
        limit: response?.limit || 20,
        total: response?.total || 0,
        totalPages: response?.totalPages || 1
      });
    } catch (err) {
      console.error('Admin orders error:', err);

      setOrders([]);

      setError(
        err?.message ||
          'Unable to load orders. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [api, filters]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      status: 'ALL',
      paymentStatus: 'ALL',
      warehouse: 'ALL',
      carrier: 'ALL',
      dateFrom: '',
      dateTo: '',
      sort: 'newest',
      page: 1,
      limit: 20
    });
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page
    }));
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseOrder = () => {
    setSelectedOrder(null);
  };

  const handleTrackShipment = (shipment, order) => {
    if (onTrackShipment) {
      onTrackShipment(shipment, order);
      return;
    }

    console.log('Track shipment:', {
      shipment,
      order
    });
  };

  const escapeCSVValue = (value) => {
    const stringValue = String(
      value === null || value === undefined ? '' : value
    );

    return `"${stringValue.replaceAll('"', '""')}"`;
  };

  const exportOrders = () => {
    if (!orders.length) return;

    const headers = [
      'Order ID',
      'Invoice',
      'Customer',
      'Phone',
      'Email',
      'Address',
      'City',
      'State',
      'Pincode',
      'Amount',
      'Payment Status',
      'Payment Method',
      'Order Status',
      'Shipments',
      'Placed At'
    ];

    const rows = orders.map((order) => [
      order.orderId || '',
      order.invoiceNumber || '',
      order.customer?.name || '',
      order.customer?.phone || '',
      order.customer?.email || '',
      order.customer?.address || '',
      order.customer?.city || '',
      order.customer?.state || '',
      order.customer?.pincode || '',
      order.summary?.totalPaid || 0,
      order.paymentStatus || '',
      order.paymentMethod || '',
      order.status || '',
      order.fulfillments?.length || 0,
      order.placedAt || ''
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map(escapeCSVValue).join(',')
      )
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');

    anchor.href = url;

    anchor.download = `d2c-orders-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] font-black text-orange-600">
              Fulfillment Operations
            </p>

            <h1 className="text-2xl font-black text-slate-950 mt-1">
              Orders
            </h1>

            <p className="text-xs text-slate-500 mt-1">
              Manage customer orders from payment through
              warehouse fulfillment and final delivery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadOrders}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  loading ? 'animate-spin' : ''
                }`}
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={exportOrders}
              disabled={!orders.length}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Download className="w-3.5 h-3.5" />

              Export
            </button>
          </div>
        </div>

        <OrderFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          total={pagination.total}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />

            <div className="flex-1">
              <p className="text-xs font-black text-red-800">
                Unable to load orders
              </p>

              <p className="text-[10px] text-red-700 mt-1">
                {error}
              </p>

              <button
                type="button"
                onClick={loadOrders}
                className="mt-2 text-[10px] font-black text-red-700 hover:text-red-900 underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <OrderTableSkeleton />
        ) : (
          <OrderTable
            orders={orders}
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={handlePageChange}
            onViewOrder={handleViewOrder}
          />
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsDrawer
          order={selectedOrder}
          onClose={handleCloseOrder}
          onTrackShipment={handleTrackShipment}
        />
      )}
    </>
  );
}

function OrderTableSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <div className="h-3 w-40 bg-slate-200 rounded animate-pulse" />
      </div>

      <div className="p-5 space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse shrink-0" />

            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 bg-slate-100 rounded animate-pulse" />

              <div className="h-2.5 w-1/2 bg-slate-100 rounded animate-pulse" />
            </div>

            <div className="hidden md:block h-7 w-20 bg-slate-100 rounded-lg animate-pulse" />

            <div className="hidden lg:block h-7 w-24 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}