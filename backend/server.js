const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const razorpay = new Razorpay({
  key_id:
    process.env.RAZORPAY_KEY_ID ||
    'rzp_test_mockKey123',
  key_secret:
    process.env.RAZORPAY_KEY_SECRET ||
    'rzp_secret_mockSecret123'
});

const ADMIN_USERNAME =
  process.env.ADMIN_USERNAME || 'admin';

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || 'D2CAdmin@2026';

const SHIPROCKET_EMAIL =
  process.env.SHIPROCKET_EMAIL || '';

const SHIPROCKET_PASSWORD =
  process.env.SHIPROCKET_PASSWORD || '';

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
    lowStockThreshold: 10,
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
    lowStockThreshold: 10,
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
    warehouseCity:
      'Bengaluru Whitefield Hub',
    name: 'Powder Canister Compact',
    price: 1244,
    mrp: 1899,
    stock: 89,
    lowStockThreshold: 10,
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
    warehouseCity:
      'Jaipur Depot Hub',
    name: 'Calvin Klein CK One EDT (100ml)',
    price: 3499,
    mrp: 5200,
    stock: 45,
    lowStockThreshold: 10,
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
      Date.now() - 86400000
    ).toISOString(),
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'UPI / Razorpay Verified',
    returnRequested: false,
    customer: {
      customerId: 'CUS-10001',
      name: 'Meenakshi',
      phone: '+91 98765 43210',
      email: 'meenakshi@d2csale.com',
      address:
        'BIT Mesra Campus, Technology Block',
      city: 'Ranchi',
      state: 'Jharkhand',
      pincode: '835215'
    },
    fulfillments: [
      {
        shipmentId: 'SR-8201',
        brand: 'Essence',
        pickupWarehouse:
          'Mumbai Bhiwandi Hub',
        awb: 'AWB9481023IN',
        courier:
          'Delhivery Surface',
        status: 'DELIVERED',
        item:
          'Essence Mascara Lash Princess',
        qty: 1,
        image:
          'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
        trackingEvents: [
          {
            status: 'CONFIRMED',
            location: 'Mumbai',
            timestamp: new Date(
              Date.now() - 82000000
            ).toISOString()
          },
          {
            status: 'SHIPPED',
            location: 'Mumbai Bhiwandi',
            timestamp: new Date(
              Date.now() - 70000000
            ).toISOString()
          },
          {
            status: 'IN_TRANSIT',
            location: 'Ranchi',
            timestamp: new Date(
              Date.now() - 30000000
            ).toISOString()
          },
          {
            status: 'DELIVERED',
            location: 'Ranchi',
            timestamp: new Date().toISOString()
          }
        ]
      },
      {
        shipmentId: 'SR-8202',
        brand: 'Glamour',
        pickupWarehouse:
          'Delhi NCR Hub',
        awb: 'AWB9481024IN',
        courier:
          'Blue Dart Air',
        status: 'DELIVERED',
        item:
          'Eyeshadow Palette with Mirror',
        qty: 1,
        image:
          'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png',
        trackingEvents: [
          {
            status: 'CONFIRMED',
            location: 'Delhi NCR',
            timestamp: new Date(
              Date.now() - 82000000
            ).toISOString()
          },
          {
            status: 'SHIPPED',
            location: 'Delhi NCR',
            timestamp: new Date(
              Date.now() - 70000000
            ).toISOString()
          },
          {
            status: 'IN_TRANSIT',
            location: 'Ranchi',
            timestamp: new Date(
              Date.now() - 30000000
            ).toISOString()
          },
          {
            status: 'DELIVERED',
            location: 'Ranchi',
            timestamp: new Date().toISOString()
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

const warehouses = [
  {
    id: 'WH-MUM',
    name: 'Mumbai Bhiwandi Hub',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '421302',
    active: true
  },
  {
    id: 'WH-DEL',
    name: 'Delhi NCR Hub',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    active: true
  },
  {
    id: 'WH-BLR',
    name: 'Bengaluru Whitefield Hub',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560066',
    active: true
  },
  {
    id: 'WH-JAI',
    name: 'Jaipur Depot Hub',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    active: true
  }
];

const adminSessions = new Map();

function generateOrderId() {
  return `D2C-${Math.floor(
    100000 + Math.random() * 900000
  )}`;
}

function generateInvoiceNumber() {
  return `INV-2026-${Math.floor(
    10000 + Math.random() * 90000
  )}`;
}

function generateShipmentId() {
  return `SR-${Math.floor(
    10000 + Math.random() * 90000
  )}`;
}

function generateAwb() {
  return `AWB${Math.floor(
    10000000 + Math.random() * 90000000
  )}IN`;
}

function normalizeStatus(status) {
  return String(status || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_');
}

function getAllShipments() {
  return completedOrders.flatMap(
    (order) =>
      (order.fulfillments || []).map(
        (shipment) => ({
          ...shipment,
          orderId: order.orderId,
          invoiceNumber:
            order.invoiceNumber,
          placedAt: order.placedAt,
          orderStatus: order.status,
          paymentStatus:
            order.paymentStatus,
          customer:
            order.customer || {}
        })
      )
  );
}

function getCustomers() {
  const map = new Map();

  completedOrders.forEach((order) => {
    const customer =
      order.customer || {};

    const key =
      customer.phone ||
      customer.email ||
      customer.name;

    if (!key) return;

    if (!map.has(key)) {
      map.set(key, {
        customerId:
          customer.customerId ||
          `CUS-${uuidv4()
            .slice(0, 8)
            .toUpperCase()}`,
        ...customer,
        orderCount: 0,
        lifetimeSpend: 0,
        returnCount: 0,
        lastOrderAt: null
      });
    }

    const existing = map.get(key);

    existing.orderCount += 1;

    existing.lifetimeSpend +=
      Number(
        order.summary?.totalPaid || 0
      );

    if (order.returnRequested) {
      existing.returnCount += 1;
    }

    if (
      !existing.lastOrderAt ||
      new Date(order.placedAt) >
        new Date(existing.lastOrderAt)
    ) {
      existing.lastOrderAt =
        order.placedAt;
    }
  });

  return Array.from(map.values()).map(
    (customer) => ({
      ...customer,
      averageOrderValue:
        customer.orderCount > 0
          ? Math.round(
              customer.lifetimeSpend /
                customer.orderCount
            )
          : 0
    })
  );
}

function requireAdmin(req, res, next) {
  const token =
    req.headers.authorization?.replace(
      'Bearer ',
      ''
    );

  if (!token || !adminSessions.has(token)) {
    return res.status(401).json({
      error: 'Admin authentication required.'
    });
  }

  req.admin = adminSessions.get(token);

  next();
}

function addTrackingEvent(
  shipment,
  status,
  location = 'India'
) {
  if (!shipment.trackingEvents) {
    shipment.trackingEvents = [];
  }

  shipment.trackingEvents.push({
    status,
    location,
    timestamp:
      new Date().toISOString()
  });
}

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'D2C Mall API',
    timestamp:
      new Date().toISOString()
  });
});

app.get('/api/products', (req, res) => {
  res.json(inventory);
});

app.get('/api/warehouses', (req, res) => {
  res.json(warehouses);
});

app.post(
  '/api/delivery/check',
  (req, res) => {
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

    res.json({
      deliverable: true,
      estimatedDays:
        String(pincode).startsWith('83')
          ? 2
          : 3,
      courierPartner:
        String(pincode).startsWith('83')
          ? 'Delhivery Surface'
          : 'Blue Dart Air'
    });
  }
);

app.post(
  '/api/coupons/validate',
  (req, res) => {
    const {
      code,
      cartTotal
    } = req.body;

    const coupon =
      code?.toUpperCase();

    if (coupon === 'D2C100') {
      return res.json({
        discountAmount: 100
      });
    }

    if (coupon === 'FREESHIP') {
      return res.json({
        discountAmount: 50
      });
    }

    if (coupon === 'FESTIVE20') {
      return res.json({
        discountAmount: Math.round(
          Number(cartTotal || 0) *
            0.2
        )
      });
    }

    res.status(404).json({
      message: 'Invalid promo code'
    });
  }
);

app.post(
  '/api/checkout/order',
  async (req, res) => {
    try {
      const {
        items = [],
        customer,
        discountAmount = 0,
        shippingFee = 50
      } = req.body;

      if (!items.length) {
        return res.status(400).json({
          error: 'Cart is empty.'
        });
      }

      const orderId =
        generateOrderId();

      const invoiceNumber =
        generateInvoiceNumber();

      const fulfillments =
        items.map((item, index) => {
          const product =
            inventory.find(
              (p) =>
                p.id === item.skuId
            );

          if (!product) {
            throw new Error(
              `Product ${item.skuId} not found.`
            );
          }

          if (
            Number(item.qty) <= 0 ||
            Number(item.qty) >
              product.stock
          ) {
            throw new Error(
              `Insufficient stock for ${product.name}.`
            );
          }

          return {
            shipmentId:
              generateShipmentId(),
            brand:
              product.brand,
            pickupWarehouse:
              product.warehouseCity,
            awb: generateAwb(),
            courier:
              index % 2 === 0
                ? 'Delhivery Surface'
                : 'Blue Dart Air',
            status: 'CONFIRMED',
            item: product.name,
            skuId: product.id,
            qty: Number(item.qty),
            image: product.image,
            trackingEvents: [
              {
                status: 'CONFIRMED',
                location:
                  product.warehouseCity,
                timestamp:
                  new Date().toISOString()
              }
            ]
          };
        });

      const subtotal =
        items.reduce(
          (total, item) => {
            const product =
              inventory.find(
                (p) =>
                  p.id === item.skuId
              );

            return (
              total +
              product.price *
                Number(item.qty)
            );
          },
          0
        );

      items.forEach((item) => {
        const product =
          inventory.find(
            (p) =>
              p.id === item.skuId
          );

        product.stock -= Number(
          item.qty
        );
      });

      const finalOrder = {
        orderId,
        invoiceNumber,
        placedAt:
          new Date().toISOString(),
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod:
          'UPI / Razorpay',
        returnRequested: false,
        customer: {
          customerId:
            `CUS-${uuidv4()
              .slice(0, 8)
              .toUpperCase()}`,
          ...customer
        },
        fulfillments,
        summary: {
          itemSubtotal: subtotal,
          shippingFee:
            Number(shippingFee),
          discountAmount:
            Number(discountAmount),
          totalPaid: Math.max(
            1,
            subtotal +
              Number(shippingFee) -
              Number(discountAmount)
          )
        }
      };

      completedOrders.unshift(
        finalOrder
      );

      res.json(finalOrder);
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
);

app.get('/api/orders', (req, res) => {
  res.json(completedOrders);
});

app.get(
  '/api/orders/:orderId',
  (req, res) => {
    const order =
      completedOrders.find(
        (item) =>
          item.orderId ===
          req.params.orderId
      );

    if (!order) {
      return res.status(404).json({
        error: 'Order not found.'
      });
    }

    res.json(order);
  }
);

app.get(
  '/api/orders/:orderId/tracking',
  (req, res) => {
    const order =
      completedOrders.find(
        (item) =>
          item.orderId ===
          req.params.orderId
      );

    if (!order) {
      return res.status(404).json({
        error: 'Order not found.'
      });
    }

    res.json({
      orderId: order.orderId,
      status: order.status,
      shipments:
        order.fulfillments || []
    });
  }
);

app.post(
  '/api/orders/return',
  (req, res) => {
    const {
      orderId,
      reason,
      refundMethod
    } = req.body;

    const order =
      completedOrders.find(
        (item) =>
          item.orderId === orderId
      );

    if (!order) {
      return res.status(404).json({
        error: 'Order not found.'
      });
    }

    order.returnRequested = true;

    order.returnDetails = {
      reason,
      refundMethod,
      requestedAt:
        new Date().toISOString()
    };

    res.json({
      success: true,
      order
    });
  }
);

app.post(
  '/api/admin/login',
  (req, res) => {
    const {
      username,
      password
    } = req.body;

    if (
      username !== ADMIN_USERNAME ||
      password !== ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        error:
          'Invalid admin credentials.'
      });
    }

    const token =
      uuidv4();

    adminSessions.set(token, {
      username,
      role: 'ADMIN',
      loggedInAt:
        new Date().toISOString()
    });

    res.json({
      success: true,
      token,
      admin: {
        username,
        role: 'ADMIN'
      }
    });
  }
);

app.post(
  '/api/admin/logout',
  requireAdmin,
  (req, res) => {
    const token =
      req.headers.authorization?.replace(
        'Bearer ',
        ''
      );

    adminSessions.delete(token);

    res.json({
      success: true
    });
  }
);

app.get(
  '/api/admin/dashboard',
  requireAdmin,
  (req, res) => {
    const shipments =
      getAllShipments();

    const customers =
      getCustomers();

    const revenue =
      completedOrders.reduce(
        (sum, order) =>
          sum +
          Number(
            order.summary?.totalPaid ||
              0
          ),
        0
      );

    const pendingOrders =
      completedOrders.filter(
        (order) =>
          [
            'CONFIRMED',
            'PROCESSING',
            'PACKED',
            'READY_TO_DISPATCH'
          ].includes(order.status)
      ).length;

    const deliveredOrders =
      completedOrders.filter(
        (order) =>
          order.status ===
          'DELIVERED'
      ).length;

    const inTransitShipments =
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

    const shipmentExceptions =
      shipments.filter(
        (shipment) =>
          shipment.exception ||
          [
            'CANCELLED',
            'RETURNED'
          ].includes(
            shipment.status
          )
      ).length;

    const lowStockProducts =
      inventory.filter(
        (product) =>
          product.stock <=
          product.lowStockThreshold
      );

    const warehouseSummary =
      warehouses.map(
        (warehouse) => {
          const warehouseShipments =
            shipments.filter(
              (shipment) =>
                shipment.pickupWarehouse ===
                warehouse.name
            );

          return {
            ...warehouse,
            activeShipments:
              warehouseShipments.filter(
                (shipment) =>
                  shipment.status !==
                  'DELIVERED'
              ).length,
            pendingOrders:
              warehouseShipments.filter(
                (shipment) =>
                  [
                    'CONFIRMED',
                    'PROCESSING',
                    'PACKED',
                    'READY_TO_DISPATCH'
                  ].includes(
                    shipment.status
                  )
              ).length,
            stockUnits:
              inventory
                .filter(
                  (product) =>
                    product.warehouseCity ===
                    warehouse.name
                )
                .reduce(
                  (sum, product) =>
                    sum +
                    product.stock,
                  0
                )
          };
        }
      );

    res.json({
      totalOrders:
        completedOrders.length,
      totalRevenue: revenue,
      pendingOrders,
      deliveredOrders,
      totalCustomers:
        customers.length,
      totalShipments:
        shipments.length,
      inTransitShipments,
      shipmentExceptions,
      recentOrders:
        completedOrders.slice(
          0,
          8
        ),
      lowStockProducts,
      warehouses:
        warehouseSummary
    });
  }
);

app.get(
  '/api/admin/orders',
  requireAdmin,
  (req, res) => {
    let result = [
      ...completedOrders
    ];

    const {
      search = '',
      status = 'ALL',
      paymentStatus = 'ALL',
      warehouse = 'ALL',
      carrier = 'ALL',
      dateFrom = '',
      dateTo = '',
      sort = 'newest'
    } = req.query;

    const query =
      String(search)
        .trim()
        .toLowerCase();

    if (query) {
      result = result.filter(
        (order) => {
          const searchable = [
            order.orderId,
            order.invoiceNumber,
            order.customer?.name,
            order.customer?.phone,
            order.customer?.email,
            order.customer?.city,
            order.customer?.pincode,
            ...(order.fulfillments ||
              []).flatMap(
              (shipment) => [
                shipment.shipmentId,
                shipment.awb,
                shipment.brand,
                shipment.item,
                shipment.courier
              ]
            )
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return searchable.includes(
            query
          );
        }
      );
    }

    if (status !== 'ALL') {
      result = result.filter(
        (order) =>
          order.status === status
      );
    }

    if (
      paymentStatus !==
      'ALL'
    ) {
      result = result.filter(
        (order) =>
          order.paymentStatus ===
          paymentStatus
      );
    }

    if (warehouse !== 'ALL') {
      result = result.filter(
        (order) =>
          (order.fulfillments ||
            []).some(
            (shipment) =>
              shipment.pickupWarehouse ===
              warehouse
          )
      );
    }

    if (carrier !== 'ALL') {
      result = result.filter(
        (order) =>
          (order.fulfillments ||
            []).some(
            (shipment) =>
              shipment.courier ===
              carrier
          )
      );
    }

    if (dateFrom) {
      const from =
        new Date(dateFrom);

      result = result.filter(
        (order) =>
          new Date(
            order.placedAt
          ) >= from
      );
    }

    if (dateTo) {
      const to =
        new Date(dateTo);

      to.setHours(
        23,
        59,
        59,
        999
      );

      result = result.filter(
        (order) =>
          new Date(
            order.placedAt
          ) <= to
      );
    }

    result.sort(
      (a, b) => {
        if (
          sort === 'oldest'
        ) {
          return (
            new Date(a.placedAt) -
            new Date(b.placedAt)
          );
        }

        if (
          sort === 'amount_high'
        ) {
          return (
            Number(
              b.summary?.totalPaid ||
                0
            ) -
            Number(
              a.summary?.totalPaid ||
                0
            )
          );
        }

        if (
          sort === 'amount_low'
        ) {
          return (
            Number(
              a.summary?.totalPaid ||
                0
            ) -
            Number(
              b.summary?.totalPaid ||
                0
            )
          );
        }

        return (
          new Date(b.placedAt) -
          new Date(a.placedAt)
        );
      }
    );

    const page = Math.max(
      1,
      Number(req.query.page) ||
        1
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number(req.query.limit) ||
          20
      )
    );

    const total =
      result.length;

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          total / limit
        )
      );

    const start =
      (page - 1) * limit;

    const paginated =
      result.slice(
        start,
        start + limit
      );

    res.json({
      orders: paginated,
      page,
      limit,
      total,
      totalPages
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
        error: 'Order not found.'
      });
    }

    res.json(order);
  }
);

