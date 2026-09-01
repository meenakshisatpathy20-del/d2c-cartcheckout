const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const warehouseController = require("../controllers/warehouseController");

const router = express.Router();

router.use(adminAuth);

router.get("/", warehouseController.getWarehouses);
router.get("/:id", warehouseController.getWarehouse);
router.post("/transfers", warehouseController.createTransfer);
router.patch("/queues/:id", warehouseController.updateQueue);

module.exports = router;