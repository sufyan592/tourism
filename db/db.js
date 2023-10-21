const mongoose = require("mongoose");
// mongoose
//   .connect("mongodb://0.0.0.0:27017/tourism")
//   .then(() => {
//     console.log("Database in connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("Database in connected SuccessFully.");
  })
  .catch((err) => {
    console.log(err);
  });
module.exports = mongoose;
