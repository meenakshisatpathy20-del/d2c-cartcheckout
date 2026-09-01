import React, { useMemo, useState } from "react";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Heart,
  HelpCircle,
  Home,
  Lock,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Trash2,
  User,
  Wallet,
  X,
} from "lucide-react";

const DEFAULT_USER = {
  id: "CUS-10291",
  name: "Priyank Raj",
  email: "priyank@example.com",
  phone: "9876543210",
  joined: "2026",
};

const DEFAULT_ADDRESSES = [
  {
    id: "ADDR-1",
    type: "Home",
    name: "Priyank Raj",
    phone: "9876543210",
    address: "24, MG Road, Near City Centre",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    default: true,
  },
];

const DEFAULT_STATS = {
  orders: 12,
  delivered: 9,
  wishlist: 8,
  returns: 1,
};

const DEFAULT_ORDERS = [
  {
    id: "D2C-84729163",
    date: "Sep 1, 2026",
    status: "SHIPPED",
    amount: 908,
    items: 2,
    product: "Essence Mascara Lash Princess",
  },
  {
    id: "D2C-83917254",
    date: "Aug 24, 2026",
    status: "DELIVERED",
    amount: 1649,
    items: 3,
    product: "Hydrating Face Serum",
  },
  {
    id: "D2C-82736195",
    date: "Aug 12, 2026",
    status: "DELIVERED",
    amount: 2299,
    items: 2,
    product: "Eyeshadow Palette",
  },
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: "Your order is on the way",
    text: "D2C-84729163 has been shipped.",
    time: "12 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Price dropped on your wishlist",
    text: "One of your saved products is now cheaper.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 3,
    title: "New deals are live",
    text: "Check today's flash sale before it ends.",
    time: "Yesterday",
    unread: false,
  },
];

