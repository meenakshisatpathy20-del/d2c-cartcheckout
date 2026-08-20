const COUPONS = {
  "D2C100": { minOrder: 999, discount: 100, type: "FLAT", desc: "Flat ₹100 OFF" },
  "FREESHIP": { minOrder: 500, discount: 50, type: "SHIPPING", desc: "Free Delivery Waiver" },
  "FESTIVE20": { minOrder: 1999, discount: 0.20, type: "PERCENT", desc: "20% Super Festive Discount" }
};

module.exports = { COUPONS };