const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKey123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_mockSecret123'
});

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || 'admin@d2cmall.com';

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || 'D2CAdmin@2026';

const adminSessions = new Map();
const checkoutReservations = new Map();

let inventory = [
  {
    id: 'sku-1',
    brand: 'Essence',
    brandColor: '#00A859',
    category: 'beauty',
    warehouseCity: 'Mumbai Bhiwandi Hub',
    name: 'Essence Mascara Lash Princess',
    price: 829,
    mrp: 1299,
    stock: 99,
    rating: 4.9,
    reviewsCount: 1420,
    estimatedDays: 2,
    image:
      'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
    description:
      'Cruelty-free long-lasting curl and volume mascara with conical fiber wand.'
  },
  {
    id: 'sku-2',
    brand: 'Glamour',
    brandColor: '#0038A8',
    category: 'beauty',
    warehouseCity: 'Delhi NCR Hub',
    name: 'Eyeshadow Palette with Mirror',
    price: 1659,
    mrp: 2499,
    stock: 34,
    rating: 4.8,
    reviewsCount: 890,
    estimatedDays: 3,
    image:
      'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png',
    description:
      'Highly pigmented blendable velvety shades for day-to-night eye makeup.'
  },
  {
    id: 'sku-3',
    brand: 'Velvet Touch',
    brandColor: '#FF6B00',
    category: 'beauty',
    warehouseCity: 'Bengaluru Whitefield Hub',
    name: 'Powder Canister Compact',
    price: 1244,
    mrp: 1899,
    stock: 89,
    rating: 4.7,
    reviewsCount: 650,
    estimatedDays: 2,
    image:
      'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png',
    description:
      'Finely milled setting powder to lock in makeup with a shine-free matte finish.'
  },
  {
    id: 'sku-4',
    brand: 'Chic Fragrance',
    brandColor: '#8B5CF6',
    category: 'fragrances',
    warehouseCity: 'Jaipur Depot Hub',
    name: 'Calvin Klein CK One EDT (100ml)',
    price: 3499,
    mrp: 5200,
    stock: 45,
    rating: 4.9,
    reviewsCount: 2100,
    estimatedDays: 3,
    image:
      'https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png',
    description:
      'Iconic clean citrus and green tea unisex fragrance for everyday luxury.'
  }
];

let completedOrders = [
  {
    orderId: 'D2C-849201',
    invoiceNumber: 'INV-2026-88190',
    placedAt: new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'UPI / Razorpay Verified',
    returnRequested: false,
    customer: {
      customerId: 'CUS-98765432',
      name: 'Meenakshi',
      phone: '+91 98765 43210',
      email: 'meenakshi@d2csale.com',
      address: 'BIT Mesra Campus, Technology Block',
      city: 'Ranchi',
      pincode: '835215'
    },
    fulfillments: [
      {
        shipmentId: 'SR-8201',
        brand: 'Essence',
        pickupWarehouse: 'Mumbai Bhiwandi Hub',
        awb: 'AWB9481023IN',
        carrier: 'Shiprocket',
        courier: 'Delhivery Surface',
        status: 'DELIVERED',
        item: 'Essence Mascara Lash Princess',
        skuId: 'sku-1',
        qty: 1,
        image:
          'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
        trackingUrl:
          'https://www.shiprocket.in/shipment-tracking/',
        history: [
          {
            status: 'ORDER_CONFIRMED',
            title: 'Order Confirmed',
            timestamp: new Date(
              Date.now() - 24 * 60 * 60 * 1000
            ).toISOString()
          },
          {
            status: 'SHIPPED',
            title: 'Packed & Dispatched',
            timestamp: new Date(
              Date.now() - 22 * 60 * 60 * 1000
            ).toISOString()
          },
          {
            status: 'IN_TRANSIT',
            title: 'In Transit',
            timestamp: new Date(
              Date.now() - 18 * 60 * 60 * 1000
            ).toISOString()
          },
          {
            status: 'OUT_FOR_DELIVERY',
            title: 'Out for Delivery',
            timestamp: new Date(
              Date.now() - 5 * 60 * 60 * 1000
            ).toISOString()
          },
          {
            status: 'DELIVERED',
            title: 'Delivered',
            timestamp: new Date(
              Date.now() - 2 * 60 * 60 * 1000
            ).toISOString()
          }
        ]
      },
      {
        shipmentId: 'SR-8202',
        brand: 'Glamour',
        pickupWarehouse: 'Delhi NCR Hub',
        awb: 'AWB9481024IN',
        carrier: 'Shiprocket',
        courier: 'Blue Dart Air',
        status: 'DELIVERED',
        item: 'Eyeshadow Palette with Mirror',
        skuId: 'sku-2',
        qty: 1,
        image:
          'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png',
        trackingUrl:
          'https://www.shiprocket.in/shipment-tracking/',
        history: [
          {
            status: 'ORDER_CONFIRMED',
            title: 'Order Confirmed',
            timestamp: new Date(
              Date.now() - 24 * 60 * 60 * 1000
            ).toISOString()
          },
          {
            status: 'SHIPPED',
            title: 'Packed & Dispatched',
            timestamp: new Date(
              Date.now() - 22 * 60 * 60 * 1000
            ).toISOString()
          },
          {
            status: 'IN_TRANSIT',
            title: 'In Transit',
            timestamp: new Date(
              Date.now() - 18 * 60 * 60 * 1000
            ).toISOString()
          },
          {
            status: 'OUT_FOR_DELIVERY',
            title: 'Out for Delivery',
            timestamp: new Date(
              Date.now() - 5 * 60 * 60 * 1000
            ).toISOString()
          },
          {
            status: 'DELIVERED',
            title: 'Delivered',
            timestamp: new Date(
              Date.now() - 2 * 60 * 60 * 1000
            ).toISOString()
          }
        ]
      }
    ],
    summary: {
      itemSubtotal: 2488,
      shippingFee: 50,
      discountAmount: 100,
      totalPaid: 2438
    }
  }
];

