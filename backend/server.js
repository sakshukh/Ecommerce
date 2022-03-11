/** @format */

const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Unhandled Exceptions
process.on("uncaughtException", (err) => {
  console.log("Error: ", err.message);
  console.log("Shutting down the server due to UNCAUGHT EXCEPTION");

  process.exit(1);
});

// config data
dotenv.config({
  path: "backend/config/config.env",
});

// connect to mongo
connectDatabase();

const server = app.listen(parseInt(process.env.PORT), () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

//Unhanled promises rejection
process.on("unhandledRejection", (err) => {
  console.log("Error: ", err.message);
  console.log("Shutting down the server due to UNCAUGHT EXCEPTION");

  server.close(() => {
    process.exit(1);
  });
});
