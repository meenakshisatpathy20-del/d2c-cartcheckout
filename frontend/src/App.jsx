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

export default function App() {
  const [viewMode, setViewMode] = useState('store');
  const [products, setProducts] = useState([]);
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
      setProducts(data);
    } catch (err) {}
  };

  const fetchAdminOrders = async () => {
    try {
      const data = await api.getAdminOrders();
      setAdminOrders(data);
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
          onBuyNow={() => setSelectedProduct(null)}
        />

        <LiveSalesTicker />
      </main>
    </div>
  );
}