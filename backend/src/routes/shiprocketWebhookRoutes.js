const express = require("express");
const controller = require("../controllers/shiprocketWebhookController");

const router = express.Router();

router.post(
  "/shiprocket",
  controller.handleWebhook
);

module.exports = router;