const mongoose = require("mongoose");
const validator = require("validator");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    unique: [true, "This email address is already taken. Please try another"],
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "Please provide a valid email address",
    },
  },
  totalSales: {
    type: Number,
    required: [true, "Total Sales is required"],
  },
  joining: {
    type: Date,
    default: Date.now(),
  },
});

const employeeModel = mongoose.model("Employee", employeeSchema);

module.exports = employeeModel;
