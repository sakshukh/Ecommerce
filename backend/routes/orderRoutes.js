/** @format */

const express = require("express");
const {
  createNewOrder,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  getAllOrders,
  myOrder,
} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, createNewOrder);

router
  .route("/admin/order/:id")
  .get(isAuthenticatedUser, authorizeRole("admin"), getSingleOrder)
  .put(isAuthenticatedUser, authorizeRole("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRole("admin"), deleteOrder);

router
  .route("/admin/order")
  .get(isAuthenticatedUser, authorizeRole("admin"), getAllOrders);

router.route("/me/order").get(isAuthenticatedUser, myOrder);

module.exports = router;
