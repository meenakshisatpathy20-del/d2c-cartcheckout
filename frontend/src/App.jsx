import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { useCart } from './context/CartContext';
import { useCheckout } from './context/CheckoutContext';

import Header from './components/common/Header';
import PromotionalBanners from './components/common/PromotionalBanners';
import ProductGrid from './components/catalog/ProductGrid';
import ProductDetailModal from './components/catalog/ProductDetailModal';
import CartDrawer from './components/cart/CartDrawer';
import CheckoutModal from './components/checkout/CheckoutModal';
import OrderSuccessModal from './components/checkout/OrderSuccessModal';
import CustomerOrdersView from './components/order/CustomerOrdersView';
import WarehouseHubView from './components/admin/WarehouseHubView';

export default function App() {
  const [currentTab, setCurrentTab] = useState('store');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const { confirmedOrder, setConfirmedOrder } = useCheckout();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data || []);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {currentTab === 'store' && (
          <>
            <PromotionalBanners />
            <ProductGrid
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              searchQuery={searchQuery}
            />
          </>
        )}

        {currentTab === 'cart' && (
          <CartDrawer onProceedCheckout={() => setIsCheckoutOpen(true)} />
        )}

        {currentTab === 'orders' && <CustomerOrdersView />}

        {currentTab === 'admin' && (
          <WarehouseHubView
            products={products}
            onRefresh={fetchProducts}
          />
        )}

        <ProductDetailModal
          product={selectedProduct}
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          onBuyNow={() => setIsCheckoutOpen(true)}
        />

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={(orderData) => {
            setConfirmedOrder(orderData);
            fetchProducts();
          }}
        />

        <OrderSuccessModal
          order={confirmedOrder}
          isOpen={Boolean(confirmedOrder)}
          onClose={() => setConfirmedOrder(null)}
          onViewTracking={() => setCurrentTab('orders')}
        />
      </main>
    </div>
  );
}