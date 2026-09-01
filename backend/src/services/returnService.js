const normalize = (value) =>
  String(value || "").trim().toLowerCase();

const filterReturns = (returns, filters = {}) => {
  let result = [...returns];

  const search = normalize(filters.search);

  if (search) {
    result = result.filter((item) =>
      [
        item.id,
        item.orderId,
        item.customer,
        item.phone,
        item.product,
        item.sku
      ]
        .map(normalize)
        .some((value) => value.includes(search))
    );
  }

  if (filters.status && filters.status !== "all") {
    result = result.filter(
      (item) => item.status === filters.status
    );
  }

  if (
    filters.refundStatus &&
    filters.refundStatus !== "all"
  ) {
    result = result.filter(
      (item) => item.refundStatus === filters.refundStatus
    );
  }

  return result.sort(
    (a, b) =>
      new Date(b.requestedAt) -
      new Date(a.requestedAt)
  );
};

const paginateReturns = (
  returns,
  page = 1,
  limit = 20
) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const total = returns.length;
  const totalPages = Math.max(
    Math.ceil(total / safeLimit),
    1
  );

  const start = (safePage - 1) * safeLimit;

  return {
    data: returns.slice(start, start + safeLimit),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages
    }
  };
};

const getSummary = (returns) => {
  return returns.reduce(
    (summary, item) => {
      if (item.status === "requested") {
        summary.requested += 1;
      }

      if (item.status === "approved") {
        summary.approved += 1;
      }

      if (
        item.refundStatus === "pending" ||
        item.refundStatus === "processing"
      ) {
        summary.refundsProcessing += 1;
      }

      if (item.refundStatus === "completed") {
        summary.refundedValue += Number(
          item.refundAmount || 0
        );
      }

      return summary;
    },
    {
      requested: 0,
      approved: 0,
      refundsProcessing: 0,
      refundedValue: 0
    }
  );
};

const getReturnById = (returns, id) =>
  returns.find((item) => item.id === id) || null;

const updateReturn = (
  returns,
  id,
  action,
  payload = {}
) => {
  const item = getReturnById(returns, id);

  if (!item) {
    const error = new Error("Return not found");
    error.statusCode = 404;
    throw error;
  }

  if (action === "approve") {
    if (item.status !== "requested") {
      const error = new Error(
        "Only requested returns can be approved"
      );
      error.statusCode = 409;
      throw error;
    }

    item.status = "approved";
    item.pickupStatus = "scheduled";
    item.refundStatus = "pending";
  }

  if (action === "reject") {
    if (item.status !== "requested") {
      const error = new Error(
        "Only requested returns can be rejected"
      );
      error.statusCode = 409;
      throw error;
    }

    item.status = "rejected";
    item.pickupStatus = "not_scheduled";
    item.refundStatus = "not_applicable";
    item.rejectionReason =
      payload.reason || "Return request rejected";
  }

  if (action === "pickup") {
    if (
      item.status !== "approved" ||
      item.pickupStatus !== "scheduled"
    ) {
      const error = new Error(
        "Return is not ready for pickup completion"
      );
      error.statusCode = 409;
      throw error;
    }

    item.status = "picked_up";
    item.pickupStatus = "completed";
    item.refundStatus = "processing";
  }

  if (action === "refund") {
    if (
      item.status !== "picked_up" ||
      item.refundStatus !== "processing"
    ) {
      const error = new Error(
        "Return is not ready for refund"
      );
      error.statusCode = 409;
      throw error;
    }

    item.status = "refunded";
    item.refundStatus = "completed";
    item.refundedAt = new Date().toISOString();
  }

  item.updatedAt = new Date().toISOString();

  return item;
};

module.exports = {
  filterReturns,
  paginateReturns,
  getSummary,
  getReturnById,
  updateReturn
};