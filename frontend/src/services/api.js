const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || `HTTP ${response.status}`);
  }
  return data;
}

export const api = {
  getProducts: () => request('/products'),
  checkDelivery: (pincode) => request('/delivery/check', {
    method: 'POST',
    body: JSON.stringify({ pincode })
  }),
  validateCoupon: (code, cartTotal) => request('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, cartTotal })
  }),
  createOrder: (payload) => request('/checkout/order', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getCustomerOrders: () => request('/orders'),
  trackOrder: (orderId) => request(`/orders/track/${encodeURIComponent(orderId)}`),
  requestReturn: (payload) => request('/orders/return', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getAdminMetrics: () => request('/admin/metrics'),
  updateStock: (skuId, newStock) => request('/admin/inventory/update', {
    method: 'POST',
    body: JSON.stringify({ skuId, newStock })
  }),
  updateShipmentStatus: (orderId, shipmentId, newStatus) => request('/admin/shipment/status', {
    method: 'POST',
    body: JSON.stringify({ orderId, shipmentId, newStatus })
  })
};