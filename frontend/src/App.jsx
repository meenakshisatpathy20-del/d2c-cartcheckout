import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

import ProductCard from "./components/catalog/ProductCard";
import ProductDetailModal from "./components/catalog/ProductDetailModal";
import ProductGrid from "./components/catalog/ProductGrid";

import CheckoutModal from "./components/checkout/CheckoutModal";
import OrderSuccessModal from "./components/checkout/OrderSuccessModal";

import CustomerOrdersView from "./components/order/CustomerOrdersView";
import TrackOrderView from "./components/tracking/TrackOrderView";

import FranchisePortalView from "./components/franchise/FranchisePortalView";

import AdminLogin from "./components/admin/AdminLogin";
import AdminOrdersView from "./components/admin/AdminOrdersView";

import HomeExperience from "./components/home/HomeExperience";

import "./index.css";

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
|
| Final api.js will be consolidated later.
| For now App only expects these methods to exist:
|
| getProducts()
| getAdminOrders()
| adminLogin()
|
*/

import api from "./api";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Application />} />
      </Routes>
    </BrowserRouter>
  );
}

function Application() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("d2c_cart") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("d2c_wishlist") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [orderSuccess, setOrderSuccess] =
    useState(null);

  const [adminSession, setAdminSession] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem("d2c_admin_session") ||
          sessionStorage.getItem("d2c_admin_session");

        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "d2c_cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(
      "d2c_wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  async function loadProducts() {
    setLoadingProducts(true);

    try {
      const result = await api.getProducts();

      setProducts(
        Array.isArray(result)
          ? result
          : result?.products || []
      );
    } catch (error) {
      console.error(
        "Unable to load products:",
        error
      );
    } finally {
      setLoadingProducts(false);
    }
  }

  function addToCart(product, quantity = 1) {
    if (!product) return;

    setCart((current) => {
      const existing = current.find(
        (item) =>
          item.id === product.id ||
          item.skuId === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id ||
          item.skuId === product.id
            ? {
                ...item,
                qty:
                  Number(item.qty || 1) +
                  quantity,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          skuId: product.id,
          qty: quantity,
        },
      ];
    });
  }

  function removeFromCart(productId) {
    setCart((current) =>
      current.filter(
        (item) =>
          item.id !== productId &&
          item.skuId !== productId
      )
    );
  }

  function updateCartQuantity(productId, quantity) {
    const safeQuantity = Math.max(
      1,
      Number(quantity) || 1
    );

    setCart((current) =>
      current.map((item) =>
        item.id === productId ||
        item.skuId === productId
          ? {
              ...item,
              qty: safeQuantity,
            }
          : item
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  function toggleWishlist(product) {
    if (!product) return;

    setWishlist((current) => {
      const exists = current.some(
        (item) =>
          item.id === product.id
      );

      if (exists) {
        return current.filter(
          (item) =>
            item.id !== product.id
        );
      }

      return [...current, product];
    });
  }

  function isWishlisted(productId) {
    return wishlist.some(
      (item) => item.id === productId
    );
  }

  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.qty || 1),
      0
    );
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.qty || 1),
      0
    );
  }, [cart]);

  function openProduct(product) {
    setSelectedProduct(product);
  }

  function handleHomeCategory(category) {
    const value = String(
      category || ""
    ).toLowerCase();

    if (
      value === "home" ||
      value === "stories"
    ) {
      navigate("/");
      return;
    }

    if (
      value.includes("deal") ||
      value.includes("sale")
    ) {
      navigate("/catalog?collection=sale");
      return;
    }

    if (
      value.includes("brand")
    ) {
      navigate("/catalog?collection=brands");
      return;
    }

    navigate(
      `/catalog?search=${encodeURIComponent(
        category
      )}`
    );
  }

  function handleCheckoutComplete(order) {
    setCheckoutOpen(false);
    clearCart();

    setOrderSuccess(order);

    navigate("/orders");
  }

  function handleAdminLogin(session) {
    setAdminSession(session);
    navigate("/admin/orders");
  }

  function logoutAdmin() {
    localStorage.removeItem(
      "d2c_admin_session"
    );

    sessionStorage.removeItem(
      "d2c_admin_session"
    );

    setAdminSession(null);

    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* =====================================================
          CUSTOMER HEADER
      ====================================================== */}

      <Header
        cartCount={cartCount}
        cart={cart}
        wishlist={wishlist}
        onCartClick={() =>
          navigate("/checkout")
        }
        onWishlistClick={() =>
          navigate("/wishlist")
        }
        onOrdersClick={() =>
          navigate("/orders")
        }
        onHomeClick={() =>
          navigate("/")
        }
      />

      <Routes>

        {/* ===================================================
            HOME
        ==================================================== */}

        <Route
          path="/"
          element={
            <HomeExperience
              products={products}
              onProductClick={openProduct}
              onAddToCart={(product) =>
                addToCart(product)
              }
              onWishlist={toggleWishlist}
              onCategoryClick={
                handleHomeCategory
              }
            />
          }
        />

        {/* ===================================================
            CATALOG
        ==================================================== */}

        <Route
          path="/catalog"
          element={
            <main className="max-w-[1450px] mx-auto px-4 py-6">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                  D2C Mall
                </p>

                <h1 className="text-3xl font-black text-slate-950">
                  Explore Products
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Discover fashion, beauty,
                  lifestyle and more.
                </p>
              </div>

              {loadingProducts ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({
                    length: 8,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="h-80 rounded-2xl bg-slate-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <ProductGrid
                  products={products}
                  onProductClick={openProduct}
                  onAddToCart={addToCart}
                  onWishlist={
                    toggleWishlist
                  }
                  wishlist={wishlist}
                />
              )}
            </main>
          }
        />

        {/* ===================================================
            CHECKOUT
        ==================================================== */}

        <Route
          path="/checkout"
          element={
            <div className="max-w-[1450px] mx-auto px-4 py-8">
              {cart.length === 0 ? (
                <EmptyCart
                  onContinue={() =>
                    navigate("/")
                  }
                />
              ) : (
                <CheckoutPage
                  cart={cart}
                  subtotal={cartSubtotal}
                  onQuantityChange={
                    updateCartQuantity
                  }
                  onRemove={removeFromCart}
                  onCheckout={() =>
                    setCheckoutOpen(true)
                  }
                />
              )}
            </div>
          }
        />

        {/* ===================================================
            ORDERS
        ==================================================== */}

        <Route
          path="/orders"
          element={
            <main className="max-w-[1450px] mx-auto px-4 py-6">
              <CustomerOrdersView
                api={api}
                onTrackShipment={(shipment) =>
                  navigate(
                    `/tracking/${encodeURIComponent(
                      shipment?.awb ||
                        shipment?.shipmentId ||
                        ""
                    )}`
                  )
                }
              />
            </main>
          }
        />

        {/* ===================================================
            TRACKING
        ==================================================== */}

        <Route
          path="/tracking/:awb"
          element={
            <main className="max-w-[1450px] mx-auto px-4 py-6">
              <TrackOrderView api={api} />
            </main>
          }
        />

        {/* ===================================================
            FRANCHISE
        ==================================================== */}

        <Route
          path="/franchise"
          element={
            <FranchisePortalView
              api={api}
            />
          }
        />

        {/* ===================================================
            WISHLIST
        ==================================================== */}

        <Route
          path="/wishlist"
          element={
            <WishlistPage
              wishlist={wishlist}
              onProductClick={openProduct}
              onAddToCart={addToCart}
              onRemove={toggleWishlist}
            />
          }
        />

        {/* ===================================================
            ADMIN LOGIN
        ==================================================== */}

        <Route
          path="/admin/login"
          element={
            adminSession ? (
              <Navigate
                to="/admin/orders"
                replace
              />
            ) : (
              <AdminLogin
                api={api}
                onLogin={handleAdminLogin}
              />
            )
          }
        />

        {/* ===================================================
            ADMIN ORDERS
        ==================================================== */}

        <Route
          path="/admin/orders"
          element={
            <AdminProtected
              session={adminSession}
            >
              <AdminLayout
                session={adminSession}
                onLogout={logoutAdmin}
                current="orders"
              >
                <AdminOrdersView
                  api={api}
                  onTrackShipment={(shipment) =>
                    navigate(
                      `/admin/shipments/${encodeURIComponent(
                        shipment?.shipmentId ||
                          shipment?.awb ||
                          ""
                      )}`
                    )
                  }
                />
              </AdminLayout>
            </AdminProtected>
          }
        />

        {/* ===================================================
            ADMIN SHIPMENTS
        ==================================================== */}

        <Route
          path="/admin/shipments"
          element={
            <AdminProtected
              session={adminSession}
            >
              <AdminLayout
                session={adminSession}
                onLogout={logoutAdmin}
                current="shipments"
              >
                <AdminComingSoon
                  title="Shipment Management"
                  description="Shipment tracking, carrier routing, AWB management and delivery operations are being connected to the final Shiprocket backend."
                />
              </AdminLayout>
            </AdminProtected>
          }
        />

        {/* ===================================================
            ADMIN CUSTOMERS
        ==================================================== */}

        <Route
          path="/admin/customers"
          element={
            <AdminProtected
              session={adminSession}
            >
              <AdminLayout
                session={adminSession}
                onLogout={logoutAdmin}
                current="customers"
              >
                <AdminComingSoon
                  title="Customer Management"
                  description="Customer profiles, order history, addresses, payment activity and lifetime value will appear here."
                />
              </AdminLayout>
            </AdminProtected>
          }
        />

        {/* ===================================================
            ADMIN WAREHOUSE
        ==================================================== */}

        <Route
          path="/admin/warehouse"
          element={
            <AdminProtected
              session={adminSession}
            >
              <AdminLayout
                session={adminSession}
                onLogout={logoutAdmin}
                current="warehouse"
              >
                <AdminComingSoon
                  title="Warehouse Operations"
                  description="Inventory, warehouse allocation, low-stock alerts and fulfillment routing."
                />
              </AdminLayout>
            </AdminProtected>
          }
        />

        {/* ===================================================
            ADMIN ANALYTICS
        ==================================================== */}

        <Route
          path="/admin/analytics"
          element={
            <AdminProtected
              session={adminSession}
            >
              <AdminLayout
                session={adminSession}
                onLogout={logoutAdmin}
                current="analytics"
              >
                <AdminComingSoon
                  title="Operations Analytics"
                  description="Revenue, orders, fulfillment SLA, delivery performance and customer metrics."
                />
              </AdminLayout>
            </AdminProtected>
          }
        />
      </Routes>

      {/* =====================================================
          PRODUCT MODAL
      ====================================================== */}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() =>
            setSelectedProduct(null)
          }
          onAddToCart={(product) => {
            addToCart(product);
            setSelectedProduct(null);
          }}
          onWishlist={toggleWishlist}
          isWishlisted={isWishlisted(
            selectedProduct.id
          )}
        />
      )}

      {/* =====================================================
          CHECKOUT MODAL
      ====================================================== */}

      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          products={products}
          subtotal={cartSubtotal}
          onClose={() =>
            setCheckoutOpen(false)
          }
          onSuccess={
            handleCheckoutComplete
          }
          api={api}
        />
      )}

      {/* =====================================================
          ORDER SUCCESS
      ====================================================== */}

      {orderSuccess && (
        <OrderSuccessModal
          order={orderSuccess}
          onClose={() =>
            setOrderSuccess(null)
          }
          onTrack={() => {
            setOrderSuccess(null);

            const shipment =
              orderSuccess?.fulfillments?.[0];

            navigate(
              `/tracking/${encodeURIComponent(
                shipment?.awb ||
                  shipment?.shipmentId ||
                  orderSuccess?.orderId ||
                  ""
              )}`
            );
          }}
          onOrders={() => {
            setOrderSuccess(null);
            navigate("/orders");
          }}
        />
      )}

      <Footer />
    </div>
  );
}

