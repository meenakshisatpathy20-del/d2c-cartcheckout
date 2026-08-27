import React, { useEffect, useState } from 'react';
import {
  Search,
  ShoppingBag,
  Package,
  Truck,
  Home,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  Store,
  ChevronDown
} from 'lucide-react';

import { api } from './services/api';
import { useCart } from './context/CartContext';

import ProductCard from './components/catalog/ProductCard';
import ProductDetailModal from './components/catalog/ProductDetailModal';
import CartDrawer from './components/cart/CartDrawer';
import CheckoutModal from './components/checkout/CheckoutModal';
import OrderSuccessModal from './components/checkout/OrderSuccessModal';
import CustomerOrdersView from './components/order/CustomerOrdersView';
import TrackOrderView from './components/tracking/TrackOrderView';
import PromotionalBanners from './components/common/PromotionalBanners';
import Footer from './components/common/Footer';
import FranchisePortalView from './components/franchise/FranchisePortalView';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const { cart, totalItemCount } = useCart();

  const [products, setProducts] = useState([]);
  const [activeView, setActiveView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderSuccessOpen, setOrderSuccessOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProducts();

    const savedAdmin = localStorage.getItem('d2c_admin_user');

    if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);

        if (parsed?.token) {
          setAdminLoggedIn(true);
          setAdminUser(parsed);
        }
      } catch {
        localStorage.removeItem('d2c_admin_user');
      }
    }
  }, []);

  const categories = [
    {
      id: 'ALL',
      label: 'All Products'
    },
    {
      id: 'beauty',
      label: 'Beauty'
    },
    {
      id: 'fragrances',
      label: 'Fragrances'
    }
  ];

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        !searchQuery.trim() ||
        product.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.brand
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      if (sortBy === 'price-high') {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      if (sortBy === 'rating') {
        return Number(b.rating || 0) - Number(a.rating || 0);
      }

      if (sortBy === 'discount') {
        const discountA =
          a.mrp > a.price
            ? ((a.mrp - a.price) / a.mrp) * 100
            : 0;

        const discountB =
          b.mrp > b.price
            ? ((b.mrp - b.price) / b.mrp) * 100
            : 0;

        return discountB - discountA;
      }

      return 0;
    });

  const handleNavigate = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleAdminLogin = async (event) => {
    event.preventDefault();

    if (!adminUsername.trim() || !adminPassword.trim()) {
      setAdminLoginError('Enter username and password.');
      return;
    }

    setAdminLoginLoading(true);
    setAdminLoginError('');

    try {
      const result = await api.adminLogin({
        username: adminUsername.trim(),
        password: adminPassword
      });

      if (!result?.success) {
        throw new Error(
          result?.message || 'Invalid admin credentials.'
        );
      }

      const adminData = {
        token: result.token,
        username:
          result.username ||
          result.user?.username ||
          adminUsername.trim(),
        role:
          result.role ||
          result.user?.role ||
          'WAREHOUSE_ADMIN'
      };

      localStorage.setItem(
        'd2c_admin_user',
        JSON.stringify(adminData)
      );

      setAdminUser(adminData);
      setAdminLoggedIn(true);
      setIsAdmin(true);
      setAdminLoginOpen(false);
      setAdminPassword('');
      setActiveView('admin');
    } catch (error) {
      setAdminLoginError(
        error.message || 'Unable to login.'
      );
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      if (api.adminLogout) {
        await api.adminLogout();
      }
    } catch {
    }

    localStorage.removeItem('d2c_admin_user');

    setAdminLoggedIn(false);
    setAdminUser(null);
    setIsAdmin(false);
    setAdminLoginOpen(false);
    setActiveView('home');
  };

  const openAdmin = () => {
    if (adminLoggedIn) {
      setIsAdmin(true);
      setActiveView('admin');
      setMobileMenuOpen(false);
      return;
    }

    setAdminLoginError('');
    setAdminLoginOpen(true);
    setMobileMenuOpen(false);
  };

  const handleOrderSuccess = (orderData) => {
    setCompletedOrder(orderData);
    setCheckoutOpen(false);
    setOrderSuccessOpen(true);
    setActiveView('home');
    loadProducts();
  };

  const handleBuyNow = () => {
    setCheckoutOpen(true);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleRefreshProducts = async () => {
    await loadProducts();
  };

  const renderHome = () => (
    <>
      <PromotionalBanners />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] font-black text-orange-500">
              Direct from verified brands
            </p>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
              Shop trusted D2C products
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Authentic products, fast delivery and secure checkout.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  setSelectedCategory(category.id)
                }
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition ${
                  selectedCategory === category.id
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search products or brands..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
              className="appearance-none w-full sm:w-48 bg-white border border-slate-200 rounded-2xl pl-4 pr-10 py-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="featured">
                Sort: Featured
              </option>
              <option value="rating">
                Highest Rated
              </option>
              <option value="discount">
                Biggest Discount
              </option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-14 text-center">
            <Package className="w-10 h-10 mx-auto text-slate-300" />

            <h3 className="font-black text-slate-900 mt-3">
              No products found
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Try another product name, brand or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={handleSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderCustomerView = () => {
    if (activeView === 'cart') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          <CartDrawer
            onProceedCheckout={() =>
              setCheckoutOpen(true)
            }
          />
        </div>
      );
    }

    if (activeView === 'orders') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          <CustomerOrdersView />
        </div>
      );
    }

    if (activeView === 'tracking') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          <TrackOrderView />
        </div>
      );
    }

    if (activeView === 'franchise') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          <FranchisePortalView />
        </div>
      );
    }

    return renderHome();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between gap-4">
            <button
              onClick={() => {
                setIsAdmin(false);
                handleNavigate('home');
              }}
              className="flex items-center gap-2.5 shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-slate-950 text-white flex items-center justify-center shadow-md">
                <Store className="w-5 h-5" />
              </div>

              <div className="text-left">
                <div className="font-black text-slate-950 leading-none">
                  D2C MALL
                </div>

                <div className="text-[8px] uppercase tracking-[0.18em] text-orange-500 font-black mt-0.5">
                  Direct Brand Marketplace
                </div>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => {
                  setIsAdmin(false);
                  handleNavigate('home');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black transition ${
                  !isAdmin && activeView === 'home'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => {
                  setIsAdmin(false);
                  handleNavigate('orders');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black transition ${
                  !isAdmin && activeView === 'orders'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                My Orders
              </button>

              <button
                onClick={() => {
                  setIsAdmin(false);
                  handleNavigate('tracking');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black transition ${
                  !isAdmin && activeView === 'tracking'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Track Order
              </button>

              <button
                onClick={() => {
                  setIsAdmin(false);
                  handleNavigate('franchise');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black transition ${
                  !isAdmin && activeView === 'franchise'
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Franchise
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openAdmin}
                className="hidden sm:inline-flex items-center gap-1.5 bg-slate-950 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-black transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />

                {adminLoggedIn
                  ? 'Warehouse Admin'
                  : 'Warehouse Login'}
              </button>

              <button
                onClick={() => {
                  setIsAdmin(false);
                  handleNavigate('cart');
                }}
                className="relative inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-xl text-xs font-black transition shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">
                  Basket
                </span>

                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-slate-950 text-white rounded-full text-[9px] flex items-center justify-center border-2 border-white">
                    {totalItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() =>
                  setMobileMenuOpen((value) => !value)
                }
                className="md:hidden w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
              <button
                onClick={() => {
                  setIsAdmin(false);
                  handleNavigate('home');
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-black hover:bg-slate-100 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </button>

              <button
                onClick={() => {
                  setIsAdmin(false);
                  handleNavigate('orders');
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-black hover:bg-slate-100 flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                My Orders
              </button>

              <button
                onClick={() => {
                  setIsAdmin(false);
                  handleNavigate('tracking');
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-black hover:bg-slate-100 flex items-center gap-2"
              >
                <Truck className="w-4 h-4" />
                Track Order
              </button>

              <button
                onClick={() => {
                  setIsAdmin(false);
                  handleNavigate('franchise');
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-black hover:bg-slate-100 flex items-center gap-2"
              >
                <Store className="w-4 h-4" />
                Franchise
              </button>

              <button
                onClick={openAdmin}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-black bg-slate-950 text-white flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />

                {adminLoggedIn
                  ? 'Warehouse Admin Dashboard'
                  : 'Warehouse Admin Login'}
              </button>
            </div>
          )}
        </div>
      </header>

      {isAdmin && adminLoggedIn ? (
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
            <div className="bg-slate-950 rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-orange-400 font-black">
                  D2C MALL OPERATIONS
                </p>

                <h1 className="text-lg font-black mt-0.5">
                  Warehouse & Order Control Center
                </h1>

                <p className="text-[10px] text-slate-400 mt-1">
                  Signed in as{' '}
                  <span className="text-white font-bold">
                    {adminUser?.username || 'Administrator'}
                  </span>
                  {' • '}
                  {adminUser?.role || 'WAREHOUSE_ADMIN'}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsAdmin(false);
                    setActiveView('home');
                  }}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold transition"
                >
                  Customer Store
                </button>

                <button
                  onClick={handleAdminLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-black transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <AdminDashboard
              products={products}
              onRefresh={handleRefreshProducts}
            />
          </div>
        </main>
      ) : (
        <main className="flex-1">
          {renderCustomerView()}
        </main>
      )}

      {!isAdmin && <Footer />}

      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={handleBuyNow}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleOrderSuccess}
      />

      <OrderSuccessModal
        isOpen={orderSuccessOpen}
        order={completedOrder}
        onClose={() => setOrderSuccessOpen(false)}
        onViewOrders={() => {
          setOrderSuccessOpen(false);
          setActiveView('orders');
          setIsAdmin(false);
        }}
      />

      {adminLoginOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-slate-950 p-6 text-white relative">
              <button
                onClick={() => setAdminLoginOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <p className="text-[9px] uppercase tracking-[0.2em] text-orange-400 font-black">
                Restricted Access
              </p>

              <h2 className="text-xl font-black mt-1">
                Warehouse Admin Login
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Access orders, customers, inventory,
                shipments and carrier operations.
              </p>
            </div>

            <form
              onSubmit={handleAdminLogin}
              className="p-6 space-y-4"
            >
              {adminLoginError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-xs font-bold">
                  {adminLoginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  Admin Username
                </label>

                <input
                  type="text"
                  value={adminUsername}
                  onChange={(event) =>
                    setAdminUsername(event.target.value)
                  }
                  placeholder="Enter admin username"
                  autoComplete="username"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  Password
                </label>

                <input
                  type="password"
                  value={adminPassword}
                  onChange={(event) =>
                    setAdminPassword(event.target.value)
                  }
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[10px] text-amber-800">
                <div className="font-black mb-0.5">
                  Warehouse access
                </div>

                <div>
                  This area is intended for authorized
                  warehouse and operations staff.
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAdminLoginOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={adminLoginLoading}
                  className="flex-1 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-xs font-black transition"
                >
                  {adminLoginLoading
                    ? 'Signing in...'
                    : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}