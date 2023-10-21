const TestUser = require("../model/testModel");

exports.addData = async (req, res, next) => {
  try {
    const user = await TestUser.create(req.body);
    console.log(user);
    res.status(201).json({
      status: "Success",
      data: user,
    });
    next();
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error,
    });
  }
};

// =================== Find User ==================

exports.findAll = async (req, res, next) => {
  try {
    // let querydata = { ...req.query };
    // const exclude = ["page", "fields", "skip", "limition"];
    // exclude.forEach((el) => {
    //   delete querydata[el];
    //   //   console.log(querydata);
    // });
    // querydata.find(/gt|gte|lt|lte/g, )
    // console.log(querydata);

    const user = await TestUser.find().populate("tourism user");
    // await data;
    res.status(200).json({
      status: "Success",
      lenght: user.length,
      data: user,
    });
    next();
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error,
    });
  }
};

// =================== Find Single User ==================

exports.findData = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await TestUser.findById(id);
    res.status(200).json({
      status: "Success",
      data: user,
    });
    next();
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error,
    });
  }
};

// =================== Find Single User and Update ==================

exports.updateData = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await TestUser.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "Success",
      data: user,
    });
    next();
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error,
    });
  }
};

// =================== Find Single User and Delete ==================

exports.deleteData = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await TestUser.findByIdAndDelete(id);
    res.status(201).json({
      status: "Success",
      data: user,
    });
    next();
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error,
    });
  }
};
