const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? '/api'
    : 'http://localhost:5000/api');

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  };

  let response;

  try {
    response = await fetch(`${API_BASE}${endpoint}`, config);
  } catch (error) {
    throw new Error(
      'Unable to connect to the server. Please check your connection.'
    );
  }

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.error ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
}

export const api = {
  async getProducts() {
    return request('/products');
  },

  async checkDelivery(pincode) {
    return request('/delivery/check', {
      method: 'POST',
      body: JSON.stringify({ pincode })
    });
  },

  async validateCoupon(code, cartTotal) {
    return request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({
        code,
        cartTotal
      })
    });
  },

  async initiatePayment(payload) {
    return request('/checkout/order', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async verifyPayment(payload) {
    return request('/checkout/verify', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getCustomerOrders() {
    return request('/orders');
  },

  async requestReturn(payload) {
    return request('/orders/return', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async updateStock(skuId, newStock) {
    return request('/admin/inventory/update', {
      method: 'POST',
      body: JSON.stringify({
        skuId,
        newStock
      })
    });
  },

  async updateShipmentStatus(
    orderId,
    shipmentId,
    newStatus
  ) {
    return request('/admin/shipment/status', {
      method: 'POST',
      body: JSON.stringify({
        orderId,
        shipmentId,
        newStatus
      })
    });
  },

  async getAdminDashboardStats() {
    return request('/admin/dashboard/stats');
  },

  async getAdminOrders(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        query.set(key, value);
      }
    });

    const queryString = query.toString();

    return request(
      `/admin/orders${queryString ? `?${queryString}` : ''}`
    );
  },

  async getAdminOrder(orderId) {
    return request(
      `/admin/orders/${encodeURIComponent(orderId)}`
    );
  },

  async updateAdminOrderStatus(orderId, status) {
    return request('/admin/order/status', {
      method: 'POST',
      body: JSON.stringify({
        orderId,
        status
      })
    });
  },

  async getAdminWarehouses() {
    return request('/admin/warehouses');
  },

  async getShipmentTracking(orderId, shipmentId) {
    return request(
      `/admin/shipments/${encodeURIComponent(
        shipmentId
      )}/tracking?orderId=${encodeURIComponent(orderId)}`
    );
  },

  async refreshShipmentTracking(orderId, shipmentId) {
    return request('/admin/shipments/tracking/refresh', {
      method: 'POST',
      body: JSON.stringify({
        orderId,
        shipmentId
      })
    });
  },

  async getCustomerDetails(customerId) {
    return request(
      `/admin/customers/${encodeURIComponent(customerId)}`
    );
  },

  async getAdminCustomers(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        query.set(key, value);
      }
    });

    const queryString = query.toString();

    return request(
      `/admin/customers${queryString ? `?${queryString}` : ''}`
    );
  },

  async getAdminInventory(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        query.set(key, value);
      }
    });

    const queryString = query.toString();

    return request(
      `/admin/inventory${queryString ? `?${queryString}` : ''}`
    );
  },

  async adminLogin(credentials) {
    return request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }
};