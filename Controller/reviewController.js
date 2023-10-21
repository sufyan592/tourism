const Review = require("../model/reviewSchema");
const { updateData, deleteData } = require("./factoryhandler");

// ========================== Review Created =====================================

// exports.createReview = async (req, res, next) => {
//   try {
//     if (!req.body.tour) req.body.tour = req.params.tourId;
//     if (!req.body.user) req.body.user = req.user.id;
//     const review = await Review.create(req.body);
//     res.status(201).json({
//       status: "Created",
//       // review.lenght,
//       data: {
//         review,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "Fail",
//       error,
//     });
//   }
// };
exports.tourUserData = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({
      status: "Created",
      // review.lenght,
      data: {
        review,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error,
    });
  }
};

// ========================== All Reviews =====================================

exports.allReviews = async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const review = await Review.find(filter);
    res.status(200).json({
      status: "Created",
      count: review.length,
      data: {
        review,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error,
    });
  }
};
// ========================== Find Reviews =====================================

exports.findReview = async (req, res, next) => {
  try {
    const id = req.params.id;
    const review = await Review.findById(id);
    res.status(200).json({
      status: "Created",
      // review.lenght,
      data: {
        review,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error,
    });
  }
};
// ========================== Update Reviews =====================================

exports.updateReview = updateData(Review);

// ========================== Delete Review =====================================

exports.deleteReview = deleteData(Review);
