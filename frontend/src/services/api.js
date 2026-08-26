const API_BASE_URL = '';

const STORAGE_KEYS = {
  products: 'd2c_products',
  orders: 'd2c_orders',
  leads: 'd2c_franchise_leads',
  returns: 'd2c_returns',
  reservations: 'd2c_checkout_reservations'
};

const DEFAULT_PRODUCTS = [
  {
    id: 'HL-SW-001',
    sku: 'HL-SW-001',
    name: 'Hungama HiLife Smart Watch',
    brand: 'Hungama HiLife',
    category: 'electronics',
    price: 1499,
    mrp: 2999,
    stock: 48,
    rating: 4.5,
    reviewsCount: 126,
    estimatedDays: 2,
    warehouseCity: 'Mumbai',
    brandColor: '#2563eb',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    description: 'Smart lifestyle watch designed for everyday fitness, notifications and connected living.',
    isNew: true,
    isTrending: true
  },
  {
    id: 'LS-SERUM-001',
    sku: 'LS-SERUM-001',
    name: 'Luxura Sciences Advanced Hair Serum',
    brand: 'Luxura Sciences',
    category: 'beauty',
    price: 699,
    mrp: 999,
    stock: 72,
    rating: 4.6,
    reviewsCount: 214,
    estimatedDays: 2,
    warehouseCity: 'Delhi',
    brandColor: '#7c3aed',
    image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=80',
    description: 'Daily hair care serum formulated for a smooth, manageable and healthy-looking finish.',
    isTrending: true
  },
  {
    id: 'AH-JWL-001',
    sku: 'AH-JWL-001',
    name: 'AccessHer Premium Fashion Jewellery Set',
    brand: 'AccessHer',
    category: 'jewellery',
    price: 899,
    mrp: 1799,
    stock: 35,
    rating: 4.7,
    reviewsCount: 98,
    estimatedDays: 3,
    warehouseCity: 'Jaipur',
    brandColor: '#db2777',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    description: 'Statement fashion jewellery designed for festive, bridal and everyday styling.',
    isNew: true
  },
  {
    id: 'HL-EAR-001',
    sku: 'HL-EAR-001',
    name: 'Hungama HiLife Wireless Earbuds',
    brand: 'Hungama HiLife',
    category: 'electronics',
    price: 999,
    mrp: 1999,
    stock: 61,
    rating: 4.4,
    reviewsCount: 167,
    estimatedDays: 2,
    warehouseCity: 'Bengaluru',
    brandColor: '#2563eb',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80',
    description: 'Compact wireless earbuds built for calls, music and everyday mobility.',
    isTrending: true
  },
  {
    id: 'LS-FACE-001',
    sku: 'LS-FACE-001',
    name: 'Luxura Sciences Daily Face Care Kit',
    brand: 'Luxura Sciences',
    category: 'beauty',
    price: 1199,
    mrp: 1799,
    stock: 29,
    rating: 4.5,
    reviewsCount: 83,
    estimatedDays: 2,
    warehouseCity: 'Delhi',
    brandColor: '#7c3aed',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    description: 'A simple daily skincare routine designed for cleansing, hydration and everyday care.',
    isNew: true
  },
  {
    id: 'AH-BAG-001',
    sku: 'AH-BAG-001',
    name: 'AccessHer Women Fashion Handbag',
    brand: 'AccessHer',
    category: 'fashion',
    price: 1299,
    mrp: 2499,
    stock: 24,
    rating: 4.6,
    reviewsCount: 74,
    estimatedDays: 3,
    warehouseCity: 'Mumbai',
    brandColor: '#db2777',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    description: 'Contemporary everyday handbag designed for work, shopping and casual occasions.',
    isTrending: true
  }
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function getProductsStore() {
  const products = readStorage(STORAGE_KEYS.products, null);
  if (!products) {
    writeStorage(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  }
  return products;
}

function getOrdersStore() {
  return readStorage(STORAGE_KEYS.orders, []);
}

function getLeadsStore() {
  return readStorage(STORAGE_KEYS.leads, []);
}

function getReturnsStore() {
  return readStorage(STORAGE_KEYS.returns, []);
}

function getReservationsStore() {
  return readStorage(STORAGE_KEYS.reservations, []);
}

function saveReservationsStore(value) {
  writeStorage(STORAGE_KEYS.reservations, value);
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function generateAwb() {
  return `D2C${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
}

function calculateDelivery(pincode) {
  const pin = String(pincode || '');
  if (!/^\d{6}$/.test(pin)) {
    throw new Error('Please enter a valid 6-digit pincode.');
  }

  const firstDigit = Number(pin.charAt(0));
  let estimatedDays = 3;
  let courierPartner = 'Velocity Express';

  if ([1, 2, 3].includes(firstDigit)) {
    estimatedDays = 2;
    courierPartner = 'Amazon Shipping';
  } else if ([4, 5, 6].includes(firstDigit)) {
    estimatedDays = 2;
    courierPartner = 'Velocity Express';
  } else if ([7, 8].includes(firstDigit)) {
    estimatedDays = 3;
    courierPartner = 'Amazon Shipping';
  } else {
    estimatedDays = 4;
    courierPartner = 'Velocity Express';
  }

  return {
    serviceable: true,
    estimatedDays,
    courierPartner,
    pincode: pin,
    message: `Delivery available in approximately ${estimatedDays} business days.`
  };
}

function createFulfillment(product, customer, qty) {
  const carrier =
    product.warehouseCity === 'Mumbai' || product.warehouseCity === 'Delhi'
      ? 'Amazon Shipping'
      : 'Velocity Express';

  return {
    shipmentId: generateId('SHP'),
    awb: generateAwb(),
    item: product.name,
    image: product.image,
    brand: product.brand,
    qty,
    status: 'READY_TO_SHIP',
    carrier,
    courier: carrier,
    pickupWarehouse: product.warehouseCity || 'Central Warehouse',
    estimatedDays: product.estimatedDays || 2,
    destinationPincode: customer.pincode,
    destinationCity: customer.city
  };
}

function getReservation(reservationId) {
  return getReservationsStore().find(
    (item) => String(item.reservationId) === String(reservationId)
  );
}

function removeReservation(reservationId) {
  saveReservationsStore(
    getReservationsStore().filter(
      (item) => String(item.reservationId) !== String(reservationId)
    )
  );
}

const api = {
  async getProducts() {
    return getProductsStore();
  },

  async getProduct(id) {
    const product = getProductsStore().find(
      (item) => String(item.id) === String(id)
    );
    if (!product) {
      throw new Error('Product not found.');
    }
    return product;
  },

  async checkDelivery(pincode) {
    return calculateDelivery(pincode);
  },

  async validateCoupon(code, subtotal) {
    const normalized = String(code || '').trim().toUpperCase();
    const amount = Number(subtotal) || 0;

    const coupons = {
      FESTIVE20: { minOrder: 1999, type: 'PERCENT', value: 20 },
      FREESHIP: { minOrder: 499, type: 'SHIPPING', value: 50 },
      D2C100: { minOrder: 999, type: 'FLAT', value: 100 },
      WELCOME100: { minOrder: 999, type: 'FLAT', value: 100 },
      D2CMALL200: { minOrder: 1999, type: 'FLAT', value: 200 }
    };

    const coupon = coupons[normalized];
    if (!coupon) {
      throw new Error('Invalid coupon code.');
    }

    if (amount < coupon.minOrder) {
      throw new Error(`Minimum order value is ₹${coupon.minOrder}.`);
    }

    let discountAmount = 0;
    if (coupon.type === 'PERCENT') {
      discountAmount = Math.round(amount * (coupon.value / 100));
    } else if (coupon.type === 'FLAT') {
      discountAmount = Math.min(coupon.value, amount);
    } else if (coupon.type === 'SHIPPING') {
      discountAmount = coupon.value;
    }

    return {
      valid: true,
      code: normalized,
      discountAmount,
      type: coupon.type,
      minimumOrder: coupon.minOrder
    };
  },

  async createOrder(orderData) {
    const products = getProductsStore();
    const cart = Array.isArray(orderData.cart) ? orderData.cart : [];

    if (!cart.length) {
      throw new Error('Cannot create an order with an empty cart.');
    }

    const customer = orderData.customer || {};
    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.state ||
      !customer.pincode
    ) {
      throw new Error('Complete delivery details are required.');
    }

    const fulfillments = [];
    let subtotal = 0;

    for (const item of cart) {
      const product = products.find(
        (p) => String(p.id) === String(item.id || item.skuId)
      );

      if (!product) {
        throw new Error(`Product ${item.id || item.skuId} is no longer available.`);
      }

      const qty = Math.max(1, Number(item.qty) || 1);
      if (Number(product.stock || 0) < qty) {
        throw new Error(`Only ${product.stock} units of ${product.name} are available.`);
      }

      subtotal += Number(product.price || 0) * qty;
      fulfillments.push(createFulfillment(product, customer, qty));
    }

    const discountAmount = Math.min(
      Math.max(0, Number(orderData.discountAmount) || 0),
      subtotal
    );
    const shippingFee = Math.max(0, Number(orderData.shippingFee) || 0);
    const totalPaid = Math.max(0, subtotal - discountAmount + shippingFee);
    const orderId = generateId('D2C');

    const order = {
      orderId,
      placedAt: new Date().toISOString(),
      status: 'CONFIRMED',
      paymentStatus: orderData.paymentMethod === 'COD' ? 'COD_PENDING' : 'PAID',
      paymentMethod: orderData.paymentMethod || 'RAZORPAY',
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
        address: customer.address,
        landmark: customer.landmark || '',
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode
      },
      items: cart.map((item) => {
        const product = products.find(
          (p) => String(p.id) === String(item.id || item.skuId)
        );
        return {
          id: product.id,
          sku: product.sku || product.id,
          name: product.name,
          brand: product.brand,
          image: product.image,
          price: Number(product.price || 0),
          mrp: Number(product.mrp || product.price || 0),
          qty: Math.max(1, Number(item.qty) || 1)
        };
      }),
      fulfillments,
      summary: {
        subtotal,
        discountAmount,
        shippingFee,
        totalPaid
      },
      coupon: orderData.coupon || null,
      razorpay: orderData.razorpay || null
    };

    const updatedProducts = products.map((product) => {
      const cartItem = cart.find(
        (item) => String(item.id || item.skuId) === String(product.id)
      );
      if (!cartItem) return product;

      const qty = Math.max(1, Number(cartItem.qty) || 1);
      return {
        ...product,
        stock: Number(product.stock || 0) - qty
      };
    });

    writeStorage(STORAGE_KEYS.products, updatedProducts);
    const orders = getOrdersStore();
    writeStorage(STORAGE_KEYS.orders, [order, ...orders]);

    return order;
  },

  async initiatePayment(paymentData) {
    const items = Array.isArray(paymentData?.items) ? paymentData.items : [];
    if (!items.length) {
      throw new Error('Your cart is empty.');
    }

    const products = getProductsStore();
    const cart = items.map((item) => {
      const product = products.find(
        (p) => String(p.id) === String(item.skuId)
      );
      if (!product) {
        throw new Error(`Product ${item.skuId} is no longer available.`);
      }

      const qty = Math.max(1, Number(item.qty) || 1);
      if (Number(product.stock || 0) < qty) {
        throw new Error(`Only ${product.stock} units of ${product.name} are available.`);
      }

      return { ...product, qty };
    });

    const subtotal = cart.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1),
      0
    );
    const discountAmount = Math.min(
      Math.max(0, Number(paymentData.discountAmount) || 0),
      subtotal
    );
    const shippingFee = Math.max(0, Number(paymentData.shippingFee) || 0);
    const amount = Math.max(0, subtotal - discountAmount + shippingFee);

    const reservationId = generateId('RES');
    const razorpayOrderId = generateId('order_sim');

    const reservation = {
      reservationId,
      razorpayOrderId,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + 10 * 60 * 1000,
      customer: paymentData.customer || {},
      cart,
      subtotal,
      discountAmount,
      shippingFee,
      amount
    };

    const activeReservations = getReservationsStore().filter(
      (item) => Number(item.expiresAt) > Date.now()
    );

    saveReservationsStore([reservation, ...activeReservations]);

    return {
      reservationId,
      razorpayOrderId,
      keyId: import.meta.env?.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo',
      amount: Math.round(amount * 100),
      currency: 'INR',
      expiresInSeconds: 600
    };
  },

  async verifyPayment(paymentData) {
    const reservation = getReservation(paymentData?.reservationId);
    if (!reservation) {
      throw new Error('Checkout reservation not found or expired.');
    }

    if (Number(reservation.expiresAt) <= Date.now()) {
      removeReservation(reservation.reservationId);
      throw new Error('Checkout session expired. Please try again.');
    }

    const verifiedOrder = await api.createOrder({
      cart: reservation.cart,
      customer: reservation.customer,
      subtotal: reservation.subtotal,
      discountAmount: reservation.discountAmount,
      shippingFee: reservation.shippingFee,
      paymentMethod: 'RAZORPAY',
      razorpay: {
        orderId: paymentData.razorpay_order_id || reservation.razorpayOrderId,
        paymentId: paymentData.razorpay_payment_id || `pay_sim_${Date.now()}`,
        signature: paymentData.razorpay_signature || 'simulated',
        verified: true
      }
    });

    removeReservation(reservation.reservationId);

    return {
      ...verifiedOrder,
      payment: {
        orderId: paymentData.razorpay_order_id || reservation.razorpayOrderId,
        paymentId: paymentData.razorpay_payment_id || `pay_sim_${Date.now()}`,
        verified: true
      }
    };
  },

  async placeCodOrder(customer, onSuccess) {
    const cart = readStorage('d2c_cart', []);
    if (!cart.length) {
      throw new Error('Your cart is empty.');
    }

    const products = getProductsStore();
    const normalizedCart = cart.map((item) => {
      const product = products.find(
        (p) => String(p.id) === String(item.id)
      );
      if (!product) {
        throw new Error(`${item.name} is no longer available.`);
      }
      return {
        ...product,
        qty: Math.max(1, Number(item.qty) || 1)
      };
    });

    const subtotal = normalizedCart.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1),
      0
    );
    const shippingFee = subtotal >= 499 ? 0 : 50;

    const order = await api.createOrder({
      cart: normalizedCart,
      customer,
      subtotal,
      discountAmount: 0,
      shippingFee,
      paymentMethod: 'COD'
    });

    if (onSuccess) {
      onSuccess(order);
    }

    return order;
  },

  async getCustomerOrders() {
    return getOrdersStore();
  },

  async getOrder(orderId) {
    const order = getOrdersStore().find(
      (item) => String(item.orderId) === String(orderId)
    );
    if (!order) {
      throw new Error('Order not found.');
    }
    return order;
  },

  async updateShipmentStatus(orderId, shipmentId, newStatus) {
    const orders = getOrdersStore();
    const orderIndex = orders.findIndex(
      (item) => String(item.orderId) === String(orderId)
    );

    if (orderIndex === -1) {
      throw new Error('Order not found.');
    }

    const order = orders[orderIndex];
    const shipmentIndex = order.fulfillments.findIndex(
      (item) => String(item.shipmentId) === String(shipmentId)
    );

    if (shipmentIndex === -1) {
      throw new Error('Shipment not found.');
    }

    order.fulfillments[shipmentIndex] = {
      ...order.fulfillments[shipmentIndex],
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    const statuses = order.fulfillments.map((item) => item.status);

    if (statuses.length && statuses.every((status) => status === 'DELIVERED')) {
      order.status = 'DELIVERED';
    } else if (statuses.some((status) => status === 'OUT_FOR_DELIVERY')) {
      order.status = 'OUT_FOR_DELIVERY';
    } else if (statuses.some((status) => status === 'IN_TRANSIT')) {
      order.status = 'IN_TRANSIT';
    } else if (statuses.some((status) => status === 'READY_TO_SHIP')) {
      order.status = 'PROCESSING';
    }

    writeStorage(STORAGE_KEYS.orders, orders);
    return order;
  },

  async requestReturn(returnData) {
    const orders = getOrdersStore();
    const order = orders.find(
      (item) => String(item.orderId) === String(returnData.orderId)
    );

    if (!order) {
      throw new Error('Order not found.');
    }

    if (order.status !== 'DELIVERED') {
      throw new Error('Returns can only be requested after delivery.');
    }

    if (order.returnRequested) {
      throw new Error('A return request already exists for this order.');
    }

    const returnRequest = {
      returnId: generateId('RET'),
      orderId: order.orderId,
      reason: returnData.reason || 'Other',
      refundMethod: returnData.refundMethod || 'ORIGINAL',
      status: 'PICKUP_SCHEDULED',
      requestedAt: new Date().toISOString(),
      pickupEta: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    order.returnRequested = true;
    order.returnStatus = 'PICKUP_SCHEDULED';

    writeStorage(STORAGE_KEYS.orders, orders);
    const returns = getReturnsStore();
    writeStorage(STORAGE_KEYS.returns, [returnRequest, ...returns]);

    return returnRequest;
  },

  async getReturns() {
    return getReturnsStore();
  },

  async updateStock(skuId, newStock) {
    const products = getProductsStore();
    const index = products.findIndex(
      (product) => String(product.id) === String(skuId)
    );

    if (index === -1) {
      throw new Error('SKU not found.');
    }

    const stock = Math.max(0, Number(newStock) || 0);
    products[index] = {
      ...products[index],
      stock
    };

    writeStorage(STORAGE_KEYS.products, products);
    return products[index];
  },

  async getInventory() {
    return getProductsStore().map((product) => ({
      id: product.id,
      sku: product.sku || product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      stock: Number(product.stock) || 0,
      price: Number(product.price) || 0,
      warehouseCity: product.warehouseCity || 'Central Warehouse'
    }));
  },

  async submitFranchiseLead(leadData) {
    if (!leadData?.name || !leadData?.phone || !leadData?.city) {
      throw new Error('Name, phone and city are required.');
    }

    const lead = {
      leadId: generateId('LEAD'),
      name: leadData.name.trim(),
      phone: String(leadData.phone).trim(),
      email: leadData.email || '',
      city: leadData.city.trim(),
      preferredModel: leadData.preferredModel || leadData.model || 'FOFO',
      budget: leadData.budget || '',
      businessIntent: leadData.businessIntent || '',
      existingBusiness: leadData.existingBusiness || '',
      preferredLocation: leadData.preferredLocation || '',
      message: leadData.message || '',
      source: leadData.source || 'Website',
      status: 'NEW',
      createdAt: new Date().toISOString()
    };

    const leads = getLeadsStore();
    writeStorage(STORAGE_KEYS.leads, [lead, ...leads]);

    return lead;
  },

  async getFranchiseLeads() {
    return getLeadsStore();
  },

  async updateFranchiseLead(leadId, updates) {
    const leads = getLeadsStore();
    const index = leads.findIndex(
      (lead) => String(lead.leadId) === String(leadId)
    );

    if (index === -1) {
      throw new Error('Franchise lead not found.');
    }

    leads[index] = {
      ...leads[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    writeStorage(STORAGE_KEYS.leads, leads);
    return leads[index];
  },

  async getDashboardStats() {
    const products = getProductsStore();
    const orders = getOrdersStore();
    const leads = getLeadsStore();
    const returns = getReturnsStore();

    const totalStock = products.reduce(
      (sum, product) => sum + Number(product.stock || 0),
      0
    );

    const revenue = orders.reduce(
      (sum, order) => sum + Number(order.summary?.totalPaid || 0),
      0
    );

    const deliveredOrders = orders.filter(
      (order) => order.status === 'DELIVERED'
    ).length;

    const activeOrders = orders.filter(
      (order) => order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
    ).length;

    const lowStockProducts = products.filter(
      (product) => Number(product.stock || 0) <= 10
    );

    return {
      totalProducts: products.length,
      totalStock,
      totalOrders: orders.length,
      activeOrders,
      deliveredOrders,
      totalRevenue: revenue,
      totalFranchiseLeads: leads.length,
      newFranchiseLeads: leads.filter((lead) => lead.status === 'NEW').length,
      totalReturns: returns.length,
      lowStockProducts: lowStockProducts.length,
      lowStockItems: lowStockProducts,
      warehouses: ['Mumbai', 'Delhi', 'Jaipur', 'Bengaluru']
    };
  },

  async clearDemoData() {
    localStorage.removeItem(STORAGE_KEYS.products);
    localStorage.removeItem(STORAGE_KEYS.orders);
    localStorage.removeItem(STORAGE_KEYS.leads);
    localStorage.removeItem(STORAGE_KEYS.returns);
    localStorage.removeItem(STORAGE_KEYS.reservations);

    return { success: true };
  }
};

export { api };
export default api;