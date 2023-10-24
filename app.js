const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const tourRoute = require("./router/tourRoute");
const userRoute = require("./router/userRouter");
const reviewRoute = require("./router/reviewRoute");
const testRoute = require("./router/testRoute");
const viewRoute = require("./router/viewRoute");
const stripRoute = require("./router/stripeRoute");
const serverless = require("serverless-http");

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => {
//   res.status(200).render("base");
// });
app.use("/", viewRoute);
app.use("/", stripRoute);
app.use("/api/v1/tour", tourRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/test", testRoute);

module.exports = app;
// module.exports.handler = serverless(app);
