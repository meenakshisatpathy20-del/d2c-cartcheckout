import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Archive,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Edit3,
  Eye,
  EyeOff,
  Filter,
  ImagePlus,
  IndianRupee,
  Package,
  Plus,
  RefreshCw,
  Search,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  Upload,
  X,
  Zap,
} from "lucide-react";

const DEFAULT_FILTERS = {
  search: "",
  category: "ALL",
  status: "ALL",
  visibility: "ALL",
  sort: "recent",
  page: 1,
  limit: 15,
};

const EMPTY_PRODUCT = {
  id: "",
  name: "",
  slug: "",
  brand: "",
  category: "beauty",
  subcategory: "",
  description: "",
  shortDescription: "",
  price: "",
  mrp: "",
  costPrice: "",
  taxRate: "18",
  stock: 0,
  reorderLevel: 10,
  sku: "",
  barcode: "",
  weight: "",
  unit: "piece",
  status: "DRAFT",
  visibility: "VISIBLE",
  featured: false,
  bestseller: false,
  trending: false,
  flashSale: false,
  saleEndsAt: "",
  tags: [],
  images: [],
  variants: [],
};

const FALLBACK_PRODUCTS = [
  {
    id: "PROD-1001",
    name: "Essence Mascara Lash Princess",
    slug: "essence-mascara-lash-princess",
    brand: "Essence",
    category: "beauty",
    subcategory: "Makeup",
    description:
      "Volumizing mascara designed for dramatic, defined lashes.",
    shortDescription:
      "Dramatic volume and defined lashes.",
    price: 829,
    mrp: 1299,
    costPrice: 510,
    taxRate: 18,
    stock: 99,
    reorderLevel: 20,
    sku: "ESS-MAS-001",
    barcode: "405972900001",
    weight: "12",
    unit: "piece",
    status: "ACTIVE",
    visibility: "VISIBLE",
    featured: true,
    bestseller: true,
    trending: true,
    flashSale: true,
    saleEndsAt: "2026-09-05T23:59:00",
    tags: ["bestseller", "viral", "makeup"],
    images: [
      "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    ],
    variants: [],
  },
  {
    id: "PROD-1002",
    name: "Eyeshadow Palette with Mirror",
    slug: "eyeshadow-palette-with-mirror",
    brand: "Glamour",
    category: "beauty",
    subcategory: "Makeup",
    description:
      "Multi-shade eyeshadow palette with a built-in mirror.",
    shortDescription:
      "Everyday and party shades in one palette.",
    price: 1659,
    mrp: 2499,
    costPrice: 1040,
    taxRate: 18,
    stock: 34,
    reorderLevel: 15,
    sku: "GLM-EYE-002",
    barcode: "890100000002",
    weight: "150",
    unit: "piece",
    status: "ACTIVE",
    visibility: "VISIBLE",
    featured: true,
    bestseller: true,
    trending: true,
    flashSale: false,
    saleEndsAt: "",
    tags: ["makeup", "new", "trending"],
    images: [
      "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
    ],
    variants: [],
  },
  {
    id: "PROD-1003",
    name: "Powder Canister Compact",
    slug: "powder-canister-compact",
    brand: "Velvet Touch",
    category: "beauty",
    subcategory: "Face",
    description:
      "Compact powder canister for a smooth everyday finish.",
    shortDescription:
      "Lightweight powder with smooth coverage.",
    price: 1244,
    mrp: 1899,
    costPrice: 730,
    taxRate: 18,
    stock: 89,
    reorderLevel: 20,
    sku: "VLT-PWD-003",
    barcode: "890100000003",
    weight: "90",
    unit: "piece",
    status: "ACTIVE",
    visibility: "VISIBLE",
    featured: false,
    bestseller: true,
    trending: false,
    flashSale: true,
    saleEndsAt: "2026-09-03T22:00:00",
    tags: ["beauty", "sale"],
    images: [
      "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png",
    ],
    variants: [],
  },
  {
    id: "PROD-1004",
    name: "Calvin Klein CK One EDT",
    slug: "calvin-klein-ck-one-edt",
    brand: "Calvin Klein",
    category: "fragrances",
    subcategory: "Perfume",
    description:
      "Classic unisex Eau de Toilette fragrance.",
    shortDescription:
      "Fresh, iconic and timeless fragrance.",
    price: 3499,
    mrp: 5200,
    costPrice: 2300,
    taxRate: 18,
    stock: 45,
    reorderLevel: 10,
    sku: "CK-ONE-004",
    barcode: "890100000004",
    weight: "100",
    unit: "ml",
    status: "ACTIVE",
    visibility: "VISIBLE",
    featured: true,
    bestseller: false,
    trending: true,
    flashSale: false,
    saleEndsAt: "",
    tags: ["fragrance", "premium"],
    images: [
      "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png",
    ],
    variants: [],
  },
];

export default function ProductCatalogView({
  api,
  onOpenProduct,
}) {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEditor, setShowEditor] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });

  const loadProducts = useCallback(async () => {
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

      if (api?.getAdminProducts) {
        response = await api.getAdminProducts(
          params.toString()
        );
      }

      const list =
        response?.products ||
        response?.items ||
        FALLBACK_PRODUCTS;

      setProducts(list);

      setPagination({
        page: response?.page || 1,
        limit: response?.limit || 15,
        total: response?.total || list.length,
        totalPages: response?.totalPages || 1,
      });
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load product catalog."
      );

      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, [api, filters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const metrics = useMemo(() => {
    const active = products.filter(
      (product) =>
        normalize(product.status) === "ACTIVE"
    ).length;

    const visible = products.filter(
      (product) =>
        normalize(product.visibility) === "VISIBLE"
    ).length;

    const featured = products.filter(
      (product) => product.featured
    ).length;

    const saleProducts = products.filter(
      (product) =>
        product.flashSale
    ).length;

    const lowStock = products.filter(
      (product) =>
        Number(product.stock || 0) <=
        Number(product.reorderLevel || 10)
    ).length;

    return {
      total: products.length,
      active,
      visible,
      featured,
      saleProducts,
      lowStock,
    };
  }, [products]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];
  }, [products]);

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

  const openCreate = () => {
    setEditingProduct({
      ...EMPTY_PRODUCT,
      id: "",
      sku: generateSku(),
    });

    setShowEditor(true);
  };

  const openEdit = (product) => {
    setEditingProduct({
      ...EMPTY_PRODUCT,
      ...product,
      tags: [...(product.tags || [])],
      images: [...(product.images || [])],
      variants: [...(product.variants || [])],
    });

    setShowEditor(true);
  };

  const duplicateProduct = (product) => {
    setEditingProduct({
      ...EMPTY_PRODUCT,
      ...product,
      id: "",
      name: `${product.name} Copy`,
      slug: `${product.slug || slugify(product.name)}-copy`,
      sku: generateSku(),
      status: "DRAFT",
      featured: false,
      bestseller: false,
      trending: false,
      flashSale: false,
    });

    setShowEditor(true);
  };

  const saveProduct = async (product) => {
    if (!product.name.trim()) {
      throw new Error("Product name is required.");
    }

    if (!product.brand.trim()) {
      throw new Error("Brand is required.");
    }

    if (!product.sku.trim()) {
      throw new Error("SKU is required.");
    }

    if (Number(product.price) < 0) {
      throw new Error("Price cannot be negative.");
    }

    if (Number(product.mrp) < 0) {
      throw new Error("MRP cannot be negative.");
    }

    if (Number(product.price) > Number(product.mrp)) {
      throw new Error("Selling price cannot exceed MRP.");
    }

    if (api?.saveProduct) {
      await api.saveProduct(product);
    }

    setProducts((current) => {
      const exists = current.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return current.map((item) =>
          item.id === product.id
            ? product
            : item
        );
      }

      return [
        product,
        ...current,
      ];
    });

    setShowEditor(false);
    setEditingProduct(null);
  };

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      if (api?.deleteProduct) {
        await api.deleteProduct(
          product.id
        );
      }

      setProducts((current) =>
        current.filter(
          (item) =>
            item.id !== product.id
        )
      );
    } catch (err) {
      setError(
        err?.message ||
          "Unable to delete product."
      );
    }
  };

  const toggleVisibility = async (
    product
  ) => {
    const next =
      normalize(product.visibility) ===
      "VISIBLE"
        ? "HIDDEN"
        : "VISIBLE";

    try {
      if (api?.updateProductVisibility) {
        await api.updateProductVisibility(
          product.id,
          next
        );
      }

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                visibility: next,
              }
            : item
        )
      );
    } catch (err) {
      setError(
        err?.message ||
          "Unable to update product visibility."
      );
    }
  };

  return (
    <>
      <div className="space-y-5">
        {/* HEADER */}

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-950 text-white flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] font-black text-orange-600">
                  Commerce Catalog
                </p>

                <h1 className="text-2xl font-black text-slate-950">
                  Products
                </h1>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Manage products, pricing, variants, inventory,
              visibility and merchandising campaigns.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadProducts}
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
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600"
            >
              <Plus className="w-4 h-4" />

              Add Product
            </button>
          </div>
        </div>

        {/* KPI */}

        <div className="grid grid-cols-2 xl:grid-cols-6 gap-3">
          <CatalogKpi
            icon={Package}
            label="Products"
            value={metrics.total}
            tone="blue"
          />

          <CatalogKpi
            icon={Check}
            label="Active"
            value={metrics.active}
            tone="green"
          />

          <CatalogKpi
            icon={Eye}
            label="Visible"
            value={metrics.visible}
            tone="purple"
          />

          <CatalogKpi
            icon={Star}
            label="Featured"
            value={metrics.featured}
            tone="orange"
          />

          <CatalogKpi
            icon={Zap}
            label="Flash Sale"
            value={metrics.saleProducts}
            tone="red"
          />

          <CatalogKpi
            icon={AlertCircle}
            label="Low Stock"
            value={metrics.lowStock}
            tone="yellow"
          />
        </div>

        {/* QUICK MERCHANDISING */}

        <div className="rounded-2xl bg-blue-950 text-white p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <p className="text-[8px] uppercase tracking-[0.15em] text-orange-300 font-black">
                Merchandising Control
              </p>

              <h2 className="text-xl font-black mt-1">
                Make the storefront move.
              </h2>

              <p className="text-[8px] text-white/45 mt-1">
                Promote trending products, create urgency and keep
                high-performing SKUs visible to customers.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <QuickCatalogFilter
                icon={TrendingUp}
                label="Trending"
                onClick={() =>
                  updateFilter(
                    "sort",
                    "trending"
                  )
                }
              />

              <QuickCatalogFilter
                icon={Star}
                label="Bestsellers"
                onClick={() =>
                  updateFilter(
                    "sort",
                    "bestseller"
                  )
                }
              />

              <QuickCatalogFilter
                icon={Zap}
                label="Flash Sale"
                onClick={() =>
                  updateFilter(
                    "sort",
                    "sale"
                  )
                }
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-yellow-700 mt-0.5" />

            <div>
              <p className="text-xs font-black text-yellow-900">
                Catalog data warning
              </p>

              <p className="text-[9px] text-yellow-800 mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* FILTERS */}

        <CatalogFilters
          filters={filters}
          categories={categories}
          onChange={updateFilter}
          onReset={resetFilters}
        />

        {/* TABLE */}

        {loading ? (
          <CatalogSkeleton />
        ) : (
          <CatalogTable
            products={products}
            onEdit={openEdit}
            onDuplicate={duplicateProduct}
            onDelete={deleteProduct}
            onVisibility={toggleVisibility}
            onOpenProduct={onOpenProduct}
          />
        )}

        {!loading &&
          pagination.totalPages > 1 && (
            <CatalogPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={(page) =>
                updateFilter(
                  "page",
                  page
                )
              }
            />
          )}
      </div>

      {showEditor && editingProduct && (
        <ProductEditor
          product={editingProduct}
          api={api}
          onClose={() => {
            setShowEditor(false);
            setEditingProduct(null);
          }}
          onSave={saveProduct}
        />
      )}
    </>
  );
}

