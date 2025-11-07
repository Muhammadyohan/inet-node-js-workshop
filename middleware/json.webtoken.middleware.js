const jwt = require("jsonwebtoken");
const userSchema = require("../models/user.model");
const {
  sendError,
  sendSuccess,
  sendInternalServerError,
} = require("../utils/response");

async function verifyToken(req, res, next) {
  try {
    // Get the token from the request headers
    let token = req.headers["authorization"];
    // Check if token is provided
    if (!token) {
      return sendError(res, 401, "Access Denied: No Token Provided!");
    }
    // Split the Bearer from the token string
    token = token.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Set the decoded user information to request object
    req.user = decoded;

    // Fetch user from database by id
    const user = await userSchema.findById(req.user.id);
    // Check if user exists
    if (!user) {
      return sendError(res, 401, "Invalid Token: User does not exist");
    }

    next();
  } catch (err) {
    console.error(err);
    return sendError(res, 401, "Invalid Token");
  }
}

module.exports = verifyToken;
