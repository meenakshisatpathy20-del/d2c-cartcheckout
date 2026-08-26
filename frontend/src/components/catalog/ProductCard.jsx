import React, { useMemo, useState } from 'react';
import {
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Heart,
  Zap,
  Eye,
  BadgeCheck,
  MapPin,
  PackageCheck,
  Plus,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({
  product,
  onSelectProduct
}) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(
    product.isWishlisted === true
  );
  const [added, setAdded] = useState(false);

  const price = Number(product.price || 0);
  const mrp = Number(product.mrp || 0);
  const stock = Number(product.stock ?? 0);

  const discountPercentage = useMemo(() => {
    if (!mrp || mrp <= price) return 0;
    return Math.round(
      ((mrp - price) / mrp) * 100
    );
  }, [price, mrp]);

  const savings = Math.max(
    0,
    mrp - price
  );

  const isNew =
    product.isNew === true ||
    product.newArrival === true ||
    String(product.badge || '').toLowerCase() ===
      'new';

  const isTrending =
    product.isTrending === true ||
    product.trending === true ||
    String(product.badge || '').toLowerCase() ===
      'trending';

  const isBestSeller =
    product.isBestSeller === true ||
    product.bestSeller === true ||
    String(product.badge || '').toLowerCase() ===
      'bestseller';

  const hasDiscount =
    discountPercentage > 0;

  const estimatedDays =
    Number(product.estimatedDays || 2);

  const brandName =
    product.brand || 'D2C Mall';

  const rating =
    Number(product.rating || 4.5);

  const reviewsCount =
    Number(product.reviewsCount || 0);

  const isLowStock =
    stock > 0 && stock <= 10;

  const isOutOfStock =
    stock === 0 &&
    product.stock !== undefined;

  const handleAddToCart = (event) => {
    event.stopPropagation();

    if (isOutOfStock) return;

    addToCart(product);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  const handleQuickView = (event) => {
    event.stopPropagation();
    onSelectProduct(product);
  };

  const handleWishlist = (event) => {
    event.stopPropagation();
    setIsWishlisted(
      (current) => !current
    );
  };

  return (
    <article className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/[0.07] transition-all duration-300">
      <div className="p-3 pb-0">
        <div
          onClick={() =>
            onSelectProduct(product)
          }
          className="relative h-56 sm:h-60 bg-slate-50 rounded-xl overflow-hidden cursor-pointer border border-slate-100"
        >
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-[80%]">
            {hasDiscount && (
              <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-[9px] font-black uppercase tracking-wide px-2.5 py-1 rounded-md shadow-sm">
                <Zap className="w-3 h-3 fill-current" />
                {discountPercentage}% OFF
              </span>
            )}

            {isBestSeller && (
              <span className="inline-flex items-center gap-1 bg-slate-950 text-white text-[9px] font-black uppercase tracking-wide px-2.5 py-1 rounded-md">
                <Flame className="w-3 h-3 text-orange-400" />
                Bestseller
              </span>
            )}

            {!isBestSeller && isTrending && (
              <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wide px-2.5 py-1 rounded-md">
                <Flame className="w-3 h-3" />
                Trending
              </span>
            )}

            {!isTrending && isNew && (
              <span className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-wide px-2.5 py-1 rounded-md">
                New Arrival
              </span>
            )}
          </div>

          <button
            onClick={handleWishlist}
            aria-label="Add to wishlist"
            className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-sm border flex items-center justify-center transition-all shadow-sm ${
              isWishlisted
                ? 'border-rose-200 text-rose-500 opacity-100'
                : 'border-slate-200 text-slate-500 opacity-100 sm:opacity-0 group-hover:opacity-100 hover:text-rose-500 hover:border-rose-200'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted
                  ? 'fill-current'
                  : ''
              }`}
            />
          </button>

          <button
            onClick={handleQuickView}
            className="absolute right-3 bottom-3 z-20 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-[10px] font-black opacity-0 group-hover:opacity-100 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>

          <img
            src={product.image}
            alt={
              product.name ||
              'D2C Mall product'
            }
            className={`w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-500 ${
              isOutOfStock
                ? 'opacity-50 grayscale'
                : ''
            }`}
            loading="lazy"
          />

          <div className="absolute bottom-3 left-3">
            <span
              className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wide text-white px-2.5 py-1 rounded-md shadow-sm"
              style={{
                backgroundColor:
                  product.brandColor ||
                  '#0f172a'
              }}
            >
              <BadgeCheck className="w-3 h-3" />
              {brandName}
            </span>
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-950/10 flex items-center justify-center">
              <span className="bg-slate-950 text-white px-4 py-2 rounded-lg text-xs font-black">
                Currently Unavailable
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-900 px-2 py-1 rounded-lg shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />

              <span className="text-[10px] font-black">
                {rating.toFixed(1)}
              </span>
            </div>

            {reviewsCount > 0 && (
              <span className="text-[10px] text-slate-400 font-medium truncate">
                {reviewsCount.toLocaleString(
                  'en-IN'
                )} reviews
              </span>
            )}
          </div>

          {!isOutOfStock && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              In stock
            </span>
          )}
        </div>

        <button
          onClick={() =>
            onSelectProduct(product)
          }
          className="block text-left w-full mt-3"
        >
          <h3 className="font-black text-[14px] leading-5 text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </button>

        <div className="mt-2 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />

          <span className="text-[10px] font-semibold text-slate-500 truncate">
            Genuine product from {brandName}
          </span>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
          <Truck className="w-3.5 h-3.5 text-blue-500 shrink-0" />

          <span>
            Delivery in {estimatedDays}{' '}
            business day
            {estimatedDays !== 1
              ? 's'
              : ''}
          </span>
        </div>

        {product.warehouseCity && (
          <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
            <MapPin className="w-3 h-3" />
            Ships from{' '}
            {product.warehouseCity}
          </div>
        )}

        {isLowStock && !isOutOfStock && (
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-orange-600 bg-orange-50 border border-orange-100 rounded-lg px-2.5 py-1.5">
            <Zap className="w-3 h-3 fill-current" />
            Only {stock} left
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xl font-black tracking-tight text-slate-950">
                  ₹
                  {price.toLocaleString(
                    'en-IN'
                  )}
                </span>

                {mrp > price && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹
                    {mrp.toLocaleString(
                      'en-IN'
                    )}
                  </span>
                )}
              </div>

              {hasDiscount ? (
                <p className="text-[10px] text-emerald-600 font-black mt-1">
                  You save ₹
                  {savings.toLocaleString(
                    'en-IN'
                  )}
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">
                  Inclusive of applicable taxes
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`shrink-0 inline-flex items-center justify-center gap-1.5 text-xs font-black px-4 py-2.5 rounded-xl transition-all active:scale-95 ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Added
                </>
              ) : isOutOfStock ? (
                'Unavailable'
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
            <Truck className="w-3 h-3 shrink-0" />
            Pan-India delivery
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
            <ShieldCheck className="w-3 h-3 shrink-0" />
            Brand certified
          </div>
        </div>

        <button
          onClick={handleQuickView}
          className="w-full mt-3 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-blue-600 transition"
        >
          View product details
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </article>
  );
}