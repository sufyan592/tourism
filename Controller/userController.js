const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../Controller/utils/email");
const crypto = require("crypto");
const multer = require("multer");
const sharp = require("sharp");

// const customStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     // const ext = file.mimeType.split("/")[1];
//     // cb(null, `user-${req.user}-${Date.now()}.${ext}`);
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
const customStorage = multer.memoryStorage();
const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365; // 60 seconds * 60 minutes * 24 hours * 365 days

// const customFileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb("File uploading Error", false);
//   }
// };

const fileUp = multer({
  storage: customStorage,
  // fileFilter: customFileFilter,
});

exports.fileUpload = fileUp.single("photo");

// ===================================== Resize Images =====================================

exports.uploadImageResize = async (req, res, next) => {
  if (!req.file) return next();
  console.log(req.file);
  req.file.filename = `user-${req.user}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(80, 80)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`images/${req.file.filename}`);

  next();
};

// ====================================== All Users =============================================

exports.allUser = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "Succcess",
      total: users.length,
      data: users,
    });
  } catch (error) {}
};

// ====================================== Sigin =============================================

exports.signin = async (req, res, next) => {
  try {
    // const { name, email, password, Cpassword, passwordChangedAt, role } =
    //   req.body;
    // if (
    //   !name ||
    //   !email ||
    //   !password ||
    //   !Cpassword ||
    //   !passwordChangedAt ||
    //   !role
    // ) {
    //   throw new Error(
    //     "Enter Details including name,email,password and Cpassword. Thanks"
    //   );
    // }
    // const data = await User.create({
    //   name,
    //   email,
    //   password,
    //   Cpassword,
    //   passwordChangedAt,
    //   role,
    // });
    const data = await User.create(req.body);

    const token = await jwt.sign({ id: data._id }, process.env.SCREATE_KEY, {
      expiresIn: expirationTime,
    });
    res.status(201).json({
      status: "Success",
      data: data,
      token,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fails",
      error,
    });
  }
};

// ====================================== login =============================================

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error(
        "Enter Details including name,email,password and Cpassword. Thanks"
      );
    }
    const user = await User.findOne({ email: email });
    const correct = await user.compairePass(password, user.password);

    if (!user || !correct) {
      throw new Error(
        "Your account is not found. Please create your Account First. Thanks"
      );
    }
    const token = await jwt.sign({ id: user._id }, process.env.SCREATE_KEY, {
      expiresIn: expirationTime,
    });
    res.cookie("jwt", token, {
      expiresIn: expirationTime,
      httpOnly: true,
    });

    res.status(200).json({
      status: "Success",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fails",
      error,
    });
  }
};

// ====================================== Get User =============================================

exports.getSingleUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    res.status(200).json({
      message: "Success",
      data: user,
    });
    next();
  } catch (error) {
    res.status(500).json({
      status: "Fails",
      error,
    });
  }
};

// ====================================== Get Me =============================================

exports.getMe = async (req, res, next) => {
  try {
    let id;
    req.params.id = req.user.id;
    id = req.params.id;
    const user = await User.findById(id);
    res.status(200).json({
      message: "Success",
      data: user,
    });
    next();
  } catch (error) {
    res.status(500).json({
      status: "Fails",
      error,
    });
  }
  next();
};

// ====================================== Authorization =============================================

// exports.auth = async (req, res, next) => {
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   } else if (req.cookies.jwt) {
//     token = req.cookies.jwt;
//   }
//   // console.log(token);
//   if (!token) {
//     throw new Error("Token not found!");
//   }

//   const decoded = await jwt.verify(token, process.env.SCREATE_KEY);
//   // console.log(decoded);

//   // 3. Check User is Exist or not

//   const currentUser = await User.findById(decoded.id);
//   // console.log(currentUser);

//   if (!currentUser) {
//     throw new Error("The user belonging to this token is not exist");
//   }

//   // 4. Check Password changed after token issued

//   if (currentUser.changedPasswordAfter(decoded.iat)) {
//     throw new Error("User recently changed Password! Please login again");
//   }
//   req.user = currentUser;
//   next();

// };
exports.auth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      throw new Error("Token not found!");
    }

    const decoded = await jwt.verify(token, process.env.SCREATE_KEY);

    // 3. Check User is Exist or not

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      throw new Error("The user belonging to this token is not exist");
    }

    // 4. Check Password changed after token issued

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new Error("User recently changed Password! Please login again");
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: "You're not allowed to visit this route. Just login.",
      error,
    });
  }
};

// ============================= LoggedIn ======================================

exports.loggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    const decoded = await jwt.verify(req.cookies.jwt, process.env.SCREATE_KEY);

    // 3. Check User is Exist or not

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      throw new Error("The user belonging to this token is not exist");
    }

    // 4. Check Password changed after token issued

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new Error("User recently changed Password! Please login again");
    }
    res.locals.user = currentUser;
  }
  next();
};
// ====================================== logOut =============================================

exports.logou = async (req, res, next) => {
  try {
    // res.cookie("jwt", "loggedOut", {
    //   expiresIn: "10m",
    // });

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      status: "Fails",
      error,
    });
  }
};

exports.logoutUser = (req, res) => {
  res.status(200).json({
    status: "success",
  });
};

// ============================== Permission For delete tour ===============================================

exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Error(
        "You do not have a permission to perform this action",
        403
      );
    }
    next();
  };
};

// ============================== Forget Password ===============================================

// exports.forgetPassword = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       throw new Error("There is no user with email address");
//     }
//     const resetToken = user.resetDataToken();
//     console.log("This one: ", resetToken);
//     await user.save({ validateBeforeSave: false });
//   } catch (error) {}
// };

exports.forgetPassword = async (req, res, next) => {
  // 1: Get user from posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new Error("There is no user with email address");
  }
  const resetToken = user.resetDataToken();
  // console.log("This one: ", resetToken);
  await user.save({ validateBeforeSave: false });

  // 3: Send token the user emial

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forget your password? Submit a patch request with your password and confirmPassword to ${resetURL}`;
  console.log(resetURL);

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token is Valid for 10 Min",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token send to the email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validatorBeforeSave: false });
    // return next(new AppError("There was Error sending emial. Try again", 500));
  }
};

