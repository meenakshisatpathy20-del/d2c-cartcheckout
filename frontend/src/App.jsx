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

const BACKUP_PRODUCTS = [
  {
    id: "sku-1",
    brand: "Essence",
    brandColor: "#00A859",
    category: "beauty",
    warehouseCity: "Mumbai Bhiwandi Hub",
    name: "Essence Mascara Lash Princess",
    price: 829,
    mrp: 1299,
    stock: 99,
    rating: 4.9,
    reviewsCount: 1420,
    estimatedDays: 2,
    image: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    description: "Cruelty-free long-lasting curl and volume mascara with conical fiber wand."
  },
  {
    id: "sku-2",
    brand: "Glamour",
    brandColor: "#0038A8",
    category: "beauty",
    warehouseCity: "Delhi NCR Hub",
    name: "Eyeshadow Palette with Mirror",
    price: 1659,
    mrp: 2499,
    stock: 34,
    rating: 4.8,
    reviewsCount: 890,
    estimatedDays: 3,
    image: "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
    description: "Highly pigmented blendable velvety shades for day-to-night eye makeup."
  },
  {
    id: "sku-3",
    brand: "Velvet Touch",
    brandColor: "#FF6B00",
    category: "beauty",
    warehouseCity: "Bengaluru Whitefield Hub",
    name: "Powder Canister Compact",
    price: 1244,
    mrp: 1899,
    stock: 89,
    rating: 4.7,
    reviewsCount: 650,
    estimatedDays: 2,
    image: "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png",
    description: "Finely milled setting powder to lock in makeup with a shine-free matte finish."
  },
  {
    id: "sku-4",
    brand: "Chic Fragrance",
    brandColor: "#8B5CF6",
    category: "fragrances",
    warehouseCity: "Jaipur Depot Hub",
    name: "Calvin Klein CK One EDT (100ml)",
    price: 3499,
    mrp: 5200,
    stock: 45,
    rating: 4.9,
    reviewsCount: 2100,
    estimatedDays: 3,
    image: "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png",
    description: "Iconic clean citrus and green tea unisex fragrance for everyday luxury."
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('store');
  const [products, setProducts] = useState(BACKUP_PRODUCTS);
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
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      }
    } catch (e) {
      setProducts(BACKUP_PRODUCTS);
    }
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