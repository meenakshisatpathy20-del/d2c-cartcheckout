const axios = require("axios");

let cachedToken = null;
let tokenExpiresAt = 0;

const getConfig = () => ({
  email: process.env.SHIPROCKET_EMAIL,
  password: process.env.SHIPROCKET_PASSWORD,
  baseUrl:
    process.env.SHIPROCKET_BASE_URL ||
    "https://apiv2.shiprocket.in/v1/external"
});

const getToken = async () => {
  const config = getConfig();

  if (!config.email || !config.password) {
    throw new Error("Shiprocket credentials are not configured");
  }

  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const response = await axios.post(
    `${config.baseUrl}/auth/login`,
    {
      email: config.email,
      password: config.password
    },
    {
      timeout: 15000
    }
  );

  cachedToken = response.data?.token || null;
  tokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000;

  if (!cachedToken) {
    throw new Error("Shiprocket authentication failed");
  }

  return cachedToken;
};

const request = async ({
  method = "get",
  path,
  data,
  params
}) => {
  const config = getConfig();
  const token = await getToken();

  const response = await axios({
    method,
    url: `${config.baseUrl}${path}`,
    data,
    params,
    timeout: 20000,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  return response.data;
};

const checkServiceability = async ({
  pickupPostcode,
  deliveryPostcode,
  weight = 0.5,
  cod = 0
}) => {
  return request({
    path: "/courier/serviceability/",
    params: {
      pickup_postcode: pickupPostcode,
      delivery_postcode: deliveryPostcode,
      weight,
      cod
    }
  });
};

const createOrder = async (payload) => {
  return request({
    method: "post",
    path: "/orders/create/adhoc",
    data: payload
  });
};

const generateAWB = async (shipmentId, courierId) => {
  return request({
    method: "post",
    path: "/courier/assign/awb",
    data: {
      shipment_id: shipmentId,
      courier_id: courierId
    }
  });
};

const generatePickup = async (shipmentIds) => {
  return request({
    method: "post",
    path: "/courier/generate/pickup",
    data: {
      shipment_id: shipmentIds
    }
  });
};

const trackShipment = async (shipmentId) => {
  return request({
    path: `/courier/track/shipment/${shipmentId}`
  });
};

const trackAWB = async (awb) => {
  return request({
    path: `/courier/track/awb/${encodeURIComponent(awb)}`
  });
};

const getShipmentDetails = async (shipmentId) => {
  return request({
    path: `/shipments/${shipmentId}`
  });
};

module.exports = {
  getToken,
  checkServiceability,
  createOrder,
  generateAWB,
  generatePickup,
  trackShipment,
  trackAWB,
  getShipmentDetails
};