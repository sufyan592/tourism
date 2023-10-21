const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    ratingValue: {
      type: Number,
      max: 5,
      min: 1,
    },
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "tour",
//     select: "name -_id -guides",
//   }).populate({
//     path: "user",
//     select: "name -_id",
//   });
//   next();
// });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo -_id",
  });
  next();
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
