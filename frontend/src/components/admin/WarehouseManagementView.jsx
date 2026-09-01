import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRightLeft,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Package,
  RefreshCw,
  Search,
  Truck,
  Warehouse,
  X
} from "lucide-react";

const defaultWarehouses = [
  {
    id: "WH-MUM-01",
    name: "Mumbai Bhiwandi Hub",
    city: "Mumbai",
    state: "Maharashtra",
    code: "MUM",
    status: "active",
    capacity: 12000,
    occupied: 8420,
    available: 3580,
    ordersToday: 184,
    pendingOrders: 42,
    dispatchToday: 136,
    lowStock: 18,
    staff: 34,
    carriers: ["Delhivery", "Blue Dart", "Shiprocket"],
    sla: "98.2%",
    lastSync: "2 min ago"
  },
  {
    id: "WH-DEL-01",
    name: "Delhi NCR Hub",
    city: "Delhi",
    state: "Delhi",
    code: "DEL",
    status: "active",
    capacity: 10000,
    occupied: 7160,
    available: 2840,
    ordersToday: 161,
    pendingOrders: 35,
    dispatchToday: 119,
    lowStock: 11,
    staff: 29,
    carriers: ["Delhivery", "Ecom Express", "Blue Dart"],
    sla: "97.6%",
    lastSync: "4 min ago"
  },
  {
    id: "WH-JAI-01",
    name: "Jaipur Depot",
    city: "Jaipur",
    state: "Rajasthan",
    code: "JAI",
    status: "active",
    capacity: 7000,
    occupied: 4210,
    available: 2790,
    ordersToday: 93,
    pendingOrders: 21,
    dispatchToday: 76,
    lowStock: 7,
    staff: 18,
    carriers: ["Xpressbees", "Delhivery", "Shiprocket"],
    sla: "96.9%",
    lastSync: "5 min ago"
  },
  {
    id: "WH-BLR-01",
    name: "Bengaluru Whitefield Hub",
    city: "Bengaluru",
    state: "Karnataka",
    code: "BLR",
    status: "active",
    capacity: 9000,
    occupied: 6480,
    available: 2520,
    ordersToday: 147,
    pendingOrders: 28,
    dispatchToday: 111,
    lowStock: 14,
    staff: 27,
    carriers: ["Delhivery", "Ecom Express", "Xpressbees"],
    sla: "98.7%",
    lastSync: "1 min ago"
  }
];

const defaultQueues = [
  {
    id: "Q-001",
    warehouse: "WH-MUM-01",
    type: "Pick & Pack",
    orders: 24,
    priority: "high",
    oldest: "18 min",
    status: "active"
  },
  {
    id: "Q-002",
    warehouse: "WH-DEL-01",
    type: "Packing",
    orders: 17,
    priority: "medium",
    oldest: "27 min",
    status: "active"
  },
  {
    id: "Q-003",
    warehouse: "WH-BLR-01",
    type: "Ready to Dispatch",
    orders: 31,
    priority: "high",
    oldest: "12 min",
    status: "active"
  },
  {
    id: "Q-004",
    warehouse: "WH-JAI-01",
    type: "Pick & Pack",
    orders: 9,
    priority: "low",
    oldest: "41 min",
    status: "active"
  }
];

const number = (value) => Number(value || 0).toLocaleString("en-IN");

const occupancy = (warehouse) =>
  Math.round((warehouse.occupied / warehouse.capacity) * 100);

const statusClasses = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  paused: "bg-amber-50 text-amber-700 border-amber-200",
  maintenance: "bg-red-50 text-red-700 border-red-200"
};

const priorityClasses = {
  high: "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-slate-100 text-slate-600"
};

