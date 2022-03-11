/** @format */

const express = require("express");
const {
  createNewProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} = require("../controllers/productController");
const { authorizeRole, isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

//Create Product Routes
router.route("/products").get(getAllProducts);

router
  .route("/admin/products/new")
  .post(isAuthenticatedUser, authorizeRole("admin"), createNewProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRole("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRole("admin"), deleteProduct);

router.route("/product/:id").get(getSingleProduct);

module.exports = router;
