const jwt = require("jsonwebtoken");
const userSchema = require("../models/user.model");
const {
  sendError,
  sendSuccess,
  sendInternalServerError,
} = require("../utils/response");

async function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (!token) {
    return sendError(res, 401, "Access Denied: No Token Provided!");
  }

  token = token.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    user = await userSchema.findById(decoded.id);

    if (!user) {
      return sendError(res, 401, "Invalid Token: User does not exist");
    }

    req.userRole = user.role;
    next();
  } catch (err) {
    console.error(err);
    return sendError(res, 401, "Invalid Token");
  }
}

module.exports = verifyToken;
