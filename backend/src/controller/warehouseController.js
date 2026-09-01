const warehouseService = require("../services/warehouseService");

const getWarehouses = (req, res) => {
  const warehouses = req.app.locals.warehouses || [];
  const queues = req.app.locals.warehouseQueues || [];

  const filtered = warehouseService.filterWarehouses(warehouses, req.query);
  const stats = warehouseService.getWarehouseStats(filtered);

  res.json({
    success: true,
    warehouses: filtered,
    queues,
    stats
  });
};

const getWarehouse = (req, res) => {
  const warehouses = req.app.locals.warehouses || [];

  const warehouse = warehouseService.getWarehouseById(
    warehouses,
    req.params.id
  );

  if (!warehouse) {
    return res.status(404).json({
      success: false,
      message: "Warehouse not found"
    });
  }

  res.json({
    success: true,
    warehouse
  });
};

const createTransfer = (req, res) => {
  const warehouses = req.app.locals.warehouses || [];

  try {
    const transfer = warehouseService.createTransfer({
      warehouses,
      fromWarehouse: req.body.fromWarehouse,
      toWarehouse: req.body.toWarehouse,
      sku: req.body.sku,
      quantity: req.body.quantity
    });

    const transfers = req.app.locals.inventoryTransfers || [];
    transfers.unshift(transfer);
    req.app.locals.inventoryTransfers = transfers;

    res.status(201).json({
      success: true,
      transfer
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to create transfer"
    });
  }
};

const updateQueue = (req, res) => {
  const queues = req.app.locals.warehouseQueues || [];
  const index = queues.findIndex((queue) => queue.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Warehouse queue not found"
    });
  }

  queues[index] = {
    ...queues[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    queue: queues[index]
  });
};

module.exports = {
  getWarehouses,
  getWarehouse,
  createTransfer,
  updateQueue
};