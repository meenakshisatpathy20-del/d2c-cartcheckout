import React, { useMemo, useState } from 'react';
import {
  Search,
  Package,
  AlertTriangle,
  CheckCircle2,
  Warehouse,
  IndianRupee,
  Plus,
  Minus,
  RefreshCw,
  X,
  Save,
  ChevronRight,
  Boxes,
  TrendingDown
} from 'lucide-react';

const STOCK_FILTERS = [
  'ALL',
  'HEALTHY',
  'LOW_STOCK',
  'OUT_OF_STOCK'
];

function currency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function stockState(product) {
  const stock = Number(product.stock || 0);
  const threshold = Number(
    product.lowStockThreshold ?? 10
  );

  if (stock <= 0) return 'OUT_OF_STOCK';
  if (stock <= threshold) return 'LOW_STOCK';
  return 'HEALTHY';
}

function stockBadge(state) {
  if (state === 'OUT_OF_STOCK') {
    return 'bg-red-50 text-red-700 border-red-100';
  }

  if (state === 'LOW_STOCK') {
    return 'bg-yellow-50 text-yellow-700 border-yellow-100';
  }

  return 'bg-green-50 text-green-700 border-green-100';
}

function stockLabel(state) {
  if (state === 'OUT_OF_STOCK') {
    return 'Out of stock';
  }

  if (state === 'LOW_STOCK') {
    return 'Low stock';
  }

  return 'Healthy';
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

      <p className="mt-4 text-[9px] uppercase tracking-[0.16em] font-black text-slate-400">
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

function StockEditor({
  product,
  onClose,
  onSave
}) {
  const [value, setValue] = useState(
    Number(product.stock || 0)
  );

  const [threshold, setThreshold] =
    useState(
      Number(
        product.lowStockThreshold ?? 10
      )
    );

  const decrease = () => {
    setValue(previous =>
      Math.max(0, previous - 1)
    );
  };

  const increase = () => {
    setValue(previous => previous + 1);
  };

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close inventory editor"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />

      <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
              Inventory adjustment
            </p>

            <h2 className="text-sm font-black text-slate-950 mt-1">
              Update stock
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
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 rounded-xl object-cover bg-slate-100"
            />

            <div className="min-w-0">
              <p className="text-sm font-black text-slate-900">
                {product.name}
              </p>

              <p className="text-[10px] text-slate-400 mt-1">
                {product.brand} • {product.id}
              </p>

              <p className="text-[10px] text-blue-700 font-bold mt-1">
                {product.warehouseCity ||
                  'Warehouse not assigned'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-wider font-black text-slate-500 mb-2">
              Available stock
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={decrease}
                className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                min="0"
                value={value}
                onChange={e =>
                  setValue(
                    Math.max(
                      0,
                      Number(e.target.value)
                    )
                  )
                }
                className="flex-1 h-11 rounded-xl border border-slate-200 bg-slate-50 text-center text-sm font-black outline-none focus:border-blue-600"
              />

              <button
                type="button"
                onClick={increase}
                className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-wider font-black text-slate-500 mb-2">
              Low-stock threshold
            </label>

            <input
              type="number"
              min="0"
              value={threshold}
              onChange={e =>
                setThreshold(
                  Math.max(
                    0,
                    Number(e.target.value)
                  )
                )
              }
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold outline-none focus:border-blue-600 focus:bg-white"
            />

            <p className="text-[9px] text-slate-400 mt-2">
              The dashboard will flag this SKU when stock
              reaches this level.
            </p>
          </div>

          <div
            className={`rounded-xl border p-3 ${stockBadge(
              stockState({
                ...product,
                stock: value,
                lowStockThreshold: threshold
              })
            )}`}
          >
            <div className="flex items-center gap-2">
              {value <= 0 ? (
                <AlertTriangle className="w-4 h-4" />
              ) : value <= threshold ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}

              <div>
                <p className="text-xs font-black">
                  {stockLabel(
                    stockState({
                      ...product,
                      stock: value,
                      lowStockThreshold:
                        threshold
                    })
                  )}
                </p>

                <p className="text-[9px] mt-0.5">
                  {value} units currently available
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onSave?.({
                ...product,
                stock: value,
                lowStockThreshold:
                  threshold
              })
            }
            className="w-full h-11 rounded-xl bg-slate-950 text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-blue-900 transition"
          >
            <Save className="w-4 h-4" />
            Save inventory
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminInventoryView({
  products = [],
  loading = false,
  onRefresh,
  onUpdateStock
}) {
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] =
    useState('ALL');
  const [warehouse, setWarehouse] =
    useState('ALL');
  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const warehouses = useMemo(() => {
    return [
      'ALL',
      ...new Set(
        products
          .map(
            product =>
              product.warehouseCity
          )
          .filter(Boolean)
      )
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return products.filter(product => {
      const state = stockState(product);

      const searchable = [
        product.id,
        product.name,
        product.brand,
        product.category,
        product.warehouseCity
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchable.includes(query);

      const matchesStock =
        stockFilter === 'ALL' ||
        state === stockFilter;

      const matchesWarehouse =
        warehouse === 'ALL' ||
        product.warehouseCity === warehouse;

      return (
        matchesSearch &&
        matchesStock &&
        matchesWarehouse
      );
    });
  }, [
    products,
    search,
    stockFilter,
    warehouse
  ]);

  const metrics = useMemo(() => {
    const totalSkus = products.length;

    const healthy = products.filter(
      product =>
        stockState(product) ===
        'HEALTHY'
    ).length;

    const lowStock = products.filter(
      product =>
        stockState(product) ===
        'LOW_STOCK'
    ).length;

    const outOfStock = products.filter(
      product =>
        stockState(product) ===
        'OUT_OF_STOCK'
    ).length;

    const totalUnits = products.reduce(
      (sum, product) =>
        sum +
        Number(product.stock || 0),
      0
    );

    const inventoryValue =
      products.reduce(
        (sum, product) =>
          sum +
          Number(product.price || 0) *
            Number(product.stock || 0),
        0
      );

    return {
      totalSkus,
      healthy,
      lowStock,
      outOfStock,
      totalUnits,
      inventoryValue
    };
  }, [products]);

  const clearFilters = () => {
    setSearch('');
    setStockFilter('ALL');
    setWarehouse('ALL');
  };

  const hasFilters =
    search ||
    stockFilter !== 'ALL' ||
    warehouse !== 'ALL';

  const handleSave = product => {
    onUpdateStock?.(
      product.id,
      product.stock,
      product.lowStockThreshold
    );

    setSelectedProduct(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] font-black text-orange-600">
              Warehouse control
            </p>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
              Inventory
            </h1>

            <p className="text-xs text-slate-500 mt-2">
              Manage SKU availability across the Indian
              fulfillment network.
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

            Refresh inventory
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <MetricCard
            icon={Package}
            label="Total SKUs"
            value={metrics.totalSkus}
            description="Products in catalog"
            className="bg-blue-50 text-blue-700"
          />

          <MetricCard
            icon={Boxes}
            label="Available units"
            value={metrics.totalUnits}
            description="Across all warehouses"
            className="bg-green-50 text-green-700"
          />

          <MetricCard
            icon={CheckCircle2}
            label="Healthy"
            value={metrics.healthy}
            description="Above stock threshold"
            className="bg-green-50 text-green-700"
          />

          <MetricCard
            icon={AlertTriangle}
            label="Low stock"
            value={metrics.lowStock}
            description="Restocking recommended"
            className="bg-yellow-50 text-yellow-700"
          />

          <MetricCard
            icon={IndianRupee}
            label="Stock value"
            value={currency(
              metrics.inventoryValue
            )}
            description="Current retail value"
            className="bg-orange-50 text-orange-600"
          />
        </div>

        {metrics.outOfStock > 0 && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />

            <div>
              <p className="text-xs font-black text-red-900">
                {metrics.outOfStock} SKU
                {metrics.outOfStock !== 1
                  ? 's are'
                  : ' is'}{' '}
                out of stock
              </p>

              <p className="text-[10px] text-red-700 mt-1">
                These products may currently be unavailable
                for new customer orders.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={e =>
                  setSearch(e.target.value)
                }
                placeholder="Search SKU, product, brand or warehouse..."
                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
              />
            </div>

            <select
              value={stockFilter}
              onChange={e =>
                setStockFilter(e.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold outline-none focus:border-blue-600"
            >
              {STOCK_FILTERS.map(
                item => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === 'ALL'
                      ? 'All stock levels'
                      : stockLabel(item)}
                  </option>
                )
              )}
            </select>

            <select
              value={warehouse}
              onChange={e =>
                setWarehouse(e.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold outline-none focus:border-blue-600"
            >
              {warehouses.map(
                item => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === 'ALL'
                      ? 'All warehouses'
                      : item}
                  </option>
                )
              )}
            </select>
          </div>

          {hasFilters && (
            <div className="flex items-center justify-between mt-3">
              <p className="text-[10px] text-slate-500">
                Showing{' '}
                <span className="font-black text-slate-800">
                  {filteredProducts.length}
                </span>{' '}
                of {products.length} SKUs
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="text-[10px] font-black text-orange-600"
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
          ) : filteredProducts.length === 0 ? (
            <div className="p-14 text-center">
              <Package className="w-9 h-9 text-slate-300 mx-auto" />

              <p className="text-sm font-black text-slate-600 mt-3">
                No inventory found
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
                      Product
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      SKU
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Warehouse
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Price
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Stock
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3" />
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map(
                    product => {
                      const state =
                        stockState(product);

                      return (
                        <tr
                          key={product.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-11 h-11 rounded-xl object-cover bg-slate-100"
                              />

                              <div className="min-w-0">
                                <p className="text-xs font-black text-slate-900">
                                  {product.name}
                                </p>

                                <p className="text-[9px] text-slate-400 mt-1">
                                  {product.brand}
                                  {product.category
                                    ? ` • ${product.category}`
                                    : ''}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-[10px] font-black text-slate-600">
                              {product.id}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Warehouse className="w-3.5 h-3.5 text-slate-400" />

                              <span className="text-[10px] font-semibold text-slate-600 max-w-[180px]">
                                {product.warehouseCity ||
                                  'Not assigned'}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-xs font-black text-slate-900">
                              {currency(
                                product.price
                              )}
                            </p>

                            {product.mrp &&
                              product.mrp >
                                product.price && (
                                <p className="text-[9px] text-slate-400 line-through mt-1">
                                  {currency(
                                    product.mrp
                                  )}
                                </p>
                              )}
                          </td>

                          <td className="px-5 py-4">
                            <div>
                              <p className="text-sm font-black text-slate-900">
                                {product.stock ||
                                  0}
                              </p>

                              <p className="text-[9px] text-slate-400 mt-0.5">
                                Threshold:{' '}
                                {product.lowStockThreshold ??
                                  10}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full border text-[9px] font-black ${stockBadge(
                                state
                              )}`}
                            >
                              {stockLabel(state)}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedProduct(
                                  product
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-black hover:bg-blue-50 hover:text-blue-700 transition"
                            >
                              Adjust
                              <ChevronRight className="w-3 h-3" />
                            </button>
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

      {selectedProduct && (
        <StockEditor
          product={selectedProduct}
          onClose={() =>
            setSelectedProduct(null)
          }
          onSave={handleSave}
        />
      )}
    </>
  );
}