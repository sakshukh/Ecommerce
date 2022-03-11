/** @format */

const express = require("express");
const {
  createNewUser,
  getAllUser,
  getUserDetails,
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
  updateUserRole,
  getSingleUserByAdmin,
  deleteUserProfileByAdmin,
  updateProfile,
  deleteUserProfile,
  updatePassword,
  createProductReview,
  getProductReviews,
  deleteProductReview,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(createNewUser);

router.route("/login").post(loginUser);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/me/delete").delete(isAuthenticatedUser, deleteUserProfile);

router.route("/password/forget").post(forgetPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRole("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .put(isAuthenticatedUser, authorizeRole("admin"), updateUserRole)
  .get(isAuthenticatedUser, authorizeRole("admin"), getSingleUserByAdmin)
  .delete(
    isAuthenticatedUser,
    authorizeRole("admin"),
    deleteUserProfileByAdmin
  );

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteProductReview);

router.route("/users").get(getAllUser);

router.route("/logout").get(logoutUser);

module.exports = router;
