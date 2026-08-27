const {
  getOrderList
} = require('../services/orderService');

const getOrders = (req, res) => {
  const orders = req.app.locals.completedOrders || [];

  const result = getOrderList(orders, req.query);

  res.json({
    success: true,
    ...result
  });
};

const getOrderById = (req, res) => {
  const orders = req.app.locals.completedOrders || [];

  const order = orders.find(
    (item) => item.orderId === req.params.orderId
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found',
      code: 'ORDER_NOT_FOUND'
    });
  }

  res.json({
    success: true,
    order
  });
};

module.exports = {
  getOrders,
  getOrderById
};