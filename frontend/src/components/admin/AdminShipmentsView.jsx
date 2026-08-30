import React, { useMemo, useState } from 'react';
import {
  Search,
  Truck,
  Package,
  MapPin,
  UserRound,
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Navigation,
  X,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Warehouse,
  Phone,
  Copy
} from 'lucide-react';

const SHIPMENT_STATUSES = [
  'ALL',
  'READY_TO_DISPATCH',
  'SHIPPED',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'EXCEPTION',
  'CANCELLED'
];

function formatDate(value) {
  if (!value) return '—';

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

function statusClass(status) {
  const styles = {
    READY_TO_DISPATCH:
      'bg-orange-50 text-orange-700 border-orange-100',
    SHIPPED:
      'bg-indigo-50 text-indigo-700 border-indigo-100',
    IN_TRANSIT:
      'bg-blue-50 text-blue-700 border-blue-100',
    OUT_FOR_DELIVERY:
      'bg-yellow-50 text-yellow-700 border-yellow-100',
    DELIVERED:
      'bg-green-50 text-green-700 border-green-100',
    EXCEPTION:
      'bg-red-50 text-red-700 border-red-100',
    CANCELLED:
      'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    styles[status] ||
    'bg-slate-50 text-slate-600 border-slate-100'
  );
}

function prettyStatus(status) {
  return String(status || 'UNKNOWN')
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, char =>
      char.toUpperCase()
    );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  className
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${className}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <p className="text-[9px] uppercase tracking-[0.16em] font-black text-slate-400 mt-4">
        {label}
      </p>

      <p className="text-xl font-black text-slate-950 mt-1">
        {value}
      </p>

      <p className="text-[10px] text-slate-500 mt-1">
        {description}
      </p>
    </div>
  );
}

