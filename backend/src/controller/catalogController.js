const { inventory } = require('../constants/catalog');

exports.getCatalog = (req, res) => {
  res.json(inventory);
};

exports.updateCatalogStock = (req, res) => {
  const { skuId, newStock } = req.body;
  const product = inventory.find(p => p.id === skuId);
  if (!product) return res.status(404).json({ error: "Product not found." });

  product.stock = Math.max(0, parseInt(newStock, 10));
  res.json({ message: "Stock updated successfully.", product });
};