app.patch(
  '/api/admin/orders/:orderId/status',
  requireAdmin,
  (req, res) => {
    const {
      status
    } = req.body;

    const order =
      completedOrders.find(
        (item) =>
          item.orderId ===
          req.params.orderId
      );

    if (!order) {
      return res.status(404).json({
        error: 'Order not found.'
      });
    }

    const nextStatus =
      normalizeStatus(status);

    order.status = nextStatus;

    res.json({
      success: true,
      order
    });
  }
);

app.get(
  '/api/admin/shipments',
  requireAdmin,
  (req, res) => {
    res.json({
      shipments:
        getAllShipments()
    });
  }
);

app.get(
  '/api/admin/shipments/:shipmentId',
  requireAdmin,
  (req, res) => {
    const shipment =
      getAllShipments().find(
        (item) =>
          item.shipmentId ===
          req.params.shipmentId
      );

    if (!shipment) {
      return res.status(404).json({
        error:
          'Shipment not found.'
      });
    }

    res.json(shipment);
  }
);

app.patch(
  '/api/admin/shipments/:shipmentId/status',
  requireAdmin,
  (req, res) => {
    const {
      orderId,
      newStatus,
      location
    } = req.body;

    const order =
      completedOrders.find(
        (item) =>
          item.orderId ===
          orderId
      );

    if (!order) {
      return res.status(404).json({
        error: 'Order not found.'
      });
    }

    const shipment =
      order.fulfillments?.find(
        (item) =>
          item.shipmentId ===
          req.params.shipmentId
      );

    if (!shipment) {
      return res.status(404).json({
        error:
          'Shipment not found.'
      });
    }

    const status =
      normalizeStatus(newStatus);

    shipment.status = status;

    addTrackingEvent(
      shipment,
      status,
      location ||
        shipment.pickupWarehouse ||
        'India'
    );

    const statuses =
      order.fulfillments.map(
        (item) => item.status
      );

    if (
      statuses.every(
        (item) =>
          item === 'DELIVERED'
      )
    ) {
      order.status =
        'DELIVERED';
    } else if (
      statuses.some(
        (item) =>
          item ===
            'OUT_FOR_DELIVERY' ||
          item === 'IN_TRANSIT' ||
          item === 'SHIPPED'
      )
    ) {
      order.status =
        'IN_TRANSIT';
    } else if (
      statuses.some(
        (item) =>
          item ===
            'READY_TO_DISPATCH'
      )
    ) {
      order.status =
        'READY_TO_DISPATCH';
    } else if (
      statuses.some(
        (item) =>
          item === 'PACKED'
      )
    ) {
      order.status =
        'PACKED';
    } else if (
      statuses.some(
        (item) =>
          item === 'PROCESSING'
      )
    ) {
      order.status =
        'PROCESSING';
    }

    res.json({
      success: true,
      shipment,
      order
    });
  }
);