function ShipmentTimeline({ shipment }) {
  const events =
    shipment.timeline ||
    shipment.events ||
    [];

  if (!events.length) {
    return (
      <div className="mt-5 rounded-xl bg-slate-50 border border-slate-100 p-4">
        <div className="flex items-center gap-2">
          <Clock3 className="w-4 h-4 text-slate-400" />

          <p className="text-xs font-black text-slate-700">
            Tracking timeline
          </p>
        </div>

        <p className="text-[10px] text-slate-400 mt-2">
          Detailed carrier events will appear here once
          shipment tracking is connected.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
        Shipment timeline
      </p>

      <div className="mt-3 space-y-0">
        {events.map((event, index) => {
          const completed =
            event.completed !== false;

          return (
            <div
              key={`${event.status || event.title}-${index}`}
              className="relative flex gap-3"
            >
              {index <
                events.length - 1 && (
                <div className="absolute left-[7px] top-5 bottom-0 w-px bg-slate-200" />
              )}

              <div
                className={`relative z-10 w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 ${
                  completed
                    ? 'bg-green-500 border-green-500'
                    : 'bg-white border-slate-300'
                }`}
              />

              <div className="pb-5">
                <p className="text-xs font-black text-slate-800">
                  {event.title ||
                    prettyStatus(
                      event.status
                    )}
                </p>

                {event.location && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    {event.location}
                  </p>
                )}

                {event.description && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    {event.description}
                  </p>
                )}

                {event.timestamp && (
                  <p className="text-[9px] text-slate-400 mt-1">
                    {formatDate(
                      event.timestamp
                    )}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShipmentDrawer({
  shipment,
  onClose,
  onStatusChange,
  onTrack
}) {
  if (!shipment) return null;

  const customer =
    shipment.customer || {};

  const order =
    shipment.order || {};

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close shipment details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />

      <aside className="absolute right-0 top-0 h-full w-full sm:max-w-xl bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Shipment operations
            </p>

            <h2 className="text-sm font-black text-slate-950 mt-1">
              {shipment.shipmentId ||
                shipment.id ||
                'Shipment'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="rounded-2xl bg-slate-950 text-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] text-orange-400 font-black">
                  Current status
                </p>

                <span
                  className={`inline-flex mt-2 px-3 py-1.5 rounded-full border text-[10px] font-black ${statusClass(
                    shipment.status
                  )}`}
                >
                  {prettyStatus(
                    shipment.status
                  )}
                </span>
              </div>

              <Truck className="w-6 h-6 text-orange-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-[9px] text-slate-400">
                  AWB
                </p>

                <p className="text-xs font-black mt-1 break-all">
                  {shipment.awb || 'Not assigned'}
                </p>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-[9px] text-slate-400">
                  Carrier
                </p>

                <p className="text-xs font-black mt-1">
                  {shipment.courier ||
                    shipment.carrier ||
                    'Not assigned'}
                </p>
              </div>
            </div>
          </div>

          {shipment.exception && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />

                <div>
                  <p className="text-xs font-black text-red-900">
                    Shipment exception
                  </p>

                  <p className="text-[10px] text-red-700 mt-1">
                    {shipment.exception.message ||
                      shipment.exception.reason ||
                      shipment.exception}
                  </p>
                </div>
              </div>
            </div>
          )}

          <section>
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Shipment information
            </p>

            <div className="mt-3 rounded-2xl border border-slate-200 divide-y divide-slate-100">
              <div className="p-4 flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Warehouse className="w-4 h-4 text-blue-700" />
                </div>

                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400">
                    Pickup warehouse
                  </p>

                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {shipment.pickupWarehouse ||
                      shipment.warehouse ||
                      'Not assigned'}
                  </p>
                </div>
              </div>

              <div className="p-4 flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-green-700" />
                </div>

                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400">
                    Destination
                  </p>

                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {shipment.destination ||
                      customer.city ||
                      'Not available'}
                  </p>

                  {customer.pincode && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      PIN {customer.pincode}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Package className="w-4 h-4 text-orange-600" />
                </div>

                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400">
                    Product
                  </p>

                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {shipment.item ||
                      shipment.productName ||
                      'Product'}
                  </p>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Quantity:{' '}
                    {shipment.qty || 1}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Customer
            </p>

            <div className="mt-3 rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <UserRound className="w-5 h-5 text-blue-700" />
                </div>

                <div>
                  <p className="text-xs font-black text-slate-900">
                    {customer.name ||
                      'Customer'}
                  </p>

                  <p className="text-[10px] text-slate-400 mt-1">
                    {customer.customerId ||
                      order.customerId ||
                      'Customer'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />

                    <span className="text-[9px] uppercase font-black text-slate-400">
                      Phone
                    </span>
                  </div>

                  <p className="text-[10px] font-bold text-slate-700 mt-2">
                    {customer.phone || '—'}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />

                    <span className="text-[9px] uppercase font-black text-slate-400">
                      Order
                    </span>
                  </div>

                  <p className="text-[10px] font-bold text-blue-700 mt-2">
                    {shipment.orderId ||
                      order.orderId ||
                      '—'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <ShipmentTimeline shipment={shipment} />

          <section>
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Operations
            </p>

            <div className="mt-3 space-y-2">
              <label className="block text-[9px] uppercase tracking-wider font-black text-slate-500">
                Update shipment status
              </label>

              <select
                value={
                  shipment.status || ''
                }
                onChange={e =>
                  onStatusChange?.(
                    shipment,
                    e.target.value
                  )
                }
                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold outline-none focus:border-blue-600 focus:bg-white"
              >
                {SHIPMENT_STATUSES
                  .filter(
                    status =>
                      status !== 'ALL'
                  )
                  .map(status => (
                    <option
                      key={status}
                      value={status}
                    >
                      {prettyStatus(status)}
                    </option>
                  ))}
              </select>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onTrack?.(shipment)
                  }
                  className="h-11 rounded-xl bg-blue-700 text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-blue-800"
                >
                  <Navigation className="w-4 h-4" />
                  Track shipment
                </button>

                {shipment.trackingUrl && (
                  <a
                    href={shipment.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="h-11 rounded-xl bg-slate-100 text-slate-800 text-xs font-black flex items-center justify-center gap-2 hover:bg-slate-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Carrier page
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

export default function AdminShipmentsView({
  shipments = [],
  loading = false,
  onRefresh,
  onStatusChange,
  onTrack
}) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [carrier, setCarrier] = useState('ALL');
  const [warehouse, setWarehouse] = useState('ALL');
  const [selectedShipment, setSelectedShipment] =
    useState(null);

  const carriers = useMemo(() => {
    return [
      'ALL',
      ...new Set(
        shipments
          .map(
            shipment =>
              shipment.courier ||
              shipment.carrier
          )
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
            shipment =>
              shipment.pickupWarehouse ||
              shipment.warehouse
          )
          .filter(Boolean)
      )
    ];
  }, [shipments]);

  const filteredShipments = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return shipments.filter(shipment => {
      const shipmentStatus =
        shipment.status || '';

      const shipmentCarrier =
        shipment.courier ||
        shipment.carrier ||
        '';

      const shipmentWarehouse =
        shipment.pickupWarehouse ||
        shipment.warehouse ||
        '';

      const searchable = [
        shipment.shipmentId,
        shipment.id,
        shipment.awb,
        shipment.orderId,
        shipment.item,
        shipment.productName,
        shipment.brand,
        shipmentCarrier,
        shipmentWarehouse,
        shipment.customer?.name,
        shipment.customer?.phone,
        shipment.customer?.city,
        shipment.customer?.pincode
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchable.includes(query);

      const matchesStatus =
        status === 'ALL' ||
        shipmentStatus === status;

      const matchesCarrier =
        carrier === 'ALL' ||
        shipmentCarrier === carrier;

      const matchesWarehouse =
        warehouse === 'ALL' ||
        shipmentWarehouse === warehouse;

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
    status,
    carrier,
    warehouse
  ]);

  const metrics = useMemo(() => {
    const total = shipments.length;

    const inTransit = shipments.filter(
      shipment =>
        shipment.status ===
          'IN_TRANSIT' ||
        shipment.status === 'SHIPPED'
    ).length;

    const outForDelivery =
      shipments.filter(
        shipment =>
          shipment.status ===
          'OUT_FOR_DELIVERY'
      ).length;

    const delivered =
      shipments.filter(
        shipment =>
          shipment.status === 'DELIVERED'
      ).length;

    const exceptions =
      shipments.filter(
        shipment =>
          shipment.status ===
            'EXCEPTION' ||
          shipment.exception
      ).length;

    return {
      total,
      inTransit,
      outForDelivery,
      delivered,
      exceptions
    };
  }, [shipments]);

  const clearFilters = () => {
    setSearch('');
    setStatus('ALL');
    setCarrier('ALL');
    setWarehouse('ALL');
  };

  const hasFilters =
    search ||
    status !== 'ALL' ||
    carrier !== 'ALL' ||
    warehouse !== 'ALL';

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] font-black text-orange-600">
              Logistics control
            </p>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
              Shipments
            </h1>

            <p className="text-xs text-slate-500 mt-2">
              Monitor every shipment from warehouse dispatch
              through final delivery.
            </p>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-black hover:bg-blue-900 transition disabled:opacity-50"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <MetricCard
            icon={Truck}
            label="Total shipments"
            value={metrics.total}
            description="All fulfillment packages"
            className="bg-blue-50 text-blue-700"
          />

          <MetricCard
            icon={Navigation}
            label="In transit"
            value={metrics.inTransit}
            description="Moving through network"
            className="bg-indigo-50 text-indigo-700"
          />

          <MetricCard
            icon={Clock3}
            label="Out for delivery"
            value={metrics.outForDelivery}
            description="Expected today"
            className="bg-yellow-50 text-yellow-700"
          />

          <MetricCard
            icon={CheckCircle2}
            label="Delivered"
            value={metrics.delivered}
            description="Successfully delivered"
            className="bg-green-50 text-green-700"
          />

          <MetricCard
            icon={AlertTriangle}
            label="Exceptions"
            value={metrics.exceptions}
            description="Require intervention"
            className="bg-red-50 text-red-700"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto] gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={e =>
                  setSearch(e.target.value)
                }
                placeholder="Search AWB, order, customer, product..."
                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
              />
            </div>

            <select
              value={status}
              onChange={e =>
                setStatus(e.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold outline-none focus:border-blue-600"
            >
              {SHIPMENT_STATUSES.map(
                item => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === 'ALL'
                      ? 'All statuses'
                      : prettyStatus(item)}
                  </option>
                )
              )}
            </select>

            <select
              value={carrier}
              onChange={e =>
                setCarrier(e.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold outline-none focus:border-blue-600 max-w-full"
            >
              {carriers.map(item => (
                <option
                  key={item}
                  value={item}
                >
                  {item === 'ALL'
                    ? 'All carriers'
                    : item}
                </option>
              ))}
            </select>

            <select
              value={warehouse}
              onChange={e =>
                setWarehouse(e.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold outline-none focus:border-blue-600 max-w-full"
            >
              {warehouses.map(item => (
                <option
                  key={item}
                  value={item}
                >
                  {item === 'ALL'
                    ? 'All warehouses'
                    : item}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <div className="flex items-center justify-between mt-3">
              <p className="text-[10px] text-slate-500">
                Showing{' '}
                <span className="font-black text-slate-800">
                  {filteredShipments.length}
                </span>{' '}
                of {shipments.length} shipments
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="text-[10px] font-black text-orange-600 hover:text-orange-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3, 4, 5, 6].map(
                item => (
                  <div
                    key={item}
                    className="h-20 rounded-xl bg-slate-100 animate-pulse"
                  />
                )
              )}
            </div>
          ) : filteredShipments.length === 0 ? (
            <div className="p-14 text-center">
              <Truck className="w-9 h-9 text-slate-300 mx-auto" />

              <p className="text-sm font-black text-slate-600 mt-3">
                No shipments found
              </p>

              <p className="text-[10px] text-slate-400 mt-1">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Shipment
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Customer / Order
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Carrier
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Warehouse
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Updated
                    </th>

                    <th className="px-5 py-3" />
                  </tr>
                </thead>

                <tbody>
                  {filteredShipments.map(
                    shipment => {
                      const customer =
                        shipment.customer ||
                        {};

                      const shipmentId =
                        shipment.shipmentId ||
                        shipment.id;

                      const carrierName =
                        shipment.courier ||
                        shipment.carrier ||
                        'Not assigned';

                      const warehouseName =
                        shipment.pickupWarehouse ||
                        shipment.warehouse ||
                        'Not assigned';

                      const exception =
                        shipment.exception ||
                        shipment.status ===
                          'EXCEPTION';

                      return (
                        <tr
                          key={shipmentId}
                          onClick={() =>
                            setSelectedShipment(
                              shipment
                            )
                          }
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                                <Truck className="w-4 h-4" />
                              </div>

                              <div>
                                <p className="text-xs font-black text-blue-700">
                                  {shipmentId ||
                                    '—'}
                                </p>

                                <p className="text-[9px] text-slate-400 mt-1">
                                  AWB:{' '}
                                  {shipment.awb ||
                                    'Pending'}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-xs font-black text-slate-800">
                              {customer.name ||
                                'Customer'}
                            </p>

                            <p className="text-[9px] text-blue-600 font-bold mt-1">
                              {shipment.orderId ||
                                'Order not linked'}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-[10px] font-black text-slate-700">
                              {carrierName}
                            </p>

                            <p className="text-[9px] text-slate-400 mt-1">
                              {shipment.trackingNumber ||
                                shipment.awb ||
                                'Tracking pending'}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Warehouse className="w-3.5 h-3.5 text-slate-400" />

                              <span className="text-[10px] font-semibold text-slate-600 max-w-[180px] truncate">
                                {warehouseName}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex flex-col items-start gap-1.5">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full border text-[9px] font-black ${statusClass(
                                  shipment.status
                                )}`}
                              >
                                {prettyStatus(
                                  shipment.status
                                )}
                              </span>

                              {exception && (
                                <span className="flex items-center gap-1 text-[9px] text-red-600 font-black">
                                  <AlertTriangle className="w-3 h-3" />
                                  Attention
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="text-[10px] font-semibold text-slate-600">
                              {formatDate(
                                shipment.updatedAt ||
                                  shipment.lastUpdated ||
                                  shipment.shippedAt
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ShipmentDrawer
        shipment={selectedShipment}
        onClose={() =>
          setSelectedShipment(null)
        }
        onStatusChange={(
          shipment,
          nextStatus
        ) => {
          onStatusChange?.(
            shipment,
            nextStatus
          );

          setSelectedShipment(
            previous =>
              previous
                ? {
                    ...previous,
                    status: nextStatus
                  }
                : previous
          );
        }}
        onTrack={onTrack}
      />
    </>
  );
}