// ==================== Reset Password ===============================

exports.resetPassword = async (req, res, next) => {
  try {
    const hashToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordToken: hashToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Token is invalid or Expired");
    }
    user.password = req.body.password;
    user.Cpassword = req.body.Cpassword;
    user.passwordToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();
    const token = await jwt.sign({ id: user._id }, process.env.SCREATE_KEY, {
      expiresIn: expirationTime,
    });
    console.log(token);
  } catch (error) {}
};

// ====================================== Update login User Password =============================================

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).select("+password");
    if (!user.compairePass(req.body.passwordCurrent, user.password)) {
      throw new Error("Your current Password is Wrong.");
    }
    // const correctPass = user.compairePass(password, user.password);
    user.password = req.body.password;
    user.Cpassword = req.body.Cpassword;
    await user.save();
    const token = await jwt.sign({ id: user._id }, process.env.SCREATE_KEY, {
      expiresIn: expirationTime,
    });
    console.log(token);
  } catch (error) {}
};

// ====================== Update User Data not Password =========================

const filterObj = (obj, ...filterData) => {
  newObj = {};
  Object.keys(obj).forEach((el) => {
    if (filterData.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = async (req, res, next) => {
  if (req.body.password || req.body.Cpassword) {
    throw new Error(
      "This route is not for password update, please use /upadetPassword."
    );
  }
  const filterData = filterObj(req.body, "name", "email");
  if (req.file) filterData.photo = req.file.filename;
  const user = await User.findByIdAndUpdate(req.user.id, filterData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "Success",
    Data: user,
  });
};

// ========================== Delete user but remain inactive in Database ================

exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (error) {}
};
