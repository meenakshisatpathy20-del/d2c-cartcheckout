import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Search,
  Flame,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  User,
  Menu,
  Star,
  ArrowRight,
  Clock3,
  Sparkles,
  Percent,
} from "lucide-react";

const heroSlides = [
  {
    eyebrow: "INDIA'S FAVOURITE LIFESTYLE DESTINATION",
    title: "BIG BRAND",
    script: "Special",
    subtitle: "DAYS",
    offer: "70%",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1600&q=90",
  },
  {
    eyebrow: "FRESH STYLES FOR EVERY MOOD",
    title: "FASHION",
    script: "Fest",
    subtitle: "EDIT",
    offer: "60%",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=90",
  },
  {
    eyebrow: "BEAUTY THAT SELLS OUT FAST",
    title: "BEAUTY",
    script: "Best",
    subtitle: "SELLERS",
    offer: "50%",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=90",
  },
];

const stories = [
  {
    name: "New Arrivals",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80",
  },
  {
    name: "Trending",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&q=80",
  },
  {
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80",
  },
  {
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&q=80",
  },
  {
    name: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=300&q=80",
  },
  {
    name: "Deals",
    sale: true,
    image:
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=300&q=80",
  },
  {
    name: "Gen-Z",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80",
  },
  {
    name: "Under ₹999",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80",
  },
];

const trending = [
  {
    name: "Summer Vibes",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&q=85",
  },
  {
    name: "Street Style",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&q=85",
  },
  {
    name: "Ethnic Wear",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=85",
  },
  {
    name: "Casual Looks",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&q=85",
  },
  {
    name: "Beauty Edit",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&q=85",
  },
  {
    name: "Footwear Faves",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=85",
  },
];

const ootd = [
  {
    handle: "@thatbohogirl",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&q=85",
  },
  {
    handle: "@urbanfits.in",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&q=85",
  },
  {
    handle: "@minimalmoves",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&q=85",
  },
];

const brands = [
  "NIKE",
  "adidas",
  "PUMA",
  "ZARA",
  "boAt",
  "H&M",
  "LAKMÉ",
  "mamaearth",
];

const trendStyles = [
  {
    name: "Y2K",
    emoji: "💿",
    className: "from-pink-500 to-purple-600",
  },
  {
    name: "Streetwear",
    emoji: "🧢",
    className: "from-blue-700 to-cyan-500",
  },
  {
    name: "Clean Girl",
    emoji: "✨",
    className: "from-green-500 to-lime-400",
  },
  {
    name: "Coquette",
    emoji: "🎀",
    className: "from-rose-500 to-pink-300",
  },
  {
    name: "Desi Core",
    emoji: "🌼",
    className: "from-orange-500 to-yellow-400",
  },
  {
    name: "Sneaker Fits",
    emoji: "👟",
    className: "from-slate-950 to-blue-700",
  },
];

