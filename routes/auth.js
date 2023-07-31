const express = require("express");

//for backend validation
const { body } = require("express-validator");

//usermodel required
const User = require("../models/user");

//controller required
const authController = require("../controllers/auth");

//importing is-auth function to verify token
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post("/login", authController.login);
router.get("/status", isAuth, authController.getUserStatus);
router.patch(
  "/status",
  isAuth,
  [body("status").trim().not().isEmpty()],
  authController.updateUserStatus
);

module.exports = router;
