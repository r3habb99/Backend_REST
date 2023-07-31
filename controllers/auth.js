//requiring bcyrpt library
const bcyrpt = require("bcryptjs");

//validation library
const { validationResult } = require("express-validator");

//jsonwebtoken for authorization when you are not storing any cookies
const jwt = require("jsonwebtoken");

//model imported
const User = require("../models/user");
const router = require("../routes/feed");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  try {
    const hashedPassword = await bcyrpt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
    });
    const result = await user.save();

    res.status(201).json({ userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("No user with this email found");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcyrpt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong Password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      "somelongsecretkeyforjsonwebtokenwhichwillusetoverifyallroutesinitforauthorization",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({ message: "Status Updated" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