app.post(
  '/api/admin/shipments/:shipmentId/exception',
  requireAdmin,
  (req, res) => {
    const {
      orderId,
      reason,
      notes
    } = req.body;

    const order =
      completedOrders.find(
        (item) =>
          item.orderId ===
          orderId
      );

    if (!order) {
      return res.status(404).json({
        error: 'Order not found.'
      });
    }

    const shipment =
      order.fulfillments?.find(
        (item) =>
          item.shipmentId ===
          req.params.shipmentId
      );

    if (!shipment) {
      return res.status(404).json({
        error:
          'Shipment not found.'
      });
    }

    shipment.exception = reason;

    shipment.exceptionDetails = {
      reason,
      notes: notes || '',
      createdAt:
        new Date().toISOString()
    };

    res.json({
      success: true,
      shipment
    });
  }
);

app.get(
  '/api/admin/shipments/:shipmentId/tracking',
  requireAdmin,
  (req, res) => {
    const shipment =
      getAllShipments().find(
        (item) =>
          item.shipmentId ===
          req.params.shipmentId
      );

    if (!shipment) {
      return res.status(404).json({
        error:
          'Shipment not found.'
      });
    }

    res.json({
      shipmentId:
        shipment.shipmentId,
      awb: shipment.awb,
      courier:
        shipment.courier,
      status:
        shipment.status,
      trackingEvents:
        shipment.trackingEvents ||
        []
    });
  }
);

