import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Filter,
  History,
  IndianRupee,
  Package,
  RefreshCw,
  Search,
  ShieldAlert,
  Warehouse,
  X,
} from "lucide-react";

const DEFAULT_FILTERS = {
  search: "",
  warehouse: "ALL",
  category: "ALL",
  stock: "ALL",
  page: 1,
  limit: 15,
};

const FALLBACK_INVENTORY = [
  {
    id: "sku-1",
    skuId: "sku-1",
    brand: "Essence",
    brandColor: "#00A859",
    category: "beauty",
    warehouseCity: "Mumbai Bhiwandi Hub",
    name: "Essence Mascara Lash Princess",
    price: 829,
    mrp: 1299,
    stock: 99,
    reserved: 12,
    damaged: 2,
    reorderLevel: 20,
    incoming: 30,
    rating: 4.9,
    reviewsCount: 1420,
    estimatedDays: 2,
    image:
      "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
  },
  {
    id: "sku-2",
    skuId: "sku-2",
    brand: "Glamour",
    brandColor: "#0038A8",
    category: "beauty",
    warehouseCity: "Delhi NCR Hub",
    name: "Eyeshadow Palette with Mirror",
    price: 1659,
    mrp: 2499,
    stock: 34,
    reserved: 8,
    damaged: 1,
    reorderLevel: 15,
    incoming: 20,
    rating: 4.8,
    reviewsCount: 890,
    estimatedDays: 3,
    image:
      "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
  },
  {
    id: "sku-3",
    skuId: "sku-3",
    brand: "Velvet Touch",
    brandColor: "#FF6B00",
    category: "beauty",
    warehouseCity: "Bengaluru Whitefield Hub",
    name: "Powder Canister Compact",
    price: 1244,
    mrp: 1899,
    stock: 89,
    reserved: 15,
    damaged: 0,
    reorderLevel: 20,
    incoming: 40,
    rating: 4.7,
    reviewsCount: 650,
    estimatedDays: 2,
    image:
      "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png",
  },
  {
    id: "sku-4",
    skuId: "sku-4",
    brand: "Chic Fragrance",
    brandColor: "#8B5CF6",
    category: "fragrances",
    warehouseCity: "Jaipur Depot Hub",
    name: "Calvin Klein CK One EDT (100ml)",
    price: 3499,
    mrp: 5200,
    stock: 45,
    reserved: 4,
    damaged: 1,
    reorderLevel: 10,
    incoming: 15,
    rating: 4.9,
    reviewsCount: 2100,
    estimatedDays: 3,
    image:
      "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png",
  },
];

