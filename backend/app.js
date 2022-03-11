/** @format */

const cookieParser = require("cookie-parser");
const express = require("express");
const errorMiddleware = require("./middleware/error");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Import all Routes
const products = require("./routes/productRoutes");
const users = require("./routes/userRoutes");
const order = require("./routes/orderRoutes");

app.use("/api/v1", products);
app.use("/api/v1", users);
app.use("/api/v1", order);

// Middleware for error - Always add error middleware at the end of the module
app.use(errorMiddleware);

module.exports = app;
