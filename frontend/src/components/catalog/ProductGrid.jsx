import React, { useMemo, useState } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Tag,
  Clock3,
  Grid3X3,
  List,
  ArrowRight,
  X,
  Flame,
  BadgePercent,
  IndianRupee,
  PackageCheck,
  Heart,
  Search,
  RotateCcw
} from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products = [],
  onSelectProduct,
  searchQuery = ''
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [activeView, setActiveView] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState('ALL');
  const [wishlistOnly, setWishlistOnly] = useState(false);

  const categories = useMemo(() => {
    return [
      'ALL',
      ...new Set(
        products
          .map((p) => p.category || 'general')
          .filter(Boolean)
      )
    ];
  }, [products]);

  const brands = useMemo(() => {
    return [
      'ALL',
      ...new Set(
        products
          .map((p) => p.brand)
          .filter(Boolean)
      )
    ];
  }, [products]);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'ALL' ||
        p.category === selectedCategory;

      const matchesBrand =
        selectedBrand === 'ALL' ||
        p.brand === selectedBrand;

      const matchesSearch =
        !normalizedSearch ||
        String(p.name || '').toLowerCase().includes(normalizedSearch) ||
        String(p.brand || '').toLowerCase().includes(normalizedSearch) ||
        String(p.category || '').toLowerCase().includes(normalizedSearch) ||
        String(p.description || '').toLowerCase().includes(normalizedSearch);

      const price = Number(p.price || 0);

      const matchesPrice =
        priceRange === 'ALL' ||
        (priceRange === 'UNDER500' && price < 500) ||
        (priceRange === '500_1000' && price >= 500 && price <= 1000) ||
        (priceRange === '1000_2500' && price > 1000 && price <= 2500) ||
        (priceRange === 'ABOVE2500' && price > 2500);

      return (
        matchesCategory &&
        matchesBrand &&
        matchesSearch &&
        matchesPrice
      );
    });

    if (activeView === 'DEALS') {
      result = result.filter((p) => {
        const discount =
          Number(p.discountPercent) ||
          Number(p.discount) ||
          (Number(p.mrp) > Number(p.price)
            ? ((Number(p.mrp) - Number(p.price)) / Number(p.mrp)) * 100
            : 0);

        return discount >= 10;
      });
    }

    if (activeView === 'NEW') {
      result = result.filter(
        (p) =>
          p.isNew === true ||
          p.newArrival === true ||
          String(p.badge || '').toLowerCase() === 'new'
      );
    }

    if (activeView === 'TRENDING') {
      result = result.filter(
        (p) =>
          p.isTrending === true ||
          p.trending === true ||
          String(p.badge || '').toLowerCase() === 'trending' ||
          Number(p.reviewsCount || 0) >= 50
      );
    }

    if (activeView === 'BESTSELLERS') {
      result = result.filter(
        (p) =>
          p.isBestSeller === true ||
          p.bestSeller === true ||
          String(p.badge || '').toLowerCase() === 'bestseller' ||
          Number(p.reviewsCount || 0) >= 100
      );
    }

    if (wishlistOnly) {
      result = result.filter((p) => p.isWishlisted === true);
    }

    const sorted = [...result];

    if (sortBy === 'price-low') {
      sorted.sort(
        (a, b) =>
          Number(a.price || 0) - Number(b.price || 0)
      );
    }

    if (sortBy === 'price-high') {
      sorted.sort(
        (a, b) =>
          Number(b.price || 0) - Number(a.price || 0)
      );
    }

    if (sortBy === 'discount') {
      sorted.sort((a, b) => {
        const discountA =
          Number(a.discountPercent) ||
          Number(a.discount) ||
          0;

        const discountB =
          Number(b.discountPercent) ||
          Number(b.discount) ||
          0;

        return discountB - discountA;
      });
    }

    if (sortBy === 'rating') {
      sorted.sort(
        (a, b) =>
          Number(b.rating || 0) - Number(a.rating || 0)
      );
    }

    if (sortBy === 'popular') {
      sorted.sort(
        (a, b) =>
          Number(b.reviewsCount || 0) -
          Number(a.reviewsCount || 0)
      );
    }

    if (sortBy === 'name') {
      sorted.sort((a, b) =>
        String(a.name || '').localeCompare(
          String(b.name || '')
        )
      );
    }

    return sorted;
  }, [
    products,
    selectedCategory,
    selectedBrand,
    normalizedSearch,
    activeView,
    sortBy,
    priceRange,
    wishlistOnly
  ]);

  const clearFilters = () => {
    setSelectedCategory('ALL');
    setSelectedBrand('ALL');
    setActiveView('ALL');
    setSortBy('featured');
    setPriceRange('ALL');
    setWishlistOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'ALL' ||
    selectedBrand !== 'ALL' ||
    activeView !== 'ALL' ||
    sortBy !== 'featured' ||
    priceRange !== 'ALL' ||
    wishlistOnly;

  const activeFilterCount = [
    selectedCategory !== 'ALL',
    selectedBrand !== 'ALL',
    activeView !== 'ALL',
    sortBy !== 'featured',
    priceRange !== 'ALL',
    wishlistOnly
  ].filter(Boolean).length;

  return (
    <section className="space-y-7">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>

            <span className="text-[10px] uppercase tracking-[1.5px] font-black text-blue-600">
              D2C Mall Marketplace
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
            Discover products you’ll love
          </h2>

          <p className="text-sm text-slate-500 mt-2 max-w-2xl">
            Shop verified Indian D2C brands across electronics,
            beauty, fashion, jewellery and lifestyle categories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters

            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-9 py-2.5 text-xs font-bold text-slate-700 outline-none hover:border-slate-300 cursor-pointer"
            >
              <option value="featured">Recommended</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
              <option value="name">Name</option>
            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-slate-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <DiscoveryTab
          active={activeView === 'ALL'}
          icon={Sparkles}
          label="For You"
          onClick={() => setActiveView('ALL')}
        />

        <DiscoveryTab
          active={activeView === 'TRENDING'}
          icon={TrendingUp}
          label="Trending"
          onClick={() => setActiveView('TRENDING')}
        />

        <DiscoveryTab
          active={activeView === 'DEALS'}
          icon={BadgePercent}
          label="Best Deals"
          onClick={() => setActiveView('DEALS')}
        />

        <DiscoveryTab
          active={activeView === 'NEW'}
          icon={Clock3}
          label="New Arrivals"
          onClick={() => setActiveView('NEW')}
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setActiveView('BESTSELLERS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black whitespace-nowrap border transition ${
            activeView === 'BESTSELLERS'
              ? 'bg-orange-500 border-orange-500 text-white'
              : 'bg-white border-slate-200 text-slate-600 hover:border-orange-200 hover:text-orange-600'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Best Sellers
        </button>

        <button
          onClick={() => setSortBy('rating')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black whitespace-nowrap border border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:text-amber-600 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Top Rated
        </button>

        <button
          onClick={() => setPriceRange('UNDER500')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black whitespace-nowrap border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-600 transition"
        >
          <IndianRupee className="w-3.5 h-3.5" />
          Under ₹500
        </button>

        <button
          onClick={() => setWishlistOnly(!wishlistOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black whitespace-nowrap border transition ${
            wishlistOnly
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-white border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-600'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          Wishlist
        </button>
      </div>

      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-black text-slate-900">
                Refine your shopping
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Narrow down the marketplace to find exactly what you need.
              </p>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <FilterGroup title="Category">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() =>
                      setSelectedCategory(category)
                    }
                    className={`px-3 py-2 rounded-lg text-[11px] font-bold capitalize border transition ${
                      selectedCategory === category
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {category === 'ALL'
                      ? 'All Categories'
                      : String(category).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Brand">
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() =>
                      setSelectedBrand(brand)
                    }
                    className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition ${
                      selectedBrand === brand
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600'
                    }`}
                  >
                    {brand === 'ALL'
                      ? 'All Brands'
                      : brand}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Price">
              <div className="flex flex-wrap gap-2">
                {[
                  ['ALL', 'Any Price'],
                  ['UNDER500', 'Under ₹500'],
                  ['500_1000', '₹500–₹1,000'],
                  ['1000_2500', '₹1,000–₹2,500'],
                  ['ABOVE2500', '₹2,500+']
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setPriceRange(value)}
                    className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition ${
                      priceRange === value
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-200 hover:text-emerald-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </FilterGroup>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          {normalizedSearch ? (
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />

              <p className="text-sm text-slate-600">
                Results for{' '}
                <span className="font-black text-slate-900">
                  "{searchQuery}"
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              <span className="font-black text-slate-900">
                {filteredProducts.length}
              </span>{' '}
              products ready to explore
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedCategory !== 'ALL' && (
            <FilterBadge
              label={String(selectedCategory).replace('-', ' ')}
              onRemove={() =>
                setSelectedCategory('ALL')
              }
            />
          )}

          {selectedBrand !== 'ALL' && (
            <FilterBadge
              label={selectedBrand}
              onRemove={() =>
                setSelectedBrand('ALL')
              }
            />
          )}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          searchQuery={searchQuery}
          hasActiveFilters={hasActiveFilters}
          onReset={clearFilters}
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
              : 'grid grid-cols-1 md:grid-cols-2 gap-4'
          }
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}

      {filteredProducts.length > 0 &&
        !normalizedSearch && (
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 text-white p-6 sm:p-8">
            <div className="absolute right-0 top-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute left-1/3 bottom-0 w-52 h-52 bg-indigo-600/10 rounded-full blur-3xl" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-emerald-400" />

                  <p className="text-[10px] uppercase tracking-[1.5px] font-black text-blue-400">
                    D2C Mall Discovery
                  </p>
                </div>

                <h3 className="text-xl sm:text-2xl font-black mt-2">
                  More brands. More choice. One marketplace.
                </h3>

                <p className="text-sm text-slate-400 mt-2 max-w-xl leading-6">
                  Explore electronics, beauty, fashion, jewellery and lifestyle products from a growing network of Indian D2C brands.
                </p>
              </div>

              <button
                onClick={clearFilters}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-950 text-xs font-black hover:bg-slate-100 transition"
              >
                Explore everything
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
    </section>
  );
}

function DiscoveryTab({
  active,
  icon: Icon,
  label,
  onClick
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border transition ${
        active
          ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider font-black text-slate-400 mb-3">
        {title}
      </p>

      {children}
    </div>
  );
}

function FilterBadge({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-[11px] font-bold">
      {label}

      <button
        onClick={onRemove}
        className="hover:text-blue-900"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function EmptyState({
  searchQuery,
  hasActiveFilters,
  onReset
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl px-6 py-16 text-center">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
        <SlidersHorizontal className="w-6 h-6 text-slate-400" />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-900">
        No products found
      </h3>

      <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
        {searchQuery
          ? `We couldn't find products matching "${searchQuery}". Try another search or explore our categories.`
          : 'Try changing your filters or explore another collection.'}
      </p>

      {(hasActiveFilters || searchQuery) && (
        <button
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset discovery
        </button>
      )}
    </div>
  );
}