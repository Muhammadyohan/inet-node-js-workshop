const mongoose = require("mongoose");
const { Schema } = mongoose;

var orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "products", required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", orderSchema);
module.exports.orderSchema = orderSchema;
