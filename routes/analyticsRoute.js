const express = require("express");
const { getTotalSales } = require("../controllers/analyticsController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/total-sales").get(protect, getTotalSales);

module.exports = router;
