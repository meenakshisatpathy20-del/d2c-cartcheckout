import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Heart,
  ShoppingBag,
  ShoppingCart,
  Star,
  Trash2,
  Zap,
} from "lucide-react";

const FALLBACK_PRODUCTS = [
  {
    id: "W1",
    name: "Hydrating Face Serum",
    brand: "Glow Lab",
    price: 699,
    mrp: 999,
    rating: 4.6,
    reviews: 182,
    image:
      "https://cdn.dummyjson.com/products/images/beauty/Hyaluronic%20Acid%20Serum/thumbnail.png",
    inStock: true,
    stock: 8,
    badge: "PRICE DROP",
  },
  {
    id: "W2",
    name: "Essence Mascara Lash Princess",
    brand: "Essence",
    price: 829,
    mrp: 1299,
    rating: 4.7,
    reviews: 314,
    image:
      "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    inStock: true,
    stock: 4,
    badge: "TRENDING",
  },
  {
    id: "W3",
    name: "Eyeshadow Palette with Mirror",
    brand: "Glamour",
    price: 1659,
    mrp: 2499,
    rating: 4.5,
    reviews: 127,
    image:
      "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
    inStock: true,
    stock: 12,
    badge: "BESTSELLER",
  },
  {
    id: "W4",
    name: "Red Lipstick",
    brand: "Luxe Beauty",
    price: 499,
    mrp: 799,
    rating: 4.4,
    reviews: 96,
    image:
      "https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.png",
    inStock: false,
    stock: 0,
    badge: "COMING BACK",
  },
];

