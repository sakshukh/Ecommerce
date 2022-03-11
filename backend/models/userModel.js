/** @format */

const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter user name"],
    minlength: [3, "Name should contain more then 2 letters"],
    maxlength: [30, "Name should not contain more then 30 letters"],
  },
  password: {
    type: String,
    required: [true, "please enter user password"],
    minlength: [3, "Name should contain more then 2 letters"],
    maxlength: [30, "Name should not contain more then 30 letters"],
    select: false,
  },
  mobile: {
    type: String,
    required: [true, "please enter mobile number"],
    length: [10, "Invalid mobile number"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email id"],
  },
  avatar: {
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpired: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password then save in DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcryptjs.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Create JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate reset password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hasing and adding reset token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpired = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken;
};

module.exports = mongoose.model("users", userSchema);
