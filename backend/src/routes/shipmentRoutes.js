const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const controller = require("../controllers/shipmentController");

const router = express.Router();

router.get(
  "/track/:id",
  controller.trackShipment
);

router.use(adminAuth);

router.get("/", controller.getShipments);
router.get("/:id", controller.getShipment);
router.post("/", controller.createShipment);
router.post("/awb", controller.assignAWB);
router.patch("/:id", controller.updateShipment);

module.exports = router;