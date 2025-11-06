const mongoose = require("mongoose");
const { Schema } = mongoose;

var userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    approved: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    // loginDates: { type: [Date], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
