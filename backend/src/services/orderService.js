const normalize = (value) =>
  String(value || '').trim().toLowerCase();

const getOrderSearchText = (order) => {
  const customer = order.customer || {};

  const items = (order.fulfillments || [])
    .map((item) => [
      item.item,
      item.brand,
      item.shipmentId,
      item.awb,
      item.courier,
      item.pickupWarehouse
    ])
    .join(' ');

  return [
    order.orderId,
    order.invoiceNumber,
    order.status,
    order.paymentStatus,
    order.paymentMethod,
    customer.name,
    customer.phone,
    customer.email,
    customer.city,
    customer.state,
    customer.pincode,
    items
  ].join(' ');
};

const filterOrders = (orders, filters = {}) => {
  let result = [...orders];

  const {
    search,
    status,
    paymentStatus,
    warehouse,
    carrier,
    dateFrom,
    dateTo
  } = filters;

  if (search) {
    const query = normalize(search);

    result = result.filter((order) =>
      normalize(getOrderSearchText(order)).includes(query)
    );
  }

  if (status && status !== 'ALL') {
    result = result.filter(
      (order) => normalize(order.status) === normalize(status)
    );
  }

  if (paymentStatus && paymentStatus !== 'ALL') {
    result = result.filter(
      (order) =>
        normalize(order.paymentStatus) === normalize(paymentStatus)
    );
  }

  if (warehouse && warehouse !== 'ALL') {
    const query = normalize(warehouse);

    result = result.filter((order) =>
      (order.fulfillments || []).some((shipment) =>
        normalize(shipment.pickupWarehouse).includes(query)
      )
    );
  }

  if (carrier && carrier !== 'ALL') {
    const query = normalize(carrier);

    result = result.filter((order) =>
      (order.fulfillments || []).some((shipment) =>
        normalize(
          shipment.carrier || shipment.courier
        ).includes(query)
      )
    );
  }

  if (dateFrom) {
    const from = new Date(`${dateFrom}T00:00:00`);

    result = result.filter(
      (order) => new Date(order.placedAt) >= from
    );
  }

  if (dateTo) {
    const to = new Date(`${dateTo}T23:59:59.999`);

    result = result.filter(
      (order) => new Date(order.placedAt) <= to
    );
  }

  return result;
};

const sortOrders = (orders, sort = 'newest') => {
  const result = [...orders];

  switch (sort) {
    case 'oldest':
      return result.sort(
        (a, b) =>
          new Date(a.placedAt) - new Date(b.placedAt)
      );

    case 'highest_value':
      return result.sort(
        (a, b) =>
          Number(b.summary?.totalPaid || 0) -
          Number(a.summary?.totalPaid || 0)
      );

    case 'lowest_value':
      return result.sort(
        (a, b) =>
          Number(a.summary?.totalPaid || 0) -
          Number(b.summary?.totalPaid || 0)
      );

    case 'customer':
      return result.sort((a, b) =>
        String(a.customer?.name || '').localeCompare(
          String(b.customer?.name || '')
        )
      );

    case 'newest':
    default:
      return result.sort(
        (a, b) =>
          new Date(b.placedAt) - new Date(a.placedAt)
      );
  }
};

const paginateOrders = (orders, page = 1, limit = 20) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(
    100,
    Math.max(1, Number(limit) || 20)
  );

  const total = orders.length;
  const totalPages = Math.max(
    1,
    Math.ceil(total / safeLimit)
  );

  const currentPage = Math.min(
    safePage,
    totalPages
  );

  const start = (currentPage - 1) * safeLimit;

  return {
    orders: orders.slice(start, start + safeLimit),
    page: currentPage,
    limit: safeLimit,
    total,
    totalPages
  };
};

const getOrderList = (orders, query) => {
  const filtered = filterOrders(orders, query);
  const sorted = sortOrders(filtered, query.sort);

  return paginateOrders(
    sorted,
    query.page,
    query.limit
  );
};

module.exports = {
  filterOrders,
  sortOrders,
  paginateOrders,
  getOrderList
};