export default function WishlistView({
  products: initialProducts,
  api,
  onBack,
  onProductClick,
  onAddToCart,
  onMoveToCart,
  onRemove,
  onContinueShopping,
}) {
  const [products, setProducts] =
    useState(
      initialProducts?.length
        ? initialProducts
        : FALLBACK_PRODUCTS
    );

  const [activeTab, setActiveTab] =
    useState("all");

  const [movingId, setMovingId] =
    useState(null);

  const [removingId, setRemovingId] =
    useState(null);

  const [toast, setToast] =
    useState("");

  const [sort, setSort] =
    useState("recent");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (
      activeTab === "available"
    ) {
      result = result.filter(
        (item) => item.inStock
      );
    }

    if (
      activeTab === "price-drop"
    ) {
      result = result.filter(
        (item) =>
          item.badge ===
          "PRICE DROP"
      );
    }

    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    return result;
  }, [
    products,
    activeTab,
    sort,
  ]);

  const availableCount =
    products.filter(
      (item) => item.inStock
    ).length;

  const priceDropCount =
    products.filter(
      (item) =>
        item.badge ===
        "PRICE DROP"
    ).length;

  const totalSavings = products.reduce(
    (sum, item) =>
      sum +
      Math.max(
        Number(item.mrp || 0) -
          Number(item.price || 0),
        0
      ),
    0
  );

  const showToast = (message) => {
    setToast(message);

    setTimeout(
      () => setToast(""),
      2200
    );
  };

  const removeItem = async (
    product
  ) => {
    setRemovingId(product.id);

    try {
      if (api?.removeFromWishlist) {
        await api.removeFromWishlist(
          product.id
        );
      }

      await onRemove?.(
        product
      );

      setProducts(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              product.id
          )
      );

      showToast(
        "Removed from wishlist."
      );
    } catch (error) {
      showToast(
        error?.message ||
          "Unable to remove item."
      );
    } finally {
      setRemovingId(null);
    }
  };

  const moveToCart = async (
    product
  ) => {
    if (!product.inStock) {
      showToast(
        "This item is currently out of stock."
      );
      return;
    }

    setMovingId(product.id);

    try {
      if (api?.addToCart) {
        await api.addToCart(
          product.id,
          1
        );
      }

      await onMoveToCart?.(
        product
      );

      await onAddToCart?.(
        product
      );

      setProducts(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              product.id
          )
      );

      showToast(
        "Moved to your bag."
      );
    } catch (error) {
      showToast(
        error?.message ||
          "Unable to move item to bag."
      );
    } finally {
      setMovingId(null);
    }
  };

  const moveAllToCart = async () => {
    const available =
      products.filter(
        (item) => item.inStock
      );

    if (!available.length) {
      showToast(
        "No available items to move."
      );
      return;
    }

    for (const product of available) {
      await moveToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] text-slate-950">
      {/* HEADER */}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-[9px] font-black"
            >
              ← BACK
            </button>

            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />

              <span className="text-[10px] font-black">
                WISHLIST
              </span>
            </div>

            <button
              type="button"
              onClick={
                onContinueShopping
              }
              className="hidden sm:flex items-center gap-2 text-[8px] font-black text-slate-500 hover:text-orange-500"
            >
              SHOP MORE
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1250px] mx-auto px-4 sm:px-6 py-7">
        {/* HERO */}

        <section className="relative overflow-hidden rounded-[28px] bg-blue-950 text-white p-7 sm:p-9">
          <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-pink-500/20 blur-3xl" />

          <div className="absolute -left-20 bottom-[-100px] w-72 h-72 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10">
                <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />

                <span className="text-[7px] font-black">
                  YOUR PICKS
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black mt-4">
                Your Wishlist
              </h1>

              <p className="text-xs text-white/45 mt-2 max-w-md">
                Keep your favourites close. We'll help you catch price drops, restocks and trending moments.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <StatBox
                value={
                  products.length
                }
                label="SAVED"
              />

              <StatBox
                value={
                  availableCount
                }
                label="AVAILABLE"
              />

              <StatBox
                value={`₹${totalSavings.toLocaleString(
                  "en-IN"
                )}`}
                label="SAVINGS"
              />
            </div>
          </div>
        </section>

        {/* FLASH STRIP */}

        {priceDropCount >
          0 && (
          <section className="mt-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Zap className="w-4 h-4 fill-white" />
              </div>

              <div>
                <p className="text-[9px] font-black">
                  PRICE DROP ALERT
                </p>

                <p className="text-[7px] text-white/70 mt-1">
                  {priceDropCount} saved item
                  {priceDropCount ===
                  1
                    ? ""
                    : "s"}{" "}
                  just got cheaper.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "price-drop"
                )
              }
              className="h-9 px-4 rounded-lg bg-white text-orange-600 text-[8px] font-black"
            >
              SEE PRICE DROPS
            </button>
          </section>
        )}

        {/* FILTER BAR */}

        <section className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex gap-1 p-1 rounded-xl bg-white border border-slate-100 w-fit">
            <Tab
              active={
                activeTab === "all"
              }
              onClick={() =>
                setActiveTab("all")
              }
              label={`All ${products.length}`}
            />

            <Tab
              active={
                activeTab ===
                "available"
              }
              onClick={() =>
                setActiveTab(
                  "available"
                )
              }
              label={`Available ${availableCount}`}
            />

            <Tab
              active={
                activeTab ===
                "price-drop"
              }
              onClick={() =>
                setActiveTab(
                  "price-drop"
                )
              }
              label={`Price Drops ${priceDropCount}`}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={
                moveAllToCart
              }
              className="h-10 px-4 rounded-xl bg-orange-500 text-white text-[8px] font-black inline-flex items-center gap-2"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              MOVE AVAILABLE TO BAG
            </button>

            <select
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target.value
                )
              }
              className="h-10 px-3 rounded-xl bg-white border border-slate-200 text-[8px] font-black outline-none"
            >
              <option value="recent">
                Recently Added
              </option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
              <option value="rating">
                Top Rated
              </option>
            </select>
          </div>
        </section>

        {/* PRODUCT GRID */}

        {filteredProducts.length >
        0 ? (
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
            {filteredProducts.map(
              (product) => (
                <WishlistCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                  moving={
                    movingId ===
                    product.id
                  }
                  removing={
                    removingId ===
                    product.id
                  }
                  onOpen={() =>
                    onProductClick?.(
                      product
                    )
                  }
                  onMove={() =>
                    moveToCart(
                      product
                    )
                  }
                  onRemove={() =>
                    removeItem(
                      product
                    )
                  }
                />
              )
            )}
          </section>
        ) : (
          <EmptyWishlist
            tab={activeTab}
            onShop={
              onContinueShopping
            }
          />
        )}

        {/* TRENDING CTA */}

        <section className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 mt-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
              </div>

              <div>
                <p className="text-[8px] uppercase tracking-[0.16em] text-orange-500 font-black">
                  TRENDING NOW
                </p>

                <h2 className="text-lg font-black mt-1">
                  Your wishlist shouldn't stay a wishlist.
                </h2>

                <p className="text-[7px] text-slate-400 mt-1">
                  Explore what's trending with shoppers right now.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                onContinueShopping
              }
              className="h-10 px-5 rounded-xl bg-blue-950 text-white text-[8px] font-black inline-flex items-center justify-center gap-2"
            >
              EXPLORE TRENDING
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </section>
      </main>

      {/* TOAST */}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100]">
          <div className="px-5 py-3 rounded-xl bg-blue-950 text-white shadow-2xl flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-green-400" />

            <span className="text-[8px] font-black">
              {toast}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PRODUCT CARD
============================================================ */

