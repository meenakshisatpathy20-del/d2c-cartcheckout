const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKey123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_mockSecret123'
});

let inventory = [
  {
    id: "sku-lux-01",
    brand: "Luxura Sciences",
    brandColor: "#00A859",
    warehouseCity: "Mumbai Hub",
    name: "Vitamin C Face Serum (30ml)",
    price: 499,
    mrp: 899,
    stock: 5,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80"
  },
  {
    id: "sku-sn-02",
    brand: "Shiv-Naresh",
    brandColor: "#0038A8",
    warehouseCity: "Delhi Hub",
    name: "Performance Dry-Fit Track Pant",
    price: 1199,
    mrp: 1899,
    stock: 3,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80"
  },
  {
    id: "sku-swarg-03",
    brand: "Swarg Homes",
    brandColor: "#FF6B00",
    warehouseCity: "Jaipur Hub",
    name: "Ceramic Handcrafted Dinner Set",
    price: 2499,
    mrp: 3999,
    stock: 2,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80"
  }
];

let activeReservations = {};
let completedOrders = [];

setInterval(() => {
  const now = Date.now();
  for (const [resId, resData] of Object.entries(activeReservations)) {
    if (now > resData.expiresAt) {
      resData.items.forEach(item => {
        const prod = inventory.find(p => p.id === item.skuId);
        if (prod) prod.stock += item.qty;
      });
      delete activeReservations[resId];
    }
  }
}, 10000);

const COUPONS = {
  "D2C100": { minOrder: 999, discount: 100, type: "FLAT" },
  "FREESHIP": { minOrder: 500, discount: 50, type: "SHIPPING" },
  "FESTIVE20": { minOrder: 1999, discount: 0.20, type: "PERCENT" }
};

app.get('/api/products', (req, res) => {
  res.json(inventory);
});

app.post('/api/shiprocket/check-pincode', (req, res) => {
  const { pincode } = req.body;
  if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
    return res.status(400).json({ error: "Enter a valid 6-digit pin code." });
  }

  const isDeliverable = !pincode.startsWith("000");
  const estimatedDays = pincode.startsWith("83") ? 2 : 4;

  res.json({
    deliverable: isDeliverable,
    estimatedDays,
    courierPartner: pincode.startsWith("83") ? "Delhivery Surface (Shiprocket)" : "Blue Dart Air (Shiprocket)",
    codAvailable: true,
    shippingFee: 50
  });
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, cartTotal } = req.body;
  const coupon = COUPONS[code?.toUpperCase()];

  if (!coupon) return res.status(404).json({ message: "Invalid promo code." });
  if (cartTotal < coupon.minOrder) {
    return res.status(400).json({ message: `Minimum order value for ${code} is ₹${coupon.minOrder}` });
  }

  let discountAmount = 0;
  if (coupon.type === "FLAT" || coupon.type === "SHIPPING") {
    discountAmount = coupon.discount;
  } else if (coupon.type === "PERCENT") {
    discountAmount = Math.round(cartTotal * coupon.discount);
  }

  res.json({ valid: true, code: code.toUpperCase(), discountAmount });
});

app.post('/api/checkout/initiate-payment', async (req, res) => {
  const { items, customer, discountAmount = 0, shippingFee = 50 } = req.body;

  for (let item of items) {
    const product = inventory.find(p => p.id === item.skuId);
    if (!product || product.stock < item.qty) {
      return res.status(400).json({ error: `Insufficient stock for ${product ? product.name : 'item'}` });
    }
  }

  items.forEach(item => {
    const product = inventory.find(p => p.id === item.skuId);
    product.stock -= item.qty;
  });

  const reservationId = uuidv4();
  const subtotal = items.reduce((acc, item) => {
    const prod = inventory.find(p => p.id === item.skuId);
    return acc + (prod.price * item.qty);
  }, 0);

  const finalPayable = Math.max(1, subtotal + shippingFee - discountAmount);

  let rzpOrderId = `order_mock_${Date.now()}`;
  try {
    const rzpOrder = await razorpay.orders.create({
      amount: finalPayable * 100,
      currency: "INR",
      receipt: `rcpt_${reservationId.substring(0, 8)}`
    });
    rzpOrderId = rzpOrder.id;
  } catch (e) {}

  activeReservations[reservationId] = {
    items,
    customer,
    discountAmount,
    shippingFee,
    payableAmount: finalPayable,
    expiresAt: Date.now() + 10 * 60 * 1000
  };

  res.json({
    reservationId,
    razorpayOrderId: rzpOrderId,
    amount: finalPayable * 100,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKey123',
    expiresInSeconds: 600
  });
});

app.post('/api/checkout/verify-payment', (req, res) => {
  const { reservationId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const reservation = activeReservations[reservationId];
  if (!reservation) {
    return res.status(400).json({ error: "Checkout session expired. Held stock was returned." });
  }

  if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature) {
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: "Payment signature mismatch." });
    }
  }

  const orderId = `D2C-${Math.floor(100000 + Math.random() * 900000)}`;

  const fulfillments = reservation.items.map((item, idx) => {
    const product = inventory.find(p => p.id === item.skuId);
    return {
      shipmentId: `SR-${Math.floor(10000 + Math.random() * 90000)}`,
      brand: product.brand,
      pickupWarehouse: product.warehouseCity,
      awb: `AWB${Math.floor(10000000 + Math.random() * 90000000)}IN`,
      courier: idx % 2 === 0 ? "Delhivery Surface" : "Blue Dart Air",
      status: "READY_TO_SHIP",
      item: product.name,
      qty: item.qty
    };
  });

  const finalOrder = {
    orderId,
    status: "CONFIRMED",
    paymentStatus: "PAID",
    paymentId: razorpay_payment_id || `pay_mock_${Date.now()}`,
    customer: reservation.customer,
    fulfillments,
    summary: {
      totalPaid: reservation.payableAmount,
      itemsCount: reservation.items.length,
      discountAmount: reservation.discountAmount,
      shippingFee: reservation.shippingFee
    },
    placedAt: new Date().toISOString()
  };

  completedOrders.unshift(finalOrder);
  delete activeReservations[reservationId];

  res.json(finalOrder);
});

app.get('/api/orders/track/:query', (req, res) => {
  const q = req.params.query.trim().toUpperCase();
  const matched = completedOrders.find(o => 
    o.orderId.toUpperCase() === q || 
    o.fulfillments.some(f => f.awb.toUpperCase() === q)
  );

  if (!matched) return res.status(404).json({ error: "No order or AWB found." });
  res.json(matched);
});

app.get('/api/admin/orders', (req, res) => {
  res.json(completedOrders);
});

app.post('/api/admin/inventory/update', (req, res) => {
  const { skuId, newStock } = req.body;
  const product = inventory.find(p => p.id === skuId);
  if (!product) return res.status(404).json({ error: "Product not found." });

  product.stock = Math.max(0, parseInt(newStock, 10));
  res.json({ message: "Stock updated successfully.", product });
});

app.post('/api/admin/shipment/update-status', (req, res) => {
  const { orderId, shipmentId, newStatus } = req.body;
  const order = completedOrders.find(o => o.orderId === orderId);
  if (!order) return res.status(404).json({ error: "Order not found." });

  const fulfillment = order.fulfillments.find(f => f.shipmentId === shipmentId);
  if (!fulfillment) return res.status(404).json({ error: "Shipment not found." });

  fulfillment.status = newStatus;
  res.json({ message: "Status updated.", fulfillment });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend active on port ${PORT}`));