import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Play,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";

const FALLBACK_PRODUCTS = [
  {
    id: "P1",
    name: "Essence Mascara Lash Princess",
    brand: "Essence",
    price: 829,
    mrp: 1299,
    rating: 4.8,
    reviews: 1284,
    category: "Makeup",
    image:
      "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    bestseller: true,
    trending: true,
    flashSale: true,
  },
  {
    id: "P2",
    name: "Eyeshadow Palette with Mirror",
    brand: "Glamour",
    price: 1659,
    mrp: 2499,
    rating: 4.7,
    reviews: 842,
    category: "Makeup",
    image:
      "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
    bestseller: true,
    trending: true,
  },
  {
    id: "P3",
    name: "Powder Canister",
    brand: "Velvet Touch",
    price: 1244,
    mrp: 1899,
    rating: 4.6,
    reviews: 621,
    category: "Beauty",
    image:
      "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png",
    flashSale: true,
  },
  {
    id: "P4",
    name: "Calvin Klein CK One",
    brand: "Calvin Klein",
    price: 3499,
    mrp: 5200,
    rating: 4.9,
    reviews: 936,
    category: "Fragrance",
    image:
      "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png",
    trending: true,
  },
];

const CATEGORIES = [
  {
    name: "Makeup",
    emoji: "💄",
    label: "Glam Edit",
  },
  {
    name: "Skincare",
    emoji: "✨",
    label: "Glow Up",
  },
  {
    name: "Fragrance",
    emoji: "🌸",
    label: "Scent Story",
  },
  {
    name: "Haircare",
    emoji: "💇‍♀️",
    label: "Hair Goals",
  },
  {
    name: "Fashion",
    emoji: "👗",
    label: "Style Drop",
  },
  {
    name: "Accessories",
    emoji: "👜",
    label: "Finish It",
  },
  {
    name: "Wellness",
    emoji: "🧘",
    label: "Feel Good",
  },
];

const STORIES = [
  {
    title: "GRWM",
    subtitle: "5 min glam",
    emoji: "💋",
  },
  {
    title: "OOTD",
    subtitle: "Today’s fit",
    emoji: "👠",
  },
  {
    title: "Glow",
    subtitle: "Skin secrets",
    emoji: "✨",
  },
  {
    title: "Viral",
    subtitle: "Internet made me buy it",
    emoji: "🔥",
  },
  {
    title: "Under ₹999",
    subtitle: "Cute. Not costly.",
    emoji: "💸",
  },
  {
    title: "New In",
    subtitle: "Just dropped",
    emoji: "🛍️",
  },
];

