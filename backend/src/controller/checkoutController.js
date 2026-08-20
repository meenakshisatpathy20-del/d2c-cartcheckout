const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { inventory, activeReservations, completedOrders } = require('../constants/catalog');
const { COUPONS } = require('../constants/coupons');
const { reserveStock } = require('../services/inventoryService');
const { checkPincodeServiceability, generateSplitFulfillments } = require('../services/shiprocketService');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKey123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_mockSecret123'
});

exports.checkPincode = (req, res) => {
  try {
    const data = checkPincodeServiceability(req.body.pincode);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.validateCoupon = (req, res) => {
  const { code, cartTotal } = req.body;
  const coupon = COUPONS[code?.toUpperCase()];

  if (!coupon) return res.status(404).json({ message: "Invalid promo coupon code." });
  if (cartTotal < coupon.minOrder) {
    return res.status(400).json({ message: `Minimum cart value for ${code} is ₹${coupon.minOrder}` });
  }

  let discountAmount = 0;
  if (coupon.type === "FLAT" || coupon.type === "SHIPPING") {
    discountAmount = coupon.discount;
  } else if (coupon.type === "PERCENT") {
    discountAmount = Math.round(cartTotal * coupon.discount);
  }

  res.json({ valid: true, code: code.toUpperCase(), discountAmount });
};

exports.initiatePayment = async (req, res) => {
  const { items, customer, discountAmount = 0, shippingFee = 50 } = req.body;

  try {
    reserveStock(items);

    const reservationId = uuidv4();
    const subtotal = items.reduce((acc, item) => {
      const prod = inventory.find(p => p.id === item.skuId);
      return acc + (prod.price * item.qty);
    }, 0);

    const finalPayable = Math.max(1, subtotal + shippingFee - discountAmount);

    let rzpOrderId = `order_mock_${Date.now()}`;
    try {
      const rzpOrder = await razorpay.orders.create({
        amount: finalPayable * 100,
        currency: "INR",
        receipt: `rcpt_${reservationId.substring(0, 8)}`
      });
      rzpOrderId = rzpOrder.id;
    } catch (e) {}

    activeReservations[reservationId] = {
      items,
      customer,
      discountAmount,
      shippingFee,
      payableAmount: finalPayable,
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    res.json({
      reservationId,
      razorpayOrderId: rzpOrderId,
      amount: finalPayable * 100,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKey123',
      expiresInSeconds: 600
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.verifyPayment = (req, res) => {
  const { reservationId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const reservation = activeReservations[reservationId];
  if (!reservation) {
    return res.status(400).json({ error: "Checkout hold expired. Items returned to inventory." });
  }

  if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature) {
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: "Cryptographic signature check failed." });
    }
  }

  const orderId = `D2C-${Math.floor(100000 + Math.random() * 900000)}`;
  const fulfillments = generateSplitFulfillments(reservation.items);

  const finalOrder = {
    orderId,
    status: "CONFIRMED",
    paymentStatus: "PAID",
    paymentId: razorpay_payment_id || `pay_mock_${Date.now()}`,
    customer: reservation.customer,
    fulfillments,
    summary: {
      totalPaid: reservation.payableAmount,
      itemsCount: reservation.items.length,
      discountAmount: reservation.discountAmount,
      shippingFee: reservation.shippingFee
    },
    placedAt: new Date().toISOString()
  };

  completedOrders.unshift(finalOrder);
  delete activeReservations[reservationId];

  res.json(finalOrder);
};