/* ============================================================
   FILTERS
============================================================ */

function CatalogFilters({
  filters,
  categories,
  onChange,
  onReset,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-orange-600" />

        <p className="text-xs font-black">
          Catalog Filters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2">
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
            placeholder="Search product, brand or SKU..."
            className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
          />
        </div>

        <Select
          value={filters.category}
          onChange={(value) =>
            onChange(
              "category",
              value
            )
          }
        >
          <option value="ALL">
            All Categories
          </option>

          {categories.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {formatStatus(
                  category
                )}
              </option>
            )
          )}
        </Select>

        <Select
          value={filters.status}
          onChange={(value) =>
            onChange(
              "status",
              value
            )
          }
        >
          <option value="ALL">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="DRAFT">
            Draft
          </option>

          <option value="ARCHIVED">
            Archived
          </option>
        </Select>

        <Select
          value={filters.visibility}
          onChange={(value) =>
            onChange(
              "visibility",
              value
            )
          }
        >
          <option value="ALL">
            All Visibility
          </option>

          <option value="VISIBLE">
            Visible
          </option>

          <option value="HIDDEN">
            Hidden
          </option>
        </Select>

        <Select
          value={filters.sort}
          onChange={(value) =>
            onChange(
              "sort",
              value
            )
          }
        >
          <option value="recent">
            Recently Added
          </option>

          <option value="name">
            Name
          </option>

          <option value="price_high">
            Highest Price
          </option>

          <option value="price_low">
            Lowest Price
          </option>

          <option value="trending">
            Trending
          </option>

          <option value="bestseller">
            Bestselling
          </option>

          <option value="sale">
            Flash Sale
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
          onChange(
            event.target.value
          )
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

