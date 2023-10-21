// =============================== For Creating Documents ================================

exports.createOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.create(req.body);
    if (!doc)
      throw new Error("You did not create document. Please provide details.");

    res.status(201).json({
      status: "Success",
      data: doc,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error,
    });
  }
};

// =============================== For Creating Documents ================================

exports.updateData = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "Success",
      data: doc,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error,
    });
  }
};

// =============================== For Deleting Documents ================================

exports.deleteData = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      error,
    });
  }
};
