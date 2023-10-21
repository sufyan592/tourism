const express = require("express");
const route = express.Router();
const viewController = require("../Controller/viewController");
const authController = require("../Controller/userController");

// route.use(authController.loggedIn);
// route.get("/", viewController.base);
route.get("/", authController.loggedIn, viewController.base);

// route.get("/overview", viewController.overview);
// route.get("/tour", viewController.tour);
route.get("/tour/:slug", authController.auth, viewController.singleTour);
route.get("/login", viewController.login);
route.get("/signin", viewController.signin);
route.get("/me", authController.auth, viewController.userAccount);

module.exports = route;
