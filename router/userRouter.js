const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");

router.route("/").get(userController.allUser);
router.route("/:id").get(userController.getSingleUser);
router.route("/me").get(userController.auth, userController.getMe);
router.route("/signin").post(userController.signin);
router.route("/login").post(userController.login);
router.route("/logoutt").get(userController.logou);
router.route("/logou").get(userController.logoutUser);
router.route("/forgetPassword").post(userController.forgetPassword);
router.route("/resetPassword/:token").patch(userController.resetPassword);
router
  .route("/updateMyPassword")
  .patch(userController.auth, userController.updatePassword);
router
  .route("/updateMe")
  .patch(
    userController.auth,
    userController.fileUpload,
    userController.uploadImageResize,
    userController.updateMe
  );
router.route("/deleteMe").get(userController.auth, userController.deleteMe);

module.exports = router;
