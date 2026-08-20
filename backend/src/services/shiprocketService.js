const { inventory } = require('../constants/catalog');

function checkPincodeServiceability(pincode) {
  if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
    throw new Error("Enter a valid 6-digit pin code.");
  }

  const isDeliverable = !pincode.startsWith("000");
  const estimatedDays = pincode.startsWith("83") ? 2 : 4;

  return {
    deliverable: isDeliverable,
    estimatedDays,
    courierPartner: pincode.startsWith("83") ? "Delhivery Surface (Shiprocket)" : "Blue Dart Air (Shiprocket)",
    codAvailable: true,
    shippingFee: 50
  };
}

function generateSplitFulfillments(items) {
  return items.map((item, idx) => {
    const product = inventory.find(p => p.id === item.skuId);
    return {
      shipmentId: `SR-${Math.floor(10000 + Math.random() * 90000)}`,
      brand: product.brand,
      pickupWarehouse: product.warehouseCity,
      awb: `AWB${Math.floor(10000000 + Math.random() * 90000000)}IN`,
      courier: idx % 2 === 0 ? "Delhivery Surface" : "Blue Dart Express Air",
      status: "READY_TO_SHIP",
      item: product.name,
      qty: item.qty
    };
  });
}

module.exports = {
  checkPincodeServiceability,
  generateSplitFulfillments
};