const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../Controller/reviewController");
const userController = require("../Controller/userController");

router
  .route("/")
  .post(
    userController.auth,
    userController.restrict("user"),
    reviewController.tourUserData,
    reviewController.createReview
  )
  .get(reviewController.allReviews);
router
  .route("/:id")
  .get(reviewController.findReview)
  .patch(
    userController.auth,
    userController.restrict("user"),
    reviewController.updateReview
  )
  .delete(
    userController.auth,
    userController.restrict("user"),
    reviewController.deleteReview
  );

module.exports = router;
