const express = require('express');
const {
  getOrders,
  getOrderById
} = require('../controllers/orderController');
const { adminAuth } = require('../middleware/adminAuth');

const router = express.Router();

router.get('/', adminAuth, getOrders);
router.get('/:orderId', adminAuth, getOrderById);

module.exports = router;