const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/AppFeed")
  .then((result) => {
    console.log("Database Connected");
  })
  .catch((err) => console.log(err));
