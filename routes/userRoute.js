const express = require("express");
const {
  getMe,
  login,
  createAccount,
  protect,
} = require("../controllers/authController");

const router = express.Router();

router.route("/login").post(login);

router.route("/signup").post(createAccount);

router.route("/me").get(protect, getMe);

module.exports = router;
