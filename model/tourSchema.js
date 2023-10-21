const mongoose = require("mongoose");
const slugify = require("slugify");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    shortDescription: String,
    price: {
      type: Number,
      required: true,
    },
    discPrice: {
      type: Number,
    },
    coverImg: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ["ease", "difficult", "medium"],
    },
    slug: String,
    duration: String,
    maxGroupSize: String,
    images: [String],
    startDates: [Date],
    ratingAvarage: Number,
    ratingQuantity: Number,
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -password",
  });
  next();
});
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// ========================== Document Middleware ========================

console.log("=============== Document Middleware ===============");

tourSchema.pre("save", function () {
  console.log("This is the Current Document.");
  console.log(this);
});

tourSchema.post("save", function (doc) {
  console.log("After saving");
  console.log(doc);
});

// Apply on find, findOne, findById, findByIdAndUpdate,

// tourSchema.virtual("slug").get(function () {
//   return this.name.split(" ").join("-").toLowerCase();
//   // console.log(this.slug);
// });

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
