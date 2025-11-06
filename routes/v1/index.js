const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/json.webtoken.middleware");

/* GET home page for API version 1. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "api v1" });
});

// Import other route modules
router.use("/", require("./auth"));
router.use("/users", require("./users"));
router.use("/products", verifyToken, require("./products"));
router.use("/orders", verifyToken, require("./orders"));

module.exports = router;
