import { useEffect, useMemo, useState } from "react";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import PromotionalBanners from "./components/common/PromotionalBanners";
import ProductCard from "./components/catalog/ProductCard";
import ProductDetailModal from "./components/catalog/ProductDetailModal";
import ProductGrid from "./components/catalog/ProductGrid";
import DeliveryChecker from "./components/catalog/DeliveryChecker";
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
  const [view, setView] = useState("home");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cart = useCart();

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
      setFilteredProducts(list);
    } catch (err) {
      setError(err?.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();

    let result = [...products];

    if (query) {
      result = result.filter((product) => {
        const values = [
          product.name,
          product.title,
          product.brand,
          product.category,
          product.sku,
          product.description
        ];

        return values.some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );
      });
    }

    if (category) {
      result = result.filter(
        (product) =>
          String(product.category || "").toLowerCase() ===
          category.toLowerCase()
      );
    }

    setFilteredProducts(result);
  }, [search, category, products]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    ];
  }, [products]);

  const handleSearch = (value) => {
    setSearch(value || "");
    setCategory("");
    setView("products");
  };

  const handleCategory = (value) => {
    setCategory(value || "");
    setSearch("");
    setView("products");
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product) => {
    if (!product) return;

    if (typeof cart?.addToCart === "function") {
      cart.addToCart(product);
    }

    setSelectedProduct(null);
  };

  const handleBuyNow = (product) => {
    if (!product) return;

    if (typeof cart?.addToCart === "function") {
      cart.addToCart(product);
    }

    setSelectedProduct(null);
    setShowCart(true);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleOrderSuccess = (order) => {
    setCompletedOrder(order);
    setShowCheckout(false);
    setShowSuccess(false);
    setView("confirmation");
  };

  const handleTrackOrder = (order) => {
    if (order) {
      setCompletedOrder(order);
    }

    setView("tracking");
  };

  const handleViewOrders = () => {
    setView("orders");
  };

  const handleContinueShopping = () => {
    setShowSuccess(false);
    setSelectedProduct(null);
    setSearch("");
    setCategory("");
    setView("home");
  };

  const handleAdminNavigation = (section) => {
    setView(`admin-${section}`);
  };

  const renderProducts = () => {
    if (loading) {
      return (
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
            <p className="mt-4 font-semibold text-slate-500">
              Loading products...
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <section className="mx-auto max-w-4xl px-6 py-20">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
            <h2 className="text-2xl font-black text-red-700">
              Unable to load products
            </h2>

            <p className="mt-2 text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadProducts}
              className="mt-6 rounded-xl bg-orange-500 px-7 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        </section>
      );
    }

    return (
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">
              D2C Mall
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
              {search
                ? `Search results for "${search}"`
                : category
                ? category
                : "Shop Everything"}
            </h1>

            <p className="mt-2 text-slate-500">
              {filteredProducts.length} products available
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCategory("")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                !category
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200"
              }`}
            >
              All
            </button>

            {categories.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => handleCategory(item)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  category === item
                    ? "bg-orange-500 text-white"
                    : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <ProductGrid
            products={filteredProducts}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <h2 className="text-2xl font-black text-slate-950">
              No products found
            </h2>

            <p className="mt-2 text-slate-500">
              Try another search or browse the complete catalog.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("");
              }}
              className="mt-6 rounded-xl bg-orange-500 px-7 py-3 font-bold text-white"
            >
              View All Products
            </button>
          </div>
        )}
      </section>
    );
  };

  const renderAdmin = () => {
    if (view === "admin-customers") {
      return (
        <CustomerManagementView
          api={api}
          onViewOrder={handleTrackOrder}
        />
      );
    }

    if (view === "admin-shipments") {
      return (
        <ShipmentManagementView
          api={api}
          onViewOrder={handleTrackOrder}
        />
      );
    }

    if (view === "admin-warehouses") {
      return (
        <WarehouseManagementView
          api={api}
          onViewInventory={() =>
            setView("admin-inventory")
          }
        />
      );
    }

    if (view === "admin-inventory") {
      return <InventoryManagementView api={api} />;
    }

    if (view === "admin-returns") {
      return (
        <ReturnsManagementView
          api={api}
          onViewOrder={handleTrackOrder}
        />
      );
    }

    return (
      <AdminDashboard
        api={api}
        onNavigate={handleAdminNavigation}
      />
    );
  };

  const renderView = () => {
    if (view.startsWith("admin-")) {
      return renderAdmin();
    }

    if (view === "home") {
      return (
        <>
          <PromotionalBanners />

          <HomeExperience
            products={products}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onWishlist={() => {}}
            onCategoryClick={handleCategory}
          />
        </>
      );
    }

    if (view === "products") {
      return renderProducts();
    }

    if (view === "orders") {
      return (
        <CustomerOrdersView
          api={api}
          onTrackOrder={handleTrackOrder}
        />
      );
    }

    if (view === "track") {
      return (
        <TrackOrderView
          api={api}
          onBack={() => setView("home")}
        />
      );
    }

    if (view === "tracking") {
      return (
        <OrderTrackingView
          order={completedOrder}
          api={api}
          onBack={() => setView("home")}
          onViewOrders={handleViewOrders}
        />
      );
    }

    if (view === "confirmation") {
      return (
        <OrderConfirmationView
          order={completedOrder}
          api={api}
          onTrackOrder={handleTrackOrder}
          onViewOrders={handleViewOrders}
          onContinueShopping={handleContinueShopping}
        />
      );
    }

    if (view === "franchise") {
      return <FranchisePortalView api={api} />;
    }

    return renderProducts();
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">
      <Header
        search={search}
        onSearch={handleSearch}
        onCartClick={() => setShowCart(true)}
        onOrdersClick={handleViewOrders}
        onTrackOrder={() => setView("track")}
        onHomeClick={() => {
          setSearch("");
          setCategory("");
          setView("home");
        }}
        onProductsClick={() => {
          setSearch("");
          setCategory("");
          setView("products");
        }}
        onFranchiseClick={() => setView("franchise")}
        cartItemCount={cart?.totalItemCount || 0}
      />

      <main>{renderView()}</main>

      <Footer
        onNavigate={(destination) => {
          if (destination === "franchise") {
            setView("franchise");
          } else if (destination === "orders") {
            setView("orders");
          } else if (destination === "track") {
            setView("track");
          } else {
            setView("home");
          }
        }}
      />

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}

      {showCart && (
        <CartDrawer
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleOrderSuccess}
          api={api}
        />
      )}

      {showSuccess && (
        <OrderSuccessModal
          order={completedOrder}
          onClose={() => setShowSuccess(false)}
          onTrackOrder={() => {
            setShowSuccess(false);
            setView("tracking");
          }}
          onViewOrders={() => {
            setShowSuccess(false);
            setView("orders");
          }}
          onContinueShopping={handleContinueShopping}
        />
      )}
    </div>
  );
}

export default App;