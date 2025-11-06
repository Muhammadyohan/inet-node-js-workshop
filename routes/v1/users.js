const express = require("express");
const router = express.Router();
const userSchema = require("../../models/user.model");
const verifyToken = require("../../middleware/json.webtoken.middleware");
const {
  sendError,
  sendSuccess,
  sendInternalServerError,
} = require("../../utils/response");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    // Fetch all users from the database excluding password field
    let users = await userSchema.find({}, "-password");

    // Send response
    sendSuccess(res, 200, "Get users successfully", users);
  } catch (error) {
    sendInternalServerError(res, error);
  }
});

/* PUT aprove user. */
router.put("/:id/approve", verifyToken, async function (req, res, next) {
  try {
    // Get user id from request params
    const userId = req.params.id;
    // Approve user by id
    const user = await userSchema.findByIdAndUpdate(
      userId,
      { approved: true },
      { new: true }
    );

    // Check if user exists
    if (!user) {
      sendError(res, 400, "User not found");
      return;
    }

    // Check if requester is admin
    if (req.userRole != "admin") {
      sendError(res, 401, "Only admin can approve users");
      return;
    }

    // Send response
    sendSuccess(res, 200, "User approved successfully", user);
  } catch (error) {
    sendInternalServerError(res, error);
  }
});

module.exports = router;