export default function WarehouseManagementView({
  api,
  onViewOrder,
  onViewInventory
}) {
  const [warehouses, setWarehouses] = useState(defaultWarehouses);
  const [queues, setQueues] = useState(defaultQueues);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [transfer, setTransfer] = useState({
    from: "",
    to: "",
    sku: "",
    quantity: 1
  });
  const [toast, setToast] = useState("");

  const loadWarehouses = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      if (api?.getAdminWarehouses) {
        const response = await api.getAdminWarehouses();
        const data = response?.data || response;
        if (Array.isArray(data?.warehouses)) setWarehouses(data.warehouses);
        if (Array.isArray(data?.queues)) setQueues(data.queues);
      }
    } catch {
      setToast("Using latest available warehouse data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((warehouse) => {
      const matchesSearch =
        !search ||
        `${warehouse.name} ${warehouse.city} ${warehouse.state} ${warehouse.code}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "all" || warehouse.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [warehouses, search, status]);

  const metrics = useMemo(() => {
    const capacity = warehouses.reduce(
      (sum, warehouse) => sum + warehouse.capacity,
      0
    );
    const occupied = warehouses.reduce(
      (sum, warehouse) => sum + warehouse.occupied,
      0
    );
    const orders = warehouses.reduce(
      (sum, warehouse) => sum + warehouse.ordersToday,
      0
    );
    const pending = warehouses.reduce(
      (sum, warehouse) => sum + warehouse.pendingOrders,
      0
    );
    const dispatch = warehouses.reduce(
      (sum, warehouse) => sum + warehouse.dispatchToday,
      0
    );
    const lowStock = warehouses.reduce(
      (sum, warehouse) => sum + warehouse.lowStock,
      0
    );

    return {
      capacity,
      occupied,
      occupancy: capacity ? Math.round((occupied / capacity) * 100) : 0,
      orders,
      pending,
      dispatch,
      lowStock
    };
  }, [warehouses]);

  const handleTransfer = async () => {
    if (!transfer.from || !transfer.to || !transfer.sku || !transfer.quantity) {
      setToast("Complete all transfer fields");
      return;
    }

    if (transfer.from === transfer.to) {
      setToast("Source and destination must be different");
      return;
    }

    try {
      if (api?.transferInventory) {
        await api.transferInventory({
          fromWarehouse: transfer.from,
          toWarehouse: transfer.to,
          sku: transfer.sku,
          quantity: Number(transfer.quantity)
        });
      }

      setToast("Inventory transfer created successfully");
      setTransferOpen(false);
      setTransfer({
        from: "",
        to: "",
        sku: "",
        quantity: 1
      });
      loadWarehouses(true);
    } catch {
      setToast("Unable to create inventory transfer");
    }
  };

  const handleQueueAction = async (queue) => {
    try {
      if (api?.updateWarehouseQueue) {
        await api.updateWarehouseQueue(queue.id, {
          status: queue.status === "active" ? "paused" : "active"
        });
      }

      setQueues((current) =>
        current.map((item) =>
          item.id === queue.id
            ? {
                ...item,
                status: item.status === "active" ? "paused" : "active"
              }
            : item
        )
      );

      setToast(
        queue.status === "active"
          ? `${queue.type} queue paused`
          : `${queue.type} queue resumed`
      );
    } catch {
      setToast("Unable to update queue");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-600">
              <Warehouse size={17} />
              Operations
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              Warehouse Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor hubs, capacity, fulfillment queues and inventory movement.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadWarehouses(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={() => setTransferOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800"
            >
              <ArrowRightLeft size={16} />
              Transfer Stock
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
          {[
            ["Warehouses", warehouses.length, Warehouse],
            ["Capacity", number(metrics.capacity), Boxes],
            ["Occupied", `${metrics.occupancy}%`, Package],
            ["Orders Today", number(metrics.orders), Truck],
            ["Pending", number(metrics.pending), Clock3],
            ["Low Stock", number(metrics.lowStock), AlertTriangle]
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
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search warehouse, city, state or code..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Fulfillment Hubs
              </h2>
              <p className="text-sm text-slate-500">
                Live operational snapshot across India.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl bg-white shadow-sm"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredWarehouses.map((warehouse) => {
                const usage = occupancy(warehouse);

                return (
                  <div
                    key={warehouse.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="border-b border-slate-100 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                            <Warehouse size={21} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-black text-slate-900">
                              {warehouse.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <MapPin size={13} />
                              {warehouse.city}, {warehouse.state}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${
                            statusClasses[warehouse.status] ||
                            statusClasses.active
                          }`}
                        >
                          {warehouse.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-slate-100">
                      <div className="p-4">
                        <p className="text-xs text-slate-400">Orders</p>
                        <p className="mt-1 text-lg font-black text-slate-900">
                          {number(warehouse.ordersToday)}
                        </p>
                      </div>
                      <div className="border-x border-slate-100 p-4">
                        <p className="text-xs text-slate-400">Dispatch</p>
                        <p className="mt-1 text-lg font-black text-slate-900">
                          {number(warehouse.dispatchToday)}
                        </p>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-slate-400">SLA</p>
                        <p className="mt-1 text-lg font-black text-emerald-600">
                          {warehouse.sla}
                        </p>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">
                          Storage Utilization
                        </span>
                        <span className="text-sm font-black text-slate-900">
                          {usage}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            usage >= 90
                              ? "bg-red-500"
                              : usage >= 75
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(usage, 100)}%` }}
                        />
                      </div>

                      <div className="mt-2 flex justify-between text-xs text-slate-400">
                        <span>{number(warehouse.occupied)} occupied</span>
                        <span>{number(warehouse.available)} available</span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedWarehouse(warehouse)}
                          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                          View Hub
                        </button>

                        <button
                          onClick={() => {
                            setTransfer({
                              from: warehouse.id,
                              to: "",
                              sku: "",
                              quantity: 1
                            });
                            setTransferOpen(true);
                          }}
                          className="rounded-xl bg-orange-500 px-3 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
                        >
                          Transfer Stock
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <div className="mb-3">
            <h2 className="text-lg font-black text-slate-900">
              Fulfillment Queues
            </h2>
            <p className="text-sm text-slate-500">
              Orders currently waiting for warehouse action.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr>
                    {[
                      "Queue",
                      "Warehouse",
                      "Orders",
                      "Priority",
                      "Oldest",
                      "Status",
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
                  {queues.map((queue) => {
                    const warehouse = warehouses.find(
                      (item) => item.id === queue.warehouse
                    );

                    return (
                      <tr key={queue.id} className="hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900">
                            {queue.type}
                          </div>
                          <div className="text-xs text-slate-400">
                            {queue.id}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                          {warehouse?.name || queue.warehouse}
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-black text-slate-900">
                            {queue.orders}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                              priorityClasses[queue.priority]
                            }`}
                          >
                            {queue.priority}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                          {queue.oldest}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-bold ${
                              queue.status === "active"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {queue.status === "active" ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <Clock3 size={14} />
                            )}
                            {queue.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleQueueAction(queue)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            {queue.status === "active" ? "Pause" : "Resume"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-black text-slate-900">
                Dispatch Performance
              </h2>
              <p className="text-sm text-slate-500">
                Warehouse-level operational health.
              </p>
            </div>

            <Truck size={20} className="text-orange-500" />
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {warehouses.map((warehouse) => {
              const rate = warehouse.ordersToday
                ? Math.round(
                    (warehouse.dispatchToday / warehouse.ordersToday) * 100
                  )
                : 0;

              return (
                <div
                  key={warehouse.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold text-slate-700">
                      {warehouse.code}
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {rate}%
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{ width: `${rate}%` }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-xs text-slate-400">
                    <span>{warehouse.dispatchToday} dispatched</span>
                    <span>{warehouse.pendingOrders} pending</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {selectedWarehouse && (
        <div className="fixed inset-0 z-50 bg-slate-950/40">
          <div className="absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5">
              <div>
                <h2 className="font-black text-slate-900">
                  {selectedWarehouse.name}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedWarehouse.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedWarehouse(null)}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Capacity", number(selectedWarehouse.capacity)],
                  ["Occupied", number(selectedWarehouse.occupied)],
                  ["Available", number(selectedWarehouse.available)],
                  ["Staff", number(selectedWarehouse.staff)],
                  ["Orders Today", number(selectedWarehouse.ordersToday)],
                  ["Low Stock", number(selectedWarehouse.lowStock)]
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 text-lg font-black text-slate-900">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">
                    Capacity
                  </span>
                  <span className="font-black text-slate-900">
                    {occupancy(selectedWarehouse)}%
                  </span>
                </div>

                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{
                      width: `${occupancy(selectedWarehouse)}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-black text-slate-900">
                  Supported Carriers
                </h3>

                <div className="flex flex-wrap gap-2">
                  {selectedWarehouse.carriers.map((carrier) => (
                    <span
                      key={carrier}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700"
                    >
                      {carrier}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex items-start gap-3">
                  <Clock3 size={18} className="mt-0.5 text-orange-600" />
                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Last synchronization
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Inventory and fulfillment data synced{" "}
                      {selectedWarehouse.lastSync}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                {onViewInventory && (
                  <button
                    onClick={() => onViewInventory(selectedWarehouse)}
                    className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
                  >
                    View Warehouse Inventory
                    <ChevronRight size={17} />
                  </button>
                )}

                <button
                  onClick={() => {
                    setTransfer({
                      from: selectedWarehouse.id,
                      to: "",
                      sku: "",
                      quantity: 1
                    });
                    setSelectedWarehouse(null);
                    setTransferOpen(true);
                  }}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
                >
                  Transfer Inventory
                  <ArrowRightLeft size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {transferOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="font-black text-slate-900">
                  Transfer Inventory
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Move stock between fulfillment hubs.
                </p>
              </div>

              <button
                onClick={() => setTransferOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-500">
                    From Warehouse
                  </span>
                  <select
                    value={transfer.from}
                    onChange={(event) =>
                      setTransfer((current) => ({
                        ...current,
                        from: event.target.value
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                  >
                    <option value="">Select source</option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-500">
                    To Warehouse
                  </span>
                  <select
                    value={transfer.to}
                    onChange={(event) =>
                      setTransfer((current) => ({
                        ...current,
                        to: event.target.value
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                  >
                    <option value="">Select destination</option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-500">
                  SKU
                </span>
                <input
                  value={transfer.sku}
                  onChange={(event) =>
                    setTransfer((current) => ({
                      ...current,
                      sku: event.target.value
                    }))
                  }
                  placeholder="Example: SKU-10024"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-500">
                  Quantity
                </span>
                <input
                  type="number"
                  min="1"
                  value={transfer.quantity}
                  onChange={(event) =>
                    setTransfer((current) => ({
                      ...current,
                      quantity: event.target.value
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                />
              </label>

              <div className="rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-700">
                Transfers should be used only after checking available stock,
                open orders and warehouse capacity.
              </div>

              <button
                onClick={handleTransfer}
                className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white hover:bg-orange-600"
              >
                Create Transfer
              </button>
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