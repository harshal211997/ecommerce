const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcrypt");

//Schema Defining
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 8,
  },
  emailVerificationOTP: {
    type: Number,
  },
  passwordResetToken: {
    type: String,
  },
  passwordRestExpire: {
    type: Date,
  },
  passwordChangedAt: {
    type: Date,
  },
});

//Password encryption using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
  }
  //using hash algorithm bcrypt password with salt value
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
//adding new instance method for passwordReast token
userSchema.methods.createPasswordResetToken = function () {
  //Will use crypto node module to create token
  const resetToken = crypto.randomBytes(32).toString("hex");
  //encrypting token and save it in DB.
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //Seeting up password rest expire time as 10min
  this.passwordRestExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

//Correct Password: Password verification
userSchema.methods.correctPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

//
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
};
//Creating User model
const User = mongoose.model("User", userSchema);

module.exports = User;