let franchiseLeads = [
  {
    id: 'LEAD-1001',
    name: 'Rahul Sharma',
    phone: '+91 98765 11111',
    email: 'rahul@example.com',
    city: 'Delhi',
    preferredModel: 'FOFO',
    investmentRange: '₹25L - ₹50L',
    status: 'NEW',
    createdAt: new Date().toISOString()
  },
  {
    id: 'LEAD-1002',
    name: 'Ananya Singh',
    phone: '+91 98765 22222',
    email: 'ananya@example.com',
    city: 'Bengaluru',
    preferredModel: 'FOCO',
    investmentRange: '₹50L - ₹1Cr',
    status: 'CONTACTED',
    createdAt: new Date(
      Date.now() - 48 * 60 * 60 * 1000
    ).toISOString()
  }
];

const getCustomerId = (customer = {}, orderId = '') => {
  if (customer.customerId) {
    return customer.customerId;
  }

  const source =
    customer.phone ||
    customer.email ||
    orderId;

  const digits = String(source)
    .replace(/\D/g, '')
    .slice(-8);

  return `CUS-${digits || '00000000'}`;
};

const getOrderStatus = (order) => {
  if (!order) {
    return 'CONFIRMED';
  }

  if (!order.fulfillments?.length) {
    return order.status || 'CONFIRMED';
  }

  const statuses = order.fulfillments.map(
    (shipment) => shipment.status
  );

  if (
    statuses.length > 0 &&
    statuses.every(
      (status) => status === 'DELIVERED'
    )
  ) {
    return 'DELIVERED';
  }

  if (
    statuses.some(
      (status) => status === 'OUT_FOR_DELIVERY'
    )
  ) {
    return 'OUT_FOR_DELIVERY';
  }

  if (
    statuses.some(
      (status) => status === 'IN_TRANSIT'
    )
  ) {
    return 'IN_TRANSIT';
  }

  if (
    statuses.some((status) =>
      ['SHIPPED', 'READY_TO_SHIP'].includes(
        status
      )
    )
  ) {
    return 'SHIPPED';
  }

  return order.status || 'CONFIRMED';
};

const enrichOrder = (order) => {
  const customer = {
    ...(order.customer || {})
  };

  customer.customerId = getCustomerId(
    customer,
    order.orderId
  );

  return {
    ...order,
    status: getOrderStatus(order),
    customer,
    fulfillments: (
      order.fulfillments || []
    ).map((shipment) => ({
      ...shipment,
      carrier:
        shipment.carrier ||
        shipment.courier ||
        'Shiprocket',
      trackingUrl:
        shipment.trackingUrl ||
        'https://www.shiprocket.in/shipment-tracking/',
      history:
        shipment.history || []
    }))
  };
};

const getOrCreateCustomerId = (customer) =>
  getCustomerId(customer);

const requireAdmin = (req, res, next) => {
  const authorization =
    req.headers.authorization || '';

  if (!authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Admin authentication required'
    });
  }

  const token = authorization.slice(7);
  const session = adminSessions.get(token);

  if (!session) {
    return res.status(401).json({
      message: 'Invalid or expired admin session'
    });
  }

  req.admin = session;
  next();
};

