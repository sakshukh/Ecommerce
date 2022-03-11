/** @format */

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");
const sendToken = require("../utils/sendToken");
const crypto = require("crypto");
const res = require("express/lib/response");
const productModel = require("../models/productModel");

// Register New User
exports.createNewUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    user,
  });
});

// User Login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorHandler("Please enter email address and password", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Incorrect email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect email or password", 401));
  }

  sendToken(user, 200, res);
});

// User Logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Get all users - admin
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const count = await User.count();
  const user = await User.find();

  if (!user) {
    return next(new ErrorHandler("Users not found", 404));
  }

  res.status(200).json({
    success: true,
    count,
    user,
  });
});

// Get User Details - except password
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Forget/Reset Password
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("Invalid email id", 400));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Please click below link to reset the password \n\n ${resetPasswordURL} \n\n If you have not requested
   password reset, then please ignore it. \n\n Best Regards \n\n Team Ecommerce`;

  try {
    sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      resetPasswordURL,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const token = req.params.token;

  const cryptoToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: cryptoToken,
    resetPasswordExpired: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "User password token is invalid or has been expired",
        404
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("password and confirm password does not match")
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpired = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Update/Change Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isOldPasswordMatched = await User.comparePassword(req.body.oldPassword);

  if (!isOldPasswordMatched) {
    return next(new ErrorHandler("old password is not matched", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("new password and confirm password does not match", 400)
    );
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// Update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const updatedDetails = {
    name: req.body.name,
    mobile: req.body.mobile,
  };

  const user = await User.findByIdAndUpdate(req.user.id, updatedDetails, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete user profile
exports.deleteUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "user profile deleted successfully",
  });
});

// Get single user - Admin
exports.getSingleUserByAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update user role - Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const updatedDetails = {
    role: req.body.role,
    email: req.body.email,
    name: req.body.name,
    mobile: req.body.mobile,
  };

  const user = await User.findByIdAndUpdate(req.params.id, updatedDetails, {
    new: true,
    validateBeforeSave: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "user profile deleted successfully",
    user,
  });
});

// Delete User profile - Admin
exports.deleteUserProfileByAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "user is deleted",
    user,
  });
});

// Create new reviews or update an existing reviews
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const reviewData = {
    user: req.user.id,
    name: req.user.name,
    ratings: Number(rating),
    comment,
  };

  const product = await productModel.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  const isReviewed = await product.reviews.find(
    (review) => review.user.toString() === req.user.id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user.id) {
        (review.ratings = Number(rating)), (review.comment = comment);
      }
    });
  } else {
    product.reviews.push(reviewData);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.ratings;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "ratings set",
    product,
  });
});

// Get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 400));
  }

  res.status(200).json({
    success: true,
    numOfReviews: product.numOfReviews,
    reviews: product.reviews,
  });
});

// Delete product review
exports.deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("product not found, 400"));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() != rev.query.id
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.ratings;
  });
  product.ratings = avg / reviews.length;
  product.numOfReviews = reviews.length;
  product.reviews = reviews;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