function WishlistCard({
  product,
  moving,
  removing,
  onOpen,
  onMove,
  onRemove,
}) {
  const discount = getDiscount(
    product.mrp,
    product.price
  );

  return (
    <article className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[0.86] bg-slate-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt=""
            onClick={onOpen}
            className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            onClick={onOpen}
            className="w-full h-full flex items-center justify-center text-5xl cursor-pointer"
          >
            🛍️
          </div>
        )}

        {/* BADGE */}

        {product.badge && (
          <span className="absolute left-2 top-2 px-2 py-1 rounded-md bg-orange-500 text-white text-[6px] font-black">
            {product.badge}
          </span>
        )}

        {/* HEART */}

        <button
          type="button"
          onClick={onRemove}
          disabled={removing}
          className="absolute right-2 top-2 w-8 h-8 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-sm disabled:opacity-50"
        >
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
        </button>

        {/* DISCOUNT */}

        {discount > 0 && (
          <span className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-green-600 text-white text-[6px] font-black">
            {discount}% OFF
          </span>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/65 flex items-center justify-center">
            <span className="px-3 py-2 rounded-lg bg-blue-950 text-white text-[7px] font-black">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <p className="text-[7px] text-orange-500 font-black uppercase tracking-[0.12em]">
          {product.brand ||
            "D2C BRAND"}
        </p>

        <button
          type="button"
          onClick={onOpen}
          className="text-left w-full"
        >
          <h3 className="text-[10px] sm:text-xs font-black mt-1 line-clamp-2 min-h-[30px]">
            {product.name ||
              product.title}
          </h3>
        </button>

        <div className="flex items-center gap-1.5 mt-2">
          <span className="inline-flex items-center gap-1 px-1.5 py-1 rounded-md bg-green-50 text-green-700 text-[6px] font-black">
            <Star className="w-2.5 h-2.5 fill-current" />
            {product.rating ||
              "4.5"}
          </span>

          <span className="text-[6px] text-slate-400">
            (
            {product.reviews ||
              0}
            )
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm font-black">
            {formatCurrency(
              product.price
            )}
          </span>

          {product.mrp && (
            <span className="text-[7px] text-slate-400 line-through">
              {formatCurrency(
                product.mrp
              )}
            </span>
          )}
        </div>

        {product.inStock &&
          product.stock <=
            5 && (
            <p className="text-[6px] text-red-500 font-black mt-2">
              Only{" "}
              {product.stock}{" "}
              left
            </p>
          )}

        <button
          type="button"
          disabled={
            moving ||
            !product.inStock
          }
          onClick={onMove}
          className={`w-full h-10 rounded-xl mt-3 text-[7px] font-black flex items-center justify-center gap-2 ${
            product.inStock
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-slate-100 text-slate-400"
          } disabled:opacity-50`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />

          {moving
            ? "MOVING..."
            : product.inStock
            ? "MOVE TO BAG"
            : "OUT OF STOCK"}
        </button>
      </div>
    </article>
  );
}

/* ============================================================
   EMPTY
============================================================ */

function EmptyWishlist({
  tab,
  onShop,
}) {
  return (
    <section className="bg-white border border-slate-100 rounded-2xl py-20 px-6 text-center mt-5">
      <div className="w-16 h-16 rounded-2xl bg-pink-50 mx-auto flex items-center justify-center">
        <Heart className="w-7 h-7 text-pink-400" />
      </div>

      <h2 className="text-xl font-black mt-5">
        {tab === "price-drop"
          ? "No price drops yet"
          : tab === "available"
          ? "No available favourites"
          : "Your wishlist is empty"}
      </h2>

      <p className="text-[8px] text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
        Save products you love and we'll keep them here for quick access, price drops and restock alerts.
      </p>

      <button
        type="button"
        onClick={onShop}
        className="mt-6 h-11 px-6 rounded-xl bg-orange-500 text-white text-[8px] font-black inline-flex items-center gap-2"
      >
        START EXPLORING
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </section>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function StatBox({
  value,
  label,
}) {
  return (
    <div className="min-w-[75px] rounded-xl bg-white/10 px-3 py-3 text-center">
      <p className="text-sm font-black">
        {value}
      </p>

      <p className="text-[6px] text-white/40 font-black mt-1">
        {label}
      </p>
    </div>
  );
}

function Tab({
  active,
  onClick,
  label,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-[7px] font-black ${
        active
          ? "bg-blue-950 text-white"
          : "text-slate-500"
      }`}
    >
      {label}
    </button>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function getDiscount(
  mrp,
  price
) {
  const original =
    Number(mrp || 0);

  const current =
    Number(price || 0);

  if (
    !original ||
    !current ||
    current >= original
  ) {
    return 0;
  }

  return Math.round(
    ((original - current) /
      original) *
      100
  );
}

function formatCurrency(
  value
) {
  return `₹${Number(
    value || 0
  ).toLocaleString(
    "en-IN"
  )}`;
}