export default function StorefrontHome({
  api,
  onProductClick,
  onAddToCart,
  onWishlist,
  onSearch,
}) {
  const [products, setProducts] =
    useState(FALLBACK_PRODUCTS);

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [heroIndex, setHeroIndex] =
    useState(0);

  const [liked, setLiked] =
    useState({});

  const [search, setSearch] =
    useState("");

  const [timeLeft, setTimeLeft] =
    useState({
      hours: 2,
      minutes: 47,
      seconds: 18,
    });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        if (!api?.getProducts) return;

        const response =
          await api.getProducts();

        if (
          mounted &&
          response?.products?.length
        ) {
          setProducts(
            response.products
          );
        }
      } catch {
        // Fallback catalog remains visible.
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [api]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((current) => {
        let {
          hours,
          minutes,
          seconds,
        } = current;

        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        }

        return {
          hours,
          minutes,
          seconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(
        (current) =>
          (current + 1) % 3
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const filteredProducts =
    useMemo(() => {
      let result = [...products];

      if (
        activeCategory !== "All"
      ) {
        result = result.filter(
          (product) =>
            String(
              product.category || ""
            ).toLowerCase() ===
            activeCategory.toLowerCase()
        );
      }

      if (search.trim()) {
        const query =
          search
            .trim()
            .toLowerCase();

        result = result.filter(
          (product) =>
            String(
              product.name || ""
            )
              .toLowerCase()
              .includes(query) ||
            String(
              product.brand || ""
            )
              .toLowerCase()
              .includes(query)
        );
      }

      return result;
    }, [
      products,
      activeCategory,
      search,
    ]);

  const trendingProducts =
    products.filter(
      (product) =>
        product.trending
    );

  const bestsellerProducts =
    products.filter(
      (product) =>
        product.bestseller
    );

  const saleProducts =
    products.filter(
      (product) =>
        product.flashSale
    );

  const toggleWishlist = (
    product
  ) => {
    setLiked((current) => ({
      ...current,
      [product.id]:
        !current[product.id],
    }));

    onWishlist?.(product);
  };

  const submitSearch = (
    event
  ) => {
    event.preventDefault();

    onSearch?.(search);
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] text-slate-950">
      {/* TOP OFFER STRIP */}

      <div className="bg-[#ff4d00] text-white overflow-hidden">
        <div className="h-8 flex items-center whitespace-nowrap animate-[marquee_22s_linear_infinite]">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <React.Fragment
              key={index}
            >
              <span className="text-[9px] font-black uppercase tracking-[0.14em] mx-8">
                ⚡ FLAT 40% OFF ON TRENDING DROPS
              </span>

              <span className="text-[9px] font-black mx-8">
                ✦
              </span>

              <span className="text-[9px] font-black uppercase tracking-[0.14em] mx-8">
                FREE SHIPPING ABOVE ₹999
              </span>

              <span className="text-[9px] font-black mx-8">
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* MAIN NAV */}

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6">
          <div className="h-[70px] flex items-center gap-5">
            <button
              type="button"
              className="flex-shrink-0"
            >
              <div className="leading-none">
                <span className="block text-2xl font-black tracking-[-0.08em] text-blue-950">
                  D2C
                </span>

                <span className="block text-[7px] font-black tracking-[0.35em] text-orange-500">
                  INDIA
                </span>
              </div>
            </button>

            <nav className="hidden lg:flex items-center gap-6">
              {[
                "Men",
                "Women",
                "Beauty",
                "Lifestyle",
                "Trending",
                "Sale",
              ].map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      setActiveCategory(
                        item ===
                          "Trending"
                          ? "All"
                          : item
                      )
                    }
                    className={`text-[10px] font-black ${
                      item ===
                      "Sale"
                        ? "text-orange-600"
                        : "text-slate-700"
                    } hover:text-orange-500 transition`}
                  >
                    {item}
                  </button>
                )
              )}
            </nav>

            <form
              onSubmit={
                submitSearch
              }
              className="flex-1 max-w-xl ml-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search for products, brands and trends..."
                  className="w-full h-11 rounded-xl bg-slate-100 pl-11 pr-4 text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </form>

            <button
              type="button"
              className="hidden sm:flex flex-col items-center gap-1"
            >
              <span className="text-[8px] font-black">
                Profile
              </span>

              <span className="text-[7px] text-slate-400">
                Account
              </span>
            </button>

            <button
              type="button"
              className="hidden sm:flex flex-col items-center gap-1"
            >
              <Heart className="w-4 h-4" />

              <span className="text-[7px] font-black">
                Wishlist
              </span>
            </button>

            <button
              type="button"
              className="relative flex flex-col items-center gap-1"
            >
              <ShoppingBag className="w-4 h-4" />

              <span className="text-[7px] font-black">
                Bag
              </span>

              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-orange-500 text-white text-[7px] font-black flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 pb-20">
        {/* HERO */}

        <section className="pt-5">
          <div className="relative overflow-hidden rounded-[28px] bg-blue-950 min-h-[420px] lg:min-h-[500px]">
            <HeroSlide
              index={
                heroIndex
              }
              onShop={() =>
                setActiveCategory(
                  "All"
                )
              }
            />

            <button
              type="button"
              onClick={() =>
                setHeroIndex(
                  (current) =>
                    current === 0
                      ? 2
                      : current - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur text-white flex items-center justify-center hover:bg-white/25"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() =>
                setHeroIndex(
                  (current) =>
                    (current + 1) % 3
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur text-white flex items-center justify-center hover:bg-white/25"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
              {[0, 1, 2].map(
                (index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() =>
                      setHeroIndex(
                        index
                      )
                    }
                    className={`h-1.5 rounded-full transition-all ${
                      heroIndex ===
                      index
                        ? "w-8 bg-white"
                        : "w-2 bg-white/40"
                    }`}
                  />
                )
              )}
            </div>
          </div>
        </section>

        {/* CATEGORY RAIL */}

        <section className="pt-9">
          <SectionHeading
            eyebrow="SHOP THE MOOD"
            title="What are you into?"
          />

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <CategoryBubble
              name="All"
              emoji="✨"
              label="Everything"
              active={
                activeCategory ===
                "All"
              }
              onClick={() =>
                setActiveCategory(
                  "All"
                )
              }
            />

            {CATEGORIES.map(
              (category) => (
                <CategoryBubble
                  key={
                    category.name
                  }
                  {...category}
                  active={
                    activeCategory ===
                    category.name
                  }
                  onClick={() =>
                    setActiveCategory(
                      category.name
                    )
                  }
                />
              )
            )}
          </div>
        </section>

        {/* STORIES */}

        <section className="pt-10">
          <SectionHeading
            eyebrow="TRENDING NOW"
            title="Your daily scroll"
            action="View all"
          />

          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {STORIES.map(
              (
                story,
                index
              ) => (
                <StoryCard
                  key={
                    story.title
                  }
                  story={
                    story
                  }
                  index={
                    index
                  }
                />
              )
            )}
          </div>
        </section>

        {/* FLASH SALE */}

        <section className="pt-10">
          <div className="rounded-[26px] bg-[#ff4d00] text-white p-5 sm:p-7">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 fill-yellow-300 text-yellow-300" />

                  <span className="text-[10px] uppercase tracking-[0.18em] font-black">
                    Flash Drop
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
                  Sale ends soon.
                </h2>

                <p className="text-xs text-white/70 mt-1">
                  Your cart is going to thank you.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <CountdownBox
                  value={
                    timeLeft.hours
                  }
                  label="HRS"
                />

                <span className="font-black text-xl">
                  :
                </span>

                <CountdownBox
                  value={
                    timeLeft.minutes
                  }
                  label="MIN"
                />

                <span className="font-black text-xl">
                  :
                </span>

                <CountdownBox
                  value={
                    timeLeft.seconds
                  }
                  label="SEC"
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-orange-600 text-[10px] font-black"
              >
                SHOP SALE
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {saleProducts.length
                ? saleProducts.map(
                    (product) => (
                      <MiniSaleProduct
                        key={
                          product.id
                        }
                        product={
                          product
                        }
                        onClick={() =>
                          onProductClick?.(
                            product
                          )
                        }
                      />
                    )
                  )
                : products
                    .slice(
                      0,
                      4
                    )
                    .map(
                      (
                        product
                      ) => (
                        <MiniSaleProduct
                          key={
                            product.id
                          }
                          product={
                            product
                          }
                          onClick={() =>
                            onProductClick?.(
                              product
                            )
                          }
                        />
                      )
                    )}
            </div>
          </div>
        </section>

        {/* TRENDING */}

        <ProductSection
          eyebrow="THE INTERNET IS OBSESSED"
          title="Trending right now"
          icon={TrendingUp}
          products={
            trendingProducts.length
              ? trendingProducts
              : products
          }
          onProductClick={
            onProductClick
          }
          onAddToCart={
            onAddToCart
          }
          liked={liked}
          onWishlist={
            toggleWishlist
          }
        />

        {/* OOTD */}

        <section className="pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2fr] gap-5">
            <div className="rounded-[26px] bg-pink-100 p-7 min-h-[360px] flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-[9px] uppercase tracking-[0.18em] font-black text-pink-700">
                  OOTD / OOTN
                </p>

                <h2 className="text-4xl font-black tracking-tight mt-2 max-w-sm">
                  What are you wearing today?
                </h2>

                <p className="text-xs text-pink-800/60 mt-3 max-w-xs">
                  Steal the look. Remix the vibe. Make it yours.
                </p>

                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-950 text-white text-[9px] font-black"
                >
                  EXPLORE LOOKS
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="absolute -right-10 -bottom-14 w-64 h-64 rounded-full bg-pink-300/60" />

              <div className="absolute right-8 bottom-8 text-8xl">
                👗
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "🧥",
                "👟",
                "👜",
                "👓",
                "💍",
                "👚",
              ].map(
                (
                  emoji,
                  index
                ) => (
                  <div
                    key={index}
                    className="rounded-[22px] bg-white border border-slate-100 overflow-hidden group cursor-pointer"
                  >
                    <div className="aspect-[4/5] bg-slate-100 flex items-center justify-center text-7xl group-hover:scale-105 transition">
                      {emoji}
                    </div>

                    <div className="p-3">
                      <p className="text-[9px] font-black">
                        Look{" "}
                        {index +
                          1}
                      </p>

                      <p className="text-[7px] text-slate-400 mt-1">
                        Trending fit
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* BESTSELLERS */}

        <ProductSection
          eyebrow="CUSTOMER FAVOURITES"
          title="Bestsellers"
          icon={Star}
          products={
            bestsellerProducts.length
              ? bestsellerProducts
              : products
          }
          onProductClick={
            onProductClick
          }
          onAddToCart={
            onAddToCart
          }
          liked={liked}
          onWishlist={
            toggleWishlist
          }
        />

        {/* DISCOVERY */}

        <section className="pt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] font-black text-orange-500">
                DISCOVER
              </p>

              <h2 className="text-2xl sm:text-3xl font-black mt-1">
                You might love these.
              </h2>
            </div>

            <span className="text-[8px] text-slate-400">
              Curated for your vibe
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts
              .slice(
                0,
                8
              )
              .map(
                (product) => (
                  <StoreProductCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                    liked={
                      liked[
                        product.id
                      ]
                    }
                    onClick={() =>
                      onProductClick?.(
                        product
                      )
                    }
                    onAdd={() =>
                      onAddToCart?.(
                        product
                      )
                    }
                    onWishlist={() =>
                      toggleWishlist(
                        product
                      )
                    }
                  />
                )
              )}
          </div>
        </section>

        {/* BOTTOM TRUST BAR */}

        <section className="pt-12">
          <div className="rounded-[24px] bg-white border border-slate-100 grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100 overflow-hidden">
            <TrustItem
              emoji="🚚"
              title="Fast Delivery"
              text="Across India"
            />

            <TrustItem
              emoji="↩️"
              title="Easy Returns"
              text="Simple & transparent"
            />

            <TrustItem
              emoji="🔒"
              title="Secure Payments"
              text="100% protected"
            />

            <TrustItem
              emoji="💬"
              title="Need Help?"
              text="We're here 24/7"
            />
          </div>
        </section>
      </main>

      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .scrollbar-hide {
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   HERO
============================================================ */

function HeroSlide({
  index,
  onShop,
}) {
  const slides = [
    {
      eyebrow:
        "THE BIG D2C DROP",
      title:
        "Main character energy.",
      description:
        "Fresh beauty, fashion and lifestyle finds made for your feed.",
      button:
        "SHOP THE DROP",
      accent:
        "bg-orange-500",
      visual:
        "✨",
    },
    {
      eyebrow:
        "LIMITED TIME",
      title:
        "Everything. Less.",
      description:
        "Up to 40% off on viral favourites before they disappear.",
      button:
        "GRAB THE DEAL",
      accent:
        "bg-pink-500",
      visual:
        "🔥",
    },
    {
      eyebrow:
        "JUST LANDED",
      title:
        "New season. New you.",
      description:
        "Discover the products everyone is talking about right now.",
      button:
        "EXPLORE NEW IN",
      accent:
        "bg-purple-500",
      visual:
        "💜",
    },
  ];

  const slide =
    slides[index];

  return (
    <div className="absolute inset-0">
      <div
        className={`absolute inset-0 ${slide.accent} opacity-20`}
      />

      <div className="absolute -right-20 -top-20 w-[420px] h-[420px] rounded-full bg-white/10" />

      <div className="absolute right-[8%] bottom-[8%] text-[180px] sm:text-[230px] leading-none rotate-[-8deg]">
        {slide.visual}
      </div>

      <div className="relative z-10 h-full flex items-center px-10 sm:px-16 lg:px-24 py-16">
        <div className="max-w-xl text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur">
            <Sparkles className="w-3 h-3 text-orange-300" />

            <span className="text-[8px] uppercase tracking-[0.18em] font-black">
              {slide.eyebrow}
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.06em] leading-[0.92] mt-5">
            {slide.title}
          </h1>

          <p className="text-sm text-white/65 max-w-md mt-5 leading-relaxed">
            {slide.description}
          </p>

          <button
            type="button"
            onClick={onShop}
            className="mt-7 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-blue-950 text-[9px] font-black hover:scale-[1.02] transition"
          >
            {slide.button}

            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CATEGORIES
============================================================ */

function CategoryBubble({
  name,
  emoji,
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-shrink-0 text-center group"
    >
      <div
        className={`w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] rounded-full flex items-center justify-center text-4xl transition group-hover:-translate-y-1 ${
          active
            ? "bg-orange-100 ring-2 ring-orange-500 ring-offset-2"
            : "bg-white border border-slate-100"
        }`}
      >
        {emoji}
      </div>

      <p className="text-[9px] font-black mt-2">
        {name}
      </p>

      <p className="text-[7px] text-slate-400 mt-0.5">
        {label}
      </p>
    </button>
  );
}

/* ============================================================
   STORIES
============================================================ */

function StoryCard({
  story,
  index,
}) {
  const backgrounds = [
    "bg-pink-200",
    "bg-orange-200",
    "bg-purple-200",
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
  ];

  return (
    <button
      type="button"
      className="relative flex-shrink-0 w-[120px] h-[170px] sm:w-[135px] sm:h-[185px] rounded-[20px] overflow-hidden group"
    >
      <div
        className={`absolute inset-0 ${backgrounds[index % backgrounds.length]}`}
      />

      <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition">
        {story.emoji}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 text-left bg-gradient-to-t from-black/70 to-transparent pt-12 text-white">
        <p className="text-[10px] font-black">
          {story.title}
        </p>

        <p className="text-[7px] text-white/70 mt-0.5">
          {story.subtitle}
        </p>
      </div>

      <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center">
        <Play className="w-3 h-3 fill-blue-950 text-blue-950 ml-0.5" />
      </div>
    </button>
  );
}

/* ============================================================
   FLASH SALE
============================================================ */

function CountdownBox({
  value,
  label,
}) {
  return (
    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white text-blue-950 flex flex-col items-center justify-center">
      <span className="text-lg sm:text-xl font-black tabular-nums">
        {String(value).padStart(
          2,
          "0"
        )}
      </span>

      <span className="text-[6px] font-black text-slate-400">
        {label}
      </span>
    </div>
  );
}

function MiniSaleProduct({
  product,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white/10 rounded-xl p-2 flex items-center gap-2 text-left hover:bg-white/15 transition"
    >
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
        {product.image && (
          <img
            src={product.image}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0">
        <p className="text-[7px] text-white/50 truncate">
          {product.brand}
        </p>

        <p className="text-[8px] font-black truncate">
          {product.name}
        </p>

        <p className="text-[9px] font-black mt-1">
          {formatCurrency(
            product.price
          )}
        </p>
      </div>
    </button>
  );
}

/* ============================================================
   PRODUCT SECTIONS
============================================================ */

function ProductSection({
  eyebrow,
  title,
  icon: Icon,
  products,
  onProductClick,
  onAddToCart,
  liked,
  onWishlist,
}) {
  return (
    <section className="pt-12">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon className="w-4 h-4 text-orange-500" />
            )}

            <p className="text-[9px] uppercase tracking-[0.18em] font-black text-orange-500">
              {eyebrow}
            </p>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            {title}
          </h2>
        </div>

        <button
          type="button"
          className="hidden sm:inline-flex items-center gap-1 text-[9px] font-black"
        >
          View all
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products
          .slice(0, 4)
          .map(
            (product) => (
              <StoreProductCard
                key={
                  product.id
                }
                product={
                  product
                }
                liked={
                  liked[
                    product.id
                  ]
                }
                onClick={() =>
                  onProductClick?.(
                    product
                  )
                }
                onAdd={() =>
                  onAddToCart?.(
                    product
                  )
                }
                onWishlist={() =>
                  onWishlist(
                    product
                  )
                }
              />
            )
          )}
      </div>
    </section>
  );
}

function StoreProductCard({
  product,
  liked,
  onClick,
  onAdd,
  onWishlist,
}) {
  const discount =
    Number(product.mrp) > 0
      ? Math.round(
          (1 -
            Number(
              product.price ||
                0
            ) /
              Number(
                product.mrp
              )) *
            100
        )
      : 0;

  return (
    <article className="group relative bg-white rounded-[20px] overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-900/5 transition">
      <div
        className="relative aspect-[4/5] bg-slate-100 overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={
              product.name
            }
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🛍️
          </div>
        )}

        {discount > 0 && (
          <span className="absolute left-2 top-2 px-2 py-1 rounded-md bg-orange-500 text-white text-[7px] font-black">
            {discount}% OFF
          </span>
        )}

        {product.trending && (
          <span className="absolute left-2 bottom-2 px-2 py-1 rounded-md bg-blue-950 text-white text-[7px] font-black">
            TRENDING
          </span>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onWishlist?.();
          }}
          className="absolute right-2 top-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
        >
          <Heart
            className={`w-4 h-4 ${
              liked
                ? "fill-red-500 text-red-500"
                : "text-slate-700"
            }`}
          />
        </button>
      </div>

      <div className="p-3">
        <p className="text-[7px] uppercase tracking-[0.1em] text-slate-400 font-black">
          {product.brand}
        </p>

        <h3
          className="text-[10px] font-black mt-1 truncate cursor-pointer"
          onClick={onClick}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-2">
          <div className="inline-flex items-center gap-1 px-1.5 py-1 rounded-md bg-green-600 text-white">
            <span className="text-[7px] font-black">
              {product.rating ||
                "4.5"}
            </span>

            <Star className="w-2.5 h-2.5 fill-white" />
          </div>

          <span className="text-[7px] text-slate-400">
            {product.reviews ||
              0}{" "}
            reviews
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-black">
            {formatCurrency(
              product.price
            )}
          </span>

          {product.mrp && (
            <span className="text-[8px] line-through text-slate-400">
              {formatCurrency(
                product.mrp
              )}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="w-full h-9 mt-3 rounded-xl bg-blue-950 text-white text-[8px] font-black hover:bg-orange-500 transition"
        >
          ADD TO BAG
        </button>
      </div>
    </article>
  );
}

/* ============================================================
   OTHER
============================================================ */

function SectionHeading({
  eyebrow,
  title,
  action,
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <p className="text-[9px] uppercase tracking-[0.18em] font-black text-orange-500">
          {eyebrow}
        </p>

        <h2 className="text-2xl sm:text-3xl font-black mt-1">
          {title}
        </h2>
      </div>

      {action && (
        <button
          type="button"
          className="text-[8px] font-black text-slate-500"
        >
          {action}
        </button>
      )}
    </div>
  );
}

function TrustItem({
  emoji,
  title,
  text,
}) {
  return (
    <div className="p-5 sm:p-7 text-center">
      <div className="text-2xl">
        {emoji}
      </div>

      <p className="text-[9px] font-black mt-2">
        {title}
      </p>

      <p className="text-[7px] text-slate-400 mt-1">
        {text}
      </p>
    </div>
  );
}

function formatCurrency(
  value
) {
  return `₹${Number(
    value || 0
  ).toLocaleString(
    "en-IN"
  )}`;
}