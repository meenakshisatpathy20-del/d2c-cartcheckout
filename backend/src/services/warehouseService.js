const normalize = (value) => String(value || "").trim().toLowerCase();

const getWarehouseById = (warehouses, id) => {
  return warehouses.find((warehouse) => warehouse.id === id) || null;
};

const getWarehouseStats = (warehouses) => {
  return warehouses.reduce(
    (stats, warehouse) => {
      stats.capacity += Number(warehouse.capacity || 0);
      stats.occupied += Number(warehouse.occupied || 0);
      stats.available += Number(warehouse.available || 0);
      stats.ordersToday += Number(warehouse.ordersToday || 0);
      stats.pendingOrders += Number(warehouse.pendingOrders || 0);
      stats.dispatchToday += Number(warehouse.dispatchToday || 0);
      stats.lowStock += Number(warehouse.lowStock || 0);
      return stats;
    },
    {
      capacity: 0,
      occupied: 0,
      available: 0,
      ordersToday: 0,
      pendingOrders: 0,
      dispatchToday: 0,
      lowStock: 0
    }
  );
};

const searchWarehouses = (warehouses, search) => {
  const query = normalize(search);

  if (!query) return warehouses;

  return warehouses.filter((warehouse) =>
    [
      warehouse.id,
      warehouse.name,
      warehouse.city,
      warehouse.state,
      warehouse.code
    ]
      .map(normalize)
      .some((value) => value.includes(query))
  );
};

const filterWarehouses = (warehouses, filters = {}) => {
  let result = [...warehouses];

  if (filters.search) {
    result = searchWarehouses(result, filters.search);
  }

  if (filters.status && filters.status !== "all") {
    result = result.filter(
      (warehouse) => warehouse.status === filters.status
    );
  }

  return result;
};

const createTransfer = ({
  warehouses,
  fromWarehouse,
  toWarehouse,
  sku,
  quantity
}) => {
  const source = getWarehouseById(warehouses, fromWarehouse);
  const destination = getWarehouseById(warehouses, toWarehouse);

  if (!source) {
    const error = new Error("Source warehouse not found");
    error.statusCode = 404;
    throw error;
  }

  if (!destination) {
    const error = new Error("Destination warehouse not found");
    error.statusCode = 404;
    throw error;
  }

  if (source.id === destination.id) {
    const error = new Error("Source and destination must be different");
    error.statusCode = 400;
    throw error;
  }

  const amount = Number(quantity);

  if (!Number.isInteger(amount) || amount <= 0) {
    const error = new Error("Quantity must be a positive integer");
    error.statusCode = 400;
    throw error;
  }

  if (Number(source.available || 0) < amount) {
    const error = new Error("Insufficient available inventory");
    error.statusCode = 409;
    throw error;
  }

  if (Number(destination.available || 0) < amount) {
    const error = new Error("Destination warehouse capacity is insufficient");
    error.statusCode = 409;
    throw error;
  }

  return {
    id: `TR-${Date.now()}`,
    sku,
    quantity: amount,
    fromWarehouse: source.id,
    toWarehouse: destination.id,
    status: "created",
    createdAt: new Date().toISOString()
  };
};

module.exports = {
  getWarehouseById,
  getWarehouseStats,
  searchWarehouses,
  filterWarehouses,
  createTransfer
};