const createOrderFromItems = ({
  items,
  customer,
  discountAmount = 0,
  shippingFee = 50,
  paymentMethod = 'UPI / Razorpay'
}) => {
  const safeItems = Array.isArray(items)
    ? items
    : [];

  const orderId = `D2C-${Math.floor(
    100000 + Math.random() * 900000
  )}`;

  const invoiceNumber = `INV-2026-${Math.floor(
    10000 + Math.random() * 90000
  )}`;

  const customerWithId = {
    ...(customer || {}),
    customerId: getOrCreateCustomerId(
      customer || {}
    )
  };

  const subtotal = safeItems.reduce(
    (total, item) => {
      const product = inventory.find(
        (productItem) =>
          productItem.id === item.skuId
      );

      if (!product) {
        return total;
      }

      return (
        total +
        Number(product.price) *
          Number(item.qty || 0)
      );
    },
    0
  );

  const fulfillments = safeItems
    .map((item, index) => {
      const product = inventory.find(
        (productItem) =>
          productItem.id === item.skuId
      );

      if (!product) {
        return null;
      }

      const shipmentId = `SR-${Math.floor(
        10000 + Math.random() * 90000
      )}`;

      const now = new Date().toISOString();

      return {
        shipmentId,
        brand: product.brand,
        pickupWarehouse:
          product.warehouseCity,
        awb: `AWB${Math.floor(
          10000000 +
            Math.random() * 90000000
        )}IN`,
        carrier: 'Shiprocket',
        courier:
          index % 2 === 0
            ? 'Delhivery Surface'
            : 'Blue Dart Air',
        status: 'SHIPPED',
        item: product.name,
        skuId: product.id,
        qty: Number(item.qty || 0),
        image: product.image,
        trackingUrl:
          'https://www.shiprocket.in/shipment-tracking/',
        history: [
          {
            status: 'ORDER_CONFIRMED',
            title: 'Order Confirmed',
            timestamp: now
          },
          {
            status: 'SHIPPED',
            title: 'Packed & Dispatched',
            timestamp: now
          }
        ]
      };
    })
    .filter(Boolean);

  const safeDiscount = Math.max(
    0,
    Math.min(
      Number(discountAmount || 0),
      subtotal
    )
  );

  const safeShipping = Math.max(
    0,
    Number(shippingFee || 0)
  );

  const totalPaid = Math.max(
    0,
    subtotal +
      safeShipping -
      safeDiscount
  );

  return {
    orderId,
    invoiceNumber,
    placedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentMethod,
    returnRequested: false,
    customer: customerWithId,
    fulfillments,
    summary: {
      itemSubtotal: subtotal,
      shippingFee: safeShipping,
      discountAmount: safeDiscount,
      totalPaid
    }
  };
};

app.get('/api/products', (req, res) => {
  res.json(inventory);
});

app.post('/api/delivery/check', (req, res) => {
  const { pincode } = req.body;

  if (
    !pincode ||
    String(pincode).length !== 6 ||
    Number.isNaN(Number(pincode))
  ) {
    return res.status(400).json({
      error:
        'Enter a valid 6-digit pin code.'
    });
  }

  const isJharkhand = String(
    pincode
  ).startsWith('83');

  res.json({
    deliverable: true,
    estimatedDays: isJharkhand ? 2 : 3,
    courierPartner: isJharkhand
      ? 'Delhivery Surface'
      : 'Blue Dart Air',
    shippingFee:
      Number(pincode) % 2 === 0 ? 0 : 50
  });
});

app.post('/api/coupons/validate', (req, res) => {
  const {
    code,
    cartTotal = 0
  } = req.body;

  const coupon =
    String(code || '').toUpperCase();

  if (
    coupon === 'D2C100' &&
    Number(cartTotal) >= 999
  ) {
    return res.json({
      discountAmount: 100,
      code: coupon
    });
  }

  if (
    coupon === 'FREESHIP' &&
    Number(cartTotal) >= 499
  ) {
    return res.json({
      discountAmount: 50,
      code: coupon
    });
  }

  if (
    coupon === 'FESTIVE20' &&
    Number(cartTotal) >= 1999
  ) {
    return res.json({
      discountAmount: Math.round(
        Number(cartTotal) * 0.2
      ),
      code: coupon
    });
  }

  return res.status(404).json({
    message:
      'Invalid coupon or minimum order value not reached.'
  });
});

app.post('/api/checkout/initiate', async (req, res) => {
  const {
    items = [],
    customer = {},
    discountAmount = 0,
    shippingFee = 50
  } = req.body;

  if (!items.length) {
    return res.status(400).json({
      message: 'Cart is empty'
    });
  }

  for (const item of items) {
    const product = inventory.find(
      (productItem) =>
        productItem.id === item.skuId
    );

    if (!product) {
      return res.status(404).json({
        message: `Product ${item.skuId} not found`
      });
    }

    if (
      Number(item.qty) <= 0 ||
      Number(item.qty) > product.stock
    ) {
      return res.status(400).json({
        message: `Insufficient stock for ${product.name}`
      });
    }
  }

  const reservationId =
    `RES-${uuidv4()}`;

  const reservation = {
    reservationId,
    items,
    customer,
    discountAmount,
    shippingFee,
    createdAt: Date.now(),
    expiresAt:
      Date.now() + 10 * 60 * 1000
  };

  checkoutReservations.set(
    reservationId,
    reservation
  );

  const subtotal = items.reduce(
    (total, item) => {
      const product = inventory.find(
        (productItem) =>
          productItem.id === item.skuId
      );

      return (
        total +
        Number(product.price) *
          Number(item.qty)
      );
    },
    0
  );

  const total = Math.max(
    0,
    subtotal +
      Number(shippingFee || 0) -
      Number(discountAmount || 0)
  );

  let razorpayOrderId =
    `order_mock_${Date.now()}`;

  try {
    if (
      process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET
    ) {
      const razorpayOrder =
        await razorpay.orders.create({
          amount: Math.round(total * 100),
          currency: 'INR',
          receipt: reservationId
        });

      razorpayOrderId =
        razorpayOrder.id;
    }
  } catch (error) {
    razorpayOrderId =
      `order_mock_${Date.now()}`;
  }

  res.json({
    reservationId,
    expiresInSeconds: 600,
    keyId:
      process.env.RAZORPAY_KEY_ID || '',
    amount: Math.round(total * 100),
    currency: 'INR',
    razorpayOrderId
  });
});

