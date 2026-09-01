import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CreditCard,
  Gift,
  Home,
  Lock,
  MapPin,
  Plus,
  ShieldCheck,
  Smartphone,
  Truck,
  Wallet,
  X,
  Zap,
} from "lucide-react";

const DEFAULT_ADDRESSES = [
  {
    id: "ADDR1",
    name: "Priyank Raj",
    phone: "9876543210",
    address:
      "24, MG Road, Near City Centre",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    type: "Home",
  },
];

const DEFAULT_CART = [
  {
    id: "P1",
    name: "Essence Mascara Lash Princess",
    brand: "Essence",
    price: 829,
    mrp: 1299,
    quantity: 1,
    image:
      "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
  },
  {
    id: "P2",
    name: "Eyeshadow Palette with Mirror",
    brand: "Glamour",
    price: 1659,
    mrp: 2499,
    quantity: 1,
    image:
      "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
  },
];

const PAYMENT_METHODS = [
  {
    id: "upi",
    title: "UPI",
    subtitle: "Google Pay, PhonePe, Paytm & more",
    icon: Smartphone,
  },
  {
    id: "card",
    title: "Credit / Debit Card",
    subtitle: "Visa, Mastercard, RuPay & more",
    icon: CreditCard,
  },
  {
    id: "netbanking",
    title: "Net Banking",
    subtitle: "All major Indian banks",
    icon: Home,
  },
  {
    id: "wallet",
    title: "Wallets",
    subtitle: "Paytm, Mobikwik & more",
    icon: Wallet,
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    subtitle: "Pay when your order arrives",
    icon: Truck,
  },
];

