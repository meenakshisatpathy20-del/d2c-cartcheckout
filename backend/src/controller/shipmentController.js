const shipmentService = require("../services/shipmentService");

const getShipments = (req, res) => {
  const shipments =
    req.app.locals.shipments || [];

  let result = [...shipments];

  const search = String(
    req.query.search || ""
  )
    .trim()
    .toLowerCase();

  if (search) {
    result = result.filter((shipment) =>
      [
        shipment.shipmentId,
        shipment.orderId,
        shipment.customer,
        shipment.awb,
        shipment.phone,
        shipment.carrier
      ]
        .map((value) =>
          String(value || "").toLowerCase()
        )
        .some((value) =>
          value.includes(search)
        )
    );
  }

  if (
    req.query.status &&
    req.query.status !== "all"
  ) {
    result = result.filter(
      (shipment) =>
        shipment.status === req.query.status
    );
  }

  if (
    req.query.carrier &&
    req.query.carrier !== "all"
  ) {
    result = result.filter(
      (shipment) =>
        shipment.carrier === req.query.carrier
    );
  }

  if (
    req.query.warehouse &&
    req.query.warehouse !== "all"
  ) {
    result = result.filter(
      (shipment) =>
        shipment.warehouse ===
        req.query.warehouse
    );
  }

  res.json({
    success: true,
    shipments: result
  });
};

const getShipment = (req, res) => {
  const shipments =
    req.app.locals.shipments || [];

  const shipment = shipments.find(
    (item) =>
      String(item.shipmentId) ===
      String(req.params.id)
  );

  if (!shipment) {
    return res.status(404).json({
      success: false,
      message: "Shipment not found"
    });
  }

  res.json({
    success: true,
    shipment
  });
};

const trackShipment = async (req, res) => {
  const shipments =
    req.app.locals.shipments || [];

  const shipment = shipments.find(
    (item) =>
      String(item.shipmentId) ===
        String(req.params.id) ||
      item.awb === req.params.id
  );

  if (!shipment) {
    return res.status(404).json({
      success: false,
      message: "Shipment not found"
    });
  }

  try {
    if (
      shipment.provider === "shiprocket" &&
      (shipment.shiprocketShipmentId ||
        shipment.awb)
    ) {
      const tracking =
        await shipmentService.trackShipment({
          shipmentId:
            shipment.shiprocketShipmentId,
          awb: shipment.awb
        });

      return res.json({
        success: true,
        shipment,
        tracking
      });
    }

    res.json({
      success: true,
      shipment,
      tracking: {
        status: shipment.status,
        events: shipment.events || []
      }
    });
  } catch (error) {
    res.status(502).json({
      success: false,
      message:
        "Carrier tracking is temporarily unavailable",
      shipment
    });
  }
};

const createShipment = async (req, res) => {
  const shipments =
    req.app.locals.shipments || [];

  try {
    const shipment =
      await shipmentService.createShipment({
        shipment: req.body,
        useShiprocket:
          req.body.useShiprocket !== false
      });

    shipments.unshift(shipment);

    req.app.locals.shipments =
      shipments;

    res.status(201).json({
      success: true,
      shipment
    });
  } catch (error) {
    res.status(502).json({
      success: false,
      message:
        error.message ||
        "Unable to create shipment"
    });
  }
};

const assignAWB = async (req, res) => {
  try {
    const result =
      await shipmentService.assignAWB({
        shipmentId:
          req.body.shipmentId,
        courierId:
          req.body.courierId
      });

    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(502).json({
      success: false,
      message:
        error.message ||
        "Unable to assign AWB"
    });
  }
};

const updateShipment = (req, res) => {
  const shipments =
    req.app.locals.shipments || [];

  const index = shipments.findIndex(
    (item) =>
      String(item.shipmentId) ===
      String(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Shipment not found"
    });
  }

  shipments[index] = {
    ...shipments[index],
    ...req.body,
    lastUpdated:
      new Date().toISOString()
  };

  res.json({
    success: true,
    shipment: shipments[index]
  });
};

module.exports = {
  getShipments,
  getShipment,
  trackShipment,
  createShipment,
  assignAWB,
  updateShipment
};