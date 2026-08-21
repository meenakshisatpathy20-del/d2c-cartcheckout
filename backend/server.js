const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKey123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_mockSecret123'
});

let inventory = [
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

let completedOrders = [
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

app.get('/api/products', (req, res) => {
  res.json(inventory);
});

app.post('/api/delivery/check', (req, res) => {
  const { pincode } = req.body;
  if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
    return res.status(400).json({ error: "Enter a valid 6-digit pin code." });
  }
  res.json({
    deliverable: true,
    estimatedDays: pincode.startsWith('83') ? 2 : 3,
    courierPartner: pincode.startsWith('83') ? "Delhivery Surface" : "Blue Dart Air"
  });
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, cartTotal } = req.body;
  const c = code?.toUpperCase();
  if (c === 'D2C100') return res.json({ discountAmount: 100 });
  if (c === 'FREESHIP') return res.json({ discountAmount: 50 });
  if (c === 'FESTIVE20') return res.json({ discountAmount: Math.round(cartTotal * 0.20) });
  res.status(404).json({ message: "Invalid promo code" });
});

app.post('/api/checkout/order', async (req, res) => {
  const { items, customer, discountAmount = 0, shippingFee = 50 } = req.body;

  const orderId = `D2C-${Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceNumber = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  const fulfillments = items.map((item, idx) => {
    const prod = inventory.find(p => p.id === item.skuId) || inventory[0];
    return {
      shipmentId: `SR-${Math.floor(10000 + Math.random() * 90000)}`,
      brand: prod.brand,
      pickupWarehouse: prod.warehouseCity,
      awb: `AWB${Math.floor(10000000 + Math.random() * 90000000)}IN`,
      courier: idx % 2 === 0 ? "Delhivery Surface" : "Blue Dart Air",
      status: "SHIPPED",
      item: prod.name,
      qty: item.qty,
      image: prod.image
    };
  });

  const subtotal = items.reduce((acc, item) => {
    const prod = inventory.find(p => p.id === item.skuId) || inventory[0];
    return acc + prod.price * item.qty;
  }, 0);

  const finalOrder = {
    orderId,
    invoiceNumber,
    placedAt: new Date().toISOString(),
    status: "CONFIRMED",
    paymentStatus: "PAID",
    paymentMethod: "UPI / Razorpay",
    returnRequested: false,
    customer,
    fulfillments,
    summary: {
      itemSubtotal: subtotal,
      shippingFee,
      discountAmount,
      totalPaid: Math.max(1, subtotal + shippingFee - discountAmount)
    }
  };

  completedOrders.unshift(finalOrder);
  res.json(finalOrder);
});

app.get('/api/orders', (req, res) => {
  res.json(completedOrders);
});

app.post('/api/orders/return', (req, res) => {
  const { orderId, reason, refundMethod } = req.body;
  const order = completedOrders.find(o => o.orderId === orderId);
  if (order) {
    order.returnRequested = true;
    order.returnDetails = { reason, refundMethod, requestedAt: new Date().toISOString() };
  }
  res.json({ success: true });
});

app.post('/api/admin/inventory/update', (req, res) => {
  const { skuId, newStock } = req.body;
  const prod = inventory.find(p => p.id === skuId);
  if (prod) prod.stock = Math.max(0, parseInt(newStock, 10));
  res.json({ success: true, prod });
});

app.post('/api/admin/shipment/status', (req, res) => {
  const { orderId, shipmentId, newStatus } = req.body;
  const order = completedOrders.find(o => o.orderId === orderId);
  if (order) {
    const f = order.fulfillments.find(pkg => pkg.shipmentId === shipmentId);
    if (f) f.status = newStatus;
  }
  res.json({ success: true });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend active on port ${PORT}`));