app.post('/api/checkout/verify', async (req, res) => {
  const {
    reservationId,
    razorpay_order_id,
    razorpay_payment_id
  } = req.body;

  const reservation =
    checkoutReservations.get(
      reservationId
    );

  if (!reservation) {
    return res.status(404).json({
      message:
        'Checkout reservation not found or expired.'
    });
  }

  if (
    Date.now() >
    reservation.expiresAt
  ) {
    checkoutReservations.delete(
      reservationId
    );

    return res.status(410).json({
      message:
        'Checkout reservation expired.'
    });
  }

  for (const item of reservation.items) {
    const product = inventory.find(
      (productItem) =>
        productItem.id === item.skuId
    );

    if (
      !product ||
      Number(product.stock) <
        Number(item.qty)
    ) {
      return res.status(409).json({
        message:
          'Stock changed during checkout. Please try again.'
      });
    }
  }

  reservation.items.forEach((item) => {
    const product = inventory.find(
      (productItem) =>
        productItem.id === item.skuId
    );

    product.stock -= Number(item.qty);
  });

  const order =
    createOrderFromItems({
      items: reservation.items,
      customer: reservation.customer,
      discountAmount:
        reservation.discountAmount,
      shippingFee:
        reservation.shippingFee,
      paymentMethod:
        razorpay_payment_id
          ? 'UPI / Razorpay'
          : 'UPI / Razorpay Simulated'
    });

  order.payment = {
    razorpayOrderId:
      razorpay_order_id ||
      'mock-order',
    razorpayPaymentId:
      razorpay_payment_id ||
      `pay_sim_${Date.now()}`,
    verifiedAt:
      new Date().toISOString()
  };

  completedOrders.unshift(order);

  checkoutReservations.delete(
    reservationId
  );

  res.json(enrichOrder(order));
});

app.post('/api/checkout/order', (req, res) => {
  const {
    items = [],
    customer = {},
    discountAmount = 0,
    shippingFee = 50
  } = req.body;

  if (!items.length) {
    return res.status(400).json({
      message: 'Cart is empty'
    });
  }

  for (const item of items) {
    const product = inventory.find(
      (productItem) =>
        productItem.id === item.skuId
    );

    if (!product) {
      return res.status(404).json({
        message:
          `Product ${item.skuId} not found`
      });
    }

    if (
      Number(item.qty) <= 0 ||
      Number(item.qty) > product.stock
    ) {
      return res.status(400).json({
        message:
          `Insufficient stock for ${product.name}`
      });
    }
  }

  items.forEach((item) => {
    const product = inventory.find(
      (productItem) =>
        productItem.id === item.skuId
    );

    product.stock -= Number(item.qty);
  });

  const order =
    createOrderFromItems({
      items,
      customer,
      discountAmount,
      shippingFee
    });

  completedOrders.unshift(order);

  res.json(enrichOrder(order));
});

app.get('/api/orders', (req, res) => {
  res.json(
    completedOrders.map(enrichOrder)
  );
});

app.get('/api/orders/:orderId', (req, res) => {
  const order = completedOrders.find(
    (item) =>
      item.orderId === req.params.orderId
  );

  if (!order) {
    return res.status(404).json({
      message: 'Order not found'
    });
  }

  res.json(enrichOrder(order));
});

app.post('/api/orders/return', (req, res) => {
  const {
    orderId,
    reason,
    refundMethod = 'ORIGINAL'
  } = req.body;

  const order = completedOrders.find(
    (item) =>
      item.orderId === orderId
  );

  if (!order) {
    return res.status(404).json({
      message: 'Order not found'
    });
  }

  order.returnRequested = true;
  order.status = 'RETURN_REQUESTED';
  order.updatedAt =
    new Date().toISOString();

  order.returnDetails = {
    reason,
    refundMethod,
    requestedAt:
      new Date().toISOString(),
    pickupStatus:
      'PICKUP_SCHEDULED'
  };

  res.json({
    success: true,
    order: enrichOrder(order)
  });
});

app.post('/api/admin/login', (req, res) => {
  const {
    email,
    password
  } = req.body;

  if (
    email !== ADMIN_EMAIL ||
    password !== ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      message:
        'Invalid admin email or password'
    });
  }

  const token = uuidv4();

  const session = {
    email: ADMIN_EMAIL,
    role: 'WAREHOUSE_ADMIN',
    name: 'D2C Mall Operations Admin',
    loginAt:
      new Date().toISOString()
  };

  adminSessions.set(
    token,
    session
  );

  res.json({
    success: true,
    token,
    admin: session
  });
});

app.post(
  '/api/admin/logout',
  requireAdmin,
  (req, res) => {
    const authorization =
      req.headers.authorization || '';

    const token =
      authorization.substring(7);

    adminSessions.delete(token);

    res.json({
      success: true
    });
  }
);

app.get(
  '/api/admin/health',
  requireAdmin,
  (req, res) => {
    res.json({
      success: true,
      status: 'OPERATIONAL',
      service:
        'D2C Mall Operations API',
      timestamp:
        new Date().toISOString(),
      carriers: [
        'Shiprocket',
        'Delhivery',
        'Blue Dart',
        'Amazon Shipping',
        'Velocity Express'
      ]
    });
  }
);