/* ============================================================
   ADMIN PROTECTION
============================================================ */

function AdminProtected({
  session,
  children,
}) {
  if (!session?.authenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}

/* ============================================================
   ADMIN LAYOUT
============================================================ */

function AdminLayout({
  session,
  onLogout,
  current,
  children,
}) {
  const navigate = useNavigate();

  const navigation = [
    {
      id: "orders",
      label: "Orders",
      path: "/admin/orders",
    },
    {
      id: "shipments",
      label: "Shipments",
      path: "/admin/shipments",
    },
    {
      id: "customers",
      label: "Customers",
      path: "/admin/customers",
    },
    {
      id: "warehouse",
      label: "Warehouse",
      path: "/admin/warehouse",
    },
    {
      id: "analytics",
      label: "Analytics",
      path: "/admin/analytics",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden lg:flex w-64 bg-slate-950 text-white flex-col shrink-0">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-black">
                D2C
              </div>

              <div>
                <p className="font-black">
                  D2C MALL
                </p>

                <p className="text-[8px] uppercase tracking-[0.18em] text-orange-400">
                  Operations
                </p>
              </div>
            </div>
          </div>

          <div className="px-3 py-5">
            <p className="text-[8px] uppercase tracking-[0.18em] font-black text-slate-500 px-3 mb-3">
              Operations
            </p>

            <div className="space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    navigate(item.path)
                  }
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-black transition ${
                    current === item.id
                      ? "bg-orange-500 text-white"
                      : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto p-4 border-t border-white/10">
            <div className="mb-3 rounded-xl bg-white/5 p-3">
              <p className="text-[9px] font-black">
                {session?.user?.name ||
                  "D2C Admin"}
              </p>

              <p className="text-[8px] text-slate-400 mt-1">
                {session?.user?.email || ""}
              </p>

              <span className="inline-block mt-2 px-2 py-1 rounded-md bg-green-500/15 text-green-400 text-[7px] font-black">
                {session?.user?.role ||
                  "ADMIN"}
              </span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-slate-300 hover:bg-white/10"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* CONTENT */}

        <main className="flex-1 min-w-0">
          <div className="lg:hidden bg-slate-950 text-white p-4 flex items-center justify-between">
            <div>
              <p className="font-black">
                D2C MALL
              </p>

              <p className="text-[8px] text-orange-400 font-black">
                OPERATIONS
              </p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="text-xs font-black"
            >
              Logout
            </button>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   CHECKOUT PAGE
============================================================ */

function CheckoutPage({
  cart,
  subtotal,
  onQuantityChange,
  onRemove,
  onCheckout,
}) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] font-black text-orange-600">
          Your Bag
        </p>

        <h1 className="text-3xl font-black">
          Checkout
        </h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {cart.map((item) => (
            <div
              key={item.id || item.skuId}
              className="flex gap-4 p-4 border-b border-slate-100 last:border-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-xl bg-slate-50 object-contain"
              />

              <div className="flex-1">
                <p className="text-sm font-black">
                  {item.name}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {item.brand}
                </p>

                <p className="text-lg font-black mt-3">
                  ₹
                  {Number(
                    item.price || 0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() =>
                      onQuantityChange(
                        item.id ||
                          item.skuId,
                        Number(
                          item.qty || 1
                        ) - 1
                      )
                    }
                    className="w-7 h-7 rounded-lg border font-black"
                  >
                    −
                  </button>

                  <span className="text-xs font-black">
                    {item.qty || 1}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onQuantityChange(
                        item.id ||
                          item.skuId,
                        Number(
                          item.qty || 1
                        ) + 1
                      )
                    }
                    className="w-7 h-7 rounded-lg border font-black"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onRemove(
                        item.id ||
                          item.skuId
                      )
                    }
                    className="ml-3 text-xs font-black text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 h-fit">
          <h2 className="font-black text-lg">
            Order Summary
          </h2>

          <div className="flex justify-between mt-5 text-sm">
            <span className="text-slate-500">
              Subtotal
            </span>

            <strong>
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="flex justify-between mt-3 text-sm">
            <span className="text-slate-500">
              Shipping
            </span>

            <strong className="text-green-600">
              ₹50
            </strong>
          </div>

          <div className="border-t mt-5 pt-5 flex justify-between">
            <span className="font-black">
              Total
            </span>

            <strong className="text-xl">
              ₹
              {(
                subtotal + 50
              ).toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <button
            type="button"
            onClick={onCheckout}
            className="w-full mt-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EMPTY CART
============================================================ */

function EmptyCart({
  onContinue,
}) {
  return (
    <div className="min-h-[500px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 flex items-center justify-center text-3xl">
          🛍️
        </div>

        <h2 className="text-2xl font-black mt-5">
          Your bag is empty
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          Add something you love.
        </p>

        <button
          type="button"
          onClick={onContinue}
          className="mt-5 px-6 py-3 rounded-xl bg-blue-950 text-white text-sm font-black"
        >
          START SHOPPING
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   WISHLIST
============================================================ */

function WishlistPage({
  wishlist,
  onProductClick,
  onAddToCart,
  onRemove,
}) {
  return (
    <main className="max-w-[1450px] mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] font-black text-orange-600">
          Saved For Later
        </p>

        <h1 className="text-3xl font-black">
          Wishlist
        </h1>
      </div>

      {!wishlist.length ? (
        <div className="py-20 text-center">
          <p className="text-4xl">
            ♡
          </p>

          <h2 className="text-xl font-black mt-3">
            Nothing saved yet
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Tap the heart on products you love.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() =>
                onProductClick(product)
              }
              onAddToCart={() =>
                onAddToCart(product)
              }
              onWishlist={() =>
                onRemove(product)
              }
              isWishlisted
            />
          ))}
        </div>
      )}
    </main>
  );
}

/* ============================================================
   ADMIN COMING SOON
============================================================ */

function AdminComingSoon({
  title,
  description,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8">
      <p className="text-[9px] uppercase tracking-[0.18em] font-black text-orange-600">
        Operations Module
      </p>

      <h1 className="text-2xl font-black text-slate-950 mt-2">
        {title}
      </h1>

      <p className="text-sm text-slate-500 max-w-2xl mt-2">
        {description}
      </p>

      <div className="grid sm:grid-cols-3 gap-3 mt-7">
        <div className="rounded-xl bg-orange-50 p-4">
          <p className="text-xl">📦</p>
          <p className="text-xs font-black mt-2">
            Fulfillment
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-xl">🚚</p>
          <p className="text-xs font-black mt-2">
            Logistics
          </p>
        </div>

        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-xl">📊</p>
          <p className="text-xs font-black mt-2">
            Insights
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;