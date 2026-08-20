const express = require('express');
const router = express.Router();

const catalogController = require('../controllers/catalogController');
const checkoutController = require('../controllers/checkoutController');
const orderController = require('../controllers/orderController');

router.get('/products', catalogController.getCatalog);
router.post('/shiprocket/check-pincode', checkoutController.checkPincode);
router.post('/coupons/validate', checkoutController.validateCoupon);

router.post('/checkout/initiate-payment', checkoutController.initiatePayment);
router.post('/checkout/verify-payment', checkoutController.verifyPayment);

router.get('/orders/track/:query', orderController.trackOrder);
router.get('/admin/orders', orderController.getAllOrders);
router.post('/admin/inventory/update', catalogController.updateCatalogStock);
router.post('/admin/shipment/update-status', orderController.updateShipmentStatus);

module.exports = router;