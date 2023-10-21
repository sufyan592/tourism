const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userTest = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      maxLength: [20, "User max lenght should be 20 characters."],
      minLength: [5, "User min lenght should be 5 characters."],
    },
    subject: {
      type: String,
      required: true,
      enum: {
        values: ["Math", "Computer", "English", "Physics"],
        message: "Subjust should be Math, Computer, English, Physics ",
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [validator.isEmail, "Please enter a valid Email."],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: true,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password not Matched.",
      },
      price: {
        type: Number,
        required: true,
      },
      tourism: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Tour",
          required: true,
        },
      ],
      user: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userTest.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
userTest.virtual("discountPrice").get(function () {
  return this.price / 20;
  //   return Number(this.price / 500);
});

const TestUser = mongoose.model("TestUser", userTest);
module.exports = TestUser;
