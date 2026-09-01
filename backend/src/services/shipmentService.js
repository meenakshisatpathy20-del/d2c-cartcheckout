const shiprocketService = require("./shiprocketService");

const normalizeStatus = (value) => {
  const status = String(value || "").toLowerCase();

  if (
    status.includes("delivered")
  ) {
    return "delivered";
  }

  if (
    status.includes("out for delivery") ||
    status.includes("ofd")
  ) {
    return "out_for_delivery";
  }

  if (
    status.includes("shipped") ||
    status.includes("in transit") ||
    status.includes("transit")
  ) {
    return "in_transit";
  }

  if (
    status.includes("picked") ||
    status.includes("pickup")
  ) {
    return "picked_up";
  }

  if (
    status.includes("cancel")
  ) {
    return "cancelled";
  }

  if (
    status.includes("return")
  ) {
    return "returned";
  }

  if (
    status.includes("exception") ||
    status.includes("failed")
  ) {
    return "delivery_failed";
  }

  return "processing";
};

const createShipment = async ({
  shipment,
  useShiprocket = true
}) => {
  if (!useShiprocket) {
    return {
      ...shipment,
      provider: "internal",
      status: "processing"
    };
  }

  const payload = shipment.shiprocketPayload;

  if (!payload) {
    throw new Error(
      "Shiprocket order payload is required"
    );
  }

  const response =
    await shiprocketService.createOrder(payload);

  return {
    ...shipment,
    provider: "shiprocket",
    shiprocketOrderId:
      response?.order_id || null,
    shiprocketShipmentId:
      response?.shipment_id || null,
    status: "processing",
    providerResponse: response
  };
};

const assignAWB = async ({
  shipmentId,
  courierId
}) => {
  const response =
    await shiprocketService.generateAWB(
      shipmentId,
      courierId
    );

  return {
    ...response,
    shipmentId,
    courierId
  };
};

const schedulePickup = async (
  shipmentIds
) => {
  return shiprocketService.generatePickup(
    shipmentIds
  );
};

const trackShipment = async ({
  shipmentId,
  awb
}) => {
  if (awb) {
    return shiprocketService.trackAWB(awb);
  }

  return shiprocketService.trackShipment(
    shipmentId
  );
};

const updateFromWebhook = ({
  shipments,
  payload
}) => {
  const awb =
    payload?.awb ||
    payload?.awb_code ||
    payload?.tracking_number;

  const shipmentId =
    payload?.shipment_id ||
    payload?.shipmentId;

  const orderId =
    payload?.order_id ||
    payload?.orderId;

  const rawStatus =
    payload?.current_status ||
    payload?.status ||
    payload?.shipment_status;

  const normalizedStatus =
    normalizeStatus(rawStatus);

  const shipment = shipments.find(
    (item) =>
      (awb && item.awb === awb) ||
      (shipmentId &&
        String(item.shipmentId) ===
          String(shipmentId)) ||
      (orderId &&
        String(item.orderId) ===
          String(orderId))
  );

  if (!shipment) {
    return null;
  }

  shipment.status = normalizedStatus;
  shipment.providerStatus = rawStatus;
  shipment.lastUpdated =
    new Date().toISOString();

  if (awb) {
    shipment.awb = awb;
  }

  if (payload?.courier_name) {
    shipment.carrier =
      payload.courier_name;
  }

  if (payload?.location) {
    shipment.currentLocation =
      payload.location;
  }

  shipment.events =
    Array.isArray(shipment.events)
      ? shipment.events
      : [];

  shipment.events.unshift({
    status: normalizedStatus,
    providerStatus: rawStatus,
    location:
      payload?.location || null,
    timestamp:
      payload?.updated_at ||
      new Date().toISOString()
  });

  return shipment;
};

module.exports = {
  normalizeStatus,
  createShipment,
  assignAWB,
  schedulePickup,
  trackShipment,
  updateFromWebhook
};