import { useEffect, useMemo, useState } from "react";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import PromotionalBanners from "./components/common/PromotionalBanners";
import ProductGrid from "./components/catalog/ProductGrid";
import ProductDetailModal from "./components/catalog/ProductDetailModal";
import CartDrawer from "./components/cart/CartDrawer";
import CheckoutModal from "./components/checkout/CheckoutModal";
import OrderSuccessModal from "./components/checkout/OrderSuccessModal";
import CustomerOrdersView from "./components/order/CustomerOrdersView";
import TrackOrderView from "./components/tracking/TrackOrderView";
import FranchisePortalView from "./components/franchise/FranchisePortalView";
import HomeExperience from "./components/home/HomeExperience";
import OrderConfirmationView from "./components/storefront/OrderConfirmationView";
import OrderTrackingView from "./components/storefront/OrderTrackingView";
import AdminDashboard from "./components/admin/AdminDashboard";
import CustomerManagementView from "./components/admin/CustomerManagementView";
import ShipmentManagementView from "./components/admin/ShipmentManagementView";
import WarehouseManagementView from "./components/admin/WarehouseManagementView";
import InventoryManagementView from "./components/admin/InventoryManagementView";
import ReturnsManagementView from "./components/admin/ReturnsManagementView";
import { useCart } from "./context/CartContext";
import api from "./services/api";
import "./App.css";