app.get(
  '/api/admin/dashboard/stats',
  requireAdmin,
  (req, res) => {
    const orders =
      completedOrders.map(
        enrichOrder
      );

    const shipments =
      orders.flatMap(
        (order) =>
          order.fulfillments || []
      );

    const customers = new Set(
      orders.map(
        (order) =>
          order.customer?.customerId
      )
    );

    const revenue =
      orders.reduce(
        (sum, order) =>
          sum +
          Number(
            order.summary?.totalPaid || 0
          ),
        0
      );

    const delivered =
      shipments.filter(
        (shipment) =>
          shipment.status ===
          'DELIVERED'
      ).length;

    const inTransit =
      shipments.filter(
        (shipment) =>
          [
            'SHIPPED',
            'IN_TRANSIT',
            'OUT_FOR_DELIVERY'
          ].includes(
            shipment.status
          )
      ).length;

    const pending =
      shipments.filter(
        (shipment) =>
          [
            'READY_TO_SHIP',
            'CONFIRMED'
          ].includes(
            shipment.status
          )
      ).length;

    const totalUnits =
      inventory.reduce(
        (sum, product) =>
          sum +
          Number(product.stock || 0),
        0
      );

    const lowStock =
      inventory.filter(
        (product) =>
          Number(product.stock || 0) <= 10
      );

    res.json({
      orders: {
        total: orders.length,
        confirmed: orders.filter(
          (order) =>
            order.status ===
            'CONFIRMED'
        ).length,
        shipped: orders.filter(
          (order) =>
            [
              'SHIPPED',
              'IN_TRANSIT',
              'OUT_FOR_DELIVERY'
            ].includes(
              order.status
            )
        ).length,
        delivered: orders.filter(
          (order) =>
            order.status ===
            'DELIVERED'
        ).length
      },
      customers: {
        total: customers.size
      },
      revenue: {
        total: revenue,
        averageOrderValue:
          orders.length
            ? Math.round(
                revenue /
                  orders.length
              )
            : 0
      },
      shipments: {
        total: shipments.length,
        delivered,
        inTransit,
        pending
      },
      inventory: {
        totalProducts:
          inventory.length,
        totalUnits,
        lowStock:
          lowStock.length
      },
      franchise: {
        total: franchiseLeads.length,
        newLeads:
          franchiseLeads.filter(
            (lead) =>
              lead.status === 'NEW'
          ).length
      },
      generatedAt:
        new Date().toISOString()
    });
  }
);

app.get(
  '/api/admin/orders',
  requireAdmin,
  (req, res) => {
    const {
      search = '',
      status = 'ALL',
      paymentStatus = 'ALL',
      warehouse = 'ALL',
      sort = 'newest'
    } = req.query;

    const page = Math.max(
      1,
      Number(req.query.page || 1)
    );

    const limit = Math.min(
      50,
      Math.max(
        1,
        Number(req.query.limit || 10)
      )
    );

    const query =
      String(search)
        .trim()
        .toLowerCase();

    let orders =
      completedOrders
        .map(enrichOrder)
        .filter((order) => {
          if (!query) {
            return true;
          }

          const searchable = [
            order.orderId,
            order.invoiceNumber,
            order.customer?.name,
            order.customer?.phone,
            order.customer?.email,
            order.customer?.city,
            order.customer?.pincode,
            ...(order.fulfillments || []).map(
              (shipment) =>
                shipment.awb
            ),
            ...(order.fulfillments || []).map(
              (shipment) =>
                shipment.item
            ),
            ...(order.fulfillments || []).map(
              (shipment) =>
                shipment.brand
            )
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return searchable.includes(
            query
          );
        })
        .filter((order) => {
          if (status === 'ALL') {
            return true;
          }

          return (
            order.status ===
            status
          );
        })
        .filter((order) => {
          if (
            paymentStatus ===
            'ALL'
          ) {
            return true;
          }

          return (
            order.paymentStatus ===
            paymentStatus
          );
        })
        .filter((order) => {
          if (warehouse === 'ALL') {
            return true;
          }

          return (
            order.fulfillments || []
          ).some(
            (shipment) =>
              String(
                shipment.pickupWarehouse ||
                  ''
              )
                .toLowerCase()
                .includes(
                  String(
                    warehouse
                  ).toLowerCase()
                )
          );
        });

    orders.sort((a, b) => {
      if (sort === 'oldest') {
        return (
          new Date(a.placedAt) -
          new Date(b.placedAt)
        );
      }

      if (sort === 'highest') {
        return (
          Number(
            b.summary?.totalPaid || 0
          ) -
          Number(
            a.summary?.totalPaid || 0
          )
        );
      }

      if (sort === 'lowest') {
        return (
          Number(
            a.summary?.totalPaid || 0
          ) -
          Number(
            b.summary?.totalPaid || 0
          )
        );
      }

      return (
        new Date(b.placedAt) -
        new Date(a.placedAt)
      );
    });

    const total =
      orders.length;

    const totalPages = Math.max(
      1,
      Math.ceil(
        total / limit
      )
    );

    const safePage = Math.min(
      page,
      totalPages
    );

    const start =
      (safePage - 1) *
      limit;

    const paginatedOrders =
      orders.slice(
        start,
        start + limit
      );

    res.json({
      orders:
        paginatedOrders,
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
        hasNextPage:
          safePage <
          totalPages,
        hasPreviousPage:
          safePage > 1
      },
      filters: {
        search,
        status,
        paymentStatus,
        warehouse,
        sort
      }
    });
  }
);

