const { inventory, activeReservations } = require('../constants/catalog');

function startReservationWorker() {
  setInterval(() => {
    const now = Date.now();
    for (const [resId, resData] of Object.entries(activeReservations)) {
      if (now > resData.expiresAt) {
        resData.items.forEach(item => {
          const prod = inventory.find(p => p.id === item.skuId);
          if (prod) prod.stock += item.qty;
        });
        delete activeReservations[resId];
      }
    }
  }, 10000);
}

function reserveStock(items) {
  for (let item of items) {
    const product = inventory.find(p => p.id === item.skuId);
    if (!product || product.stock < item.qty) {
      throw new Error(`Insufficient inventory for ${product ? product.name : 'item'}`);
    }
  }

  items.forEach(item => {
    const product = inventory.find(p => p.id === item.skuId);
    product.stock -= item.qty;
  });
}

function restoreStock(items) {
  items.forEach(item => {
    const product = inventory.find(p => p.id === item.skuId);
    if (product) product.stock += item.qty;
  });
}

module.exports = {
  startReservationWorker,
  reserveStock,
  restoreStock
};