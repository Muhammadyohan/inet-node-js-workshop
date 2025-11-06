const mongoose = require("mongoose");
const { Schema } = mongoose;
const { orderSchema } = require("./order.model");

var productSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    orders: [orderSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", productSchema);
