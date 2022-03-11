/** @format */

const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

// Create New Product - Admin
exports.createNewProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const productCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pegination();
  const product = await apiFeatures.query;

  if (!product) {
    return next(new ErrorHandler("Products not found", 400));
  }

  res.status(200).json({
    success: true,
    productCount,
    product,
  });
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(
      new ErrorHandler(`Product with id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product - Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(
      new ErrorHandler(`Product with id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Get Single Product
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorHandler(`Product with id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    product,
  });
});