app.get(
  '/api/admin/orders/:orderId',
  requireAdmin,
  (req, res) => {
    const order =
      completedOrders.find(
        (item) =>
          item.orderId ===
          req.params.orderId
      );

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.json(
      enrichOrder(order)
    );
  }
);

app.post(
  '/api/admin/orders/:orderId/status',
  requireAdmin,
  (req, res) => {
    const {
      status
    } = req.body;

    const allowedStatuses = [
      'CONFIRMED',
      'PROCESSING',
      'SHIPPED',
      'IN_TRANSIT',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED',
      'RETURN_REQUESTED',
      'RETURNED'
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        message:
          'Invalid order status'
      });
    }

    const order =
      completedOrders.find(
        (item) =>
          item.orderId ===
          req.params.orderId
      );

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    order.status = status;
    order.updatedAt =
      new Date().toISOString();

    res.json({
      success: true,
      order:
        enrichOrder(order)
    });
  }
);

app.get(
  '/api/admin/customers/:customerId',
  requireAdmin,
  (req, res) => {
    const orders =
      completedOrders.map(
        enrichOrder
      );

    const customerOrders =
      orders.filter(
        (order) =>
          order.customer
            ?.customerId ===
          req.params.customerId
      );

    if (!customerOrders.length) {
      return res.status(404).json({
        message:
          'Customer not found'
      });
    }

    const customer =
      customerOrders[0].customer;

    const totalSpent =
      customerOrders.reduce(
        (sum, order) =>
          sum +
          Number(
            order.summary?.totalPaid ||
              0
          ),
        0
      );

    const totalItems =
      customerOrders.reduce(
        (sum, order) =>
          sum +
          (order.fulfillments || [])
            .reduce(
              (itemSum, shipment) =>
                itemSum +
                Number(
                  shipment.qty || 0
                ),
              0
            ),
        0
      );

    res.json({
      customer: {
        ...customer,
        totalOrders:
          customerOrders.length,
        totalSpent,
        totalItems,
        averageOrderValue:
          Math.round(
            totalSpent /
              customerOrders.length
          ),
        firstOrderAt:
          customerOrders[
            customerOrders.length - 1
          ].placedAt,
        lastOrderAt:
          customerOrders[0]
            .placedAt
      },
      orders:
        customerOrders
    });
  }
);

app.get(
  '/api/admin/shipments',
  requireAdmin,
  (req, res) => {
    const shipments = [];

    completedOrders
      .map(enrichOrder)
      .forEach((order) => {
        (
          order.fulfillments || []
        ).forEach(
          (shipment) => {
            shipments.push({
              ...shipment,
              orderId:
                order.orderId,
              invoiceNumber:
                order.invoiceNumber,
              customer:
                order.customer,
              paymentStatus:
                order.paymentStatus,
              totalPaid:
                order.summary
                  ?.totalPaid || 0
            });
          }
        );
      });

    res.json({
      shipments,
      total:
        shipments.length
    });
  }
);

app.get(
  '/api/admin/shipments/:shipmentId',
  requireAdmin,
  (req, res) => {
    for (
      const order of completedOrders
    ) {
      const shipment =
        (
          order.fulfillments || []
        ).find(
          (item) =>
            item.shipmentId ===
            req.params.shipmentId
        );

      if (shipment) {
        return res.json({
          ...shipment,
          orderId:
            order.orderId,
          invoiceNumber:
            order.invoiceNumber,
          customer:
            order.customer,
          paymentStatus:
            order.paymentStatus,
          totalPaid:
            order.summary
              ?.totalPaid || 0
        });
      }
    }

    res.status(404).json({
      message:
        'Shipment not found'
    });
  }
);

