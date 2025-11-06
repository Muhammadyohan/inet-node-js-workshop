const express = require("express");
const router = express.Router();
const userSchema = require("../../models/user.model");
const productSchema = require("../../models/product.model");
const orderSchema = require("../../models/order.model");
const {
  sendError,
  sendSuccess,
  sendInternalServerError,
} = require("../../utils/response");

/* GET product listing. */
router.get("/", async function (req, res) {
  try {
    // Fetch all products from the database excluding password field
    const products = await productSchema.find({});

    // Send response
    sendSuccess(res, 200, "Get products successfully", products);
  } catch (error) {
    sendInternalServerError(res, error);
  }
});

/* GET product by id */
router.get("/:id", async function (req, res) {
  try {
    // Get product id from request params
    const productId = req.params.id;
    // Fetch product by id from the database
    const product = await productSchema.findById(productId);

    // Check if product exists
    if (!product) {
      sendError(res, 400, "Product not found");
      return;
    }

    // Send response
    sendSuccess(res, 200, "Get product successfully", product);
  } catch (error) {
    sendInternalServerError(res, error);
  }
});

/* POST create product. */
router.post("/", async function (req, res) {
  try {
    // Get input data
    var { name, description, price, stock } = req.body;

    // Create new product instance
    const newProduct = new productSchema({
      userId: req.user.id,
      name,
      description,
      price,
      stock,
    });
    // Set inStock based on stock quantity
    if (stock == 0) {
      newProduct.inStock = false;
    }
    // Save product to database
    await newProduct.save();

    // Send response
    sendSuccess(res, 201, "Product created successfully", newProduct);
  } catch (error) {
    sendInternalServerError(res, error);
  }
});

/* PUT update product. */
router.put("/:id", async function (req, res) {
  try {
    // Get input data
    const { name, description, price, stock } = req.body;
    // Get product id from request params
    const productId = req.params.id;

    // Update product in the database
    const updatedProduct = await productSchema.findByIdAndUpdate(
      productId,
      { name, description, price, stock, inStock: stock > 0 },
      { new: true }
    );

    // Check if product exists
    if (!updatedProduct) {
      sendError(res, 400, "Product not found");
      return;
    }

    // Send response
    sendSuccess(res, 200, "Product updated successfully", updatedProduct);
  } catch (error) {
    sendInternalServerError(res, error);
  }
});

/* DELETE product. */
router.delete("/:id", async function (req, res) {
  try {
    // Get product id from request params
    const productId = req.params.id;

    // Delete product from the database
    const deletedProduct = await productSchema.findByIdAndDelete(productId);

    // Check if product exists
    if (!deletedProduct) {
      sendError(res, 400, "Product not found");
      return;
    }

    // Send response
    sendSuccess(res, 200, "Product deleted successfully", deletedProduct);
  } catch (error) {
    sendInternalServerError(res, error);
  }
});

/* GET orders listing by product id */
router.get("/:id/orders", async function (req, res) {
  try {
    // Get product id from request params
    const productId = req.params.id;

    // Fetch product by id and populate orders
    const product = await productSchema.findById(productId).populate("orders");

    // Check if product exists
    if (!product) {
      sendError(res, 400, "Product not found");
      return;
    }

    // Get orders from the product
    const orders = product.orders;

    // Send response
    sendSuccess(res, 200, "Get product orders successfully", orders);
  } catch (error) {
    sendInternalServerError(res, error);
  }
});

/* POST create order for product by product id */
router.post("/:id/orders", async function (req, res) {
  try {
    // Get input data
    const { quantity } = req.body;
    // Get product id from request params
    const productId = req.params.id;

    // Validate quantity
    if (quantity <= 0) {
      sendError(res, 400, "Quantity must be greater than zero");
      return;
    }

    // Fetch product by id from the database
    const product = await productSchema.findById(productId);

    // Check if product exists
    if (!product) {
      sendError(res, 400, "Product not found");
      return;
    }

    // Check if sufficient stock is available
    if (product.stock < quantity) {
      sendError(res, 400, "Insufficient stock for the product");
      return;
    }

    // Create new order
    const newOrder = new orderSchema({
      userId: req.user.id,
      productId: product._id,
      quantity,
      totalPrice: product.price * quantity,
    });
    // Save order to database
    await newOrder.save();

    // Update product stock
    product.stock -= quantity;
    if (product.stock === 0) {
      product.inStock = false;
    }
    product.orders.push(newOrder);

    // Save updated product to database
    await product.save();

    // Send response
    sendSuccess(res, 201, "Order created successfully", newOrder);
  } catch (error) {
    sendInternalServerError(res, error);
  }
});

module.exports = router;
