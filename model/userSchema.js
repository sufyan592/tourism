const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 20,
    min: 5,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Enter a Valid Email"],
  },
  password: {
    type: String,
    // select:false
  },
  Cpassword: {
    type: String,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not matched",
    },
  },
  photo: {
    type: String,
    default: "user-img.jpg",
  },
  role: {
    type: String,
    enum: ["admin", "lead guide", "agent", "user", "guide"],
    default: "user",
  },
  passwordChangedAt: Date,
  passwordToken: String,
  passwordResetTokenExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  // if(this.isModified(this.password) return next())
  this.password = await bcrypt.hash(this.password, 12);
  this.Cpassword = undefined;
  next();
});
userSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.compairePass = async function (password, dpassword) {
  return await bcrypt.compare(password, dpassword);
};

userSchema.methods.changedPasswordAfter = function (JWtTimeStemp) {
  if (this.passwordChangedAt) {
    const passwordConvert = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(passwordConvert, JWtTimeStemp);
    return JWtTimeStemp < passwordConvert;
  }
  // False means password not changed
  return false;
};

userSchema.methods.resetDataToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordToken);
  this.passwordResetTokenExpires = Date.now() + 10 * 6000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
