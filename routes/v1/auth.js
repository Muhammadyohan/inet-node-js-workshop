const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../../models/user.model");
const {
  sendError,
  sendSuccess,
  sendInternalServerError,
} = require("../../utils/response");

/* POST login. */
router.post("/login", async function (req, res, next) {
  try {
    // Get input data
    var { username, password } = req.body;

    // Find user by username
    const user = await userSchema.findOne({ username });

    // Check if user exists
    if (!user) {
      return sendError(res, 400, "You need to register first");
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 400, "Incorrect password");
    }

    // Check if user is approved
    if (!user.approved) {
      return sendError(res, 400, "User not approved by admin");
    }

    // Create and assign a token
    var token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Send response
    sendSuccess(res, 200, "Login successfully", { token });
  } catch (error) {
    sendInternalServerError(res, error);
  }
});

/* POST register. */
router.post("/register", async function (req, res, next) {
  try {
    // Get input data
    var { username, password, email } = req.body;

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create new user
    var newUser = new userSchema({ username, password: hash, email });
    // Save user to the database
    await newUser.save();

    // Send response
    sendSuccess(res, 201, "User registered successfully", {
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
    });
  } catch (error) {
    sendInternalServerError(res, error);
  }
});

module.exports = router;