function App() {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    totalItemCount
  } = useCart();

  const [currentTab, setCurrentTabState] = useState("store");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = useMemo(() => {
    const values = products
      .map((product) => product?.category)
      .filter(Boolean)
      .map((value) => String(value));

    return ["ALL", ...new Set(values)];
  }, [products]);

  const currentView = useMemo(() => {
    if (currentTab === "store") {
      return "products";
    }

    if (currentTab === "orders") {
      return "orders";
    }

    if (currentTab === "franchise") {
      return "franchise";
    }

    if (currentTab === "admin") {
      return "admin";
    }

    return "products";
  }, [currentTab]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.getProducts();

      const list = Array.isArray(response)
        ? response
        : response?.products ||
          response?.data ||
          [];

      setProducts(list);
    } catch (err) {
      setProducts([]);
      setError(
        err?.message ||
          "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const categoryMatch =
        selectedCategory === "ALL" ||
        String(
          product?.category || ""
        ).toLowerCase() ===
          selectedCategory.toLowerCase();

      const searchMatch =
        !query ||
        [
          product?.name,
          product?.title,
          product?.brand,
          product?.category,
          product?.sku,
          product?.description
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );

      return (
        categoryMatch &&
        searchMatch
      );
    });
  }, [
    products,
    searchQuery,
    selectedCategory
  ]);

  const setCurrentTab = (tab) => {
    if (tab === "cart") {
      setShowCart(true);
      return;
    }

    if (tab === "home") {
      setCurrentTabState("store");
      setSearchQuery("");
      setSelectedCategory("ALL");
      return;
    }

    if (tab === "store") {
      setCurrentTabState("store");
      return;
    }

    if (tab === "orders") {
      setCurrentTabState("orders");
      return;
    }

    if (tab === "franchise") {
      setCurrentTabState("franchise");
      return;
    }

    if (tab === "admin") {
      setCurrentTabState("admin");
      return;
    }

    setCurrentTabState("store");
  };

  const handleSearch = (value) => {
    setSearchQuery(value || "");
    setSelectedCategory("ALL");
    setCurrentTabState("store");
  };

  const handleCategory = (category) => {
    if (category === "ALL") {
      setSelectedCategory("ALL");
    } else {
      setSelectedCategory(category || "ALL");
    }

    setSearchQuery("");
    setCurrentTabState("store");
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product) => {
    if (!product) {
      return;
    }

    addToCart(product);
    setSelectedProduct(null);
  };

  const handleBuyNow = (product) => {
    if (!product) {
      return;
    }

    addToCart(product);
    setSelectedProduct(null);
    setShowCart(true);
  };

  const handleCheckout = () => {
    if (!cart.length) {
      return;
    }

    setShowCart(false);
    setShowCheckout(true);
  };

  const handleOrderSuccess = (order) => {
    setCompletedOrder(order);
    setShowCheckout(false);
    setShowSuccess(true);
    clearCart();
  };

  const handleTrackOrder = (order) => {
    if (order) {
      setCompletedOrder(order);
    }

    setShowSuccess(false);
    setCurrentTabState("orders");
  };

  const handleViewOrders = () => {
    setShowSuccess(false);
    setCurrentTabState("orders");
  };

  const handleContinueShopping = () => {
    setShowSuccess(false);
    setSelectedProduct(null);
    setSearchQuery("");
    setSelectedCategory("ALL");
    setCurrentTabState("store");
  };

  const renderStore = () => {
    if (loading) {
      return (
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
            <p className="mt-4 text-sm font-semibold text-slate-500">
              Loading D2C Mall...
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <section className="mx-auto max-w-3xl px-6 py-20">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
            <h2 className="text-2xl font-black text-red-700">
              Product service unavailable
            </h2>

            <p className="mt-3 text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadProducts}
              className="mt-6 rounded-xl bg-orange-500 px-7 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Retry
            </button>
          </div>
        </section>
      );
    }

    return (
      <>
        <PromotionalBanners />

        <HomeExperience
          products={products}
          onProductClick={
            handleProductClick
          }
          onAddToCart={
            handleAddToCart
          }
          onWishlist={() => {}}
          onCategoryClick={
            handleCategory
          }
        />

        <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                Explore the catalog
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
                Shop All Products
              </h2>

              <p className="mt-2 text-slate-500">
                {filteredProducts.length} products available
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories
                .slice(0, 9)
                .map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      handleCategory(item)
                    }
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      selectedCategory ===
                      item
                        ? "bg-orange-500 text-white"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-orange-50"
                    }`}
                  >
                    {item === "ALL"
                      ? "All"
                      : item}
                  </button>
                ))}
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <ProductGrid
              products={
                filteredProducts
              }
              onProductClick={
                handleProductClick
              }
              onAddToCart={
                handleAddToCart
              }
            />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
              <h3 className="text-2xl font-black text-slate-900">
                No products found
              </h3>

              <p className="mt-2 text-slate-500">
                Try another search or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(
                    "ALL"
                  );
                }}
                className="mt-6 rounded-xl bg-slate-950 px-6 py-3 font-bold text-white"
              >
                View Everything
              </button>
            </div>
          )}
        </section>
      </>
    );
  };

  const renderAdmin = () => {
    if (
      currentView === "admin"
    ) {
      return (
        <AdminDashboard
          api={api}
          onNavigate={
            setCurrentTab
          }
        />
      );
    }

    return null;
  };

  const renderMainView = () => {
    if (currentView === "admin") {
      return renderAdmin();
    }

    if (
      currentView === "orders"
    ) {
      return (
        <CustomerOrdersView
          api={api}
          onTrackOrder={
            handleTrackOrder
          }
        />
      );
    }

    if (
      currentView === "franchise"
    ) {
      return (
        <FranchisePortalView
          api={api}
        />
      );
    }

    return renderStore();
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">
      <Header
        currentTab={currentTab}
        setCurrentTab={
          setCurrentTab
        }
        searchQuery={
          searchQuery
        }
        setSearchQuery={
          handleSearch
        }
        selectedCategory={
          selectedCategory
        }
        setSelectedCategory={
          handleCategory
        }
        categories={
          categories
        }
      />

      <main>
        {renderMainView()}
      </main>

      <Footer
        onNavigate={(destination) => {
          if (
            destination ===
            "franchise"
          ) {
            setCurrentTab(
              "franchise"
            );
          } else if (
            destination === "orders"
          ) {
            setCurrentTab("orders");
          } else if (
            destination === "track"
          ) {
            setCurrentTab("orders");
          } else {
            setCurrentTab("store");
          }
        }}
      />

      {selectedProduct && (
        <ProductDetailModal
          product={
            selectedProduct
          }
          onClose={() =>
            setSelectedProduct(null)
          }
          onAddToCart={
            handleAddToCart
          }
          onBuyNow={
            handleBuyNow
          }
        />
      )}

      {showCart && (
        <CartDrawer
          isOpen={showCart}
          onClose={() =>
            setShowCart(false)
          }
          onCheckout={
            handleCheckout
          }
        />
      )}

      {showCheckout && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() =>
            setShowCheckout(false)
          }
          onSuccess={
            handleOrderSuccess
          }
        />
      )}

      {showSuccess && (
        <OrderSuccessModal
          order={
            completedOrder
          }
          onClose={() =>
            setShowSuccess(false)
          }
          onTrackOrder={() =>
            handleTrackOrder(
              completedOrder
            )
          }
          onViewOrders={
            handleViewOrders
          }
          onContinueShopping={
            handleContinueShopping
          }
        />
      )}
    </div>
  );
}

export default App;