const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { catchAsync } = require("../utils/helper");
const AppError = require("../utils/AppError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createAccount = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const user = await userModel.create({ ...payload });

  const token = signToken(user._id);

  res.status(201).json({
    token,
    user,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { password, email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  } else {
    if (user.type !== "admin")
      return next(new AppError("This account is not an admin"));
    else if (!(await user.isPasswordCorrect(password, user.password))) {
      return next(new AppError("Invalid email or password", 401));
    }
  }

  const token = signToken(user._id);

  res.status(200).json({
    token,
    user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return next(new AppError("Please provide token in header", 401));
  }

  token = token.split(" ")[1];

  const { id } = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findOne({ id });

  if (!user)
    return next(new AppError("Invalid token or token has being expired"));

  req.user = user;

  next();
});

exports.getMe = catchAsync(async (req, res, next) => {
  const { user } = req;
  res.status(200).json({
    user,
  });
});
