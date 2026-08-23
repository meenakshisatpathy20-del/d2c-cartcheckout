const D2C_BRANDS_CATALOG = [
  {
    id: "sku-lux-01",
    brand: "Luxura Sciences",
    brandColor: "#059669",
    category: "beauty",
    warehouseCity: "Mumbai Bhiwandi Central Hub",
    carrier: "Amazon Shipping India (Priority)",
    name: "Vitamin C 20% Skin Glow Serum with Hyaluronic Acid (30ml)",
    price: 499,
    mrp: 899,
    stock: 142,
    rating: 4.9,
    reviewsCount: 2840,
    estimatedDays: 2,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
    description: "Pure cold-pressed Vitamin C antioxidant serum formulated with ferulic acid to brighten dull skin and diminish fine lines."
  },
  {
    id: "sku-lux-02",
    brand: "Luxura Sciences",
    brandColor: "#059669",
    category: "beauty",
    warehouseCity: "Mumbai Bhiwandi Central Hub",
    carrier: "Velocity Express Surface",
    name: "Organic Cold Pressed Castor Oil for Hair Growth (250ml)",
    price: 349,
    mrp: 599,
    stock: 98,
    rating: 4.8,
    reviewsCount: 1950,
    estimatedDays: 2,
    badge: "100% Organic",
    image: "https://images.unsplash.com/photo-1608248597359-58b68a427f71?w=600&q=80",
    description: "Hexane-free, virgin cold-pressed botanical oil designed to nourish dry scalp and strengthen hair follicles."
  },
  {
    id: "sku-hun-01",
    brand: "Hungama HiLife",
    brandColor: "#2563EB",
    category: "electronics",
    warehouseCity: "Delhi NCR Air Express Depot",
    carrier: "Amazon Shipping India (Air)",
    name: "Ultra Pro 2.01\" AMOLED Calling Smartwatch (Zinc Alloy Case)",
    price: 1999,
    mrp: 4999,
    stock: 64,
    rating: 4.8,
    reviewsCount: 3120,
    estimatedDays: 2,
    badge: "New Release",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    description: "100+ active sports modes, crisp 60Hz AMOLED screen, real-time SpO2 monitoring, and IP68 waterproof housing."
  },
  {
    id: "sku-hun-02",
    brand: "Hungama HiLife",
    brandColor: "#2563EB",
    category: "electronics",
    warehouseCity: "Delhi NCR Air Express Depot",
    carrier: "Velocity Express Air",
    name: "BassStorm ENC Wireless Quad-Mic Earbuds (40Hr Playtime)",
    price: 1299,
    mrp: 2999,
    stock: 82,
    rating: 4.7,
    reviewsCount: 1480,
    estimatedDays: 2,
    badge: "High Bass",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
    description: "13mm titanium drivers with dynamic bass boost and Environmental Noise Cancellation for distortion-free calls."
  },
  {
    id: "sku-acc-01",
    brand: "AccessHer",
    brandColor: "#D97706",
    category: "fashion",
    warehouseCity: "Jaipur Heritage Depot",
    carrier: "Amazon Shipping India (Priority)",
    name: "Traditional Gold-Plated Kundan Bridal Choker Set with Earrings",
    price: 1499,
    mrp: 3499,
    stock: 45,
    rating: 4.9,
    reviewsCount: 1870,
    estimatedDays: 3,
    badge: "Celebrity Choice",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    description: "Handcrafted antique gold-plated choker set with matching jhumkas, approved by celebrity fashion stylists."
  },
  {
    id: "sku-acc-02",
    brand: "AccessHer",
    brandColor: "#D97706",
    category: "fashion",
    warehouseCity: "Jaipur Heritage Depot",
    carrier: "Velocity Express Surface",
    name: "Rose Gold American Diamond Statement Drop Earrings",
    price: 799,
    mrp: 1899,
    stock: 73,
    rating: 4.8,
    reviewsCount: 920,
    estimatedDays: 3,
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80",
    description: "Anti-tarnish polished zircon crystal drop earrings engineered for formal evenings and weddings."
  },
  {
    id: "sku-kas-01",
    brand: "Kasrat Gym",
    brandColor: "#EA580C",
    category: "fitness",
    warehouseCity: "Bengaluru Whitefield Hub",
    carrier: "Amazon Shipping India (Surface)",
    name: "High-Density Anti-Burst Gym Exercise Ball with Foot Pump (65cm)",
    price: 899,
    mrp: 1699,
    stock: 55,
    rating: 4.7,
    reviewsCount: 760,
    estimatedDays: 2,
    badge: "Pro Gear",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    description: "Durable honeycomb construction tested to support up to 300kg weight capacity for core and balance routines."
  },
  {
    id: "sku-swg-01",
    brand: "Swarg Homes",
    brandColor: "#0284C7",
    category: "home",
    warehouseCity: "Jaipur Heritage Depot",
    carrier: "Velocity Express Surface",
    name: "Handcrafted Stoneware Ceramic Dinner Set (12-Piece)",
    price: 2499,
    mrp: 4999,
    stock: 28,
    rating: 4.9,
    reviewsCount: 1120,
    estimatedDays: 3,
    badge: "Handcrafted",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80",
    description: "Microwave and dishwasher-safe artisan stoneware glazed with organic food-safe pigments."
  }
];

let localInventory = [...D2C_BRANDS_CATALOG];