app.get(
  '/api/admin/customers',
  requireAdmin,
  (req, res) => {
    let customers =
      getCustomers();

    const search =
      String(
        req.query.search || ''
      )
        .trim()
        .toLowerCase();

    if (search) {
      customers =
        customers.filter(
          (customer) =>
            [
              customer.customerId,
              customer.name,
              customer.phone,
              customer.email,
              customer.city,
              customer.pincode
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase()
              .includes(search)
        );
    }

    res.json({
      customers,
      total: customers.length
    });
  }
);

app.get(
  '/api/admin/customers/:customerId',
  requireAdmin,
  (req, res) => {
    const customer =
      getCustomers().find(
        (item) =>
          item.customerId ===
          req.params.customerId
      );

    if (!customer) {
      return res.status(404).json({
        error:
          'Customer not found.'
      });
    }

    const orders =
      completedOrders.filter(
        (order) =>
          order.customer
            ?.customerId ===
          customer.customerId
      );

    res.json({
      customer,
      orders
    });
  }
);

app.get(
  '/api/admin/inventory',
  requireAdmin,
  (req, res) => {
    res.json({
      inventory,
      lowStock:
        inventory.filter(
          (product) =>
            product.stock <=
            product.lowStockThreshold
        )
    });
  }
);

app.patch(
  '/api/admin/inventory/:skuId',
  requireAdmin,
  (req, res) => {
    const {
      newStock
    } = req.body;

    const product =
      inventory.find(
        (item) =>
          item.id ===
          req.params.skuId
      );

    if (!product) {
      return res.status(404).json({
        error:
          'SKU not found.'
      });
    }

    const stock =
      Number(newStock);

    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        error:
          'Invalid stock quantity.'
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
  '/api/admin/shiprocket/status',
  requireAdmin,
  (req, res) => {
    res.json({
      configured:
        Boolean(
          SHIPROCKET_EMAIL &&
            SHIPROCKET_PASSWORD
        ),
      provider:
        'Shiprocket',
      mode:
        SHIPROCKET_EMAIL &&
        SHIPROCKET_PASSWORD
          ? 'CONFIGURED'
          : 'NOT_CONFIGURED'
    });
  }
);

app.post(
  '/api/admin/shiprocket/create-order',
  requireAdmin,
  (req, res) => {
    const {
      orderId
    } = req.body;

    const order =
      completedOrders.find(
        (item) =>
          item.orderId ===
          orderId
      );

    if (!order) {
      return res.status(404).json({
        error:
          'Order not found.'
      });
    }

    res.json({
      success: true,
      mode: SHIPROCKET_EMAIL &&
        SHIPROCKET_PASSWORD
        ? 'LIVE_READY'
        : 'MOCK',
      message:
        'Shiprocket shipment creation payload prepared.',
      orderId,
      shipments:
        order.fulfillments
    });
  }
);

app.get(
  '/api/admin/analytics',
  requireAdmin,
  (req, res) => {
    const shipments =
      getAllShipments();

    const revenue =
      completedOrders.reduce(
        (sum, order) =>
          sum +
          Number(
            order.summary?.totalPaid ||
              0
          ),
        0
      );

    const delivered =
      completedOrders.filter(
        (order) =>
          order.status ===
          'DELIVERED'
      ).length;

    const returns =
      completedOrders.filter(
        (order) =>
          order.returnRequested
      ).length;

    const averageOrderValue =
      completedOrders.length
        ? Math.round(
            revenue /
              completedOrders.length
          )
        : 0;

    res.json({
      revenue,
      orders:
        completedOrders.length,
      shipments:
        shipments.length,
      delivered,
      returns,
      averageOrderValue
    });
  }
);

app.use(
  (req, res) => {
    res.status(404).json({
      error: 'API endpoint not found.',
      path: req.path
    });
  }
);

app.use(
  (err, req, res, next) => {
    console.error(err);

    res.status(500).json({
      error:
        err?.message ||
        'Internal server error.'
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