export default function WarehouseInventoryView({
  api,
  onOpenProduct,
}) {
  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== "" &&
          value !== null &&
          value !== undefined
        ) {
          params.set(key, value);
        }
      });

      let response = null;

      if (api?.getAdminInventory) {
        response = await api.getAdminInventory(
          params.toString()
        );
      }

      const list =
        response?.inventory ||
        response?.products ||
        FALLBACK_INVENTORY;

      setInventory(list);

      setPagination({
        page: response?.page || 1,
        limit: response?.limit || 15,
        total: response?.total || list.length,
        totalPages: response?.totalPages || 1,
      });
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load warehouse inventory."
      );

      setInventory(FALLBACK_INVENTORY);
    } finally {
      setLoading(false);
    }
  }, [api, filters]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const metrics = useMemo(() => {
    const totalUnits = inventory.reduce(
      (sum, item) =>
        sum + Number(item.stock || 0),
      0
    );

    const reservedUnits = inventory.reduce(
      (sum, item) =>
        sum + Number(item.reserved || 0),
      0
    );

    const damagedUnits = inventory.reduce(
      (sum, item) =>
        sum + Number(item.damaged || 0),
      0
    );

    const lowStock = inventory.filter(
      (item) =>
        Number(item.stock || 0) <=
        Number(item.reorderLevel || 10)
    );

    const inventoryValue = inventory.reduce(
      (sum, item) =>
        sum +
        Number(item.stock || 0) *
          Number(item.price || 0),
      0
    );

    return {
      totalUnits,
      reservedUnits,
      damagedUnits,
      lowStock: lowStock.length,
      inventoryValue,
    };
  }, [inventory]);

  const warehouses = useMemo(() => {
    return [
      ...new Set(
        inventory
          .map((item) => item.warehouseCity)
          .filter(Boolean)
      ),
    ];
  }, [inventory]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        inventory
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ];
  }, [inventory]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === "page" ? value : 1,
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const exportInventory = () => {
    if (!inventory.length) return;

    const headers = [
      "SKU",
      "Brand",
      "Product",
      "Category",
      "Warehouse",
      "Available Stock",
      "Reserved",
      "Damaged",
      "Incoming",
      "Reorder Level",
      "Unit Price",
      "Inventory Value",
    ];

    const rows = inventory.map((item) => [
      item.skuId || item.id || "",
      item.brand || "",
      item.name || "",
      item.category || "",
      item.warehouseCity || "",
      item.stock || 0,
      item.reserved || 0,
      item.damaged || 0,
      item.incoming || 0,
      item.reorderLevel || 0,
      item.price || 0,
      Number(item.stock || 0) *
        Number(item.price || 0),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replaceAll(
                '"',
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `d2c-inventory-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    anchor.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="space-y-5">
        {/* HEADER */}

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-950 text-white flex items-center justify-center">
                <Warehouse className="w-5 h-5" />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] font-black text-orange-600">
                  Supply Chain Control
                </p>

                <h1 className="text-2xl font-black text-slate-950">
                  Warehouse & Inventory
                </h1>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Monitor stock across Indian fulfillment hubs, reserved
              units, damaged inventory, replenishment and SKU movement.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadInventory}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={exportInventory}
              disabled={!inventory.length}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600 disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* KPI */}

        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
          <InventoryKpi
            icon={Boxes}
            label="Available Units"
            value={metrics.totalUnits}
            tone="blue"
          />

          <InventoryKpi
            icon={ArrowUpFromLine}
            label="Reserved Units"
            value={metrics.reservedUnits}
            tone="orange"
          />

          <InventoryKpi
            icon={ShieldAlert}
            label="Low Stock SKUs"
            value={metrics.lowStock}
            tone="red"
          />

          <InventoryKpi
            icon={Package}
            label="Damaged Units"
            value={metrics.damagedUnits}
            tone="yellow"
          />

          <InventoryKpi
            icon={IndianRupee}
            label="Inventory Value"
            value={formatCurrency(
              metrics.inventoryValue
            )}
            tone="green"
          />
        </div>

        {/* LOW STOCK ALERT */}

        {metrics.lowStock > 0 && (
          <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>

              <div>
                <p className="text-xs font-black text-orange-900">
                  Replenishment required
                </p>

                <p className="text-[8px] text-orange-700 mt-1">
                  {metrics.lowStock} SKU
                  {metrics.lowStock === 1 ? "" : "s"}{" "}
                  {metrics.lowStock === 1 ? "is" : "are"} at or below
                  the configured reorder level.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                updateFilter("stock", "LOW")
              }
              className="px-3 py-2 rounded-lg bg-orange-500 text-white text-[8px] font-black"
            >
              View Low Stock
            </button>
          </div>
        )}

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-yellow-700 mt-0.5" />

            <div>
              <p className="text-xs font-black text-yellow-900">
                Inventory data warning
              </p>

              <p className="text-[9px] text-yellow-800 mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* FILTERS */}

        <InventoryFilters
          filters={filters}
          warehouses={warehouses}
          categories={categories}
          onChange={updateFilter}
          onReset={resetFilters}
        />

        {/* TABLE */}

        {loading ? (
          <InventorySkeleton />
        ) : (
          <InventoryTable
            inventory={inventory}
            onSelect={setSelectedProduct}
          />
        )}

        {/* PAGINATION */}

        {!loading &&
          pagination.totalPages > 1 && (
            <InventoryPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={(page) =>
                updateFilter("page", page)
              }
            />
          )}
      </div>

      {/* DRAWER */}

      {selectedProduct && (
        <InventoryDrawer
          product={selectedProduct}
          api={api}
          onClose={() =>
            setSelectedProduct(null)
          }
          onRefresh={loadInventory}
          onOpenProduct={onOpenProduct}
        />
      )}
    </>
  );
}

/* ============================================================
   FILTERS
============================================================ */

function InventoryFilters({
  filters,
  warehouses,
  categories,
  onChange,
  onReset,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-orange-600" />

        <p className="text-xs font-black">
          Inventory Filters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            value={filters.search}
            onChange={(event) =>
              onChange(
                "search",
                event.target.value
              )
            }
            placeholder="Search SKU, brand or product..."
            className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
          />
        </div>

        <Select
          value={filters.warehouse}
          onChange={(value) =>
            onChange("warehouse", value)
          }
        >
          <option value="ALL">
            All Warehouses
          </option>

          {warehouses.map((warehouse) => (
            <option
              key={warehouse}
              value={warehouse}
            >
              {warehouse}
            </option>
          ))}
        </Select>

        <Select
          value={filters.category}
          onChange={(value) =>
            onChange("category", value)
          }
        >
          <option value="ALL">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {formatStatus(category)}
            </option>
          ))}
        </Select>

        <Select
          value={filters.stock}
          onChange={(value) =>
            onChange("stock", value)
          }
        >
          <option value="ALL">
            All Stock
          </option>

          <option value="IN_STOCK">
            In Stock
          </option>

          <option value="LOW">
            Low Stock
          </option>

          <option value="OUT_OF_STOCK">
            Out of Stock
          </option>
        </Select>

        <button
          type="button"
          onClick={onReset}
          className="h-10 px-4 rounded-xl bg-orange-50 text-orange-700 text-xs font-black hover:bg-orange-100"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="appearance-none w-full h-10 rounded-xl border border-slate-200 bg-white px-3 pr-8 text-[10px] font-bold outline-none"
      >
        {children}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
    </div>
  );
}

/* ============================================================
   TABLE
============================================================ */

function InventoryTable({
  inventory,
  onSelect,
}) {
  if (!inventory.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center">
        <Boxes className="w-10 h-10 mx-auto text-slate-300" />

        <p className="text-sm font-black text-slate-700 mt-4">
          No inventory found
        </p>

        <p className="text-xs text-slate-400 mt-1">
          Try changing the warehouse or stock filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <Heading>Product</Heading>
              <Heading>Warehouse</Heading>
              <Heading>Available</Heading>
              <Heading>Reserved</Heading>
              <Heading>Damaged</Heading>
              <Heading>Incoming</Heading>
              <Heading>Reorder</Heading>
              <Heading>Value</Heading>
              <Heading>Health</Heading>
              <th />
            </tr>
          </thead>

          <tbody>
            {inventory.map((item, index) => (
              <InventoryRow
                key={
                  item.skuId ||
                  item.id ||
                  index
                }
                item={item}
                onSelect={onSelect}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryRow({
  item,
  onSelect,
}) {
  const stock = Number(item.stock || 0);
  const reserved = Number(item.reserved || 0);
  const damaged = Number(item.damaged || 0);
  const reorderLevel = Number(
    item.reorderLevel || 10
  );

  const available =
    Math.max(0, stock - reserved);

  const health =
    stock <= 0
      ? "OUT"
      : stock <= reorderLevel
      ? "LOW"
      : "HEALTHY";

  return (
    <tr
      onClick={() => onSelect(item)}
      className="border-b border-slate-100 last:border-0 hover:bg-orange-50/30 cursor-pointer transition"
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
            {item.image ? (
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-4 h-4 m-3 text-slate-400" />
            )}
          </div>

          <div>
            <p className="text-[9px] font-black max-w-[210px] truncate">
              {item.name}
            </p>

            <p className="text-[7px] text-slate-400 mt-1">
              {item.brand} ·{" "}
              {item.skuId || item.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <p className="text-[8px] font-black">
          {item.warehouseCity ||
            "Central Warehouse"}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-sm font-black">
          {available}
        </p>

        <p className="text-[7px] text-slate-400">
          sellable
        </p>
      </td>

      <td className="px-4 py-4">
        <span className="text-[9px] font-black text-orange-700">
          {reserved}
        </span>
      </td>

      <td className="px-4 py-4">
        <span
          className={`text-[9px] font-black ${
            damaged > 0
              ? "text-red-600"
              : "text-slate-500"
          }`}
        >
          {damaged}
        </span>
      </td>

      <td className="px-4 py-4">
        <span className="text-[9px] font-black text-blue-700">
          {Number(item.incoming || 0)}
        </span>
      </td>

      <td className="px-4 py-4">
        <span className="text-[9px] font-bold text-slate-500">
          {reorderLevel}
        </span>
      </td>

      <td className="px-4 py-4">
        <p className="text-[9px] font-black">
          {formatCurrency(
            available *
              Number(item.price || 0)
          )}
        </p>
      </td>

      <td className="px-4 py-4">
        <StockHealth health={health} />
      </td>

      <td className="px-4">
        <ChevronRight className="w-4 h-4 text-slate-300" />
      </td>
    </tr>
  );
}

/* ============================================================
   DRAWER
============================================================ */

function InventoryDrawer({
  product,
  api,
  onClose,
  onRefresh,
  onOpenProduct,
}) {
  const [details, setDetails] =
    useState(product);

  const [adjustment, setAdjustment] =
    useState("");

  const [adjustmentReason, setAdjustmentReason] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const stock = Number(details.stock || 0);
  const reserved = Number(
    details.reserved || 0
  );
  const damaged = Number(
    details.damaged || 0
  );
  const available = Math.max(
    0,
    stock - reserved
  );

  const loadDetails = useCallback(async () => {
    if (!api?.getAdminInventoryItem) {
      return;
    }

    try {
      const response =
        await api.getAdminInventoryItem(
          details.skuId ||
            details.id
        );

      if (response?.product) {
        setDetails(
          response.product
        );
      }
    } catch (error) {
      console.error(
        "Inventory details failed:",
        error
      );
    }
  }, [api, details.id, details.skuId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const adjustStock = async () => {
    const amount = Number(adjustment);

    if (!Number.isFinite(amount) || amount === 0) {
      setMessage(
        "Enter a non-zero stock adjustment."
      );
      return;
    }

    const nextStock = Math.max(
      0,
      stock + amount
    );

    try {
      setSaving(true);
      setMessage("");

      if (api?.adjustInventory) {
        await api.adjustInventory({
          skuId:
            details.skuId ||
            details.id,
          adjustment: amount,
          newStock: nextStock,
          reason: adjustmentReason,
        });
      }

      setDetails((current) => ({
        ...current,
        stock: nextStock,
      }));

      setAdjustment("");

      setMessage(
        `Stock adjusted by ${
          amount > 0 ? "+" : ""
        }${amount} units.`
      );

      await onRefresh?.();
    } catch (error) {
      setMessage(
        error?.message ||
          "Unable to adjust inventory."
      );
    } finally {
      setSaving(false);
    }
  };

  const quickAdjustment = (amount) => {
    setAdjustment(String(amount));
  };

  return (
    <div className="fixed inset-0 z-[150]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close inventory drawer"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl overflow-y-auto">
        {/* HEADER */}

        <div className="sticky top-0 z-30 bg-white border-b border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center overflow-hidden">
                {details.image ? (
                  <img
                    src={details.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-5 h-5" />
                )}
              </div>

              <div>
                <p className="text-[8px] uppercase tracking-[0.15em] font-black text-orange-600">
                  SKU Inventory
                </p>

                <h2 className="text-lg font-black">
                  {details.name}
                </h2>

                <p className="text-[8px] text-slate-400 mt-1">
                  {details.skuId ||
                    details.id}{" "}
                  ·{" "}
                  {details.warehouseCity}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* STOCK HERO */}

          <section className="rounded-2xl bg-blue-950 text-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[8px] uppercase tracking-[0.15em] text-orange-300 font-black">
                  Sellable Inventory
                </p>

                <p className="text-4xl font-black mt-1">
                  {available}
                </p>

                <p className="text-[8px] text-white/50 mt-1">
                  units currently available for customers
                </p>
              </div>

              <StockHealth
                health={
                  stock <= 0
                    ? "OUT"
                    : stock <=
                      Number(
                        details.reorderLevel ||
                          10
                      )
                    ? "LOW"
                    : "HEALTHY"
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-6">
              <StockMetric
                label="Total"
                value={stock}
              />

              <StockMetric
                label="Reserved"
                value={reserved}
              />

              <StockMetric
                label="Damaged"
                value={damaged}
              />
            </div>
          </section>

          {/* SKU INFO */}

          <section>
            <SectionTitle
              icon={Package}
              title="SKU Information"
            />

            <div className="grid grid-cols-2 gap-2 mt-3">
              <InfoBox
                label="Brand"
                value={details.brand}
              />

              <InfoBox
                label="Category"
                value={formatStatus(
                  details.category
                )}
              />

              <InfoBox
                label="Warehouse"
                value={details.warehouseCity}
              />

              <InfoBox
                label="Unit Price"
                value={formatCurrency(
                  details.price
                )}
              />

              <InfoBox
                label="Reorder Level"
                value={
                  details.reorderLevel ||
                  10
                }
              />

              <InfoBox
                label="Incoming"
                value={
                  details.incoming ||
                  0
                }
              />
            </div>
          </section>

          {/* ADJUSTMENT */}

          <section className="border border-slate-200 rounded-2xl p-4">
            <SectionTitle
              icon={ArrowUpFromLine}
              title="Stock Adjustment"
            />

            <p className="text-[8px] text-slate-400 mt-1">
              Use positive numbers to add stock and negative numbers
              to remove stock after an approved operational adjustment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              <div>
                <label className="block text-[8px] font-black text-slate-500 mb-1">
                  Adjustment
                </label>

                <input
                  type="number"
                  value={adjustment}
                  onChange={(event) =>
                    setAdjustment(
                      event.target.value
                    )
                  }
                  placeholder="+10 or -5"
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs font-black outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-slate-500 mb-1">
                  Reason
                </label>

                <select
                  value={adjustmentReason}
                  onChange={(event) =>
                    setAdjustmentReason(
                      event.target.value
                    )
                  }
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[9px] font-bold outline-none"
                >
                  <option value="">
                    Select reason
                  </option>

                  <option value="RESTOCK">
                    Warehouse Restock
                  </option>

                  <option value="DAMAGED">
                    Damaged Removal
                  </option>

                  <option value="COUNT_CORRECTION">
                    Stock Count Correction
                  </option>

                  <option value="RETURN">
                    Customer Return
                  </option>

                  <option value="MANUAL">
                    Manual Adjustment
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-3">
              {[5, 10, -5, -10].map(
                (amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() =>
                      quickAdjustment(
                        amount
                      )
                    }
                    className={`h-9 rounded-lg text-[9px] font-black ${
                      amount > 0
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {amount > 0
                      ? "+"
                      : ""}
                    {amount}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={adjustStock}
              className="w-full h-10 mt-3 rounded-xl bg-blue-950 text-white text-[9px] font-black disabled:opacity-40"
            >
              {saving
                ? "Saving..."
                : "Apply Stock Adjustment"}
            </button>
          </section>

          {/* REPLENISHMENT */}

          <section>
            <SectionTitle
              icon={ArrowDownToLine}
              title="Replenishment"
            />

            <div className="mt-3 rounded-xl bg-slate-50 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[8px] text-slate-400">
                    Incoming Units
                  </p>

                  <p className="text-xl font-black mt-1">
                    {details.incoming ||
                      0}
                  </p>
                </div>

                <div>
                  <p className="text-[8px] text-slate-400">
                    Reorder Point
                  </p>

                  <p className="text-xl font-black mt-1">
                    {details.reorderLevel ||
                      10}
                  </p>
                </div>
              </div>

              <div className="h-2 bg-slate-200 rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (available /
                          Math.max(
                            1,
                            Number(
                              details.reorderLevel ||
                                10
                            ) * 4
                          )) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>

              <p className="text-[7px] text-slate-400 mt-2">
                Stock health is calculated against the configured
                reorder level.
              </p>
            </div>
          </section>

          {/* MOVEMENT */}

          <section>
            <SectionTitle
              icon={History}
              title="Recent Stock Activity"
            />

            <div className="mt-3 space-y-2">
              <Activity
                icon={ArrowUpFromLine}
                title="Current warehouse stock"
                value={`${stock} units`}
                time="Current"
              />

              <Activity
                icon={Boxes}
                title="Reserved for orders"
                value={`${reserved} units`}
                time="Current"
              />

              <Activity
                icon={ShieldAlert}
                title="Damaged inventory"
                value={`${damaged} units`}
                time="Current"
              />

              <Activity
                icon={ArrowDownToLine}
                title="Incoming replenishment"
                value={`${details.incoming || 0} units`}
                time="Expected"
              />
            </div>
          </section>

          {message && (
            <div className="rounded-xl bg-orange-50 border border-orange-100 p-3">
              <p className="text-[8px] font-black text-orange-800">
                {message}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {typeof onOpenProduct ===
              "function" && (
              <button
                type="button"
                onClick={() =>
                  onOpenProduct(
                    details.skuId ||
                      details.id
                  )
                }
                className="flex-1 h-11 rounded-xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600"
              >
                Open Product
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-slate-200 text-xs font-black"
            >
              Close
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function InventoryKpi({
  icon: Icon,
  label,
  value,
  tone,
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-800",
    orange: "bg-orange-50 text-orange-700",
    red: "bg-red-50 text-red-700",
    yellow: "bg-yellow-50 text-yellow-700",
    green: "bg-green-50 text-green-700",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${styles[tone]}`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <p className="text-[8px] uppercase tracking-[0.1em] font-black text-slate-400 mt-4">
        {label}
      </p>

      <p className="text-lg font-black text-slate-950 mt-1">
        {value}
      </p>
    </div>
  );
}

function StockHealth({
  health,
}) {
  const normalized =
    normalize(health);

  const styles = {
    HEALTHY:
      "bg-green-100 text-green-700",
    LOW:
      "bg-orange-100 text-orange-700",
    OUT:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[7px] font-black ${
        styles[normalized] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {normalized === "HEALTHY" && (
        <CheckCircle2 className="w-3 h-3" />
      )}

      {normalized === "LOW" && (
        <ShieldAlert className="w-3 h-3" />
      )}

      {normalized === "OUT" && (
        <AlertCircle className="w-3 h-3" />
      )}

      {formatStatus(normalized)}
    </span>
  );
}

function StockMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-white/10 p-3">
      <p className="text-[7px] uppercase tracking-[0.1em] text-white/45 font-black">
        {label}
      </p>

      <p className="text-lg font-black mt-1">
        {value}
      </p>
    </div>
  );
}

function InfoBox({
  label,
  value,
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-3">
      <p className="text-[7px] uppercase font-black text-slate-400">
        {label}
      </p>

      <p className="text-[9px] font-black mt-2 truncate">
        {value || "—"}
      </p>
    </div>
  );
}

function Activity({
  icon: Icon,
  title,
  value,
  time,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-orange-600" />
      </div>

      <div className="flex-1">
        <p className="text-[8px] font-black">
          {title}
        </p>

        <p className="text-[7px] text-slate-400 mt-1">
          {time}
        </p>
      </div>

      <p className="text-[9px] font-black">
        {value}
      </p>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-orange-600" />

      <h3 className="text-xs font-black">
        {title}
      </h3>
    </div>
  );
}

function Heading({
  children,
}) {
  return (
    <th className="text-left px-4 py-3 text-[8px] uppercase tracking-[0.12em] font-black text-slate-500">
      {children}
    </th>
  );
}

function InventoryPagination({
  page,
  totalPages,
  total,
  onPageChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <p className="text-[9px] text-slate-400">
        Page {page} of {totalPages} ·{" "}
        {total} inventory records
      </p>

      <div className="flex gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() =>
            onPageChange(page - 1)
          }
          className="px-3 py-2 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-30"
        >
          Previous
        </button>

        <span className="px-3 py-2 rounded-lg bg-blue-950 text-white text-[9px] font-black">
          {page}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() =>
            onPageChange(page + 1)
          }
          className="px-3 py-2 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function InventorySkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="h-14 rounded-xl bg-slate-100 animate-pulse"
        />
      ))}
    </div>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function normalize(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replaceAll(" ", "_");
}

function formatStatus(value) {
  return normalize(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

function formatCurrency(value) {
  return `₹${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
}