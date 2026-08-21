const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DEFAULT_PRODUCTS = [
  {
    id: "sku-1",
    brand: "Essence",
    brandColor: "#00A859",
    category: "beauty",
    warehouseCity: "Mumbai Bhiwandi Hub",
    name: "Essence Mascara Lash Princess",
    price: 829,
    mrp: 1299,
    stock: 99,
    rating: 4.9,
    reviewsCount: 1420,
    estimatedDays: 2,
    image: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    description: "Cruelty-free long-lasting curl and volume mascara with conical fiber wand."
  },
  {
    id: "sku-2",
    brand: "Glamour",
    brandColor: "#0038A8",
    category: "beauty",
    warehouseCity: "Delhi NCR Hub",
    name: "Eyeshadow Palette with Mirror",
    price: 1659,
    mrp: 2499,
    stock: 34,
    rating: 4.8,
    reviewsCount: 890,
    estimatedDays: 3,
    image: "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
    description: "Highly pigmented blendable velvety shades for day-to-night eye makeup."
  },
  {
    id: "sku-3",
    brand: "Velvet Touch",
    brandColor: "#FF6B00",
    category: "beauty",
    warehouseCity: "Bengaluru Whitefield Hub",
    name: "Powder Canister Compact",
    price: 1244,
    mrp: 1899,
    stock: 89,
    rating: 4.7,
    reviewsCount: 650,
    estimatedDays: 2,
    image: "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png",
    description: "Finely milled setting powder to lock in makeup with a shine-free matte finish."
  },
  {
    id: "sku-4",
    brand: "Chic Fragrance",
    brandColor: "#8B5CF6",
    category: "fragrances",
    warehouseCity: "Jaipur Depot Hub",
    name: "Calvin Klein CK One EDT (100ml)",
    price: 3499,
    mrp: 5200,
    stock: 45,
    rating: 4.9,
    reviewsCount: 2100,
    estimatedDays: 3,
    image: "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png",
    description: "Iconic clean citrus and green tea unisex fragrance for everyday luxury."
  }
];

const INITIAL_ORDERS = [
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
      city: "Ranchi",
      pincode: "835215"
    },
    fulfillments: [
      {
        shipmentId: "SR-8201",
        brand: "Essence",
        pickupWarehouse: "Mumbai Bhiwandi Hub",
        awb: "AWB9481023IN",
        courier: "Delhivery Surface (Shiprocket)",
        status: "DELIVERED",
        item: "Essence Mascara Lash Princess",
        qty: 1,
        image: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
      },
      {
        shipmentId: "SR-8202",
        brand: "Glamour",
        pickupWarehouse: "Delhi NCR Hub",
        awb: "AWB9481024IN",
        courier: "Blue Dart Air (Shiprocket)",
        status: "DELIVERED",
        item: "Eyeshadow Palette with Mirror",
        qty: 1,
        image: "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png"
      }
    ],
    summary: { itemSubtotal: 2488, shippingFee: 50, discountAmount: 100, totalPaid: 2438 }
  }
];

// In-browser memory storage for Vercel demo mode
let localOrders = [...INITIAL_ORDERS];
let localInventory = [...DEFAULT_PRODUCTS];

export const api = {
  getProducts: async () => {
    try {
      const res = await fetch('https://dummyjson.com/products?limit=12');
      const data = await res.json();
      if (data && Array.isArray(data.products)) {
        const hubs = [
          { city: 'Mumbai Bhiwandi Hub', color: '#00A859' },
          { city: 'Delhi NCR Hub', color: '#0038A8' },
          { city: 'Bengaluru Whitefield Hub', color: '#FF6B00' },
          { city: 'Jaipur Depot Hub', color: '#8B5CF6' }
        ];
        return data.products.map((p, idx) => {
          const inr = Math.round(p.price * 83);
          const mrp = Math.round(inr * (1 + (p.discountPercentage || 15) / 100));
          const hub = hubs[idx % hubs.length];
          return {
            id: `sku-${p.id}`,
            brand: p.brand || 'D2C Direct',
            brandColor: hub.color,
            category: p.category,
            warehouseCity: hub.city,
            name: p.title,
            price: inr,
            mrp: mrp,
            stock: p.stock || 45,
            rating: p.rating || 4.8,
            reviewsCount: Math.floor((p.rating || 4.2) * 140),
            estimatedDays: 2,
            image: p.thumbnail,
            description: p.description
          };
        });
      }
    } catch (e) {}
    return localInventory;
  },

  checkDelivery: async (pincode) => {
    return {
      deliverable: true,
      estimatedDays: pincode.startsWith('83') ? 2 : 3,
      courierPartner: pincode.startsWith('83') ? "Delhivery Surface" : "Blue Dart Air"
    };
  },

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
      paymentMethod: "UPI / Razorpay",
      returnRequested: false,
      customer: payload.customer,
      fulfillments: payload.items.map((item, idx) => ({
        shipmentId: `SR-${Math.floor(10000 + Math.random() * 90000)}`,
        brand: item.brand || "D2C Brand",
        pickupWarehouse: "Mumbai Bhiwandi Hub",
        awb: `AWB${Math.floor(10000000 + Math.random() * 90000000)}IN`,
        courier: idx % 2 === 0 ? "Delhivery Surface" : "Blue Dart Air",
        status: "SHIPPED",
        item: item.name || `SKU #${item.skuId}`,
        qty: item.qty,
        image: item.image || "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
      })),
      summary: {
        itemSubtotal: payload.items.reduce((a, b) => a + (b.price || 999) * b.qty, 0),
        shippingFee: payload.shippingFee || 50,
        discountAmount: payload.discountAmount || 0,
        totalPaid: Math.max(1, payload.items.reduce((a, b) => a + (b.price || 999) * b.qty, 0) + (payload.shippingFee || 50) - (payload.discountAmount || 0))
      }
    };
    localOrders.unshift(newOrder);
    return newOrder;
  },

  getCustomerOrders: async () => {
    return localOrders;
  },

  trackOrder: async (orderId) => {
    const q = orderId.trim().toUpperCase();
    const matched = localOrders.find(o => o.orderId.toUpperCase() === q || o.fulfillments.some(f => f.awb.toUpperCase() === q));
    if (!matched) throw new Error('No order or AWB found.');
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