export default function AccountView({
  user: initialUser,
  api,
  onBack,
  onOrders,
  onWishlist,
  onTrackOrder,
  onProductClick,
  onLogout,
}) {
  const [user, setUser] = useState(
    initialUser || DEFAULT_USER
  );

  const [addresses, setAddresses] =
    useState(DEFAULT_ADDRESSES);

  const [orders, setOrders] =
    useState(DEFAULT_ORDERS);

  const [notifications, setNotifications] =
    useState(DEFAULT_NOTIFICATIONS);

  const [stats, setStats] =
    useState(DEFAULT_STATS);

  const [activeSection, setActiveSection] =
    useState("overview");

  const [showEditProfile, setShowEditProfile] =
    useState(false);

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [editingAddress, setEditingAddress] =
    useState(null);

  const [toast, setToast] =
    useState("");

  const [profileForm, setProfileForm] =
    useState({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });

  const [addressForm, setAddressForm] =
    useState({
      type: "Home",
      name: user.name || "",
      phone: user.phone || "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      default: false,
    });

  const unreadCount =
    notifications.filter(
      (item) => item.unread
    ).length;

  const menu = useMemo(
    () => [
      {
        id: "overview",
        label: "Overview",
        icon: User,
      },
      {
        id: "orders",
        label: "My Orders",
        icon: Package,
        count: stats.orders,
      },
      {
        id: "wishlist",
        label: "Wishlist",
        icon: Heart,
        count: stats.wishlist,
      },
      {
        id: "addresses",
        label: "Addresses",
        icon: MapPin,
        count: addresses.length,
      },
      {
        id: "payments",
        label: "Payments",
        icon: CreditCard,
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        count: unreadCount,
      },
      {
        id: "returns",
        label: "Returns",
        icon: RotateCcw,
        count: stats.returns,
      },
      {
        id: "security",
        label: "Security",
        icon: ShieldCheck,
      },
    ],
    [
      stats,
      addresses.length,
      unreadCount,
    ]
  );

  const showToast = (message) => {
    setToast(message);

    setTimeout(
      () => setToast(""),
      2200
    );
  };

  const updateProfile = async () => {
    if (!profileForm.name.trim()) {
      showToast(
        "Please enter your name."
      );
      return;
    }

    const updatedUser = {
      ...user,
      ...profileForm,
    };

    try {
      if (api?.updateProfile) {
        await api.updateProfile(
          updatedUser
        );
      }

      setUser(updatedUser);
      setShowEditProfile(false);
      showToast(
        "Profile updated successfully."
      );
    } catch (error) {
      showToast(
        error?.message ||
          "Unable to update profile."
      );
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      type: "Home",
      name: user.name || "",
      phone: user.phone || "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      default: false,
    });

    setEditingAddress(null);
  };

  const editAddress = (address) => {
    setAddressForm({
      ...address,
    });

    setEditingAddress(
      address.id
    );

    setShowAddressForm(true);
  };

  const saveAddress = async () => {
    if (
      !addressForm.name ||
      !addressForm.phone ||
      !addressForm.address ||
      !addressForm.city ||
      !addressForm.state ||
      !/^\d{6}$/.test(
        addressForm.pincode
      )
    ) {
      showToast(
        "Please complete the address details."
      );
      return;
    }

    const id =
      editingAddress ||
      `ADDR-${Date.now()}`;

    const newAddress = {
      ...addressForm,
      id,
    };

    let nextAddresses;

    if (editingAddress) {
      nextAddresses =
        addresses.map(
          (address) =>
            address.id ===
            editingAddress
              ? newAddress
              : address
        );
    } else {
      nextAddresses = [
        ...addresses,
        newAddress,
      ];
    }

    if (newAddress.default) {
      nextAddresses =
        nextAddresses.map(
          (address) => ({
            ...address,
            default:
              address.id ===
              id,
          })
        );
    }

    try {
      if (api?.saveAddress) {
        await api.saveAddress(
          newAddress
        );
      }

      setAddresses(
        nextAddresses
      );

      setShowAddressForm(false);
      resetAddressForm();

      showToast(
        editingAddress
          ? "Address updated."
          : "Address saved."
      );
    } catch (error) {
      showToast(
        error?.message ||
          "Unable to save address."
      );
    }
  };

  const deleteAddress = async (
    id
  ) => {
    try {
      if (api?.deleteAddress) {
        await api.deleteAddress(
          id
        );
      }

      setAddresses(
        (current) =>
          current.filter(
            (address) =>
              address.id !== id
          )
      );

      showToast(
        "Address removed."
      );
    } catch (error) {
      showToast(
        error?.message ||
          "Unable to remove address."
      );
    }
  };

  const markNotificationsRead =
    async () => {
      setNotifications(
        (current) =>
          current.map(
            (item) => ({
              ...item,
              unread: false,
            })
          )
      );

      try {
        await api?.markNotificationsRead?.();
      } catch {
        return;
      }
    };

  const handleMenu = (id) => {
    if (id === "orders") {
      onOrders?.();
      return;
    }

    if (id === "wishlist") {
      onWishlist?.();
      return;
    }

    setActiveSection(id);

    if (id === "notifications") {
      markNotificationsRead();
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] text-slate-950">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="text-[9px] font-black"
            >
              ← BACK
            </button>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" />
              <span className="text-[10px] font-black">
                MY ACCOUNT
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                onLogout?.()
              }
              className="text-[8px] font-black text-red-500"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1250px] mx-auto px-4 sm:px-6 py-6">
        <section className="relative overflow-hidden rounded-[28px] bg-blue-950 text-white p-7 sm:p-9">
          <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-xl font-black">
                {getInitials(
                  user.name
                )}
              </div>

              <div>
                <p className="text-[7px] uppercase tracking-[0.2em] text-orange-400 font-black">
                  WELCOME BACK
                </p>

                <h1 className="text-2xl sm:text-3xl font-black mt-1">
                  {user.name}
                </h1>

                <p className="text-[8px] text-white/40 mt-2">
                  Member since{" "}
                  {user.joined ||
                    "2026"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowEditProfile(
                  true
                )
              }
              className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[8px] font-black inline-flex items-center gap-2 w-fit"
            >
              <Pencil className="w-3 h-3" />
              EDIT PROFILE
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-5 mt-5">
          <aside className="bg-white rounded-2xl border border-slate-100 p-3 h-fit lg:sticky lg:top-24">
            <div className="p-3 mb-2">
              <p className="text-[7px] text-slate-400 font-black">
                ACCOUNT
              </p>

              <p className="text-[9px] font-black mt-1 truncate">
                {user.email}
              </p>
            </div>

            <div className="space-y-1">
              {menu.map(
                (item) => {
                  const Icon =
                    item.icon;

                  const active =
                    activeSection ===
                    item.id;

                  return (
                    <button
                      type="button"
                      key={
                        item.id
                      }
                      onClick={() =>
                        handleMenu(
                          item.id
                        )
                      }
                      className={`w-full h-10 rounded-xl px-3 flex items-center gap-3 text-left ${
                        active
                          ? "bg-orange-50 text-orange-600"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />

                      <span className="text-[8px] font-black flex-1">
                        {item.label}
                      </span>

                      {item.count !==
                        undefined && (
                        <span
                          className={`min-w-5 h-5 px-1 rounded-md flex items-center justify-center text-[6px] font-black ${
                            active
                              ? "bg-orange-500 text-white"
                              : "bg-slate-100"
                          }`}
                        >
                          {
                            item.count
                          }
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </div>

            <div className="border-t border-slate-100 mt-3 pt-3">
              <button
                type="button"
                onClick={() =>
                  onLogout?.()
                }
                className="w-full h-10 rounded-xl px-3 flex items-center gap-3 text-red-500"
              >
                <LogOut className="w-3.5 h-3.5" />

                <span className="text-[8px] font-black">
                  LOG OUT
                </span>
              </button>
            </div>
          </aside>

          <div>
            {activeSection ===
              "overview" && (
              <OverviewSection
                user={user}
                stats={stats}
                orders={orders}
                notifications={
                  notifications
                }
                onOrders={
                  onOrders
                }
                onWishlist={
                  onWishlist
                }
                onTrackOrder={
                  onTrackOrder
                }
                onProductClick={
                  onProductClick
                }
                setSection={
                  setActiveSection
                }
              />
            )}

            {activeSection ===
              "addresses" && (
              <AddressesSection
                addresses={
                  addresses
                }
                onAdd={() => {
                  resetAddressForm();
                  setShowAddressForm(
                    true
                  );
                }}
                onEdit={
                  editAddress
                }
                onDelete={
                  deleteAddress
                }
              />
            )}

            {activeSection ===
              "notifications" && (
              <NotificationsSection
                notifications={
                  notifications
                }
                onRead={
                  markNotificationsRead
                }
              />
            )}

            {activeSection ===
              "payments" && (
              <PaymentsSection />
            )}

            {activeSection ===
              "returns" && (
              <ReturnsSection />
            )}

            {activeSection ===
              "security" && (
              <SecuritySection />
            )}

            {activeSection ===
              "orders" && (
              <OrdersSection
                orders={orders}
                onTrackOrder={
                  onTrackOrder
                }
              />
            )}

            {activeSection ===
              "wishlist" && (
              <WishlistSection
                onWishlist={
                  onWishlist
                }
              />
            )}
          </div>
        </div>
      </main>

      {showEditProfile && (
        <EditProfileModal
          form={profileForm}
          setForm={
            setProfileForm
          }
          onClose={() =>
            setShowEditProfile(
              false
            )
          }
          onSave={
            updateProfile
          }
        />
      )}

      {showAddressForm && (
        <AddressModal
          form={addressForm}
          setForm={
            setAddressForm
          }
          editing={
            Boolean(
              editingAddress
            )
          }
          onClose={() => {
            setShowAddressForm(
              false
            );
            resetAddressForm();
          }}
          onSave={
            saveAddress
          }
        />
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100]">
          <div className="px-5 py-3 rounded-xl bg-blue-950 text-white shadow-2xl flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-green-400" />

            <span className="text-[8px] font-black">
              {toast}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   OVERVIEW
============================================================ */

function OverviewSection({
  user,
  stats,
  orders,
  notifications,
  onOrders,
  onWishlist,
  onTrackOrder,
  onProductClick,
  setSection,
}) {
  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <AccountStat
          icon={Package}
          value={stats.orders}
          label="TOTAL ORDERS"
        />

        <AccountStat
          icon={Package}
          value={stats.delivered}
          label="DELIVERED"
        />

        <AccountStat
          icon={Heart}
          value={stats.wishlist}
          label="WISHLIST"
        />

        <AccountStat
          icon={RotateCcw}
          value={stats.returns}
          label="RETURNS"
        />
      </section>

      <section className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[7px] uppercase tracking-[0.16em] text-orange-500 font-black">
              RECENT ACTIVITY
            </p>

            <h2 className="text-xl font-black mt-1">
              Your latest orders
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onOrders
            }
            className="text-[8px] font-black text-orange-600"
          >
            VIEW ALL
          </button>
        </div>

        <div className="space-y-2 mt-5">
          {orders
            .slice(0, 3)
            .map(
              (order) => (
                <OrderMiniCard
                  key={
                    order.id
                  }
                  order={
                    order
                  }
                  onTrack={() =>
                    onTrackOrder?.(
                      order
                    )
                  }
                />
              )
            )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <QuickCard
          icon={Heart}
          title="Your Wishlist"
          text={`${stats.wishlist} products saved`}
          onClick={
            onWishlist
          }
        />

        <QuickCard
          icon={MapPin}
          title="Saved Addresses"
          text="Manage your delivery addresses"
          onClick={() =>
            setSection(
              "addresses"
            )
          }
        />

        <QuickCard
          icon={Bell}
          title="Notifications"
          text={`${notifications.filter(
            (item) =>
              item.unread
          ).length} unread updates`}
          onClick={() =>
            setSection(
              "notifications"
            )
          }
        />

        <QuickCard
          icon={ShieldCheck}
          title="Account Security"
          text="Password and security controls"
          onClick={() =>
            setSection(
              "security"
            )
          }
        />
      </section>

      <section className="rounded-2xl bg-orange-50 border border-orange-100 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
            <ZapIcon />
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.14em] text-orange-600 font-black">
              D2C MALL MEMBER
            </p>

            <h2 className="text-lg font-black mt-1">
              More reasons to keep shopping.
            </h2>

            <p className="text-[7px] text-orange-700/50 mt-1">
              Get personalised deals, faster checkout and easy order management.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   ADDRESSES
============================================================ */

function AddressesSection({
  addresses,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <SectionHeader
        icon={MapPin}
        title="Saved Addresses"
        subtitle="Manage where your orders should be delivered."
        action={
          <button
            type="button"
            onClick={onAdd}
            className="h-9 px-4 rounded-lg bg-orange-500 text-white text-[8px] font-black inline-flex items-center gap-2"
          >
            <Plus className="w-3 h-3" />
            ADD ADDRESS
          </button>
        }
      />

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
        {addresses.map(
          (address) => (
            <div
              key={
                address.id
              }
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="w-3.5 h-3.5 text-orange-500" />

                  <span className="text-[9px] font-black">
                    {address.type}
                  </span>

                  {address.default && (
                    <span className="px-2 py-1 rounded-md bg-green-50 text-[6px] font-black text-green-600">
                      DEFAULT
                    </span>
                  )}
                </div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      onEdit(
                        address
                      )
                    }
                    className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(
                        address.id
                      )
                    }
                    className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p className="text-[10px] font-black mt-4">
                {address.name}
              </p>

              <p className="text-[8px] text-slate-500 leading-relaxed mt-2">
                {address.address}
                , {address.city},{" "}
                {address.state}{" "}
                -{" "}
                {address.pincode}
              </p>

              <p className="text-[8px] text-slate-500 mt-2">
                {address.phone}
              </p>
            </div>
          )
        )}

        {!addresses.length && (
          <div className="md:col-span-2 text-center py-12">
            <MapPin className="w-7 h-7 mx-auto text-slate-300" />

            <p className="text-sm font-black mt-3">
              No saved addresses
            </p>

            <button
              type="button"
              onClick={onAdd}
              className="mt-4 text-[8px] font-black text-orange-600"
            >
              ADD YOUR FIRST ADDRESS
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   NOTIFICATIONS
============================================================ */

function NotificationsSection({
  notifications,
  onRead,
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <SectionHeader
        icon={Bell}
        title="Notifications"
        subtitle="Order updates, price drops and offers."
        action={
          <button
            type="button"
            onClick={onRead}
            className="text-[8px] font-black text-orange-600"
          >
            MARK ALL READ
          </button>
        }
      />

      <div>
        {notifications.map(
          (item) => (
            <div
              key={
                item.id
              }
              className="p-5 border-b border-slate-100 flex gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-orange-500" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[9px] font-black">
                    {item.title}
                  </p>

                  {item.unread && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  )}
                </div>

                <p className="text-[8px] text-slate-500 mt-1">
                  {item.text}
                </p>

                <p className="text-[6px] text-slate-400 mt-2">
                  {item.time}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

/* ============================================================
   PAYMENTS
============================================================ */

function PaymentsSection() {
  return (
    <section className="space-y-3">
      <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <SectionHeader
          icon={CreditCard}
          title="Saved Payments"
          subtitle="Manage your preferred payment methods."
        />

        <div className="p-5">
          <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-950 text-white flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>

            <div className="flex-1">
              <p className="text-[9px] font-black">
                UPI
              </p>

              <p className="text-[7px] text-slate-400 mt-1">
                Your UPI details are securely handled during checkout.
              </p>
            </div>

            <span className="px-2 py-1 rounded-md bg-green-50 text-[6px] font-black text-green-600">
              SECURE
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-green-50 border border-green-100 p-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-green-600" />

          <div>
            <p className="text-[9px] font-black text-green-700">
              PAYMENT SECURITY
            </p>

            <p className="text-[7px] text-green-700/60 mt-1">
              D2C Mall never stores your complete card credentials.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}

/* ============================================================
   RETURNS
============================================================ */

function ReturnsSection() {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <SectionHeader
        icon={RotateCcw}
        title="Returns & Replacements"
        subtitle="Track your active and previous return requests."
      />

      <div className="p-5">
        <div className="rounded-xl bg-slate-50 p-6 text-center">
          <RotateCcw className="w-7 h-7 mx-auto text-slate-300" />

          <h3 className="text-sm font-black mt-3">
            Return management
          </h3>

          <p className="text-[8px] text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
            Your return requests will appear here with pickup status, refund information and resolution details.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECURITY
============================================================ */

function SecuritySection() {
  return (
    <section className="space-y-3">
      <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <SectionHeader
          icon={ShieldCheck}
          title="Security"
          subtitle="Protect your D2C Mall account."
        />

        <div className="p-5 space-y-2">
          <SecurityRow
            icon={Lock}
            title="Password"
            text="Change your account password"
          />

          <SecurityRow
            icon={Smartphone}
            title="Mobile number"
            text="Manage your verified mobile number"
          />

          <SecurityRow
            icon={ShieldCheck}
            title="Login activity"
            text="Review recent account activity"
          />
        </div>
      </section>

      <section className="rounded-2xl bg-blue-950 text-white p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-green-400" />

          <div>
            <p className="text-[9px] font-black">
              KEEP YOUR ACCOUNT SAFE
            </p>

            <p className="text-[7px] text-white/40 mt-2 leading-relaxed">
              Never share your OTP, password or payment credentials with anyone.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}

/* ============================================================
   ORDERS
============================================================ */

function OrdersSection({
  orders,
  onTrackOrder,
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <SectionHeader
        icon={Package}
        title="My Orders"
        subtitle="Your complete order history."
      />

      <div className="p-5 space-y-2">
        {orders.map(
          (order) => (
            <OrderMiniCard
              key={
                order.id
              }
              order={
                order
              }
              onTrack={() =>
                onTrackOrder?.(
                  order
                )
              }
            />
          )
        )}
      </div>
    </section>
  );
}

/* ============================================================
   WISHLIST
============================================================ */

function WishlistSection({
  onWishlist,
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-pink-50 mx-auto flex items-center justify-center">
        <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
      </div>

      <h2 className="text-xl font-black mt-4">
        Your wishlist is waiting
      </h2>

      <p className="text-[8px] text-slate-400 max-w-sm mx-auto mt-2">
        Open your saved products and continue where you left off.
      </p>

      <button
        type="button"
        onClick={
          onWishlist
        }
        className="mt-5 h-10 px-5 rounded-xl bg-orange-500 text-white text-[8px] font-black"
      >
        OPEN WISHLIST
      </button>
    </section>
  );
}

/* ============================================================
   ORDER CARD
============================================================ */

function OrderMiniCard({
  order,
  onTrack,
}) {
  const status =
    String(
      order.status ||
        "PROCESSING"
    ).toUpperCase();

  return (
    <div className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
        <Package className="w-4 h-4 text-orange-500" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[9px] font-black">
            {order.id}
          </p>

          <StatusPill
            status={
              status
            }
          />
        </div>

        <p className="text-[8px] text-slate-500 truncate mt-1">
          {order.product ||
            "Multiple products"}
        </p>

        <p className="text-[6px] text-slate-400 mt-2">
          {order.date} ·{" "}
          {order.items}{" "}
          items
        </p>
      </div>

      <div className="sm:text-right">
        <p className="text-sm font-black">
          {formatCurrency(
            order.amount
          )}
        </p>

        <button
          type="button"
          onClick={onTrack}
          className="text-[7px] font-black text-orange-600 mt-2 inline-flex items-center gap-1"
        >
          TRACK
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   QUICK CARD
============================================================ */

function QuickCard({
  icon: Icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-3 text-left hover:border-orange-200 transition"
    >
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
        <Icon className="w-4 h-4 text-orange-500" />
      </div>

      <div className="flex-1">
        <p className="text-[9px] font-black">
          {title}
        </p>

        <p className="text-[7px] text-slate-400 mt-1">
          {text}
        </p>
      </div>

      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
    </button>
  );
}

/* ============================================================
   STATS
============================================================ */

function AccountStat({
  icon: Icon,
  value,
  label,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-orange-500" />
      </div>

      <p className="text-xl font-black mt-3">
        {value}
      </p>

      <p className="text-[6px] text-slate-400 font-black mt-1">
        {label}
      </p>
    </div>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}) {
  return (
    <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-orange-500" />
        </div>

        <div>
          <h2 className="text-sm font-black">
            {title}
          </h2>

          <p className="text-[7px] text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      {action}
    </div>
  );
}

/* ============================================================
   SECURITY ROW
============================================================ */

function SecurityRow({
  icon: Icon,
  title,
  text,
}) {
  return (
    <button
      type="button"
      className="w-full rounded-xl border border-slate-200 p-4 flex items-center gap-3 text-left"
    >
      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
      </div>

      <div className="flex-1">
        <p className="text-[9px] font-black">
          {title}
        </p>

        <p className="text-[7px] text-slate-400 mt-1">
          {text}
        </p>
      </div>

      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
    </button>
  );
}

/* ============================================================
   PROFILE MODAL
============================================================ */

function EditProfileModal({
  form,
  setForm,
  onClose,
  onSave,
}) {
  return (
    <ModalShell
      title="Edit Profile"
      subtitle="Update your personal information."
      onClose={onClose}
    >
      <div className="space-y-3">
        <ModalField
          label="FULL NAME"
          value={form.name}
          onChange={(value) =>
            setForm({
              ...form,
              name: value,
            })
          }
        />

        <ModalField
          label="EMAIL"
          value={form.email}
          onChange={(value) =>
            setForm({
              ...form,
              email: value,
            })
          }
          type="email"
        />

        <ModalField
          label="MOBILE"
          value={form.phone}
          onChange={(value) =>
            setForm({
              ...form,
              phone: value,
            })
          }
          inputMode="numeric"
        />

        <button
          type="button"
          onClick={onSave}
          className="w-full h-11 rounded-xl bg-orange-500 text-white text-[8px] font-black mt-3"
        >
          SAVE CHANGES
        </button>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   ADDRESS MODAL
============================================================ */

function AddressModal({
  form,
  setForm,
  editing,
  onClose,
  onSave,
}) {
  const update =
    (field) =>
    (value) =>
      setForm({
        ...form,
        [field]: value,
      });

  return (
    <ModalShell
      title={
        editing
          ? "Edit Address"
          : "Add Address"
      }
      subtitle="Save a delivery address for faster checkout."
      onClose={onClose}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ModalField
          label="NAME"
          value={form.name}
          onChange={update(
            "name"
          )}
        />

        <ModalField
          label="MOBILE"
          value={form.phone}
          onChange={update(
            "phone"
          )}
          inputMode="numeric"
        />

        <div className="sm:col-span-2">
          <ModalField
            label="ADDRESS"
            value={form.address}
            onChange={update(
              "address"
            )}
          />
        </div>

        <ModalField
          label="CITY"
          value={form.city}
          onChange={update(
            "city"
          )}
        />

        <ModalField
          label="STATE"
          value={form.state}
          onChange={update(
            "state"
          )}
        />

        <ModalField
          label="PINCODE"
          value={form.pincode}
          onChange={update(
            "pincode"
          )}
          inputMode="numeric"
          maxLength={6}
        />

        <div>
          <label className="block text-[7px] font-black mb-2">
            TYPE
          </label>

          <div className="flex gap-2">
            {[
              "Home",
              "Work",
              "Other",
            ].map(
              (type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() =>
                    setForm({
                      ...form,
                      type,
                    })
                  }
                  className={`flex-1 h-10 rounded-xl border text-[7px] font-black ${
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

        <label className="sm:col-span-2 flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={
              Boolean(
                form.default
              )
            }
            onChange={(
              event
            ) =>
              setForm({
                ...form,
                default:
                  event.target
                    .checked,
              })
            }
          />

          <span className="text-[8px] font-bold">
            Make this my default address
          </span>
        </label>

        <button
          type="button"
          onClick={onSave}
          className="sm:col-span-2 w-full h-11 rounded-xl bg-orange-500 text-white text-[8px] font-black mt-2"
        >
          {editing
            ? "UPDATE ADDRESS"
            : "SAVE ADDRESS"}
        </button>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   MODAL
============================================================ */

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black">
              {title}
            </h2>

            <p className="text-[7px] text-slate-400 mt-1">
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FIELD
============================================================ */

function ModalField({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  maxLength,
}) {
  return (
    <div>
      <label className="block text-[7px] font-black mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value || ""}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        inputMode={
          inputMode
        }
        maxLength={
          maxLength
        }
        className="w-full h-10 rounded-xl bg-slate-50 border border-transparent px-3 text-xs outline-none focus:bg-white focus:border-orange-500"
      />
    </div>
  );
}

/* ============================================================
   STATUS
============================================================ */

function StatusPill({
  status,
}) {
  const styles = {
    DELIVERED:
      "bg-green-50 text-green-600",
    SHIPPED:
      "bg-blue-50 text-blue-600",
    PROCESSING:
      "bg-orange-50 text-orange-600",
    CANCELLED:
      "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`px-2 py-1 rounded-md text-[6px] font-black ${
        styles[status] ||
        "bg-slate-100 text-slate-500"
      }`}
    >
      {String(status)
        .replaceAll(
          "_",
          " "
        )}
    </span>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function getInitials(
  name
) {
  return String(
    name || "D2C"
  )
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]
    )
    .join("")
    .toUpperCase();
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

function ZapIcon() {
  return (
    <span className="text-white font-black text-lg">
      ⚡
    </span>
  );
}