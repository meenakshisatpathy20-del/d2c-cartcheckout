import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  RefreshCw,
  Truck,
  Package,
  Warehouse,
  MapPin,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  X,
  Save,
  Filter
} from 'lucide-react';

const STATUS_OPTIONS = [
  'ALL',
  'CONFIRMED',
  'PROCESSING',
  'PACKED',
  'READY_TO_DISPATCH',
  'SHIPPED',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED'
];

const STATUS_FLOW = [
  'CONFIRMED',
  'PROCESSING',
  'PACKED',
  'READY_TO_DISPATCH',
  'SHIPPED',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

export default function ShipmentManagement({
  api,
  orders = []
}) {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState('ALL');
  const [carrierFilter, setCarrierFilter] =
    useState('ALL');
  const [warehouseFilter, setWarehouseFilter] =
    useState('ALL');

  const [selectedShipment, setSelectedShipment] =
    useState(null);

  const [showExceptions, setShowExceptions] =
    useState(false);

  const buildFromOrders = () => {
    const result = [];

    orders.forEach((order) => {
      (order.fulfillments || []).forEach(
        (shipment) => {
          result.push({
            ...shipment,
            orderId: order.orderId,
            invoiceNumber: order.invoiceNumber,
            placedAt: order.placedAt,
            customer: order.customer || {},
            orderStatus: order.status,
            paymentStatus: order.paymentStatus,
            exception: shipment.exception || null
          });
        }
      );
    });

    return result;
  };

  const loadShipments = async () => {
    setLoading(true);
    setError('');

    try {
      if (api?.getAdminShipments) {
        const response =
          await api.getAdminShipments();

        const data = Array.isArray(response)
          ? response
          : response?.shipments || [];

        setShipments(data);
      } else {
        setShipments(buildFromOrders());
      }
    } catch (err) {
      console.error(
        'Shipment loading failed:',
        err
      );

      setError(
        err?.message ||
          'Unable to load shipment data.'
      );

      setShipments(buildFromOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setShipments(buildFromOrders());
  }, [orders]);

  const carriers = useMemo(() => {
    return [
      'ALL',
      ...new Set(
        shipments
          .map((shipment) => shipment.courier)
          .filter(Boolean)
      )
    ];
  }, [shipments]);

  const warehouses = useMemo(() => {
    return [
      'ALL',
      ...new Set(
        shipments
          .map(
            (shipment) =>
              shipment.pickupWarehouse
          )
          .filter(Boolean)
      )
    ];
  }, [shipments]);

  const filteredShipments = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return shipments.filter((shipment) => {
      const matchesSearch =
        !query ||
        [
          shipment.shipmentId,
          shipment.awb,
          shipment.orderId,
          shipment.item,
          shipment.brand,
          shipment.courier,
          shipment.pickupWarehouse,
          shipment.customer?.name,
          shipment.customer?.phone,
          shipment.customer?.city,
          shipment.customer?.pincode
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === 'ALL' ||
        shipment.status === statusFilter;

      const matchesCarrier =
        carrierFilter === 'ALL' ||
        shipment.courier === carrierFilter;

      const matchesWarehouse =
        warehouseFilter === 'ALL' ||
        shipment.pickupWarehouse ===
          warehouseFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCarrier &&
        matchesWarehouse
      );
    });
  }, [
    shipments,
    search,
    statusFilter,
    carrierFilter,
    warehouseFilter
  ]);

  const exceptionShipments =
    filteredShipments.filter(
      (shipment) =>
        shipment.exception ||
        [
          'CANCELLED',
          'RETURNED'
        ].includes(shipment.status)
    );

  const updateShipmentStatus = async (
    shipment,
    newStatus
  ) => {
    try {
      if (api?.updateShipmentStatus) {
        await api.updateShipmentStatus({
          orderId: shipment.orderId,
          shipmentId: shipment.shipmentId,
          newStatus
        });
      }

      setShipments((prev) =>
        prev.map((item) =>
          item.shipmentId ===
          shipment.shipmentId
            ? {
                ...item,
                status: newStatus
              }
            : item
        )
      );

      setSelectedShipment((prev) =>
        prev?.shipmentId ===
        shipment.shipmentId
          ? {
              ...prev,
              status: newStatus
            }
          : prev
      );
    } catch (err) {
      setError(
        err?.message ||
          'Unable to update shipment status.'
      );
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setCarrierFilter('ALL');
    setWarehouseFilter('ALL');
  };

  const stats = useMemo(() => {
    return {
      total: shipments.length,

      shipped: shipments.filter(
        (item) =>
          item.status === 'SHIPPED'
      ).length,

      transit: shipments.filter(
        (item) =>
          item.status === 'IN_TRANSIT'
      ).length,

      delivery: shipments.filter(
        (item) =>
          item.status ===
          'OUT_FOR_DELIVERY'
      ).length,

      delivered: shipments.filter(
        (item) =>
          item.status === 'DELIVERED'
      ).length,

      exceptions: shipments.filter(
        (item) =>
          item.exception ||
          ['CANCELLED', 'RETURNED'].includes(
            item.status
          )
      ).length
    };
  }, [shipments]);

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] font-black text-orange-600">
              Logistics Control
            </p>

            <h1 className="text-2xl font-black text-slate-950 mt-1">
              Shipments
            </h1>

            <p className="text-xs text-slate-500 mt-1">
              Monitor warehouse dispatches,
              carriers, AWBs and last-mile delivery.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setShowExceptions(
                  !showExceptions
                )
              }
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-black transition ${
                showExceptions
                  ? 'bg-orange-50 border-orange-200 text-orange-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />

              Exceptions

              {stats.exceptions > 0 && (
                <span className="bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[8px]">
                  {stats.exceptions}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={loadShipments}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  loading
                    ? 'animate-spin'
                    : ''
                }`}
              />

              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <ShipmentStat
            label="Total"
            value={stats.total}
            icon={Package}
            tone="blue"
          />

          <ShipmentStat
            label="Shipped"
            value={stats.shipped}
            icon={Truck}
            tone="orange"
          />

          <ShipmentStat
            label="In Transit"
            value={stats.transit}
            icon={MapPin}
            tone="blue"
          />

          <ShipmentStat
            label="Out for Delivery"
            value={stats.delivery}
            icon={Clock3}
            tone="yellow"
          />

          <ShipmentStat
            label="Delivered"
            value={stats.delivered}
            icon={CheckCircle2}
            tone="green"
          />

          <ShipmentStat
            label="Exceptions"
            value={stats.exceptions}
            icon={AlertTriangle}
            tone="red"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-blue-700" />

            <h2 className="text-xs font-black text-slate-900">
              Shipment Filters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="AWB, order, customer..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold outline-none focus:border-blue-600"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-600"
            >
              {STATUS_OPTIONS.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status === 'ALL'
                      ? 'All Statuses'
                      : formatStatus(status)}
                  </option>
                )
              )}
            </select>

            <select
              value={carrierFilter}
              onChange={(e) =>
                setCarrierFilter(
                  e.target.value
                )
              }
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-600"
            >
              {carriers.map((carrier) => (
                <option
                  key={carrier}
                  value={carrier}
                >
                  {carrier === 'ALL'
                    ? 'All Carriers'
                    : carrier}
                </option>
              ))}
            </select>

            <select
              value={warehouseFilter}
              onChange={(e) =>
                setWarehouseFilter(
                  e.target.value
                )
              }
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-600"
            >
              {warehouses.map(
                (warehouse) => (
                  <option
                    key={warehouse}
                    value={warehouse}
                  >
                    {warehouse === 'ALL'
                      ? 'All Warehouses'
                      : warehouse}
                  </option>
                )
              )}
            </select>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs font-bold text-red-700">
            {error}
          </div>
        )}

        {showExceptions && (
          <ExceptionPanel
            shipments={exceptionShipments}
            onSelect={setSelectedShipment}
          />
        )}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-950">
                Shipment Queue
              </h2>

              <p className="text-[10px] text-slate-500 mt-1">
                {filteredShipments.length} shipments
                matching current filters
              </p>
            </div>

            <div className="text-[9px] font-black uppercase text-slate-400">
              Shiprocket-ready
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <Header text="Shipment" />
                  <Header text="Order / Customer" />
                  <Header text="Product" />
                  <Header text="Warehouse" />
                  <Header text="Carrier / AWB" />
                  <Header text="Status" />
                  <Header text="" />
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredShipments.map(
                  (shipment) => (
                    <ShipmentRow
                      key={`${shipment.orderId}-${shipment.shipmentId}`}
                      shipment={shipment}
                      onSelect={
                        setSelectedShipment
                      }
                    />
                  )
                )}
              </tbody>
            </table>
          </div>

          {!filteredShipments.length && (
            <div className="py-14 text-center">
              <Package className="w-8 h-8 text-slate-300 mx-auto" />

              <p className="text-xs font-black text-slate-700 mt-3">
                No shipments found
              </p>

              <p className="text-[10px] text-slate-400 mt-1">
                Try changing the search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedShipment && (
        <ShipmentDrawer
          shipment={selectedShipment}
          onClose={() =>
            setSelectedShipment(null)
          }
          onUpdateStatus={
            updateShipmentStatus
          }
        />
      )}
    </>
  );
}

function ShipmentStat({
  label,
  value,
  icon: Icon,
  tone
}) {
  const styles = {
    blue:
      'bg-blue-50 border-blue-100 text-blue-700',
    orange:
      'bg-orange-50 border-orange-100 text-orange-700',
    yellow:
      'bg-yellow-50 border-yellow-100 text-yellow-700',
    green:
      'bg-emerald-50 border-emerald-100 text-emerald-700',
    red:
      'bg-red-50 border-red-100 text-red-700'
  };

  return (
    <div
      className={`border rounded-xl p-3 ${
        styles[tone]
      }`}
    >
      <Icon className="w-4 h-4" />

      <p className="text-[9px] uppercase font-black opacity-60 mt-2">
        {label}
      </p>

      <p className="text-lg font-black mt-0.5">
        {value}
      </p>
    </div>
  );
}

function Header({ text }) {
  return (
    <th className="text-left px-5 py-3 text-[9px] font-black uppercase tracking-wide text-slate-500 whitespace-nowrap">
      {text}
    </th>
  );
}

function ShipmentRow({
  shipment,
  onSelect
}) {
  return (
    <tr className="hover:bg-slate-50 transition">
      <td className="px-5 py-4">
        <p className="font-mono text-[10px] font-black text-slate-900">
          {shipment.shipmentId}
        </p>

        {shipment.exception && (
          <span className="inline-flex items-center gap-1 text-[8px] font-black text-red-600 mt-1">
            <AlertTriangle className="w-3 h-3" />
            Exception
          </span>
        )}
      </td>

      <td className="px-5 py-4">
        <p className="font-mono text-[10px] font-black text-blue-700">
          {shipment.orderId}
        </p>

        <p className="text-xs font-bold text-slate-800 mt-1">
          {shipment.customer?.name ||
            'Customer'}
        </p>

        <p className="text-[9px] text-slate-400">
          {shipment.customer?.city || ''}
        </p>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          {shipment.image && (
            <img
              src={shipment.image}
              alt=""
              className="w-9 h-9 rounded-lg object-contain bg-slate-50 border border-slate-100"
            />
          )}

          <div>
            <p className="text-[10px] font-black text-slate-800 max-w-[180px]">
              {shipment.item}
            </p>

            <p className="text-[9px] text-slate-400">
              {shipment.brand} · Qty {shipment.qty}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-start gap-2">
          <Warehouse className="w-3.5 h-3.5 text-orange-500 mt-0.5" />

          <span className="text-[10px] font-bold text-slate-700 max-w-[150px]">
            {shipment.pickupWarehouse}
          </span>
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="text-[10px] font-black text-slate-800">
          {shipment.courier || 'Unassigned'}
        </p>

        <p className="font-mono text-[9px] text-slate-500 mt-1">
          {shipment.awb || 'AWB pending'}
        </p>
      </td>

      <td className="px-5 py-4">
        <StatusBadge
          status={shipment.status}
        />
      </td>

      <td className="px-5 py-4 text-right">
        <button
          type="button"
          onClick={() =>
            onSelect(shipment)
          }
          className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-[9px] font-black hover:bg-blue-100"
        >
          Manage
        </button>
      </td>
    </tr>
  );
}

function StatusBadge({ status }) {
  const styles = {
    CONFIRMED:
      'bg-blue-50 text-blue-700 border-blue-100',
    PROCESSING:
      'bg-yellow-50 text-yellow-700 border-yellow-100',
    PACKED:
      'bg-orange-50 text-orange-700 border-orange-100',
    READY_TO_DISPATCH:
      'bg-orange-50 text-orange-700 border-orange-100',
    SHIPPED:
      'bg-indigo-50 text-indigo-700 border-indigo-100',
    IN_TRANSIT:
      'bg-blue-50 text-blue-700 border-blue-100',
    OUT_FOR_DELIVERY:
      'bg-purple-50 text-purple-700 border-purple-100',
    DELIVERED:
      'bg-emerald-50 text-emerald-700 border-emerald-100',
    CANCELLED:
      'bg-red-50 text-red-700 border-red-100',
    RETURNED:
      'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <span
      className={`inline-flex border rounded-lg px-2 py-1 text-[8px] font-black uppercase whitespace-nowrap ${
        styles[status] ||
        'bg-slate-50 text-slate-600 border-slate-200'
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

function ExceptionPanel({
  shipments,
  onSelect
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-red-600" />

        <h3 className="text-xs font-black text-red-900">
          Delivery Exceptions
        </h3>
      </div>

      {!shipments.length ? (
        <p className="text-[10px] text-red-700">
          No delivery exceptions found.
        </p>
      ) : (
        <div className="space-y-2">
          {shipments.map((shipment) => (
            <button
              key={shipment.shipmentId}
              type="button"
              onClick={() =>
                onSelect(shipment)
              }
              className="w-full text-left bg-white border border-red-100 rounded-xl p-3 hover:border-red-300"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-black text-slate-900">
                    {shipment.awb ||
                      shipment.shipmentId}
                  </p>

                  <p className="text-[10px] text-slate-600 mt-1">
                    {shipment.item}
                  </p>
                </div>

                <span className="text-[9px] font-black text-red-600">
                  {shipment.exception ||
                    formatStatus(
                      shipment.status
                    )}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ShipmentDrawer({
  shipment,
  onClose,
  onUpdateStatus
}) {
  const [status, setStatus] = useState(
    shipment.status || 'CONFIRMED'
  );

  const [saving, setSaving] =
    useState(false);

  const handleSave = async () => {
    setSaving(true);

    try {
      await onUpdateStatus(
        shipment,
        status
      );
    } finally {
      setSaving(false);
    }
  };

  const currentIndex =
    STATUS_FLOW.indexOf(status);

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm">
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-slate-50 overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Shipment Control
            </p>

            <h2 className="font-mono text-base font-black text-slate-950 mt-1">
              {shipment.shipmentId}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              icon={Truck}
              label="Carrier"
              value={
                shipment.courier ||
                'Not assigned'
              }
            />

            <InfoCard
              icon={Package}
              label="AWB"
              value={
                shipment.awb ||
                'Pending'
              }
            />

            <InfoCard
              icon={Warehouse}
              label="Warehouse"
              value={
                shipment.pickupWarehouse ||
                '-'
              }
            />

            <InfoCard
              icon={MapPin}
              label="Destination"
              value={[
                shipment.customer?.city,
                shipment.customer?.pincode
              ]
                .filter(Boolean)
                .join(' ') || '-'}
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-[9px] uppercase font-black text-slate-400">
              Customer
            </p>

            <h3 className="text-sm font-black text-slate-950 mt-1">
              {shipment.customer?.name ||
                'Customer'}
            </h3>

            <p className="text-[10px] text-slate-500 mt-1">
              {shipment.customer?.phone ||
                '-'}
            </p>

            <p className="text-[10px] text-slate-500">
              {shipment.customer?.email ||
                '-'}
            </p>

            <p className="text-[10px] text-slate-500 mt-2">
              {[
                shipment.customer?.address,
                shipment.customer?.city,
                shipment.customer?.state,
                shipment.customer?.pincode
              ]
                .filter(Boolean)
                .join(', ') || '-'}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase font-black text-slate-400">
                  Shipment Item
                </p>

                <h3 className="text-xs font-black text-slate-900 mt-1">
                  {shipment.item}
                </h3>

                <p className="text-[10px] text-slate-500 mt-1">
                  {shipment.brand} · Qty{' '}
                  {shipment.qty}
                </p>
              </div>

              {shipment.image && (
                <img
                  src={shipment.image}
                  alt=""
                  className="w-14 h-14 rounded-xl object-contain bg-slate-50 border border-slate-100"
                />
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-[9px] uppercase font-black text-slate-400 mb-4">
              Shipment Progress
            </p>

            <div className="space-y-3">
              {STATUS_FLOW.map(
                (step, index) => {
                  const completed =
                    index <= currentIndex;

                  return (
                    <div
                      key={step}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          completed
                            ? 'bg-blue-700 text-white'
                            : 'bg-slate-100 text-slate-300'
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock3 className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-black ${
                          completed
                            ? 'text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {formatStatus(step)}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <label className="text-[9px] uppercase font-black text-slate-400">
              Update Shipment Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-black outline-none focus:border-blue-600"
            >
              {STATUS_FLOW.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {formatStatus(item)}
                  </option>
                )
              )}
            </select>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-3 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-xl py-3 text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}

              Save Shipment Status
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <ExternalLink className="w-4 h-4 text-blue-700 mt-0.5" />

              <div>
                <p className="text-[10px] font-black text-blue-900">
                  Shiprocket Integration
                </p>

                <p className="text-[9px] text-blue-700 mt-1 leading-relaxed">
                  This shipment structure is ready for
                  Shiprocket order creation, AWB assignment,
                  courier selection and tracking webhook
                  synchronization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3">
      <Icon className="w-4 h-4 text-orange-500" />

      <p className="text-[8px] uppercase font-black text-slate-400 mt-2">
        {label}
      </p>

      <p className="text-[10px] font-black text-slate-800 mt-1 break-words">
        {value}
      </p>
    </div>
  );
}

function formatStatus(status) {
  return String(status || '')
    .replaceAll('_', ' ')
    .replace(
      /\w\S*/g,
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    );
}