let localOrders = [
  {
    orderId: "D2C-849201",
    invoiceNumber: "INV-2026-88190",
    placedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    status: "DELIVERED",
    paymentStatus: "PAID",
    paymentMethod: "UPI / Razorpay Verified",
    returnRequested: false,
    customer: {
      name: "Meenakshi",
      phone: "+91 98765 43210",
      email: "meenakshi@d2csale.com",
      address: "BIT Mesra Campus, Academic Area",
      city: "Ranchi",
      pincode: "835215"
    },
    fulfillments: [
      {
        shipmentId: "PKG-8201",
        brand: "Luxura Sciences",
        pickupWarehouse: "Mumbai Bhiwandi Central Hub",
        carrier: "Amazon Shipping Logistics (Priority)",
        awb: "AWB9481023IN",
        courier: "Amazon Logistics Hub",
        status: "DELIVERED",
        item: "Vitamin C 20% Skin Glow Serum with Hyaluronic Acid (30ml)",
        qty: 1,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80"
      },
      {
        shipmentId: "PKG-8202",
        brand: "Hungama HiLife",
        pickupWarehouse: "Delhi NCR Air Express Depot",
        carrier: "Velocity Express Surface",
        awb: "AWB9481024IN",
        courier: "Velocity Air Express",
        status: "DELIVERED",
        item: "Ultra Pro 2.01\" AMOLED Calling Smartwatch (Zinc Alloy Case)",
        qty: 1,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
      }
    ],
    summary: { itemSubtotal: 2498, shippingFee: 0, discountAmount: 200, totalPaid: 2298 }
  }
];

let franchiseLeads = [];

export const api = {
  getProducts: async () => localInventory,

  checkDelivery: async (pincode) => ({
    deliverable: true,
    estimatedDays: pincode.startsWith('83') ? 2 : 3,
    courierPartner: pincode.startsWith('83') ? "Amazon Shipping India (Priority Air)" : "Velocity Logistics Surface"
  }),

  validateCoupon: async (code, cartTotal) => {
    const c = code?.toUpperCase();
    if (c === 'D2C100') return { discountAmount: 100 };
    if (c === 'FREESHIP') return { discountAmount: 50 };
    if (c === 'FESTIVE20') return { discountAmount: Math.round(cartTotal * 0.20) };
    throw new Error('Invalid Promo Code');
  },

  createOrder: async (payload) => {
    const orderId = `D2C-${Math.floor(100000 + Math.random() * 900000)}`;
    const invoiceNumber = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = {
      orderId,
      invoiceNumber,
      placedAt: new Date().toISOString(),
      status: "CONFIRMED",
      paymentStatus: "PAID",
      paymentMethod: payload.paymentMethod || "UPI / Razorpay Verified",
      returnRequested: false,
      customer: payload.customer,
      fulfillments: payload.items.map((item, idx) => ({
        shipmentId: `PKG-${Math.floor(10000 + Math.random() * 90000)}`,
        brand: item.brand,
        pickupWarehouse: item.warehouseCity || "Mumbai Bhiwandi Central Hub",
        carrier: idx % 2 === 0 ? "Amazon Shipping India" : "Velocity Air Logistics",
        awb: `AWB${Math.floor(10000000 + Math.random() * 90000000)}IN`,
        courier: idx % 2 === 0 ? "Amazon Logistics" : "Velocity Express",
        status: "SHIPPED",
        item: item.name,
        qty: item.qty,
        image: item.image
      })),
      summary: {
        itemSubtotal: payload.items.reduce((a, b) => a + b.price * b.qty, 0),
        shippingFee: payload.shippingFee || 0,
        discountAmount: payload.discountAmount || 0,
        totalPaid: Math.max(1, payload.items.reduce((a, b) => a + b.price * b.qty, 0) + (payload.shippingFee || 0) - (payload.discountAmount || 0))
      }
    };

    localOrders.unshift(newOrder);
    return newOrder;
  },

  getCustomerOrders: async () => localOrders,

  trackOrder: async (orderId) => {
    const q = orderId.trim().toUpperCase();
    const matched = localOrders.find(o => o.orderId.toUpperCase() === q || o.fulfillments.some(f => f.awb.toUpperCase() === q));
    if (!matched) throw new Error('No shipment found with this ID.');
    return matched;
  },

  requestReturn: async ({ orderId, reason, refundMethod }) => {
    const o = localOrders.find(ord => ord.orderId === orderId);
    if (o) {
      o.returnRequested = true;
      o.returnDetails = { reason, refundMethod, requestedAt: new Date().toISOString() };
    }
    return { success: true };
  },

  submitFranchiseLead: async (leadData) => {
    const lead = {
      id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      ...leadData,
      submittedAt: new Date().toISOString(),
      status: "QUALIFIED_PROSPECT"
    };
    franchiseLeads.unshift(lead);
    return { success: true, lead };
  },

  getFranchiseLeads: async () => franchiseLeads,

  updateStock: async (skuId, newStock) => {
    const p = localInventory.find(prod => prod.id === skuId);
    if (p) p.stock = parseInt(newStock, 10) || 0;
    return { success: true };
  },

  updateShipmentStatus: async (orderId, shipmentId, newStatus) => {
    const o = localOrders.find(ord => ord.orderId === orderId);
    if (o) {
      const f = o.fulfillments.find(pkg => pkg.shipmentId === shipmentId);
      if (f) f.status = newStatus;
    }
    return { success: true };
  }
};