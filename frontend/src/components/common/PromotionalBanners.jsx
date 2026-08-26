import React, { useEffect, useMemo, useState } from 'react';
import {
  Copy,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Clock3,
  Sparkles,
  ArrowRight,
  Tag,
  Zap,
  MapPin,
  BadgeCheck,
  ShoppingBag,
  Store,
  Percent,
  ChevronLeft,
  ChevronRight,
  Star,
  IndianRupee,
  PackageCheck,
  HeartHandshake
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function PromotionalBanners() {
  const { setAppliedCoupon, subtotal } = useCart();

  const [copiedCode, setCopiedCode] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroSlides = useMemo(
    () => [
      {
        title: 'India’s Multi-Brand D2C Marketplace',
        subtitle:
          'Discover beauty, smart electronics, fashion, jewellery and everyday lifestyle products from emerging Indian brands.',
        badge: 'DISCOVER D2C',
        code: 'FESTIVE20',
        cta: 'Get 20% Off',
        offerText: '20% OFF',
        offerSubtext: 'On orders above ₹1,999',
        discountAmount: Math.round(subtotal * 0.2) || 200,
        gradient: 'from-slate-950 via-blue-950 to-indigo-900',
        icon: Sparkles,
        metric: '21+',
        metricLabel: 'Product Categories'
      },
      {
        title: 'Shop Indian Brands. Delivered Across India.',
        subtitle:
          'One marketplace for trusted D2C brands with organized fulfillment and delivery to serviceable pincodes.',
        badge: 'PAN-INDIA SHOPPING',
        code: 'FREESHIP',
        cta: 'Unlock Free Delivery',
        offerText: 'FREE',
        offerSubtext: 'Delivery on orders above ₹499',
        discountAmount: 50,
        gradient: 'from-orange-600 via-orange-500 to-amber-500',
        icon: Truck,
        metric: '29K+',
        metricLabel: 'Serviceable Pincodes'
      },
      {
        title: 'Your First D2C Mall Order',
        subtitle:
          'Start exploring a growing ecosystem of Indian brands with a special welcome offer on your first basket.',
        badge: 'WELCOME OFFER',
        code: 'D2C100',
        cta: 'Claim ₹100 Off',
        offerText: '₹100 OFF',
        offerSubtext: 'On orders above ₹999',
        discountAmount: 100,
        gradient: 'from-emerald-700 via-teal-700 to-emerald-800',
        icon: BadgeCheck,
        metric: '100%',
        metricLabel: 'Brand-Certified Products'
      }
    ],
    [subtotal]
  );

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveSlide(
        (prev) => (prev + 1) % heroSlides.length
      );
    }, 6500);

    return () => clearInterval(timer);
  }, [heroSlides.length, isPaused]);

  const slide = heroSlides[activeSlide];
  const SlideIcon = slide.icon;

  const handleApplyCoupon = (currentSlide) => {
    if (navigator?.clipboard) {
      navigator.clipboard
        .writeText(currentSlide.code)
        .catch(() => {});
    }

    setCopiedCode(currentSlide.code);

    setAppliedCoupon({
      code: currentSlide.code,
      discountAmount: currentSlide.discountAmount
    });

    setTimeout(() => {
      setCopiedCode('');
    }, 2500);
  };

  const goNext = () => {
    setActiveSlide(
      (prev) => (prev + 1) % heroSlides.length
    );
  };

  const goPrevious = () => {
    setActiveSlide(
      (prev) =>
        (prev - 1 + heroSlides.length) %
        heroSlides.length
    );
  };

  return (
    <section className="space-y-6">
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${slide.gradient} text-white shadow-xl shadow-slate-900/10 min-h-[390px]`}
      >
        <div className="absolute -right-32 -top-32 w-[420px] h-[420px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-40 -bottom-40 w-[500px] h-[500px] rounded-full bg-black/20 blur-3xl" />

        <div className="absolute right-8 top-8 hidden xl:grid grid-cols-2 gap-2 opacity-60">
          <div className="w-20 h-20 rounded-2xl border border-white/10 bg-white/5" />
          <div className="w-20 h-20 rounded-2xl border border-white/10 bg-white/5 mt-8" />
          <div className="w-20 h-20 rounded-2xl border border-white/10 bg-white/5 -mt-8" />
          <div className="w-20 h-20 rounded-2xl border border-white/10 bg-white/5" />
        </div>

        <div className="relative z-10 grid lg:grid-cols-[1.4fr_0.6fr] min-h-[390px]">
          <div className="p-7 sm:p-9 lg:p-11 flex flex-col justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  {slide.badge}
                </span>

                <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">
                  D2C Mall
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-[-1.8px] leading-[1.04] max-w-2xl">
                {slide.title}
              </h1>

              <p className="mt-5 text-sm sm:text-base text-white/80 leading-7 max-w-xl">
                {slide.subtitle}
              </p>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-7 max-w-xl">
                <HeroMetric
                  icon={ShoppingBag}
                  value={slide.metric}
                  label={slide.metricLabel}
                />

                <HeroMetric
                  icon={Store}
                  value="3"
                  label="Flagship Brands"
                />

                <HeroMetric
                  icon={MapPin}
                  value="PAN"
                  label="India Network"
                />
              </div>
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() =>
                    handleApplyCoupon(slide)
                  }
                  className="group inline-flex items-center gap-2 bg-white text-slate-950 px-5 py-3.5 rounded-xl text-sm font-black shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition"
                >
                  {copiedCode === slide.code ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Tag className="w-4 h-4" />
                  )}

                  <span>
                    {copiedCode === slide.code
                      ? 'Offer Applied'
                      : slide.cta}
                  </span>

                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </button>

                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="text-white/50">
                    Code
                  </span>

                  <span className="px-3 py-2 rounded-lg bg-black/20 border border-white/15 font-mono text-amber-200">
                    {slide.code}
                  </span>

                  {copiedCode === slide.code && (
                    <span className="text-emerald-200">
                      Copied
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-[11px] font-semibold text-white/65">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  Verified brands
                </span>

                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4" />
                  Pan-India fulfillment
                </span>

                <span className="flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4" />
                  Customer-first support
                </span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:flex items-center justify-center p-8">
            <div className="absolute inset-y-8 left-0 w-px bg-white/10" />

            <div className="relative w-full max-w-[300px]">
              <div className="absolute -top-10 -right-5 text-[100px] font-black text-white/5 leading-none select-none">
                D2C
              </div>

              <div className="relative rounded-[28px] border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-[1.5px] font-black text-white/50">
                      Featured campaign
                    </span>

                    <p className="text-xs font-bold text-white/80 mt-1">
                      Limited-time benefit
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                    <SlideIcon className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-4xl font-black tracking-tight">
                    {slide.offerText}
                  </p>

                  <p className="text-sm text-white/65 mt-2 leading-5">
                    {slide.offerSubtext}
                  </p>
                </div>

                <div className="mt-7 pt-5 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/75">
                    <Zap className="w-4 h-4 text-amber-300" />
                    Limited campaign availability
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[10px] text-white/45">
                    <span>Offer progress</span>
                    <span>72%</span>
                  </div>

                  <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[72%] rounded-full bg-white/70" />
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-6 bg-white text-slate-900 rounded-2xl px-4 py-3 shadow-xl border border-white/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-[8px] uppercase tracking-wide font-black text-slate-400">
                      Shopping destination
                    </p>

                    <p className="text-xs font-black">
                      Across India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={goPrevious}
          aria-label="Previous promotion"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/15 border border-white/10 text-white/70 hover:bg-white/15 hover:text-white hidden sm:flex items-center justify-center transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={goNext}
          aria-label="Next promotion"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/15 border border-white/10 text-white/70 hover:bg-white/15 hover:text-white hidden sm:flex items-center justify-center transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() =>
                setActiveSlide(index)
              }
              aria-label={`Go to promotion ${
                index + 1
              }`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeSlide === index
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm">
        <TrustItem
          icon={Truck}
          iconClass="bg-blue-50 text-blue-600"
          title="Pan-India Delivery"
          subtitle="Reliable fulfillment across serviceable pincodes"
        />

        <TrustItem
          icon={ShieldCheck}
          iconClass="bg-emerald-50 text-emerald-600"
          title="Verified Brands"
          subtitle="Genuine products from certified brand partners"
        />

        <TrustItem
          icon={RotateCcw}
          iconClass="bg-orange-50 text-orange-600"
          title="Easy Returns"
          subtitle="Simple return and doorstep pickup process"
        />

        <TrustItem
          icon={PackageCheck}
          iconClass="bg-violet-50 text-violet-600"
          title="Tracked Orders"
          subtitle="Follow every shipment from dispatch to delivery"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickFeature
          icon={Star}
          title="Curated Indian Brands"
          subtitle="Discover emerging D2C businesses"
        />

        <QuickFeature
          icon={Percent}
          title="Multi-Brand Savings"
          subtitle="Offers across your shopping basket"
        />

        <QuickFeature
          icon={IndianRupee}
          title="Value-First Shopping"
          subtitle="Competitive prices without compromising trust"
        />
      </div>

      <div className="hidden sm:flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>

          <p className="text-xs text-slate-500">
            One marketplace connecting customers with a growing ecosystem of Indian D2C brands.
          </p>
        </div>

        <button
          onClick={goNext}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
        >
          Explore offers
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}

function HeroMetric({
  icon: Icon,
  value,
  label
}) {
  return (
    <div className="bg-white/8 border border-white/10 rounded-xl px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-white/60" />
        <span className="text-sm font-black">
          {value}
        </span>
      </div>

      <p className="text-[9px] text-white/50 font-bold mt-1 truncate">
        {label}
      </p>
    </div>
  );
}

function TrustItem({
  icon: Icon,
  iconClass,
  title,
  subtitle
}) {
  return (
    <div className="bg-white p-4 sm:p-5 flex items-center gap-3 sm:gap-4 min-h-[86px]">
      <div
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-black text-slate-900">
          {title}
        </p>

        <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 leading-4">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function QuickFeature({
  icon: Icon,
  title,
  subtitle
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 hover:border-slate-300 hover:shadow-sm transition">
      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-black text-slate-900">
          {title}
        </p>

        <p className="text-[10px] text-slate-500 mt-1 truncate">
          {subtitle}
        </p>
      </div>
    </div>
  );
}