export default function CheckoutView({
  cart: initialCart,
  checkoutData,
  api,
  onBack,
  onPlaceOrder,
  onAddressChange,
}) {
  const cart =
    initialCart?.length
      ? initialCart
      : checkoutData?.items?.length
      ? checkoutData.items
      : DEFAULT_CART;

  const [addresses, setAddresses] =
    useState(
      checkoutData?.addresses?.length
        ? checkoutData.addresses
        : DEFAULT_ADDRESSES
    );

  const [selectedAddressId, setSelectedAddressId] =
    useState(
      addresses[0]?.id || ""
    );

  const [paymentMethod, setPaymentMethod] =
    useState("upi");

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [showAllAddresses, setShowAllAddresses] =
    useState(false);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [giftOrder, setGiftOrder] =
    useState(false);

  const [giftMessage, setGiftMessage] =
    useState("");

  const [deliveryOption, setDeliveryOption] =
    useState("standard");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    type: "Home",
  });

  const [formError, setFormError] =
    useState("");

  const [checkoutError, setCheckoutError] =
    useState("");

  const [upiId, setUpiId] =
    useState("");

  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const selectedAddress =
    addresses.find(
      (address) =>
        address.id ===
        selectedAddressId
    ) || null;

  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          Number(item.quantity || 1),
      0
    );

    const mrpTotal = cart.reduce(
      (sum, item) =>
        sum +
        Number(item.mrp || item.price || 0) *
          Number(item.quantity || 1),
      0
    );

    const discount = Math.max(
      mrpTotal - subtotal,
      0
    );

    const couponDiscount =
      Number(
        checkoutData?.totals
          ?.couponDiscount || 0
      );

    const standardDelivery =
      subtotal >= 999 ? 0 : 79;

    const expressDelivery =
      subtotal >= 1999 ? 99 : 149;

    const delivery =
      deliveryOption === "express"
        ? expressDelivery
        : standardDelivery;

    const total =
      subtotal -
      couponDiscount +
      delivery;

    return {
      subtotal,
      mrpTotal,
      discount,
      couponDiscount,
      delivery,
      total,
      savings:
        discount +
        couponDiscount,
    };
  }, [
    cart,
    checkoutData,
    deliveryOption,
  ]);

  const visibleAddresses =
    showAllAddresses
      ? addresses
      : addresses.slice(0, 2);

  const updateForm = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const validateAddress = () => {
    if (!form.name.trim()) {
      return "Enter the recipient name.";
    }

    if (
      !/^\d{10}$/.test(
        form.phone.replace(/\D/g, "")
      )
    ) {
      return "Enter a valid 10-digit mobile number.";
    }

    if (!form.address.trim()) {
      return "Enter your complete address.";
    }

    if (!form.city.trim()) {
      return "Enter your city.";
    }

    if (!form.state.trim()) {
      return "Enter your state.";
    }

    if (
      !/^\d{6}$/.test(
        form.pincode
      )
    ) {
      return "Enter a valid 6-digit pincode.";
    }

    return "";
  };

  const addAddress = async () => {
    const error =
      validateAddress();

    if (error) {
      setFormError(error);
      return;
    }

    const newAddress = {
      ...form,
      id: `ADDR-${Date.now()}`,
    };

    setAddresses((current) => [
      ...current,
      newAddress,
    ]);

    setSelectedAddressId(
      newAddress.id
    );

    setShowAddressForm(false);
    setFormError("");

    try {
      await api?.addAddress?.(
        newAddress
      );
    } catch {
      // Final backend wiring comes later.
    }

    onAddressChange?.(
      newAddress
    );
  };

  const validatePayment = () => {
    if (
      paymentMethod ===
      "upi"
    ) {
      if (
        upiId &&
        !/^[\w.-]+@[\w.-]+$/.test(
          upiId
        )
      ) {
        return "Enter a valid UPI ID.";
      }
    }

    if (
      paymentMethod ===
      "card"
    ) {
      const digits =
        card.number.replace(
          /\s/g,
          ""
        );

      if (
        digits.length < 13 ||
        digits.length > 19
      ) {
        return "Enter a valid card number.";
      }

      if (!card.expiry) {
        return "Enter card expiry.";
      }

      if (
        !/^\d{3,4}$/.test(
          card.cvv
        )
      ) {
        return "Enter a valid CVV.";
      }

      if (!card.name.trim()) {
        return "Enter the name on the card.";
      }
    }

    return "";
  };

  const handlePlaceOrder = async () => {
    setCheckoutError("");

    if (!selectedAddress) {
      setCheckoutError(
        "Please select a delivery address."
      );
      return;
    }

    const paymentError =
      validatePayment();

    if (paymentError) {
      setCheckoutError(
        paymentError
      );
      return;
    }

    const orderPayload = {
      items: cart,
      address: selectedAddress,
      paymentMethod,
      deliveryOption,
      gift: giftOrder
        ? {
            enabled: true,
            message:
              giftMessage,
          }
        : {
            enabled: false,
          },
      totals,
    };

    try {
      setPlacingOrder(true);

      let response = null;

      if (api?.createOrder) {
        response =
          await api.createOrder(
            orderPayload
          );
      }

      await onPlaceOrder?.(
        response || {
          order: {
            ...orderPayload,
            orderId: `D2C-${Date.now()
              .toString()
              .slice(-8)}`,
            createdAt:
              new Date().toISOString(),
          },
        }
      );
    } catch (error) {
      setCheckoutError(
        error?.message ||
          "Unable to place the order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] text-slate-950">
      {/* HEADER */}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-[9px] font-black"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO BAG
            </button>

            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-green-600" />

              <span className="text-[9px] font-black">
                SECURE CHECKOUT
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[7px] font-black text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              SSL PROTECTED
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1250px] mx-auto px-4 sm:px-6 py-6">
        {/* PROGRESS */}

        <div className="flex items-center justify-center mb-8">
          <CheckoutStep
            number="01"
            label="Bag"
            done
          />

          <ProgressLine
            active
          />

          <CheckoutStep
            number="02"
            label="Address"
            active
          />

          <ProgressLine />

          <CheckoutStep
            number="03"
            label="Payment"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-5">
          {/* LEFT */}

          <div className="space-y-5">
            {/* ADDRESS */}

            <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-orange-500" />
                  </div>

                  <div>
                    <h1 className="text-sm font-black">
                      Delivery Address
                    </h1>

                    <p className="text-[7px] text-slate-400 mt-1">
                      Where should we send your order?
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowAddressForm(
                      true
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-[8px] font-black hover:border-orange-500"
                >
                  <Plus className="w-3 h-3" />
                  ADD NEW
                </button>
              </div>

              <div className="p-5 space-y-3">
                {visibleAddresses.map(
                  (address) => (
                    <AddressCard
                      key={
                        address.id
                      }
                      address={
                        address
                      }
                      selected={
                        selectedAddressId ===
                        address.id
                      }
                      onSelect={() =>
                        setSelectedAddressId(
                          address.id
                        )
                      }
                    />
                  )
                )}

                {addresses.length >
                  2 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllAddresses(
                        (current) =>
                          !current
                      )
                    }
                    className="w-full h-10 rounded-xl bg-slate-50 text-[8px] font-black text-slate-600"
                  >
                    {showAllAddresses
                      ? "SHOW LESS"
                      : `VIEW ${addresses.length - 2} MORE ADDRESSES`}
                  </button>
                )}

                {!addresses.length && (
                  <div className="text-center py-8">
                    <MapPin className="w-6 h-6 mx-auto text-slate-300" />

                    <p className="text-xs font-black mt-3">
                      Add a delivery address
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* NEW ADDRESS FORM */}

            {showAddressForm && (
              <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-black">
                      Add New Address
                    </h2>

                    <p className="text-[7px] text-slate-400 mt-1">
                      All fields marked below are required.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowAddressForm(
                        false
                      )
                    }
                    className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field
                      label="Full Name"
                      value={
                        form.name
                      }
                      onChange={(value) =>
                        updateForm(
                          "name",
                          value
                        )
                      }
                      placeholder="Recipient name"
                    />

                    <Field
                      label="Mobile Number"
                      value={
                        form.phone
                      }
                      onChange={(value) =>
                        updateForm(
                          "phone",
                          value
                        )
                      }
                      placeholder="10-digit mobile"
                      inputMode="numeric"
                      maxLength={10}
                    />

                    <div className="sm:col-span-2">
                      <Field
                        label="Complete Address"
                        value={
                          form.address
                        }
                        onChange={(value) =>
                          updateForm(
                            "address",
                            value
                          )
                        }
                        placeholder="House / flat / building, street, area"
                      />
                    </div>

                    <Field
                      label="City"
                      value={
                        form.city
                      }
                      onChange={(value) =>
                        updateForm(
                          "city",
                          value
                        )
                      }
                      placeholder="City"
                    />

                    <Field
                      label="State"
                      value={
                        form.state
                      }
                      onChange={(value) =>
                        updateForm(
                          "state",
                          value
                        )
                      }
                      placeholder="State"
                    />

                    <Field
                      label="Pincode"
                      value={
                        form.pincode
                      }
                      onChange={(value) =>
                        updateForm(
                          "pincode",
                          value
                        )
                      }
                      placeholder="6-digit pincode"
                      inputMode="numeric"
                      maxLength={6}
                    />

                    <div>
                      <label className="block text-[8px] font-black mb-2">
                        ADDRESS TYPE
                      </label>

                      <div className="flex gap-2">
                        {[
                          "Home",
                          "Work",
                        ].map(
                          (type) => (
                            <button
                              type="button"
                              key={
                                type
                              }
                              onClick={() =>
                                updateForm(
                                  "type",
                                  type
                                )
                              }
                              className={`flex-1 h-10 rounded-xl border text-[8px] font-black ${
                                form.type ===
                                type
                                  ? "border-orange-500 bg-orange-50 text-orange-600"
                                  : "border-slate-200"
                              }`}
                            >
                              {type}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {formError && (
                    <div className="mt-4 rounded-xl bg-red-50 border border-red-100 p-3">
                      <p className="text-[8px] font-black text-red-600">
                        {formError}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={
                      addAddress
                    }
                    className="mt-5 h-11 px-5 rounded-xl bg-orange-500 text-white text-[9px] font-black"
                  >
                    SAVE ADDRESS
                  </button>
                </div>
              </section>
            )}

            {/* DELIVERY OPTIONS */}

            <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-orange-500" />

                  <div>
                    <h2 className="text-sm font-black">
                      Delivery Options
                    </h2>

                    <p className="text-[7px] text-slate-400 mt-1">
                      Choose how quickly you want it.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <DeliveryOption
                  id="standard"
                  selected={
                    deliveryOption ===
                    "standard"
                  }
                  onClick={() =>
                    setDeliveryOption(
                      "standard"
                    )
                  }
                  title="Standard Delivery"
                  subtitle="Delivered in 2–5 business days"
                  price={
                    totals.subtotal >=
                    999
                      ? "FREE"
                      : formatCurrency(
                          79
                        )
                  }
                  icon={Truck}
                />

                <DeliveryOption
                  id="express"
                  selected={
                    deliveryOption ===
                    "express"
                  }
                  onClick={() =>
                    setDeliveryOption(
                      "express"
                    )
                  }
                  title="Express Delivery"
                  subtitle="Priority delivery in 1–2 business days"
                  price={formatCurrency(
                    totals.subtotal >=
                      1999
                      ? 99
                      : 149
                  )}
                  icon={Zap}
                />
              </div>
            </section>

            {/* PAYMENT */}

            <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-orange-500" />

                  <div>
                    <h2 className="text-sm font-black">
                      Payment Method
                    </h2>

                    <p className="text-[7px] text-slate-400 mt-1">
                      All payments are encrypted and secure.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="space-y-2">
                  {PAYMENT_METHODS.map(
                    (method) => {
                      const Icon =
                        method.icon;

                      const selected =
                        paymentMethod ===
                        method.id;

                      return (
                        <button
                          type="button"
                          key={
                            method.id
                          }
                          onClick={() =>
                            setPaymentMethod(
                              method.id
                            )
                          }
                          className={`w-full text-left rounded-xl border p-4 flex items-center gap-3 transition ${
                            selected
                              ? "border-orange-500 bg-orange-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              selected
                                ? "bg-orange-500 text-white"
                                : "bg-slate-50 text-slate-500"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1">
                            <p className="text-[9px] font-black">
                              {
                                method.title
                              }
                            </p>

                            <p className="text-[7px] text-slate-400 mt-1">
                              {
                                method.subtitle
                              }
                            </p>
                          </div>

                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selected
                                ? "border-orange-500"
                                : "border-slate-300"
                            }`}
                          >
                            {selected && (
                              <div className="w-2 h-2 rounded-full bg-orange-500" />
                            )}
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>

                {/* UPI */}

                {paymentMethod ===
                  "upi" && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50">
                    <label className="text-[8px] font-black">
                      UPI ID
                    </label>

                    <div className="flex gap-2 mt-2">
                      <input
                        value={
                          upiId
                        }
                        onChange={(
                          event
                        ) =>
                          setUpiId(
                            event.target
                              .value
                          )
                        }
                        placeholder="yourname@upi"
                        className="flex-1 h-10 rounded-lg bg-white border border-slate-200 px-3 text-xs outline-none focus:border-orange-500"
                      />

                      <button
                        type="button"
                        className="px-4 h-10 rounded-lg bg-blue-950 text-white text-[8px] font-black"
                      >
                        VERIFY
                      </button>
                    </div>
                  </div>
                )}

                {/* CARD */}

                {paymentMethod ===
                  "card" && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50">
                    <div className="space-y-3">
                      <Field
                        label="CARD NUMBER"
                        value={
                          card.number
                        }
                        onChange={(value) =>
                          setCard(
                            (
                              current
                            ) => ({
                              ...current,
                              number:
                                value,
                            })
                          )
                        }
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                        maxLength={19}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <Field
                          label="EXPIRY"
                          value={
                            card.expiry
                          }
                          onChange={(value) =>
                            setCard(
                              (
                                current
                              ) => ({
                                ...current,
                                expiry:
                                  value,
                              })
                            )
                          }
                          placeholder="MM/YY"
                        />

                        <Field
                          label="CVV"
                          value={
                            card.cvv
                          }
                          onChange={(value) =>
                            setCard(
                              (
                                current
                              ) => ({
                                ...current,
                                cvv: value,
                              })
                            )
                          }
                          placeholder="CVV"
                          inputMode="numeric"
                          maxLength={4}
                        />
                      </div>

                      <Field
                        label="NAME ON CARD"
                        value={
                          card.name
                        }
                        onChange={(value) =>
                          setCard(
                            (
                              current
                            ) => ({
                              ...current,
                              name: value,
                            })
                          )
                        }
                        placeholder="Cardholder name"
                      />
                    </div>
                  </div>
                )}

                {/* COD */}

                {paymentMethod ===
                  "cod" && (
                  <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-100">
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-600 mt-0.5" />

                      <div>
                        <p className="text-[9px] font-black text-green-700">
                          CASH ON DELIVERY AVAILABLE
                        </p>

                        <p className="text-[7px] text-green-600 mt-1">
                          Pay safely when your order arrives at your doorstep.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* GIFT */}

            <section className="bg-white rounded-2xl border border-slate-100 p-5">
              <button
                type="button"
                onClick={() =>
                  setGiftOrder(
                    (current) =>
                      !current
                  )
                }
                className="w-full flex items-center gap-3 text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center">
                  <Gift className="w-4 h-4 text-pink-500" />
                </div>

                <div className="flex-1">
                  <p className="text-[9px] font-black">
                    THIS IS A GIFT
                  </p>

                  <p className="text-[7px] text-slate-400 mt-1">
                    Add a personal message.
                  </p>
                </div>

                <div
                  className={`w-9 h-5 rounded-full transition ${
                    giftOrder
                      ? "bg-orange-500"
                      : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white mt-0.5 transition ${
                      giftOrder
                        ? "translate-x-4"
                        : "translate-x-0.5"
                    }`}
                  />
                </div>
              </button>

              {giftOrder && (
                <textarea
                  value={
                    giftMessage
                  }
                  onChange={(event) =>
                    setGiftMessage(
                      event.target
                        .value
                    )
                  }
                  maxLength={250}
                  placeholder="Write your gift message..."
                  className="w-full h-24 mt-4 rounded-xl bg-slate-50 border border-transparent focus:border-orange-500 outline-none p-3 text-xs resize-none"
                />
              )}
            </section>
          </div>

          {/* RIGHT SUMMARY */}

          <aside className="lg:sticky lg:top-24 h-fit space-y-3">
            {/* ITEMS */}

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black">
                    Your Order
                  </h2>

                  <span className="text-[8px] font-bold text-slate-400">
                    {cart.length}{" "}
                    items
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {cart.map(
                  (item) => (
                    <div
                      key={
                        item.id
                      }
                      className="flex gap-3"
                    >
                      <div className="relative w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        {item.image && (
                          <img
                            src={
                              item.image
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}

                        <span className="absolute right-1 top-1 min-w-4 h-4 px-1 rounded-full bg-blue-950 text-white text-[6px] font-black flex items-center justify-center">
                          {
                            item.quantity
                          }
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[7px] text-slate-400 font-black">
                          {
                            item.brand
                          }
                        </p>

                        <p className="text-[9px] font-black truncate mt-1">
                          {
                            item.name
                          }
                        </p>

                        <p className="text-[9px] font-black mt-2">
                          {formatCurrency(
                            Number(
                              item.price ||
                                0
                            ) *
                              Number(
                                item.quantity ||
                                  1
                              )
                          )}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* PRICE */}

            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h2 className="text-sm font-black">
                Price Details
              </h2>

              <div className="space-y-3 mt-5">
                <PriceRow
                  label="Total MRP"
                  value={
                    totals.mrpTotal
                  }
                />

                <PriceRow
                  label="Product Discount"
                  value={
                    -totals.discount
                  }
                  green
                />

                {totals.couponDiscount >
                  0 && (
                  <PriceRow
                    label="Coupon Discount"
                    value={
                      -totals.couponDiscount
                    }
                    green
                  />
                )}

                <PriceRow
                  label={
                    deliveryOption ===
                    "express"
                      ? "Express Delivery"
                      : "Standard Delivery"
                  }
                  value={
                    totals.delivery
                  }
                  free={
                    totals.delivery ===
                    0
                  }
                />

                <div className="border-t border-dashed border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">
                      Total Amount
                    </span>

                    <span className="text-xl font-black">
                      {formatCurrency(
                        totals.total
                      )}
                    </span>
                  </div>

                  {totals.savings >
                    0 && (
                    <div className="mt-3 rounded-xl bg-green-50 p-3 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-green-600" />

                      <span className="text-[8px] font-black text-green-700">
                        You're saving{" "}
                        {formatCurrency(
                          totals.savings
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {checkoutError && (
                <div className="mt-4 rounded-xl bg-red-50 border border-red-100 p-3">
                  <p className="text-[8px] font-black text-red-600">
                    {checkoutError}
                  </p>
                </div>
              )}

              <button
                type="button"
                disabled={
                  placingOrder
                }
                onClick={
                  handlePlaceOrder
                }
                className="w-full h-12 rounded-xl bg-orange-500 text-white text-[10px] font-black mt-5 flex items-center justify-center gap-2 hover:bg-orange-600 disabled:opacity-50"
              >
                {placingOrder
                  ? "PLACING ORDER..."
                  : "PLACE ORDER"}

                {!placingOrder && (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-[7px] text-slate-400">
                <Lock className="w-3 h-3 text-green-600" />
                Secure encrypted checkout
              </div>
            </div>

            {/* ADDRESS SUMMARY */}

            {selectedAddress && (
              <div className="bg-white rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[8px] font-black">
                    DELIVERING TO
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      window.scrollTo({
                        top: 0,
                        behavior:
                          "smooth",
                      })
                    }
                    className="text-[7px] font-black text-orange-600"
                  >
                    CHANGE
                  </button>
                </div>

                <p className="text-[9px] font-black mt-3">
                  {
                    selectedAddress.name
                  }
                </p>

                <p className="text-[8px] text-slate-500 leading-relaxed mt-1">
                  {
                    selectedAddress.address
                  }
                  ,{" "}
                  {
                    selectedAddress.city
                  }
                  ,{" "}
                  {
                    selectedAddress.state
                  }{" "}
                  -{" "}
                  {
                    selectedAddress.pincode
                  }
                </p>

                <p className="text-[8px] text-slate-500 mt-2">
                  {
                    selectedAddress.phone
                  }
                </p>
              </div>
            )}

            {/* SECURITY */}

            <div className="rounded-2xl bg-blue-950 text-white p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" />

                <p className="text-[9px] font-black">
                  SHOP WITH CONFIDENCE
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <MiniTrust
                  title="Secure"
                  text="Payments"
                />

                <MiniTrust
                  title="Easy"
                  text="Returns"
                />

                <MiniTrust
                  title="Fast"
                  text="Delivery"
                />

                <MiniTrust
                  title="24/7"
                  text="Support"
                />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   ADDRESS
============================================================ */

function AddressCard({
  address,
  selected,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-xl border p-4 transition ${
        selected
          ? "border-orange-500 bg-orange-50/50"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
            selected
              ? "border-orange-500"
              : "border-slate-300"
          }`}
        >
          {selected && (
            <div className="w-2 h-2 rounded-full bg-orange-500" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[9px] font-black">
              {address.name}
            </p>

            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[6px] font-black">
              {address.type ||
                "Home"}
            </span>
          </div>

          <p className="text-[8px] text-slate-500 leading-relaxed mt-2">
            {address.address}
            , {address.city},{" "}
            {address.state} -{" "}
            {address.pincode}
          </p>

          <p className="text-[8px] text-slate-500 mt-2">
            {address.phone}
          </p>
        </div>
      </div>
    </button>
  );
}

/* ============================================================
   DELIVERY
============================================================ */

function DeliveryOption({
  selected,
  onClick,
  title,
  subtitle,
  price,
  icon: Icon,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-4 flex items-center gap-3 ${
        selected
          ? "border-orange-500 bg-orange-50"
          : "border-slate-200"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
          selected
            ? "bg-orange-500 text-white"
            : "bg-slate-50 text-slate-500"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1">
        <p className="text-[9px] font-black">
          {title}
        </p>

        <p className="text-[7px] text-slate-400 mt-1">
          {subtitle}
        </p>
      </div>

      <span
        className={`text-[8px] font-black ${
          price === "FREE"
            ? "text-green-600"
            : ""
        }`}
      >
        {price}
      </span>

      <div
        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
          selected
            ? "border-orange-500"
            : "border-slate-300"
        }`}
      >
        {selected && (
          <div className="w-2 h-2 rounded-full bg-orange-500" />
        )}
      </div>
    </button>
  );
}

/* ============================================================
   FORM
============================================================ */

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  maxLength,
}) {
  return (
    <div>
      <label className="block text-[8px] font-black mb-2">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
        inputMode={
          inputMode
        }
        maxLength={
          maxLength
        }
        className="w-full h-10 rounded-xl bg-slate-50 border border-transparent px-3 text-xs outline-none focus:border-orange-500 focus:bg-white"
      />
    </div>
  );
}

/* ============================================================
   SUMMARY
============================================================ */

function PriceRow({
  label,
  value,
  green,
  free,
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[9px] text-slate-500">
        {label}
      </span>

      {free ? (
        <span className="text-[9px] font-black text-green-600">
          FREE
        </span>
      ) : (
        <span
          className={`text-[9px] font-black ${
            green
              ? "text-green-600"
              : ""
          }`}
        >
          {value < 0
            ? "-"
            : ""}
          {formatCurrency(
            Math.abs(value)
          )}
        </span>
      )}
    </div>
  );
}

function CheckoutStep({
  number,
  label,
  active,
  done,
}) {
  return (
    <div
      className={`flex items-center gap-2 ${
        active || done
          ? "text-blue-950"
          : "text-slate-300"
      }`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-black ${
          done
            ? "bg-green-600 text-white"
            : active
            ? "bg-orange-500 text-white"
            : "bg-slate-100"
        }`}
      >
        {done ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          number
        )}
      </div>

      <span className="text-[8px] font-black uppercase">
        {label}
      </span>
    </div>
  );
}

function ProgressLine({
  active,
}) {
  return (
    <div
      className={`w-16 sm:w-24 h-px mx-3 sm:mx-4 ${
        active
          ? "bg-orange-500"
          : "bg-slate-200"
      }`}
    />
  );
}

function MiniTrust({
  title,
  text,
}) {
  return (
    <div className="rounded-xl bg-white/10 p-3">
      <p className="text-[8px] font-black">
        {title}
      </p>

      <p className="text-[7px] text-white/40 mt-1">
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