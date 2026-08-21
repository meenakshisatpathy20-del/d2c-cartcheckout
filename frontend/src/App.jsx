import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { useCart } from './context/CartContext';
import { useCheckout } from './context/CheckoutContext';
import Header from './components/common/Header';
import AlertBanner from './components/common/AlertBanner';
import SaleBanner from './components/catalog/SaleBanner';
import LiveSalesTicker from './components/catalog/LiveSalesTicker';
import ProductGrid from './components/catalog/ProductGrid';
import ProductDetailModal from './components/catalog/ProductDetailModal';
import CartDrawer from './components/cart/CartDrawer';
import OrderSuccess from './components/order/OrderSuccess';
import TrackOrder from './components/order/TrackOrder';
import InventoryManager from './components/admin/InventoryManager';
import ShipmentManager from './components/admin/ShipmentManager';

const FALLBACK_PRODUCTS = [
  {
    id: "sku-lux-01",
    brand: "Luxura Sciences",
    brandColor: "#00A859",
    warehouseCity: "Mumbai Hub",
    name: "Vitamin C Face Serum (30ml)",
    price: 499,
    mrp: 899,
    stock: 5,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80"
  },
  {
    id: "sku-sn-02",
    brand: "Shiv-Naresh",
    brandColor: "#0038A8",
    warehouseCity: "Delhi Hub",
    name: "Performance Dry-Fit Track Pant",
    price: 1199,
    mrp: 1899,
    stock: 3,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80"
  },
  {
    id: "sku-swarg-03",
    brand: "Swarg Homes",
    brandColor: "#FF6B00",
    warehouseCity: "Jaipur Hub",
    name: "Ceramic Handcrafted Dinner Set",
    price: 2499,
    mrp: 3999,
    stock: 2,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80"
  }
];

export default function App() {
  const [viewMode, setViewMode] = useState('store');
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [adminOrders, setAdminOrders] = useState([]);
  const [pincode, setPincode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { cartError, setAppliedCoupon, subtotal } = useCart();
  const { checkoutError, setConfirmedOrder } = useCheckout();

  useEffect(() => {
    fetchProducts();
    if (viewMode === 'admin') fetchAdminOrders();
  }, [viewMode]);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      setProducts(FALLBACK_PRODUCTS);
    }
  };

  const fetchAdminOrders = async () => {
    try {
      const data = await api.getAdminOrders();
      if (Array.isArray(data)) setAdminOrders(data);
    } catch (err) {}
  };

  const handleApplyCouponCode = async (code) => {
    try {
      const data = await api.validateCoupon(code, subtotal || 1000);
      setAppliedCoupon({ code, discountAmount: data.discountAmount });
    } catch (err) {}
  };

  const handleOrderReset = () => {
    setIsSuccess(false);
    setConfirmedOrder(null);
    setPincode('');
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-orange-500/20 selection:text-orange-900">
      <Header viewMode={viewMode} setViewMode={setViewMode} />

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <AlertBanner message={cartError || checkoutError} />

        {viewMode === 'store' && (
          <>
            {isSuccess ? (
              <OrderSuccess onReset={handleOrderReset} />
            ) : (
              <>
                <SaleBanner onApplyCoupon={handleApplyCouponCode} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <ProductGrid
                    products={products}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                  />
                  <CartDrawer
                    pincode={pincode}
                    setPincode={setPincode}
                    onSuccess={() => setIsSuccess(true)}
                  />
                </div>
              </>
            )}
          </>
        )}

        {viewMode === 'track' && <TrackOrder />}

        {viewMode === 'admin' && (
          <div className="space-y-8">
            <InventoryManager products={products} onRefresh={fetchProducts} />
            <ShipmentManager orders={adminOrders} onRefresh={fetchAdminOrders} />
          </div>
        )}

        <ProductDetailModal
          product={selectedProduct}
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          onBuyNow={() => {
            setSelectedProduct(null);
          }}
        />

        <LiveSalesTicker />
      </main>
    </div>
  );
}