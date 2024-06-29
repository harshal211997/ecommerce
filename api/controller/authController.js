const User = require("../module/userModule.js");
const sendMail = require("../utils/email.js");
const AppError = require("../utils/appError.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//jwt token creation
const sendToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXPIRE_IN * 60 * 1000
    ).getMilliseconds(),
  });
};

const createSendToekn = (user, statusCode, res, next) => {
  try {
    const token = sendToken(user._id);
    const cookieOption = {
      Expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 1000
      ).getMilliseconds(),
      httpOnly: true,
    };
    res.cookie("jwt", token, cookieOption);
    //hiding password from response
    user.password = undefined;
    res.status(statusCode).json({
      status: "Sucess",
      data: {
        user,
      },
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};
//Send OTP for email verification
const otp = async (email) => {
  try {
    //Will send 8 digit email verification code
    const min = 10000000;
    const max = 99999999;
    let code = Math.floor(Math.random() * (max - min + 1)) + min;
    const message = `Your email verification code is: ${code}`;
    //sendign mail
    await sendMail({
      email: email,
      subject: "Email Verification Code",
      message: message,
    });
    return code;
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};
//SignUp new user:
exports.signUp = async (req, res, next) => {
  try {
    let { email } = req.body;
    let code = otp(email);
    const newUser = await User.create(req.body);
    newUser.emailVerificationOTP = await code;
    await newUser.save();
    res.status(201).json({
      status: "Sucess",
      message: "SignUp completed.Please verify email!",
      userData: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

//Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //check if email and pass exists
    if (!email || !password) {
      return next(new AppError("Plase provide email and password", 400));
    }
    //fetching user data from DB
    const user = await User.findOne({ email: email });
    let correct;
    if (user) {
      correct = await user.correctPassword(password, user.password);
    }
    if (!user || !correct) {
      return next(new AppError("Incorrect email or password", 401));
    }
    //if all ok sent jwt to client
    createSendToekn(user, 200, res);
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

//Protect route
exports.protect = async (req, res, next) => {
  try {
    //taking token from req.headers.cookies
    const token = req.headers.cookie?.split("=").at(1);
    if (!token) {
      return next(
        new AppError("You are not loged In, Please login to get access", 401)
      );
    }
    //verify token:
    let verification = jwt.verify(token, process.env.JWT_KEY);
    //check if user still exists
    const currentUser = await User.findById(verification.id);
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }
    //Check if password changed after recived token
    if (currentUser.changedPasswordAfter(verification.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }
    //Grant access to user
    req.user = currentUser;
    next();
  } catch (err) {
    if ((err.message = "jwt expired")) {
      return next(new AppError("JWT Token Expired, Please login again!", 401));
    }
    return next(new AppError(err.message, 400));
  }
};

//Email Verification
exports.verifyEmail = async (req, res, next) => {
  try {
    let { email: userEmail, otp } = req.body;
    const user = await User.findOne({ email: userEmail });
    console.log(user);
    if (!user) {
      return next(new AppError("Invalid email ID", 400));
    }
    let userOtp = user["emailVerificationOTP"];
    if (otp !== userOtp) {
      return next(new AppError("Wrong OTP, Please check OPT again!", 400));
    }
    user["emailVerificationOTP"] = undefined;
    await user.save();
    res.status(200).json({
      status: "Sucess",
      Message: "Email Verification Done",
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

//Forgot Password
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  try {
    if (!user) {
      return next(
        new AppError(`There is no user with this email address: ${email}`, 400)
      );
    }
    //Genrating random reset token:
    const resetToken = user.createPasswordResetToken();
    //save passwordResetToken and passwordResetExpire In DB
    await user.save({ validateBeforeSave: false });
    //sending password rest URL through email:
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/usesrs/resetPassword/${resetToken}`;
    const message = `Forgot your password link: ${resetURL}\n Thank you.`;
    //sending mail
    await sendMail({
      email: user.email,
      subject: "Your Password reset token (valid for 10min)",
      message: message,
    });
    res.status(200).json({
      status: "Sucess",
      message: "Toekn sent on email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordRestExpire = undefined;
    // await user.save({ validateBeforeSave: false });
    return next(new AppError(err.message, 400));
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    //will take toekn from URL and compare it
    const urlToken = req.params.token;
    const hashedToken = crypto
      .createHash("sha256")
      .update(urlToken)
      .digest("hex");
    //getting user based on token
    //checking password not expired that is passwordRestExpire > current time
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordRestExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new AppError("Token is invalid or has Expired", 400));
    }
    user.password = req.body.newPassword;
    //set reset and expire undefined
    user.passwordResetToken = undefined;
    user.passwordRestExpire = undefined;
    await user.save();
    res.status(200).json({
      status: "Sucess",
      message: "Password changed sucessfully!",
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};
