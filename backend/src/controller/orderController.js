const { completedOrders } = require('../constants/catalog');

exports.getAllOrders = (req, res) => {
  res.json(completedOrders);
};

exports.trackOrder = (req, res) => {
  const q = req.params.query.trim().toUpperCase();
  const matched = completedOrders.find(o => 
    o.orderId.toUpperCase() === q || 
    o.fulfillments.some(f => f.awb.toUpperCase() === q)
  );

  if (!matched) return res.status(404).json({ error: "No order or AWB found matching your query." });
  res.json(matched);
};

exports.updateShipmentStatus = (req, res) => {
  const { orderId, shipmentId, newStatus } = req.body;
  const order = completedOrders.find(o => o.orderId === orderId);
  if (!order) return res.status(404).json({ error: "Order not found." });

  const fulfillment = order.fulfillments.find(f => f.shipmentId === shipmentId);
  if (!fulfillment) return res.status(404).json({ error: "Fulfillment record not found." });

  fulfillment.status = newStatus;
  res.json({ message: "Shipment status updated.", fulfillment });
};