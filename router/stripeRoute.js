const express = require("express");
const router = express.Router();

const userController = require("../Controller/userController");
const stripeController = require("../Controller/stripeController");

router.get(
  "/booking-checkout/:tourId",
  userController.auth,
  stripeController.stripeCheckout
);

module.exports = router;
