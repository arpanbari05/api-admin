const express = require("express");
const { getTotalSales } = require("../controllers/analyticsController");
const { protect } = require("../controllers/authController");
const {
  createEmployee,
  getAllEmployees,
  deleteEmployee,
  getEmloyee,
} = require("../controllers/employeeController");

const router = express.Router();

router.route("/").get(protect, getAllEmployees).post(protect, createEmployee);

router.route("/:id").get(protect, getEmloyee).delete(protect, deleteEmployee);

module.exports = router;
