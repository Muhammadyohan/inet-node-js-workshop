const express = require("express");
const router = express.Router();
const orderSchema = require("../../models/order.model");
const {
  sendError,
  sendSuccess,
  sendInternalServerError,
} = require("../../utils/response");

/* GET orders listing. */
router.get("/", async function (req, res) {
  try {
    // Fetch all orders from the database
    const orders = await orderSchema.find();

    // Send response
    sendSuccess(res, 200, "Get orders successfully", orders);
  } catch (error) {
    sendInternalServerError(res, error);
  }
});

module.exports = router;
