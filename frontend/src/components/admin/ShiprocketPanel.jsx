import React, { useMemo, useState } from 'react';
import {
  Truck,
  KeyRound,
  Link2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Settings,
  PackageCheck,
  Navigation,
  Clock3,
  MapPin,
  Search,
  X,
  Save,
  ShieldCheck,
  Activity,
  Zap,
  RotateCcw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const DEFAULT_CONFIG = {
  email: '',
  password: '',
  pickupLocation: '',
  channelId: '',
  autoAssignCourier: true,
  autoGenerateAwb: true,
  autoSyncTracking: true,
  enableNdrAlerts: true
};

const CARRIERS = [
  {
    name: 'Delhivery',
    type: 'Surface',
    service: 'Domestic',
    sla: '2–5 days'
  },
  {
    name: 'Blue Dart',
    type: 'Air',
    service: 'Priority',
    sla: '1–3 days'
  },
  {
    name: 'Ekart',
    type: 'Surface',
    service: 'Domestic',
    sla: '2–5 days'
  },
  {
    name: 'Xpressbees',
    type: 'Surface',
    service: 'Domestic',
    sla: '2–5 days'
  }
];

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
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
    .replace(/\b\w/g, char => char.toUpperCase());
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

function Toggle({
  enabled,
  onChange,
  label,
  description
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className="w-full flex items-center justify-between gap-4 py-3 text-left"
    >
      <div>
        <p className="text-xs font-black text-slate-800">
          {label}
        </p>

        <p className="text-[9px] text-slate-400 mt-1">
          {description}
        </p>
      </div>

      <span
        className={`relative w-10 h-5 rounded-full shrink-0 transition ${
          enabled
            ? 'bg-green-500'
            : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition ${
            enabled
              ? 'left-5'
              : 'left-0.5'
          }`}
        />
      </span>
    </button>
  );
}

function ConfigurationPanel({
  config,
  setConfig,
  onSave,
  saving
}) {
  const update = (key, value) => {
    setConfig(previous => ({
      ...previous,
      [key]: value
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Integration
            </p>

            <h2 className="text-sm font-black text-slate-950 mt-0.5">
              Shiprocket configuration
            </h2>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="rounded-xl bg-yellow-50 border border-yellow-100 p-3">
          <div className="flex gap-3">
            <ShieldCheck className="w-4 h-4 text-yellow-700 mt-0.5" />

            <div>
              <p className="text-xs font-black text-yellow-900">
                Credentials stay server-side
              </p>

              <p className="text-[10px] text-yellow-700 mt-1 leading-relaxed">
                Production Shiprocket credentials must never
                be exposed in frontend code. The final backend
                will read them from environment variables.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[9px] uppercase tracking-wider font-black text-slate-500 mb-2">
            Shiprocket email
          </label>

          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="email"
              value={config.email}
              onChange={e =>
                update(
                  'email',
                  e.target.value
                )
              }
              placeholder="operations@yourbrand.com"
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs font-semibold outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[9px] uppercase tracking-wider font-black text-slate-500 mb-2">
            Shiprocket password
          </label>

          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="password"
              value={config.password}
              onChange={e =>
                update(
                  'password',
                  e.target.value
                )
              }
              placeholder="••••••••••••"
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs font-semibold outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[9px] uppercase tracking-wider font-black text-slate-500 mb-2">
            Default pickup location
          </label>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={config.pickupLocation}
              onChange={e =>
                update(
                  'pickupLocation',
                  e.target.value
                )
              }
              placeholder="Mumbai Bhiwandi Hub"
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs font-semibold outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[9px] uppercase tracking-wider font-black text-slate-500 mb-2">
            Channel ID
          </label>

          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={config.channelId}
              onChange={e =>
                update(
                  'channelId',
                  e.target.value
                )
              }
              placeholder="Optional channel identifier"
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs font-semibold outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <Toggle
            enabled={config.autoAssignCourier}
            onChange={value =>
              update(
                'autoAssignCourier',
                value
              )
            }
            label="Automatic courier assignment"
            description="Choose the best courier using serviceability, cost and SLA."
          />

          <Toggle
            enabled={config.autoGenerateAwb}
            onChange={value =>
              update(
                'autoGenerateAwb',
                value
              )
            }
            label="Automatic AWB generation"
            description="Generate the airway bill after shipment creation."
          />

          <Toggle
            enabled={config.autoSyncTracking}
            onChange={value =>
              update(
                'autoSyncTracking',
                value
              )
            }
            label="Automatic tracking sync"
            description="Synchronize shipment events into the dashboard."
          />

          <Toggle
            enabled={config.enableNdrAlerts}
            onChange={value =>
              update(
                'enableNdrAlerts',
                value
              )
            }
            label="NDR and exception alerts"
            description="Surface delivery failures requiring operations attention."
          />
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="w-full h-11 rounded-xl bg-slate-950 text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-blue-900 transition disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}

          {saving
            ? 'Saving configuration...'
            : 'Save configuration'}
        </button>
      </div>
    </div>
  );
}

function CourierCard({
  courier,
  selected,
  onSelect
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(courier)}
      className={`w-full text-left rounded-xl border p-4 transition ${
        selected
          ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/10'
          : 'border-slate-200 hover:border-blue-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black text-slate-900">
            {courier.name}
          </p>

          <p className="text-[9px] text-slate-400 mt-1">
            {courier.type} • {courier.service}
          </p>
        </div>

        {selected && (
          <CheckCircle2 className="w-4 h-4 text-blue-700" />
        )}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Clock3 className="w-3.5 h-3.5 text-slate-400" />

        <span className="text-[9px] font-bold text-slate-500">
          Typical SLA: {courier.sla}
        </span>
      </div>
    </button>
  );
}

function ShipmentDetailsModal({
  shipment,
  onClose
}) {
  if (!shipment) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Close shipment"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />

      <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Shipment
            </p>

            <h2 className="text-sm font-black text-slate-950 mt-1">
              {shipment.shipmentId ||
                shipment.id}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-2xl bg-slate-950 text-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-black">
                  AWB
                </p>

                <p className="text-sm font-black mt-1">
                  {shipment.awb ||
                    'Awaiting AWB'}
                </p>
              </div>

              <Truck className="w-6 h-6 text-orange-400" />
            </div>

            <span
              className={`inline-flex mt-4 px-2.5 py-1 rounded-full border text-[9px] font-black ${statusClass(
                shipment.status
              )}`}
            >
              {prettyStatus(
                shipment.status
              )}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[9px] uppercase font-black text-slate-400">
                Order
              </p>

              <p className="text-xs font-black text-blue-700 mt-1">
                {shipment.orderId || '—'}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[9px] uppercase font-black text-slate-400">
                Carrier
              </p>

              <p className="text-xs font-black text-slate-800 mt-1">
                {shipment.courier ||
                  shipment.carrier ||
                  '—'}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-[9px] uppercase font-black text-slate-400">
              Customer
            </p>

            <p className="text-xs font-black text-slate-900 mt-1">
              {shipment.customer?.name ||
                'Customer'}
            </p>

            <p className="text-[10px] text-slate-500 mt-1">
              {shipment.customer?.phone ||
                'Phone unavailable'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-[9px] uppercase font-black text-slate-400">
              Last synchronization
            </p>

            <p className="text-xs font-bold text-slate-700 mt-1">
              {formatDate(
                shipment.updatedAt ||
                  shipment.lastUpdated
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShiprocketPanel({
  shipments = [],
  integration = {},
  onSaveConfig,
  onRefresh,
  onSync,
  onTrackShipment,
  loading = false
}) {
  const [config, setConfig] = useState({
    ...DEFAULT_CONFIG,
    ...integration
  });

  const [saving, setSaving] = useState(false);
  const [shipmentSearch, setShipmentSearch] =
    useState('');

  const [selectedCourier, setSelectedCourier] =
    useState(null);

  const [selectedShipment, setSelectedShipment] =
    useState(null);

  const [connectionStatus, setConnectionStatus] =
    useState(
      integration.connected
        ? 'CONNECTED'
        : 'NOT_CONNECTED'
    );

  const handleSave = async () => {
    setSaving(true);

    try {
      await onSaveConfig?.(config);

      setConnectionStatus('CONNECTED');
    } finally {
      setSaving(false);
    }
  };

  const filteredShipments = useMemo(() => {
    const query = shipmentSearch
      .trim()
      .toLowerCase();

    if (!query) {
      return shipments.slice(0, 8);
    }

    return shipments
      .filter(shipment =>
        [
          shipment.shipmentId,
          shipment.awb,
          shipment.orderId,
          shipment.customer?.name,
          shipment.customer?.phone,
          shipment.item,
          shipment.courier,
          shipment.carrier
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query)
      )
      .slice(0, 12);
  }, [shipments, shipmentSearch]);

  const metrics = useMemo(() => {
    return {
      total: shipments.length,

      delivered: shipments.filter(
        shipment =>
          shipment.status === 'DELIVERED'
      ).length,

      inTransit: shipments.filter(
        shipment =>
          shipment.status ===
            'IN_TRANSIT' ||
          shipment.status === 'SHIPPED'
      ).length,

      exceptions: shipments.filter(
        shipment =>
          shipment.status ===
            'EXCEPTION' ||
          shipment.exception
      ).length
    };
  }, [shipments]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] font-black text-orange-600">
              Carrier integration
            </p>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
              Shiprocket
            </h1>

            <p className="text-xs text-slate-500 mt-2">
              Manage courier allocation, AWBs, tracking
              synchronization and delivery exceptions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSync}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 text-white text-xs font-black hover:bg-blue-800 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  loading
                    ? 'animate-spin'
                    : ''
                }`}
              />
              Sync tracking
            </button>

            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50"
            >
              <Activity className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
        </div>

        <div
          className={`rounded-2xl border p-4 ${
            connectionStatus ===
            'CONNECTED'
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {connectionStatus ===
              'CONNECTED' ? (
                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              )}

              <div>
                <p
                  className={`text-xs font-black ${
                    connectionStatus ===
                    'CONNECTED'
                      ? 'text-green-900'
                      : 'text-yellow-900'
                  }`}
                >
                  {connectionStatus ===
                  'CONNECTED'
                    ? 'Shiprocket integration connected'
                    : 'Shiprocket integration not connected'}
                </p>

                <p
                  className={`text-[10px] mt-1 ${
                    connectionStatus ===
                    'CONNECTED'
                      ? 'text-green-700'
                      : 'text-yellow-700'
                  }`}
                >
                  {connectionStatus ===
                  'CONNECTED'
                    ? 'Carrier services are ready for backend synchronization.'
                    : 'Configure the integration before enabling production shipment automation.'}
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-white/70 border border-black/5 text-[9px] font-black">
              {connectionStatus ===
              'CONNECTED'
                ? 'ONLINE'
                : 'SETUP REQUIRED'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            icon={Truck}
            label="Shipments"
            value={metrics.total}
            description="Shipments in operations"
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
            icon={PackageCheck}
            label="Delivered"
            value={metrics.delivered}
            description="Successfully delivered"
            className="bg-green-50 text-green-700"
          />

          <MetricCard
            icon={AlertTriangle}
            label="Exceptions"
            value={metrics.exceptions}
            description="Need intervention"
            className="bg-red-50 text-red-700"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-5">
          <ConfigurationPanel
            config={config}
            setConfig={setConfig}
            onSave={handleSave}
            saving={saving}
          />

          <div className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
                      Courier selection
                    </p>

                    <h2 className="text-sm font-black text-slate-950 mt-0.5">
                      Preferred carriers
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2">
                {CARRIERS.map(
                  courier => (
                    <CourierCard
                      key={`${courier.name}-${courier.type}`}
                      courier={courier}
                      selected={
                        selectedCourier?.name ===
                        courier.name
                      }
                      onSelect={
                        setSelectedCourier
                      }
                    />
                  )
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-400 mt-0.5" />

                <div>
                  <p className="text-xs font-black">
                    Production architecture
                  </p>

                  <p className="text-[10px] text-slate-300 leading-relaxed mt-2">
                    Frontend → D2C backend →
                    Shiprocket. API credentials,
                    authentication tokens and webhook
                    secrets remain on the backend.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <p className="text-[9px] text-slate-400">
                    AWB
                  </p>

                  <p className="text-xs font-black mt-1">
                    Automated
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <p className="text-[9px] text-slate-400">
                    Tracking
                  </p>

                  <p className="text-xs font-black mt-1">
                    Webhook sync
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
                  Carrier operations
                </p>

                <h2 className="text-sm font-black text-slate-950 mt-1">
                  Recent shipments
                </h2>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="search"
                  value={shipmentSearch}
                  onChange={e =>
                    setShipmentSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search AWB, order, customer..."
                  className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-[10px] font-semibold outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {filteredShipments.length ===
          0 ? (
            <div className="p-12 text-center">
              <Truck className="w-8 h-8 text-slate-300 mx-auto" />

              <p className="text-xs font-black text-slate-600 mt-3">
                No shipments available
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredShipments.map(
                shipment => (
                  <button
                    key={
                      shipment.shipmentId ||
                      shipment.id
                    }
                    type="button"
                    onClick={() =>
                      setSelectedShipment(
                        shipment
                      )
                    }
                    className="w-full text-left px-5 py-4 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-black text-blue-700">
                            {shipment.shipmentId ||
                              shipment.id}
                          </p>

                          <span
                            className={`px-2 py-0.5 rounded-full border text-[8px] font-black ${statusClass(
                              shipment.status
                            )}`}
                          >
                            {prettyStatus(
                              shipment.status
                            )}
                          </span>
                        </div>

                        <p className="text-[10px] font-bold text-slate-700 mt-1 truncate">
                          {shipment.customer?.name ||
                            'Customer'}{' '}
                          •{' '}
                          {shipment.orderId ||
                            'Order'}
                        </p>

                        <p className="text-[9px] text-slate-400 mt-1 truncate">
                          AWB:{' '}
                          {shipment.awb ||
                            'Pending'}{' '}
                          •{' '}
                          {shipment.courier ||
                            shipment.carrier ||
                            'Carrier pending'}
                        </p>
                      </div>

                      <div className="hidden md:block text-right">
                        <p className="text-[9px] text-slate-400">
                          Updated
                        </p>

                        <p className="text-[10px] font-bold text-slate-600 mt-1">
                          {formatDate(
                            shipment.updatedAt ||
                              shipment.lastUpdated
                          )}
                        </p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                    </div>
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
            <Truck className="w-5 h-5 text-blue-700" />

            <p className="text-xs font-black text-blue-950 mt-4">
              Courier allocation
            </p>

            <p className="text-[10px] text-blue-700 mt-1 leading-relaxed">
              Route shipments based on destination
              serviceability, SLA, cost and warehouse
              availability.
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5">
            <PackageCheck className="w-5 h-5 text-orange-600" />

            <p className="text-xs font-black text-orange-950 mt-4">
              AWB lifecycle
            </p>

            <p className="text-[10px] text-orange-700 mt-1 leading-relaxed">
              Create shipment, assign courier, generate AWB,
              schedule pickup and update the order.
            </p>
          </div>

          <div className="rounded-2xl bg-green-50 border border-green-100 p-5">
            <Activity className="w-5 h-5 text-green-700" />

            <p className="text-xs font-black text-green-950 mt-4">
              Real-time tracking
            </p>

            <p className="text-[10px] text-green-700 mt-1 leading-relaxed">
              Carrier events flow into the customer tracking
              experience and admin operations dashboard.
            </p>
          </div>
        </div>
      </div>

      <ShipmentDetailsModal
        shipment={selectedShipment}
        onClose={() =>
          setSelectedShipment(null)
        }
      />
    </>
  );
}