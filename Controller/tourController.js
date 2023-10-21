require("express");
const Tour = require("../model/tourSchema");
const { updateOne } = require("../model/userSchema");
const { createOne, updateData, deleteData } = require("./factoryhandler");

// ========================== Create Tour ===============================

// exports.newTour = async (req, res, next) => {
//   try {
//     const tour = await Tour.create(req.body);

//     res.status(201).json({
//       status: "Success",
//       data: tour,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "Fail",
//       error,
//     });
//   }
// };
exports.newTour = createOne(Tour);

// ========================== Find Single Tour ===============================

exports.findTour = async (req, res) => {
  try {
    const id = req.params.id;
    const findTour = await Tour.findOne({ slug: id }).populate({
      path: "reviews",
      fields: "user ratingValue description",
    });
    res.status(200).json({
      status: "Success",
      data: findTour,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error,
    });
  }
};

// ========================== Find All Tours ===============================

exports.allTour = async (req, res, next) => {
  try {
    let query = { ...req.query };
    let excluded = ["page", "fields", "limit", "sort"];
    excluded.forEach((el) => delete query[el]);
    console.log(query);
    let queryStr = JSON.stringify(query);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(queryStr);

    // console.log(JSON.parse(queryStr));

    // const allTour = await Tour.find({
    //   price: { $lte: 5000 } || { $gt: 2000 },
    // });

    let queryData = Tour.find(JSON.parse(queryStr));

    // ===================== Sort =====================

    if (req.query.sort) {
      queryData = queryData.sort(req.query.sort);
    } else {
      queryData = queryData.sort("-createdAt");
    }

    // ===================== Fields =====================

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queryData = queryData.select(fields);
    } else {
      queryData = queryData.select("-__v");
    }

    // ===================== Pagination =====================

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    queryData = queryData.skip(skip).limit(limit);

    if (req.query.page) {
      const countTour = await Tour.countDocuments();
      if (skip >= countTour) throw new Error("This page does not exist.");
    }

    const allTour = await queryData;
    console.log(allTour);

    res.status(200).json({
      status: "Success",
      length: allTour.length,
      data: allTour,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error,
    });
  }
};
// ========================== Update Tours ===============================

// exports.updateTour = async (req, res, next) => {
//   try {
//     const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.status(200).json({
//       status: "Success",
//       data: updateTour,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "Fail",
//       error,
//     });
//   }
// };

exports.updateTour = updateData(Tour);
// ========================== Delete Tour ===============================

// exports.deleteTour = async (req, res, next) => {
//   try {
//     const deleteTour = await Tour.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: "Success",
//       data: null,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "Fail",
//       error,
//     });
//   }
// };
exports.deleteTour = deleteData(Tour);

// ========================== Aggregation ===============================

exports.aggregateData = async (req, res, next) => {
  try {
    const data = await Tour.aggregate([
      { $match: { price: { $gt: 3000 } } },
      {
        $sort: { price: -1 },
      },
      {
        $group: {
          _id: null,
          tourCount: { $sum: 1 },
          avaragePrice: { $avg: "$price" },
          totalSum: { $sum: "$price" },
          maxPrice: { $max: "$price" },
          minPrice: { $min: "$price" },
        },
      },
    ]);
    res.status(200).json({
      status: "Success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      data: error,
    });
  }
};
