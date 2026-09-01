const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const adminRoutes = require("./src/routes/adminRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const warehouseRoutes = require("./src/routes/warehouseRoutes");
const inventoryAdminRoutes = require("./src/routes/inventoryAdminRoutes");
const returnRoutes = require("./src/routes/returnRoutes");
const shipmentRoutes = require("./src/routes/shipmentRoutes");
const shiprocketWebhookRoutes = require("./src/routes/shiprocketWebhookRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const products = [
  {
    id: "sku-1",
    sku: "D2C-BEAUTY-001",
    name: "Essence Mascara",
    brand: "Essence",
    category: "Beauty",
    price: 699,
    mrp: 999,
    discount: 30,
    rating: 4.5,
    reviewsCount: 184,
    stock: 42,
    warehouseCity: "Mumbai",
    estimatedDays: 2,
    image:
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=800&q=80",
    description:
      "Volumising mascara designed for everyday definition and long-lasting wear.",
    isTrending: true,
    isNew: true
  },
  {
    id: "sku-2",
    sku: "D2C-BEAUTY-002",
    name: "Glamour Eyeshadow Palette",
    brand: "Glamour",
    category: "Beauty",
    price: 1199,
    mrp: 1799,
    discount: 33,
    rating: 4.6,
    reviewsCount: 226,
    stock: 31,
    warehouseCity: "Delhi",
    estimatedDays: 2,
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    description:
      "Highly pigmented eyeshadow palette with versatile everyday and party shades.",
    isTrending: true,
    isNew: true
  },
  {
    id: "sku-3",
    sku: "D2C-BEAUTY-003",
    name: "Velvet Touch Face Powder",
    brand: "Velvet Touch",
    category: "Beauty",
    price: 849,
    mrp: 1299,
    discount: 35,
    rating: 4.4,
    reviewsCount: 143,
    stock: 18,
    warehouseCity: "Bengaluru",
    estimatedDays: 3,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    description:
      "Lightweight pressed powder with a smooth natural finish.",
    isTrending: false,
    isNew: true
  },
  {
    id: "sku-4",
    sku: "D2C-FRAGRANCE-001",
    name: "Chic Fragrance Eau De Parfum",
    brand: "Chic",
    category: "Fragrance",
    price: 1499,
    mrp: 2499,
    discount: 40,
    rating: 4.7,
    reviewsCount: 318,
    stock: 26,
    warehouseCity: "Jaipur",
    estimatedDays: 3,
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    description:
      "Modern everyday fragrance with a clean, elegant and long-lasting profile.",
    isTrending: true,
    isNew: false
  },
  {
    id: "sku-5",
    sku: "D2C-FASHION-001",
    name: "Oversized Essential T-Shirt",
    brand: "Urban Thread",
    category: "Fashion",
    price: 799,
    mrp: 1299,
    discount: 38,
    rating: 4.6,
    reviewsCount: 521,
    stock: 64,
    warehouseCity: "Mumbai",
    estimatedDays: 2,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    description:
      "Relaxed oversized cotton t-shirt built for everyday streetwear.",
    isTrending: true,
    isNew: true
  },
  {
    id: "sku-6",
    sku: "D2C-FASHION-002",
    name: "Classic Denim Jacket",
    brand: "Blue State",
    category: "Fashion",
    price: 1799,
    mrp: 2999,
    discount: 40,
    rating: 4.5,
    reviewsCount: 267,
    stock: 21,
    warehouseCity: "Delhi",
    estimatedDays: 2,
    image:
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=800&q=80",
    description:
      "Classic denim jacket with a contemporary relaxed silhouette.",
    isTrending: true,
    isNew: false
  },
  {
    id: "sku-7",
    sku: "D2C-FASHION-003",
    name: "Women Fashion Handbag",
    brand: "AccessHer",
    category: "Fashion",
    price: 1299,
    mrp: 2499,
    discount: 48,
    rating: 4.6,
    reviewsCount: 74,
    stock: 24,
    warehouseCity: "Mumbai",
    estimatedDays: 3,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    description:
      "Contemporary everyday handbag designed for work, shopping and casual occasions.",
    isTrending: true,
    isNew: false
  },
  {
    id: "sku-8",
    sku: "D2C-HOME-001",
    name: "Minimal Ceramic Vase",
    brand: "Casa Living",
    category: "Home",
    price: 899,
    mrp: 1499,
    discount: 40,
    rating: 4.5,
    reviewsCount: 96,
    stock: 33,
    warehouseCity: "Jaipur",
    estimatedDays: 3,
    image:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    description:
      "Minimal ceramic decor piece designed for modern interiors.",
    isTrending: false,
    isNew: true
  }
];

const completedOrders = [
  {
    orderId: "D2C-849201",
    invoiceNumber: "INV-2026-88190",
    placedAt: "2026-08-28T10:20:00.000Z",
    status: "DELIVERED",
    paymentStatus: "PAID",
    paymentMethod: "UPI / Razorpay Verified",
    returnRequested: false,
    customer: {
      name: "Meenakshi",
      phone: "9876543210",
      email: "customer@d2cmall.com",
      address: "12 Main Road",
      city: "Ranchi",
      state: "Jharkhand",
      pincode: "834001"
    },
    items: [
      {
        id: "sku-1",
        sku: "D2C-BEAUTY-001",
        name: "Essence Mascara",
        brand: "Essence",
        price: 699,
        qty: 1,
        image:
          "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "sku-5",
        sku: "D2C-FASHION-001",
        name: "Oversized Essential T-Shirt",
        brand: "Urban Thread",
        price: 799,
        qty: 1,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
      }
    ],
    fulfillments: [
      {
        shipmentId: "SHP-8201",
        awb: "D2C84920101",
        brand: "Essence",
        pickupWarehouse: "Mumbai Bhiwandi Central Hub",
        carrier: "Amazon Shipping",
        courier: "Amazon Shipping",
        status: "DELIVERED",
        item: "Essence Mascara",
        qty: 1,
        image:
          "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=800&q=80",
        estimatedDays: 2,
        destinationPincode: "834001",
        destinationCity: "Ranchi"
      },
      {
        shipmentId: "SHP-8202",
        awb: "D2C84920102",
        brand: "Urban Thread",
        pickupWarehouse: "Mumbai Bhiwandi Central Hub",
        carrier: "Velocity Express",
        courier: "Velocity Express",
        status: "DELIVERED",
        item: "Oversized Essential T-Shirt",
        qty: 1,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
        estimatedDays: 3,
        destinationPincode: "834001",
        destinationCity: "Ranchi"
      }
    ],
    summary: {
      itemSubtotal: 1498,
      shippingFee: 0,
      discountAmount: 100,
      totalPaid: 1398
    }
  }
];

const warehouses = [
  {
    id: "WH-MUM-01",
    name: "Mumbai Bhiwandi Central Hub",
    city: "Mumbai",
    state: "Maharashtra",
    status: "OPERATIONAL",
    capacity: 86,
    availableUnits: 12840,
    reservedUnits: 1840,
    lowStockSkus: 12
  },
  {
    id: "WH-DEL-01",
    name: "Delhi NCR Air Express Depot",
    city: "Delhi",
    state: "Delhi",
    status: "OPERATIONAL",
    capacity: 78,
    availableUnits: 10420,
    reservedUnits: 1420,
    lowStockSkus: 9
  },
  {
    id: "WH-JAI-01",
    name: "Jaipur Fulfillment Depot",
    city: "Jaipur",
    state: "Rajasthan",
    status: "OPERATIONAL",
    capacity: 64,
    availableUnits: 7820,
    reservedUnits: 920,
    lowStockSkus: 7
  },
  {
    id: "WH-BLR-01",
    name: "Bengaluru Whitefield Hub",
    city: "Bengaluru",
    state: "Karnataka",
    status: "OPERATIONAL",
    capacity: 71,
    availableUnits: 9360,
    reservedUnits: 1160,
    lowStockSkus: 11
  }
];

const warehouseQueues = [];
const inventoryMovements = [];
const inventoryTransfers = [];
const returns = [];
const shipments = [];
const shipmentWebhookEvents = [];
const reservations = [];
const customers = new Map();

for (const order of completedOrders) {
  if (order.customer?.email) {
    customers.set(order.customer.email, {
      id: `CUS-${customers.size + 1001}`,
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
      addresses: [
        {
          label: "Home",
          address: order.customer.address,
          city: order.customer.city,
          state: order.customer.state,
          pincode: order.customer.pincode
        }
      ],
      orders: [order.orderId],
      lifetimeValue: order.summary?.totalPaid || 0,
      orderCount: 1,
      lastOrderAt: order.placedAt
    });
  }

  for (const fulfillment of order.fulfillments || []) {
    shipments.push({
      ...fulfillment,
      orderId: order.orderId,
      customer: order.customer?.name,
      customerPhone: order.customer?.phone,
      customerEmail: order.customer?.email,
      expectedDelivery: order.placedAt
    });
  }
}

app.locals.products = products;
app.locals.completedOrders = completedOrders;
app.locals.warehouses = warehouses;
app.locals.warehouseQueues = warehouseQueues;
app.locals.inventoryMovements = inventoryMovements;
app.locals.inventoryTransfers = inventoryTransfers;
app.locals.returns = returns;
app.locals.shipments = shipments;
app.locals.shipmentWebhookEvents = shipmentWebhookEvents;
app.locals.reservations = reservations;
app.locals.customers = customers;

app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "D2C Mall API",
    version: "2.0.0",
    status: "online"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/products", (req, res) => {
  let result = [...app.locals.products];

  const search = String(req.query.search || "").trim().toLowerCase();
  const category = String(req.query.category || "").trim().toLowerCase();
  const brand = String(req.query.brand || "").trim().toLowerCase();

  if (search) {
    result = result.filter((product) =>
      [
        product.name,
        product.brand,
        product.category,
        product.sku
      ].some((value) =>
        String(value || "").toLowerCase().includes(search)
      )
    );
  }

  if (category && category !== "all") {
    result = result.filter(
      (product) =>
        String(product.category || "").toLowerCase() === category
    );
  }

  if (brand && brand !== "all") {
    result = result.filter(
      (product) =>
        String(product.brand || "").toLowerCase() === brand
    );
  }

  if (req.query.sort === "price-low") {
    result.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (req.query.sort === "price-high") {
    result.sort((a, b) => Number(b.price) - Number(a.price));
  }

  if (req.query.sort === "rating") {
    result.sort((a, b) => Number(b.rating) - Number(a.rating));
  }

  if (req.query.sort === "discount") {
    result.sort((a, b) => Number(b.discount) - Number(a.discount));
  }

  res.json(result);
});