app.get(
  '/api/track/:shipmentId',
  (req, res) => {
    for (
      const order of completedOrders
    ) {
      const shipment =
        (
          order.fulfillments || []
        ).find(
          (item) =>
            item.shipmentId ===
            req.params.shipmentId
        );

      if (!shipment) {
        continue;
      }

      const status =
        shipment.status;

      const statusIndex = {
        READY_TO_SHIP: 0,
        SHIPPED: 1,
        IN_TRANSIT: 2,
        OUT_FOR_DELIVERY: 3,
        DELIVERED: 4
      };

      const current =
        statusIndex[status] ?? 0;

      const existingHistory =
        shipment.history || [];

      const timeline = [
        {
          status:
            'ORDER_CONFIRMED',
          title:
            'Order Confirmed',
          completed:
            current >= 0,
          timestamp:
            existingHistory.find(
              (item) =>
                item.status ===
                'ORDER_CONFIRMED'
            )?.timestamp ||
            order.placedAt
        },
        {
          status: 'SHIPPED',
          title:
            'Packed & Dispatched',
          completed:
            current >= 1,
          timestamp:
            existingHistory.find(
              (item) =>
                item.status ===
                'SHIPPED'
            )?.timestamp ||
            null
        },
        {
          status: 'IN_TRANSIT',
          title: 'In Transit',
          completed:
            current >= 2,
          timestamp:
            existingHistory.find(
              (item) =>
                item.status ===
                'IN_TRANSIT'
            )?.timestamp ||
            null
        },
        {
          status:
            'OUT_FOR_DELIVERY',
          title:
            'Out for Delivery',
          completed:
            current >= 3,
          timestamp:
            existingHistory.find(
              (item) =>
                item.status ===
                'OUT_FOR_DELIVERY'
            )?.timestamp ||
            null
        },
        {
          status: 'DELIVERED',
          title: 'Delivered',
          completed:
            current >= 4,
          timestamp:
            existingHistory.find(
              (item) =>
                item.status ===
                'DELIVERED'
            )?.timestamp ||
            null
        }
      ];

      return res.json({
        shipment,
        orderId:
          order.orderId,
        customer:
          order.customer,
        timeline,
        currentStatus:
          status,
        carrier:
          shipment.carrier ||
          shipment.courier,
        awb: shipment.awb
      });
    }

    res.status(404).json({
      message:
        'Shipment not found'
    });
  }
);

app.post(
  '/api/admin/shipment/status',
  requireAdmin,
  (req, res) => {
    const {
      orderId,
      shipmentId,
      newStatus
    } = req.body;

    const allowedStatuses = [
      'READY_TO_SHIP',
      'SHIPPED',
      'IN_TRANSIT',
      'OUT_FOR_DELIVERY',
      'DELIVERED'
    ];

    if (
      !allowedStatuses.includes(
        newStatus
      )
    ) {
      return res.status(400).json({
        message:
          'Invalid shipment status'
      });
    }

    const order =
      completedOrders.find(
        (item) =>
          item.orderId ===
          orderId
      );

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    const shipment =
      (
        order.fulfillments || []
      ).find(
        (item) =>
          item.shipmentId ===
          shipmentId
      );

    if (!shipment) {
      return res.status(404).json({
        message:
          'Shipment not found'
      });
    }

    const now =
      new Date().toISOString();

    shipment.status =
      newStatus;

    shipment.updatedAt = now;

    if (!shipment.history) {
      shipment.history = [];
    }

    const historyTitles = {
      READY_TO_SHIP:
        'Ready to Ship',
      SHIPPED:
        'Packed & Dispatched',
      IN_TRANSIT:
        'In Transit',
      OUT_FOR_DELIVERY:
        'Out for Delivery',
      DELIVERED:
        'Delivered'
    };

    const alreadyExists =
      shipment.history.some(
        (item) =>
          item.status ===
          newStatus
      );

    if (!alreadyExists) {
      shipment.history.push({
        status:
          newStatus,
        title:
          historyTitles[
            newStatus
          ],
        timestamp: now
      });
    }

    order.status =
      getOrderStatus(order);

    order.updatedAt = now;

    res.json({
      success: true,
      order:
        enrichOrder(order),
      shipment
    });
  }
);

app.get(
  '/api/admin/inventory',
  requireAdmin,
  (req, res) => {
    res.json({
      products:
        inventory,
      totalProducts:
        inventory.length,
      totalUnits:
        inventory.reduce(
          (sum, product) =>
            sum +
            Number(
              product.stock || 0
            ),
          0
        )
    });
  }
);

app.post(
  '/api/admin/inventory/update',
  requireAdmin,
  (req, res) => {
    const {
      skuId,
      newStock
    } = req.body;

    const stock =
      Number(newStock);

    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        message:
          'Invalid stock quantity'
      });
    }

    const product =
      inventory.find(
        (item) =>
          item.id === skuId
      );

    if (!product) {
      return res.status(404).json({
        message:
          'Product not found'
      });
    }

    product.stock =
      Math.floor(stock);

    res.json({
      success: true,
      product
    });
  }
);

app.get(
  '/api/franchise/leads',
  (req, res) => {
    res.json(franchiseLeads);
  }
);

app.post(
  '/api/franchise/leads',
  (req, res) => {
    const {
      name,
      phone,
      email,
      city,
      preferredModel,
      investmentRange
    } = req.body;

    if (
      !name ||
      !phone ||
      !email ||
      !city
    ) {
      return res.status(400).json({
        message:
          'Name, phone, email and city are required.'
      });
    }

    const lead = {
      id: `LEAD-${Math.floor(
        1000 +
          Math.random() * 9000
      )}`,
      name,
      phone,
      email,
      city,
      preferredModel:
        preferredModel ||
        'FOFO',
      investmentRange:
        investmentRange ||
        'Not specified',
      status: 'NEW',
      createdAt:
        new Date().toISOString()
    };

    franchiseLeads.unshift(lead);

    res.status(201).json(
      lead
    );
  }
);

