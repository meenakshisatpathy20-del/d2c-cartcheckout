const API_BASE =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

async function request(
  endpoint,
  options = {}
) {
  const {
    method = 'GET',
    body,
    headers = {},
    auth = false
  } = options;

  const finalHeaders = {
    ...headers
  };

  if (body !== undefined) {
    finalHeaders['Content-Type'] =
      'application/json';
  }

  if (auth) {
    const token =
      localStorage.getItem(
        'd2c_admin_token'
      );

    if (token) {
      finalHeaders.Authorization =
        `Bearer ${token}`;
    }
  }

  const response = await fetch(
    `${API_BASE}${endpoint}`,
    {
      method,
      headers: finalHeaders,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed (${response.status})`
    );
  }

  return data;
}

export const api = {
  /* =========================
     HEALTH
  ========================= */

  health() {
    return request('/health');
  },

  /* =========================
     CUSTOMER / CATALOG
  ========================= */

  getProducts() {
    return request('/products');
  },

  getWarehouses() {
    return request('/warehouses');
  },

  checkDelivery(pincode) {
    return request(
      '/delivery/check',
      {
        method: 'POST',
        body: { pincode }
      }
    );
  },

  validateCoupon(
    code,
    cartTotal
  ) {
    return request(
      '/coupons/validate',
      {
        method: 'POST',
        body: {
          code,
          cartTotal
        }
      }
    );
  },

  /* =========================
     CHECKOUT
  ========================= */

  initiatePayment(data) {
    return request(
      '/checkout/order',
      {
        method: 'POST',
        body: data
      }
    );
  },

  createOrder(data) {
    return request(
      '/checkout/order',
      {
        method: 'POST',
        body: data
      }
    );
  },

  verifyPayment(data) {
    return request(
      '/checkout/order',
      {
        method: 'POST',
        body: data
      }
    );
  },

  /* =========================
     CUSTOMER ORDERS
  ========================= */

  getOrders() {
    return request('/orders');
  },

  getOrder(orderId) {
    return request(
      `/orders/${encodeURIComponent(
        orderId
      )}`
    );
  },

  getOrderTracking(orderId) {
    return request(
      `/orders/${encodeURIComponent(
        orderId
      )}/tracking`
    );
  },

  requestReturn(data) {
    return request(
      '/orders/return',
      {
        method: 'POST',
        body: data
      }
    );
  },

  /* =========================
     ADMIN AUTH
  ========================= */

  adminLogin(
    username,
    password
  ) {
    return request(
      '/admin/login',
      {
        method: 'POST',
        body: {
          username,
          password
        }
      }
    );
  },

  adminLogout() {
    return request(
      '/admin/logout',
      {
        method: 'POST',
        auth: true
      }
    );
  },

  /* =========================
     ADMIN DASHBOARD
  ========================= */

  getAdminDashboard() {
    return request(
      '/admin/dashboard',
      {
        auth: true
      }
    );
  },

  getAdminAnalytics() {
    return request(
      '/admin/analytics',
      {
        auth: true
      }
    );
  },

  /* =========================
     ADMIN ORDERS
  ========================= */

  getAdminOrders(
    queryString = ''
  ) {
    const query = queryString
      ? `?${queryString}`
      : '';

    return request(
      `/admin/orders${query}`,
      {
        auth: true
      }
    );
  },

  getAdminOrder(orderId) {
    return request(
      `/admin/orders/${encodeURIComponent(
        orderId
      )}`,
      {
        auth: true
      }
    );
  },

  updateOrderStatus(
    orderId,
    status
  ) {
    return request(
      `/admin/orders/${encodeURIComponent(
        orderId
      )}/status`,
      {
        method: 'PATCH',
        auth: true,
        body: {
          status
        }
      }
    );
  },

  /* =========================
     ADMIN SHIPMENTS
  ========================= */

  getAdminShipments() {
    return request(
      '/admin/shipments',
      {
        auth: true
      }
    );
  },

  getAdminShipment(
    shipmentId
  ) {
    return request(
      `/admin/shipments/${encodeURIComponent(
        shipmentId
      )}`,
      {
        auth: true
      }
    );
  },

  updateShipmentStatus(
    shipmentId,
    data
  ) {
    return request(
      `/admin/shipments/${encodeURIComponent(
        shipmentId
      )}/status`,
      {
        method: 'PATCH',
        auth: true,
        body: data
      }
    );
  },

  getShipmentTracking(
    shipmentId
  ) {
    return request(
      `/admin/shipments/${encodeURIComponent(
        shipmentId
      )}/tracking`,
      {
        auth: true
      }
    );
  },

  createShipmentException(
    shipmentId,
    data
  ) {
    return request(
      `/admin/shipments/${encodeURIComponent(
        shipmentId
      )}/exception`,
      {
        method: 'POST',
        auth: true,
        body: data
      }
    );
  },

  /* =========================
     CUSTOMERS
  ========================= */

  getAdminCustomers(
    search = ''
  ) {
    const query = search
      ? `?search=${encodeURIComponent(
          search
        )}`
      : '';

    return request(
      `/admin/customers${query}`,
      {
        auth: true
      }
    );
  },

  getAdminCustomer(
    customerId
  ) {
    return request(
      `/admin/customers/${encodeURIComponent(
        customerId
      )}`,
      {
        auth: true
      }
    );
  },

  /* =========================
     INVENTORY
  ========================= */

  getAdminInventory() {
    return request(
      '/admin/inventory',
      {
        auth: true
      }
    );
  },

  updateInventory(
    skuId,
    newStock
  ) {
    return request(
      `/admin/inventory/${encodeURIComponent(
        skuId
      )}`,
      {
        method: 'PATCH',
        auth: true,
        body: {
          newStock
        }
      }
    );
  },

  /* =========================
     SHIPROCKET
  ========================= */

  getShiprocketStatus() {
    return request(
      '/admin/shiprocket/status',
      {
        auth: true
      }
    );
  },

  createShiprocketOrder(
    orderId
  ) {
    return request(
      '/admin/shiprocket/create-order',
      {
        method: 'POST',
        auth: true,
        body: {
          orderId
        }
      }
    );
  }
};