app.get("/api/products/:id", (req, res) => {
  const product = app.locals.products.find(
    (item) =>
      String(item.id) === String(req.params.id) ||
      String(item.sku) === String(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found."
    });
  }

  res.json(product);
});

app.get("/api/delivery/check", (req, res) => {
  const pincode = String(req.query.pincode || "");

  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid 6-digit pincode."
    });
  }

  const firstDigit = Number(pincode.charAt(0));

  let estimatedDays = 3;
  let courierPartner = "Velocity Express";

  if ([1, 2, 3].includes(firstDigit)) {
    estimatedDays = 2;
    courierPartner = "Amazon Shipping";
  } else if ([4, 5, 6].includes(firstDigit)) {
    estimatedDays = 2;
    courierPartner = "Velocity Express";
  } else if ([7, 8].includes(firstDigit)) {
    estimatedDays = 3;
    courierPartner = "Amazon Shipping";
  } else {
    estimatedDays = 4;
  }

  res.json({
    serviceable: true,
    deliverable: true,
    pincode,
    estimatedDays,
    courierPartner,
    message: `Delivery available in approximately ${estimatedDays} business days.`
  });
});

app.post("/api/coupons/validate", (req, res) => {
  const code = String(req.body.code || "").trim().toUpperCase();
  const subtotal = Number(req.body.subtotal || 0);

  const coupons = {
    FESTIVE20: {
      minOrder: 1999,
      type: "PERCENT",
      value: 20
    },
    FREESHIP: {
      minOrder: 499,
      type: "SHIPPING",
      value: 50
    },
    D2C100: {
      minOrder: 999,
      type: "FLAT",
      value: 100
    },
    WELCOME100: {
      minOrder: 999,
      type: "FLAT",
      value: 100
    },
    D2CMALL200: {
      minOrder: 1999,
      type: "FLAT",
      value: 200
    }
  };

  const coupon = coupons[code];

  if (!coupon) {
    return res.status(400).json({
      success: false,
      message: "Invalid coupon code."
    });
  }

  if (subtotal < coupon.minOrder) {
    return res.status(400).json({
      success: false,
      message: `Minimum order value is ₹${coupon.minOrder}.`
    });
  }

  let discountAmount = 0;

  if (coupon.type === "PERCENT") {
    discountAmount = Math.round(subtotal * coupon.value / 100);
  }

  if (coupon.type === "FLAT") {
    discountAmount = Math.min(coupon.value, subtotal);
  }

  if (coupon.type === "SHIPPING") {
    discountAmount = coupon.value;
  }

  res.json({
    valid: true,
    code,
    discountAmount,
    type: coupon.type,
    minimumOrder: coupon.minOrder
  });
});

