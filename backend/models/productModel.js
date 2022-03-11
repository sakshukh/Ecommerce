/** @format */

const mongoose = require("mongoose");

// Create schema for product model
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name of the product"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter the decription of the product"],
  },
  price: {
    type: String,
    required: [true, "Please enter the price of the product"],
    maxlength: [6],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  image: [
    {
      publicId: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter the category of the product"],
  },
  stock: {
    type: String,
    required: [true, "please enter the stock of the item"],
    maxlength: [4],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "users",
      },
      name: {
        type: String,
        required: true,
      },
      ratings: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create model for the product
const productModel = mongoose.model("products", productSchema);

module.exports = productModel;
