import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  History,
  Package,
  Plus,
  RefreshCw,
  Search,
  Warehouse,
  X
} from "lucide-react";

const initialInventory = [
  {
    id: "INV-001",
    sku: "sku-1",
    product: "Essence Mascara",
    brand: "D2C Beauty",
    warehouse: "Mumbai Bhiwandi Hub",
    available: 142,
    reserved: 18,
    sold: 326,
    reorderLevel: 40,
    status: "healthy",
    lastUpdated: "2 min ago"
  },
  {
    id: "INV-002",
    sku: "sku-2",
    product: "Glamour Eyeshadow",
    brand: "D2C Beauty",
    warehouse: "Delhi NCR Hub",
    available: 31,
    reserved: 12,
    sold: 248,
    reorderLevel: 40,
    status: "low",
    lastUpdated: "4 min ago"
  },
  {
    id: "INV-003",
    sku: "sku-3",
    product: "Velvet Touch Powder",
    brand: "D2C Beauty",
    warehouse: "Bengaluru Whitefield Hub",
    available: 0,
    reserved: 7,
    sold: 391,
    reorderLevel: 35,
    status: "out_of_stock",
    lastUpdated: "1 min ago"
  },
  {
    id: "INV-004",
    sku: "sku-4",
    product: "Chic Fragrance CK One",
    brand: "D2C Fragrance",
    warehouse: "Jaipur Depot",
    available: 76,
    reserved: 9,
    sold: 184,
    reorderLevel: 25,
    status: "healthy",
    lastUpdated: "5 min ago"
  },
  {
    id: "INV-005",
    sku: "sku-5",
    product: "Hydrating Face Serum",
    brand: "Glow Lab",
    warehouse: "Mumbai Bhiwandi Hub",
    available: 19,
    reserved: 8,
    sold: 212,
    reorderLevel: 30,
    status: "low",
    lastUpdated: "3 min ago"
  },
  {
    id: "INV-006",
    sku: "sku-6",
    product: "Everyday Lip Tint",
    brand: "D2C Beauty",
    warehouse: "Delhi NCR Hub",
    available: 0,
    reserved: 0,
    sold: 277,
    reorderLevel: 30,
    status: "out_of_stock",
    lastUpdated: "7 min ago"
  }
];

const initialMovements = [
  {
    id: "MOV-1001",
    sku: "sku-1",
    product: "Essence Mascara",
    warehouse: "Mumbai Bhiwandi Hub",
    type: "sale",
    quantity: -2,
    reference: "D2C-849201",
    time: "2 min ago"
  },
  {
    id: "MOV-1002",
    sku: "sku-2",
    product: "Glamour Eyeshadow",
    warehouse: "Delhi NCR Hub",
    type: "reservation",
    quantity: -1,
    reference: "D2C-849205",
    time: "4 min ago"
  },
  {
    id: "MOV-1003",
    sku: "sku-4",
    product: "Chic Fragrance CK One",
    warehouse: "Jaipur Depot",
    type: "restock",
    quantity: 50,
    reference: "PO-2026-88",
    time: "12 min ago"
  }
];

const statusConfig = {
  healthy: {
    label: "Healthy",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700"
  },
  low: {
    label: "Low Stock",
    className: "border-amber-200 bg-amber-50 text-amber-700"
  },
  out_of_stock: {
    label: "Out of Stock",
    className: "border-red-200 bg-red-50 text-red-700"
  }
};

const movementConfig = {
  sale: "Sale",
  reservation: "Reserved",
  release: "Released",
  restock: "Restock",
  adjustment: "Adjustment",
  transfer: "Transfer"
};

const number = (value) =>
  Number(value || 0).toLocaleString("en-IN");

