import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from "lucide-react";

const FALLBACK_PRODUCT = {
  id: "P1",
  name: "Essence Mascara Lash Princess",
  brand: "Essence",
  category: "Makeup",
  description:
    "Create dramatic, defined lashes with a lightweight formula designed for everyday glam.",
  price: 829,
  mrp: 1299,
  rating: 4.8,
  reviews: 1284,
  stock: 99,
  sku: "ESS-MAS-001",
  images: [
    "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
  ],
  sizes: [],
  colors: ["Black"],
  tags: ["Bestseller", "Trending"],
  flashSale: true,
};

export default function ProductDetailView({
  product: initialProduct,
  api,
  onBack,
  onAddToCart,
  onBuyNow,
  onWishlist,
}) {
  const [product, setProduct] = useState(
    initialProduct || FALLBACK_PRODUCT
  );

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    initialProduct?.sizes?.[0] || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    initialProduct?.colors?.[0] || ""
  );

  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [pincode, setPincode] = useState("");
  const [delivery, setDelivery] = useState(null);

  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 47,
    seconds: 18,
  });

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      if (!api?.getProduct || !initialProduct?.id) {
        return;
      }

      try {
        setLoading(true);

        const response = await api.getProduct(
          initialProduct.id
        );

        if (
          mounted &&
          response?.product
        ) {
          setProduct(
            response.product
          );
        }
      } catch {
        // Keep supplied product.
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [api, initialProduct?.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((current) => {
        let {
          hours,
          minutes,
          seconds,
        } = current;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
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

  const images = useMemo(() => {
    if (
      product.images?.length
    ) {
      return product.images;
    }

    if (product.image) {
      return [product.image];
    }

    return [
      FALLBACK_PRODUCT.images[0],
    ];
  }, [product]);

  const discount = useMemo(() => {
    const mrp = Number(
      product.mrp || 0
    );

    const price = Number(
      product.price || 0
    );

    if (!mrp || !price) {
      return 0;
    }

    return Math.round(
      (1 - price / mrp) * 100
    );
  }, [product]);

  const changeImage = (direction) => {
    setActiveImage((current) => {
      if (direction === "next") {
        return (
          (current + 1) %
          images.length
        );
      }

      return current === 0
        ? images.length - 1
        : current - 1;
    });
  };

  const changeQuantity = (
    direction
  ) => {
    setQuantity((current) => {
      if (direction === "plus") {
        return Math.min(
          current + 1,
          Number(
            product.stock || 99
          )
        );
      }

      return Math.max(
        current - 1,
        1
      );
    });
  };

  const handleWishlist = () => {
    setLiked((current) => !current);
    onWishlist?.(product);
  };

  const handleAddToCart = () => {
    onAddToCart?.({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    });
  };

  const handleBuyNow = () => {
    onBuyNow?.({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    });
  };

  const checkDelivery = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setDelivery({
        success: false,
        message:
          "Enter a valid 6-digit pincode.",
      });
      return;
    }

    try {
      if (api?.checkDelivery) {
        const response =
          await api.checkDelivery(
            pincode,
            product.id
          );

        setDelivery(
          response || {
            success: true,
            message:
              "Delivery available.",
          }
        );

        return;
      }

      setDelivery({
        success: true,
        message:
          "Delivery available to this pincode.",
        eta: "2–5 business days",
      });
    } catch (error) {
      setDelivery({
        success: false,
        message:
          error?.message ||
          "Delivery is not available for this pincode.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] text-slate-950">
      {/* BREADCRUMB */}

      <div className="bg-white border-b border-slate-100">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6">
          <div className="h-12 flex items-center gap-2 text-[8px] font-bold text-slate-400">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-slate-700 hover:text-orange-500"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>

            <ChevronRight className="w-3 h-3" />

            <span>
              {product.category ||
                "Shop"}
            </span>

            <ChevronRight className="w-3 h-3" />

            <span className="text-slate-700 truncate max-w-[250px]">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-10">
          {/* PRODUCT IMAGES */}

          <section>
            <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[90px_1fr] gap-3">
              {/* THUMBNAILS */}

              <div className="space-y-3">
                {images.map(
                  (image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      onClick={() =>
                        setActiveImage(
                          index
                        )
                      }
                      className={`w-full aspect-square rounded-xl overflow-hidden border-2 ${
                        activeImage ===
                        index
                          ? "border-orange-500"
                          : "border-slate-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )
                )}
              </div>

              {/* MAIN IMAGE */}

              <div className="relative aspect-[4/5] sm:aspect-square rounded-[24px] bg-slate-100 overflow-hidden">
                <img
                  src={
                    images[
                      activeImage
                    ]
                  }
                  alt={
                    product.name
                  }
                  className="w-full h-full object-cover"
                />

                {product.flashSale && (
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500 text-white text-[8px] font-black">
                    <Zap className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                    FLASH SALE
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleWishlist()
                  }
                  className="absolute right-4 top-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      liked
                        ? "fill-red-500 text-red-500"
                        : "text-slate-700"
                    }`}
                  />
                </button>

                {images.length >
                  1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        changeImage(
                          "previous"
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        changeImage(
                          "next"
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* PRODUCT INFO */}

          <section className="lg:pt-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] font-black text-orange-500">
                  {product.brand ||
                    "D2C Original"}
                </p>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mt-2">
                  {product.name}
                </h1>
              </div>

              <button
                type="button"
                onClick={
                  handleWishlist
                }
                className="flex-shrink-0 w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center"
              >
                <Heart
                  className={`w-5 h-5 ${
                    liked
                      ? "fill-red-500 text-red-500"
                      : ""
                  }`}
                />
              </button>
            </div>

            {/* RATING */}

            <div className="flex items-center gap-2 mt-4">
              <div className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md bg-green-600 text-white">
                <span className="text-[9px] font-black">
                  {product.rating ||
                    "4.5"}
                </span>

                <Star className="w-3 h-3 fill-white" />
              </div>

              <span className="text-[9px] font-bold text-slate-500">
                {Number(
                  product.reviews ||
                    0
                ).toLocaleString(
                  "en-IN"
                )}{" "}
                ratings & reviews
              </span>
            </div>

            <div className="h-px bg-slate-100 my-5" />

            {/* PRICE */}

            <div>
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-black">
                  {formatCurrency(
                    product.price
                  )}
                </span>

                {product.mrp && (
                  <span className="text-sm line-through text-slate-400 mb-1">
                    {formatCurrency(
                      product.mrp
                    )}
                  </span>
                )}

                {discount > 0 && (
                  <span className="text-sm font-black text-green-600 mb-1">
                    {discount}% OFF
                  </span>
                )}
              </div>

              <p className="text-[8px] text-slate-400 mt-2">
                Inclusive of applicable taxes
              </p>
            </div>

            {/* SALE */}

            {product.flashSale && (
              <div className="mt-5 rounded-2xl bg-orange-50 border border-orange-100 p-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />

                  <p className="text-[9px] font-black text-orange-700">
                    FLASH SALE LIVE
                  </p>
                </div>

                <p className="text-[8px] text-orange-700/60 mt-1">
                  Price drops back soon. Add it before the timer runs out.
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <TimeBlock
                    value={
                      timeLeft.hours
                    }
                    label="HRS"
                  />

                  <span className="font-black text-orange-500">
                    :
                  </span>

                  <TimeBlock
                    value={
                      timeLeft.minutes
                    }
                    label="MIN"
                  />

                  <span className="font-black text-orange-500">
                    :
                  </span>

                  <TimeBlock
                    value={
                      timeLeft.seconds
                    }
                    label="SEC"
                  />
                </div>
              </div>
            )}

            {/* DESCRIPTION */}

            <div className="mt-6">
              <h2 className="text-xs font-black">
                Product Details
              </h2>

              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                {product.description ||
                  product.shortDescription ||
                  "A carefully selected product made for everyday use."}
              </p>
            </div>

            {/* COLORS */}

            {product.colors?.length >
              0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black uppercase tracking-[0.1em]">
                    Color
                  </p>

                  <span className="text-[8px] text-slate-400">
                    {selectedColor}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {product.colors.map(
                    (color) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() =>
                          setSelectedColor(
                            color
                          )
                        }
                        className={`px-4 py-2.5 rounded-xl border text-[9px] font-black ${
                          selectedColor ===
                          color
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-slate-200"
                        }`}
                      >
                        {color}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* SIZES */}

            {product.sizes?.length >
              0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black uppercase tracking-[0.1em]">
                    Select Size
                  </p>

                  <button
                    type="button"
                    className="text-[8px] font-black text-orange-600"
                  >
                    Size Guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {product.sizes.map(
                    (size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() =>
                          setSelectedSize(
                            size
                          )
                        }
                        className={`min-w-12 px-4 py-2.5 rounded-xl border text-[9px] font-black ${
                          selectedSize ===
                          size
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-slate-200"
                        }`}
                      >
                        {size}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* QUANTITY */}

            <div className="mt-6">
              <p className="text-[9px] font-black uppercase tracking-[0.1em]">
                Quantity
              </p>

              <div className="flex items-center w-fit mt-3 rounded-xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    changeQuantity(
                      "minus"
                    )
                  }
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-50"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="w-10 text-center text-xs font-black">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    changeQuantity(
                      "plus"
                    )
                  }
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {Number(
                product.stock
              ) <= 10 && (
                <p className="text-[8px] font-black text-orange-600 mt-2">
                  Only{" "}
                  {product.stock}{" "}
                  left in stock
                </p>
              )}
            </div>

            {/* ACTIONS */}

            <div className="grid grid-cols-2 gap-3 mt-7">
              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                className="h-12 rounded-xl border-2 border-blue-950 text-blue-950 text-[10px] font-black inline-flex items-center justify-center gap-2 hover:bg-blue-950 hover:text-white transition"
              >
                <ShoppingBag className="w-4 h-4" />
                ADD TO BAG
              </button>

              <button
                type="button"
                onClick={
                  handleBuyNow
                }
                className="h-12 rounded-xl bg-orange-500 text-white text-[10px] font-black inline-flex items-center justify-center gap-2 hover:bg-orange-600 transition"
              >
                BUY NOW
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* DELIVERY */}

            <div className="mt-6 rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-500" />

                <p className="text-[9px] font-black">
                  Check Delivery
                </p>
              </div>

              <div className="flex gap-2 mt-3">
                <input
                  value={pincode}
                  onChange={(event) =>
                    setPincode(
                      event.target.value
                    )
                  }
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="Enter pincode"
                  className="flex-1 h-10 rounded-xl bg-slate-50 px-3 text-xs outline-none border border-transparent focus:border-orange-500"
                />

                <button
                  type="button"
                  onClick={
                    checkDelivery
                  }
                  className="px-4 h-10 rounded-xl bg-blue-950 text-white text-[8px] font-black"
                >
                  CHECK
                </button>
              </div>

              {delivery && (
                <div
                  className={`mt-3 p-3 rounded-xl ${
                    delivery.success
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  <p
                    className={`text-[8px] font-black ${
                      delivery.success
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {delivery.message}
                  </p>

                  {delivery.eta && (
                    <p className="text-[7px] text-green-600 mt-1">
                      Estimated delivery:{" "}
                      {delivery.eta}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* TRUST */}

            <div className="grid grid-cols-3 gap-2 mt-4">
              <TrustCard
                icon={Truck}
                title="Fast Delivery"
                text="Across India"
              />

              <TrustCard
                icon={ShieldCheck}
                title="Secure"
                text="Payments"
              />

              <TrustCard
                icon={Check}
                title="Easy Returns"
                text="Hassle-free"
              />
            </div>

            {loading && (
              <p className="text-[8px] text-slate-400 mt-4">
                Updating product information...
              </p>
            )}
          </section>
        </div>

        {/* PRODUCT HIGHLIGHTS */}

        <section className="mt-12">
          <div className="rounded-[24px] bg-blue-950 text-white p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Highlight
                emoji="✨"
                title="Made for your routine"
                text="Easy to use, easy to love and designed for everyday life."
              />

              <Highlight
                emoji="🔥"
                title="Customer favourite"
                text="One of the products currently getting the most attention."
              />

              <Highlight
                emoji="🇮🇳"
                title="Delivered across India"
                text="Fast fulfilment with transparent delivery tracking."
              />
            </div>
          </div>
        </section>

        {/* REVIEWS */}

        <section className="mt-12">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] font-black text-orange-500">
                CUSTOMER LOVE
              </p>

              <h2 className="text-2xl font-black mt-1">
                Ratings & Reviews
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-3xl font-black">
                {product.rating ||
                  "4.5"}
              </div>

              <div>
                <div className="flex">
                  {Array.from({
                    length: 5,
                  }).map(
                    (_, index) => (
                      <Star
                        key={
                          index
                        }
                        className="w-3 h-3 fill-orange-400 text-orange-400"
                      />
                    )
                  )}
                </div>

                <p className="text-[7px] text-slate-400 mt-1">
                  Based on{" "}
                  {Number(
                    product.reviews ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}{" "}
                  reviews
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ReviewCard
              name="Aditi"
              rating={5}
              text="Exactly like the pictures. Packaging was really good and delivery was quick."
            />

            <ReviewCard
              name="Sneha"
              rating={5}
              text="Honestly worth the price. Added it to my everyday routine."
            />

            <ReviewCard
              name="Priya"
              rating={4}
              text="Good product and arrived safely. Would definitely order again."
            />
          </div>
        </section>
      </main>
    </div>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function TimeBlock({
  value,
  label,
}) {
  return (
    <div className="w-12 h-12 rounded-lg bg-white flex flex-col items-center justify-center">
      <span className="text-sm font-black text-blue-950 tabular-nums">
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

function TrustCard({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <Icon className="w-4 h-4 mx-auto text-orange-500" />

      <p className="text-[7px] font-black mt-2">
        {title}
      </p>

      <p className="text-[6px] text-slate-400 mt-1">
        {text}
      </p>
    </div>
  );
}

function Highlight({
  emoji,
  title,
  text,
}) {
  return (
    <div>
      <div className="text-3xl">
        {emoji}
      </div>

      <h3 className="text-sm font-black mt-3">
        {title}
      </h3>

      <p className="text-[8px] text-white/50 mt-2 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

function ReviewCard({
  name,
  rating,
  text,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-black">
          {name}
        </p>

        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-600 text-white">
          <span className="text-[7px] font-black">
            {rating}
          </span>

          <Star className="w-2.5 h-2.5 fill-white" />
        </div>
      </div>

      <p className="text-[9px] text-slate-500 leading-relaxed mt-3">
        “{text}”
      </p>

      <div className="flex items-center gap-1 mt-4 text-[7px] text-green-600 font-black">
        <Check className="w-3 h-3" />
        Verified Purchase
      </div>
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