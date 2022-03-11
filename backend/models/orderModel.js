/** @format */

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      name: {
        type: String,
        required: [true, "Please enter the name of the product"],
      },
      quantity: {
        type: Number,
        required: [true, "Please enter the quantity of the product"],
      },
      price: {
        type: Number,
        required: [true, "Please enter the price of the product"],
      },
      image: {
        type: String,
        required: [true, "Please upload the imgage"],
      },
      product: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "products",
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "users",
  },
  shippingInfo: {
    address: {
      type: String,
      required: [true, "Please enter shipping address"],
    },
    city: {
      type: String,
      required: [true, "Please enter the city"],
    },
    state: {
      type: String,
      required: [true, "Please enter the state"],
    },
    pinCode: {
      type: String,
      required: [true, "Please enter pin code"],
    },
    country: {
      type: String,
      required: [true, "Please enter the country"],
    },
    phoneNo: {
      type: String,
      required: [true, "Please enter the phone number"],
    },
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  itemPrice: {
    type: String,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: String,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: String,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: String,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("orders", orderSchema);
