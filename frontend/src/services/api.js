const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api";

const getToken = () =>
  localStorage.getItem("d2c_admin_session") ||
  sessionStorage.getItem("d2c_admin_session") ||
  "";

const request = async (path, options = {}) => {
  const token = getToken();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        (typeof data === "string" ? data : "Request failed")
    );
  }

  return data;
};

const queryString = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );

  return entries.length
    ? `?${new URLSearchParams(entries).toString()}`
    : "";
};

const api = {
  getProducts: () =>
    request("/products"),

  getProduct: (id) =>
    request(`/products/${encodeURIComponent(id)}`),

  searchProducts: (params) =>
    request(`/products${queryString(params)}`),

  checkDelivery: (pincode) =>
    request(`/delivery/check?pincode=${encodeURIComponent(pincode)}`),

  validateCoupon: (code, subtotal) =>
    request("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({
        code,
        subtotal
      })
    }),

  createOrder: (payload) =>
    request("/checkout/order", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  initiatePayment: (payload) =>
    request("/checkout/payment", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  verifyPayment: (payload) =>
    request("/checkout/payment/verify", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  getCustomerOrders: () =>
    request("/orders/customer"),

  getOrder: (orderId) =>
    request(`/orders/customer/${encodeURIComponent(orderId)}`),

  trackOrder: (trackingId) =>
    request(`/shipments/track/${encodeURIComponent(trackingId)}`),

  getOrderTracking: (orderId) =>
    request(`/shipments/track/${encodeURIComponent(orderId)}`),

  requestReturn: (payload) =>
    request("/orders/return", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  cancelOrder: (orderId) =>
    request(`/orders/customer/${encodeURIComponent(orderId)}/cancel`, {
      method: "PATCH"
    }),

  submitFranchiseLead: (payload) =>
    request("/franchise/leads", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  getFranchiseLeads: () =>
    request("/franchise/leads"),

  adminLogin: (payload) =>
    request("/admin/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  adminMe: () =>
    request("/admin/me"),

  getAdminOrders: (params = {}) =>
    request(`/admin/orders${queryString(params)}`),

  getAdminOrder: (orderId) =>
    request(`/admin/orders/${encodeURIComponent(orderId)}`),

  getAdminCustomers: (params = {}) =>
    request(`/admin/customers${queryString(params)}`),

  getAdminCustomer: (customerId) =>
    request(`/admin/customers/${encodeURIComponent(customerId)}`),

  getAdminShipments: (params = {}) =>
    request(`/shipments${queryString(params)}`),

  getAdminShipment: (shipmentId) =>
    request(`/shipments/${encodeURIComponent(shipmentId)}`),

  createAdminShipment: (payload) =>
    request("/shipments", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  assignShipmentAwb: (payload) =>
    request("/shipments/awb", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  updateAdminShipment: (shipmentId, payload) =>
    request(`/shipments/${encodeURIComponent(shipmentId)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),

  getAdminWarehouses: (params = {}) =>
    request(`/warehouses${queryString(params)}`),

  getAdminWarehouse: (warehouseId) =>
    request(`/warehouses/${encodeURIComponent(warehouseId)}`),

  transferInventory: (payload) =>
    request("/warehouses/transfers", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  updateWarehouseQueue: (queueId, payload) =>
    request(`/warehouses/queues/${encodeURIComponent(queueId)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),

  getAdminInventory: (params = {}) =>
    request(`/admin/inventory${queryString(params)}`),

  getAdminInventoryItem: (sku) =>
    request(`/admin/inventory/${encodeURIComponent(sku)}`),

  adjustInventory: (payload) =>
    request("/admin/inventory/adjust", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  reserveInventory: (payload) =>
    request("/admin/inventory/reserve", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  releaseInventory: (payload) =>
    request("/admin/inventory/release", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  getAdminReturns: (params = {}) =>
    request(`/returns${queryString(params)}`),

  getAdminReturn: (returnId) =>
    request(`/returns/${encodeURIComponent(returnId)}`),

  updateAdminReturn: (returnId, payload) =>
    request(`/returns/${encodeURIComponent(returnId)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),

  updateStock: (skuId, newStock) =>
    request("/admin/inventory/adjust", {
      method: "POST",
      body: JSON.stringify({
        sku: skuId,
        quantity: newStock,
        mode: "SET"
      })
    }),

  updateShipmentStatus: (orderId, shipmentId, newStatus) =>
    request(`/admin/orders/${encodeURIComponent(orderId)}/shipment-status`, {
      method: "PATCH",
      body: JSON.stringify({
        shipmentId,
        status: newStatus
      })
    })
};

export default api;
export { api };