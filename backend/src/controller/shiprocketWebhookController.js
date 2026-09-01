const shipmentService = require("../services/shipmentService");

const handleWebhook = (req, res) => {
  const shipments =
    req.app.locals.shipments || [];

  const payload = req.body || {};

  const shipment =
    shipmentService.updateFromWebhook({
      shipments,
      payload
    });

  if (!shipment) {
    return res.status(200).json({
      success: true,
      received: true,
      matched: false
    });
  }

  const webhookEvents =
    req.app.locals.shipmentWebhookEvents || [];

  webhookEvents.unshift({
    id: `WEBHOOK-${Date.now()}`,
    receivedAt:
      new Date().toISOString(),
    shipmentId:
      shipment.shipmentId,
    orderId:
      shipment.orderId,
    status:
      shipment.status
  });

  req.app.locals.shipmentWebhookEvents =
    webhookEvents.slice(0, 500);

  res.json({
    success: true,
    received: true,
    matched: true,
    shipmentId:
      shipment.shipmentId
  });
};

module.exports = {
  handleWebhook
};