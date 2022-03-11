/** @format */

const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((response) =>
      console.log(`Database Conneted at ${response.connection.host}`)
    )
    .catch((error) => console.log(error.message));
};

module.exports = connectDatabase;
