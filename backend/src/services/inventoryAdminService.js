const normalize = (value) =>
  String(value || "").trim().toLowerCase();

const getStatus = (item) => {
  if (Number(item.available || 0) <= 0) {
    return "out_of_stock";
  }

  if (
    Number(item.available || 0) <=
    Number(item.reorderLevel || 0)
  ) {
    return "low";
  }

  return "healthy";
};

const filterInventory = (inventory, filters = {}) => {
  let result = [...inventory];

  const search = normalize(filters.search);

  if (search) {
    result = result.filter((item) =>
      [
        item.sku,
        item.product,
        item.brand,
        item.warehouse
      ]
        .map(normalize)
        .some((value) => value.includes(search))
    );
  }

  if (filters.status && filters.status !== "all") {
    result = result.filter(
      (item) => getStatus(item) === filters.status
    );
  }

  if (
    filters.warehouse &&
    filters.warehouse !== "all"
  ) {
    result = result.filter(
      (item) => item.warehouse === filters.warehouse
    );
  }

  return result.map((item) => ({
    ...item,
    status: getStatus(item)
  }));
};

const paginateInventory = (
  inventory,
  page = 1,
  limit = 20
) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const total = inventory.length;
  const totalPages = Math.max(
    Math.ceil(total / safeLimit),
    1
  );

  const start = (safePage - 1) * safeLimit;

  return {
    data: inventory.slice(start, start + safeLimit),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages
    }
  };
};

const getInventorySummary = (inventory) => {
  return inventory.reduce(
    (summary, item) => {
      summary.totalSkus += 1;
      summary.available += Number(item.available || 0);
      summary.reserved += Number(item.reserved || 0);
      summary.sold += Number(item.sold || 0);

      const status = getStatus(item);

      if (status === "low") {
        summary.lowStock += 1;
      }

      if (status === "out_of_stock") {
        summary.outOfStock += 1;
      }

      return summary;
    },
    {
      totalSkus: 0,
      available: 0,
      reserved: 0,
      sold: 0,
      lowStock: 0,
      outOfStock: 0
    }
  );
};

const findInventoryItem = (
  inventory,
  sku,
  warehouse
) => {
  return (
    inventory.find(
      (item) =>
        normalize(item.sku) === normalize(sku) &&
        normalize(item.warehouse) === normalize(warehouse)
    ) || null
  );
};

const adjustInventory = ({
  inventory,
  sku,
  warehouse,
  quantity,
  reason
}) => {
  const item = findInventoryItem(
    inventory,
    sku,
    warehouse
  );

  if (!item) {
    const error = new Error(
      "Inventory item not found"
    );
    error.statusCode = 404;
    throw error;
  }

  const amount = Number(quantity);

  if (
    !Number.isInteger(amount) ||
    amount === 0
  ) {
    const error = new Error(
      "Quantity must be a non-zero integer"
    );
    error.statusCode = 400;
    throw error;
  }

  const nextAvailable =
    Number(item.available || 0) + amount;

  if (nextAvailable < 0) {
    const error = new Error(
      "Inventory cannot become negative"
    );
    error.statusCode = 409;
    throw error;
  }

  item.available = nextAvailable;
  item.status = getStatus(item);
  item.lastUpdated = new Date().toISOString();

  return {
    item,
    movement: {
      id: `MOV-${Date.now()}`,
      sku: item.sku,
      product: item.product,
      warehouse: item.warehouse,
      type: "adjustment",
      quantity: amount,
      reference: "MANUAL",
      reason,
      time: new Date().toISOString()
    }
  };
};

const reserveInventory = ({
  inventory,
  sku,
  warehouse,
  quantity
}) => {
  const item = findInventoryItem(
    inventory,
    sku,
    warehouse
  );

  if (!item) {
    const error = new Error(
      "Inventory item not found"
    );
    error.statusCode = 404;
    throw error;
  }

  const amount = Number(quantity);

  if (
    !Number.isInteger(amount) ||
    amount <= 0
  ) {
    const error = new Error(
      "Quantity must be a positive integer"
    );
    error.statusCode = 400;
    throw error;
  }

  if (item.available < amount) {
    const error = new Error(
      "Insufficient available inventory"
    );
    error.statusCode = 409;
    throw error;
  }

  item.available -= amount;
  item.reserved += amount;
  item.status = getStatus(item);
  item.lastUpdated = new Date().toISOString();

  return item;
};

const releaseInventory = ({
  inventory,
  sku,
  warehouse,
  quantity
}) => {
  const item = findInventoryItem(
    inventory,
    sku,
    warehouse
  );

  if (!item) {
    const error = new Error(
      "Inventory item not found"
    );
    error.statusCode = 404;
    throw error;
  }

  const amount = Number(quantity);

  if (
    !Number.isInteger(amount) ||
    amount <= 0
  ) {
    const error = new Error(
      "Quantity must be a positive integer"
    );
    error.statusCode = 400;
    throw error;
  }

  if (item.reserved < amount) {
    const error = new Error(
      "Insufficient reserved inventory"
    );
    error.statusCode = 409;
    throw error;
  }

  item.reserved -= amount;
  item.available += amount;
  item.status = getStatus(item);
  item.lastUpdated = new Date().toISOString();

  return item;
};

module.exports = {
  getStatus,
  filterInventory,
  paginateInventory,
  getInventorySummary,
  findInventoryItem,
  adjustInventory,
  reserveInventory,
  releaseInventory
};