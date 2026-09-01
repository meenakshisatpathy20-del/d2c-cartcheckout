const inventoryService = require("../services/inventoryAdminService");

const getInventory = (req, res) => {
  const inventory = req.app.locals.inventory || [];

  const filtered = inventoryService.filterInventory(
    inventory,
    req.query
  );

  const result = inventoryService.paginateInventory(
    filtered,
    req.query.page,
    req.query.limit
  );

  const movements =
    req.app.locals.inventoryMovements || [];

  res.json({
    success: true,
    inventory: result.data,
    movements: movements.slice(0, 50),
    summary: inventoryService.getInventorySummary(
      filtered
    ),
    pagination: result.pagination
  });
};

const getInventoryItem = (req, res) => {
  const inventory = req.app.locals.inventory || [];

  const item = inventoryService.findInventoryItem(
    inventory,
    req.params.sku,
    req.query.warehouse
  );

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Inventory item not found"
    });
  }

  res.json({
    success: true,
    item
  });
};

const adjustInventory = (req, res) => {
  const inventory = req.app.locals.inventory || [];

  try {
    const result = inventoryService.adjustInventory({
      inventory,
      sku: req.body.sku,
      warehouse: req.body.warehouse,
      quantity: req.body.quantity,
      reason: req.body.reason
    });

    const movements =
      req.app.locals.inventoryMovements || [];

    movements.unshift(result.movement);

    req.app.locals.inventoryMovements =
      movements.slice(0, 500);

    res.json({
      success: true,
      item: result.item,
      movement: result.movement
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Unable to adjust inventory"
    });
  }
};

const reserveInventory = (req, res) => {
  const inventory = req.app.locals.inventory || [];

  try {
    const item = inventoryService.reserveInventory({
      inventory,
      sku: req.body.sku,
      warehouse: req.body.warehouse,
      quantity: req.body.quantity
    });

    res.json({
      success: true,
      item
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Unable to reserve inventory"
    });
  }
};

const releaseInventory = (req, res) => {
  const inventory = req.app.locals.inventory || [];

  try {
    const item = inventoryService.releaseInventory({
      inventory,
      sku: req.body.sku,
      warehouse: req.body.warehouse,
      quantity: req.body.quantity
    });

    res.json({
      success: true,
      item
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Unable to release inventory"
    });
  }
};

module.exports = {
  getInventory,
  getInventoryItem,
  adjustInventory,
  reserveInventory,
  releaseInventory
};