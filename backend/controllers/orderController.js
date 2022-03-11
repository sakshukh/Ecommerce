/** @format */

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Order = require("../models/orderModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");

// Create new order
exports.createNewOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderStatus,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderStatus,
    paidAt: Date.now(),
    user: req.user.id,
  });

  if (!order) {
    return next(new ErrorHandler("Order not created", 400));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "email name",
    userModel
  );

  if (!order) {
    return next(new ErrorHandler("Order not found", 400));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get my order
exports.myOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find({ user: req.user.id });

  if (!order) {
    return next(new ErrorHandler("No Order placed till now", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get all orders - Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  if (!orders) {
    return next(new ErrorHandler("Order not found", 400));
  }

  let totalAmount = 0;

  const totalPrice = orders.forEach(
    (order) => (totalAmount += order.totalPrice)
  );

  res.status(200).json({
    success: true,
    count: orders.length,
    totalAmount,
    orders,
  });
});

// Update Order
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 400));
  }

  if (order.status === "Delivered") {
    return next(new ErrorHandler("Order is already delivered", 400));
  }

  orders.forEach(async (o) => {
    await updateStock(order.product, product.quantity);
  });

  orders.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await Order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
  });
});

// update stock
const updateStock = async (id, quantity) => {
  const product = await productModel.findById(id);

  product.stock = Number(product.stock) - Number(quantity);

  await product.save();
};

// Delete Order
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "order is deleted",
    order,
  });
});
