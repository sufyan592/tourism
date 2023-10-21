const express = require("express");
const router = express.Router();
const tourController = require("../Controller/tourController");
const userController = require("../Controller/userController");
// const reviewController = require("../Controller/reviewController");
const reviewRouter = require("../router/reviewRoute");

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/")
  .post(tourController.newTour)
  .get(userController.auth, tourController.allTour);
router
  .route("/aggregate")
  .get(userController.auth, tourController.aggregateData);
router
  .route("/:id")
  .get(tourController.findTour)
  .patch(tourController.updateTour)
  .delete(
    userController.auth,
    userController.restrict("admin", "lead-guide"),
    tourController.deleteTour
  );

// router
//   .route("/:tourId/reviews")
//   .post(
//     userController.auth,
//     userController.restrict("user"),
//     reviewController.createReview
//   );

module.exports = router;