export default function InventoryManagementView({
  api,
  onViewProduct,
  onViewWarehouse
}) {
  const [inventory, setInventory] = useState(initialInventory);
  const [movements, setMovements] = useState(initialMovements);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [warehouse, setWarehouse] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);
  const [adjustment, setAdjustment] = useState({
    sku: "",
    warehouse: "",
    quantity: 1,
    type: "add",
    reason: ""
  });
  const [toast, setToast] = useState("");

  const loadInventory = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      if (api?.getAdminInventory) {
        const response = await api.getAdminInventory({
          search,
          status,
          warehouse,
          page,
          limit
        });

        const data = response?.data || response;

        if (Array.isArray(data?.inventory)) {
          setInventory(data.inventory);
        }

        if (Array.isArray(data?.movements)) {
          setMovements(data.movements);
        }
      }
    } catch {
      setToast("Using latest available inventory data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [page]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 2600);

    return () => clearTimeout(timer);
  }, [toast]);

  const warehouses = useMemo(
    () =>
      [...new Set(initialInventory.map((item) => item.warehouse))],
    []
  );

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inventory.filter((item) => {
      const matchesSearch =
        !query ||
        `${item.sku} ${item.product} ${item.brand} ${item.warehouse}`
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "all" || item.status === status;

      const matchesWarehouse =
        warehouse === "all" || item.warehouse === warehouse;

      return matchesSearch && matchesStatus && matchesWarehouse;
    });
  }, [inventory, search, status, warehouse]);

  const metrics = useMemo(() => {
    return {
      totalSkus: inventory.length,
      available: inventory.reduce(
        (sum, item) => sum + Number(item.available || 0),
        0
      ),
      reserved: inventory.reduce(
        (sum, item) => sum + Number(item.reserved || 0),
        0
      ),
      lowStock: inventory.filter(
        (item) => item.status === "low"
      ).length,
      outOfStock: inventory.filter(
        (item) => item.status === "out_of_stock"
      ).length
    };
  }, [inventory]);

  const handleAdjustment = async () => {
    const quantity = Number(adjustment.quantity);

    if (
      !adjustment.sku ||
      !adjustment.warehouse ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      !adjustment.reason.trim()
    ) {
      setToast("Complete all adjustment fields");
      return;
    }

    try {
      if (api?.adjustInventory) {
        await api.adjustInventory({
          sku: adjustment.sku,
          warehouse: adjustment.warehouse,
          quantity:
            adjustment.type === "add" ? quantity : -quantity,
          reason: adjustment.reason
        });
      }

      setInventory((current) =>
        current.map((item) => {
          if (
            item.sku !== adjustment.sku ||
            item.warehouse !== adjustment.warehouse
          ) {
            return item;
          }

          const nextAvailable =
            item.available +
            (adjustment.type === "add" ? quantity : -quantity);

          return {
            ...item,
            available: Math.max(nextAvailable, 0),
            status:
              nextAvailable <= 0
                ? "out_of_stock"
                : nextAvailable <= item.reorderLevel
                ? "low"
                : "healthy",
            lastUpdated: "just now"
          };
        })
      );

      setToast("Inventory adjusted successfully");
      setAdjustmentOpen(false);

      setAdjustment({
        sku: "",
        warehouse: "",
        quantity: 1,
        type: "add",
        reason: ""
      });

      loadInventory(true);
    } catch {
      setToast("Unable to adjust inventory");
    }
  };

  const handleReserve = async (item) => {
    try {
      if (api?.reserveInventory) {
        await api.reserveInventory({
          sku: item.sku,
          warehouse: item.warehouse,
          quantity: 1
        });
      }

      setInventory((current) =>
        current.map((row) =>
          row.id === item.id && row.available > 0
            ? {
                ...row,
                available: row.available - 1,
                reserved: row.reserved + 1
              }
            : row
        )
      );

      setToast("1 unit reserved");
    } catch {
      setToast("Unable to reserve inventory");
    }
  };

  const handleRelease = async (item) => {
    try {
      if (api?.releaseInventory) {
        await api.releaseInventory({
          sku: item.sku,
          warehouse: item.warehouse,
          quantity: 1
        });
      }

      setInventory((current) =>
        current.map((row) =>
          row.id === item.id && row.reserved > 0
            ? {
                ...row,
                available: row.available + 1,
                reserved: row.reserved - 1
              }
            : row
        )
      );

      setToast("1 reserved unit released");
    } catch {
      setToast("Unable to release inventory");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-orange-600">
              <Boxes size={17} />
              Inventory Operations
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              Inventory Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Control stock, reservations, adjustments and inventory health.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadInventory(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={() => {
                setAdjustment({
                  sku: "",
                  warehouse: "",
                  quantity: 1,
                  type: "add",
                  reason: ""
                });
                setAdjustmentOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-orange-600"
            >
              <Plus size={17} />
              Adjust Stock
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {[
            ["Total SKUs", metrics.totalSkus, Boxes],
            ["Available Units", metrics.available, Package],
            ["Reserved Units", metrics.reserved, History],
            ["Low Stock", metrics.lowStock, AlertTriangle],
            ["Out of Stock", metrics.outOfStock, X]
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
                {number(value)}
              </div>
            </div>
          ))}
        </div>

        {(metrics.lowStock > 0 || metrics.outOfStock > 0) && (
          <div className="grid gap-3 md:grid-cols-2">
            {metrics.outOfStock > 0 && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <AlertTriangle
                  size={20}
                  className="mt-0.5 text-red-600"
                />

                <div>
                  <p className="font-black text-red-800">
                    Immediate stock action required
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    {metrics.outOfStock} SKU
                    {metrics.outOfStock !== 1 ? "s are" : " is"} currently
                    unavailable for sale.
                  </p>
                </div>
              </div>
            )}

            {metrics.lowStock > 0 && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle
                  size={20}
                  className="mt-0.5 text-amber-600"
                />

                <div>
                  <p className="font-black text-amber-800">
                    Replenishment recommended
                  </p>

                  <p className="mt-1 text-sm text-amber-700">
                    {metrics.lowStock} SKU
                    {metrics.lowStock !== 1 ? "s are" : " is"} below its
                    configured reorder level.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search SKU, product, brand or warehouse..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="all">All Stock Status</option>
              <option value="healthy">Healthy</option>
              <option value="low">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            <select
              value={warehouse}
              onChange={(event) => {
                setWarehouse(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="all">All Warehouses</option>

              {warehouses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-black text-slate-900">
                Stock Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                SKU-level availability across fulfillment hubs.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
              {filteredInventory.length} records
            </span>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="p-14 text-center">
              <Boxes
                size={38}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-black text-slate-800">
                No inventory found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr>
                    {[
                      "Product",
                      "Warehouse",
                      "Available",
                      "Reserved",
                      "Sold",
                      "Reorder Level",
                      "Status",
                      "Actions"
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
                  {filteredInventory.map((item) => {
                    const config =
                      statusConfig[item.status] ||
                      statusConfig.healthy;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <button
                            onClick={() =>
                              setSelectedItem(item)
                            }
                            className="text-left"
                          >
                            <p className="font-black text-slate-900 hover:text-orange-600">
                              {item.product}
                            </p>

                            <p className="mt-1 text-xs font-semibold text-slate-400">
                              {item.brand} · {item.sku}
                            </p>
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Warehouse
                              size={15}
                              className="text-orange-500"
                            />
                            {item.warehouse}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-lg font-black text-slate-900">
                            {number(item.available)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-700">
                            {number(item.reserved)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-700">
                            {number(item.sold)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-600">
                            {number(item.reorderLevel)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-bold ${config.className}`}
                          >
                            {config.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex gap-1.5">
                            <button
                              onClick={() =>
                                handleReserve(item)
                              }
                              disabled={item.available <= 0}
                              title="Reserve one unit"
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <ArrowDownToLine size={15} />
                            </button>

                            <button
                              onClick={() =>
                                handleRelease(item)
                              }
                              disabled={item.reserved <= 0}
                              title="Release one unit"
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <ArrowUpFromLine size={15} />
                            </button>

                            <button
                              onClick={() => {
                                setAdjustment({
                                  sku: item.sku,
                                  warehouse: item.warehouse,
                                  quantity: 1,
                                  type: "add",
                                  reason: ""
                                });
                                setAdjustmentOpen(true);
                              }}
                              title="Adjust stock"
                              className="rounded-lg border border-orange-200 bg-orange-50 p-2 text-orange-600 hover:bg-orange-100"
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 p-4">
            <span className="text-xs font-semibold text-slate-500">
              Page {page}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPage((current) => Math.max(current - 1, 1))
                }
                disabled={page === 1}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() => setPage((current) => current + 1)}
                disabled={filteredInventory.length < limit}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-black text-slate-900">
              Recent Inventory Movements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Stock changes generated by orders and warehouse operations.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {movements.map((movement) => (
              <div
                key={movement.id}
                className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      movement.quantity > 0
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {movement.quantity > 0 ? (
                      <ArrowUpFromLine size={18} />
                    ) : (
                      <ArrowDownToLine size={18} />
                    )}
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">
                      {movement.product}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {movementConfig[movement.type] ||
                        movement.type}{" "}
                      · {movement.warehouse} ·{" "}
                      {movement.reference}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <span
                    className={`text-sm font-black ${
                      movement.quantity > 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {movement.quantity > 0 ? "+" : ""}
                    {movement.quantity}
                  </span>

                  <span className="text-xs font-semibold text-slate-400">
                    {movement.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/40">
          <div className="absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5">
              <div>
                <h2 className="font-black text-slate-900">
                  Inventory Details
                </h2>

                <p className="text-xs text-slate-400">
                  {selectedItem.sku}
                </p>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {selectedItem.product}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedItem.brand}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Available", selectedItem.available],
                  ["Reserved", selectedItem.reserved],
                  ["Sold", selectedItem.sold],
                  ["Reorder Level", selectedItem.reorderLevel]
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <p className="text-xs text-slate-400">
                      {label}
                    </p>

                    <p className="mt-1 text-xl font-black text-slate-900">
                      {number(value)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">
                    Stock Health
                  </span>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-bold ${
                      statusConfig[selectedItem.status].className
                    }`}
                  >
                    {statusConfig[selectedItem.status].label}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className={
                      selectedItem.status === "healthy"
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }
                  />

                  <span className="text-sm text-slate-600">
                    Last updated {selectedItem.lastUpdated}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2">
                  <Warehouse
                    size={17}
                    className="text-orange-500"
                  />

                  <span className="font-black text-slate-900">
                    {selectedItem.warehouse}
                  </span>
                </div>
              </div>

              <div className="grid gap-2">
                {onViewWarehouse && (
                  <button
                    onClick={() =>
                      onViewWarehouse(selectedItem.warehouse)
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    View Warehouse
                  </button>
                )}

                {onViewProduct && (
                  <button
                    onClick={() =>
                      onViewProduct(selectedItem.sku)
                    }
                    className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
                  >
                    View Product
                  </button>
                )}

                <button
                  onClick={() => {
                    setAdjustment({
                      sku: selectedItem.sku,
                      warehouse: selectedItem.warehouse,
                      quantity: 1,
                      type: "add",
                      reason: ""
                    });
                    setSelectedItem(null);
                    setAdjustmentOpen(true);
                  }}
                  className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white hover:bg-orange-600"
                >
                  Adjust Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {adjustmentOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="font-black text-slate-900">
                  Adjust Inventory
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Record a manual stock correction.
                </p>
              </div>

              <button
                onClick={() => setAdjustmentOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-500">
                  SKU
                </span>

                <input
                  value={adjustment.sku}
                  onChange={(event) =>
                    setAdjustment((current) => ({
                      ...current,
                      sku: event.target.value
                    }))
                  }
                  placeholder="Example: sku-1"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-500">
                  Warehouse
                </span>

                <select
                  value={adjustment.warehouse}
                  onChange={(event) =>
                    setAdjustment((current) => ({
                      ...current,
                      warehouse: event.target.value
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                >
                  <option value="">Select warehouse</option>

                  {warehouses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-500">
                    Adjustment
                  </span>

                  <select
                    value={adjustment.type}
                    onChange={(event) =>
                      setAdjustment((current) => ({
                        ...current,
                        type: event.target.value
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
                  >
                    <option value="add">Add Stock</option>
                    <option value="remove">Remove Stock</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-500">
                    Quantity
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={adjustment.quantity}
                    onChange={(event) =>
                      setAdjustment((current) => ({
                        ...current,
                        quantity: event.target.value
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-500">
                  Reason
                </span>

                <textarea
                  value={adjustment.reason}
                  onChange={(event) =>
                    setAdjustment((current) => ({
                      ...current,
                      reason: event.target.value
                    }))
                  }
                  rows={3}
                  placeholder="Example: Damaged stock, physical count correction..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                />
              </label>

              <button
                onClick={handleAdjustment}
                className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white hover:bg-orange-600"
              >
                Save Inventory Adjustment
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