app.put(
  '/api/franchise/leads/:leadId',
  requireAdmin,
  (req, res) => {
    const lead =
      franchiseLeads.find(
        (item) =>
          item.id ===
          req.params.leadId
      );

    if (!lead) {
      return res.status(404).json({
        message:
          'Franchise lead not found'
      });
    }

    Object.assign(
      lead,
      req.body,
      {
        id: lead.id
      }
    );

    res.json({
      success: true,
      lead
    });
  }
);

app.get(
  '/api/admin/franchise/leads',
  requireAdmin,
  (req, res) => {
    res.json({
      leads:
        franchiseLeads,
      total:
        franchiseLeads.length
    });
  }
);

app.get(
  '/api/admin/customers',
  requireAdmin,
  (req, res) => {
    const customerMap =
      new Map();

    completedOrders
      .map(enrichOrder)
      .forEach((order) => {
        const customer =
          order.customer;

        const id =
          customer.customerId;

        if (!customerMap.has(id)) {
          customerMap.set(id, {
            ...customer,
            totalOrders: 0,
            totalSpent: 0,
            totalItems: 0
          });
        }

        const existing =
          customerMap.get(id);

        existing.totalOrders += 1;

        existing.totalSpent +=
          Number(
            order.summary
              ?.totalPaid || 0
          );

        existing.totalItems +=
          (
            order.fulfillments ||
            []
          ).reduce(
            (sum, shipment) =>
              sum +
              Number(
                shipment.qty || 0
              ),
            0
          );
      });

    const customers =
      Array.from(
        customerMap.values()
      ).map((customer) => ({
        ...customer,
        averageOrderValue:
          customer.totalOrders
            ? Math.round(
                customer.totalSpent /
                  customer.totalOrders
              )
            : 0
      }));

    res.json({
      customers,
      total:
        customers.length
    });
  }
);

app.get(
  '/api/admin/recent-activity',
  requireAdmin,
  (req, res) => {
    const activity = [];

    completedOrders
      .slice(0, 10)
      .forEach((order) => {
        activity.push({
          id:
            `ORDER-${order.orderId}`,
          type: 'ORDER',
          title:
            `Order ${order.orderId} placed`,
          description:
            `${order.customer?.name || 'Customer'} placed an order worth ₹${order.summary?.totalPaid || 0}`,
          timestamp:
            order.placedAt
        });

        (
          order.fulfillments || []
        ).forEach((shipment) => {
          activity.push({
            id:
              `SHIPMENT-${shipment.shipmentId}`,
            type: 'SHIPMENT',
            title:
              `Shipment ${shipment.shipmentId}`,
            description:
              `${shipment.item} • ${shipment.status.replace(/_/g, ' ')}`,
            timestamp:
              shipment.updatedAt ||
              order.updatedAt ||
              order.placedAt
          });
        });
      });

    activity.sort(
      (a, b) =>
        new Date(b.timestamp) -
        new Date(a.timestamp)
    );

    res.json(
      activity.slice(0, 20)
    );
  }
);

app.get(
  '/api/admin/carriers',
  requireAdmin,
  (req, res) => {
    res.json({
      carriers: [
        {
          name: 'Shiprocket',
          status: 'CONNECTED',
          type: 'Aggregator',
          coverage: 'Pan-India'
        },
        {
          name: 'Delhivery',
          status: 'ACTIVE',
          type: 'Courier',
          coverage: 'Pan-India'
        },
        {
          name: 'Blue Dart',
          status: 'ACTIVE',
          type: 'Courier',
          coverage: 'Pan-India'
        },
        {
          name: 'Amazon Shipping',
          status: 'ACTIVE',
          type: 'Courier',
          coverage: 'Pan-India'
        },
        {
          name: 'Velocity Express',
          status: 'ACTIVE',
          type: 'Courier',
          coverage: 'Pan-India'
        }
      ]
    });
  }
);

app.get(
  '/api/admin/warehouses',
  requireAdmin,
  (req, res) => {
    const warehouses = [
      {
        city: 'Mumbai',
        name:
          'Mumbai Bhiwandi Central Hub',
        status: 'OPERATIONAL'
      },
      {
        city: 'Delhi',
        name:
          'Delhi NCR Air Express Depot',
        status: 'OPERATIONAL'
      },
      {
        city: 'Jaipur',
        name:
          'Jaipur Heritage Depot',
        status: 'OPERATIONAL'
      },
      {
        city: 'Bengaluru',
        name:
          'Bengaluru Whitefield Hub',
        status: 'OPERATIONAL'
      }
    ];

    const result =
      warehouses.map(
        (warehouse) => {
          const products =
            inventory.filter(
              (product) =>
                product.warehouseCity
                  .toLowerCase()
                  .includes(
                    warehouse.city.toLowerCase()
                  )
            );

          return {
            ...warehouse,
            products:
              products.length,
            units:
              products.reduce(
                (sum, product) =>
                  sum +
                  Number(
                    product.stock ||
                      0
                  ),
                0
              )
          };
        }
      );

    res.json(result);
  }
);

app.get(
  '/api/health',
  (req, res) => {
    res.json({
      status: 'OK',
      service:
        'D2C Mall Backend',
      timestamp:
        new Date().toISOString()
    });
  }
);

app.listen(
  PORT,
  () => {
    console.log(
      `Backend active on port ${PORT}`
    );
  }
);