app.post("/api/checkout/order", (req, res) => {
  const body = req.body || {};
  const cart = Array.isArray(body.cart)
    ? body.cart
    : Array.isArray(body.items)
    ? body.items
    : [];

  if (!cart.length) {
    return res.status(400).json({
      success: false,
      message: "Your cart is empty."
    });
  }

  const customer = body.customer || {};

  if (
    !customer.name ||
    !customer.phone ||
    !customer.address ||
    !customer.city ||
    !customer.state ||
    !customer.pincode
  ) {
    return res.status(400).json({
      success: false,
      message: "Complete delivery details are required."
    });
  }

  let subtotal = 0;

  const items = cart.map((item) => {
    const product = app.locals.products.find(
      (productItem) =>
        String(productItem.id) === String(item.id) ||
        String(productItem.sku) === String(item.sku)
    );

    if (!product) {
      throw new Error(`Product ${item.id || item.sku} is no longer available.`);
    }

    const qty = Math.max(1, Number(item.qty) || 1);

    if (Number(product.stock) < qty) {
      throw new Error(
        `Only ${product.stock} units of ${product.name} are available.`
      );
    }

    subtotal += Number(product.price) * qty;

    return {
      ...product,
      qty
    };
  });

  const discountAmount = Math.min(
    Math.max(0, Number(body.discountAmount) || 0),
    subtotal
  );

  const shippingFee = Math.max(0, Number(body.shippingFee) || 0);

  const totalPaid = Math.max(
    0,
    subtotal + shippingFee - discountAmount
  );

  const orderId = `D2C-${Date.now().toString().slice(-8)}${Math.floor(
    Math.random() * 100
  )}`;

  const invoiceNumber = `INV-2026-${Math.floor(
    10000 + Math.random() * 90000
  )}`;

  const fulfillments = items.map((item) => {
    const carrier =
      item.warehouseCity === "Mumbai" ||
      item.warehouseCity === "Delhi"
        ? "Amazon Shipping"
        : "Velocity Express";

    return {
      shipmentId: `SHP-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      awb: `D2C${Date.now().toString().slice(-8)}${Math.floor(
        Math.random() * 100
      )
        .toString()
        .padStart(2, "0")}`,
      brand: item.brand,
      pickupWarehouse: item.warehouseCity || "Central Warehouse",
      carrier,
      courier: carrier,
      status: "READY_TO_SHIP",
      item: item.name,
      qty: item.qty,
      image: item.image,
      estimatedDays: item.estimatedDays || 3,
      destinationPincode: customer.pincode,
      destinationCity: customer.city
    };
  });

  const order = {
    orderId,
    invoiceNumber,
    placedAt: new Date().toISOString(),
    status: "CONFIRMED",
    paymentStatus:
      body.paymentMethod === "COD" ? "COD" : "PAID",
    paymentMethod: body.paymentMethod || "RAZORPAY",
    returnRequested: false,
    customer,
    items,
    fulfillments,
    summary: {
      itemSubtotal: subtotal,
      subtotal,
      shippingFee,
      discountAmount,
      totalPaid
    }
  };

  app.locals.completedOrders.unshift(order);

  for (const item of items) {
    const product = app.locals.products.find(
      (productItem) => productItem.id === item.id
    );

    if (product) {
      product.stock = Math.max(
        0,
        Number(product.stock) - Number(item.qty)
      );
    }
  }

  for (const fulfillment of fulfillments) {
    app.locals.shipments.unshift({
      ...fulfillment,
      orderId,
      customer: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email
    });
  }

  res.status(201).json(order);
});

app.get("/api/orders/customer", (req, res) => {
  res.json(app.locals.completedOrders);
});

app.get("/api/orders/customer/:orderId", (req, res) => {
  const order = app.locals.completedOrders.find(
    (item) =>
      String(item.orderId).toLowerCase() ===
      String(req.params.orderId).toLowerCase()
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found."
    });
  }

  res.json(order);
});

app.patch("/api/orders/customer/:orderId/cancel", (req, res) => {
  const order = app.locals.completedOrders.find(
    (item) =>
      String(item.orderId) === String(req.params.orderId)
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found."
    });
  }

  if (
    ["SHIPPED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"].includes(
      order.status
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "This order can no longer be cancelled."
    });
  }

  order.status = "CANCELLED";
  order.cancelledAt = new Date().toISOString();

  res.json(order);
});

app.post("/api/orders/return", (req, res) => {
  const { orderId, reason, refundMethod } = req.body || {};

  const order = app.locals.completedOrders.find(
    (item) => String(item.orderId) === String(orderId)
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found."
    });
  }

  if (order.status !== "DELIVERED") {
    return res.status(400).json({
      success: false,
      message: "Return can only be requested after delivery."
    });
  }

  const returnRequest = {
    returnId: `RET-${Date.now()}`,
    orderId,
    customer: order.customer,
    reason: reason || "Other",
    refundMethod: refundMethod || "ORIGINAL",
    status: "PICKUP_SCHEDULED",
    createdAt: new Date().toISOString(),
    pickupEta: "Within 24 hours"
  };

  order.returnRequested = true;
  order.returnRequest = returnRequest;

  app.locals.returns.unshift(returnRequest);

  res.status(201).json(returnRequest);
});

app.use("/api/admin", adminRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/admin/inventory", inventoryAdminRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/webhooks", shiprocketWebhookRoutes);

app.get("/api/admin/customers", (req, res) => {
  const values = Array.from(app.locals.customers.values());

  const search = String(req.query.search || "").trim().toLowerCase();

  const filtered = search
    ? values.filter((customer) =>
        [
          customer.id,
          customer.name,
          customer.email,
          customer.phone
        ].some((value) =>
          String(value || "").toLowerCase().includes(search)
        )
      )
    : values;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

  const start = (page - 1) * limit;

  res.json({
    success: true,
    data: filtered.slice(start, start + limit),
    customers: filtered.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit)
    }
  });
});

app.get("/api/admin/customers/:id", (req, res) => {
  const customer = Array.from(app.locals.customers.values()).find(
    (item) => String(item.id) === String(req.params.id)
  );

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found."
    });
  }

  const orders = app.locals.completedOrders.filter(
    (order) =>
      order.customer?.email === customer.email
  );

  res.json({
    success: true,
    ...customer,
    orders,
    orderHistory: orders
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error."
  });
});

app.listen(PORT, () => {
  console.log(`D2C Mall backend active on port ${PORT}`);
});