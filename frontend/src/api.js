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
  checkPincode: (pincode) => request('/shiprocket/check-pincode', {
    method: 'POST',
    body: JSON.stringify({ pincode })
  }),
  validateCoupon: (code, cartTotal) => request('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, cartTotal })
  }),
  initiatePayment: (payload) => request('/checkout/initiate-payment', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  verifyPayment: (payload) => request('/checkout/verify-payment', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  trackOrder: (query) => request(`/orders/track/${encodeURIComponent(query)}`),
  getAdminOrders: () => request('/admin/orders'),
  updateStock: (skuId, newStock) => request('/admin/inventory/update', {
    method: 'POST',
    body: JSON.stringify({ skuId, newStock })
  }),
  updateShipmentStatus: (orderId, shipmentId, newStatus) => request('/admin/shipment/update-status', {
    method: 'POST',
    body: JSON.stringify({ orderId, shipmentId, newStatus })
  })
};