function Countdown({ compact = false }) {
  const [time, setTime] = useState(
    compact
      ? 4 * 3600 + 32 * 60 + 18
      : 1 * 3600 + 24 * 60 + 38
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((current) => {
        if (current <= 0) {
          return compact
            ? 4 * 3600 + 32 * 60 + 18
            : 1 * 3600 + 24 * 60 + 38;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [compact]);

  const hours = String(Math.floor(time / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-1">
      {[hours, minutes, seconds].map((value, index) => (
        <React.Fragment key={index}>
          <span
            className={`bg-white text-blue-950 rounded-md font-black tabular-nums ${
              compact
                ? "px-1.5 py-1 text-[9px]"
                : "px-2 py-1.5 text-xs"
            }`}
          >
            {value}
          </span>

          {index < 2 && (
            <span className="font-black text-white">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
  onViewAll,
  orange = false,
}) {
  return (
    <div className="flex items-end justify-between gap-3 mb-3">
      <div>
        <div className="flex items-center gap-2">
          <div
            className={`w-1 h-5 rounded-full ${
              orange ? "bg-orange-500" : "bg-blue-900"
            }`}
          />

          <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-950">
            {title}
          </h2>
        </div>

        {subtitle && (
          <p className="text-[9px] sm:text-[10px] text-slate-500 ml-3 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {onViewAll && (
        <button
          type="button"
          onClick={onViewAll}
          className="text-[9px] sm:text-[10px] font-black text-orange-600 whitespace-nowrap"
        >
          View All →
        </button>
      )}
    </div>
  );
}

export default function HomeExperience({
  products = [],
  onProductClick,
  onAddToCart,
  onWishlist,
  onCategoryClick,
}) {
  const [heroIndex, setHeroIndex] = useState(0);

  const saleProducts = useMemo(() => {
    return products
      .filter((product) => product?.price)
      .slice(0, 4);
  }, [products]);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(
        (current) => (current + 1) % heroSlides.length
      );
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  const hero = heroSlides[heroIndex];

  const discount = (product) => {
    if (!product?.mrp || !product?.price) return 30;

    return Math.max(
      1,
      Math.round(
        ((product.mrp - product.price) / product.mrp) * 100
      )
    );
  };

  return (
    <div className="bg-white text-slate-950">
      {/* =====================================================
          TOP PROMOTIONAL BAR
      ====================================================== */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-blue-950 text-white">
        <div className="max-w-[1450px] mx-auto px-3 sm:px-5 h-8 sm:h-9 flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <Flame className="w-3 h-3 fill-yellow-300 text-yellow-300" />

            <span className="text-[8px] sm:text-[9px] font-black">
              MEGA SALE
            </span>
          </div>

          <p className="hidden sm:block text-[8px] font-bold whitespace-nowrap">
            Up to 70% Off on 2,000+ Top Brands
          </p>

          <p className="hidden md:block text-[8px] font-bold whitespace-nowrap">
            Limited Time Only!
          </p>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden sm:block text-[7px] font-bold">
              Ends in
            </span>

            <Countdown compact />

            <button
              type="button"
              onClick={() =>
                onCategoryClick?.("Deals")
              }
              className="hidden sm:flex items-center gap-1 bg-yellow-400 text-blue-950 rounded-full px-3 py-1 text-[7px] font-black"
            >
              SHOP NOW
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          STORE HEADER
      ====================================================== */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-[1450px] mx-auto px-3 sm:px-5 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden w-8 h-8 rounded-lg bg-blue-950 text-white flex items-center justify-center"
            >
              <Menu className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                onCategoryClick?.("Home")
              }
              className="shrink-0 text-left"
            >
              <div className="flex items-center">
                <span className="text-2xl sm:text-3xl font-black tracking-[-0.08em] text-orange-600">
                  D2C
                </span>

                <span className="text-2xl sm:text-3xl font-black tracking-[-0.08em] text-green-600">
                  M
                </span>

                <span className="text-2xl sm:text-3xl font-black tracking-[-0.08em] text-blue-900">
                  ALL
                </span>
              </div>

              <p className="text-[6px] text-center font-black tracking-[0.16em] text-slate-700">
                ONE STOP LIFESTYLE SHOP
              </p>
            </button>

            <div className="flex-1 max-w-2xl mx-auto">
              <div className="h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center px-4">
                <Search className="w-4 h-4 text-slate-500 shrink-0" />

                <input
                  className="w-full bg-transparent outline-none px-3 text-xs text-slate-700 placeholder:text-slate-400"
                  placeholder="Search for products, brands and more..."
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      event.currentTarget.value.trim()
                    ) {
                      onCategoryClick?.(
                        event.currentTarget.value.trim()
                      );
                    }
                  }}
                />
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => onWishlist?.()}
                className="flex items-center gap-1.5 text-[9px] font-black text-slate-800"
              >
                <Heart className="w-4 h-4" />
                Wishlist
              </button>

              <button
                type="button"
                className="relative flex items-center gap-1.5 text-[9px] font-black text-slate-800"
              >
                <ShoppingBag className="w-4 h-4" />

                Cart

                <span className="absolute -top-2 -right-3 w-4 h-4 rounded-full bg-red-500 text-white text-[7px] flex items-center justify-center">
                  3
                </span>
              </button>

              <button
                type="button"
                className="flex items-center gap-1.5 text-[9px] font-black text-slate-800"
              >
                <User className="w-4 h-4" />

                <span>
                  Hello, User
                  <small className="block text-[7px] text-slate-400 font-bold">
                    Account
                  </small>
                </span>
              </button>
            </div>
          </div>

          {/* CATEGORY NAVIGATION */}
          <div className="flex items-center gap-5 mt-3 overflow-x-auto scrollbar-hide">
            <button
              type="button"
              onClick={() =>
                onCategoryClick?.("Categories")
              }
              className="shrink-0 px-5 py-2 rounded-lg bg-blue-950 text-white text-[9px] font-black"
            >
              ☰ &nbsp; Categories
            </button>

            {[
              "Women",
              "Men",
              "Beauty",
              "Lifestyle",
              "Home & Living",
              "Brands",
            ].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  onCategoryClick?.(item)
                }
                className="shrink-0 text-[9px] font-black text-slate-800 hover:text-orange-600"
              >
                {item}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                onCategoryClick?.("Deals")
              }
              className="shrink-0 flex items-center gap-1 text-[9px] font-black text-red-600"
            >
              Deals
              <span className="bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[6px]">
                HOT
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                onCategoryClick?.("New Arrivals")
              }
              className="shrink-0 text-[9px] font-black text-green-600"
            >
              New Arrivals
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="max-w-[1450px] mx-auto px-3 sm:px-5 pt-2">
        <div className="relative h-[270px] sm:h-[370px] lg:h-[440px] overflow-hidden rounded-xl bg-orange-500">
          <img
            src={hero.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/95 via-orange-500/65 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-t from-green-950/50 via-transparent to-transparent" />

          <div className="relative h-full flex items-center px-7 sm:px-12 lg:px-20">
            <div className="text-white">
              <p className="text-[7px] sm:text-[9px] font-black tracking-[0.2em]">
                {hero.eyebrow}
              </p>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.8] mt-3">
                {hero.title}
              </h1>

              <p className="text-3xl sm:text-5xl lg:text-6xl font-serif italic text-yellow-300 leading-none">
                {hero.script}
              </p>

              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.85]">
                {hero.subtitle}
              </h2>

              <div className="flex items-end gap-2 mt-3">
                <span className="text-[9px] font-black">
                  UP TO
                </span>

                <span className="text-5xl sm:text-7xl font-black text-yellow-300 leading-none">
                  {hero.offer}
                </span>

                <span className="text-xl sm:text-3xl font-black">
                  OFF
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  onCategoryClick?.("Deals")
                }
                className="mt-4 inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 rounded-lg px-5 py-2.5 text-[9px] sm:text-[10px] font-black"
              >
                SHOP NOW
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setHeroIndex(
                (current) =>
                  (current - 1 + heroSlides.length) %
                  heroSlides.length
              )
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white text-blue-950 flex items-center justify-center shadow"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              setHeroIndex(
                (current) =>
                  (current + 1) % heroSlides.length
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white text-blue-950 flex items-center justify-center shadow"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setHeroIndex(index)}
                className={`h-1.5 rounded-full ${
                  index === heroIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-10 py-2 bg-green-700 text-white rounded-b-xl">
          <span className="text-[7px] sm:text-[8px] font-black">
            ✓ 100% Original Products
          </span>

          <span className="text-[7px] sm:text-[8px] font-black">
            ✓ Easy Returns
          </span>

          <span className="text-[7px] sm:text-[8px] font-black">
            ✓ Free Shipping
          </span>
        </div>
      </section>

      {/* =====================================================
          STORIES
      ====================================================== */}
      <section className="max-w-[1450px] mx-auto px-3 sm:px-5 py-4">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <div className="shrink-0 w-14 sm:w-20">
            <h2 className="text-base sm:text-lg font-black">
              STORIES
            </h2>

            <button
              type="button"
              onClick={() =>
                onCategoryClick?.("Stories")
              }
              className="text-[7px] sm:text-[8px] text-orange-600 font-black"
            >
              View All →
            </button>
          </div>

          {stories.map((story) => (
            <button
              key={story.name}
              type="button"
              onClick={() =>
                onCategoryClick?.(story.name)
              }
              className="shrink-0 flex flex-col items-center gap-1.5"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 p-[2px] rounded-full bg-gradient-to-tr from-orange-500 via-green-500 to-blue-800">
                <div className="w-full h-full p-[2px] bg-white rounded-full">
                  {story.sale ? (
                    <div className="w-full h-full rounded-full bg-orange-500 flex items-center justify-center">
                      <Percent className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                </div>
              </div>

              <span className="text-[7px] sm:text-[8px] font-black whitespace-nowrap">
                {story.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================
          TRENDING NOW
      ====================================================== */}
      <section className="max-w-[1450px] mx-auto px-3 sm:px-5">
        <SectionTitle
          title="TRENDING NOW"
          subtitle="See what's trending right now"
          onViewAll={() =>
            onCategoryClick?.("Trending")
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {trending.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() =>
                onCategoryClick?.(item.name)
              }
              className="relative aspect-[0.82] overflow-hidden rounded-lg group"
            >
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-2 left-2 text-left text-white">
                <p className="text-sm sm:text-base font-black leading-none">
                  {item.name.split(" ")[0]}
                </p>

                <p className="text-sm sm:text-base font-black leading-none">
                  {item.name.split(" ").slice(1).join(" ")}
                </p>

                <span className="inline-flex mt-1 bg-black/60 rounded px-1.5 py-0.5 text-[6px] font-black">
                  SHOP NOW →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================
          FLASH SALE + OOTD
      ====================================================== */}
      <section className="max-w-[1450px] mx-auto px-3 sm:px-5 py-5">
        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-3">
          {/* FLASH SALE */}
          <div className="border border-orange-100 rounded-xl p-3 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />

                <h2 className="text-lg sm:text-xl font-black text-orange-600">
                  FLASH SALE
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    onCategoryClick?.("Flash Sale")
                  }
                  className="text-[8px] font-black text-orange-600"
                >
                  View All →
                </button>
              </div>

              <Countdown />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {saleProducts.length > 0 ? (
                saleProducts.map((product, index) => (
                  <div
                    key={product.id || index}
                    className="border border-slate-100 rounded-lg overflow-hidden bg-white"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onProductClick?.(product)
                      }
                      className="relative block w-full aspect-square bg-slate-50"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />

                      <span className="absolute top-1 left-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-[6px] font-black">
                        {discount(product)}% OFF
                      </span>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onWishlist?.(product);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow"
                      >
                        <Heart className="w-3 h-3" />
                      </button>
                    </button>

                    <div className="p-1.5">
                      <p className="text-[8px] font-black truncate">
                        {product.name}
                      </p>

                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />

                        <span className="text-[7px] font-bold">
                          {product.rating || "4.8"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[10px] font-black">
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString("en-IN")}
                        </span>

                        {product.mrp && (
                          <span className="text-[7px] text-slate-400 line-through">
                            ₹
                            {Number(
                              product.mrp
                            ).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <p className="text-[6px] text-red-500 font-black mt-1">
                        🔥 {8 + index * 4} left
                      </p>

                      <div className="h-1 bg-orange-100 rounded-full mt-1">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{
                            width: `${80 - index * 12}%`,
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onAddToCart?.(product)
                        }
                        className="mt-1.5 w-full bg-orange-500 hover:bg-orange-600 text-white rounded-md py-1.5 text-[7px] font-black"
                      >
                        QUICK ADD
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-xs text-slate-400">
                  Loading sale products...
                </div>
              )}
            </div>
          </div>

          {/* OOTD */}
          <div className="border border-blue-100 rounded-xl p-3 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-blue-950">
                  #OOTD
                </h2>

                <p className="text-[8px] text-slate-500">
                  What everyone's wearing
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onCategoryClick?.("OOTD")
                }
                className="text-[8px] font-black text-orange-600"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {ootd.map((look) => (
                <button
                  key={look.handle}
                  type="button"
                  onClick={() =>
                    onCategoryClick?.("OOTD")
                  }
                  className="relative aspect-[0.72] rounded-lg overflow-hidden"
                >
                  <img
                    src={look.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute bottom-1.5 left-1.5 right-1.5 text-left">
                    <p className="text-[6px] sm:text-[7px] text-white font-black">
                      {look.handle}
                    </p>

                    <span className="inline-flex items-center gap-1 mt-1 bg-white text-blue-950 rounded px-1.5 py-1 text-[6px] font-black">
                      <ShoppingBag className="w-2 h-2" />
                      SHOP LOOK
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICE BAR
      ====================================================== */}
      <section className="max-w-[1450px] mx-auto px-3 sm:px-5">
        <div className="rounded-xl overflow-hidden bg-gradient-to-r from-orange-500 via-green-600 to-blue-950 text-white grid grid-cols-3">
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
            <Truck className="w-5 sm:w-7 h-5 sm:h-7 shrink-0" />

            <div>
              <p className="text-[8px] sm:text-xs font-black">
                FREE SHIPPING
              </p>

              <p className="text-[6px] sm:text-[8px] opacity-80">
                On Orders Above ₹999
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-x border-white/20">
            <RotateCcw className="w-5 sm:w-7 h-5 sm:h-7 shrink-0" />

            <div>
              <p className="text-[8px] sm:text-xs font-black">
                EASY RETURNS
              </p>

              <p className="text-[6px] sm:text-[8px] opacity-80">
                7 Days Return Policy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
            <ShieldCheck className="w-5 sm:w-7 h-5 sm:h-7 shrink-0" />

            <div>
              <p className="text-[8px] sm:text-xs font-black">
                SECURE PAYMENT
              </p>

              <p className="text-[6px] sm:text-[8px] opacity-80">
                100% Safe & Secure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TOP BRANDS
      ====================================================== */}
      <section className="max-w-[1450px] mx-auto px-3 sm:px-5 py-5">
        <SectionTitle
          title="TOP BRANDS"
          subtitle="You'll Love"
          onViewAll={() =>
            onCategoryClick?.("Brands")
          }
        />

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() =>
                onCategoryClick?.(brand)
              }
              className="h-14 sm:h-16 bg-white border border-slate-100 rounded-lg flex items-center justify-center hover:border-orange-400 hover:shadow-sm transition"
            >
              <span className="text-xs sm:text-sm font-black text-slate-800">
                {brand}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================
          TRENDY CORNER
      ====================================================== */}
      <section className="max-w-[1450px] mx-auto px-3 sm:px-5 pb-5">
        <SectionTitle
          title="TRENDY CORNER"
          subtitle="Your vibe. Your style."
          orange
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {trendStyles.map((style) => (
            <button
              key={style.name}
              type="button"
              onClick={() =>
                onCategoryClick?.(style.name)
              }
              className={`bg-gradient-to-br ${style.className} rounded-xl p-4 text-left text-white hover:-translate-y-0.5 transition`}
            >
              <span className="text-2xl">
                {style.emoji}
              </span>

              <p className="text-sm font-black mt-4">
                {style.name}
              </p>

              <p className="text-[7px] font-black mt-1">
                Explore →
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================
          TRUST FEATURES
      ====================================================== */}
      <section className="max-w-[1450px] mx-auto px-3 sm:px-5 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 bg-slate-50 rounded-xl p-2">
          <TrustItem
            icon={ShieldCheck}
            title="100% ORIGINAL"
            subtitle="Genuine Products"
          />

          <TrustItem
            icon={Percent}
            title="BEST PRICES"
            subtitle="Guaranteed"
          />

          <TrustItem
            icon={Truck}
            title="PAN INDIA DELIVERY"
            subtitle="Fast & Reliable"
          />

          <TrustItem
            icon={Clock3}
            title="24/7 SUPPORT"
            subtitle="We're Here To Help"
          />
        </div>
      </section>

      {/* =====================================================
          CUSTOMER ACTIVITY — VISUAL ONLY FOR NOW
          Will be connected to real backend activity later.
      ====================================================== */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 hidden md:flex">
        <div className="bg-white border border-slate-200 rounded-full shadow-xl px-3 py-2 flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-white" />
            <div className="w-6 h-6 rounded-full bg-blue-700 border-2 border-white" />
            <div className="w-6 h-6 rounded-full bg-green-600 border-2 border-white" />
          </div>

          <p className="text-[8px] text-slate-700">
            <strong>Live shopping</strong>
            <br />
            Discover what's trending
          </p>

          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function TrustItem({
  icon: Icon,
  title,
  subtitle,
}) {
  return (
    <div className="flex items-center gap-2 p-3">
      <Icon className="w-5 h-5 text-blue-800 shrink-0" />

      <div>
        <p className="text-[8px] sm:text-[9px] font-black">
          {title}
        </p>

        <p className="text-[7px] text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}