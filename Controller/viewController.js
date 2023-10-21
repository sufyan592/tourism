const tourDoc = require("../model/tourSchema");

exports.base = async (req, res) => {
  try {
    const tours = await tourDoc.find();
    res.status(200).render("base", {
      title: "All Tours",
      tours,
    });
  } catch (error) {
    res.status(500).error(error);
  }
};
exports.overview = (req, res) => {
  res.status(200).render("overview");
};
exports.tour = (req, res) => {
  res.status(200).render("tour");
};

// ================ Single Tour ==================

exports.singleTour = async (req, res) => {
  try {
    const slug = req.params.slug;
    const tour = await tourDoc.findOne({ slug: slug }).populate({
      path: "reviews",
      fields: "user description ratingValue",
    });
    console.log(tour);
    res.status(200).render("singleTour", {
      title: "Single Tour",
      tour,
    });
  } catch (error) {
    res.status(500).error(error);
  }
};
// ================ Login ==================

// exports.loginForm = async (req, res) => {
//   try {
//     const email = req.body.email;
//     const password = req.body.password;
//     if (!email || !password) {
//       throw error("Please enter details");
//     }
//     const user = await tourDoc.findOne({ email: email });
//     res.status(200).render("login", {
//       title: "loginData",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// =================== Signin ================

exports.signin = async (req, res) => {
  try {
    res.status(200).render("signin", {
      title: "Signin",
    });
  } catch (error) {
    res.status(500).error(error);
  }
};
// ================ Login ==================

// exports.loginForm = async (req, res) => {
//   try {
//     const email = req.body.email;
//     const password = req.body.password;
//     if (!email || !password) {
//       throw error("Please enter details");
//     }
//     const user = await tourDoc.findOne({ email: email });
//     res.status(200).render("login", {
//       title: "loginData",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

exports.login = async (req, res) => {
  try {
    res.status(200).render("login", {
      title: "Login",
    });
  } catch (error) {
    res.status(500).error(error);
  }
};

// ================ Account ==========

exports.userAccount = async (req, res) => {
  try {
    res.status(200).render("userAccount", {
      title: "Your Account",
    });
  } catch (error) {
    res.status(500).error(error);
  }
};