function CatalogTable({
  products,
  onEdit,
  onDuplicate,
  onDelete,
  onVisibility,
  onOpenProduct,
}) {
  if (!products.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center">
        <Package className="w-10 h-10 mx-auto text-slate-300" />

        <p className="text-sm font-black text-slate-700 mt-4">
          No products found
        </p>

        <p className="text-xs text-slate-400 mt-1">
          Try changing your catalog filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1300px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <Heading>
                Product
              </Heading>

              <Heading>
                SKU
              </Heading>

              <Heading>
                Pricing
              </Heading>

              <Heading>
                Stock
              </Heading>

              <Heading>
                Merchandising
              </Heading>

              <Heading>
                Status
              </Heading>

              <Heading>
                Visibility
              </Heading>

              <th />
            </tr>
          </thead>

          <tbody>
            {products.map(
              (product, index) => (
                <CatalogRow
                  key={
                    product.id ||
                    index
                  }
                  product={
                    product
                  }
                  onEdit={
                    onEdit
                  }
                  onDuplicate={
                    onDuplicate
                  }
                  onDelete={
                    onDelete
                  }
                  onVisibility={
                    onVisibility
                  }
                  onOpenProduct={
                    onOpenProduct
                  }
                />
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CatalogRow({
  product,
  onEdit,
  onDuplicate,
  onDelete,
  onVisibility,
  onOpenProduct,
}) {
  const stock =
    Number(product.stock || 0);

  const reorderLevel =
    Number(
      product.reorderLevel || 10
    );

  const lowStock =
    stock <= reorderLevel;

  const discount =
    Number(product.mrp) > 0
      ? Math.round(
          (1 -
            Number(product.price || 0) /
              Number(product.mrp)) *
            100
        )
      : 0;

  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-orange-50/20 transition">
      <td
        className="px-5 py-4 cursor-pointer"
        onClick={() =>
          onOpenProduct?.(
            product
          )
        }
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
            {product.images?.[0] ? (
              <img
                src={
                  product.images[0]
                }
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-5 h-5 m-3 text-slate-400" />
            )}
          </div>

          <div className="max-w-[280px]">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-[9px] font-black truncate">
                {product.name}
              </p>

              {product.featured && (
                <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 text-[6px] font-black">
                  FEATURED
                </span>
              )}
            </div>

            <p className="text-[7px] text-slate-400 mt-1">
              {product.brand} ·{" "}
              {formatStatus(
                product.category
              )}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <p className="text-[8px] font-black">
          {product.sku}
        </p>

        <p className="text-[7px] text-slate-400 mt-1">
          {product.barcode || "No barcode"}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-[10px] font-black">
          {formatCurrency(
            product.price
          )}
        </p>

        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[7px] line-through text-slate-400">
            {formatCurrency(
              product.mrp
            )}
          </span>

          {discount > 0 && (
            <span className="text-[7px] font-black text-green-600">
              {discount}% OFF
            </span>
          )}
        </div>
      </td>

      <td className="px-4 py-4">
        <p
          className={`text-sm font-black ${
            lowStock
              ? "text-orange-600"
              : "text-slate-950"
          }`}
        >
          {stock}
        </p>

        <p className="text-[7px] text-slate-400">
          reorder at {reorderLevel}
        </p>
      </td>

      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1">
          {product.bestseller && (
            <Badge
              icon={Star}
              label="Best"
            />
          )}

          {product.trending && (
            <Badge
              icon={TrendingUp}
              label="Trend"
            />
          )}

          {product.flashSale && (
            <Badge
              icon={Zap}
              label="Sale"
            />
          )}
        </div>
      </td>

      <td className="px-4 py-4">
        <StatusBadge
          status={
            product.status
          }
        />
      </td>

      <td className="px-4 py-4">
        <button
          type="button"
          onClick={() =>
            onVisibility(
              product
            )
          }
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[7px] font-black ${
            normalize(
              product.visibility
            ) === "VISIBLE"
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {normalize(
            product.visibility
          ) === "VISIBLE" ? (
            <Eye className="w-3 h-3" />
          ) : (
            <EyeOff className="w-3 h-3" />
          )}

          {normalize(
            product.visibility
          ) === "VISIBLE"
            ? "Visible"
            : "Hidden"}
        </button>
      </td>

      <td className="px-4">
        <div className="flex items-center gap-1">
          <ActionButton
            icon={Edit3}
            label="Edit"
            onClick={() =>
              onEdit(product)
            }
          />

          <ActionButton
            icon={Copy}
            label="Duplicate"
            onClick={() =>
              onDuplicate(product)
            }
          />

          <ActionButton
            icon={Trash2}
            label="Delete"
            danger
            onClick={() =>
              onDelete(product)
            }
          />
        </div>
      </td>
    </tr>
  );
}

/* ============================================================
   PRODUCT EDITOR
============================================================ */

function ProductEditor({
  product,
  api,
  onClose,
  onSave,
}) {
  const [form, setForm] =
    useState(product);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [tagInput, setTagInput] =
    useState("");

  const [imageInput, setImageInput] =
    useState("");

  const isEditing =
    Boolean(product.id);

  const update = (
    key,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const addTag = () => {
    const tag =
      tagInput.trim();

    if (!tag) return;

    if (
      form.tags?.includes(
        tag
      )
    ) {
      setTagInput("");
      return;
    }

    update("tags", [
      ...(form.tags || []),
      tag,
    ]);

    setTagInput("");
  };

  const removeTag = (
    tag
  ) => {
    update(
      "tags",
      (form.tags || []).filter(
        (item) =>
          item !== tag
      )
    );
  };

  const addImage = () => {
    const url =
      imageInput.trim();

    if (!url) return;

    update("images", [
      ...(form.images || []),
      url,
    ]);

    setImageInput("");
  };

  const removeImage = (
    index
  ) => {
    update(
      "images",
      (form.images || []).filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  const addVariant = () => {
    update("variants", [
      ...(form.variants || []),
      {
        id: `VAR-${Date.now()}`,
        name: "",
        value: "",
        sku: `${form.sku}-V${(form.variants?.length || 0) + 1}`,
        price: form.price || 0,
        stock: 0,
        active: true,
      },
    ]);
  };

  const updateVariant = (
    index,
    key,
    value
  ) => {
    update(
      "variants",
      (form.variants || []).map(
        (variant, variantIndex) =>
          variantIndex === index
            ? {
                ...variant,
                [key]: value,
              }
            : variant
      )
    );
  };

  const removeVariant = (
    index
  ) => {
    update(
      "variants",
      (form.variants || []).filter(
        (_, variantIndex) =>
          variantIndex !== index
      )
    );
  };

  const submit = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,
        id:
          form.id ||
          `PROD-${Date.now()}`,
        slug:
          form.slug ||
          slugify(form.name),
        price: Number(
          form.price || 0
        ),
        mrp: Number(
          form.mrp || 0
        ),
        costPrice: Number(
          form.costPrice || 0
        ),
        stock: Number(
          form.stock || 0
        ),
        reorderLevel: Number(
          form.reorderLevel || 0
        ),
        taxRate: Number(
          form.taxRate || 0
        ),
      };

      await onSave(payload);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[160]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close editor"
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-3xl bg-white shadow-2xl overflow-y-auto">
        {/* HEADER */}

        <div className="sticky top-0 z-40 bg-white border-b border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[8px] uppercase tracking-[0.15em] font-black text-orange-600">
                {isEditing
                  ? "Catalog Editor"
                  : "New Catalog Item"}
              </p>

              <h2 className="text-xl font-black mt-1">
                {isEditing
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <p className="text-[8px] text-slate-400 mt-1">
                Configure product information, pricing,
                inventory and storefront merchandising.
              </p>
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
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />

              <p className="text-[9px] font-black text-red-800">
                {error}
              </p>
            </div>
          )}

          {/* BASIC INFO */}

          <EditorSection
            title="Basic Information"
            icon={Package}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Product Name"
                required
                value={form.name}
                onChange={(value) =>
                  update(
                    "name",
                    value
                  )
                }
                placeholder="e.g. Premium Face Serum"
                full
              />

              <Field
                label="Brand"
                required
                value={form.brand}
                onChange={(value) =>
                  update(
                    "brand",
                    value
                  )
                }
                placeholder="Brand name"
              />

              <Field
                label="SKU"
                required
                value={form.sku}
                onChange={(value) =>
                  update(
                    "sku",
                    value
                  )
                }
                placeholder="SKU-001"
              />

              <Field
                label="Barcode"
                value={form.barcode}
                onChange={(value) =>
                  update(
                    "barcode",
                    value
                  )
                }
                placeholder="EAN / UPC / GTIN"
              />

              <Field
                label="Slug"
                value={form.slug}
                onChange={(value) =>
                  update(
                    "slug",
                    value
                  )
                }
                placeholder="product-url-slug"
                full
              />

              <SelectField
                label="Category"
                value={
                  form.category
                }
                onChange={(value) =>
                  update(
                    "category",
                    value
                  )
                }
                options={[
                  [
                    "beauty",
                    "Beauty",
                  ],
                  [
                    "fragrances",
                    "Fragrances",
                  ],
                  [
                    "skincare",
                    "Skincare",
                  ],
                  [
                    "haircare",
                    "Haircare",
                  ],
                  [
                    "fashion",
                    "Fashion",
                  ],
                  [
                    "accessories",
                    "Accessories",
                  ],
                  [
                    "wellness",
                    "Wellness",
                  ],
                  [
                    "other",
                    "Other",
                  ],
                ]}
              />

              <Field
                label="Subcategory"
                value={
                  form.subcategory
                }
                onChange={(value) =>
                  update(
                    "subcategory",
                    value
                  )
                }
                placeholder="Subcategory"
              />

              <TextArea
                label="Short Description"
                value={
                  form.shortDescription
                }
                onChange={(value) =>
                  update(
                    "shortDescription",
                    value
                  )
                }
                placeholder="Short storefront description..."
                full
              />

              <TextArea
                label="Full Description"
                value={
                  form.description
                }
                onChange={(value) =>
                  update(
                    "description",
                    value
                  )
                }
                placeholder="Detailed product description..."
                full
              />
            </div>
          </EditorSection>

          {/* PRICING */}

          <EditorSection
            title="Pricing & Tax"
            icon={IndianRupee}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field
                label="Selling Price"
                value={
                  form.price
                }
                onChange={(value) =>
                  update(
                    "price",
                    value
                  )
                }
                type="number"
                prefix="₹"
              />

              <Field
                label="MRP"
                value={
                  form.mrp
                }
                onChange={(value) =>
                  update(
                    "mrp",
                    value
                  )
                }
                type="number"
                prefix="₹"
              />

              <Field
                label="Cost Price"
                value={
                  form.costPrice
                }
                onChange={(value) =>
                  update(
                    "costPrice",
                    value
                  )
                }
                type="number"
                prefix="₹"
              />

              <Field
                label="GST / Tax"
                value={
                  form.taxRate
                }
                onChange={(value) =>
                  update(
                    "taxRate",
                    value
                  )
                }
                type="number"
                suffix="%"
              />
            </div>

            <PricingPreview
              price={form.price}
              mrp={form.mrp}
              costPrice={
                form.costPrice
              }
            />
          </EditorSection>

          {/* INVENTORY */}

          <EditorSection
            title="Inventory"
            icon={Archive}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field
                label="Current Stock"
                value={
                  form.stock
                }
                onChange={(value) =>
                  update(
                    "stock",
                    value
                  )
                }
                type="number"
              />

              <Field
                label="Reorder Level"
                value={
                  form.reorderLevel
                }
                onChange={(value) =>
                  update(
                    "reorderLevel",
                    value
                  )
                }
                type="number"
              />

              <Field
                label="Weight"
                value={
                  form.weight
                }
                onChange={(value) =>
                  update(
                    "weight",
                    value
                  )
                }
                type="number"
              />

              <SelectField
                label="Unit"
                value={
                  form.unit
                }
                onChange={(value) =>
                  update(
                    "unit",
                    value
                  )
                }
                options={[
                  [
                    "piece",
                    "Piece",
                  ],
                  [
                    "ml",
                    "ML",
                  ],
                  [
                    "g",
                    "Gram",
                  ],
                  [
                    "kg",
                    "KG",
                  ],
                  [
                    "set",
                    "Set",
                  ],
                ]}
              />
            </div>
          </EditorSection>

          {/* IMAGES */}

          <EditorSection
            title="Product Images"
            icon={ImagePlus}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(form.images || []).map(
                (image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(
                          index
                        )
                      }
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/90 text-red-600 flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-blue-950 text-white text-[6px] font-black">
                        PRIMARY
                      </span>
                    )}
                  </div>
                )
              )}

              {!form.images?.length && (
                <div className="col-span-full rounded-xl border border-dashed border-slate-300 py-10 text-center">
                  <ImagePlus className="w-6 h-6 mx-auto text-slate-300" />

                  <p className="text-[8px] font-black text-slate-500 mt-2">
                    No product images added
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <input
                value={imageInput}
                onChange={(event) =>
                  setImageInput(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    addImage();
                  }
                }}
                placeholder="Paste product image URL..."
                className="flex-1 h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-orange-500"
              />

              <button
                type="button"
                onClick={addImage}
                className="px-4 h-10 rounded-xl bg-orange-500 text-white text-[9px] font-black"
              >
                <Upload className="w-3.5 h-3.5 inline mr-1" />
                Add
              </button>
            </div>
          </EditorSection>

          {/* VARIANTS */}

          <EditorSection
            title="Variants"
            icon={Tag}
          >
            <div className="space-y-2">
              {(form.variants || []).map(
                (
                  variant,
                  index
                ) => (
                  <div
                    key={
                      variant.id ||
                      index
                    }
                    className="grid grid-cols-[1fr_1fr_1fr_100px_35px] gap-2 items-end p-3 rounded-xl bg-slate-50"
                  >
                    <Field
                      label="Option"
                      value={
                        variant.name
                      }
                      onChange={(
                        value
                      ) =>
                        updateVariant(
                          index,
                          "name",
                          value
                        )
                      }
                      placeholder="Color"
                    />

                    <Field
                      label="Value"
                      value={
                        variant.value
                      }
                      onChange={(
                        value
                      ) =>
                        updateVariant(
                          index,
                          "value",
                          value
                        )
                      }
                      placeholder="Rose"
                    />

                    <Field
                      label="SKU"
                      value={
                        variant.sku
                      }
                      onChange={(
                        value
                      ) =>
                        updateVariant(
                          index,
                          "sku",
                          value
                        )
                      }
                      placeholder="SKU-V1"
                    />

                    <Field
                      label="Stock"
                      value={
                        variant.stock
                      }
                      onChange={(
                        value
                      ) =>
                        updateVariant(
                          index,
                          "stock",
                          value
                        )
                      }
                      type="number"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeVariant(
                          index
                        )
                      }
                      className="h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              )}
            </div>

            <button
              type="button"
              onClick={
                addVariant
              }
              className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-[8px] font-black"
            >
              <Plus className="w-3 h-3" />
              Add Variant
            </button>
          </EditorSection>

          {/* MERCHANDISING */}

          <EditorSection
            title="Storefront Merchandising"
            icon={TrendingUp}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Toggle
                label="Featured Product"
                description="Show prominently across the storefront."
                checked={
                  form.featured
                }
                onChange={(value) =>
                  update(
                    "featured",
                    value
                  )
                }
              />

              <Toggle
                label="Bestseller"
                description="Include in bestseller sections."
                checked={
                  form.bestseller
                }
                onChange={(value) =>
                  update(
                    "bestseller",
                    value
                  )
                }
              />

              <Toggle
                label="Trending"
                description="Show in trending and discovery areas."
                checked={
                  form.trending
                }
                onChange={(value) =>
                  update(
                    "trending",
                    value
                  )
                }
              />

              <Toggle
                label="Flash Sale"
                description="Enable sale urgency treatment."
                checked={
                  form.flashSale
                }
                onChange={(value) =>
                  update(
                    "flashSale",
                    value
                  )
                }
              />
            </div>

            {form.flashSale && (
              <div className="mt-3">
                <Field
                  label="Sale Ends At"
                  value={
                    form.saleEndsAt
                  }
                  onChange={(value) =>
                    update(
                      "saleEndsAt",
                      value
                    )
                  }
                  type="datetime-local"
                  full
                />
              </div>
            )}

            <div className="mt-4">
              <p className="text-[8px] font-black text-slate-500 mb-2">
                Product Tags
              </p>

              <div className="flex flex-wrap gap-2 mb-2">
                {(form.tags || []).map(
                  (tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() =>
                        removeTag(
                          tag
                        )
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-[8px] font-black"
                    >
                      {tag}

                      <X className="w-2.5 h-2.5" />
                    </button>
                  )
                )}
              </div>

              <div className="flex gap-2">
                <input
                  value={
                    tagInput
                  }
                  onChange={(event) =>
                    setTagInput(
                      event.target
                        .value
                    )
                  }
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      addTag();
                    }
                  }}
                  placeholder="Add tag..."
                  className="flex-1 h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-orange-500"
                />

                <button
                  type="button"
                  onClick={
                    addTag
                  }
                  className="px-4 h-10 rounded-xl bg-orange-50 text-orange-700 text-[9px] font-black"
                >
                  Add
                </button>
              </div>
            </div>
          </EditorSection>

          {/* PUBLISHING */}

          <EditorSection
            title="Publishing"
            icon={Eye}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectField
                label="Product Status"
                value={
                  form.status
                }
                onChange={(value) =>
                  update(
                    "status",
                    value
                  )
                }
                options={[
                  [
                    "DRAFT",
                    "Draft",
                  ],
                  [
                    "ACTIVE",
                    "Active",
                  ],
                  [
                    "ARCHIVED",
                    "Archived",
                  ],
                ]}
              />

              <SelectField
                label="Storefront Visibility"
                value={
                  form.visibility
                }
                onChange={(value) =>
                  update(
                    "visibility",
                    value
                  )
                }
                options={[
                  [
                    "VISIBLE",
                    "Visible",
                  ],
                  [
                    "HIDDEN",
                    "Hidden",
                  ],
                ]}
              />
            </div>
          </EditorSection>

          {/* FOOTER */}

          <div className="sticky bottom-0 bg-white border-t border-slate-200 pt-4 pb-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-slate-200 text-xs font-black"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={
                submit
              }
              className="flex-1 h-11 rounded-xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600 disabled:opacity-40"
            >
              {saving
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Create Product"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ============================================================
   EDITOR COMPONENTS
============================================================ */

function EditorSection({
  icon: Icon,
  title,
  children,
}) {
  return (
    <section className="border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-orange-600" />

        <h3 className="text-xs font-black">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  prefix,
  suffix,
  full = false,
}) {
  return (
    <div
      className={
        full
          ? "sm:col-span-2"
          : ""
      }
    >
      <label className="block text-[8px] font-black text-slate-500 mb-1.5">
        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">
            {prefix}
          </span>
        )}

        <input
          type={type}
          value={
            value ??
            ""
          }
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={
            placeholder
          }
          className={`w-full h-10 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 ${
            prefix
              ? "pl-7"
              : "px-3"
          } ${
            suffix
              ? "pr-8"
              : "pr-3"
          }`}
        />

        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  full = false,
}) {
  return (
    <div
      className={
        full
          ? "sm:col-span-2"
          : ""
      }
    >
      <label className="block text-[8px] font-black text-slate-500 mb-1.5">
        {label}
      </label>

      <textarea
        value={
          value ??
          ""
        }
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
        rows={4}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 resize-none"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="block text-[8px] font-black text-slate-500 mb-1.5">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="appearance-none w-full h-10 rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-bold outline-none focus:border-orange-500"
        >
          {options.map(
            ([optionValue, optionLabel]) => (
              <option
                key={
                  optionValue
                }
                value={
                  optionValue
                }
              >
                {
                  optionLabel
                }
              </option>
            )
          )}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onChange(!checked)
      }
      className={`text-left p-4 rounded-xl border transition ${
        checked
          ? "border-orange-300 bg-orange-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[9px] font-black">
            {label}
          </p>

          <p className="text-[7px] text-slate-400 mt-1">
            {description}
          </p>
        </div>

        <div
          className={`w-9 h-5 rounded-full p-0.5 transition ${
            checked
              ? "bg-orange-500"
              : "bg-slate-300"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              checked
                ? "translate-x-4"
                : ""
            }`}
          />
        </div>
      </div>
    </button>
  );
}

function PricingPreview({
  price,
  mrp,
  costPrice,
}) {
  const selling =
    Number(price || 0);

  const maximum =
    Number(mrp || 0);

  const cost =
    Number(costPrice || 0);

  const discount =
    maximum > 0
      ? Math.round(
          (1 -
            selling /
              maximum) *
            100
        )
      : 0;

  const margin =
    selling > 0
      ? Math.round(
          ((selling -
            cost) /
            selling) *
            100
        )
      : 0;

  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-[7px] text-slate-400">
          Customer Sees
        </p>

        <p className="text-sm font-black mt-1">
          {formatCurrency(
            selling
          )}
        </p>
      </div>

      <div className="rounded-xl bg-green-50 p-3">
        <p className="text-[7px] text-green-600">
          Discount
        </p>

        <p className="text-sm font-black text-green-700 mt-1">
          {discount}%
        </p>
      </div>

      <div className="rounded-xl bg-blue-50 p-3">
        <p className="text-[7px] text-blue-600">
          Gross Margin
        </p>

        <p className="text-sm font-black text-blue-700 mt-1">
          {Math.max(
            0,
            margin
          )}
          %
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function CatalogKpi({
  icon: Icon,
  label,
  value,
  tone,
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-800",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    orange: "bg-orange-50 text-orange-700",
    red: "bg-red-50 text-red-700",
    yellow: "bg-yellow-50 text-yellow-700",
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

      <p className="text-lg font-black mt-1">
        {value}
      </p>
    </div>
  );
}

function QuickCatalogFilter({
  icon: Icon,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[8px] font-black"
    >
      <Icon className="w-3.5 h-3.5 text-orange-300" />

      {label}
    </button>
  );
}

function Badge({
  icon: Icon,
  label,
}) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[6px] font-black">
      <Icon className="w-2.5 h-2.5" />

      {label}
    </span>
  );
}

function StatusBadge({
  status,
}) {
  const value =
    normalize(status);

  const styles = {
    ACTIVE:
      "bg-green-100 text-green-700",
    DRAFT:
      "bg-yellow-100 text-yellow-800",
    ARCHIVED:
      "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 rounded-md text-[7px] font-black ${
        styles[value] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {formatStatus(
        value || "DRAFT"
      )}
    </span>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
        danger
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
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

function CatalogPagination({
  page,
  totalPages,
  total,
  onPageChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <p className="text-[9px] text-slate-400">
        Page {page} of {totalPages} ·{" "}
        {total} products
      </p>

      <div className="flex gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() =>
            onPageChange(
              page - 1
            )
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
          disabled={
            page >= totalPages
          }
          onClick={() =>
            onPageChange(
              page + 1
            )
          }
          className="px-3 py-2 rounded-lg border border-slate-200 text-[9px] font-black disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
      {Array.from({
        length: 7,
      }).map((_, index) => (
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
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}

function formatCurrency(value) {
  return `₹${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}

function generateSku() {
  return `D2C-${Date.now()
    .toString()
    .slice(-8)}`;
}