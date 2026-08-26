import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Package,
  Store,
  Building2,
  Search,
  ShieldCheck,
  MapPin,
  ChevronDown,
  Heart,
  X,
  Menu,
  Sparkles,
  Truck,
  Clock3,
  BadgeCheck,
  ArrowRight,
  UserRound,
  Headphones,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Header({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories
}) {
  const { cart } = useCart();

  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showLocationPanel, setShowLocationPanel] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('110001');

  const searchRef = useRef(null);

  const totalItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const brands = [
    'Luxura Sciences',
    'Hungama HiLife',
    'AccessHer'
  ];

  const trendingSearches = [
    'Smartwatch',
    'Vitamin C Serum',
    'Wireless Earbuds',
    'Jewellery',
    'Skincare',
    'Home & Kitchen'
  ];

  const quickCategories = useMemo(() => {
    return categories
      .filter((cat) => cat !== 'ALL')
      .slice(0, 8);
  }, [categories]);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const matchingBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(normalizedSearch)
  );

  const matchingCategories = quickCategories.filter((category) =>
    category.toLowerCase().includes(normalizedSearch)
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchPanel(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const goToStore = () => {
    setCurrentTab('store');
    setShowMobileMenu(false);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setCurrentTab('store');
    setShowSearchPanel(false);
    setShowMobileMenu(false);
  };

  const handleTrendingSearch = (value) => {
    setSearchQuery(value);
    setCurrentTab('store');
    setShowSearchPanel(false);
  };

  const handleLocationSubmit = () => {
    if (pincode.trim().length === 6) {
      setDeliveryLocation(pincode.trim());
      setShowLocationPanel(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="bg-[#0b1428] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Brand Certified
            </span>

            <span className="text-slate-500">•</span>

            <span className="hidden sm:inline text-slate-300">
              Free Express Delivery on Orders Over ₹499
            </span>

            <span className="hidden lg:inline text-slate-500">•</span>

            <span className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <Truck className="w-3.5 h-3.5" />
              Pan-India Delivery
            </span>
          </div>

          <button
            onClick={() => setCurrentTab('admin')}
            className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
          >
            <Store className="w-3.5 h-3.5 text-orange-400" />
            Warehouse Operations
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-[76px] flex items-center gap-4">
        <button
          onClick={goToStore}
          className="flex items-center gap-3 shrink-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <Store className="w-5.5 h-5.5" />
          </div>

          <div className="text-left">
            <div className="flex items-center leading-none">
              <span className="text-[25px] font-black tracking-[-1.5px] text-blue-600">
                D2C
              </span>

              <span className="text-[25px] font-black tracking-[-1.5px] text-orange-500">
                MALL
              </span>
            </div>

            <p className="text-[9px] font-bold text-slate-500 tracking-[1.5px] uppercase mt-1">
              Direct-to-Consumer Store
            </p>
          </div>
        </button>

        <div className="hidden lg:flex relative flex-1 max-w-[650px] mx-auto" ref={searchRef}>
          <div
            className={`relative w-full transition ${
              showSearchPanel ? 'z-50' : ''
            }`}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />

            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onFocus={() => setShowSearchPanel(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchPanel(true);
              }}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 text-sm text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {showSearchPanel && (
            <div className="absolute top-[58px] left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
              {!normalizedSearch ? (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-slate-900 text-sm">
                      Trending Searches
                    </h3>

                    <Sparkles className="w-4 h-4 text-orange-500" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleTrendingSearch(item)}
                        className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 text-xs font-semibold text-slate-700 transition"
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
                        Popular Brands
                      </p>

                      <div className="space-y-2">
                        {brands.map((brand) => (
                          <button
                            key={brand}
                            onClick={() => handleTrendingSearch(brand)}
                            className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600"
                          >
                            <BadgeCheck className="w-4 h-4 text-emerald-500" />
                            {brand}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
                        Explore
                      </p>

                      <div className="space-y-2">
                        {quickCategories.slice(0, 5).map((category) => (
                          <button
                            key={category}
                            onClick={() => selectCategory(category)}
                            className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600 capitalize"
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                            {category.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  {matchingBrands.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                        Brands
                      </p>

                      {matchingBrands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => handleTrendingSearch(brand)}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 text-left"
                        >
                          <BadgeCheck className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-semibold text-slate-800">
                            {brand}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {matchingCategories.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                        Categories
                      </p>

                      {matchingCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => selectCategory(category)}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 text-left capitalize"
                        >
                          <Store className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-semibold text-slate-800">
                            {category.replace('-', ' ')}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 mt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setCurrentTab('store');
                        setShowSearchPanel(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-bold"
                    >
                      <span>Search all products</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowLocationPanel(true)}
          className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition shrink-0"
        >
          <MapPin className="w-4 h-4 text-blue-600" />

          <div className="text-left leading-tight">
            <p className="text-[9px] uppercase tracking-wide font-bold text-slate-400">
              Deliver to
            </p>

            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-slate-800">
                {deliveryLocation}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </button>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={goToStore}
            className={`hidden md:block px-4 py-2.5 rounded-xl text-sm font-bold transition ${
              currentTab === 'store'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Shop
          </button>

          <button
            onClick={() => setCurrentTab('franchise')}
            className={`hidden xl:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
              currentTab === 'franchise'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-orange-600 bg-orange-50 hover:bg-orange-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Franchise
          </button>

          <button
            className="hidden lg:flex p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentTab('orders')}
            className={`hidden sm:flex items-center gap-2 px-3 py-2.5 rounded-xl transition ${
              currentTab === 'orders'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Package className="w-5 h-5" />

            <span className="hidden lg:block text-sm font-bold">
              Orders
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('cart')}
            className="relative p-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition"
            title="Shopping cart"
          >
            <ShoppingBag className="w-5 h-5" />

            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-black min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow-md">
                {totalItemCount > 99 ? '99+' : totalItemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowMobileMenu(true)}
            className="md:hidden p-3 rounded-xl bg-slate-100 border border-slate-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="lg:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search products, brands & categories..."
            value={searchQuery}
            onFocus={() => setShowSearchPanel(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchPanel(true);
            }}
            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-7 overflow-x-auto py-3 scrollbar-none">
            <button
              onClick={() => selectCategory('ALL')}
              className={`relative whitespace-nowrap text-sm font-bold pb-1 transition ${
                selectedCategory === 'ALL'
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For You

              {selectedCategory === 'ALL' && (
                <span className="absolute left-0 right-0 -bottom-3 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            {quickCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className={`relative whitespace-nowrap text-sm font-bold pb-1 capitalize transition ${
                  selectedCategory === cat
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.replace('-', ' ')}

                {selectedCategory === cat && (
                  <span className="absolute left-0 right-0 -bottom-3 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}

            <button
              onClick={() => setCurrentTab('franchise')}
              className="hidden lg:flex items-center gap-1.5 ml-auto whitespace-nowrap text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              <Building2 className="w-4 h-4" />
              Franchise Opportunities
            </button>
          </div>
        </div>
      </div>

      {showLocationPanel && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-black text-slate-900">
                    Delivery location
                  </h3>
                </div>

                <p className="text-sm text-slate-500 mt-1">
                  Enter your pincode to check delivery availability.
                </p>
              </div>

              <button
                onClick={() => setShowLocationPanel(false)}
                className="p-2 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="mt-6 flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) =>
                  setPincode(e.target.value.replace(/\D/g, ''))
                }
                placeholder="Enter 6-digit pincode"
                className="flex-1 h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-500"
              />

              <button
                onClick={handleLocationSubmit}
                disabled={pincode.length !== 6}
                className="px-5 h-12 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <Truck className="w-5 h-5 mx-auto text-blue-600" />
                <p className="text-[10px] font-bold text-slate-600 mt-2">
                  Pan-India
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <Clock3 className="w-5 h-5 mx-auto text-orange-500" />
                <p className="text-[10px] font-bold text-slate-600 mt-2">
                  Fast Delivery
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <RotateCcw className="w-5 h-5 mx-auto text-emerald-500" />
                <p className="text-[10px] font-bold text-slate-600 mt-2">
                  Easy Returns
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMobileMenu && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm">
          <div className="absolute right-0 top-0 bottom-0 w-[320px] max-w-[90%] bg-white shadow-2xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-7">
              <div>
                <p className="text-lg font-black text-slate-900">
                  D2C MALL
                </p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Your shopping destination
                </p>
              </div>

              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={goToStore}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm"
              >
                <Store className="w-5 h-5" />
                Shop
              </button>

              <button
                onClick={() => {
                  setCurrentTab('orders');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-sm"
              >
                <Package className="w-5 h-5" />
                My Orders & Returns
              </button>

              <button
                onClick={() => {
                  setCurrentTab('cart');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-sm"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5" />
                  Cart
                </span>

                {totalItemCount > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
                    {totalItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentTab('franchise');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 text-orange-600 font-bold text-sm"
              >
                <Building2 className="w-5 h-5" />
                Franchise Opportunities
              </button>
            </div>

            <div className="border-t border-slate-100 my-6" />

            <p className="text-[10px] uppercase tracking-wider font-black text-slate-400 mb-3">
              Shop Categories
            </p>

            <div className="space-y-1">
              <button
                onClick={() => selectCategory('ALL')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                All Products
              </button>

              {quickCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => selectCategory(category)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 capitalize"
                >
                  {category.replace('-', ' ')}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-100 my-6" />

            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <Headphones className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Customer Support
                  </p>
                  <p className="text-[11px] text-slate-500">
                    We're here to help
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <BadgeCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Brand Certified
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Genuine products from our brands
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}