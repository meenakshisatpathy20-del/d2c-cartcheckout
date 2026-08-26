import React, { useMemo, useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Zap,
  RotateCcw,
  MapPin,
  Clock3,
  BadgeCheck,
  Package,
  CreditCard,
  Gift,
  Heart,
  Share2,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Tag,
  IndianRupee,
  Headphones,
  Lock,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onBuyNow
}) {
  const { addToCart } = useCart();

  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [loadingPin, setLoadingPin] = useState(false);
  const [pinError, setPinError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copiedOffer, setCopiedOffer] = useState(false);

  if (!isOpen || !product) return null;

  const price = Number(product.price || 0);
  const mrp = Number(product.mrp || 0);

  const discount = useMemo(() => {
    if (!mrp || mrp <= price) return 0;

    return Math.round(
      ((mrp - price) / mrp) * 100
    );
  }, [price, mrp]);

  const savings = Math.max(
    0,
    mrp - price
  );

  const rating = Number(
    product.rating || 4.5
  );

  const reviewsCount = Number(
    product.reviewsCount || 0
  );

  const estimatedDays = Number(
    product.estimatedDays || 2
  );

  const brandName =
    product.brand || 'D2C Mall';

  const maxStock =
    product.stock !== undefined
      ? Math.max(0, Number(product.stock))
      : 99;

  const isOutOfStock =
    product.stock !== undefined &&
    Number(product.stock) <= 0;

  const images = [
    product.image,
    ...(Array.isArray(product.images)
      ? product.images
      : [])
  ].filter(Boolean);

  const activeProductImage =
    images[activeImage] || product.image;

  const handleCheckDelivery = async () => {
    if (
      pincode.length !== 6 ||
      isNaN(pincode)
    ) {
      setPinError(
        'Please enter a valid 6-digit pincode.'
      );
      setDeliveryResult(null);
      return;
    }

    setLoadingPin(true);
    setPinError('');

    try {
      const res =
        await api.checkDelivery(pincode);

      setDeliveryResult(res);
    } catch (err) {
      setPinError(
        err.message ||
          'Unable to check delivery.'
      );
      setDeliveryResult(null);
    } finally {
      setLoadingPin(false);
    }
  };

  const addAndClose = () => {
    if (isOutOfStock) return;

    for (let i = 0; i < quantity; i += 1) {
      addToCart(product);
    }

    onClose();
  };

  const buyNow = () => {
    if (isOutOfStock) return;

    for (let i = 0; i < quantity; i += 1) {
      addToCart(product);
    }

    onClose();

    if (onBuyNow) {
      onBuyNow();
    }
  };

  const increaseQuantity = () => {
    if (
      maxStock > 0 &&
      quantity < maxStock
    ) {
      setQuantity(
        (current) => current + 1
      );
    }
  };

  const decreaseQuantity = () => {
    setQuantity(
      (current) => Math.max(1, current - 1)
    );
  };

  const previousImage = () => {
    setActiveImage(
      (current) =>
        (current - 1 + images.length) %
        images.length
    );
  };

  const nextImage = () => {
    setActiveImage(
      (current) =>
        (current + 1) % images.length
    );
  };

  const copyOffer = () => {
    if (navigator?.clipboard) {
      navigator.clipboard
        .writeText('D2C100')
        .catch(() => {});
    }

    setCopiedOffer(true);

    setTimeout(() => {
      setCopiedOffer(false);
    }, 1800);
  };

  const totalPrice = price * quantity;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-6xl rounded-[26px] shadow-2xl overflow-hidden max-h-[96vh] flex flex-col">
        <div className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 text-blue-600" />
            </div>

            <div>
              <p className="text-xs font-black text-slate-900">
                Verified Marketplace Product
              </p>

              <p className="hidden sm:block text-[10px] text-slate-400">
                Secure shopping on D2C Mall
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setIsWishlisted(
                  (current) => !current
                )
              }
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
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
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="p-4 sm:p-6 lg:p-7 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100">
              <div className="relative bg-white rounded-3xl border border-slate-200 h-[350px] sm:h-[430px] flex items-center justify-center overflow-hidden">
                {discount > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm">
                    {discount}% OFF
                  </div>
                )}

                <div
                  className="absolute top-4 right-4 z-10 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm"
                  style={{
                    backgroundColor:
                      product.brandColor ||
                      '#2563eb'
                  }}
                >
                  {brandName}
                </div>

                <img
                  src={activeProductImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-8 sm:p-10"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {images.map(
                    (image, index) => (
                      <button
                        key={`${image}-${index}`}
                        onClick={() =>
                          setActiveImage(index)
                        }
                        className={`w-16 h-16 rounded-xl bg-white border shrink-0 flex items-center justify-center overflow-hidden ${
                          activeImage === index
                            ? 'border-blue-600 ring-2 ring-blue-100'
                            : 'border-slate-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt=""
                          className="w-full h-full object-contain p-1"
                        />
                      </button>
                    )
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5 mt-5">
                <InfoCard
                  icon={Truck}
                  title="Fast Dispatch"
                  subtitle="1–2 Business Days"
                  color="blue"
                />

                <InfoCard
                  icon={RotateCcw}
                  title="Easy Returns"
                  subtitle="7-Day Pickup"
                  color="orange"
                />

                <InfoCard
                  icon={ShieldCheck}
                  title="Genuine Product"
                  subtitle="Brand Verified"
                  color="emerald"
                />

                <InfoCard
                  icon={Package}
                  title="Secure Packaging"
                  subtitle="Damage Protected"
                  color="violet"
                />
              </div>
            </div>

            <div className="p-5 sm:p-7 lg:p-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      product.brandColor ||
                      '#2563eb'
                  }}
                >
                  {brandName}
                </span>

                <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Brand
                </span>

                {product.category && (
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    {String(
                      product.category
                    ).replace('-', ' ')}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black leading-tight tracking-tight text-slate-950">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />

                  <span className="font-black text-sm">
                    {rating.toFixed(1)}
                  </span>
                </div>

                <span className="text-sm text-slate-500">
                  {reviewsCount > 0
                    ? `${reviewsCount.toLocaleString(
                        'en-IN'
                      )} verified reviews`
                    : 'Customer ratings'}
                </span>

                <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Authentic
                </span>
              </div>

              <div className="border-y border-slate-100 py-5">
                <div className="flex items-end gap-3 flex-wrap">
                  <span className="text-4xl font-black tracking-tight text-slate-950">
                    ₹
                    {price.toLocaleString(
                      'en-IN'
                    )}
                  </span>

                  {mrp > price && (
                    <span className="text-lg line-through text-slate-400">
                      ₹
                      {mrp.toLocaleString(
                        'en-IN'
                      )}
                    </span>
                  )}

                  {discount > 0 && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-black">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {savings > 0 && (
                    <span className="text-xs text-emerald-700 font-black">
                      You save ₹
                      {savings.toLocaleString(
                        'en-IN'
                      )}
                    </span>
                  )}

                  <span className="text-xs text-slate-500">
                    Inclusive of applicable taxes
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4 text-orange-500" />
                    </div>

                    <div>
                      <p className="text-xs font-black text-slate-900">
                        Extra savings available
                      </p>

                      <p className="text-[11px] text-slate-600 mt-1">
                        Apply D2C100 for ₹100 off eligible orders above ₹999.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={copyOffer}
                    className="shrink-0 bg-white border border-orange-200 text-orange-600 px-3 py-1.5 rounded-lg text-[10px] font-black"
                  >
                    {copiedOffer
                      ? 'Copied'
                      : 'D2C100'}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-black text-slate-900 mb-2">
                  Product Overview
                </h3>

                <p className="text-sm leading-7 text-slate-600">
                  {product.description ||
                    'A carefully selected product from our verified D2C brand network.'}
                </p>
              </div>

              <div>
                <h3 className="font-black text-slate-900 mb-3">
                  Why you’ll love it
                </h3>

                <div className="grid sm:grid-cols-2 gap-2.5">
                  <Highlight text="100% genuine product sourced from the brand" />
                  <Highlight text="Quality checked before dispatch" />
                  <Highlight text="Pan-India delivery through logistics partners" />
                  <Highlight text="Secure payment and return support" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />

                    <h3 className="font-black text-slate-900 text-sm">
                      Check delivery availability
                    </h3>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400">
                    Free to check
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) =>
                      setPincode(
                        e.target.value.replace(
                          /\D/g,
                          ''
                        )
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter'
                      ) {
                        handleCheckDelivery();
                      }
                    }}
                    placeholder="Enter 6-digit pincode"
                    className="flex-1 h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-500 text-sm"
                  />

                  <button
                    onClick={
                      handleCheckDelivery
                    }
                    disabled={loadingPin}
                    className="px-5 rounded-xl bg-slate-950 text-white text-sm font-black hover:bg-slate-800 disabled:opacity-60"
                  >
                    {loadingPin
                      ? 'Checking...'
                      : 'Check'}
                  </button>
                </div>

                {pinError && (
                  <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {pinError}
                  </div>
                )}

                {deliveryResult && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                    <div className="flex items-center gap-2 text-emerald-700 font-black text-sm">
                      <Truck className="w-4 h-4" />
                      Delivery Available
                    </div>

                    <p className="text-xs text-emerald-700 mt-1">
                      Estimated delivery in{' '}
                      <strong>
                        {
                          deliveryResult.estimatedDays
                        }{' '}
                        day(s)
                      </strong>{' '}
                      via{' '}
                      <strong>
                        {
                          deliveryResult.courierPartner
                        }
                      </strong>
                    </p>
                  </div>
                )}

                {!deliveryResult &&
                  !pinError && (
                    <p className="text-[10px] text-slate-400">
                      Enter your pincode to see delivery availability and estimated arrival.
                    </p>
                  )}
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="w-4 h-4 text-orange-500" />

                  <span className="font-black text-slate-900 text-sm">
                    Purchase Confidence
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <TrustRow
                    icon={ShieldCheck}
                    text="100% Authentic Brand Product"
                  />

                  <TrustRow
                    icon={RotateCcw}
                    text="7-Day Easy Return Policy"
                  />

                  <TrustRow
                    icon={CreditCard}
                    text="Secure Payments & GST Invoice"
                  />

                  <TrustRow
                    icon={Clock3}
                    text="Order Tracking After Dispatch"
                  />

                  <TrustRow
                    icon={Headphones}
                    text="Customer Support Assistance"
                  />

                  <TrustRow
                    icon={Lock}
                    text="Protected Checkout"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-3.5">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-black text-slate-400">
                    Quantity
                  </p>

                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={
                        decreaseQuantity
                      }
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span className="w-8 text-center text-sm font-black">
                      {quantity}
                    </span>

                    <button
                      onClick={
                        increaseQuantity
                      }
                      disabled={
                        maxStock > 0 &&
                        quantity >= maxStock
                      }
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider font-black text-slate-400">
                    Total
                  </p>

                  <p className="text-lg font-black text-slate-950 mt-1">
                    ₹
                    {totalPrice.toLocaleString(
                      'en-IN'
                    )}
                  </p>
                </div>
              </div>

              {maxStock > 0 &&
                maxStock <= 10 && (
                  <div className="flex items-center gap-2 text-orange-600 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2.5 text-xs font-black">
                    <Zap className="w-4 h-4 fill-current" />
                    Only {maxStock} units available
                  </div>
                )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={addAndClose}
                  disabled={isOutOfStock}
                  className="h-12 rounded-xl border-2 border-slate-950 text-slate-950 font-black hover:bg-slate-950 hover:text-white transition flex items-center justify-center gap-2 disabled:border-slate-200 disabled:text-slate-400 disabled:bg-slate-50"
                >
                  <ShoppingBag className="w-4 h-4" />

                  {isOutOfStock
                    ? 'Unavailable'
                    : 'Add to Cart'}
                </button>

                <button
                  onClick={buyNow}
                  disabled={isOutOfStock}
                  className="h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Buy Now
                </button>
              </div>

              <div className="flex items-center justify-center gap-5 text-[10px] text-slate-400 font-semibold pt-1">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Secure checkout
                </span>

                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  Trackable delivery
                </span>

                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Verified brand
                </span>
              </div>

              <p className="text-[10px] text-center text-slate-400 leading-5">
                By placing your order, you agree to D2C Mall's return, shipping and marketplace policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Highlight({ text }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
      <span className="text-xs text-slate-600 leading-5">
        {text}
      </span>
    </div>
  );
}

function TrustRow({
  icon: Icon,
  text
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-700">
      <Icon className="w-4 h-4 text-blue-600 shrink-0" />
      <span>{text}</span>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  subtitle,
  color
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    orange:
      'bg-orange-50 text-orange-600',
    emerald:
      'bg-emerald-50 text-emerald-600',
    violet:
      'bg-violet-50 text-violet-600'
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <p className="font-black text-xs text-slate-900 mt-2">
        {title}
      </p>

      <p className="text-[10px] text-slate-500 mt-1">
        {subtitle}
      </p>
    </div>
  );
}