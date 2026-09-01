const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const controller = require("../controllers/inventoryAdminController");

const router = express.Router();

router.use(adminAuth);

router.get("/", controller.getInventory);
router.get("/:sku", controller.getInventoryItem);
router.post("/adjust", controller.adjustInventory);
router.post("/reserve", controller.reserveInventory);
router.post("/release", controller.releaseInventory);

module.exports = router;